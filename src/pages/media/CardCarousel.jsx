import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '../../components/ui';
import { mediaService } from '../../services/mediaService.js';
import apiService from '../../services/api.js';

// 3D Carousel Container with perspective
const CarouselContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '100%',
    maxWidth: '1000px',
    height: '420px',
    margin: '0 auto',
    perspective: '1000px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('lg')]: {
        maxWidth: '800px',
        height: '380px',
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: '550px',
        height: '300px',
    },
    [theme.breakpoints.down('sm')]: {
        maxWidth: '320px',
        height: '220px',
    },
}));

// 3D Carousel Stage
const CarouselStage = styled('div')(({ rotation, theme }) => ({
    position: 'relative',
    width: '260px',
    height: '340px',
    transformStyle: 'preserve-3d',
    transform: `rotateY(${rotation}deg)`,
    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('lg')]: {
        width: '220px',
        height: '280px',
    },
    [theme.breakpoints.down('md')]: {
        width: '180px',
        height: '230px',
    },
    [theme.breakpoints.down('sm')]: {
        width: '140px',
        height: '180px',
    },
}));

// Individual Carousel Card
const CarouselCard = styled('div')(({ index, isActive, theme }) => {
    const angle = (index * 60) - 60; // 6 cards, 60 degrees apart
    const translateZ = 300;

    return {
        position: 'absolute',
        width: '240px',
        height: '320px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        overflow: 'hidden',
        transform: `rotateY(${angle}deg) translateZ(${translateZ}px)`,
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        border: isActive ? '3px solid rgba(255, 232, 161, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isActive
            ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 232, 161, 0.3)'
            : '0 10px 30px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            transform: `rotateY(${angle}deg) translateZ(${translateZ + 20}px) scale(1.02)`,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 232, 161, 0.2)',
        },
        [theme.breakpoints.down('lg')]: {
            width: '200px',
            height: '260px',
            transform: `rotateY(${angle}deg) translateZ(${translateZ * 0.8}px)`,
            '&:hover': {
                transform: `rotateY(${angle}deg) translateZ(${(translateZ * 0.8) + 15}px) scale(1.02)`,
            },
        },
        [theme.breakpoints.down('md')]: {
            width: '160px',
            height: '210px',
            transform: `rotateY(${angle}deg) translateZ(${translateZ * 0.6}px)`,
            '&:hover': {
                transform: `rotateY(${angle}deg) translateZ(${(translateZ * 0.6) + 10}px) scale(1.02)`,
            },
        },
        [theme.breakpoints.down('sm')]: {
            width: '120px',
            height: '160px',
            transform: `rotateY(${angle}deg) translateZ(${translateZ * 0.4}px)`,
            '&:hover': {
                transform: `rotateY(${angle}deg) translateZ(${(translateZ * 0.4) + 8}px) scale(1.02)`,
            },
        },
    };
});

// Card Image
const CardImage = styled('img')({
    width: '100%',
    height: '75%',
    objectFit: 'cover',
    borderRadius: '20px 20px 0 0',
});

// Card Content
const CardContent = styled('div')(({ isActive }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
    background: 'linear-gradient(135deg, rgba(30, 45, 39, 0.95) 0%, rgba(30, 45, 39, 0.8) 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0 0 20px 20px',
    backdropFilter: 'blur(10px)',
    padding: '8px',
}));

// Card Title
const CardTitle = styled('div')(({ isActive, theme }) => ({
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: isActive ? '16px' : '12px',
    letterSpacing: '0.5px',
    textAlign: 'center',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    marginBottom: '4px',
    [theme.breakpoints.down('md')]: {
        fontSize: isActive ? '12px' : '10px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: isActive ? '10px' : '8px',
    },
}));

// Card Subtitle (Photographer & National Park)
const CardSubtitle = styled('div')(({ isActive, theme }) => ({
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'DM Sans',
    fontWeight: '500',
    fontSize: isActive ? '12px' : '10px',
    letterSpacing: '0.3px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('md')]: {
        fontSize: isActive ? '10px' : '8px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: isActive ? '8px' : '6px',
    },
}));

