import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import AudioPlayer from '../../components/ui/AudioPlayer';
import mediaService from '../../services/mediaService';
import {
    ScreenReader,
    HighContrast,
    ReducedMotion,
    focusManager
} from '../../utils/accessibility.js';

// Main page container
const PageContainer = styled('div')({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1E2D27',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

// Content wrapper with responsive padding
const ContentWrapper = styled('div')({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '120px 24px 80px 24px',
    '@media (max-width: 1024px)': {
        padding: '100px 20px 60px 20px',
        maxWidth: '100%'
    },
    '@media (max-width: 768px)': {
        padding: '80px 16px 40px 16px'
    },
    '@media (max-width: 480px)': {
        padding: '70px 12px 30px 12px'
    },
});

// Back navigation button
const BackButton = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    marginBottom: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    padding: '8px 0',
    '&:hover': {
        opacity: 0.8,
        transform: 'translateX(-4px)',
    },
    '@media (max-width: 768px)': {
        marginBottom: '24px',
        fontSize: '13px'
    },
});

// Podcast header section
const PodcastHeader = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
        marginBottom: '32px'
    },
});

// Podcast cover image
const PodcastCover = styled('div')({
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid rgba(255, 232, 161, 0.6)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 232, 161, 0.2)',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 232, 161, 0.08)',
    '@media (max-width: 768px)': {
        width: '250px',
        height: '250px',
        marginBottom: '20px'
    },
    '@media (max-width: 480px)': {
        width: '200px',
        height: '200px',
        marginBottom: '16px'
    },
});

const CoverImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

// Podcast title
const PodcastTitle = styled('h1')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '36px',
    letterSpacing: '-1px',
    margin: '0 0 12px 0',
    lineHeight: 1.2,
    textAlign: 'center',
    '@media (max-width: 768px)': {
        fontSize: '28px',
        marginBottom: '10px'
    },
    '@media (max-width: 480px)': {
        fontSize: '24px',
        marginBottom: '8px'
    },
});

// Podcast metadata
const PodcastMeta = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    opacity: 0.8,
    marginBottom: '32px',
    flexWrap: 'wrap',
    textAlign: 'center',
    '@media (max-width: 768px)': {
        fontSize: '14px',
        marginBottom: '24px',
        gap: '12px'
    },
    '@media (max-width: 480px)': {
        fontSize: '13px',
        gap: '8px'
    },
});

const MetaItem = styled('span')({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '@media (max-width: 480px)': {
        gap: '4px'
    },
});

const MetaDivider = styled('span')({
    color: '#FFE8A1',
    opacity: 0.5,
    '@media (max-width: 480px)': {
        display: 'none'
    },
});

// Audio player container
const AudioPlayerContainer = styled('div')({
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto 40px auto',
    padding: '24px',
    backgroundColor: 'rgba(255, 232, 161, 0.08)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 232, 161, 0.2)',
    '@media (max-width: 768px)': {
        padding: '20px',
        marginBottom: '32px',
        borderRadius: '12px'
    },
    '@media (max-width: 480px)': {
        padding: '16px',
        marginBottom: '24px',
        borderRadius: '8px'
    },
});

// Podcast description section
const PodcastDescriptionSection = styled('div')({
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
});

const SectionTitle = styled('h2')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '24px',
    marginBottom: '16px',
    textAlign: 'center',
    '@media (max-width: 768px)': {
        fontSize: '20px',
        marginBottom: '12px'
    },
    '@media (max-width: 480px)': {
        fontSize: '18px',
        marginBottom: '10px'
    },
});

// Podcast description
const PodcastDescription = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    lineHeight: 1.8,
    fontSize: '16px',
    width: '100%',
    textAlign: 'left',
    '& p': {
        marginBottom: '16px',
        '&:last-child': {
            marginBottom: 0,
        },
    },
    '& strong, & b': {
        fontWeight: 700,
        color: '#FFE8A1',
    },
    '& em, & i': {
        fontStyle: 'italic',
    },
    '@media (max-width: 768px)': {
        fontSize: '15px',
        lineHeight: 1.7,
    },
    '@media (max-width: 480px)': {
        fontSize: '14px',
        lineHeight: 1.6,
    },
});

