// /**
//  * Media Service for Junglore Frontend
//  * Handles all media-related API calls including uploads, gallery, and collage
//  */

import { API_BASE_URL } from './api.js';
// import apiService from './api.js';

// class MediaService {
//     constructor() {
//         this.baseURL = '/api/v1/media';
//     }

//     /**
//      * Get media files with filtering and pagination
//      */
//     async getMedia(options = {}) {
//         const {
//             skip = 0,
//             limit = 20,
//             mediaType = null,
//             search = null,
//             contentId = null,
//             photographer = null,
//             nationalPark = null
//         } = options;

//         const params = new URLSearchParams();
//         if (skip > 0) params.append('skip', skip);
//         if (limit !== 20) params.append('limit', limit);
//         if (mediaType) params.append('media_type', mediaType);
//         if (search) params.append('search', search);
//         if (contentId) params.append('content_id', contentId);
//         if (photographer) params.append('photographer', photographer);
//         if (nationalPark) params.append('national_park', nationalPark);

//         const url = `${this.baseURL}/?${params.toString()}`;
//         const media = await apiService.get(url);

//         // Transform URLs to include full backend URL for images
//         return media.map(item => ({
//             ...item,
//             file_url: this._buildFullImageUrl(item.file_url),
//             thumbnail_url: item.thumbnail_url ? this._buildFullImageUrl(item.thumbnail_url) : null
//         }));
//     }



//     /**
//      * Get specific media by ID
//      */
//     async getMediaById(mediaId) {
//         const url = `${this.baseURL}/${mediaId}`;
//         const media = await apiService.get(url);

//         // Transform URLs to include full backend URL for images
//         return {
//             ...media,
//             file_url: this._buildFullImageUrl(media.file_url),
//             thumbnail_url: media.thumbnail_url ? this._buildFullImageUrl(media.thumbnail_url) : null
//         };
//     }

//     /**
//      * Upload media file
//      */
//     async uploadMedia(file, metadata = {}) {
//         const formData = new FormData();
//         formData.append('file', file);

//         // Add metadata fields
//         if (metadata.title) formData.append('title', metadata.title);
//         if (metadata.description) formData.append('description', metadata.description);
//         if (metadata.photographer) formData.append('photographer', metadata.photographer);
//         if (metadata.nationalPark) formData.append('national_park', metadata.nationalPark);
//         if (metadata.contentId) formData.append('content_id', metadata.contentId);

//         const url = `${this.baseURL}/upload`;
//         return await apiService.post(url, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//     }

//     /**
//      * Create media record (for external URLs)
//      */
//     async createMedia(mediaData) {
//         const url = this.baseURL;
//         return await apiService.post(url, mediaData);
//     }

//     /**
//      * Update media record
//      */
//     async updateMedia(mediaId, mediaData) {
//         const url = `${this.baseURL}/${mediaId}`;
//         return await apiService.put(url, mediaData);
//     }

//     /**
//      * Delete media record
//      */
//     async deleteMedia(mediaId) {
//         const url = `${this.baseURL}/${mediaId}`;
//         return await apiService.delete(url);
//     }

//     /**
//      * Get featured images for carousel (first 6 images)
//      */
//     async getFeaturedImages() {
//         const options = {
//             skip: 0,
//             limit: 6,
//             mediaType: 'image'
//         };
//         const media = await this.getMedia(options);

//         // Transform URLs to include full backend URL for images
//         return media.map(item => ({
//             ...item,
//             file_url: this._buildFullImageUrl(item.file_url),
//             thumbnail_url: item.thumbnail_url ? this._buildFullImageUrl(item.thumbnail_url) : null
//         }));
//     }

//     /**
//      * Build full image URL from relative path
//      */
//     _buildFullImageUrl(relativeUrl) {
//         if (!relativeUrl) return null;

//         // If it's already a full URL, return as is
//         if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
//             return relativeUrl;
//         }