// Loading state
const LoadingSpinner = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: 'rgba(255, 232, 161, 1)',
    fontSize: '1.2rem',
});

export const CardCarousel = ({ className, autoRotate = true, rotationInterval = 4000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [carouselData, setCarouselData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch media data from backend
    useEffect(() => {
        const fetchMediaData = async () => {
            try {
                setLoading(true);
                const media = await mediaService.getFeaturedImages();

                // Check if media is an array
                if (!Array.isArray(media) || media.length === 0) {
                    console.log('No featured media available');
                    setCarouselData([]);
                    setError(null);
                    setLoading(false);
                    return;
                }

                // Transform media data to match carousel format
                let transformedData = media.map(item => ({
                    id: item.id,
                    image: item.file_url,
                    title: item.title || 'Untitled',
                    alt: item.title || 'Wildlife Image',
                    photographer: item.photographer,
                    nationalPark: item.national_park
                }));

                // Ensure minimum 6 cards for better carousel presentation
                // Duplicate items if we have fewer than 6
                if (transformedData.length > 0 && transformedData.length < 6) {
                    const duplicates = [];
                    let duplicateCount = 0;
                    while (transformedData.length + duplicates.length < 6) {
                        const original = transformedData[duplicateCount % transformedData.length];
                        duplicates.push({
                            ...original,
                            id: `${original.id}-dup-${duplicateCount}`
                        });
                        duplicateCount++;
                    }
                    transformedData = [...transformedData, ...duplicates];
                }

                setCarouselData(transformedData);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch media data:', err);
                setError('Failed to load media');

                // Fallback to default data if API fails
                setCarouselData([
                    { id: 1, image: '/placeholder1.jpg', title: 'Bengal Tiger', alt: 'Bengal Tiger in natural habitat', photographer: 'Wildlife Photographer', nationalPark: 'Kaziranga National Park' },
                    { id: 2, image: '/placeholder2.jpg', title: 'Fox', alt: 'Beautiful wildlife bird', photographer: 'Nature Explorer', nationalPark: 'Jim Corbett National Park' },
                    { id: 3, image: '/placeholder3.jpg', title: 'Wildlife Bird', alt: 'Forest animal in the wild', photographer: 'Bird Watcher', nationalPark: 'Ranthambore National Park' },
                    { id: 4, image: '/placeholder4.jpg', title: 'Wild Elephant', alt: 'Elephant in natural setting', photographer: 'Elephant Lover', nationalPark: 'Periyar National Park' },
                    { id: 5, image: '/placeholder5.jpg', title: 'Nature Scene', alt: 'Beautiful nature landscape', photographer: 'Landscape Artist', nationalPark: 'Bandhavgarh National Park' },
                    { id: 6, image: '/placeholder6.jpg', title: 'Safari Life', alt: 'Safari wildlife scene', photographer: 'Safari Guide', nationalPark: 'Kanha National Park' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchMediaData();
    }, []);

    // Auto rotation effect
    useEffect(() => {
        if (!autoRotate || isHovered || carouselData.length === 0) return;

        const interval = setInterval(() => {
            nextSlide();
        }, rotationInterval);

        return () => clearInterval(interval);
    }, [currentIndex, autoRotate, isHovered, rotationInterval, carouselData.length]);

    const nextSlide = () => {
        if (carouselData.length === 0) return;
        const newIndex = (currentIndex + 1) % carouselData.length;
        setCurrentIndex(newIndex);
        setRotation(rotation - 60); // Rotate 60 degrees for each slide
    };

    const prevSlide = () => {
        if (carouselData.length === 0) return;
        const newIndex = currentIndex === 0 ? carouselData.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        setRotation(rotation + 60);
    };

    const goToSlide = (index) => {
        if (carouselData.length === 0) return;
        const diff = index - currentIndex;
        setCurrentIndex(index);
        setRotation(rotation - (diff * 60));
    };

    const handleCardClick = (index) => {
        if (index !== currentIndex) {
            goToSlide(index);
        }
    };

    const handleViewAllClick = () => {
        // Navigate to media collage page
        window.location.href = '/media-collage';
    };

    if (loading) {
        return (
            <CarouselContainer className={className}>
                <LoadingSpinner>
                    <i className="fas fa-spinner fa-spin"></i> Loading Media...
                </LoadingSpinner>
            </CarouselContainer>
        );
    }

    if (error && carouselData.length === 0) {
        return (
            <CarouselContainer className={className}>
                <div style={{ textAlign: 'center', color: 'rgba(255, 232, 161, 1)' }}>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                    <p>{error}</p>
                </div>
            </CarouselContainer>
        );
    }

    return (
        <CarouselContainer
            className={className}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Navigation Buttons */}
            <Button
                variant="outline"
                size="large"
                onClick={prevSlide}
                aria-label="Previous slide"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '20px',
                    transform: 'translateY(-50%)',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255, 232, 161, 1)',
                    backgroundColor: 'rgba(68, 122, 101, 0.95)',
                    color: 'rgba(255, 232, 161, 1)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    pointerEvents: 'auto',
                    boxShadow: '0 4px 20px rgba(68, 122, 101, 0.6)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    minWidth: '80px',
                    minHeight: '80px',
                    zIndex: 10
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 232, 161, 1)';
                    e.currentTarget.style.color = 'rgba(30, 45, 39, 1)';
                    e.currentTarget.style.boxShadow = '0 6px 30px rgba(255, 232, 161, 0.8)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(68, 122, 101, 0.95)';
                    e.currentTarget.style.color = 'rgba(255, 232, 161, 1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(68, 122, 101, 0.6)';
                }}
            >
                ❮
            </Button>
            <Button
                variant="outline"
                size="large"
                onClick={nextSlide}
                aria-label="Next slide"
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255, 232, 161, 1)',
                    backgroundColor: 'rgba(68, 122, 101, 0.95)',
                    color: 'rgba(255, 232, 161, 1)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    pointerEvents: 'auto',
                    boxShadow: '0 4px 20px rgba(68, 122, 101, 0.6)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    minWidth: '80px',
                    minHeight: '80px',
                    zIndex: 10
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 232, 161, 1)';
                    e.currentTarget.style.color = 'rgba(30, 45, 39, 1)';
                    e.currentTarget.style.boxShadow = '0 6px 30px rgba(255, 232, 161, 0.8)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(68, 122, 101, 0.95)';
                    e.currentTarget.style.color = 'rgba(255, 232, 161, 1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(68, 122, 101, 0.6)';
                }}
            >
                ❯
            </Button>

            {/* 3D Carousel Stage */}
            <CarouselStage rotation={rotation}>
                {carouselData.map((item, index) => (
                    <CarouselCard
                        key={item.id}
                        index={index}
                        isActive={index === currentIndex}
                        onClick={() => handleCardClick(index)}
                    >
                        <CardImage
                            src={item.image}
                            alt={item.alt}
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg'; // Fallback image
                            }}
                        />
                        <CardContent isActive={index === currentIndex}>
                            <CardTitle isActive={index === currentIndex}>
                                {item.title}
                            </CardTitle>
                            <CardSubtitle isActive={index === currentIndex}>
                                {item.photographer && item.nationalPark ?
                                    `${item.photographer} • ${item.nationalPark}` :
                                    item.photographer || item.nationalPark || 'Wildlife Photography'
                                }
                            </CardSubtitle>
                        </CardContent>
                    </CarouselCard>
                ))}
            </CarouselStage>

            {/* View All Button */}
            <Button
                variant="outline"
                size="medium"
                onClick={handleViewAllClick}
                style={{
                    position: 'absolute',
                    bottom: '-80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'rgba(255, 232, 161, 1)',
                    fontFamily: 'DM Sans',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    padding: '12px 24px',
                    border: '2px solid rgba(255, 232, 161, 0.8)',
                    borderRadius: '25px',
                    backgroundColor: 'rgba(30, 45, 39, 0.8)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer'
                }}
            >
                View All
            </Button>
        </CarouselContainer>
    );
};

export default CardCarousel; 