// Additional metadata section
const AdditionalMetadata = styled('div')({
    width: '100%',
    maxWidth: '800px',
    margin: '32px auto 0 auto',
    padding: '20px',
    backgroundColor: 'rgba(255, 232, 161, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 232, 161, 0.1)',
    '@media (max-width: 768px)': {
        margin: '24px auto 0 auto',
        padding: '16px',
        borderRadius: '8px'
    },
});

const MetadataGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: '12px'
    },
});

const MetadataItem = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
});

const MetadataLabel = styled('span')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    opacity: 0.8,
});

const MetadataValue = styled('span')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 1.4,
});

// Fallback content for missing description
const FallbackContent = styled('div')({
    fontStyle: 'italic',
    opacity: 0.7,
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: 'rgba(255,232,161,0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255,232,161,0.1)',
    color: '#FFE8A1',
    fontSize: '16px',
    '@media (max-width: 768px)': {
        padding: '30px 16px',
        fontSize: '15px'
    },
    '@media (max-width: 480px)': {
        padding: '24px 12px',
        fontSize: '14px'
    },
});

// Loading state component
const LoadingState = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    textAlign: 'center',
    padding: '80px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
        fontSize: '16px',
        padding: '60px 0'
    },
});

const LoadingSpinner = styled('div')({
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,232,161,0.3)',
    borderTop: '3px solid #FFE8A1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
});

// Error state component
const ErrorState = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    textAlign: 'center',
    padding: '80px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
        fontSize: '16px',
        padding: '60px 0'
    },
});

const ErrorIcon = styled('div')({
    fontSize: '48px',
    opacity: 0.7,
    marginBottom: '8px',
});