//         // If it's a relative path starting with /, construct full URL
//         if (relativeUrl.startsWith('/')) {
//             // Get the backend base URL from environment or default to localhost:8000
//             const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
//             return `${backendUrl}${relativeUrl}`;
//         }

//         // If it's a relative path without /, add it
//         const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
//         return `${backendUrl}/${relativeUrl}`;
//     }

//     /**
//      * Get media statistics
//      */
//     async getMediaStats() {
//         const url = `${this.baseURL}/stats`;
//         return await apiService.get(url);
//     }

//     /**
//      * Search media by photographer or national park
//      */
//     async searchMediaByPhotographer(photographer) {
//         return await this.getMedia({ search: photographer });
//     }

//     async searchMediaByNationalPark(nationalPark) {
//         return await this.getMedia({ search: nationalPark });
//     }

//     /**
//      * Get media by specific photographer and national park combination
//      */
//     async getMediaByLocation(photographer, nationalPark) {
//         const options = {
//             skip: 0,
//             limit: 100
//         };

//         const allMedia = await this.getMedia(options);

//         return allMedia.filter(media =>
//             media.photographer === photographer &&
//             media.national_park === nationalPark
//         );
//     }

//     /**
//      * Get all national parks from media
//      */
//     async getNationalParks() {
//         const allMedia = await this.getMedia({ limit: 1000 });
//         const parks = new Set();

//         allMedia.forEach(media => {
//             if (media.national_park) {
//                 parks.add(media.national_park);
//             }
//         });

//         return Array.from(parks).sort();
//     }

//     /**
//      * Get all photographers from media
//      */
//     async getPhotographers() {
//         const allMedia = await this.getMedia({ limit: 1000 });
//         const photographers = new Set();

//         allMedia.forEach(media => {
//             if (media.photographer) {
//                 photographers.add(media.photographer);
//             }
//         });

//         return Array.from(photographers).sort();
//     }

//     /**
//      * Format file size for display
//      */
//     formatFileSize(bytes) {
//         if (!bytes) return 'Unknown';

//         const units = ['B', 'KB', 'MB', 'GB', 'TB'];
//         let size = bytes;
//         let unitIndex = 0;

//         while (size >= 1024 && unitIndex < units.length - 1) {
//             size /= 1024;
//             unitIndex++;
//         }

//         return `${size.toFixed(1)} ${units[unitIndex]}`;
//     }

//     /**
//      * Get media type icon
//      */
//     getMediaTypeIcon(mediaType) {
//         const iconMap = {
//             'IMAGE': 'fas fa-image',
//             'image': 'fas fa-image',
//             'VIDEO': 'fas fa-video',
//             'video': 'fas fa-video',
//             'AUDIO': 'fas fa-music',
//             'audio': 'fas fa-music',
//             'PODCAST': 'fas fa-podcast',
//             'podcast': 'fas fa-podcast',
//             'DOCUMENT': 'fas fa-file',
//             'document': 'fas fa-file'
//         };

//         return iconMap[mediaType] || 'fas fa-file';
//     }

//     /**
//      * Validate file before upload
//      */
//     validateFile(file) {
//         // Different size limits for different file types
//         const isVideo = file.type.startsWith('video/');
//         const maxSize = isVideo ? 200 * 1024 * 1024 : 50 * 1024 * 1024; // 200MB for videos, 50MB for others

//         const allowedTypes = [
//             'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif',
//             'video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/flv',
//             'audio/mp3', 'audio/wav', 'audio/ogg'
//         ];

//         if (file.size > maxSize) {
//             throw new Error(`File size exceeds ${this.formatFileSize(maxSize)} limit`);
//         }

//         if (!allowedTypes.includes(file.type)) {
//             throw new Error('File type not supported');
//         }

//         return true;
//     }
// }

// // Export singleton instance
// export const mediaService = new MediaService();
// export default mediaService;


/**
 * Media Service for Junglore Frontend
 * Handles all media-related API calls including uploads, gallery, and collage
 * Enhanced with caching and performance optimizations
 */

