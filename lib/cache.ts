// Simple in-memory cache for API responses
interface CacheItem {
    data: any
    timestamp: number
}

class SimpleCache {
    private cache: Map<string, CacheItem> = new Map()
    private ttl: number = 5 * 60 * 1000 // 5 minutes

    set(key: string, data: any): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        })
    }

    get(key: string): any | null {
        const item = this.cache.get(key)
        if (!item) return null

        // Check if expired
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key)
            return null
        }

        return item.data
    }

    clear(): void {
        this.cache.clear()
    }

    // Clear expired items
    cleanup(): void {
        const now = Date.now()
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > this.ttl) {
                this.cache.delete(key)
            }
        }
    }
}

export const apiCache = new SimpleCache()

// Cleanup expired cache items every 5 minutes
if (typeof window !== "undefined") {
    setInterval(() => {
        apiCache.cleanup()
    }, 5 * 60 * 1000)
}
