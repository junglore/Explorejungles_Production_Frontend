/**
 * Cache Service for Podcast Data and API Responses
 * Implements in-memory and localStorage caching with TTL support
 */

class CacheService {
    constructor() {
        this.memoryCache = new Map();
        this.cacheConfig = {
            // Cache TTL in milliseconds
            podcast_list: 30 * 1000,          // 30 seconds
            podcast_detail: 2 * 60 * 1000,    // 2 minutes
            podcast_carousel: 30 * 1000,      // 30 seconds (faster updates for admin)
            media_metadata: 5 * 60 * 1000,    // 5 minutes
            search_results: 1 * 60 * 1000,    // 1 minute
            default: 2 * 60 * 1000            // 2 minutes default
        };

        // Initialize localStorage cleanup
        this.initializeCleanup();
    }

    /**
     * Generate cache key from parameters
     */
    generateKey(prefix, params = {}) {
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((result, key) => {
                result[key] = params[key];
                return result;
            }, {});

        const paramString = JSON.stringify(sortedParams);
        return `${prefix}:${btoa(paramString)}`;
    }

    /**
     * Get data from cache (memory first, then localStorage)
     */
    get(key, useLocalStorage = true) {
        // Check memory cache first
        const memoryItem = this.memoryCache.get(key);
        if (memoryItem && !this.isExpired(memoryItem)) {
            return memoryItem.data;
        }

        // Check localStorage if enabled
        if (useLocalStorage) {
            try {
                const localItem = localStorage.getItem(`junglore_cache_${key}`);
                if (localItem) {
                    const parsed = JSON.parse(localItem);
                    if (!this.isExpired(parsed)) {
                        // Restore to memory cache
                        this.memoryCache.set(key, parsed);
                        return parsed.data;
                    } else {
                        // Remove expired item
                        localStorage.removeItem(`junglore_cache_${key}`);
                    }
                }
            } catch (error) {
                console.warn('Failed to read from localStorage cache:', error);
            }
        }

        return null;
    }

    /**
     * Set data in cache (both memory and localStorage)
     */
    set(key, data, ttl = null, useLocalStorage = true) {
        const cacheType = key.split(':')[0];
        const actualTtl = ttl || this.cacheConfig[cacheType] || this.cacheConfig.default;

        const cacheItem = {
            data,
            timestamp: Date.now(),
            ttl: actualTtl,
            expires: Date.now() + actualTtl
        };

        // Set in memory cache
        this.memoryCache.set(key, cacheItem);

        // Set in localStorage if enabled and data is serializable
        if (useLocalStorage) {
            try {
                // Only cache if data is not too large (< 1MB)
                const serialized = JSON.stringify(cacheItem);
                if (serialized.length < 1024 * 1024) {
                    localStorage.setItem(`junglore_cache_${key}`, serialized);
                }
            } catch (error) {
                console.warn('Failed to write to localStorage cache:', error);
            }
        }
    }

    /**
     * Check if cache item is expired
     */
    isExpired(cacheItem) {
        return Date.now() > cacheItem.expires;
    }

    /**
     * Remove specific key from cache
     */
    remove(key) {
        this.memoryCache.delete(key);
        try {
            localStorage.removeItem(`junglore_cache_${key}`);
        } catch (error) {
            console.warn('Failed to remove from localStorage cache:', error);
        }
    }

