import { useState } from 'react';
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  content: string;
  liked?: boolean | null;
  onRegenerate: () => void;
  onLike: (liked: boolean | null) => void;
  disabled?: boolean;
}

export function ResponseActions({ content, liked, onRegenerate, onLike, disabled }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const btn =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-foreground)] transition-colors disabled:opacity-40 disabled:pointer-events-none';

  return (
    <div className="mt-2 flex items-center gap-0.5">
      <button type="button" className={btn} onClick={handleCopy} aria-label="Copy response" title="Copy">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        className={btn}
        onClick={onRegenerate}
        disabled={disabled}
        aria-label="Regenerate response"
        title="Regenerate"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={`${btn} ${liked === true ? 'text-[var(--color-primary)]' : ''}`}
        onClick={() => onLike(liked === true ? null : true)}
        aria-label="Like response"
        title="Like"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={`${btn} ${liked === false ? 'text-[var(--color-danger)]' : ''}`}
        onClick={() => onLike(liked === false ? null : false)}
        aria-label="Dislike response"
        title="Dislike"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
      {copied && (
        <span className="ml-2 text-xs text-[var(--color-muted)]" role="status">
          Copied
        </span>
      )}
    </div>
  );
}
