import { performance } from 'node:perf_hooks';
import { z } from 'zod';
import { AiError, bounded } from './bounded';

export const providerNames = ['gpt', 'gemini'] as const;
export const toolNames = ['catalog_search', 'checkout_quote'] as const;
const messagesSchema = z.array(z.object({ role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(16_000) }).strict()).min(1).max(40);
const requestSchema = z.object({ messages: messagesSchema }).strict();
export const responseSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('answer'), text: z.string().min(1).max(16_000) }).strict(),
  z.object({ kind: z.literal('tool_call'), name: z.enum(toolNames), arguments: z.unknown() }).strict()
]);
const configSchema = z.object({ provider: z.enum(providerNames), model: z.string().min(1).max(100),
  timeoutMs: z.number().int().min(1).max(120_000).default(15_000) }).strict();

export interface AiProvider {
  readonly name: typeof providerNames[number];
  generate(input: { model: string; messages: z.infer<typeof messagesSchema>;
    allowedTools: readonly string[]; signal: AbortSignal }): Promise<unknown>;
}
export type AiConfig = z.input<typeof configSchema>;

export function configFromEnvironment(env: Record<string, string | undefined>): AiConfig {
  const result = configSchema.safeParse({ provider: env.BOOPAY_AI_PROVIDER, model: env.BOOPAY_AI_MODEL,
    timeoutMs: env.BOOPAY_AI_TIMEOUT_MS === undefined ? undefined : Number(env.BOOPAY_AI_TIMEOUT_MS) });
  if (!result.success) throw new AiError('invalid_request');
  return result.data;
}

/** No provider is implicitly installed; selecting an absent provider fails closed. */
export class AiService {
  private readonly adapters = new Map<string, AiProvider>();
  private readonly config: z.output<typeof configSchema>;
  constructor(adapters: readonly AiProvider[], config: AiConfig) {
    const parsed = configSchema.safeParse(config);
    if (!parsed.success) throw new AiError('invalid_request');
    this.config = Object.freeze(parsed.data);
    for (const adapter of adapters) {
      if (!providerNames.includes(adapter.name) || this.adapters.has(adapter.name))
        throw new AiError('invalid_request');
      this.adapters.set(adapter.name, adapter);
    }
  }
  async generate(input: unknown, signal?: AbortSignal) {
    const request = requestSchema.safeParse(input);
    if (!request.success) throw new AiError('invalid_request');
    const adapter = this.adapters.get(this.config.provider);
    if (!adapter) throw new AiError('provider_unavailable');
    const started = performance.now();
    let raw: unknown;
    try {
      raw = await bounded(child => adapter.generate({ model: this.config.model,
        messages: request.data.messages, allowedTools: toolNames, signal: child }), this.config.timeoutMs, signal);
    } catch (error) {
      if (error instanceof AiError && ['provider_timeout', 'request_aborted'].includes(error.code)) throw error;
      throw new AiError('provider_failed');
    }
    const parsed = responseSchema.safeParse(raw);
    if (!parsed.success) throw new AiError('invalid_response');
    return { provider: this.config.provider, model: this.config.model,
      latency_ms: Math.round(performance.now() - started), response: parsed.data };
  }
}
