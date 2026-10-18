const buckets = [10, 25, 50, 100, 250, 500, 1000, 5000] as const;

type RouteStats = { requests: number; serverErrors: number; durationMs: number; maxDurationMs: number; buckets: number[] };

/** Process-local, bounded-cardinality metrics. Route templates are used as labels. */
export class RequestMetrics {
  private readonly routes = new Map<string, RouteStats>();

  observe(method: string, route: string, statusCode: number, durationMs: number) {
    const key = `${method} ${route} ${Math.floor(statusCode / 100)}xx`;
    let stats = this.routes.get(key);
    if (!stats) {
      stats = { requests: 0, serverErrors: 0, durationMs: 0, maxDurationMs: 0, buckets: buckets.map(() => 0).concat(0) };
      this.routes.set(key, stats);
    }
    stats.requests++;
    if (statusCode >= 500) stats.serverErrors++;
    const elapsed = Math.max(0, durationMs);
    stats.durationMs += elapsed;
    stats.maxDurationMs = Math.max(stats.maxDurationMs, elapsed);
    const found = buckets.findIndex(limit => elapsed <= limit);
    stats.buckets[found >= 0 ? found : buckets.length]++;
  }

  snapshot() {
    return {
      scope: 'current_process',
      bucketsMs: [...buckets, '+Inf'],
      routes: [...this.routes.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([route, stats]) => ({
        route,
        requests: stats.requests,
        serverErrors: stats.serverErrors,
        averageDurationMs: Number((stats.durationMs / stats.requests).toFixed(2)),
        maxDurationMs: Number(stats.maxDurationMs.toFixed(2)),
        durationBuckets: [...stats.buckets]
      }))
    };
  }
}
