import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '../../components/ui';
import { mediaService } from '../../services/mediaService.js';
import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import ImageViewer from '../../components/ui/ImageViewer.jsx';

// Page Container
const PageContainer = styled('div')({
    backgroundColor: 'rgba(30, 45, 39, 1)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
});

// Hero Section
const HeroSection = styled('div')({
    background: 'linear-gradient(135deg, rgba(30, 45, 39, 0.95) 0%, rgba(30, 45, 39, 0.8) 100%)',
    padding: '120px 40px 80px',
    textAlign: 'center',
    position: 'relative',
    borderBottom: '2px solid rgba(255, 232, 161, 0.3)',
});

const HeroTitle = styled('h1')({
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: '"DM Sans", Helvetica',
    fontWeight: '700',
    fontSize: '3.5rem',
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    '@media (max-width: 768px)': {
        fontSize: '2.5rem',
        letterSpacing: '2px',
    },
});

const HeroSubtitle = styled('p')({
    color: 'rgba(255, 232, 161, 0.9)',
    fontFamily: '"DM Sans", Helvetica',
    fontSize: '1.3rem',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.8',
    fontWeight: '400',
});

// Controls Section
const ControlsSection = styled('div')({
    padding: '2rem 8%',
    backgroundColor: 'rgba(30, 45, 39, 0.98)',
    borderBottom: '1px solid rgba(255, 232, 161, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(10px)',
});

const ControlsContainer = styled('div')({
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '0.8rem',
    },
});

const SearchInput = styled('input')({
    padding: '0.75rem 1rem',
    border: '2px solid rgba(255, 232, 161, 0.4)',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 232, 161, 1)',
    fontSize: '0.9rem',
    minWidth: '280px',
    maxWidth: '320px',
    fontWeight: '500',
    '&:focus': {
        outline: 'none',
        borderColor: 'rgba(255, 232, 161, 0.8)',
        boxShadow: '0 0 0 4px rgba(255, 232, 161, 0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    '&::placeholder': {
        color: 'rgba(255, 232, 161, 0.6)',
        fontWeight: '400',
    },
    '@media (max-width: 768px)': {
        minWidth: 'auto',
        maxWidth: 'none',
        width: '100%',
    },
});

const FilterSelect = styled('select')({
    padding: '0.75rem 1rem',
    border: '2px solid rgba(255, 232, 161, 0.4)',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 232, 161, 1)',
    fontSize: '0.9rem',
    minWidth: '160px',
    maxWidth: '180px',
    cursor: 'pointer',
    fontWeight: '500',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 232, 161, 0.8)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '16px',
    paddingRight: '2.5rem',
    '&:focus': {
        outline: 'none',
        borderColor: 'rgba(255, 232, 161, 0.8)',
        boxShadow: '0 0 0 4px rgba(255, 232, 161, 0.15)',
    },
    '@media (max-width: 768px)': {
        minWidth: 'auto',
        maxWidth: 'none',
        width: '100%',
    },
});

const FilterOption = styled('option')({
    backgroundColor: 'rgba(30, 45, 39, 1)',
    color: 'rgba(255, 232, 161, 1)',
    fontWeight: '500',
});

const ClearButton = styled(Button)({
    padding: '0.75rem 1.5rem',
    border: '2px solid rgba(255, 232, 161, 0.4)',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    color: 'rgba(255, 232, 161, 1)',
    borderRadius: '8px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.9rem',
    '&:hover': {
        backgroundColor: 'rgba(255, 232, 161, 0.2)',
        borderColor: 'rgba(255, 232, 161, 0.8)',
        transform: 'translateY(-2px)',
    },
});

// Media Collage Section
const MediaCollageSection = styled('div')({
    padding: '3rem 8%',
    flex: 1,
    backgroundColor: 'rgba(30, 45, 39, 0.95)',
});

const CollageGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridAutoRows: 'minmax(200px, auto)',
    gap: '1rem',
    marginBottom: '3rem',
    width: '100%',
    minHeight: '600px',
    gridAutoFlow: 'dense',
    alignItems: 'stretch',
    justifyItems: 'stretch',
    justifyContent: 'stretch',
    alignContent: 'start',
    '@media (max-width: 1200px)': {
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridAutoRows: 'minmax(180px, auto)',
        gap: '0.8rem',
    },
    '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridAutoRows: 'minmax(150px, auto)',
        gap: '0.6rem',
    },
    '@media (max-width: 480px)': {
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridAutoRows: 'minmax(120px, auto)',
        gap: '0.5rem',
    },
});

