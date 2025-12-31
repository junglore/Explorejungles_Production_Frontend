/**
 * Custom hook for lazy loading images with intersection observer
 * Provides performance optimization for podcast carousel and detail pages
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export const useLazyImage = (src, options = {}) => {
    const {
        threshold = 0.1,
        rootMargin = '50px',
        placeholder = null,
        fallback = null,
        onLoad = null,
        onError = null
    } = options;

    const [imageSrc, setImageSrc] = useState(placeholder);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    // Intersection Observer callback
    const handleIntersection = useCallback((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
            setIsInView(true);
            // Disconnect observer once image is in view
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        }
    }, []);

    // Set up intersection observer
    useEffect(() => {
        const currentRef = imgRef.current;

        if (!currentRef || !src) return;

        // Create intersection observer
        observerRef.current = new IntersectionObserver(handleIntersection, {
            threshold,
            rootMargin
        });

        observerRef.current.observe(currentRef);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [src, threshold, rootMargin, handleIntersection]);

    // Load image when in view
    useEffect(() => {
        if (!isInView || !src || isLoaded) return;

        const img = new Image();

        img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
            setIsError(false);
            if (onLoad) onLoad();
        };

        img.onerror = () => {
            setIsError(true);
            if (fallback) {
                setImageSrc(fallback);
            }
            if (onError) onError();
        };

        img.src = src;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [isInView, src, isLoaded, fallback, onLoad, onError]);

    return {
        ref: imgRef,
        src: imageSrc,
        isLoaded,
        isError,
        isInView
    };
};

export default useLazyImage;