import type { Conversation, AppSettings } from '../types';

const CONVERSATIONS_KEY = 'aether_conversations';
const SETTINGS_KEY = 'aether_settings';
const ACTIVE_ID_KEY = 'aether_active_id';

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations', e);
  }
}

export function loadActiveId(): string | null {
  return localStorage.getItem(ACTIVE_ID_KEY);
}

export function saveActiveId(id: string | null): void {
  if (id) localStorage.setItem(ACTIVE_ID_KEY, id);
  else localStorage.removeItem(ACTIVE_ID_KEY);
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { model: 'aether-demo', sidebarCollapsed: false };
    return { model: 'aether-demo', sidebarCollapsed: false, ...JSON.parse(raw) };
  } catch {
    return { model: 'aether-demo', sidebarCollapsed: false };
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}
