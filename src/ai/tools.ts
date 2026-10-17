import { z } from 'zod';
import { AiError, bounded } from './bounded';

const contextSchema = z.object({ tenantId: z.string().min(1).max(100),
  merchantId: z.number().int().positive(), integrationId: z.string().min(1).max(100) }).strict();
export type ToolContext = Readonly<z.infer<typeof contextSchema>>;
const money = z.object({ amount: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  currency: z.string().regex(/^[A-Z]{3}$/) }).strict();
const item = z.object({ source_id: z.number().int().positive(), variation_id: z.number().int().positive().optional(),
  quantity: z.number().int().min(1).max(100) }).strict();
export const catalogSearchInput = z.object({ query: z.string().min(1).max(200),
  limit: z.number().int().min(1).max(20).default(5) }).strict();
export const catalogSearchOutput = z.object({ items: z.array(z.object({ source_id: z.number().int().positive(),
  variation_id: z.number().int().positive().optional(), title: z.string().min(1).max(500),
  price: money, availability: z.enum(['available', 'unavailable']), revision: z.number().int().positive()
}).strict()).max(20) }).strict();
export const checkoutQuoteInput = z.object({ items: z.array(item).min(1).max(20),
  destination: z.object({ country: z.string().regex(/^[A-Z]{2}$/), postal_code: z.string().min(1).max(20)
  }).strict().optional() }).strict();
export const checkoutQuoteOutput = z.object({ quote_id: z.string().min(1).max(200),
  version: z.string().min(1).max(200), expires_at: z.string().datetime(), total: money,
  requires_confirmation: z.literal(true) }).strict();
type Search = z.output<typeof catalogSearchInput>;
type Quote = z.output<typeof checkoutQuoteInput>;

export interface CommerceToolServices {
  /** Resolve trusted context from credentials on the server, never from model arguments. */
  authorize(accessToken: string, signal: AbortSignal): Promise<unknown>;
  search(context: ToolContext, input: Search, signal: AbortSignal): Promise<unknown>;
  quote(context: ToolContext, input: Quote, signal: AbortSignal): Promise<unknown>;
}

/** Allowlist contains no complete, pay, create_order or refund operation. */
export class CommerceTools {
  constructor(private readonly services: CommerceToolServices, private readonly timeoutMs = 5_000) {}
  async execute(accessToken: string, name: string, input: unknown, signal?: AbortSignal) {
    if (name !== 'catalog_search' && name !== 'checkout_quote') throw new AiError('tool_not_allowed');
    if (!accessToken || accessToken.length > 4096) throw new AiError('invalid_context');
    const schema = name === 'catalog_search' ? catalogSearchInput : checkoutQuoteInput;
    const args = schema.safeParse(input);
    if (!args.success) throw new AiError('tool_input_invalid');
    try {
      return await bounded(async child => {
        const context = contextSchema.safeParse(await this.services.authorize(accessToken, child));
        if (!context.success) throw new AiError('invalid_context');
        if (child.aborted) throw new AiError('request_aborted');
        const trusted = Object.freeze(context.data);
        let raw: unknown;
        if (name === 'catalog_search') {
          const query = catalogSearchInput.parse(args.data);
          raw = await this.services.search(trusted, query, child);
          const result = catalogSearchOutput.safeParse(raw);
          if (!result.success || result.data.items.length > query.limit) throw new AiError('tool_output_invalid');
          return result.data;
        }
        raw = await this.services.quote(trusted, checkoutQuoteInput.parse(args.data), child);
        const result = checkoutQuoteOutput.safeParse(raw);
        if (!result.success) throw new AiError('tool_output_invalid');
        return result.data;
      }, this.timeoutMs, signal);
    } catch (error) {
      if (error instanceof AiError) throw error;
      throw new AiError('tool_failed');
    }
  }
}
