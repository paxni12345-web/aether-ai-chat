import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

interface Props {
  messages: Message[];
  isGenerating: boolean;
  onRegenerate: (messageId: string) => void;
  onLike: (messageId: string, liked: boolean | null) => void;
}

export function MessageList({ messages, isGenerating, onRegenerate, onLike }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      userScrolledUp.current = distFromBottom > 120;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        {messages.map((m) =>
          m.role === 'user' ? (
            <UserMessage key={m.id} content={m.content} />
          ) : (
            <AssistantMessage
              key={m.id}
              message={m}
              isGenerating={isGenerating}
              onRegenerate={() => onRegenerate(m.id)}
              onLike={(liked) => onLike(m.id, liked)}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
