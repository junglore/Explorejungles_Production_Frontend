/**
 * Rewards Service for Junglore Frontend
 * Handles all rewards-related API calls including currency management, leaderboards, and achievements
 */

import apiService from './api.js';

class RewardsService {
    constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
        this.isLoading = false;
        this.loadingStates = new Map();
        this.cache = new Map();
        this.cacheTimeout = 2 * 60 * 1000; // 2 minutes for rewards data (more frequent updates)
        
        // Real-time update handlers
        this.updateHandlers = new Set();
    }

    // Loading state management
    setLoading(operation, isLoading) {
        this.loadingStates.set(operation, isLoading);
        this.isLoading = Array.from(this.loadingStates.values()).some(loading => loading);
    }

    getLoadingState(operation) {
        return this.loadingStates.get(operation) || false;
    }

    // Cache management with shorter timeout for rewards data
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
        this.notifyUpdateHandlers('cache-cleared');
    }

    // Real-time update system
    onUpdate(handler) {
        this.updateHandlers.add(handler);
        return () => this.updateHandlers.delete(handler);
    }

    notifyUpdateHandlers(type, data = null) {
        this.updateHandlers.forEach(handler => {
            try {
                handler({ type, data });
            } catch (error) {
                console.error('Error in rewards update handler:', error);
            }
        });
    }

    // Error handling
    handleApiError(error, defaultMessage = 'An error occurred') {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (data && data.detail) {
                return { message: data.detail, status };
            }

            const messages = {
                400: 'Invalid request data',
                401: 'Authentication required',
                403: 'Access denied',
                404: 'Resource not found',
                422: 'Validation failed',
                429: 'Rate limit exceeded',
                500: 'Server error occurred'
            };

            return {
                message: messages[status] || defaultMessage,
                status
            };
        }

        if (error.request) {
            return {
                message: 'Network error. Please check your connection.',
                status: 0
            };
        }

        return {
            message: error.message || defaultMessage,
            status: null
        };
    }

    /**
     * Get user's current currency balance
     * @returns {Promise<Object>} Balance object with points and credits
     */
    async getBalance() {
        const operation = 'fetch-balance';
        this.setLoading(operation, true);

        try {
            const cacheKey = 'user-balance';
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await apiService.get('/rewards/currency/balance');
            
            // Map API response fields to frontend expected format
            const mappedResponse = {
                points: response.points_balance || 0,
                credits: response.credits_balance || 0,
                total_points_earned: response.total_points_earned || 0,
                total_credits_earned: response.total_credits_earned || 0
            };
            
            this.setCachedData(cacheKey, mappedResponse);
            this.notifyUpdateHandlers('balance-updated', mappedResponse);

            return mappedResponse;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw this.handleApiError(error, 'Failed to fetch currency balance');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get user's transaction history
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Number of transactions to fetch
     * @param {number} params.offset - Number of transactions to skip
     * @param {string} params.currency_type - Filter by currency type (POINTS/CREDITS)
     * @param {string} params.transaction_type - Filter by transaction type (EARN/SPEND/PENALTY)
     * @returns {Promise<Object>} Transaction history with pagination
     */
    async getTransactionHistory(params = {}) {
        const operation = 'fetch-transactions';
        this.setLoading(operation, true);

        try {
            const defaultParams = {
                limit: 50,
                offset: 0,
                ...params
            };

            const cacheKey = `transactions-${JSON.stringify(defaultParams)}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await apiService.get('/rewards/currency/transactions', defaultParams);
            
            this.setCachedData(cacheKey, response);

            return response;
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            throw this.handleApiError(error, 'Failed to fetch transaction history');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get user's reward statistics
     * @returns {Promise<Object>} Reward statistics and achievements
     */
    async getStats() {
        const operation = 'fetch-stats';
        this.setLoading(operation, true);

        try {
            const cacheKey = 'user-stats';
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await apiService.get('/rewards/daily-summary');
            
            this.setCachedData(cacheKey, response);

            return response;
        } catch (error) {
            console.error('Error fetching reward stats:', error);
            throw this.handleApiError(error, 'Failed to fetch reward statistics');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get user's achievements
     * @returns {Promise<Array>} Array of achievement objects
     */
    async getAchievements() {
        const operation = 'fetch-achievements';
        this.setLoading(operation, true);

        try {
            const cacheKey = 'user-achievements';
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            // TODO: Implement achievements endpoint
            const response = { achievements: [], total_unlocked: 0, total_available: 0 };
            
            this.setCachedData(cacheKey, response);

            return response;
        } catch (error) {
            console.error('Error fetching achievements:', error);
            throw this.handleApiError(error, 'Failed to fetch achievements');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get leaderboard data
     * @param {string} type - Leaderboard type (global, weekly, monthly, quiz, category)
     * @param {Object} params - Additional parameters
     * @param {number} params.limit - Number of entries to fetch
     * @param {string} params.category_id - Category ID for category leaderboards
     * @returns {Promise<Object>} Leaderboard data with rankings
     */
    async getLeaderboard(type = 'global', params = {}) {
        const operation = `fetch-leaderboard-${type}`;
        this.setLoading(operation, true);

        try {
            const defaultParams = {
                limit: 50,
                ...params
            };

            const cacheKey = `leaderboard-${type}-${JSON.stringify(defaultParams)}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            let endpoint;
            switch (type) {
                case 'global':
                case 'alltime':
                    endpoint = '/leaderboards/alltime';
                    break;
                case 'weekly':
                    endpoint = '/leaderboards/weekly';
                    break;
                case 'monthly':
                    endpoint = '/leaderboards/monthly';
                    break;
                case 'quiz':
                    endpoint = '/rewards/leaderboard/quiz-performance';
                    break;
                case 'category':
                    endpoint = `/rewards/leaderboards/category/${params.category_id}`;
                    break;
                default:
                    throw new Error(`Unknown leaderboard type: ${type}`);
            }

            // Ensure limit doesn't exceed backend maximum of 100
            if (defaultParams.limit > 100) {
                defaultParams.limit = 100;
            }

            const response = await apiService.get(endpoint, defaultParams);
            
            this.setCachedData(cacheKey, response);

            return response;
        } catch (error) {
            console.error(`Error fetching ${type} leaderboard:`, error);
            throw this.handleApiError(error, `Failed to fetch ${type} leaderboard`);
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get user's current rank in different leaderboards
     * @returns {Promise<Object>} User rankings across different leaderboards
     */
    async getUserRankings() {
        const operation = 'fetch-user-rankings';
        this.setLoading(operation, true);

        try {
            const cacheKey = 'user-rankings';
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await apiService.get('/leaderboards/stats');
            
            this.setCachedData(cacheKey, response);

            return response;
        } catch (error) {
            console.error('Error fetching user rankings:', error);
            throw this.handleApiError(error, 'Failed to fetch user rankings');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Process a reward notification (typically called after quiz/game completion)
     * @param {Object} rewardData - Reward data from quiz/game completion
     * @returns {Promise<void>}
     */
    async processRewardNotification(rewardData) {
        try {
            // Clear balance cache to force refresh
            this.cache.delete('user-balance');
            this.cache.delete('user-stats');
            this.cache.delete('user-rankings');
            
            // Clear leaderboard caches
            for (const [key] of this.cache) {
                if (key.startsWith('leaderboard-')) {
                    this.cache.delete(key);
                }
            }

            // Notify handlers about new reward
            this.notifyUpdateHandlers('reward-earned', rewardData);

            // Fetch updated balance in background
            this.getBalance().catch(error => {
                console.error('Error refreshing balance after reward:', error);
            });

        } catch (error) {
            console.error('Error processing reward notification:', error);
        }
    }

    /**
     * Get reward configuration (for displaying tier information)
     * @returns {Promise<Object>} Reward configuration data
     */
    async getRewardConfig() {
        const operation = 'fetch-reward-config';
        this.setLoading(operation, true);

        try {
            const cacheKey = 'reward-config';
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await apiService.get('/rewards/rewards/available');
            
            // Cache with longer timeout since config doesn't change often
            this.cache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });

            return response;
        } catch (error) {
            console.error('Error fetching reward config:', error);
            throw this.handleApiError(error, 'Failed to fetch reward configuration');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get available reward tiers and their requirements
     * @returns {Object} Static reward tier information
     */
    getRewardTiers() {
        return {
            QUIZ_COMPLETION: {
                BRONZE: { min_score: 60, points: 5, credits: 1, color: '#CD7F32' },
                SILVER: { min_score: 75, points: 10, credits: 2, color: '#C0C0C0' },
                GOLD: { min_score: 90, points: 20, credits: 5, color: '#FFD700' },
                PLATINUM: { min_score: 100, points: 30, credits: 10, color: '#E5E4E2' }
            },
            MYTHS_FACTS_GAME: {
                BRONZE: { min_score: 60, points: 3, credits: 1, color: '#CD7F32' },
                SILVER: { min_score: 75, points: 6, credits: 1, color: '#C0C0C0' },
                GOLD: { min_score: 90, points: 12, credits: 3, color: '#FFD700' },
                PLATINUM: { min_score: 100, points: 18, credits: 5, color: '#E5E4E2' }
            }
        };
    }

    /**
     * Calculate what tier a score would achieve
     * @param {number} score - Score percentage (0-100)
     * @param {string} activityType - Type of activity (QUIZ_COMPLETION or MYTHS_FACTS_GAME)
     * @returns {Object|null} Tier information or null if no tier achieved
     */
    calculateTier(score, activityType = 'QUIZ_COMPLETION') {
        const tiers = this.getRewardTiers()[activityType];
        
        if (score >= 100) return { tier: 'PLATINUM', ...tiers.PLATINUM };
        if (score >= 90) return { tier: 'GOLD', ...tiers.GOLD };
        if (score >= 75) return { tier: 'SILVER', ...tiers.SILVER };
        if (score >= 60) return { tier: 'BRONZE', ...tiers.BRONZE };
        
        return null;
    }

    /**
     * Format currency amount with appropriate symbols
     * @param {number} amount - Currency amount
     * @param {string} type - Currency type (points/credits)
     * @returns {string} Formatted currency string
     */
    formatCurrency(amount, type) {
        const symbols = {
            points: '⭐',
            credits: '🪙'
        };

        const symbol = symbols[type.toLowerCase()] || '';
        return `${symbol} ${amount.toLocaleString()}`;
    }

    /**
     * Get user's position in a specific leaderboard
     * @param {string} leaderboardType - Type of leaderboard
     * @param {string} userId - User ID to find
     * @returns {Promise<number|null>} User's position (1-based) or null if not found
     */
    async getUserLeaderboardPosition(leaderboardType, userId) {
        try {
            // Use a reasonable limit that doesn't exceed backend maximum
            const leaderboard = await this.getLeaderboard(leaderboardType, { limit: 100 });
            
            if (leaderboard && leaderboard.participants) {
                const position = leaderboard.participants.findIndex(entry => entry.user_id === userId);
                return position !== -1 ? position + 1 : null;
            }

            return null;
        } catch (error) {
            console.error('Error getting user leaderboard position:', error);
            return null;
        }
    }

    /**
     * Clear user-specific cache (call after login/logout)
     */
    clearUserCache() {
        const userCacheKeys = [
            'user-balance',
            'user-stats', 
            'user-achievements',
            'user-rankings'
        ];

        userCacheKeys.forEach(key => this.cache.delete(key));

        // Clear user-specific transaction caches
        for (const [key] of this.cache) {
            if (key.startsWith('transactions-')) {
                this.cache.delete(key);
            }
        }

        this.notifyUpdateHandlers('user-cache-cleared');
    }

    /**
     * Get service statistics for debugging
     * @returns {Object} Service statistics
     */
    getServiceStats() {
        return {
            cacheSize: this.cache.size,
            loadingOperations: this.loadingStates.size,
            isLoading: this.isLoading,
            updateHandlers: this.updateHandlers.size
        };
    }

    /**
     * Validate reward data structure
     * @param {Object} rewardData - Reward data to validate
     * @returns {boolean} Whether the reward data is valid
     */
    validateRewardData(rewardData) {
        if (!rewardData || typeof rewardData !== 'object') {
            return false;
        }

        const requiredFields = ['points_earned', 'credits_earned'];
        return requiredFields.every(field => 
            rewardData.hasOwnProperty(field) && 
            typeof rewardData[field] === 'number' &&
            rewardData[field] >= 0
        );
    }

    /**
     * Subscribe to real-time reward updates (WebSocket would be implemented here in future)
     * @param {Function} callback - Callback for real-time updates
     * @returns {Function} Unsubscribe function
     */
    subscribeToUpdates(callback) {
        // For now, just use the update handler system
        // In the future, this could connect to WebSocket for real-time updates
        return this.onUpdate(callback);
    }

    /**
     * Update system settings (Admin only)
     * @param {Object} settingsData - Settings data containing rewards and antiGaming objects
     * @returns {Promise<Object>} Update result
     */
    async updateSystemSettings(settingsData) {
        const operation = 'update-system-settings';
        this.setLoading(operation, true);

        try {
            const response = await apiService.post('/admin/rewards/settings', settingsData);
            
            // Clear cache to force refresh of settings
            this.clearCache();
            this.notifyUpdateHandlers('settings-updated', response);

            return response;
        } catch (error) {
            console.error('Error updating system settings:', error);
            throw this.handleApiError(error, 'Failed to update system settings');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get system statistics for admin dashboard
     * @returns {Promise<Object>} System statistics
     */
    async getSystemStats() {
        const operation = 'fetch-system-stats';
        this.setLoading(operation, true);

        try {
            const cacheKey = 'system-stats';
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await apiService.get('/admin/rewards/dashboard');
            
            this.setCachedData(cacheKey, response);

            return response;
        } catch (error) {
            console.error('Error fetching system stats:', error);
            throw this.handleApiError(error, 'Failed to fetch system statistics');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get users list for admin management
     * @param {Object} params - Query parameters
     * @returns {Promise<Array>} Users list
     */
    async getUsersList(params = {}) {
        const operation = 'fetch-users-list';
        this.setLoading(operation, true);

        try {
            // This would typically be a separate admin/users endpoint
            // For now, return empty array as placeholder
            return [];
        } catch (error) {
            console.error('Error fetching users list:', error);
            throw this.handleApiError(error, 'Failed to fetch users list');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get recent activity for admin dashboard
     * @param {Object} params - Query parameters
     * @returns {Promise<Array>} Recent activity list
     */
    async getRecentActivity(params = {}) {
        const operation = 'fetch-recent-activity';
        this.setLoading(operation, true);

        try {
            const response = await apiService.get('/admin/rewards/transactions', params);
            
            return response.transactions || [];
        } catch (error) {
            console.error('Error fetching recent activity:', error);
            throw this.handleApiError(error, 'Failed to fetch recent activity');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Adjust user balance (Admin only)
     * @param {string} userId - User ID
     * @param {Object} adjustment - Adjustment data
     * @returns {Promise<Object>} Adjustment result
     */
    async adjustUserBalance(userId, adjustment) {
        const operation = 'adjust-user-balance';
        this.setLoading(operation, true);

        try {
            const response = await apiService.post(`/admin/rewards/manual-reward/${userId}`, {
                currency_type: adjustment.points !== 0 ? 'POINTS' : 'CREDITS',
                amount: Math.abs(adjustment.points || adjustment.credits),
                reason: adjustment.reason || 'Admin adjustment'
            });

            this.notifyUpdateHandlers('user-balance-adjusted', response);

            return response;
        } catch (error) {
            console.error('Error adjusting user balance:', error);
            throw this.handleApiError(error, 'Failed to adjust user balance');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Reset user progress (Admin only)
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Reset result
     */
    async resetUserProgress(userId) {
        const operation = 'reset-user-progress';
        this.setLoading(operation, true);

        try {
            // This would be implemented as a specific endpoint
            // For now, return success message
            const response = { message: 'User progress reset functionality not yet implemented' };
            
            this.notifyUpdateHandlers('user-progress-reset', { userId });

            return response;
        } catch (error) {
            console.error('Error resetting user progress:', error);
            throw this.handleApiError(error, 'Failed to reset user progress');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Refresh all cached data
     * @returns {Promise<void>}
     */
    async refreshAllData() {
        this.clearCache();
        
        // Pre-load essential data
        const promises = [
            this.getBalance(),
            this.getStats(),
            this.getUserRankings(),
            this.getLeaderboard('global', { limit: 10 })
        ];

        try {
            await Promise.all(promises);
            this.notifyUpdateHandlers('data-refreshed');
        } catch (error) {
            console.error('Error refreshing reward data:', error);
            throw this.handleApiError(error, 'Failed to refresh reward data');
        }
    }
}

// Create singleton instance
const rewardsService = new RewardsService();
export default rewardsService;