function PodcastDetail() {
    const { podcastId } = useParams();
    const navigate = useNavigate();

    // Component state
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [audioLoading, setAudioLoading] = useState(false);
    const [audioError, setAudioError] = useState(null);

    // Accessibility state
    const [isHighContrast, setIsHighContrast] = useState(HighContrast.isHighContrastMode());
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(ReducedMotion.prefersReducedMotion());
    const [announceText, setAnnounceText] = useState('');

    // Set up accessibility listeners
    useEffect(() => {
        const cleanupHighContrast = HighContrast.onHighContrastChange((e) => {
            setIsHighContrast(e.matches);
        });

        const cleanupReducedMotion = ReducedMotion.onReducedMotionChange((e) => {
            setPrefersReducedMotion(e.matches);
        });

        return () => {
            cleanupHighContrast();
            cleanupReducedMotion();
        };
    }, []);

    // Fetch podcast data on component mount
    useEffect(() => {
        const fetchPodcast = async () => {
            if (!podcastId) {
                setError('No podcast ID provided');
                setLoading(false);
                announceToScreenReader('Error: No podcast ID provided');
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const podcastData = await mediaService.getPodcastById(podcastId);
                setPodcast(podcastData);
            } catch (err) {
                console.error('Failed to fetch podcast:', err);
                const errorMessage = err.message || 'Failed to load podcast';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPodcast();
    }, [podcastId]);

    // Format duration helper
    const formatDuration = (seconds) => {
        if (!seconds) return 'Unknown duration';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
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
    };

    // Truncate text helper
    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;

        const truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');

        return lastSpace > 0
            ? truncated.substring(0, lastSpace) + '...'
            : truncated + '...';
    };

    // Format description helper
    const formatDescription = (description) => {
        if (!description) return '';

        // Clean up the description
        return description
            .replace(/\r\n/g, '<br>')
            .replace(/\n/g, '<br>')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // Handle back navigation
    const handleBackClick = () => {
        navigate('/media');
    };

    // Audio player handlers
    const handleAudioError = (errorMessage) => {
        setAudioError(errorMessage);
    };

    const handleAudioLoadStart = () => {
        setAudioLoading(true);
        setAudioError(null);
    };

    const handleAudioLoadEnd = () => {
        setAudioLoading(false);
    };

    return (
        <PageContainer className={`${isHighContrast ? 'high-contrast-mode' : ''} ${prefersReducedMotion ? 'reduced-motion' : ''}`}>
            <Header />

            {/* Live region for announcements */}
            <div
                className="live-region"
                aria-live="polite"
                aria-atomic="true"
                role="status"
            >
                {announceText}
            </div>

            <ContentWrapper id="main-content" role="main">
                {loading ? (
                    <LoadingState role="status" aria-live="polite">
                        <LoadingSpinner aria-hidden="true" />
                        <div>Loading podcast...</div>
                    </LoadingState>
                ) : error ? (
                    <ErrorState role="alert" aria-live="assertive">
                        <ErrorIcon aria-hidden="true">🎧</ErrorIcon>
                        <div>{error}</div>
                        <BackButton
                            onClick={handleBackClick}
                            aria-label="Go back to media page"
                        >
                            ← Back to Media
                        </BackButton>
                    </ErrorState>
                ) : podcast ? (
                    <>
                        <BackButton
                            onClick={handleBackClick}
                            aria-label="Go back to media page"
                            role="button"
                        >
                            ← Back to Media
                        </BackButton>

                        <PodcastHeader>
                            <PodcastCover role="img" aria-label={`Cover image for ${podcast.title}`}>
                                {podcast.thumbnail_url || podcast.file_url ? (
                                    <CoverImage
                                        src={podcast.thumbnail_url || podcast.file_url}
                                        alt={`Cover image for ${podcast.title} podcast`}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentNode.innerHTML = '🎧';
                                            e.target.parentNode.style.fontSize = '48px';
                                            e.target.parentNode.style.color = '#FFE8A1';
                                            e.target.parentNode.setAttribute('aria-label', `Default podcast icon for ${podcast.title}`);
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{ fontSize: '48px', color: '#FFE8A1' }}
                                        aria-label={`Default podcast icon for ${podcast.title}`}
                                    >
                                        🎧
                                    </div>
                                )}
                            </PodcastCover>

                            <PodcastTitle as="h1">{podcast.title}</PodcastTitle>

                            <PodcastMeta>
                                {podcast.photographer && (
                                    <>
                                        <MetaItem>
                                            <span>🎙️</span>
                                            <span>{podcast.photographer}</span>
                                        </MetaItem>
                                        <MetaDivider>•</MetaDivider>
                                    </>
                                )}
                                <MetaItem>
                                    <span>📅</span>
                                    <span>{formatDate(podcast.created_at)}</span>
                                </MetaItem>
                                {podcast.duration && (
                                    <>
                                        <MetaDivider>•</MetaDivider>
                                        <MetaItem>
                                            <span>⏱️</span>
                                            <span>{formatDuration(podcast.duration)}</span>
                                        </MetaItem>
                                    </>
                                )}
                                {podcast.national_park && (
                                    <>
                                        <MetaDivider>•</MetaDivider>
                                        <MetaItem>
                                            <span>📻</span>
                                            <span>{podcast.national_park}</span>
                                        </MetaItem>
                                    </>
                                )}
                            </PodcastMeta>
                        </PodcastHeader>

                        <AudioPlayerContainer
                            className="audio-player"
                            role="region"
                            aria-label="Audio player"
                        >
                            <AudioPlayer
                                src={podcast.file_url}
                                title={podcast.title}
                                onError={handleAudioError}
                                onLoadStart={handleAudioLoadStart}
                                onLoadEnd={handleAudioLoadEnd}
                                aria-label={`Audio player for ${podcast.title}`}
                            />
                            {audioError && (
                                <div
                                    role="alert"
                                    aria-live="assertive"
                                    style={{
                                        textAlign: 'center',
                                        color: '#FFE8A1',
                                        fontSize: '14px',
                                        marginTop: '16px',
                                        opacity: 0.8
                                    }}
                                >
                                    ⚠️ {audioError}
                                </div>
                            )}
                        </AudioPlayerContainer>

                        {/* Description Section */}
                        {podcast.description ? (
                            <PodcastDescriptionSection role="region" aria-labelledby="description-heading">
                                <SectionTitle id="description-heading" as="h2">About This Episode</SectionTitle>
                                <PodcastDescription>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: formatDescription(podcast.description)
                                        }}
                                    />
                                </PodcastDescription>
                            </PodcastDescriptionSection>
                        ) : (
                            <PodcastDescriptionSection role="region" aria-labelledby="description-heading">
                                <SectionTitle id="description-heading" as="h2">About This Episode</SectionTitle>
                                <FallbackContent>
                                    🎧 No description available for this podcast episode.
                                </FallbackContent>
                            </PodcastDescriptionSection>
                        )}

                    </>
                ) : null}
            </ContentWrapper>
            <Footer />
        </PageContainer>
    );
}

export default PodcastDetail;