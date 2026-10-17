export type AiErrorCode = 'invalid_request' | 'invalid_response' | 'provider_unavailable' |
  'provider_timeout' | 'request_aborted' | 'provider_failed' | 'tool_not_allowed' |
  'tool_input_invalid' | 'tool_output_invalid' | 'invalid_context' | 'tool_failed';

export class AiError extends Error {
  constructor(public readonly code: AiErrorCode) { super(code); }
}

/** Bounds the caller's wait even when an adapter ignores AbortSignal. Late results are discarded. */
export function bounded<T>(operation: (signal: AbortSignal) => Promise<T>, timeoutMs: number,
  parent?: AbortSignal): Promise<T> {
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 120_000)
    return Promise.reject(new AiError('invalid_request'));
  if (parent?.aborted) return Promise.reject(new AiError('request_aborted'));
  return new Promise<T>((resolve, reject) => {
    const controller = new AbortController();
    let settled = false;
    const cleanup = () => { clearTimeout(timer); parent?.removeEventListener('abort', abort); };
    const fail = (error: unknown) => { if (!settled) { settled = true; cleanup(); reject(error); } };
    const abort = () => { fail(new AiError('request_aborted')); controller.abort('request_aborted'); };
    const timer = setTimeout(() => {
      fail(new AiError('provider_timeout')); controller.abort('provider_timeout');
    }, timeoutMs);
    parent?.addEventListener('abort', abort, { once: true });
    Promise.resolve().then(() => {
      if (settled) throw new AiError('request_aborted');
      return operation(controller.signal);
    }).then(result => {
      if (!settled) { settled = true; cleanup(); resolve(result); }
    }, fail);
  });
}
