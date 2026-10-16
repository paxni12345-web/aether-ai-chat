import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Send, Paperclip, Square, Wrench } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export function MessageComposer({ onSend, onStop, isGenerating, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !isGenerating && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    const text = value;
    setValue('');
    onSend(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 shadow-sm focus-within:border-[var(--color-primary)]/50 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/15 transition-shadow">
          <button
            type="button"
            className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-foreground)] transition-colors"
            aria-label="Attach file"
            title="Attach (demo)"
            disabled
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-foreground)] transition-colors"
            aria-label="Tools"
            title="Tools (demo)"
            disabled
          >
            <Wrench className="h-4 w-4" />
          </button>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            disabled={disabled}
            className="max-h-[200px] min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-relaxed text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none"
            aria-label="Message input"
          />
          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-foreground)] text-[var(--color-surface)] hover:opacity-90 transition-opacity"
              aria-label="Stop generating"
              title="Stop"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white transition-all disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)]"
              aria-label="Send message"
              title="Send (Enter)"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[11px] text-[var(--color-muted)]">
          Enter to send · Shift+Enter for new line · Demo mode
        </p>
      </div>
    </div>
  );
}
