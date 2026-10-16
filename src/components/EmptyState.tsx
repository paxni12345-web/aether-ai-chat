import { Sparkles, BookOpen, PenLine, Lightbulb, BarChart3 } from 'lucide-react';

const SUGGESTIONS = [
  { icon: BookOpen, text: 'Help me understand a difficult topic.' },
  { icon: PenLine, text: 'Write and improve my content.' },
  { icon: Lightbulb, text: 'Generate ideas for a project.' },
  { icon: BarChart3, text: 'Analyze information and summarize key points.' },
];

interface Props {
  onSelect: (prompt: string) => void;
}

export function EmptyState({ onSelect }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
        <Sparkles className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h1 className="text-center text-xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-2xl">
        What would you like to explore?
      </h1>
      <p className="mt-2 max-w-md text-center text-sm text-[var(--color-muted)]">
        Ask anything — explanations, writing help, ideas, or analysis. Responses are generated in demo mode.
      </p>
      <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map(({ icon: Icon, text }) => (
          <button
            key={text}
            type="button"
            onClick={() => onSelect(text)}
            className="group flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 text-left transition-all hover:border-[var(--color-primary)]/40 hover:shadow-sm"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
            <span className="text-sm leading-snug text-[var(--color-foreground)]">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
