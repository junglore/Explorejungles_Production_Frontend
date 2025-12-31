/**
 * Collection Service
 * Handles API integration for the Collection-based Myths vs Facts system
 * Manages user collection progress, daily limits, and collection content
 */

import apiService, { ErrorTypes, API_BASE_URL } from './api.js';

class CollectionService {
    constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
        this.isLoading = false;
        this.loadingStates = new Map();
        this.cache = new Map();
        this.cacheTimeout = 2 * 60 * 1000; // 2 minutes - shorter for collection data
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.errorCount = 0;
        this.lastError = null;
    }

    // Set loading state for specific operations
    setLoading(operation, isLoading) {
        this.loadingStates.set(operation, isLoading);
        this.isLoading = Array.from(this.loadingStates.values()).some(loading => loading);
    }

    // Get loading state for specific operation
    getLoadingState(operation) {
        return this.loadingStates.get(operation) || false;
    }

    // Cache management
    getCacheKey(endpoint, params) {
        return `${endpoint}_${JSON.stringify(params)}`;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        // Check if cache is expired
        if (Date.now() - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    clearCache() {
        this.cache.clear();
    }

    // Enhanced error handling
    handleApiError(error, operation) {
        this.errorCount++;
        this.lastError = {
            error,
            operation,
            timestamp: new Date().toISOString()
        };

        console.error(`CollectionService Error in ${operation}:`, error);

        // Return user-friendly error messages
        switch (error.type) {
            case ErrorTypes.NETWORK_ERROR:
                return {
                    message: 'Unable to connect to the server. Check your internet connection.',
                    canRetry: true,
                    useFallback: false
                };
            case ErrorTypes.TIMEOUT_ERROR:
                return {
                    message: 'Request timed out. Please try again.',
                    canRetry: true,
                    useFallback: false
                };
            case ErrorTypes.SERVER_ERROR:
                return {
                    message: 'Server is temporarily unavailable. Please try again later.',
                    canRetry: true,
                    useFallback: false
                };
            case ErrorTypes.NOT_FOUND_ERROR:
                return {
                    message: 'Collection not found.',
                    canRetry: false,
                    useFallback: false
                };
            case ErrorTypes.AUTHORIZATION_ERROR:
                return {
                    message: 'Daily limit reached for this collection.',
                    canRetry: false,
                    useFallback: false
                };
            default:
                return {
                    message: 'Something went wrong. Please try again.',
                    canRetry: true,
                    useFallback: false
                };
        }
    }

    // Retry logic with exponential backoff
    async retryWithBackoff(operation, maxRetries = this.maxRetries) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                // Don't retry on certain error types
                if (error.type === ErrorTypes.NOT_FOUND_ERROR ||
                    error.type === ErrorTypes.AUTHORIZATION_ERROR ||
                    error.status === 404 || error.status === 403) {
                    throw error;
                }

                // Last attempt, throw the error
                if (attempt === maxRetries) {
                    throw error;
                }

                // Exponential backoff
                const delay = this.retryDelay * Math.pow(2, attempt - 1);
                console.log(`Collection API retry attempt ${attempt}/${maxRetries} in ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    /**
     * Get available collections for the current user
     * Returns collections with progress, daily limits, and completion status
     */
    async getAvailableCollections() {
        const operation = 'getAvailableCollections';
        const cacheKey = this.getCacheKey('/collection/available', {});

        this.setLoading(operation, true);

        try {
            // Check cache first
            const cachedData = this.getCache(cacheKey);
            if (cachedData) {
                console.log('Using cached available collections data');
                return cachedData;
            }

            // Fetch from API with retry logic
            const result = await this.retryWithBackoff(async () => {
                const response = await apiService.get('/collection/available');
                
                if (!response || !Array.isArray(response.collections)) {
                    throw new Error('Invalid response format for available collections');
                }

                return response;
            });

            this.setCache(cacheKey, result);
            console.log('Successfully fetched available collections from API');

            return result;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);
            console.error('Failed to fetch available collections:', errorInfo.message);
            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get user's progress for a specific collection
     */
    async getCollectionProgress(collectionId) {
        const operation = 'getCollectionProgress';
        const cacheKey = this.getCacheKey('/collection/progress', { collectionId });

        this.setLoading(operation, true);

        try {
            // Check cache first
            const cachedData = this.getCache(cacheKey);
            if (cachedData) {
                console.log('Using cached collection progress data');
                return cachedData;
            }

            // Fetch from API with retry logic
            const result = await this.retryWithBackoff(async () => {
                const response = await apiService.get(`/collection/progress/${collectionId}`);
                
                if (!response) {
                    throw new Error('Invalid response format for collection progress');
                }

                return response;
            });

            this.setCache(cacheKey, result);
            console.log('Successfully fetched collection progress from API');

            return result;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);
            console.error('Failed to fetch collection progress:', errorInfo.message);
            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Start a collection session and get content
     * This validates daily limits and returns myth/fact content
     */
    async startCollection(collectionId, requestedCount = 7) {
        const operation = 'startCollection';
        const cacheKey = this.getCacheKey('/collection/start', { collectionId, requestedCount });

        this.setLoading(operation, true);

        try {
            // Don't cache start requests - they need fresh validation
            
            // Start collection with retry logic
            const result = await this.retryWithBackoff(async () => {
                const response = await apiService.post('/collection/start', {
                    collection_id: collectionId,
                    requested_count: requestedCount
                });
                
                if (!response || !Array.isArray(response.content)) {
                    throw new Error('Invalid response format for collection start');
                }

                return response;
            });

            // Clear related cache entries since progress has changed
            this.clearCollectionCaches(collectionId);

            console.log('Successfully started collection session');
            return result;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);
            
            // Handle specific error cases
            if (error.status === 403) {
                throw new Error('Daily limit reached for this collection. Try again tomorrow!');
            }
            
            console.error('Failed to start collection:', errorInfo.message);
            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Complete a collection session
     * This records user performance and awards rewards
     */
    async completeCollection(completionData) {
        const operation = 'completeCollection';

        this.setLoading(operation, true);

        try {
            // Complete collection with retry logic
            const result = await this.retryWithBackoff(async () => {
                const response = await apiService.post('/collection/complete', completionData);
                
                if (!response) {
                    throw new Error('Invalid response format for collection completion');
                }

                return response;
            });

            // Clear all collection-related caches since progress has changed
            this.clearAllCollectionCaches();

            console.log('Successfully completed collection session');
            return result;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);
            console.error('Failed to complete collection:', errorInfo.message);
            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get all collections (including completed ones)
     * Useful for admin or statistics views
     */
    async getAllCollections() {
        const operation = 'getAllCollections';
        const cacheKey = this.getCacheKey('/collection/all', {});

        this.setLoading(operation, true);

        try {
            // Check cache first
            const cachedData = this.getCache(cacheKey);
            if (cachedData) {
                console.log('Using cached all collections data');
                return cachedData;
            }

            // Fetch from API with retry logic
            const result = await this.retryWithBackoff(async () => {
                const response = await apiService.get('/collection/all');
                
                if (!response || !Array.isArray(response.collections)) {
                    throw new Error('Invalid response format for all collections');
                }

                return response;
            });

            this.setCache(cacheKey, result);
            console.log('Successfully fetched all collections from API');

            return result;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);
            console.error('Failed to fetch all collections:', errorInfo.message);
            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Transform collection content to game format
     * Converts API collection response to format expected by MythsVsFacts component
     */
    transformCollectionContentToGameFormat(content, defaultBackgrounds = []) {
        return content.map((item, index) => {
            // Handle image URL construction
            let fullImageUrl = item.image_url;
            if (fullImageUrl && typeof fullImageUrl === 'string') {
                fullImageUrl = fullImageUrl.trim();

                if (!fullImageUrl.startsWith('http')) {
                    const baseUrl = API_BASE_URL.replace('/api/v1', '');
                    const cleanBaseUrl = baseUrl.replace(/\/$/, '');

                    if (fullImageUrl.startsWith('images/')) {
                        fullImageUrl = `uploads/${fullImageUrl}`;
                    }

                    fullImageUrl = fullImageUrl.startsWith('/') ?
                        `${cleanBaseUrl}${fullImageUrl}` :
                        `${cleanBaseUrl}/${fullImageUrl}`;
                }
            } else {
                fullImageUrl = null;
            }

            return {
                id: item.id,
                animalImage: fullImageUrl,
                backgroundImage: defaultBackgrounds[index % defaultBackgrounds.length],
                text: `"${item.myth_statement || item.text}"`,
                type: item.type,
                explanation: item.fact_explanation,
                title: item.title,
                // Add collection-specific metadata
                collectionId: item.collection_id || null,
                collectionName: item.collection_name || null
            };
        });
    }

    /**
     * Clear cache entries related to a specific collection
     */
    clearCollectionCaches(collectionId) {
        const keysToDelete = [];
        for (const [key] of this.cache) {
            if (key.includes('collection') && (key.includes(collectionId) || key.includes('available'))) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.cache.delete(key));
        console.log(`Cleared ${keysToDelete.length} collection cache entries`);
    }

    /**
     * Clear all collection-related cache entries
     */
    clearAllCollectionCaches() {
        const keysToDelete = [];
        for (const [key] of this.cache) {
            if (key.includes('collection')) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.cache.delete(key));
        console.log(`Cleared ${keysToDelete.length} total collection cache entries`);
    }

    /**
     * Get service statistics
     */
    getServiceStats() {
        return {
            isLoading: this.isLoading,
            loadingOperations: Array.from(this.loadingStates.entries()),
            cacheSize: this.cache.size,
            errorCount: this.errorCount,
            lastError: this.lastError
        };
    }

    /**
     * Reset error count
     */
    resetErrorCount() {
        this.errorCount = 0;
        this.lastError = null;
    }

    /**
     * Health check for collection service
     */
    async healthCheck() {
        try {
            const response = await apiService.get('/collection/available');
            return {
                status: 'healthy',
                apiAvailable: true,
                cacheSize: this.cache.size,
                errorCount: this.errorCount
            };
        } catch (error) {
            return {
                status: 'degraded',
                apiAvailable: false,
                cacheSize: this.cache.size,
                errorCount: this.errorCount,
                lastError: error.message
            };
        }
    }
}

// Create singleton instance
const collectionService = new CollectionService();
export default collectionService;