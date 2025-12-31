/**
 * Lazy Loading Image Component
 * Optimized for podcast carousel and detail pages
 */

import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import useLazyImage from '../../hooks/useLazyImage';

// Styled components
const ImageContainer = styled('div')(({ width, height, borderRadius }) => ({
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
    borderRadius: borderRadius || '0',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const Image = styled('img')(({ isLoaded, borderRadius }) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: borderRadius || '0',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
    '&:hover': {
        transform: 'scale(1.02)'
    }
}));

const PlaceholderContainer = styled('div')(({ isVisible }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none'
}));

const LoadingSpinner = styled('div')({
    width: '24px',
    height: '24px',
    border: '2px solid rgba(255, 232, 161, 0.3)',
    borderTop: '2px solid rgba(255, 232, 161, 0.8)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
    }
});

const PlaceholderIcon = styled('div')({
    fontSize: '32px',
    color: 'rgba(255, 232, 161, 0.6)',
    textAlign: 'center'
});

const ErrorContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: 'rgba(255, 232, 161, 0.7)',
    fontSize: '12px',
    textAlign: 'center',
    padding: '16px'
});

const RetryButton = styled('button')({
    background: 'rgba(255, 232, 161, 0.2)',
    border: '1px solid rgba(255, 232, 161, 0.4)',
    color: 'rgba(255, 232, 161, 0.8)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 232, 161, 0.3)',
        borderColor: 'rgba(255, 232, 161, 0.6)'
    }
});

const LazyImage = React.forwardRef(({
    src,
    alt = '',
    width,
    height,
    borderRadius,
    placeholder = '🎧',
    fallback = null,
    className,
    style,
    onLoad,
    onError,
    threshold = 0.1,
    rootMargin = '50px',
    enableRetry = true,
    ...props
}, forwardedRef) => {
    const [retryCount, setRetryCount] = useState(0);
    const [currentSrc, setCurrentSrc] = useState(src);
    const maxRetries = 3;

    const {
        ref: internalRef,
        src: imageSrc,
        isLoaded,
        isError,
        isInView
    } = useLazyImage(currentSrc, {
        threshold,
        rootMargin,
        placeholder: null, // We handle placeholder ourselves
        fallback,
        onLoad: () => {
            setRetryCount(0);
            if (onLoad) onLoad();
        },
        onError: (error) => {
            if (onError) onError(error);
        }
    });

    // Handle retry logic
    const handleRetry = () => {
        if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
            // Add cache busting parameter
            const separator = currentSrc.includes('?') ? '&' : '?';
            setCurrentSrc(`${src}${separator}retry=${retryCount + 1}&t=${Date.now()}`);
        }
    };

    // Reset retry count when src changes
    useEffect(() => {
        setRetryCount(0);
        setCurrentSrc(src);
    }, [src]);

    const showPlaceholder = !isLoaded && !isError;
    const showError = isError && retryCount >= maxRetries;
    const showRetryableError = isError && retryCount < maxRetries && enableRetry;

    // Merge refs
    const mergedRef = (node) => {
        if (internalRef) {
            if (typeof internalRef === 'function') {
                internalRef(node);
            } else {
                internalRef.current = node;
            }
        }
        if (forwardedRef) {
            if (typeof forwardedRef === 'function') {
                forwardedRef(node);
            } else {
                forwardedRef.current = node;
            }
        }
    };

    return (
        <ImageContainer
            ref={mergedRef}
            width={width}
            height={height}
            borderRadius={borderRadius}
            className={className}
            style={style}
            {...props}
        >
            {/* Main image */}
            {imageSrc && (
                <Image
                    src={imageSrc}
                    alt={alt}
                    isLoaded={isLoaded}
                    borderRadius={borderRadius}
                    loading="lazy"
                    decoding="async"
                />
            )}

            {/* Loading placeholder */}
            <PlaceholderContainer isVisible={showPlaceholder}>
                {isInView ? (
                    <LoadingSpinner />
                ) : (
                    <PlaceholderIcon>
                        {placeholder}
                    </PlaceholderIcon>
                )}
            </PlaceholderContainer>

            {/* Error state with retry */}
            {showRetryableError && (
                <PlaceholderContainer isVisible={true}>
                    <ErrorContainer>
                        <PlaceholderIcon>⚠️</PlaceholderIcon>
                        <div>Failed to load</div>
                        <RetryButton onClick={handleRetry}>
                            Retry ({maxRetries - retryCount} left)
                        </RetryButton>
                    </ErrorContainer>
                </PlaceholderContainer>
            )}

            {/* Final error state */}
            {showError && (
                <PlaceholderContainer isVisible={true}>
                    <ErrorContainer>
                        <PlaceholderIcon>❌</PlaceholderIcon>
                        <div>Image unavailable</div>
                    </ErrorContainer>
                </PlaceholderContainer>
            )}
        </ImageContainer>
    );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;