const CollageItem = styled('div')(({ gridArea, gridColumn, gridRow }) => ({
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    gridArea: gridArea,
    gridColumn: gridColumn,
    gridRow: gridRow,
    minHeight: '200px',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(30, 45, 39, 0.3)',
    '&:hover': {
        transform: 'scale(1.02)',
        zIndex: 5,
        boxShadow: '0 8px 32px rgba(255, 232, 161, 0.3)',
        '& > div:last-child': {
            opacity: 1,
            transform: 'translateY(0)',
        },
        '& img, & video': {
            transform: 'scale(1.1)',
        },
    },
}));

const CollageMedia = styled('div')({
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    '& img, & video': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.3, 1)',
        display: 'block',
    },
});

const VideoOverlay = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(30, 45, 39, 0.8)',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 232, 161, 1)',
    fontSize: '1.5rem',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 232, 161, 0.4)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
});

const ImageOverlay = styled('div')({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(180deg, transparent 0%, rgba(30, 45, 39, 0.95) 50%, rgba(30, 45, 39, 0.98) 100%)',
    color: 'rgba(255, 232, 161, 1)',
    padding: '1.5rem',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
});

const ImageTitle = styled('h3')({
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: '"DM Sans", Helvetica',
    fontWeight: '700',
    fontSize: '1.1rem',
    marginBottom: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
});

const ImageDetails = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 232, 161, 0.9)',
});

const ImageDetail = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '& i': {
        color: 'rgba(255, 232, 161, 0.8)',
        width: '14px',
        textAlign: 'center',
    },
});

const BookmarkIcon = styled('div')({
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '32px',
    height: '32px',
    backgroundColor: 'rgba(30, 45, 39, 0.8)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 232, 161, 1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    '&:hover': {
        backgroundColor: 'rgba(255, 232, 161, 0.2)',
        transform: 'scale(1.1)',
    },
});

// Pagination
const PaginationContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '3rem',
    flexWrap: 'wrap',
});

const PaginationButton = styled(Button)({
    padding: '0.8rem 1.2rem',
    minWidth: '48px',
    border: '2px solid rgba(255, 232, 161, 0.4)',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    color: 'rgba(255, 232, 161, 1)',
    borderRadius: '10px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 232, 161, 0.2)',
        borderColor: 'rgba(255, 232, 161, 0.8)',
        transform: 'translateY(-2px)',
    },
    '&.active': {
        backgroundColor: 'rgba(255, 232, 161, 1)',
        color: 'rgba(30, 45, 39, 1)',
        borderColor: 'rgba(255, 232, 161, 1)',
        fontWeight: '700',
    },
});

// Loading and Error States
const LoadingOverlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 45, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    gap: '2rem',
});

const Spinner = styled('div')({
    width: '80px',
    height: '80px',
    border: '6px solid rgba(255, 232, 161, 0.2)',
    borderTop: '6px solid rgba(255, 232, 161, 1)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
});

const LoadingText = styled('div')({
    color: 'rgba(255, 232, 161, 1)',
    fontSize: '1.4rem',
    fontWeight: '600',
    fontFamily: '"DM Sans", Helvetica',
    letterSpacing: '1px',
    textAlign: 'center',
});

const ErrorContainer = styled('div')({
    textAlign: 'center',
    padding: '6rem',
    color: 'rgba(255, 232, 161, 1)',
});

const EmptyState = styled('div')({
    textAlign: 'center',
    padding: '6rem',
    color: 'rgba(255, 232, 161, 0.8)',
});

