const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const MAX_REQUESTS = 10
const WINDOW_MS = 60 * 1000 // 1 minute

export function checkRateLimit(ip: string): {
    allowed: boolean
    remaining: number
    retryAfterMs: number
} {
    const now = Date.now()
    const entry = rateLimitMap.get(ip)

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
        return { allowed: true, remaining: MAX_REQUESTS - 1, retryAfterMs: 0 }
    }

    if (entry.count >= MAX_REQUESTS) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterMs: entry.resetTime - now,
        }
    }

    entry.count++
    return {
        allowed: true,
        remaining: MAX_REQUESTS - entry.count,
        retryAfterMs: 0,
    }
}
