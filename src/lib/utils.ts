import { v4 as uuidv4 } from 'uuid';

export function uid(): string {
  return uuidv4();
}

export function groupConversationsByDate<T extends { updatedAt: number }>(
  items: T[]
): { label: string; items: T[] }[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOfWeek = startOfToday - 7 * 86400000;

  const groups: Record<string, T[]> = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  };

  for (const item of items) {
    if (item.updatedAt >= startOfToday) groups.Today.push(item);
    else if (item.updatedAt >= startOfYesterday) groups.Yesterday.push(item);
    else if (item.updatedAt >= startOfWeek) groups['Previous 7 Days'].push(item);
    else groups.Older.push(item);
  }

  return Object.entries(groups)
    .filter(([, list]) => list.length > 0)
    .map(([label, list]) => ({ label, items: list }));
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

/** Very lightweight markdown-ish rendering for demo */
export function renderSimpleMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html
    .split(/\n\n+/)
    .map((p) => {
      if (p.startsWith('<pre') || p.startsWith('<ul') || p.startsWith('<ol')) return p;
      return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');

  return html;
}
