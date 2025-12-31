/**
 * Category Service
 * 
 * Handles all API interactions related to categories for the Myths vs Facts system.
 * This service provides methods to fetch categories, filter by MVF-enabled status,
 * and integrate with the category-based game selection.
 * 
 * Features:
 * - Fetch MVF-enabled categories
 * - Get category details with custom credits
 * - Handle featured categories
 * - Error handling and caching
 * 
 * @author Junglore Development Team
 * @version 1.0.0
 */
import { API_BASE_URL } from './api';

import apiService from './api.js';

class CategoryService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.mvfConfig = null; // Cache for MVF configuration
    }

    /**
     * Get MVF configuration from admin API
     * @returns {Promise<Object>} MVF configuration
     */
    async getMVFConfig() {
        if (this.mvfConfig) {
            return this.mvfConfig;
        }

        try {
            // Use the new public config endpoint (no authentication required)
            const response = await fetch(`${API_BASE_URL}/config/mvf`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.success && data.config) {
                    this.mvfConfig = data.config;
                    console.log('MVF config loaded from public API:', data.source, this.mvfConfig);
                    return this.mvfConfig;
                }
            }
        } catch (error) {
            console.warn('Public MVF config endpoint not available, using fallback values:', error.message);
        }

        // Fallback configuration
        this.mvfConfig = {
            baseCreditsPerGame: 3,
            basePointsPerCard: 5,
            dailyLimits: {
                maxGamesPerDay: 20,
                maxCreditsPerDay: 200,
                maxPointsPerDay: 500
            }
        };

        return this.mvfConfig;
    }

    /**
     * Get all categories enabled for Myths vs Facts
     * @param {Object} options - Query options
     * @returns {Promise<Array>} List of categories
     */
    async getMVFCategories(options = {}) {
        const cacheKey = 'mvf-categories';
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const params = {
                mvf_enabled: true,
                is_active: true,
                has_cards: true, // Only show categories that have myth-fact cards
                limit: 50,
                ...options
            };

            console.log('Fetching categories with params:', params);
            const response = await apiService.get('/categories/', params);
            console.log('Categories API response:', response);
            
            // Get MVF config for dynamic credits
            const mvfConfig = await this.getMVFConfig();
            const baseCredits = mvfConfig.baseCreditsPerGame || 3;
            
            // Validate response data
            let categoriesData = response.data;
            
            // Handle different response formats
            if (response && response.data) {
                categoriesData = response.data;
            } else if (Array.isArray(response)) {
                categoriesData = response;
            } else {
                console.warn('Unexpected response format:', response);
                categoriesData = [];
            }
            
            console.log('Processed categories data:', categoriesData);
            
            // Ensure we have an array
            if (!Array.isArray(categoriesData)) {
                console.warn('Categories data is not an array:', categoriesData);
                categoriesData = [];
            }
            
            // Apply dynamic credits from admin settings
            categoriesData = categoriesData.map(category => ({
                ...category,
                custom_credits: category.custom_credits || baseCredits // Use admin-configured base credits as fallback
            }));
            
            console.log('Categories with dynamic credits:', categoriesData);
            
            // Cache the response
            this.cache.set(cacheKey, {
                data: categoriesData,
                timestamp: Date.now()
            });

            return categoriesData;
        } catch (error) {
            console.error('Error fetching MVF categories:', error);
            
            // Get MVF config for fallback categories
            const mvfConfig = await this.getMVFConfig();
            const baseCredits = mvfConfig.baseCreditsPerGame || 3;
            
            // Return fallback categories for development/testing
            const fallbackCategories = [
                {
                    id: 'fallback-wildlife',
                    name: 'Wildlife Conservation',
                    description: 'Learn about protecting wildlife and their habitats',
                    custom_credits: baseCredits,
                    is_featured: true,
                    mvf_enabled: true,
                    is_active: true
                },
                {
                    id: 'fallback-marine',
                    name: 'Marine Conservation',
                    description: 'Discover ocean conservation and marine life protection',
                    custom_credits: baseCredits,
                    is_featured: false,
                    mvf_enabled: true,
                    is_active: true
                },
                {
                    id: 'fallback-forest',
                    name: 'Forest Conservation',
                    description: 'Explore forest ecosystems and tree conservation',
                    custom_credits: baseCredits,
                    is_featured: false,
                    mvf_enabled: true,
                    is_active: true
                },
                {
                    id: 'fallback-climate',
                    name: 'Climate Action',
                    description: 'Understanding climate change and environmental action',
                    custom_credits: baseCredits,
                    is_featured: false,
                    mvf_enabled: true,
                    is_active: true
                }
            ];
            
            console.log('Using fallback categories with dynamic credits:', fallbackCategories);
            
            // Cache the fallback result
            this.cache.set(cacheKey, {
                data: fallbackCategories,
                timestamp: Date.now()
            });
            
            return fallbackCategories;
        }
    }

    /**
     * Get featured category for auto-selection
     * @returns {Promise<Object|null>} Featured category or null
     */
    async getFeaturedCategory() {
        try {
            const categories = await this.getMVFCategories();
            return categories.find(category => category.is_featured) || null;
        } catch (error) {
            console.error('Error fetching featured category:', error);
            return null;
        }
    }

    /**
     * Get specific category by ID
     * @param {string} categoryId - Category UUID
     * @returns {Promise<Object>} Category details
     */
    async getCategoryById(categoryId) {
        const cacheKey = `category-${categoryId}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const response = await apiService.get(`/categories/${categoryId}/`);
            
            // Cache the response
            this.cache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now()
            });

            return response.data;
        } catch (error) {
            console.error(`Error fetching category ${categoryId}:`, error);
            throw new Error('Failed to load category details. Please try again.');
        }
    }

    /**
     * Get category by slug
     * @param {string} slug - Category slug
     * @returns {Promise<Object>} Category details
     */
    async getCategoryBySlug(slug) {
        try {
            const response = await apiService.get(`/categories/slug/${slug}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category with slug ${slug}:`, error);
            throw new Error('Failed to load category. Please try again.');
        }
    }

    /**
     * Get categories organized by type for UI display
     * @returns {Promise<Object>} Categories grouped by common types
     */
    async getCategoriesGrouped() {
        try {
            const categories = await this.getMVFCategories();
            
            // Group categories by common types
            const grouped = {
                wildlife: [],
                marine: [],
                forest: [],
                climate: [],
                other: []
            };

            categories.forEach(category => {
                const name = category.name.toLowerCase();
                if (name.includes('wildlife') || name.includes('animal')) {
                    grouped.wildlife.push(category);
                } else if (name.includes('marine') || name.includes('ocean') || name.includes('sea')) {
                    grouped.marine.push(category);
                } else if (name.includes('forest') || name.includes('tree') || name.includes('jungle')) {
                    grouped.forest.push(category);
                } else if (name.includes('climate') || name.includes('weather') || name.includes('environment')) {
                    grouped.climate.push(category);
                } else {
                    grouped.other.push(category);
                }
            });

            return grouped;
        } catch (error) {
            console.error('Error grouping categories:', error);
            throw error;
        }
    }

    /**
     * Get category statistics for display
     * @param {string} categoryId - Category UUID
     * @returns {Promise<Object>} Category statistics
     */
    async getCategoryStats(categoryId) {
        try {
            // This would typically come from a dedicated stats endpoint
            // For now, we'll return basic info
            const category = await this.getCategoryById(categoryId);
            
            return {
                name: category.name,
                credits: category.custom_credits || 3, // Default credits
                description: category.description,
                isFeatured: category.is_featured,
                isActive: category.is_active
            };
        } catch (error) {
            console.error(`Error fetching category stats for ${categoryId}:`, error);
            throw error;
        }
    }

    /**
     * Clear cache (useful for testing or when data updates)
     */
    clearCache() {
        this.cache.clear();
        this.mvfConfig = null; // Also clear MVF config cache
    }

    /**
     * Check if a category is valid for MVF game
     * @param {Object} category - Category object
     * @returns {boolean} Whether category is valid for MVF
     */
    isValidMVFCategory(category) {
        return category && 
               category.mvf_enabled === true && 
               category.is_active === true;
    }

    /**
     * Get default category for fallback
     * @returns {Promise<Object|null>} Default category or null
     */
    async getDefaultCategory() {
        try {
            // Try featured category first
            const featured = await this.getFeaturedCategory();
            if (featured) return featured;

            // Otherwise get first available category
            const categories = await this.getMVFCategories();
            return categories.length > 0 ? categories[0] : null;
        } catch (error) {
            console.error('Error getting default category:', error);
            return null;
        }
    }
}

// Create and export singleton instance
const categoryService = new CategoryService();
export default categoryService;