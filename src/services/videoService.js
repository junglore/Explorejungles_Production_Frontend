/**
 * Video Service for Knowledge Videos
 * Handles API calls for video series and channel videos
 */

import api from './api';

const videoService = {
    /**
     * Get all videos (series + channel videos)
     * @param {Object} params - Query parameters
     * @param {string} params.search - Search query for title/subtitle/description
     * @param {string} params.category - Category filter (tag name or "series")
     * @returns {Promise<Object>} Videos list with metadata
     */
    async getAllVideos(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.search) {
                queryParams.append('search', params.search);
            }
            
            if (params.category && params.category !== 'all') {
                queryParams.append('category', params.category);
            }
            
            const queryString = queryParams.toString();
            const endpoint = queryString ? `/videos?${queryString}` : '/videos';
            
            // Get user ID from localStorage to fetch progress
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : '00000000-0000-0000-0000-000000000000';
            
            const response = await api.request(endpoint, {
                method: 'GET',
                headers: {
                    'X-User-ID': userId
                }
            });
            return response; // api.get() returns data directly, not wrapped in .data
        } catch (error) {
            console.error('Error fetching videos:', error);
            throw error;
        }
    },

    /**
     * Get all video categories (tags) with counts
     * @returns {Promise<Object>} Categories list
     */
    async getCategories() {
        try {
            const response = await api.get('/videos/categories');
            return response; // api.get() returns data directly, not wrapped in .data
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    /**
     * Format duration from seconds to MM:SS or HH:MM:SS
     * @param {number} seconds - Duration in seconds
     * @returns {string} Formatted duration
     */
    formatDuration(seconds) {
        if (!seconds || seconds === 0) return '0:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    },

    /**
     * Format view count to readable format (e.g., 1.2K, 3.4M)
     * @param {number} views - View count
     * @returns {string} Formatted view count
     */
    formatViews(views) {
        if (!views || views === 0) return '0';
        
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M`;
        }
        
        if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`;
        }
        
        return views.toString();
    },

    /**
     * Get featured series with user progress
     * @returns {Promise<Object>} Featured series data
     */
    async getFeaturedSeries() {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : '00000000-0000-0000-0000-000000000000';
            
            const response = await api.request('/videos/featured-series', {
                method: 'GET',
                headers: {
                    'X-User-ID': userId
                }
            });
            return response;
        } catch (error) {
            console.error('Error fetching featured series:', error);
            throw error;
        }
    },

    /**
     * Get recent watched videos for General Knowledge section
     * @param {number} limit - Number of videos to return (default 3)
     * @returns {Promise<Object>} Recent watched videos
     */
    async getRecentWatched(limit = 3) {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : '00000000-0000-0000-0000-000000000000';
            
            const response = await api.request(`/videos/recent-watched?limit=${limit}`, {
                method: 'GET',
                headers: {
                    'X-User-ID': userId
                }
            });
            return response;
        } catch (error) {
            console.error('Error fetching recent watched videos:', error);
            throw error;
        }
    }
};

export default videoService;