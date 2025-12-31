/**
 * Content Service for Junglore Frontend
 * Handles all content-related API calls for the 4 content sections
 * Updated to work with standardized backend endpoints
 */

import apiService from './api.js';

class ContentService {
    constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
        this.isLoading = false;
        this.loadingStates = new Map();
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

    // Generic content fetch method with standardized response handling
    async fetchContent(endpoint, params = {}) {
        const operation = `fetch-${endpoint}`;
        this.setLoading(operation, true);

        try {
            const response = await apiService.get(`/${endpoint}/`, params);

            // Handle standardized API response format
            if (response && response.status && response.data) {
                // Check if data has a nested result structure
                if (response.data.result) {
                    return {
                        data: response.data.result,
                        page: response.data.currentPage || response.data.page || 1,
                        limit: response.data.limit || response.data.per_page || 9,
                        total: response.data.total || response.data.total_count || 0,
                        pages: response.data.totalPages || response.data.total_pages || 1
                    };
                }
                return response.data;
            }

            // Fallback for direct response
            return response;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw this.handleApiError(error, `Failed to fetch ${endpoint}`);
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Blog Posts
    async fetchBlogs(params = {}) {
        return this.fetchContent('blogs', params);
    }

    async fetchBlogById(id) {
        const operation = `fetch-blog-${id}`;
        this.setLoading(operation, true);

        try {
            const response = await apiService.get(`/blogs/${id}`);

            // Handle standardized API response format
            if (response && response.status && response.data) {
                // Return the data directly since it's already the content object
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error fetching blog by ID:', error);
            throw this.handleApiError(error, 'Failed to fetch blog');
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Case Studies
    async fetchCaseStudies(params = {}) {
        return this.fetchContent('casestudies', params);
    }

    async fetchCaseStudyById(id) {
        const operation = `fetch-casestudy-${id}`;
        this.setLoading(operation, true);

        try {
            const response = await apiService.get(`/casestudies/${id}`);

            // Handle standardized API response format
            if (response && response.status && response.data) {
                // Return the data directly since it's already the content object
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error fetching case study by ID:', error);
            throw this.handleApiError(error, 'Failed to fetch case study');
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Conservation Efforts
    async fetchConservationEfforts(params = {}) {
        return this.fetchContent('conservation-efforts', params);
    }

    async fetchConservationEffortById(id) {
        const operation = `fetch-conservation-${id}`;
        this.setLoading(operation, true);

        try {
            const response = await apiService.get(`/conservation-efforts/${id}`);

            // Handle standardized API response format
            if (response && response.status && response.data) {
                // Return the data directly since it's already the content object
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error fetching conservation effort by ID:', error);
            throw this.handleApiError(error, 'Failed to fetch conservation effort');
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Daily Updates & Articles
    async fetchDailyUpdates(params = {}) {
        return this.fetchContent('dailynews', params);
    }

    async fetchDailyUpdateById(id) {
        const operation = `fetch-dailynews-${id}`;
        this.setLoading(operation, true);

        try {
            const response = await apiService.get(`/dailynews/${id}`);

            // Handle standardized API response format
            if (response && response.status && response.data) {
                // Return the data directly since it's already the content object
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error fetching daily update by ID:', error);
            throw this.handleApiError(error, 'Failed to fetch daily update');
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Search across all content types
    async searchContent(query, params = {}) {
        const operation = 'search-content';
        this.setLoading(operation, true);

        try {
            const response = await apiService.get('/search/', {
                q: query,
                ...params
            });

            // Handle standardized API response format
            if (response && response.status && response.data) {
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error searching content:', error);
            throw this.handleApiError(error, 'Search failed');
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Get featured content by type
    async getFeaturedContent(type = 'blogs') {
        const operation = `fetch-featured-${type}`;
        this.setLoading(operation, true);

        try {
            const params = { featured: true, limit: 3 };

            // Map content types to correct endpoints
            const endpointMap = {
                'blogs': 'blogs',
                'casestudies': 'casestudies',
                'case_studies': 'casestudies',
                'conservation': 'conservation-efforts',
                'conservation_efforts': 'conservation-efforts',
                'dailynews': 'dailynews',
                'daily_updates': 'dailynews'
            };

            const endpoint = endpointMap[type] || 'blogs';
            const response = await apiService.get(`/${endpoint}/`, params);

            // Handle standardized API response format
            if (response && response.status && response.data) {
                // Check if data has a nested result structure
                if (response.data.result) {
                    return response.data.result;
                }
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error fetching featured content:', error);
            throw this.handleApiError(error, 'Failed to fetch featured content');
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Get content by category
    async getContentByCategory(categoryId, contentType = null, params = {}) {
        const operation = `fetch-category-${categoryId}`;
        this.setLoading(operation, true);

        try {
            const queryParams = {
                category_id: categoryId,
                ...params
            };

            let endpoint = 'content';
            if (contentType) {
                const endpointMap = {
                    'blogs': 'blogs',
                    'casestudies': 'casestudies',
                    'case_studies': 'casestudies',
                    'conservation': 'conservation-efforts',
                    'conservation_efforts': 'conservation-efforts',
                    'dailynews': 'dailynews',
                    'daily_updates': 'dailynews'
                };
                endpoint = endpointMap[contentType] || 'content';
            }

            const response = await apiService.get(`/${endpoint}/`, queryParams);

            // Handle standardized API response format
            if (response && response.status && response.data) {
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error fetching content by category:', error);
            throw this.handleApiError(error, 'Failed to fetch content by category');
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Get recent content by type
    async getRecentContent(type = null, limit = 5) {
        const operation = `fetch-recent-${type || 'all'}`;
        this.setLoading(operation, true);

        try {
            const params = { limit, page: 1 };

            if (type) {
                const endpointMap = {
                    'blogs': 'blogs',
                    'casestudies': 'casestudies',
                    'case_studies': 'casestudies',
                    'conservation': 'conservation-efforts',
                    'conservation_efforts': 'conservation-efforts',
                    'dailynews': 'dailynews',
                    'daily_updates': 'dailynews'
                };

                const endpoint = endpointMap[type];
                if (endpoint) {
                    const response = await apiService.get(`/${endpoint}/`, params);

                    // Handle standardized API response format
                    if (response && response.status && response.data) {
                        return response.data;
                    }

                    return response;
                }
            }

            // Fallback to generic content endpoint
            const response = await apiService.get('/content/', params);

            // Handle standardized API response format
            if (response && response.status && response.data) {
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error fetching recent content:', error);
            throw this.handleApiError(error, 'Failed to fetch recent content');
        } finally {
            this.setLoading(operation, false);
        }
    }

    // Get content statistics
    async getContentStats() {
        const operation = 'fetch-stats';
        this.setLoading(operation, true);

        try {
            const [blogs, caseStudies, conservation, dailyUpdates] = await Promise.all([
                this.fetchBlogs({ limit: 1, page: 1 }).catch(() => ({ result: [], totalPages: 0 })),
                this.fetchCaseStudies({ limit: 1, page: 1 }).catch(() => ({ result: [], totalPages: 0 })),
                this.fetchConservationEfforts({ limit: 1, page: 1 }).catch(() => ({ result: [], totalPages: 0 })),
                this.fetchDailyUpdates({ limit: 1, page: 1 }).catch(() => ({ result: [], totalPages: 0 }))
            ]);

            return {
                blogs: blogs.totalItems || blogs.total || (blogs.result ? blogs.result.length : 0),
                caseStudies: caseStudies.totalItems || caseStudies.total || (caseStudies.result ? caseStudies.result.length : 0),
                conservationEfforts: conservation.totalItems || conservation.total || (conservation.result ? conservation.result.length : 0),
                dailyUpdates: dailyUpdates.totalItems || dailyUpdates.total || (dailyUpdates.result ? dailyUpdates.result.length : 0)
            };
        } catch (error) {
            console.error('Error fetching content stats:', error);
            return {
                blogs: 0,
                caseStudies: 0,
                conservationEfforts: 0,
                dailyUpdates: 0
            };
        } finally {
            this.setLoading(operation, false);
        }
    }

    handleApiError(error, defaultMessage = 'An error occurred') {
        if (error.response) {
            const status = error.response.status
            const data = error.response.data

            // Use detail from response data if available
            if (data && data.detail) {
                return { message: data.detail }
            }

            const messages = {
                400: 'Invalid request',
                401: 'Authentication required',
                403: 'Access denied',
                404: 'Content not found',
                500: 'Server error. Please try again later.'
            }
            return { message: messages[status] || defaultMessage }
        }

        if (error.request) {
            return { message: 'Network error. Please check your connection.' }
        }

        return { message: error.message || defaultMessage }
    }

    // Get all content types for unified access
    async getAllContentTypes(params = {}) {
        const operation = 'fetch-all-types';
        this.setLoading(operation, true);

        try {
            const [blogs, caseStudies, conservation, dailyUpdates] = await Promise.all([
                this.fetchBlogs(params).catch(() => ({ result: [] })),
                this.fetchCaseStudies(params).catch(() => ({ result: [] })),
                this.fetchConservationEfforts(params).catch(() => ({ result: [] })),
                this.fetchDailyUpdates(params).catch(() => ({ result: [] }))
            ]);

            return {
                blogs: blogs.result || [],
                caseStudies: caseStudies.result || [],
                conservationEfforts: conservation.result || [],
                dailyUpdates: dailyUpdates.result || []
            };
        } catch (error) {
            console.error('Error fetching all content types:', error);
            throw this.handleApiError(error, 'Failed to fetch content');
        } finally {
            this.setLoading(operation, false);
        }
    }
}

// Create singleton instance
const contentService = new ContentService();
export default contentService;
