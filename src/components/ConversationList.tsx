import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Conversation } from '../types';
import { groupConversationsByDate } from '../lib/utils';

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  search: string;
  collapsed: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  search,
  collapsed,
  onSelect,
  onRename,
  onDelete,
}: Props) {
  const [menuId, setMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? conversations.filter((c) => c.title.toLowerCase().includes(search.trim().toLowerCase()))
    : conversations;

  const groups = groupConversationsByDate(filtered);

  useEffect(() => {
    if (editingId) inputRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    const close = () => setMenuId(null);
    if (menuId) {
      window.addEventListener('click', close);
      return () => window.removeEventListener('click', close);
    }
  }, [menuId]);

  const startEdit = (c: Conversation) => {
    setEditingId(c.id);
    setEditValue(c.title);
    setMenuId(null);
  };

  const commitEdit = () => {
    if (editingId) {
      onRename(editingId, editValue);
      setEditingId(null);
    }
  };

  if (collapsed) return null;

  if (filtered.length === 0) {
    return (
      <div className="px-3 py-6 text-center text-sm text-[var(--color-muted)]">
        {search ? 'No conversations found' : 'No conversations yet'}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 pb-2">
      {groups.map(({ label, items }) => (
        <div key={label} className="mb-3">
          <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
            {label}
          </div>
          <ul className="space-y-0.5">
            {items.map((c) => (
              <li key={c.id} className="relative group">
                {editingId === c.id ? (
                  <input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="w-full rounded-lg border border-[var(--color-primary)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm focus:outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelect(c.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      activeId === c.id
                        ? 'bg-[var(--color-border)] text-[var(--color-foreground)] font-medium'
                        : 'text-[var(--color-foreground)] hover:bg-[var(--color-border-subtle)]'
                    }`}
                  >
                    <span className="flex-1 truncate">{c.title}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuId(menuId === c.id ? null : c.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          setMenuId(menuId === c.id ? null : c.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-0.5 rounded hover:bg-[var(--color-border)] transition-opacity"
                      aria-label="Conversation options"
                    >
                      <MoreHorizontal className="h-4 w-4 text-[var(--color-muted)]" />
                    </span>
                  </button>
                )}
                {menuId === c.id && (
                  <div
                    className="absolute right-2 top-9 z-20 w-36 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-1 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-border-subtle)]"
                      onClick={() => startEdit(c)}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Rename
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-border-subtle)]"
                      onClick={() => {
                        setMenuId(null);
                        onDelete(c.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
