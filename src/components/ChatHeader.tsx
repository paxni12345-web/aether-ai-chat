import { Menu, ChevronDown } from 'lucide-react';
import type { ModelId } from '../types';

const MODELS: { id: ModelId; label: string }[] = [
  { id: 'aether-demo', label: 'Aether Demo' },
  { id: 'aether-fast', label: 'Aether Fast' },
  { id: 'aether-think', label: 'Aether Think' },
];

interface Props {
  title: string;
  model: ModelId;
  onModelChange: (m: ModelId) => void;
  onOpenSidebar: () => void;
}

export function ChatHeader({ title, model, onModelChange, onOpenSidebar }: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-border-subtle)]"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="flex-1 truncate text-sm font-medium text-[var(--color-foreground)]">
        {title || 'New conversation'}
      </h1>

      <div className="relative">
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value as ModelId)}
          className="appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-1.5 pl-3 pr-8 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 cursor-pointer"
          aria-label="Select model"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
      </div>
    </header>
  );
}