function MediaCollage() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedPhotographer, setSelectedPhotographer] = useState('');
    const [selectedNationalPark, setSelectedNationalPark] = useState('');
    const [photographers, setPhotographers] = useState([]);
    const [nationalParks, setNationalParks] = useState([]);

    // Image viewer state
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const pageSize = 20;

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            console.log('Setting search term:', searchInput);
            setSearchTerm(searchInput);
            setCurrentPage(1);
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    // Fetch media data
    useEffect(() => {
        fetchMediaData();
    }, [currentPage, searchTerm, selectedType, selectedPhotographer, selectedNationalPark]);

    // Fetch photographers and national parks for filters
    useEffect(() => {
        fetchFilterOptions();
    }, []);

    const fetchMediaData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build search query combining text search with filters
            let searchQuery = searchTerm && searchTerm.trim() ? searchTerm.trim() : '';
            
            // If photographer is selected, use it as search (overrides text search for now)
            if (selectedPhotographer) {
                searchQuery = selectedPhotographer;
            }
            // If national park is selected, use it as search (overrides text search for now)
            else if (selectedNationalPark) {
                searchQuery = selectedNationalPark;
            }

            // Use regular media endpoint with proper type filter
            const mediaData = await mediaService.getMedia({
                skip: (currentPage - 1) * pageSize,
                limit: pageSize,
                mediaType: selectedType || null,  // Note: using mediaType (camelCase) as expected by mediaService
                search: searchQuery || null,
            });

            // Ensure mediaData is an array
            const safeMediaData = Array.isArray(mediaData) ? mediaData : [];
            
            // Only filter out podcasts if no specific type is selected
            // If user selected IMAGE or VIDEO, backend already filtered it
            let filteredMedia = safeMediaData;
            if (!selectedType) {
                filteredMedia = safeMediaData.filter(item => 
                    item.media_type !== 'PODCAST' && item.media_type !== 'AUDIO'
                );
            }
            
            setMedia(filteredMedia);

            // Estimate pagination based on results
            if (mediaData.length < pageSize) {
                // If we got fewer results than requested, we're likely on the last page
                setTotalPages(currentPage);
            } else {
                // If we got full page, assume there might be more
                setTotalPages(currentPage + 1);
            }
        } catch (err) {
            console.error('Failed to fetch media data:', err);
            setError('Failed to load media. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchFilterOptions = async () => {
        try {
            const [photographersData, nationalParksData] = await Promise.all([
                mediaService.getPhotographers(),
                mediaService.getNationalParks(),
            ]);
            setPhotographers(photographersData);
            setNationalParks(nationalParksData);
        } catch (err) {
            console.error('Failed to fetch filter options:', err);
        }
    };

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const handleTypeFilter = (e) => {
        setSelectedType(e.target.value);
        setCurrentPage(1);
    };

    const handlePhotographerFilter = (e) => {
        setSelectedPhotographer(e.target.value);
        setCurrentPage(1);
    };

    const handleNationalParkFilter = (e) => {
        setSelectedNationalPark(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSearchInput('');
        setSearchTerm('');
        setSelectedType('');
        setSelectedPhotographer('');
        setSelectedNationalPark('');
        setCurrentPage(1);
    };

    // Image viewer handlers
    const openImageViewer = (index) => {
        setCurrentImageIndex(index);
        setViewerOpen(true);
    };

    const closeImageViewer = () => {
        setViewerOpen(false);
    };

    const handleImageIndexChange = (index) => {
        setCurrentImageIndex(index);
    };

    // Create collage layout with intelligent sizing to fill all space
    const createCollageLayout = (mediaItems) => {
        if (!mediaItems || mediaItems.length === 0) return [];

        const items = [...mediaItems];
        const layouts = [];

        // Advanced layout algorithm to minimize gaps and fill full width
        const calculateOptimalLayout = (count) => {
            const layouts = [];

            // Calculate how many complete rows we can make
            const itemsPerRow = 4; // Target 4 items per row for best layout
            const completeRows = Math.floor(count / itemsPerRow);
            const remainingItems = count % itemsPerRow;

            // Add complete rows (4 items each, span 3 columns)
            for (let i = 0; i < completeRows * itemsPerRow; i++) {
                layouts.push({ gridColumn: 'span 3', gridRow: 'span 3' });
            }

            // Handle remaining items to fill full width
            if (remainingItems > 0) {
                if (remainingItems === 1) {
                    // 1 remaining item: full width
                    layouts.push({ gridColumn: 'span 12', gridRow: 'span 3' });
                } else if (remainingItems === 2) {
                    // 2 remaining items: each takes half width (6 columns)
                    layouts.push({ gridColumn: 'span 6', gridRow: 'span 3' });
                    layouts.push({ gridColumn: 'span 6', gridRow: 'span 3' });
                } else if (remainingItems === 3) {
                    // 3 remaining items: each takes 4 columns
                    layouts.push({ gridColumn: 'span 4', gridRow: 'span 3' });
                    layouts.push({ gridColumn: 'span 4', gridRow: 'span 3' });
                    layouts.push({ gridColumn: 'span 4', gridRow: 'span 3' });
                }
            }

            return layouts;
        };

        // Get optimal layout for the current number of items
        const optimalLayouts = calculateOptimalLayout(items.length);

        // Apply layouts to items - use the calculated optimal layouts directly
        const positionedItems = items.map((item, index) => {
            const layout = optimalLayouts[index] || { gridColumn: 'span 3', gridRow: 'span 3' };

            return {
                ...item,
                layout: layout
            };
        });

        return positionedItems;
    };

    const renderCollageItem = (item, index) => {
        const isVideo = item.media_type === 'VIDEO' || item.media_type === 'video';

        return (
            <CollageItem
                key={item.id}
                gridColumn={item.layout.gridColumn}
                gridRow={item.layout.gridRow}
                onClick={() => openImageViewer(index)}
            >
                <CollageMedia>
                    {isVideo ? (
                        <>
                            <video
                                src={item.file_url}
                                muted
                                preload="metadata"
                                onError={(e) => {
                                    console.error('Video failed to load:', item.file_url);
                                }}
                            />
                            <VideoOverlay>
                                <i className="fas fa-play"></i>
                            </VideoOverlay>
                        </>
                    ) : (
                        <img
                            src={item.file_url}
                            alt={item.title || 'Wildlife Image'}
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                            }}
                        />
                    )}
                </CollageMedia>
                <BookmarkIcon>
                    <i className="fas fa-bookmark"></i>
                </BookmarkIcon>
                <ImageOverlay>
                    <ImageTitle>
                        {isVideo && <i className="fas fa-video" style={{ marginRight: '0.5rem' }}></i>}
                        {item.title || 'Untitled'}
                    </ImageTitle>
                    <ImageDetails>
                        {item.photographer && (
                            <ImageDetail>
                                <i className="fas fa-camera" />
                                <span>{item.photographer}</span>
                            </ImageDetail>
                        )}
                        {item.national_park && (
                            <ImageDetail>
                                <i className="fas fa-map-marker-alt" />
                                <span>{item.national_park}</span>
                            </ImageDetail>
                        )}
                        <ImageDetail>
                            <i className="fas fa-calendar" />
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </ImageDetail>
                        {isVideo && item.duration && (
                            <ImageDetail>
                                <i className="fas fa-clock" />
                                <span>{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}</span>
                            </ImageDetail>
                        )}
                    </ImageDetails>
                </ImageOverlay>
            </CollageItem>
        );
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        // Previous button
        if (currentPage > 1) {
            pages.push(
                <PaginationButton
                    key="prev"
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    ‹
                </PaginationButton>
            );
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <PaginationButton
                    key={i}
                    variant="outline"
                    className={i === currentPage ? 'active' : ''}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </PaginationButton>
            );
        }

        // Next button
        if (currentPage < totalPages) {
            pages.push(
                <PaginationButton
                    key="next"
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    ›
                </PaginationButton>
            );
        }

        return pages;
    };

    if (loading) {
        return (
            <>
                <PageContainer>
                    <Header />
                    <HeroSection>
                        <HeroTitle>WILDLIFE GALLERY</HeroTitle>
                        <HeroSubtitle>
                            Explore our collection of wildlife photography from various national parks
                            around the world. Each image tells a story of nature's beauty and the
                            dedicated photographers who capture these moments.
                        </HeroSubtitle>
                    </HeroSection>
                    <Footer />
                </PageContainer>
                <LoadingOverlay>
                    <Spinner />
                    <LoadingText>Loading Wildlife Gallery...</LoadingText>
                </LoadingOverlay>
            </>
        );
    }

    if (error && media.length === 0) {
        return (
            <PageContainer>
                <Header />
                <ErrorContainer>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <Button variant="outline" onClick={fetchMediaData} style={{ marginTop: '1rem' }}>
                        <i className="fas fa-redo"></i> Try Again
                    </Button>
                </ErrorContainer>
                <Footer />
            </PageContainer>
        );
    }

    const collageItems = createCollageLayout(media);

    return (
        <PageContainer>
            <Header />

            <HeroSection>
                <HeroTitle>Wildlife Gallery</HeroTitle>
                <HeroSubtitle>
                    Explore our collection of wildlife photography from various national parks around the world.
                    Each image tells a story of nature's beauty and the dedicated photographers who capture these moments.
                </HeroSubtitle>
            </HeroSection>

            <ControlsSection>
                <ControlsContainer>
                    <SearchInput
                        type="text"
                        placeholder="Search by title, photographer, or national park..."
                        value={searchInput}
                        onChange={handleSearch}
                        style={{
                            borderColor: searchTerm ? 'rgba(255, 232, 161, 0.8)' : 'rgba(255, 232, 161, 0.4)',
                            backgroundColor: searchTerm ? 'rgba(255, 232, 161, 0.15)' : 'rgba(255, 255, 255, 0.08)'
                        }}
                    />

                    <FilterSelect value={selectedType} onChange={handleTypeFilter}>
                        <FilterOption value="">All Types</FilterOption>
                        <FilterOption value="IMAGE">Images</FilterOption>
                        <FilterOption value="VIDEO">Videos</FilterOption>
                    </FilterSelect>

                    <FilterSelect value={selectedPhotographer} onChange={handlePhotographerFilter}>
                        <FilterOption value="">All Photographers</FilterOption>
                        {photographers.map(photographer => (
                            <FilterOption key={photographer} value={photographer}>
                                {photographer}
                            </FilterOption>
                        ))}
                    </FilterSelect>

                    <FilterSelect value={selectedNationalPark} onChange={handleNationalParkFilter}>
                        <FilterOption value="">All National Parks</FilterOption>
                        {nationalParks.map(park => (
                            <FilterOption key={park} value={park}>
                                {park}
                            </FilterOption>
                        ))}
                    </FilterSelect>

                    <ClearButton variant="outline" onClick={clearFilters}>
                        <i className="fas fa-times"></i> Clear Filters
                    </ClearButton>
                </ControlsContainer>
            </ControlsSection>

            <MediaCollageSection>
                {searchTerm && (
                    <div style={{
                        textAlign: 'center',
                        padding: '1rem',
                        color: 'rgba(255, 232, 161, 0.8)',
                        fontSize: '0.9rem'
                    }}>
                        Searching for: "{searchTerm}" {loading && <i className="fas fa-spinner fa-spin" style={{ marginLeft: '0.5rem' }}></i>}
                    </div>
                )}
                {media.length === 0 ? (
                    <EmptyState>
                        <i className="fas fa-images" style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                        <h3>No media found</h3>
                        <p>
                            {searchTerm ?
                                `No results found for "${searchTerm}". Try adjusting your search criteria or filters.` :
                                'No media available. Try adjusting your filters.'
                            }
                        </p>
                        {(searchTerm || selectedType || selectedPhotographer || selectedNationalPark) && (
                            <button
                                onClick={clearFilters}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'rgba(255, 232, 161, 0.2)',
                                    border: '1px solid rgba(255, 232, 161, 0.5)',
                                    borderRadius: '4px',
                                    color: 'rgba(255, 232, 161, 1)',
                                    cursor: 'pointer'
                                }}
                            >
                                Clear all filters
                            </button>
                        )}
                    </EmptyState>
                ) : (
                    <>
                        <CollageGrid>
                            {collageItems.map(renderCollageItem)}
                        </CollageGrid>

                        <PaginationContainer>
                            {renderPagination()}
                        </PaginationContainer>
                    </>
                )}
            </MediaCollageSection>

            <Footer />

            {/* Image Viewer */}
            <ImageViewer
                open={viewerOpen}
                onClose={closeImageViewer}
                images={media}
                currentIndex={currentImageIndex}
                onIndexChange={handleImageIndexChange}
            />
        </PageContainer>
    );
}

export default MediaCollage;
