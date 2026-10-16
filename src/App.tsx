import { useState, useCallback } from 'react';
import { useChat } from './hooks/useChat';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { EmptyState } from './components/EmptyState';
import { MessageList } from './components/MessageList';
import { MessageComposer } from './components/MessageComposer';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { SettingsDialog } from './components/SettingsDialog';

export default function App() {
  const chat = useChat();
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      chat.deleteConversation(deleteTarget);
      setDeleteTarget(null);
    }
  }, [deleteTarget, chat]);

  if (!chat.hydrated) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--color-surface)]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  const messages = chat.activeConversation?.messages ?? [];
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        conversations={chat.conversations}
        activeId={chat.activeId}
        collapsed={chat.settings.sidebarCollapsed}
        mobileOpen={mobileSidebar}
        onCloseMobile={() => setMobileSidebar(false)}
        onNewChat={chat.createConversation}
        onSelect={chat.selectConversation}
        onRename={chat.renameConversation}
        onDeleteRequest={setDeleteTarget}
        onToggleCollapse={chat.toggleSidebar}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          title={chat.activeConversation?.title ?? 'New conversation'}
          model={chat.settings.model}
          onModelChange={chat.setModel}
          onOpenSidebar={() => setMobileSidebar(true)}
        />

        {hasMessages ? (
          <MessageList
            messages={messages}
            isGenerating={chat.isGenerating}
            onRegenerate={chat.regenerate}
            onLike={chat.setLiked}
          />
        ) : (
          <EmptyState onSelect={(prompt) => chat.sendMessage(prompt)} />
        )}

        <MessageComposer
          onSend={chat.sendMessage}
          onStop={chat.stopGenerating}
          isGenerating={chat.isGenerating}
        />
      </main>

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete conversation?"
        description="This will permanently delete the conversation and all of its messages. This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
