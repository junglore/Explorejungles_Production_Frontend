/**
 * Image Utility Functions for Junglore Frontend
 * Handles image URL construction and validation
 */
import { API_BASE_URL } from '../services/api';

/**
 * Build full image URL from relative path
 * @param {string} relativeUrl - The relative URL path from the backend
 * @returns {string|null} - Full URL or null if invalid
 */
export const buildImageUrl = (relativeUrl) => {
    if (!relativeUrl || typeof relativeUrl !== 'string') {
        return null;
    }

    // Clean up the URL
    const cleanUrl = relativeUrl.trim();

    // If it's already a full URL, return as is
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        return cleanUrl;
    }

    // Get the backend base URL for static files (NOT the API base URL)
    // Static files are served from root, not from /api/v1
    const backendUrl = API_BASE_URL.replace('/api/v1', ''); // Remove API prefix for static files
    const cleanBaseUrl = backendUrl.replace(/\/$/, ''); // Remove trailing slash

    // Handle different path formats
    let fullUrl;
    if (cleanUrl.startsWith('/')) {
        // Path starts with slash - use as is
        fullUrl = `${cleanBaseUrl}${cleanUrl}`;
    } else if (cleanUrl.startsWith('uploads/')) {
        // Path already includes uploads prefix
        fullUrl = `${cleanBaseUrl}/${cleanUrl}`;
    } else if (cleanUrl.startsWith('images/') || cleanUrl.startsWith('videos/') || cleanUrl.startsWith('audio/')) {
        // Backend returns paths like 'images/filename.jpg' but actual path is 'uploads/images/filename.jpg'
        fullUrl = `${cleanBaseUrl}/uploads/${cleanUrl}`;
    } else {
        // Default case - assume it's a filename that needs uploads prefix
        fullUrl = `${cleanBaseUrl}/uploads/${cleanUrl}`;
    }

    return fullUrl;
};

/**
 * Build thumbnail URL from main image URL
 * @param {string} imageUrl - The main image URL
 * @returns {string|null} - Thumbnail URL or null if invalid
 */
export const buildThumbnailUrl = (imageUrl) => {
    if (!imageUrl) return null;

    const fullImageUrl = buildImageUrl(imageUrl);
    if (!fullImageUrl) return null;

    // Replace the directory with thumbnails directory
    return fullImageUrl.replace('/uploads/images/', '/uploads/thumbnails/');
};

/**
 * Get placeholder image based on content type
 * @param {string} contentType - The type of content (blog, case-study, conservation-effort, daily-news)
 * @returns {string} - Placeholder text or emoji
 */
export const getContentPlaceholder = (contentType) => {
    const placeholders = {
        'blog': '📝 Blog Banner',
        'case-study': '📊 Case Study Banner',
        'conservation-effort': '🌿 Conservation Banner',
        'daily-news': '📰 News Banner',
        'default': '🖼️ Image Banner'
    };

    return placeholders[contentType] || placeholders.default;
};

/**
 * Validate if URL is accessible
 * @param {string} url - The URL to validate
 * @returns {Promise<boolean>} - Whether the URL is accessible
 */
export const validateImageUrl = async (url) => {
    if (!url) return false;

    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.warn('Image URL validation failed:', url, error);
        return false;
    }
};

/**
 * Preload image for better UX
 * @param {string} url - The image URL to preload
 * @returns {Promise<boolean>} - Whether preloading was successful
 */
export const preloadImage = (url) => {
    return new Promise((resolve) => {
        if (!url) {
            resolve(false);
            return;
        }

        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

export default {
    buildImageUrl,
    buildThumbnailUrl,
    getContentPlaceholder,
    validateImageUrl,
    preloadImage
};