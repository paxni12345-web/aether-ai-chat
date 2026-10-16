import { useCallback, useEffect, useRef, useState } from 'react';
import type { Conversation, Message, AppSettings, ModelId } from '../types';
import {
  loadConversations,
  saveConversations,
  loadActiveId,
  saveActiveId,
  loadSettings,
  saveSettings,
} from '../lib/storage';
import { uid } from '../lib/utils';
import { generateDemoResponse } from '../services/aiService';

function titleFromPrompt(prompt: string): string {
  const clean = prompt.trim().replace(/\s+/g, ' ');
  return clean.length > 48 ? clean.slice(0, 48) + '…' : clean || 'New conversation';
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>({ model: 'aether-demo', sidebarCollapsed: false });
  const [isGenerating, setIsGenerating] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const convs = loadConversations();
    const active = loadActiveId();
    const s = loadSettings();
    setConversations(convs);
    setSettings(s);
    if (active && convs.some((c) => c.id === active)) {
      setActiveId(active);
    } else if (convs.length > 0) {
      setActiveId(convs[0].id);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveConversations(conversations);
  }, [conversations, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveActiveId(activeId);
  }, [activeId, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveSettings(settings);
  }, [settings, hydrated]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const createConversation = useCallback(() => {
    const now = Date.now();
    const conv: Conversation = {
      id: uid(),
      title: 'New conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    return conv.id;
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: title.trim() || 'Untitled', updatedAt: Date.now() } : c))
    );
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          setActiveId(next[0]?.id ?? null);
        }
        return next;
      });
    },
    [activeId]
  );

  const stopGenerating = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
  }, []);

  const sendMessage = useCallback(
    async (text: string, conversationId?: string) => {
      const trimmed = text.trim();
      if (!trimmed || isGenerating) return;

      let convId = conversationId ?? activeId;
      if (!convId) {
        convId = createConversation();
      }

      const userMsg: Message = {
        id: uid(),
        role: 'user',
        content: trimmed,
        status: 'complete',
        createdAt: Date.now(),
      };

      const assistantMsg: Message = {
        id: uid(),
        role: 'assistant',
        content: '',
        status: 'streaming',
        createdAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const isFirst = c.messages.length === 0;
          return {
            ...c,
            title: isFirst ? titleFromPrompt(trimmed) : c.title,
            messages: [...c.messages, userMsg, assistantMsg],
            updatedAt: Date.now(),
          };
        })
      );
      setActiveId(convId);

      const controller = new AbortController();
      abortRef.current = controller;
      setIsGenerating(true);

      try {
        const final = await generateDemoResponse({
          prompt: trimmed,
          signal: controller.signal,
          onChunk: (chunk) => {
            setConversations((prev) =>
              prev.map((c) => {
                if (c.id !== convId) return c;
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsg.id ? { ...m, content: chunk, status: 'streaming' } : m
                  ),
                };
              })
            );
          },
        });

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsg.id ? { ...m, content: final, status: 'complete' } : m
              ),
              updatedAt: Date.now(),
            };
          })
        );
      } catch (err) {
        const isAbort = err instanceof DOMException && err.name === 'AbortError';
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsg.id,
                    ? {
                        ...m,
                        status: isAbort ? 'stopped' : 'error',
                        error: isAbort ? undefined : 'Something went wrong. Please try again.',
                        content: isAbort ? m.content || 'Generation stopped.' : m.content,
                      }
                    : m
                ),
            };
          })
        );
      } finally {
        abortRef.current = null;
        setIsGenerating(false);
      }
    },
    [activeId, isGenerating, createConversation]
  );

  const regenerate = useCallback(
    async (messageId: string) => {
      if (!activeConversation || isGenerating) return;
      const msgs = activeConversation.messages;
      const idx = msgs.findIndex((m) => m.id === messageId);
      if (idx < 0 || msgs[idx].role !== 'assistant') return;

      let userContent = '';
      for (let i = idx - 1; i >= 0; i--) {
        if (msgs[i].role === 'user') {
          userContent = msgs[i].content;
          break;
        }
      }
      if (!userContent) return;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversation.id) return c;
          return { ...c, messages: c.messages.filter((m) => m.id !== messageId) };
        })
      );

      await new Promise((r) => setTimeout(r, 50));
      await sendMessage(userContent, activeConversation.id);
    },
    [activeConversation, isGenerating, sendMessage]
  );

  const setLiked = useCallback((messageId: string, liked: boolean | null) => {
    setConversations((prev) =>
      prev.map((c) => ({
        ...c,
        messages: c.messages.map((m) => (m.id === messageId ? { ...m, liked } : m)),
      }))
    );
  }, []);

  const setModel = useCallback((model: ModelId) => {
    setSettings((s) => ({ ...s, model }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSettings((s) => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed }));
  }, []);

  return {
    conversations,
    activeConversation,
    activeId,
    settings,
    isGenerating,
    hydrated,
    createConversation,
    selectConversation,
    renameConversation,
    deleteConversation,
    sendMessage,
    stopGenerating,
    regenerate,
    setLiked,
    setModel,
    toggleSidebar
  };
}
