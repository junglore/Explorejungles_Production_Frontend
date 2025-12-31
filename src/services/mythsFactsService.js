/**
 * Myths vs Facts Service
 * Handles API integration for the Myths vs Facts game with enhanced error handling,
 * retry logic, loading states, and dynamic content from backend
 */

import apiService, { ErrorTypes } from './api.js';

class MythsFactsService {
    constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
        this.isLoading = false;
        this.loadingStates = new Map();
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
        this.fallbackData = this.initializeFallbackData();
        this.errorCount = 0;
        this.lastError = null;
    }

    // Initialize empty fallback data - all content should come from backend
    initializeFallbackData() {
        return [];
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

    // Get overall loading state
    getOverallLoadingState() {
        return this.isLoading;
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

    // Enhanced error handling with user-friendly messages
    handleApiError(error, operation) {
        this.errorCount++;
        this.lastError = {
            error,
            operation,
            timestamp: new Date().toISOString()
        };

        console.error(`MythsFactsService Error in ${operation}:`, error);

        // Return user-friendly error messages
        switch (error.type) {
            case ErrorTypes.NETWORK_ERROR:
                return {
                    message: 'Unable to connect to the server. Using offline content.',
                    canRetry: true,
                    useFallback: true
                };
            case ErrorTypes.TIMEOUT_ERROR:
                return {
                    message: 'Request timed out. Using cached content.',
                    canRetry: true,
                    useFallback: true
                };
            case ErrorTypes.SERVER_ERROR:
                return {
                    message: 'Server is temporarily unavailable. Using offline content.',
                    canRetry: true,
                    useFallback: true
                };
            case ErrorTypes.NOT_FOUND_ERROR:
                return {
                    message: 'Content not found. Loading default game content.',
                    canRetry: false,
                    useFallback: true
                };
            default:
                return {
                    message: 'Something went wrong. Using offline content.',
                    canRetry: true,
                    useFallback: true
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

                // Exponential backoff: wait longer between retries
                const delay = this.retryDelay * Math.pow(2, attempt - 1);
                console.log(`Retry attempt ${attempt}/${maxRetries} in ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // Transform API data to game format
    transformApiDataToGameFormat(apiData) {
        return apiData.map((item) => ({
            id: item.id,
            title: item.title,
            myth_statement: item.myth_content || item.myth_statement,
            fact_explanation: item.fact_content || item.fact_explanation,
            image_url: item.image_url,
            type: this.determineType(item),
            is_featured: item.is_featured || false,
            created_at: item.created_at,
            category: item.category
        }));
    }

    // Determine if content is myth or fact based on API data
    determineType(item) {
        // If the API provides type information, use it
        if (item.type) return item.type;

        // Otherwise, assume items with myth_content are myths
        if (item.myth_content || item.myth_statement) return 'myth';

        // Default to fact
        return 'fact';
    }

    // Fetch myths vs facts with enhanced error handling and fallback
    async fetchMythsVsFacts(params = {}) {
        const operation = 'fetchMythsVsFacts';
        const cacheKey = this.getCacheKey('/myths-facts/resources/myths', params);

        this.setLoading(operation, true);

        try {
            // Check cache first
            const cachedData = this.getCache(cacheKey);
            if (cachedData) {
                console.log('Using cached myths vs facts data');
                return cachedData;
            }

            // Attempt to fetch from API with retry logic
            const result = await this.retryWithBackoff(async () => {
                const defaultParams = { page: 1, limit: 20, ...params };
                const response = await apiService.get('/myths-facts/resources/myths', defaultParams);

                if (!response || !response.myths) {
                    throw new Error('Invalid response format');
                }

                return response;
            });

            // Transform and cache the data
            const transformedData = {
                myths: this.transformApiDataToGameFormat(result.myths),
                pagination: result.pagination || {
                    page: 1,
                    limit: 20,
                    total: result.myths.length,
                    pages: 1
                }
            };

            this.setCache(cacheKey, transformedData);
            console.log('Successfully fetched myths vs facts from API');

            return transformedData;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);

            if (errorInfo.useFallback) {
                console.log('API error - returning empty result');
                const fallbackResult = {
                    myths: [],
                    pagination: {
                        page: 1,
                        limit: 0,
                        total: 0,
                        pages: 0
                    },
                    isFromFallback: true,
                    errorMessage: errorInfo.message
                };

                return fallbackResult;
            }

            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Fetch random myths vs facts for game
    async fetchRandomMythsFacts(count = 7) {
        const operation = 'fetchRandomMythsFacts';
        const cacheKey = this.getCacheKey('/myths-facts/resources/random7', { count });

        this.setLoading(operation, true);

        try {
            // Check cache first
            const cachedData = this.getCache(cacheKey);
            if (cachedData) {
                console.log('Using cached random myths vs facts data');
                return cachedData;
            }

            // Attempt to fetch from API with retry logic
            const result = await this.retryWithBackoff(async () => {
                const response = await apiService.get('/myths-facts/resources/random7');

                if (!response || !Array.isArray(response)) {
                    throw new Error('Invalid response format for random myths');
                }

                return response;
            });

            // Transform the data
            const transformedData = this.transformApiDataToGameFormat(result);

            this.setCache(cacheKey, transformedData);
            console.log('Successfully fetched random myths vs facts from API');

            return transformedData;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);

            if (errorInfo.useFallback) {
                console.log('API error - returning empty result for random myths vs facts');
                return [];
            }

            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Fetch featured myths vs facts
    async fetchFeaturedMythsFacts() {
        const operation = 'fetchFeaturedMythsFacts';
        const cacheKey = this.getCacheKey('/myths-facts/featured', {});

        this.setLoading(operation, true);

        try {
            // Check cache first
            const cachedData = this.getCache(cacheKey);
            if (cachedData) {
                console.log('Using cached featured myths vs facts data');
                return cachedData;
            }

            // Attempt to fetch from API with retry logic
            const result = await this.retryWithBackoff(async () => {
                const response = await apiService.get('/myths-facts/', { is_featured: true });

                if (!response) {
                    throw new Error('Invalid response format for featured myths');
                }

                return response;
            });

            // Transform the data
            const transformedData = this.transformApiDataToGameFormat(result.myths || result);

            this.setCache(cacheKey, transformedData);
            console.log('Successfully fetched featured myths vs facts from API');

            return transformedData;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);

            if (errorInfo.useFallback) {
                console.log('API error - returning empty result for featured myths vs facts');
                return [];
            }

            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Fetch myths vs facts by category
    async fetchMythsFactsByCategory(categoryId, params = {}) {
        const operation = 'fetchMythsFactsByCategory';
        const requestParams = { category_id: categoryId, ...params };
        const cacheKey = this.getCacheKey('/myths-facts/', requestParams);

        this.setLoading(operation, true);

        try {
            // Check cache first
            const cachedData = this.getCache(cacheKey);
            if (cachedData) {
                console.log(`Using cached myths vs facts data for category ${categoryId}`);
                return cachedData;
            }

            // Attempt to fetch from API with retry logic
            const result = await this.retryWithBackoff(async () => {
                const defaultParams = { page: 1, limit: 50, ...requestParams };
                const response = await apiService.get('/myths-facts/', defaultParams);

                if (!response) {
                    throw new Error('Invalid response format');
                }

                return response;
            });

            // Transform and cache the data
            const transformedData = {
                myths: this.transformApiDataToGameFormat(result.items || result.myths || result),
                pagination: result.pagination || {
                    page: requestParams.page || 1,
                    limit: requestParams.limit || 50,
                    total: (result.items || result.myths || result).length,
                    pages: 1
                },
                categoryId: categoryId
            };

            this.setCache(cacheKey, transformedData);
            console.log(`Successfully fetched myths vs facts from API for category ${categoryId}`);

            return transformedData;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);

            if (errorInfo.useFallback) {
                console.log(`API error - returning empty result for category ${categoryId}`);
                const fallbackResult = {
                    myths: [],
                    pagination: {
                        page: 1,
                        limit: 0,
                        total: 0,
                        pages: 0
                    },
                    categoryId: categoryId,
                    isFromFallback: true,
                    errorMessage: errorInfo.message
                };

                return fallbackResult;
            }

            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Fetch random myths vs facts from a specific category
    async fetchRandomMythsFactsByCategory(categoryId, count = 7) {
        const operation = 'fetchRandomMythsFactsByCategory';
        const cacheKey = this.getCacheKey('/myths-facts/random', { categoryId, count });

        this.setLoading(operation, true);

        try {
            // Check cache first
            const cachedData = this.getCache(cacheKey);
            if (cachedData) {
                console.log(`Using cached random myths vs facts data for category ${categoryId}`);
                return cachedData;
            }

            // First fetch all items from category, then randomize
            const categoryData = await this.fetchMythsFactsByCategory(categoryId, { limit: 50 });
            
            if (!categoryData.myths || categoryData.myths.length === 0) {
                return [];
            }

            // Shuffle and take requested count
            const shuffled = [...categoryData.myths].sort(() => Math.random() - 0.5);
            const randomItems = shuffled.slice(0, Math.min(count, shuffled.length));

            this.setCache(cacheKey, randomItems);
            console.log(`Successfully fetched ${randomItems.length} random myths vs facts for category ${categoryId}`);

            return randomItems;

        } catch (error) {
            const errorInfo = this.handleApiError(error, operation);

            if (errorInfo.useFallback) {
                console.log(`API error - returning empty result for random category ${categoryId} myths vs facts`);
                return [];
            }

            throw error;
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Get service statistics
    getServiceStats() {
        return {
            isLoading: this.isLoading,
            loadingOperations: Array.from(this.loadingStates.entries()),
            cacheSize: this.cache.size,
            errorCount: this.errorCount,
            lastError: this.lastError,
            fallbackDataCount: this.fallbackData.length
        };
    }

    // Reset error count
    resetErrorCount() {
        this.errorCount = 0;
        this.lastError = null;
    }

    // Check if service is healthy
    async healthCheck() {
        try {
            const response = await apiService.get('/myths-facts/resources/myths', { limit: 1 });
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
                fallbackAvailable: true,
                cacheSize: this.cache.size,
                errorCount: this.errorCount,
                lastError: error.message
            };
        }
    }
}

// Create singleton instance
const mythsFactsService = new MythsFactsService();
export default mythsFactsService;