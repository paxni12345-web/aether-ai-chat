/**
 * Demo AI service — simulates realistic streaming responses.
 * Replace generateDemoResponse with a real API call later.
 */

const DEMO_RESPONSES: Record<string, string> = {
  default: `Here's a thoughtful response to your question.\n\nI can help with a wide range of tasks:\n\n- **Explain** complex topics in plain language\n- **Write & improve** content, emails, or documentation\n- **Brainstorm** ideas and structure projects\n- **Analyze** information and extract key insights\n\nFeel free to ask follow-up questions or refine what you need.`,

  code: `Here's a clean TypeScript example:\n\n\`\`\`typescript\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nasync function fetchUser(id: string): Promise<User> {\n  const res = await fetch(\`/api/users/\${id}\`);\n  if (!res.ok) throw new Error('User not found');\n  return res.json();\n}\n\`\`\`\n\nKey points:\n1. Strong typing prevents common runtime errors\n2. Explicit error handling makes failures visible\n3. Async/await keeps the flow readable`,

  summarize: `**Summary of key points:**\n\n1. The main idea centers on clarity and structure.\n2. Supporting details reinforce the core argument.\n3. Practical next steps emerge from the analysis.\n\nWould you like me to expand on any of these points?`,

  ideas: `Here are several directions you could explore:\n\n1. **Simplify the onboarding flow** — reduce friction in the first 60 seconds\n2. **Add progressive disclosure** — show advanced options only when needed\n3. **Instrument key actions** — measure where users drop off\n4. **Ship a minimal viable loop** — get feedback before expanding scope\n\nWhich of these resonates most with your current priorities?`,
};

function pickResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('code') || lower.includes('function') || lower.includes('typescript') || lower.includes('react')) {
    return DEMO_RESPONSES.code;
  }
  if (lower.includes('summar') || lower.includes('key point') || lower.includes('analy')) {
    return DEMO_RESPONSES.summarize;
  }
  if (lower.includes('idea') || lower.includes('brainstorm') || lower.includes('project')) {
    return DEMO_RESPONSES.ideas;
  }
  return DEMO_RESPONSES.default;
}

export interface GenerateOptions {
  prompt: string;
  signal?: AbortSignal;
  onChunk?: (text: string) => void;
}

export async function generateDemoResponse(options: GenerateOptions): Promise<string> {
  const full = pickResponse(options.prompt);
  const words = full.split(/(\s+)/);
  let accumulated = '';

  for (const word of words) {
    if (options.signal?.aborted) {
      throw new DOMException('Generation stopped', 'AbortError');
    }
    accumulated += word;
    options.onChunk?.(accumulated);
    const delay = word.trim().length === 0 ? 8 : 18 + Math.random() * 28;
    await new Promise((r) => setTimeout(r, delay));
  }

  return accumulated;
}