    /**
     * Clear all cache with optional prefix filter
     */
    clear(prefix = null) {
        if (prefix) {
            // Clear specific prefix
            for (const key of this.memoryCache.keys()) {
                if (key.startsWith(prefix)) {
                    this.memoryCache.delete(key);
                }
            }

            // Clear from localStorage
            try {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(`junglore_cache_${prefix}`)) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
            } catch (error) {
                console.warn('Failed to clear localStorage cache:', error);
            }
        } else {
            // Clear all
            this.memoryCache.clear();
            try {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('junglore_cache_')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
            } catch (error) {
                console.warn('Failed to clear localStorage cache:', error);
            }
        }
    }

    /**
     * Get or set pattern - fetch data if not cached
     */
    async getOrSet(key, fetchFunction, ttl = null, useLocalStorage = true) {
        const cached = this.get(key, useLocalStorage);
        if (cached !== null) {
            return cached;
        }

        try {
            const data = await fetchFunction();
            this.set(key, data, ttl, useLocalStorage);
            return data;
        } catch (error) {
            console.error('Failed to fetch data for cache:', error);
            throw error;
        }
    }

    /**
     * Initialize cleanup process for expired items
     */
    initializeCleanup() {
        // Clean up expired items every 5 minutes
        setInterval(() => {
            this.cleanupExpired();
        }, 5 * 60 * 1000);

        // Initial cleanup
        this.cleanupExpired();
    }

    /**
     * Clean up expired cache items
     */
    cleanupExpired() {
        // Clean memory cache
        for (const [key, item] of this.memoryCache.entries()) {
            if (this.isExpired(item)) {
                this.memoryCache.delete(key);
            }
        }

        // Clean localStorage cache
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('junglore_cache_')) {
                    try {
                        const item = JSON.parse(localStorage.getItem(key));
                        if (this.isExpired(item)) {
                            keysToRemove.push(key);
                        }
                    } catch (error) {
                        // Remove invalid items
                        keysToRemove.push(key);
                    }
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.warn('Failed to cleanup localStorage cache:', error);
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const memorySize = this.memoryCache.size;
        let localStorageSize = 0;
        let localStorageItems = 0;

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('junglore_cache_')) {
                    localStorageItems++;
                    const item = localStorage.getItem(key);
                    if (item) {
                        localStorageSize += item.length;
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to get localStorage stats:', error);
        }

        return {
            memory: {
                items: memorySize,
                size: `${Math.round(JSON.stringify([...this.memoryCache.values()]).length / 1024)}KB`
            },
            localStorage: {
                items: localStorageItems,
                size: `${Math.round(localStorageSize / 1024)}KB`
            }
        };
    }

    /**
     * Podcast-specific cache methods
     */

    // Cache podcast carousel data
    cachePodcastCarousel(podcasts, limit = 6) {
        const key = this.generateKey('podcast_carousel', { limit });
        this.set(key, podcasts);
        return key;
    }

    // Get cached podcast carousel data
    getCachedPodcastCarousel(limit = 6) {
        const key = this.generateKey('podcast_carousel', { limit });
        return this.get(key);
    }

    // Cache podcast detail
    cachePodcastDetail(podcastId, podcast) {
        const key = this.generateKey('podcast_detail', { id: podcastId });
        this.set(key, podcast);
        return key;
    }

    // Get cached podcast detail
    getCachedPodcastDetail(podcastId) {
        const key = this.generateKey('podcast_detail', { id: podcastId });
        return this.get(key);
    }

    // Cache podcast list with filters
    cachePodcastList(podcasts, filters = {}) {
        const key = this.generateKey('podcast_list', filters);
        this.set(key, podcasts);
        return key;
    }

    // Get cached podcast list
    getCachedPodcastList(filters = {}) {
        const key = this.generateKey('podcast_list', filters);
        return this.get(key);
    }

    // Cache search results
    cacheSearchResults(query, results, filters = {}) {
        const key = this.generateKey('search_results', { query, ...filters });
        this.set(key, results);
        return key;
    }

    // Get cached search results
    getCachedSearchResults(query, filters = {}) {
        const key = this.generateKey('search_results', { query, ...filters });
        return this.get(key);
    }

    // Invalidate podcast-related caches
    invalidatePodcastCaches(podcastId = null) {
        if (podcastId) {
            // Invalidate specific podcast
            this.remove(this.generateKey('podcast_detail', { id: podcastId }));
        }

        // Invalidate list caches
        this.clear('podcast_list');
        this.clear('podcast_carousel');
        this.clear('search_results');
    }
}

// Export singleton instance
export const cacheService = new CacheService();
export default cacheService;