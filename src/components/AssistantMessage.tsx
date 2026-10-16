import { Sparkles } from 'lucide-react';
import type { Message } from '../types';
import { renderSimpleMarkdown } from '../lib/utils';
import { ResponseActions } from './ResponseActions';

interface Props {
  message: Message;
  isGenerating: boolean;
  onRegenerate: () => void;
  onLike: (liked: boolean | null) => void;
}

export function AssistantMessage({ message, isGenerating, onRegenerate, onLike }: Props) {
  const isStreaming = message.status === 'streaming';
  const isError = message.status === 'error';
  const isStopped = message.status === 'stopped';
  const showActions = message.status === 'complete' || isStopped;

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        {isStreaming && !message.content ? (
          <div className="flex items-center gap-1.5 py-2" aria-live="polite" aria-label="Generating response">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
          </div>
        ) : (
          <div
            className="prose-chat text-[15px] leading-relaxed text-[var(--color-foreground)]"
            dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(message.content) }}
          />
        )}
        {isError && (
          <p className="mt-1 text-sm text-[var(--color-danger)]" role="alert">
            {message.error || 'Failed to generate response.'}
          </p>
        )}
        {isStopped && message.content && (
          <p className="mt-1 text-xs text-[var(--color-muted)]">Generation stopped</p>
        )}
        {showActions && (
          <ResponseActions
            content={message.content}
            liked={message.liked}
            onRegenerate={onRegenerate}
            onLike={onLike}
            disabled={isGenerating}
          />
        )}
      </div>
    </div>
  );
}
