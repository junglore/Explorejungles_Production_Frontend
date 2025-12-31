/**
 * Tests for mythsFactsService
 * Tests API integration, error handling, caching, and fallback mechanisms
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import mythsFactsService from '../services/mythsFactsService.js';
import apiService from '../services/api.js';

// Mock the API service
vi.mock('../services/api.js', () => ({
    default: {
        get: vi.fn()
    },
    ErrorTypes: {
        NETWORK_ERROR: 'NETWORK_ERROR',
        TIMEOUT_ERROR: 'TIMEOUT_ERROR',
        SERVER_ERROR: 'SERVER_ERROR',
        NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
        AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR'
    }
}));

// No static image imports needed - all content comes from backend

describe('MythsFactsService', () => {
    const mockApiResponse = {
        myths: [
            {
                id: 'api-1',
                title: 'API Test Myth',
                myth_content: 'This is a test myth from API',
                fact_content: 'This is the corresponding fact explanation',
                image_url: 'https://example.com/image1.jpg',
                is_featured: true,
                created_at: '2024-01-01T00:00:00Z',
                category: 'Wildlife'
            },
            {
                id: 'api-2',
                title: 'API Test Fact',
                myth_content: 'This is a test fact from API',
                fact_content: 'This is the fact explanation',
                image_url: 'https://example.com/image2.jpg',
                is_featured: false,
                created_at: '2024-01-01T00:00:00Z',
                category: 'Conservation'
            }
        ],
        pagination: {
            page: 1,
            limit: 20,
            total: 2,
            pages: 1
        }
    };

    const mockRandomResponse = [
        {
            id: 'random-1',
            title: 'Random Myth',
            myth_statement: 'Random myth statement',
            fact_explanation: 'Random fact explanation',
            image_url: 'https://example.com/random1.jpg',
            is_featured: true
        },
        {
            id: 'random-2',
            title: 'Random Fact',
            myth_statement: 'Random fact statement',
            fact_explanation: 'Random fact explanation',
            image_url: 'https://example.com/random2.jpg',
            is_featured: false
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mythsFactsService.clearCache();
        mythsFactsService.resetErrorCount();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initialization', () => {
        it('initializes with correct default values', () => {
            const stats = mythsFactsService.getServiceStats();

            expect(stats.isLoading).toBe(false);
            expect(stats.cacheSize).toBe(0);
            expect(stats.errorCount).toBe(0);
            expect(stats.fallbackDataCount).toBe(6);
        });

        it('has fallback data available', () => {
            const stats = mythsFactsService.getServiceStats();
            expect(stats.fallbackDataCount).toBeGreaterThan(0);
        });
    });

    describe('fetchMythsVsFacts', () => {
        it('fetches data successfully from API', async () => {
            apiService.get.mockResolvedValueOnce(mockApiResponse);

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(apiService.get).toHaveBeenCalledWith(
                '/api/v1/myths-facts/resources/myths',
                { page: 1, limit: 20 }
            );
            expect(result.myths).toHaveLength(2);
            expect(result.pagination).toEqual(mockApiResponse.pagination);
        });

        it('transforms API data correctly', async () => {
            apiService.get.mockResolvedValueOnce(mockApiResponse);

            const result = await mythsFactsService.fetchMythsVsFacts();

            const transformedItem = result.myths[0];
            expect(transformedItem).toMatchObject({
                id: 'api-1',
                title: 'API Test Myth',
                myth_statement: 'This is a test myth from API',
                fact_explanation: 'This is the corresponding fact explanation',
                image_url: 'https://example.com/image1.jpg',
                type: 'myth',
                is_featured: true,
                category: 'Wildlife'
            });
        });

        it('uses fallback images when API image is missing', async () => {
            const responseWithoutImages = {
                ...mockApiResponse,
                myths: mockApiResponse.myths.map(myth => ({ ...myth, image_url: null }))
            };

            apiService.get.mockResolvedValueOnce(responseWithoutImages);

            const result = await mythsFactsService.fetchMythsVsFacts();

            const transformedItem = result.myths[0];
            expect(transformedItem.image_url).toBe('https://example.com/image1.jpg');
        });

        it('caches successful responses', async () => {
            apiService.get.mockResolvedValueOnce(mockApiResponse);

            // First call
            await mythsFactsService.fetchMythsVsFacts();

            // Second call should use cache
            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(apiService.get).toHaveBeenCalledTimes(1);
            expect(result.myths).toHaveLength(2);
        });

        it('respects cache timeout', async () => {
            vi.useFakeTimers();

            apiService.get.mockResolvedValue(mockApiResponse);

            // First call
            await mythsFactsService.fetchMythsVsFacts();

            // Advance time beyond cache timeout (5 minutes)
            vi.advanceTimersByTime(6 * 60 * 1000);

            // Second call should hit API again
            await mythsFactsService.fetchMythsVsFacts();

            expect(apiService.get).toHaveBeenCalledTimes(2);

            vi.useRealTimers();
        });

        it('uses fallback data on API failure', async () => {
            apiService.get.mockRejectedValueOnce(new Error('Network error'));

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(result.isFromFallback).toBe(true);
            expect(result.myths).toHaveLength(6); // Fallback data count
            expect(result.errorMessage).toContain('Unable to connect');
        });

        it('retries on transient errors', async () => {
            apiService.get
                .mockRejectedValueOnce(new Error('Temporary error'))
                .mockResolvedValueOnce(mockApiResponse);

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(apiService.get).toHaveBeenCalledTimes(2);
            expect(result.myths).toHaveLength(2);
        });

        it('handles custom parameters', async () => {
            apiService.get.mockResolvedValueOnce(mockApiResponse);

            await mythsFactsService.fetchMythsVsFacts({ page: 2, limit: 10, featured_only: true });

            expect(apiService.get).toHaveBeenCalledWith(
                '/api/v1/myths-facts/resources/myths',
                { page: 2, limit: 10, featured_only: true }
            );
        });
    });

    describe('fetchRandomMythsFacts', () => {
        it('fetches random data successfully', async () => {
            apiService.get.mockResolvedValueOnce(mockRandomResponse);

            const result = await mythsFactsService.fetchRandomMythsFacts(7);

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/myths-facts/resources/random7');
            expect(result).toHaveLength(2);
        });

        it('transforms random API data correctly', async () => {
            apiService.get.mockResolvedValueOnce(mockRandomResponse);

            const result = await mythsFactsService.fetchRandomMythsFacts();

            const transformedItem = result[0];
            expect(transformedItem).toMatchObject({
                id: 'random-1',
                title: 'Random Myth',
                myth_statement: 'Random myth statement',
                fact_explanation: 'Random fact explanation',
                image_url: 'https://example.com/random1.jpg',
                type: 'myth'
            });
        });

        it('uses shuffled fallback data on API failure', async () => {
            apiService.get.mockRejectedValueOnce(new Error('API error'));

            const result = await mythsFactsService.fetchRandomMythsFacts(3);

            expect(result).toHaveLength(3);
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('title');
        });

        it('caches random results', async () => {
            apiService.get.mockResolvedValueOnce(mockRandomResponse);

            // First call
            await mythsFactsService.fetchRandomMythsFacts();

            // Second call should use cache
            const result = await mythsFactsService.fetchRandomMythsFacts();

            expect(apiService.get).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(2);
        });
    });

    describe('fetchFeaturedMythsFacts', () => {
        it('fetches featured data successfully', async () => {
            const featuredResponse = {
                myths: mockApiResponse.myths.filter(myth => myth.is_featured)
            };

            apiService.get.mockResolvedValueOnce(featuredResponse);

            const result = await mythsFactsService.fetchFeaturedMythsFacts();

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/myths-facts/', { is_featured: true });
            expect(result).toHaveLength(1);
            expect(result[0].is_featured).toBe(true);
        });

        it('uses featured fallback data on API failure', async () => {
            apiService.get.mockRejectedValueOnce(new Error('API error'));

            const result = await mythsFactsService.fetchFeaturedMythsFacts();

            expect(result.every(item => item.is_featured)).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('handles network errors gracefully', async () => {
            const networkError = new Error('Network error');
            networkError.type = 'NETWORK_ERROR';

            apiService.get.mockRejectedValueOnce(networkError);

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(result.isFromFallback).toBe(true);
            expect(result.errorMessage).toContain('Unable to connect');
        });

        it('handles timeout errors', async () => {
            const timeoutError = new Error('Timeout');
            timeoutError.type = 'TIMEOUT_ERROR';

            apiService.get.mockRejectedValueOnce(timeoutError);

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(result.isFromFallback).toBe(true);
            expect(result.errorMessage).toContain('timed out');
        });

        it('handles server errors', async () => {
            const serverError = new Error('Server error');
            serverError.type = 'SERVER_ERROR';

            apiService.get.mockRejectedValueOnce(serverError);

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(result.isFromFallback).toBe(true);
            expect(result.errorMessage).toContain('temporarily unavailable');
        });

        it('handles not found errors', async () => {
            const notFoundError = new Error('Not found');
            notFoundError.type = 'NOT_FOUND_ERROR';

            apiService.get.mockRejectedValueOnce(notFoundError);

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(result.isFromFallback).toBe(true);
            expect(result.errorMessage).toContain('not found');
        });

        it('tracks error count', async () => {
            apiService.get.mockRejectedValue(new Error('Persistent error'));

            await mythsFactsService.fetchMythsVsFacts();
            await mythsFactsService.fetchRandomMythsFacts();

            const stats = mythsFactsService.getServiceStats();
            expect(stats.errorCount).toBe(2);
            expect(stats.lastError).toBeDefined();
        });

        it('resets error count', async () => {
            apiService.get.mockRejectedValueOnce(new Error('Error'));

            await mythsFactsService.fetchMythsVsFacts();

            let stats = mythsFactsService.getServiceStats();
            expect(stats.errorCount).toBe(1);

            mythsFactsService.resetErrorCount();

            stats = mythsFactsService.getServiceStats();
            expect(stats.errorCount).toBe(0);
            expect(stats.lastError).toBeNull();
        });
    });

    describe('Retry Logic', () => {
        it('retries with exponential backoff', async () => {
            vi.useFakeTimers();

            apiService.get
                .mockRejectedValueOnce(new Error('Retry 1'))
                .mockRejectedValueOnce(new Error('Retry 2'))
                .mockResolvedValueOnce(mockApiResponse);

            const fetchPromise = mythsFactsService.fetchMythsVsFacts();

            // Advance timers to trigger retries
            vi.advanceTimersByTime(1000); // First retry delay
            vi.advanceTimersByTime(2000); // Second retry delay (exponential)

            const result = await fetchPromise;

            expect(apiService.get).toHaveBeenCalledTimes(3);
            expect(result.myths).toHaveLength(2);

            vi.useRealTimers();
        });

        it('does not retry on non-retryable errors', async () => {
            const notFoundError = new Error('Not found');
            notFoundError.type = 'NOT_FOUND_ERROR';

            apiService.get.mockRejectedValueOnce(notFoundError);

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(apiService.get).toHaveBeenCalledTimes(1);
            expect(result.isFromFallback).toBe(true);
        });

        it('gives up after max retries', async () => {
            apiService.get.mockRejectedValue(new Error('Persistent error'));

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(apiService.get).toHaveBeenCalledTimes(3); // Initial + 2 retries
            expect(result.isFromFallback).toBe(true);
        });
    });

    describe('Loading States', () => {
        it('tracks loading state correctly', async () => {
            let loadingDuringFetch = false;

            apiService.get.mockImplementation(async () => {
                loadingDuringFetch = mythsFactsService.getOverallLoadingState();
                return mockApiResponse;
            });

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(loadingDuringFetch).toBe(true);
            expect(mythsFactsService.getOverallLoadingState()).toBe(false);
        });

        it('tracks operation-specific loading states', async () => {
            let fetchLoading = false;
            let randomLoading = false;

            apiService.get.mockImplementation(async (endpoint) => {
                if (endpoint.includes('random7')) {
                    randomLoading = mythsFactsService.getLoadingState('fetchRandomMythsFacts');
                } else {
                    fetchLoading = mythsFactsService.getLoadingState('fetchMythsVsFacts');
                }
                return endpoint.includes('random7') ? mockRandomResponse : mockApiResponse;
            });

            await Promise.all([
                mythsFactsService.fetchMythsVsFacts(),
                mythsFactsService.fetchRandomMythsFacts()
            ]);

            expect(fetchLoading).toBe(true);
            expect(randomLoading).toBe(true);
        });
    });

    describe('Cache Management', () => {
        it('clears cache correctly', async () => {
            apiService.get.mockResolvedValue(mockApiResponse);

            // Populate cache
            await mythsFactsService.fetchMythsVsFacts();

            let stats = mythsFactsService.getServiceStats();
            expect(stats.cacheSize).toBeGreaterThan(0);

            // Clear cache
            mythsFactsService.clearCache();

            stats = mythsFactsService.getServiceStats();
            expect(stats.cacheSize).toBe(0);
        });

        it('generates unique cache keys for different parameters', async () => {
            apiService.get.mockResolvedValue(mockApiResponse);

            await mythsFactsService.fetchMythsVsFacts({ page: 1 });
            await mythsFactsService.fetchMythsVsFacts({ page: 2 });

            expect(apiService.get).toHaveBeenCalledTimes(2);
        });
    });

    describe('Data Transformation', () => {
        it('determines type correctly from API data', async () => {
            const mixedResponse = {
                myths: [
                    { id: '1', myth_content: 'Myth content', fact_content: 'Fact content' },
                    { id: '2', type: 'fact', myth_content: 'Actually fact', fact_content: 'Fact content' },
                    { id: '3', fact_content: 'Only fact content' }
                ]
            };

            apiService.get.mockResolvedValueOnce(mixedResponse);

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(result.myths[0].type).toBe('myth'); // Has myth_content
            expect(result.myths[1].type).toBe('fact'); // Explicit type
            expect(result.myths[2].type).toBe('fact'); // Default to fact
        });

        it('handles missing fields gracefully', async () => {
            const incompleteResponse = {
                myths: [
                    { id: '1' }, // Minimal data
                    { id: '2', title: 'Title only' }
                ]
            };

            apiService.get.mockResolvedValueOnce(incompleteResponse);

            const result = await mythsFactsService.fetchMythsVsFacts();

            expect(result.myths).toHaveLength(2);
            expect(result.myths[0].id).toBe('1');
            expect(result.myths[1].title).toBe('Title only');
        });
    });

    describe('Health Check', () => {
        it('reports healthy status when API is available', async () => {
            apiService.get.mockResolvedValueOnce({ myths: [{ id: 'test' }] });

            const health = await mythsFactsService.healthCheck();

            expect(health.status).toBe('healthy');
            expect(health.apiAvailable).toBe(true);
        });

        it('reports degraded status when API is unavailable', async () => {
            apiService.get.mockRejectedValueOnce(new Error('API down'));

            const health = await mythsFactsService.healthCheck();

            expect(health.status).toBe('degraded');
            expect(health.apiAvailable).toBe(false);
            expect(health.fallbackAvailable).toBe(true);
        });
    });

    describe('Service Statistics', () => {
        it('provides comprehensive service statistics', async () => {
            apiService.get.mockResolvedValueOnce(mockApiResponse);

            await mythsFactsService.fetchMythsVsFacts();

            const stats = mythsFactsService.getServiceStats();

            expect(stats).toHaveProperty('isLoading');
            expect(stats).toHaveProperty('loadingOperations');
            expect(stats).toHaveProperty('cacheSize');
            expect(stats).toHaveProperty('errorCount');
            expect(stats).toHaveProperty('fallbackDataCount');
        });
    });
});