import apiService from './api.js';
import cacheService from './cacheService.js';

class MediaService {
    constructor() {
        this.baseURL = '/media';
        // Request deduplication - prevent duplicate concurrent requests
        this.pendingRequests = new Map();
    }

    /**
     * Deduplicate concurrent identical requests
     */
    async deduplicateRequest(key, requestFn) {
        // If same request is already in flight, return the existing promise
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }

        // Create new request
        const promise = requestFn()
            .finally(() => {
                // Clean up after request completes
                this.pendingRequests.delete(key);
            });

        this.pendingRequests.set(key, promise);
        return promise;
    }

    /**
     * Get media files with filtering and pagination
     */
    async getMedia(options = {}) {
        const {
            skip = 0,
            limit = 20,
            mediaType = null,
            search = null,
            contentId = null,
            photographer = null,
            nationalPark = null
        } = options;

        const params = new URLSearchParams();
        if (skip > 0) params.append('skip', skip);
        if (limit !== 20) params.append('limit', limit);
        if (mediaType) params.append('media_type', mediaType);
        if (search) params.append('search', search);
        if (contentId) params.append('content_id', contentId);
        if (photographer) params.append('photographer', photographer);
        if (nationalPark) params.append('national_park', nationalPark);

        const url = `${this.baseURL}/?${params.toString()}`;
        const media = await apiService.get(url);

        // Ensure media is an array
        if (!Array.isArray(media)) {
            console.error('MediaService.getMedia - API returned non-array:', media);
            return [];
        }

        // Transform URLs to include full backend URL for images
        return media.map(item => ({
            ...item,
            file_url: this._buildFullImageUrl(item.file_url),
            thumbnail_url: item.thumbnail_url ? this._buildFullImageUrl(item.thumbnail_url) : null
        }));
    }



    /**
     * Get specific media by ID
     */
    async getMediaById(mediaId) {
        const url = `${this.baseURL}/${mediaId}`;
        const media = await apiService.get(url);

        // Transform URLs to include full backend URL for images
        return {
            ...media,
            file_url: this._buildFullImageUrl(media.file_url),
            thumbnail_url: media.thumbnail_url ? this._buildFullImageUrl(media.thumbnail_url) : null
        };
    }

    /**
     * Upload media file
     */
    async uploadMedia(file, metadata = {}) {
        const formData = new FormData();
        formData.append('file', file);

        // Add metadata fields
        if (metadata.title) formData.append('title', metadata.title);
        if (metadata.description) formData.append('description', metadata.description);
        if (metadata.photographer) formData.append('photographer', metadata.photographer);
        if (metadata.nationalPark) formData.append('national_park', metadata.nationalPark);
        if (metadata.contentId) formData.append('content_id', metadata.contentId);

        const url = `${this.baseURL}/upload`;
        return await apiService.postFormData(url, formData);
    }

    /**
     * Create media record (for external URLs)
     */
    async createMedia(mediaData) {
        const url = this.baseURL;
        return await apiService.post(url, mediaData);
    }

    /**
     * Update media record
     */
    async updateMedia(mediaId, mediaData) {
        const url = `${this.baseURL}/${mediaId}`;
        return await apiService.put(url, mediaData);
    }

    /**
     * Delete media record
     */
    async deleteMedia(mediaId) {
        const url = `${this.baseURL}/${mediaId}`;
        return await apiService.delete(url);
    }

    /**
     * Get featured images for carousel (first 6 images)
     */
    async getFeaturedImages() {
        const url = `${this.baseURL}/featured`;
        const media = await apiService.get(url);
        
        // Transform URLs to include full backend URL for images
        return media.map(item => ({
            ...item,
            file_url: this._buildFullImageUrl(item.file_url),
            thumbnail_url: item.thumbnail_url ? this._buildFullImageUrl(item.thumbnail_url) : null
        }));
    }

    /**
     * Build full image URL from relative path
     */
    _buildFullImageUrl(relativeUrl) {
        if (!relativeUrl) return null;

        // If it's already a full URL, return as is
        if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
            return relativeUrl;
        }

        // If it's a relative path starting with /, construct full URL
        if (relativeUrl.startsWith('/')) {
            // Get the backend base URL for static files (NOT the API base URL)
            const backendUrl = API_BASE_URL.replace('/api/v1', ''); // Remove API prefix for static files
            return `${backendUrl}${relativeUrl}`;
        }

        // If it's a relative path without /, add it
        const backendUrl = API_BASE_URL.replace('/api/v1', ''); // Remove API prefix for static files
        return `${backendUrl}/${relativeUrl}`;
    }

    /**
     * Get media statistics
     */
    async getMediaStats() {
        const url = `${this.baseURL}/stats`;
        return await apiService.get(url);
    }

    /**
     * Search media by photographer or national park
     */
    async searchMediaByPhotographer(photographer) {
        return await this.getMedia({ search: photographer });
    }

    async searchMediaByNationalPark(nationalPark) {
        return await this.getMedia({ search: nationalPark });
    }

    /**
     * Get media by specific photographer and national park combination
     */
    async getMediaByLocation(photographer, nationalPark) {
        const options = {
            skip: 0,
            limit: 100
        };

        const allMedia = await this.getMedia(options);

        return allMedia.filter(media =>
            media.photographer === photographer &&
            media.national_park === nationalPark
        );
    }

    /**
     * Get all national parks from media
     */
    async getNationalParks() {
        const allMedia = await this.getMedia({ limit: 100 });
        const parks = new Set();

        allMedia.forEach(media => {
            if (media.national_park) {
                parks.add(media.national_park);
            }
        });

        return Array.from(parks).sort();
    }

    /**
     * Get all photographers from media
     */
    async getPhotographers() {
        const allMedia = await this.getMedia({ limit: 100 });
        const photographers = new Set();

        allMedia.forEach(media => {
            if (media.photographer) {
                photographers.add(media.photographer);
            }
        });

        return Array.from(photographers).sort();
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (!bytes) return 'Unknown';

        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    /**
     * Get podcasts specifically for carousel display with caching
     */
    async getPodcastsForCarousel(limit = 6) {
        // Use request deduplication
        const requestKey = `podcast_carousel_${limit}`;
        
        return this.deduplicateRequest(requestKey, async () => {
            try {
                // Check cache first
                const cached = cacheService.getCachedPodcastCarousel(limit);
                if (cached) {
                    return cached;
                }

                const options = {
                    skip: 0,
                    limit: limit,
                    mediaType: 'PODCAST'
                };

                const podcasts = await this.getMedia(options);

                // Ensure podcasts is an array
                if (!Array.isArray(podcasts)) {
                    console.error('getPodcastsForCarousel: podcasts is not an array:', podcasts);
                    return [];
                }

                // Optimize podcast data for carousel display
                const optimizedPodcasts = podcasts.map(podcast => ({
                    ...podcast,
                    // Ensure proper image URLs for carousel
                    thumbnail_url: this._optimizeImageForCarousel(podcast.thumbnail_url),
                    file_url: this._buildFullImageUrl(podcast.file_url),
                    // Add carousel-specific metadata
                    display_title: this._truncateTitle(podcast.title, 50),
                    display_host: podcast.photographer || 'Unknown Host',
                    display_duration: this._formatDurationShort(podcast.duration)
                }));

                // Cache the results
                cacheService.cachePodcastCarousel(optimizedPodcasts, limit);

                return optimizedPodcasts;
            } catch (error) {
                console.error('Failed to fetch podcasts for carousel:', error);
                throw new Error(`Failed to load podcasts: ${error.message}`);
            }
        });
    }

    /**
     * Get specific podcast by ID with enhanced error handling and caching
     */
    async getPodcastById(podcastId, retryCount = 0) {
        const maxRetries = 3;

        try {
            if (!podcastId) {
                throw new Error('Podcast ID is required');
            }

            // Check cache first
            const cached = cacheService.getCachedPodcastDetail(podcastId);
            if (cached) {
                return cached;
            }

            const podcast = await this.getMediaById(podcastId);

            // Validate that this is actually a podcast
            if (podcast.media_type !== 'PODCAST') {
                throw new Error('The requested content is not a podcast');
            }

            // Enhance podcast data with optimized URLs and metadata
            const enhancedPodcast = {
                ...podcast,
                file_url: this._buildFullImageUrl(podcast.file_url),
                thumbnail_url: podcast.thumbnail_url ? this._buildFullImageUrl(podcast.thumbnail_url) : null,
                // Add podcast-specific enhancements
                optimized_audio_url: this._optimizeAudioUrl(podcast.file_url),
                formatted_duration: this._formatDurationFull(podcast.duration),
                formatted_date: this._formatPodcastDate(podcast.created_at),
                host_name: podcast.photographer || 'Unknown Host',
                show_name: podcast.national_park || 'Junglore Podcast'
            };

            // Cache the enhanced podcast data
            cacheService.cachePodcastDetail(podcastId, enhancedPodcast);

            return enhancedPodcast;
        } catch (error) {
            console.error(`Failed to fetch podcast ${podcastId}:`, error);

            // Implement retry logic for network errors
            if (retryCount < maxRetries && this._isRetryableError(error)) {
                console.log(`Retrying podcast fetch (attempt ${retryCount + 1}/${maxRetries})`);
                await this._delay(1000 * (retryCount + 1)); // Exponential backoff
                return this.getPodcastById(podcastId, retryCount + 1);
            }

            // Enhance error messages for better user experience
            if (error.message.includes('404') || error.message.includes('not found')) {
                throw new Error('Podcast not found. It may have been removed or the link is incorrect.');
            } else if (error.message.includes('403') || error.message.includes('forbidden')) {
                throw new Error('Access denied to this podcast. Please check your permissions.');
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                throw new Error('Network error. Please check your connection and try again.');
            } else {
                throw new Error(`Failed to load podcast: ${error.message}`);
            }
        }
    }

    /**
     * Get all podcasts with filtering and search with caching
     */
    async getPodcasts(options = {}) {
        try {
            // Check cache first
            const cached = cacheService.getCachedPodcastList(options);
            if (cached) {
                return cached;
            }

            const podcastOptions = {
                ...options,
                mediaType: 'PODCAST'
            };

            const podcasts = await this.getMedia(podcastOptions);

            // Enhance podcast data
            const enhancedPodcasts = podcasts.map(podcast => ({
                ...podcast,
                file_url: this._buildFullImageUrl(podcast.file_url),
                thumbnail_url: podcast.thumbnail_url ? this._buildFullImageUrl(podcast.thumbnail_url) : null,
                host_name: podcast.photographer || 'Unknown Host',
                show_name: podcast.national_park || 'Junglore Podcast',
                formatted_duration: this._formatDurationFull(podcast.duration)
            }));

            // Cache the results
            cacheService.cachePodcastList(enhancedPodcasts, options);

            return enhancedPodcasts;
        } catch (error) {
            console.error('Failed to fetch podcasts:', error);
            throw new Error(`Failed to load podcasts: ${error.message}`);
        }
    }

    /**
     * Search podcasts by title, host, or show name with caching
     */
    async searchPodcasts(query, options = {}) {
        try {
            // Check cache first
            const cached = cacheService.getCachedSearchResults(query, options);
            if (cached) {
                return cached;
            }

            const searchOptions = {
                ...options,
                mediaType: 'PODCAST',
                search: query
            };

            const results = await this.getPodcasts(searchOptions);

            // Cache search results
            cacheService.cacheSearchResults(query, results, options);

            return results;
        } catch (error) {
            console.error('Failed to search podcasts:', error);
            throw new Error(`Failed to search podcasts: ${error.message}`);
        }
    }

    /**
     * Optimize image URL for carousel display
     */
    _optimizeImageForCarousel(imageUrl) {
        if (!imageUrl) return null;

        const fullUrl = this._buildFullImageUrl(imageUrl);

        // Add query parameters for image optimization if needed
        // This could be enhanced to use different image sizes for carousel
        return fullUrl;
    }

    /**
     * Optimize audio URL for better streaming
     */
    _optimizeAudioUrl(audioUrl) {
        if (!audioUrl) return null;

        const fullUrl = this._buildFullImageUrl(audioUrl);

        // Add streaming optimization parameters if needed
        return fullUrl;
    }

    /**
     * Format duration for short display (carousel)
     */
    _formatDurationShort(seconds) {
        if (!seconds) return '';

        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else {
            return `${minutes}m`;
        }
    }

    /**
     * Format duration for full display (detail page)
     */
    _formatDurationFull(seconds) {
        if (!seconds) return 'Unknown duration';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }

    /**
     * Format date for podcast display
     */
    _formatPodcastDate(dateString) {
        if (!dateString) return 'Recent';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Recent';
        }
    }

    /**
     * Truncate title for display
     */
    _truncateTitle(title, maxLength) {
        if (!title) return '';
        if (title.length <= maxLength) return title;

        return title.substring(0, maxLength - 3) + '...';
    }

    /**
     * Check if error is retryable
     */
    _isRetryableError(error) {
        const retryableErrors = [
            'network',
            'timeout',
            'connection',
            'fetch',
            '500',
            '502',
            '503',
            '504'
        ];

        const errorMessage = error.message.toLowerCase();
        return retryableErrors.some(retryableError =>
            errorMessage.includes(retryableError)
        );
    }

    /**
     * Delay utility for retry logic
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get media type icon
     */
    getMediaTypeIcon(mediaType) {
        const iconMap = {
            'IMAGE': 'fas fa-image',
            'image': 'fas fa-image',
            'VIDEO': 'fas fa-video',
            'video': 'fas fa-video',
            'AUDIO': 'fas fa-music',
            'audio': 'fas fa-music',
            'PODCAST': 'fas fa-podcast',
            'podcast': 'fas fa-podcast',
            'DOCUMENT': 'fas fa-file',
            'document': 'fas fa-file'
        };

        return iconMap[mediaType] || 'fas fa-file';
    }

    /**
     * Validate file before upload
     */
    validateFile(file) {
        // Different size limits for different file types
        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? 200 * 1024 * 1024 : 50 * 1024 * 1024; // 200MB for videos, 50MB for others

        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif',
            'video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/flv',
            'audio/mp3', 'audio/wav', 'audio/ogg'
        ];

        if (file.size > maxSize) {
            throw new Error(`File size exceeds ${this.formatFileSize(maxSize)} limit`);
        }

        if (!allowedTypes.includes(file.type)) {
            throw new Error('File type not supported');
        }

        return true;
    }

    /**
     * Cache management methods
     */

    // Clear all podcast-related caches
    clearPodcastCache() {
        cacheService.invalidatePodcastCaches();
    }

    // Clear specific podcast cache
    clearPodcastDetailCache(podcastId) {
        cacheService.invalidatePodcastCaches(podcastId);
    }

    // Get cache statistics
    getCacheStats() {
        return cacheService.getStats();
    }

    // Preload podcast data for better performance
    async preloadPodcastData(podcastIds = []) {
        const preloadPromises = podcastIds.map(async (id) => {
            try {
                // Only preload if not already cached
                if (!cacheService.getCachedPodcastDetail(id)) {
                    await this.getPodcastById(id);
                }
            } catch (error) {
                console.warn(`Failed to preload podcast ${id}:`, error);
            }
        });

        await Promise.allSettled(preloadPromises);
    }
}

// Export singleton instance
export const mediaService = new MediaService();
export default mediaService;