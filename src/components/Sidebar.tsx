import { useState } from 'react';
import {
  Plus,
  Search,
  PanelLeftClose,
  PanelLeft,
  Settings,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import type { Conversation } from '../types';
import { ConversationList } from './ConversationList';

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDeleteRequest: (id: string) => void;
  onToggleCollapse: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  collapsed,
  mobileOpen,
  onCloseMobile,
  onNewChat,
  onSelect,
  onRename,
  onDeleteRequest,
  onToggleCollapse,
  onOpenSettings,
}: Props) {
  const [search, setSearch] = useState('');

  const handleSelect = (id: string) => {
    onSelect(id);
    onCloseMobile();
  };

  const content = (
    <div
      className={`flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar)] transition-all duration-200 ${
        collapsed ? 'w-[60px]' : 'w-[260px]'
      }`}
    >
      <div className={`flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-3 ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm tracking-tight truncate">Aether</span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-foreground)] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-border-subtle)]"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className={`px-3 pt-3 ${collapsed ? 'px-2' : ''}`}>
        <button
          type="button"
          onClick={() => {
            onNewChat();
            onCloseMobile();
          }}
          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-white font-medium text-sm transition-colors hover:bg-[var(--color-primary-hover)] ${
            collapsed ? 'h-10 w-10 mx-auto' : 'h-10 px-3'
          }`}
          aria-label="New chat"
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span>New chat</span>}
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-2 pl-9 pr-3 text-sm placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30"
              aria-label="Search conversations"
            />
          </div>
        </div>
      )}

      <div className="mt-2 flex-1 overflow-hidden">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          search={search}
          collapsed={collapsed}
          onSelect={handleSelect}
          onRename={onRename}
          onDelete={onDeleteRequest}
        />
      </div>

      <div className={`border-t border-[var(--color-border)] p-3 ${collapsed ? 'flex flex-col items-center gap-1' : ''}`}>
        <button
          type="button"
          onClick={onOpenSettings}
          className={`flex items-center gap-2 rounded-lg text-sm text-[var(--color-muted)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-foreground)] transition-colors ${
            collapsed ? 'h-9 w-9 justify-center' : 'w-full px-3 py-2'
          }`}
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span>Settings</span>}
        </button>
        <div
          className={`flex items-center gap-2 rounded-lg text-sm text-[var(--color-muted)] ${
            collapsed ? 'h-9 w-9 justify-center' : 'w-full px-3 py-2'
          }`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-border)]">
            <User className="h-3.5 w-3.5" />
          </div>
          {!collapsed && <span className="truncate">Demo User</span>}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex h-full shrink-0">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} aria-hidden />
          <aside className="absolute left-0 top-0 h-full shadow-xl">{content}</aside>
        </div>
      )}
    </>
  );
}
