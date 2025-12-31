/**
 * Optimized Game Card Component for Myths vs Facts
 * Features improved image handling, performance optimizations, and better animations
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';

// Create alternating background patterns for visual variety
const backgroundPatterns = [
    // Pattern 1: Deep forest with mystical glow
    `linear-gradient(135deg, 
        rgba(20, 35, 29, 0.98) 0%, 
        rgba(35, 50, 44, 0.95) 30%, 
        rgba(25, 40, 34, 0.98) 70%, 
        rgba(15, 30, 24, 0.98) 100%
    ), 
    radial-gradient(circle at 25% 75%, rgba(109, 115, 83, 0.4) 0%, transparent 40%), 
    radial-gradient(circle at 75% 25%, rgba(157, 166, 120, 0.3) 0%, transparent 35%),
    radial-gradient(circle at 50% 50%, rgba(255, 232, 161, 0.05) 0%, transparent 60%)`,

    // Pattern 2: Jungle canopy with dappled light
    `linear-gradient(45deg, 
        rgba(40, 55, 49, 0.98) 0%, 
        rgba(55, 70, 64, 0.95) 25%, 
        rgba(45, 60, 54, 0.97) 60%, 
        rgba(35, 50, 44, 0.98) 100%
    ), 
    radial-gradient(circle at 20% 30%, rgba(157, 166, 120, 0.35) 0%, transparent 45%), 
    radial-gradient(circle at 80% 70%, rgba(109, 115, 83, 0.25) 0%, transparent 40%),
    radial-gradient(circle at 60% 20%, rgba(255, 232, 161, 0.08) 0%, transparent 50%)`
];

// Optimized card component with memoization
const StackCard = styled("div")({
    position: 'absolute',
    borderRadius: '32px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    '&:hover': {
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
    },
});

const CardContent = styled("div")({
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '30px 20px 20px',
    boxSizing: 'border-box',
});

const AnimalImageContainer = styled("div")({
    width: '300px',
    height: '250px',
    borderRadius: '20px',
    marginBottom: '20px',
    border: '2px solid rgba(255, 232, 161, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
});

const AnimalImage = styled("img")({
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: 'opacity 0.3s ease-in-out',
});

const ImagePlaceholder = styled("div")({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    color: 'rgba(255, 232, 161, 0.6)',
    fontSize: '16px',
    fontFamily: 'DM Sans',
    fontWeight: '500',
});

const LoadingSpinner = styled("div")({
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 232, 161, 0.3)',
    borderTop: '3px solid rgba(255, 232, 161, 0.8)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
    }
});

const CardLabel = styled("div")({
    textAlign: 'center',
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: 'DM Sans',
    fontWeight: '900',
    fontSize: '18px',
    textTransform: 'uppercase',
    fontStyle: 'italic',
    marginBottom: '20px',
    letterSpacing: '2px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
});

const CardText = styled("div")({
    textAlign: 'center',
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '28px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    padding: '0 10px',
    '@media (max-width: 768px)': {
        fontSize: '20px',
        lineHeight: '24px',
    },
    '@media (max-width: 480px)': {
        fontSize: '16px',
        lineHeight: '20px',
    },
});

// Dynamic card positions and sizes with performance optimization
const getCardStyle = (index, isAnimating, animationDirection) => {
    const positions = [
        { width: 315, height: 412, left: 0, top: 0, zIndex: 1 },
        { width: 314, height: 430, left: 50, top: 44, zIndex: 2 },
        { width: 320, height: 453, left: 100, top: 87, zIndex: 3 },
        { width: 395, height: 520, left: 143, top: 116, zIndex: 4 },
        { width: 415, height: 530, left: 156, top: 163, zIndex: 5 },
        { width: 400, height: 600, left: 200, top: 150, zIndex: 7 } // Top card
    ];

    const baseStyle = positions[index] || positions[5];
    const isTopCard = index === 5;

    // Calculate transform for top card animation
    let transform = 'translateY(0) scale(1)';
    let opacity = 1;
    let zIndex = baseStyle.zIndex;

    if (isAnimating && isTopCard) {
        if (animationDirection === 'left') {
            transform = 'translateX(-1500px) translateY(-150px) rotate(-35deg) scale(0.5)';
            opacity = 0.2;
            zIndex = 20;
        } else if (animationDirection === 'right') {
            transform = 'translateX(1500px) translateY(-150px) rotate(35deg) scale(0.5)';
            opacity = 0.2;
            zIndex = 20;
        }
    } else if (isAnimating && index < 5) {
        transform = 'translateY(-25px) scale(1.03)';
    } else if (isAnimating && isTopCard) {
        transform = 'translateY(-35px) scale(1.06)';
    }

    return {
        width: `${baseStyle.width}px`,
        height: `${baseStyle.height}px`,
        left: `${baseStyle.left}px`,
        top: `${baseStyle.top}px`,
        zIndex,
        transform,
        opacity,
        border: isTopCard ? '3px solid rgba(255, 232, 161, 0.8)' : 'none',
    };
};

// Optimized image component with error handling
const OptimizedImage = memo(({ src, alt, onLoad, onError }) => {
    const [imageState, setImageState] = useState('loading');
    const [imageSrc, setImageSrc] = useState(null);

    const handleImageLoad = useCallback(() => {
        setImageState('loaded');
        onLoad?.();
    }, [onLoad]);

    const handleImageError = useCallback(() => {
        setImageState('error');
        onError?.();
    }, [onError]);

    // Preload image
    React.useEffect(() => {
        if (!src) {
            setImageState('error');
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImageSrc(src);
            setImageState('loaded');
        };
        img.onerror = () => {
            setImageState('error');
        };
        img.src = src;
    }, [src]);

    return (
        <AnimalImageContainer>
            {imageState === 'loading' && (
                <ImagePlaceholder>
                    <LoadingSpinner />
                </ImagePlaceholder>
            )}
            {imageState === 'error' && (
                <ImagePlaceholder>
                    🐾 Image not available
                </ImagePlaceholder>
            )}
            {imageState === 'loaded' && imageSrc && (
                <AnimalImage
                    src={imageSrc}
                    alt={alt}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />
            )}
        </AnimalImageContainer>
    );
});

OptimizedImage.displayName = 'OptimizedImage';

// Main optimized game card component
const OptimizedGameCard = memo(({
    card,
    cardIndex = 0,
    stackIndex,
    isAnimating,
    animationDirection,
    onClick,
    isTopCard = false,
    preloadImages = true
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    // Memoize card style calculation with alternating background
    const cardStyle = useMemo(() => {
        const backgroundPattern = backgroundPatterns[cardIndex % backgroundPatterns.length];
        return {
            ...getCardStyle(stackIndex, isAnimating, animationDirection),
            background: backgroundPattern,
        };
    }, [cardIndex, stackIndex, isAnimating, animationDirection]);

    // Handle image load
    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    // Handle image error
    const handleImageError = useCallback(() => {
        console.warn(`Failed to load image for card: ${card?.id}`);
    }, [card?.id]);

    // Handle card click
    const handleClick = useCallback(() => {
        if (isTopCard && onClick && !isAnimating) {
            onClick();
        }
    }, [isTopCard, onClick, isAnimating]);

    // Don't render if no card data
    if (!card) return null;

    return (
        <StackCard
            style={cardStyle}
            onClick={handleClick}
            data-card-id={card.id}
            data-stack-index={stackIndex}
        >
            {isTopCard && (
                <CardContent>
                    {card.image_url && (
                        <OptimizedImage
                            src={card.image_url}
                            alt={card.title || 'Wildlife'}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    )}
                    <CardLabel>MYTHS VS FACTS</CardLabel>
                    <CardText>{card.text}</CardText>
                </CardContent>
            )}
        </StackCard>
    );
});

OptimizedGameCard.displayName = 'OptimizedGameCard';

export default OptimizedGameCard;