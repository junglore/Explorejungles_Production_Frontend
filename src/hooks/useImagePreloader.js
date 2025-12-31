/**
 * Custom hook for preloading images to improve game performance
 * Ensures smooth card transitions by loading images in advance
 */

import { useState, useEffect, useCallback } from 'react';

export const useImagePreloader = (imageUrls = []) => {
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [failedImages, setFailedImages] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    // Preload a single image
    const preloadImage = useCallback((url) => {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject(new Error('No URL provided'));
                return;
            }

            // Check if already loaded
            if (loadedImages.has(url)) {
                resolve(url);
                return;
            }

            const img = new Image();

            img.onload = () => {
                setLoadedImages(prev => new Set([...prev, url]));
                resolve(url);
            };

            img.onerror = () => {
                setFailedImages(prev => new Set([...prev, url]));
                reject(new Error(`Failed to load image: ${url}`));
            };

            // Set crossOrigin for external images
            if (url.startsWith('http')) {
                img.crossOrigin = 'anonymous';
            }

            img.src = url;
        });
    }, [loadedImages]);

    // Preload multiple images with progress tracking
    const preloadImages = useCallback(async (urls) => {
        if (!urls || urls.length === 0) return;

        setIsLoading(true);
        setLoadProgress(0);

        const validUrls = urls.filter(url => url && typeof url === 'string');
        let loadedCount = 0;

        const loadPromises = validUrls.map(async (url) => {
            try {
                await preloadImage(url);
                loadedCount++;
                setLoadProgress((loadedCount / validUrls.length) * 100);
            } catch (error) {
                console.warn(`Failed to preload image: ${url}`, error);
                loadedCount++;
                setLoadProgress((loadedCount / validUrls.length) * 100);
            }
        });

        try {
            await Promise.allSettled(loadPromises);
        } finally {
            setIsLoading(false);
        }
    }, [preloadImage]);

    // Auto-preload when imageUrls change
    useEffect(() => {
        if (imageUrls.length > 0) {
            preloadImages(imageUrls);
        }
    }, [imageUrls, preloadImages]);

    // Check if image is loaded
    const isImageLoaded = useCallback((url) => {
        return loadedImages.has(url);
    }, [loadedImages]);

    // Check if image failed to load
    const isImageFailed = useCallback((url) => {
        return failedImages.has(url);
    }, [failedImages]);

    // Get loading status for specific image
    const getImageStatus = useCallback((url) => {
        if (isImageLoaded(url)) return 'loaded';
        if (isImageFailed(url)) return 'failed';
        return 'loading';
    }, [isImageLoaded, isImageFailed]);

    // Clear cache
    const clearCache = useCallback(() => {
        setLoadedImages(new Set());
        setFailedImages(new Set());
        setLoadProgress(0);
    }, []);

    // Preload next batch of images (for pagination)
    const preloadNextBatch = useCallback((nextUrls) => {
        const newUrls = nextUrls.filter(url =>
            !loadedImages.has(url) && !failedImages.has(url)
        );

        if (newUrls.length > 0) {
            preloadImages(newUrls);
        }
    }, [loadedImages, failedImages, preloadImages]);

    return {
        // State
        loadedImages: Array.from(loadedImages),
        failedImages: Array.from(failedImages),
        isLoading,
        loadProgress,

        // Actions
        preloadImage,
        preloadImages,
        preloadNextBatch,
        clearCache,

        // Utilities
        isImageLoaded,
        isImageFailed,
        getImageStatus,
        totalImages: imageUrls.length,
        loadedCount: loadedImages.size,
        failedCount: failedImages.size,
        successRate: imageUrls.length > 0 ?
            Math.round((loadedImages.size / imageUrls.length) * 100) : 0
    };
};