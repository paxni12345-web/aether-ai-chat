import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 id="settings-title" className="text-base font-semibold">Settings</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-border-subtle)]"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4 text-sm">
          <div>
            <h3 className="font-medium text-[var(--color-foreground)]">About Aether</h3>
            <p className="mt-1 text-[var(--color-muted)]">
              Premium AI chat interface running in <strong>demo mode</strong>. Responses are simulated locally — no external AI API is connected.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[var(--color-foreground)]">Persistence</h3>
            <p className="mt-1 text-[var(--color-muted)]">
              Conversations are stored in your browser&apos;s localStorage and restore after refresh.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[var(--color-foreground)]">Integrating a real model</h3>
            <p className="mt-1 text-[var(--color-muted)]">
              Replace <code className="rounded bg-[var(--color-border-subtle)] px-1 text-xs">generateDemoResponse</code> in{' '}
              <code className="rounded bg-[var(--color-border-subtle)] px-1 text-xs">src/services/aiService.ts</code> with your preferred API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
