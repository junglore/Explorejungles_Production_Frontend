// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { styled } from '@mui/material/styles';
// import { Button } from '../../components/ui';
// import LazyImage from '../../components/ui/LazyImage';
// import { mediaService } from '../../services/mediaService.js';
// import {
//     generatePodcastAriaLabel,
//     generateCarouselAriaDescription,
//     generateLiveAnnouncement,
//     KeyboardNavigation,
//     ScreenReader,
//     HighContrast,
//     ReducedMotion,
//     focusManager
// } from '../../utils/accessibility.js';

// // Import podcast images
// import PodcastImage1 from '../../assets/images/media/podcastcarousal_1.png';
// import PodcastImage2 from '../../assets/images/media/podcastcarousal_2.png';
// import PodcastImage3 from '../../assets/images/media/podcastcarousal_3.png';

// const PodcastCarouselContainer = styled("div")(({ theme }) => ({
//     position: 'relative',
//     width: '100%',
//     maxWidth: '1000px',
//     minHeight: '500px', // Increased height to use more space
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center', // Center content vertically
//     padding: '3rem 1rem 2rem 1rem', // Increased top padding to push content down
//     gap: '1.5rem', // Increased spacing between elements
//     overflow: 'visible',
//     [theme.breakpoints.down('lg')]: {
//         minHeight: '450px',
//         padding: '2.5rem 1rem 1.5rem 1rem',
//         gap: '1.25rem',
//     },
//     [theme.breakpoints.down('md')]: {
//         minHeight: '400px',
//         padding: '2rem 0.5rem 1rem 0.5rem',
//         gap: '1rem',
//     },
//     [theme.breakpoints.down('sm')]: {
//         minHeight: '350px',
//         padding: '1.5rem 0.25rem 0.75rem 0.25rem',
//         gap: '0.75rem',
//     },
// }));

// // Main carousel container for podcast cards - using flex layout
// const CarouselContainer = styled("div")(({ theme }) => ({
//     position: 'relative',
//     width: '100%',
//     height: '350px', // Reduced height
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: '0.5rem', // Reduced margin
//     [theme.breakpoints.down('lg')]: {
//         height: '300px',
//     },
//     [theme.breakpoints.down('md')]: {
//         height: '250px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         height: '200px',
//     },
// }));

// // Individual podcast card - using TV carousel animation style with accessibility
// const PodcastCard = styled(LazyImage)(({ isActive, position }) => ({
//     position: 'absolute',
//     transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Same as TV carousel
//     cursor: 'pointer',
//     borderRadius: '50%',
//     overflow: 'hidden',
//     objectFit: 'cover',
//     objectPosition: 'center',
//     boxShadow: 'none', // Removed box shadow as requested
//     '&:hover': {
//         transform: isActive ?
//             'translate(-50%, -50%) scale(1.05)' :
//             position === 'left' ?
//                 'translate(-50%, -50%) scale(0.92)' :
//                 'translate(50%, -50%) scale(0.92)',
//         borderColor: 'rgba(255, 232, 161, 0.9)',
//     },
//     '&:focus': {
//         outline: 'none',
//         transform: isActive ?
//             'translate(-50%, -50%) scale(1.05)' :
//             position === 'left' ?
//                 'translate(-50%, -50%) scale(0.92)' :
//                 'translate(50%, -50%) scale(0.92)',
//         borderColor: 'rgba(255, 232, 161, 0.9)',
//     },
//     '&:active': {
//         transform: isActive ?
//             'translate(-50%, -50%) scale(0.98)' :
//             position === 'left' ?
//                 'translate(-50%, -50%) scale(0.85)' :
//                 'translate(50%, -50%) scale(0.85)',
//     },
//     ...(isActive ? {
//         // Center podcast (active) - matching TV carousel center position
//         width: '350px',
//         height: '350px',
//         left: '50%',
//         top: '50%',
//         transform: 'translate(-50%, -50%) scale(1)',
//         zIndex: 5,
//         opacity: 1,
//         '@media (max-width: 1200px)': {
//             width: '300px',
//             height: '300px',
//         },
//         '@media (max-width: 768px)': {
//             width: '240px',
//             height: '240px',
//         },
//         '@media (max-width: 480px)': {
//             width: '150px',
//             height: '150px',
//         },
//     } : position === 'left' ? {
//         // Left podcast - brought closer to center
//         width: '300px',
//         height: '300px',
//         left: '35%', // Moved from 30% to 35% (closer to center)
//         top: '50%',
//         transform: 'translate(-50%, -50%) scale(0.9)',
//         zIndex: 2,
//         opacity: 0.85,
//         '@media (max-width: 1200px)': {
//             width: '250px',
//             height: '250px',
//             left: '32%', // Moved from 25% to 32%
//         },
//         '@media (max-width: 768px)': {
//             width: '200px',
//             height: '200px',
//             left: '28%', // Moved from 20% to 28%
//         },
//         '@media (max-width: 480px)': {
//             width: '120px',
//             height: '120px',
//             left: '25%', // Moved from 15% to 25%
//         },
//     } : {
//         // Right podcast - brought closer to center
//         width: '300px',
//         height: '300px',
//         right: '35%', // Moved from 30% to 35% (closer to center)
//         top: '50%',
//         transform: 'translate(50%, -50%) scale(0.9)',
//         zIndex: 2,
//         opacity: 0.85,
//         '@media (max-width: 1200px)': {
//             width: '250px',
//             height: '250px',
//             right: '32%', // Moved from 25% to 32%
//         },
//         '@media (max-width: 768px)': {
//             width: '200px',
//             height: '200px',
//             right: '28%', // Moved from 20% to 28%
//         },
//         '@media (max-width: 480px)': {
//             width: '120px',
//             height: '120px',
//             right: '25%', // Moved from 15% to 25%
//         },
//     }),
// }));

// // Navigation container - using flex layout
// const NavigationContainer = styled("div")(({ theme }) => ({
//     position: 'absolute',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     width: '100%',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '0 20px', // Match CardCarousel positioning
//     zIndex: 10,
//     pointerEvents: 'auto', // Allow pointer events for buttons
//     [theme.breakpoints.down('md')]: {
//         padding: '0 15px', // Slightly reduced for medium screens
//     },
//     [theme.breakpoints.down('sm')]: {
//         padding: '0 10px', // Slightly reduced for small screens
//     },
// }));

// // Navigation button styling - matching CardCarousel
// const NavButton = styled(Button)(({ theme }) => ({
//     width: '50px',
//     height: '50px',
//     borderRadius: '50%',
//     border: '2px solid rgba(255, 232, 161, 0.8)',
//     backgroundColor: 'rgba(30, 45, 39, 0.8)', // Match CardCarousel opacity
//     color: 'rgba(255, 232, 161, 1)',
//     backdropFilter: 'blur(10px)',
//     pointerEvents: 'auto',
//     transition: 'all 0.3s ease',
//     '&:hover': {
//         borderColor: 'rgba(255, 232, 161, 1)',
//         backgroundColor: 'rgba(30, 45, 39, 0.9)', // Slightly more opaque on hover
//         transform: 'scale(1.05)', // Slightly less scale than before
//     },
//     '&:disabled': {
//         opacity: 0.5,
//         cursor: 'not-allowed',
//     },
//     [theme.breakpoints.down('md')]: {
//         width: '45px',
//         height: '45px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         width: '40px',
//         height: '40px',
//     },
// }));

// // Current track info - using flex layout
// const CurrentTrack = styled("div")(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     textAlign: 'center',
//     color: 'rgba(255, 232, 161, 1)',
//     width: '100%',
//     maxWidth: '600px',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     padding: '0.5rem', // Reduced padding
//     '&:hover': {
//         opacity: 0.8,
//         transform: 'scale(1.02)',
//     },
//     [theme.breakpoints.down('lg')]: {
//         maxWidth: '500px',
//         padding: '0.4rem',
//     },
//     [theme.breakpoints.down('md')]: {
//         maxWidth: '400px',
//         padding: '0.3rem',
//     },
//     [theme.breakpoints.down('sm')]: {
//         maxWidth: '280px',
//         padding: '0.2rem',
//     },
// }));

// const TrackTitle = styled("div")(({ theme }) => ({
//     fontFamily: 'DM Sans',
//     fontWeight: '700',
//     fontSize: '24px',
//     marginBottom: '10px',
//     letterSpacing: '1.8px',
//     textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
//     color: 'rgba(255, 232, 161, 1)',
//     textTransform: 'uppercase',
//     [theme.breakpoints.down('lg')]: {
//         fontSize: '22px',
//         letterSpacing: '1.5px',
//     },
//     [theme.breakpoints.down('md')]: {
//         fontSize: '20px',
//         letterSpacing: '1.2px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         fontSize: '16px',
//         letterSpacing: '1px',
//     },
// }));

// const TrackSubtitle = styled("div")(({ theme }) => ({
//     fontFamily: 'DM Sans',
//     fontWeight: '500',
//     fontSize: '16px',
//     color: 'rgba(255, 232, 161, 1)',
//     textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
//     lineHeight: '1.5',
//     [theme.breakpoints.down('lg')]: {
//         fontSize: '15px',
//     },
//     [theme.breakpoints.down('md')]: {
//         fontSize: '14px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         fontSize: '12px',
//     },
// }));

// // Carousel dots - using flex layout
// const CarouselDots = styled("div")(({ theme }) => ({
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: '10px', // Reduced gap
//     width: '100%',
//     padding: '0.5rem 0', // Reduced padding
//     [theme.breakpoints.down('lg')]: {
//         gap: '8px',
//     },
//     [theme.breakpoints.down('md')]: {
//         gap: '6px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         gap: '5px',
//     },
// }));

// // Dot button styling
// const DotButton = styled(Button)(({ isActive, theme }) => ({
//     width: '12px',
//     height: '12px',
//     borderRadius: '50%',
//     padding: '0',
//     minWidth: '12px',
//     minHeight: '12px',
//     backgroundColor: isActive ? 'rgba(255, 232, 161, 1)' : 'rgba(255, 232, 161, 0.3)',
//     border: `2px solid rgba(255, 232, 161, ${isActive ? '1' : '0.6'})`,
//     transition: 'all 0.3s ease',
//     '&:hover': {
//         backgroundColor: isActive ? 'rgba(255, 232, 161, 1)' : 'rgba(255, 232, 161, 0.6)',
//         borderColor: 'rgba(255, 232, 161, 1)',
//         transform: 'scale(1.2)',
//     },
//     '&:disabled': {
//         opacity: 0.5,
//         cursor: 'not-allowed',
//     },
//     [theme.breakpoints.down('md')]: {
//         width: '10px',
//         height: '10px',
//         minWidth: '10px',
//         minHeight: '10px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         width: '8px',
//         height: '8px',
//         minWidth: '8px',
//         minHeight: '8px',
//     },
// }));

// // Audio waveform visualization - updated for relative positioning
// const AudioVisualization = styled("div")(({ theme }) => ({
//     width: '500px',
//     height: '40px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '2px',
//     zIndex: 4,
//     background: 'linear-gradient(90deg, transparent 0%, rgba(255, 232, 161, 0.1) 20%, rgba(255, 232, 161, 0.1) 80%, transparent 100%)',
//     borderRadius: '20px',
//     padding: '0 20px',
//     [theme.breakpoints.down('lg')]: {
//         width: '400px',
//         height: '35px',
//     },
//     [theme.breakpoints.down('md')]: {
//         width: '300px',
//         height: '30px',
//         gap: '1.5px',
//         padding: '0 15px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         width: '200px',
//         height: '25px',
//         gap: '1px',
//         padding: '0 10px',
//     },
// }));

// // Left faded line extending from waveform
// const LeftFadedLine = styled("div")(({ theme }) => ({
//     position: 'absolute',
//     top: '50%',
//     left: '0',
//     width: '50%',
//     height: '10px',
//     transform: 'translateY(-50%)',
//     background: 'linear-gradient(90deg, rgba(255, 232, 161, 0.3) 0%, rgba(255, 232, 161, 0.1) 70%, transparent 90%)',
//     zIndex: 3,
//     [theme.breakpoints.down('lg')]: {
//         height: '5px',
//     },
//     [theme.breakpoints.down('md')]: {
//         height: '4px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         height: '3px',
//     },
// }));

// // Right faded line extending from waveform
// const RightFadedLine = styled("div")(({ theme }) => ({
//     position: 'absolute',
//     top: '50%',
//     right: '0',
//     width: '50%',
//     height: '10px',
//     transform: 'translateY(-50%)',
//     background: 'linear-gradient(90deg, transparent 10%, rgba(255, 232, 161, 0.1) 30%, rgba(255, 232, 161, 0.3) 100%)',
//     zIndex: 3,
//     [theme.breakpoints.down('lg')]: {
//         height: '5px',
//     },
//     [theme.breakpoints.down('md')]: {
//         height: '4px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         height: '3px',
//     },
// }));

// // Individual waveform bar - streamlined horizontal band style
// const WaveformBar = styled("div")(({ height, isActive, theme }) => ({
//     width: '3px',
//     height: `${height}%`,
//     backgroundColor: isActive ? 'rgba(255, 232, 161, 1)' : 'rgba(255, 232, 161, 0.8)',
//     borderRadius: '1.5px',
//     transition: 'all 0.2s ease',
//     animation: isActive ? 'waveformPulse 1.2s ease-in-out infinite alternate' : 'none',
//     '@keyframes waveformPulse': {
//         '0%': {
//             opacity: 0.8,
//             backgroundColor: 'rgba(255, 232, 161, 0.8)',
//             transform: 'scaleY(1)'
//         },
//         '100%': {
//             opacity: 1,
//             backgroundColor: 'rgba(255, 232, 161, 1)',
//             transform: 'scaleY(1.2)'
//         },
//     },
//     [theme.breakpoints.down('md')]: {
//         width: '2.5px',
//         borderRadius: '1.25px',
//     },
//     [theme.breakpoints.down('sm')]: {
//         width: '2px',
//         borderRadius: '1px',
//     },
// }));

// export const PodcastCarousel = ({ className }) => {
//     const navigate = useNavigate();
//     const [currentIndex, setCurrentIndex] = useState(0); // Start with first card active
//     const [isPlaying, setIsPlaying] = useState(false);

//     // Enhanced state for podcast data with fallback management
//     const [podcastData, setPodcastData] = useState([]);
//     const [fallbackData] = useState([
//         {
//             id: 'fallback-1',
//             title: 'Wildlife Stories',
//             host: 'David Miller',
//             image: PodcastImage1,
//             description: 'Discover amazing wildlife stories from around the world',
//             duration: '25m',
//             isFallback: true
//         },
//         {
//             id: 'fallback-2',
//             title: 'JOE GOLDBERG - THE TRACKER',
//             host: 'Joe Goldberg',
//             image: PodcastImage2,
//             description: 'Follow the adventures of a wildlife tracker',
//             duration: '30m',
//             isFallback: true
//         },
//         {
//             id: 'fallback-3',
//             title: 'Forest Echoes',
//             host: 'Sarah Wilson',
//             image: PodcastImage3,
//             description: 'Listen to the sounds and stories of the forest',
//             duration: '22m',
//             isFallback: true
//         }
//     ]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [retryCount, setRetryCount] = useState(0);
//     const [isUsingFallback, setIsUsingFallback] = useState(false);

//     // Enhanced navigation functionality
//     const [navigationLoading, setNavigationLoading] = useState(false);
//     const [navigationError, setNavigationError] = useState(null);

//     // Accessibility and keyboard navigation
//     const [focusedIndex, setFocusedIndex] = useState(0);
//     const cardRefs = React.useRef([]);

//     // Accessibility state
//     const [announceText, setAnnounceText] = useState('');
//     const [isHighContrast, setIsHighContrast] = useState(HighContrast.isHighContrastMode());
//     const [prefersReducedMotion, setPrefersReducedMotion] = useState(ReducedMotion.prefersReducedMotion());

//     // Set up accessibility listeners
//     useEffect(() => {
//         const cleanupHighContrast = HighContrast.onHighContrastChange((e) => {
//             setIsHighContrast(e.matches);
//         });

//         const cleanupReducedMotion = ReducedMotion.onReducedMotionChange((e) => {
//             setPrefersReducedMotion(e.matches);
//         });

//         return () => {
//             cleanupHighContrast();
//             cleanupReducedMotion();
//         };
//     }, []);

//     // Initialize card refs
//     React.useEffect(() => {
//         cardRefs.current = cardRefs.current.slice(0, podcastData.length);
//     }, [podcastData.length]);

//     // Auto-rotate carousel - matching TV carousel timing
//     useEffect(() => {
//         if (podcastData.length === 0) return;

//         const interval = setInterval(() => {
//             setCurrentIndex((prev) => (prev + 1) % podcastData.length);
//         }, 4000); // Same interval as TV carousel
//         return () => clearInterval(interval);
//     }, [podcastData.length]);

//     // Generate horizontal band waveform data
//     const waveformData = Array.from({ length: 100 }, (_, i) => {
//         // Create a more uniform horizontal band pattern
//         let height;
//         const position = i / 100; // Position from 0 to 1

//         // Create a wave pattern that's more uniform but still has variation
//         if (position < 0.15 || position > 0.85) {
//             height = Math.random() * 25 + 20; // Lower on edges
//         } else if (position >= 0.4 && position <= 0.6) {
//             height = Math.random() * 35 + 55; // Higher in center
//         } else {
//             height = Math.random() * 30 + 35; // Medium elsewhere
//         }

//         return {
//             height,
//             isActive: isPlaying && (i % 6 === 0 || i % 9 === 0 || i % 13 === 0) // More frequent active bars
//         };
//     });

//     // Navigation handlers - matching TV carousel logic
//     const handlePrevious = () => {
//         setCurrentIndex((prev) => (prev - 1 + podcastData.length) % podcastData.length);
//     };

//     const handleNext = () => {
//         setCurrentIndex((prev) => (prev + 1) % podcastData.length);
//     };

//     const handleDotClick = (index) => {
//         setCurrentIndex(index);
//     };


//     const handlePodcastClick = async (index) => {
//         const podcast = podcastData[index];

//         try {
//             setNavigationLoading(true);
//             setNavigationError(null);

//             if (podcast && podcast.id) {
//                 // Validate podcast exists before navigation
//                 await mediaService.getPodcastById(podcast.id);

//                 // Navigate to podcast detail page with proper URL generation
//                 const podcastUrl = `/podcast/${podcast.id}`;
//                 navigate(podcastUrl);
//             } else {
//                 // Fallback: set as current if no ID available
//                 setCurrentIndex(index);
//                 setIsPlaying(!isPlaying);

//                 // Show user feedback for missing podcast data
//                 setNavigationError('Podcast details not available. Please try again later.');
//                 setTimeout(() => setNavigationError(null), 3000);
//             }
//         } catch (error) {
//             console.error('Navigation failed:', error);

//             // Enhanced error handling with user feedback
//             let errorMessage = 'Failed to open podcast. ';

//             if (error.message.includes('not found')) {
//                 errorMessage += 'This podcast may have been removed.';
//             } else if (error.message.includes('network') || error.message.includes('connection')) {
//                 errorMessage += 'Please check your connection and try again.';
//             } else {
//                 errorMessage += 'Please try again later.';
//             }

//             setNavigationError(errorMessage);

//             // Auto-clear error after 5 seconds
//             setTimeout(() => setNavigationError(null), 5000);
//         } finally {
//             setNavigationLoading(false);
//         }
//     };

//     const handleCardClick = handlePodcastClick;

//     // Keyboard navigation handlers
//     const handleKeyDown = (event, index) => {
//         switch (event.key) {
//             case 'Enter':
//             case ' ': // Space key
//                 event.preventDefault();
//                 handlePodcastClick(index);
//                 break;
//             case 'ArrowLeft':
//                 event.preventDefault();
//                 const prevIndex = (index - 1 + podcastData.length) % podcastData.length;
//                 setFocusedIndex(prevIndex);
//                 setCurrentIndex(prevIndex);
//                 cardRefs.current[prevIndex]?.focus();
//                 break;
//             case 'ArrowRight':
//                 event.preventDefault();
//                 const nextIndex = (index + 1) % podcastData.length;
//                 setFocusedIndex(nextIndex);
//                 setCurrentIndex(nextIndex);
//                 cardRefs.current[nextIndex]?.focus();
//                 break;
//             case 'Home':
//                 event.preventDefault();
//                 setFocusedIndex(0);
//                 setCurrentIndex(0);
//                 cardRefs.current[0]?.focus();
//                 break;
//             case 'End':
//                 event.preventDefault();
//                 const lastIndex = podcastData.length - 1;
//                 setFocusedIndex(lastIndex);
//                 setCurrentIndex(lastIndex);
//                 cardRefs.current[lastIndex]?.focus();
//                 break;
//             default:
//                 break;
//         }
//     };

//     // Focus management
//     const handleFocus = (index) => {
//         setFocusedIndex(index);
//     };

//     const handleBlur = () => {
//         // Keep focused index for visual indicators
//     };

//     // Enhanced podcast data fetching with comprehensive error handling and fallbacks
//     const fetchPodcastData = async (currentRetryCount = 0) => {
//         const maxRetries = 3;

//         try {
//             setLoading(true);
//             setError(null);
//             setRetryCount(currentRetryCount);

//             // Get podcasts from API using the carousel-specific method
//             const podcasts = await mediaService.getPodcastsForCarousel(6);

//             if (podcasts && podcasts.length > 0) {
//                 // Transform API data to match component format
//                 const transformedPodcasts = podcasts.map((podcast, index) => ({
//                     id: podcast.id,
//                     title: podcast.display_title || podcast.title || `Podcast Episode ${index + 1}`,
//                     host: podcast.display_host || 'Unknown Host',
//                     image: podcast.thumbnail_url || podcast.file_url || fallbackData[index % fallbackData.length]?.image || PodcastImage1,
//                     description: podcast.description || 'No description available',
//                     duration: podcast.display_duration || 'Unknown duration',
//                     url: `/podcast/${podcast.id}`,
//                     isFallback: false
//                 }));

//                 setPodcastData(transformedPodcasts);
//                 setIsUsingFallback(false);
//                 setError(null);
//                 setRetryCount(0);
//             } else {
//                 // Use fallback data if no podcasts found
//                 console.log('No podcasts found, using fallback data');
//                 setPodcastData(fallbackData);
//                 setIsUsingFallback(true);
//                 setError('No podcasts available from server. Showing sample content.');
//             }
//         } catch (err) {
//             console.error('Failed to fetch podcast data:', err);

//             // Implement retry logic for retryable errors
//             const isRetryableError = err.message.includes('network') ||
//                 err.message.includes('timeout') ||
//                 err.message.includes('fetch') ||
//                 err.message.includes('500') ||
//                 err.message.includes('502') ||
//                 err.message.includes('503');

//             if (currentRetryCount < maxRetries && isRetryableError) {
//                 console.log(`Retrying podcast fetch (attempt ${currentRetryCount + 1}/${maxRetries})`);
//                 const delay = Math.min(1000 * Math.pow(2, currentRetryCount), 5000); // Exponential backoff with max 5s
//                 setTimeout(() => fetchPodcastData(currentRetryCount + 1), delay);
//                 return;
//             }

//             // Enhanced error messages with actionable suggestions
//             let errorMessage = 'Unable to load podcasts. ';
//             let suggestions = [];

//             if (err.message.includes('network') || err.message.includes('fetch')) {
//                 errorMessage += 'Please check your internet connection.';
//                 suggestions = ['Check your internet connection', 'Try refreshing the page', 'Try again in a few moments'];
//             } else if (err.message.includes('404')) {
//                 errorMessage += 'Podcast service is temporarily unavailable.';
//                 suggestions = ['Try again later', 'Contact support if the problem persists'];
//             } else if (err.message.includes('403')) {
//                 errorMessage += 'Access to podcasts is restricted.';
//                 suggestions = ['Check your account permissions', 'Contact support for access'];
//             } else {
//                 errorMessage += 'An unexpected error occurred.';
//                 suggestions = ['Try refreshing the page', 'Try again in a few moments', 'Contact support if the problem persists'];
//             }

//             setError({ message: errorMessage, suggestions });

//             // Use fallback data to maintain functionality
//             setPodcastData(fallbackData);
//             setIsUsingFallback(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Manual retry function for user-initiated retries
//     const handleRetry = () => {
//         setRetryCount(0);
//         fetchPodcastData(0);
//     };

//     // Fetch podcast data on component mount
//     useEffect(() => {
//         // Use fallback data initially to prevent crashes
//         setPodcastData(fallbackData);
//         setIsUsingFallback(true);
//         setLoading(false);

//         // Attempt to fetch real data after a delay
//         const timer = setTimeout(() => {
//             fetchPodcastData();
//         }, 1000);

//         return () => clearTimeout(timer);
//     }, []);

//     // Safely get current podcast with fallback
//     const currentPodcast = podcastData[currentIndex] || podcastData[0] || {
//         title: 'Loading...',
//         host: 'Unknown Host'
//     };

//     if (error && (!podcastData || podcastData.length === 0)) {
//         const errorMessage = typeof error === 'string' ? error : error.message;
//         const suggestions = typeof error === 'object' ? error.suggestions : [];

//         return (
//             <PodcastCarouselContainer className={className}>
//                 <div style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '100%',
//                     color: 'rgba(255, 232, 161, 1)',
//                     fontSize: '1.1rem',
//                     gap: '20px',
//                     textAlign: 'center',
//                     padding: '20px'
//                 }}>
//                     <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
//                         Unable to Load Podcasts
//                     </div>
//                     <div style={{ fontSize: '0.9rem', opacity: 0.8, maxWidth: '400px' }}>
//                         {errorMessage}
//                     </div>

//                     {suggestions.length > 0 && (
//                         <div style={{ fontSize: '0.8rem', opacity: 0.7, maxWidth: '350px' }}>
//                             <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Try these solutions:</div>
//                             <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0 }}>
//                                 {suggestions.map((suggestion, index) => (
//                                     <li key={index} style={{ marginBottom: '4px' }}>{suggestion}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}

//                     <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
//                         <Button
//                             variant="outline"
//                             onClick={handleRetry}
//                             disabled={loading}
//                             style={{
//                                 border: '2px solid rgba(255, 232, 161, 0.8)',
//                                 backgroundColor: 'rgba(30, 45, 39, 0.9)',
//                                 color: 'rgba(255, 232, 161, 1)',
//                                 opacity: loading ? 0.6 : 1
//                             }}
//                         >
//                             {loading ? 'Retrying...' : 'Try Again'}
//                         </Button>

//                         <Button
//                             variant="outline"
//                             onClick={() => {
//                                 setPodcastData(fallbackData);
//                                 setIsUsingFallback(true);
//                                 setError(null);
//                             }}
//                             style={{
//                                 border: '2px solid rgba(255, 232, 161, 0.6)',
//                                 backgroundColor: 'rgba(30, 45, 39, 0.7)',
//                                 color: 'rgba(255, 232, 161, 0.8)'
//                             }}
//                         >
//                             Show Sample Content
//                         </Button>
//                     </div>

//                     {retryCount > 0 && (
//                         <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
//                             Retry attempt: {retryCount}/3
//                         </div>
//                     )}
//                 </div>
//             </PodcastCarouselContainer>
//         );
//     }

//     // Don't render if no podcast data after loading
//     if (!podcastData || podcastData.length === 0) {
//         return (
//             <PodcastCarouselContainer className={className}>
//                 <div style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '100%',
//                     color: 'rgba(255, 232, 161, 1)',
//                     fontSize: '1.1rem',
//                     gap: '20px',
//                     textAlign: 'center'
//                 }}>
//                     <div>No podcasts available</div>
//                     <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
//                         Check back soon for new wildlife stories
//                     </div>
//                 </div>
//             </PodcastCarouselContainer>
//         );
//     }

//     // Announce changes to screen readers
//     const announceToScreenReader = (type, data) => {
//         const message = generateLiveAnnouncement(type, data);
//         if (message) {
//             setAnnounceText(message);
//             ScreenReader.announce(message);
//         }
//     };



//     return (
//         <PodcastCarouselContainer
//             className={`${className} podcast-carousel ${isHighContrast ? 'high-contrast-mode' : ''} ${prefersReducedMotion ? 'reduced-motion' : ''}`}
//             role="region"
//             aria-label="Podcast carousel"
//             aria-describedby="carousel-instructions"
//             onKeyDown={handleKeyDown}
//             tabIndex={0}
//         >
//             {/* Screen reader instructions */}
//             <div
//                 id="carousel-instructions"
//                 className="sr-only"
//                 style={{
//                     position: 'absolute',
//                     left: '-10000px',
//                     width: '1px',
//                     height: '1px',
//                     overflow: 'hidden'
//                 }}
//             >
//                 {generateCarouselAriaDescription(podcastData.length)}
//                 Use arrow keys to navigate between podcasts, Enter or Space to select and play a podcast.
//                 There are {podcastData.length} podcasts available.
//                 {isUsingFallback ? ' Note: Currently showing sample content due to connection issues.' : ''}
//             </div>

//             {/* Live region for announcements */}
//             <div
//                 className="live-region"
//                 aria-live="polite"
//                 aria-atomic="true"
//                 role="status"
//             >
//                 {announceText}
//             </div>

//             {/* Main Carousel Container */}
//             <CarouselContainer
//                 role="group"
//                 aria-label={`Podcast carousel with ${podcastData.length} episodes`}
//             >
//                 {podcastData.map((podcast, index) => {
//                     let position = '';
//                     if (index === currentIndex) {
//                         position = 'center';
//                     } else if (index === (currentIndex - 1 + podcastData.length) % podcastData.length) {
//                         position = 'left';
//                     } else {
//                         position = 'right';
//                     }

//                     return (
//                         <React.Fragment key={`podcast-${podcast.id}`}>
//                             {/* Hidden description for screen readers */}
//                             <div
//                                 id={`podcast-description-${index}`}
//                                 style={{
//                                     position: 'absolute',
//                                     left: '-10000px',
//                                     width: '1px',
//                                     height: '1px',
//                                     overflow: 'hidden'
//                                 }}
//                             >
//                                 {podcast.description || `Podcast episode ${index + 1} of ${podcastData.length}`}
//                                 {podcast.duration && `. Duration: ${podcast.duration}`}
//                             </div>

//                             <PodcastCard
//                                 key={podcast.id}
//                                 ref={el => cardRefs.current[index] = el}
//                                 src={podcast.image}
//                                 alt={`${podcast.title} by ${podcast.host}. Click to listen to this podcast episode.${podcast.isFallback ? ' (Sample content)' : ''}`}
//                                 title={navigationLoading ? 'Loading...' : `Click to listen to "${podcast.title}" by ${podcast.host}${podcast.isFallback ? ' (Sample content)' : ''}`}
//                                 isActive={index === currentIndex}
//                                 position={position}
//                                 onClick={() => handleCardClick(index)}
//                                 onKeyDown={(e) => handleKeyDown(e, index)}
//                                 onFocus={() => handleFocus(index)}
//                                 onBlur={handleBlur}
//                                 loading="lazy"
//                                 tabIndex={0}
//                                 role="button"
//                                 aria-label={`Podcast: ${podcast.title} by ${podcast.host}. ${index === currentIndex ? 'Currently selected. ' : ''}Press Enter or Space to play, use arrow keys to navigate.${podcast.isFallback ? ' This is sample content.' : ''}`}
//                                 aria-describedby={`podcast-description-${index}`}
//                                 aria-pressed={index === currentIndex}
//                                 style={{
//                                     opacity: navigationLoading ? 0.6 : (podcast.isFallback ? 0.9 : 1),
//                                     pointerEvents: navigationLoading ? 'none' : 'auto',
//                                     cursor: navigationLoading ? 'wait' : 'pointer',
//                                     filter: podcast.isFallback ? 'grayscale(20%)' : 'none'
//                                 }}
//                                 onError={(e) => {
//                                     // Enhanced fallback handling for missing images with multiple fallbacks
//                                     console.warn(`Failed to load image for podcast: ${podcast.title}`);

//                                     // Try fallback images in order
//                                     if (e.target.src !== PodcastImage1) {
//                                         e.target.src = PodcastImage1;
//                                     } else if (e.target.src !== PodcastImage2) {
//                                         e.target.src = PodcastImage2;
//                                     } else if (e.target.src !== PodcastImage3) {
//                                         e.target.src = PodcastImage3;
//                                     } else {
//                                         // Final fallback: create a placeholder
//                                         e.target.style.backgroundColor = 'rgba(255, 232, 161, 0.2)';
//                                         e.target.style.border = '2px dashed rgba(255, 232, 161, 0.5)';
//                                         e.target.alt = `Podcast image unavailable: ${podcast.title}`;
//                                     }
//                                 }}
//                             />
//                         </React.Fragment>
//                     );
//                 })}

//                 {/* Navigation Arrows */}
//                 <NavigationContainer role="group" aria-label="Carousel navigation">
//                     <NavButton
//                         variant="outline"
//                         size="small"
//                         onClick={handlePrevious}
//                         aria-label="Previous podcast"
//                         title="Go to previous podcast"
//                         disabled={navigationLoading}
//                     >
//                         ‹
//                     </NavButton>
//                     <NavButton
//                         variant="outline"
//                         size="small"
//                         onClick={handleNext}
//                         aria-label="Next podcast"
//                         title="Go to next podcast"
//                         disabled={navigationLoading}
//                     >
//                         ›
//                     </NavButton>
//                 </NavigationContainer>
//             </CarouselContainer>

//             {/* Current Track Info */}
//             <CurrentTrack
//                 onClick={() => handleCardClick(currentIndex)}
//                 onKeyDown={(e) => {
//                     if (e.key === 'Enter' || e.key === ' ') {
//                         e.preventDefault();
//                         handleCardClick(currentIndex);
//                     }
//                 }}
//                 title={`Click to listen to "${currentPodcast?.title || 'this podcast'}"`}
//                 tabIndex={0}
//                 role="button"
//                 aria-label={`Currently selected: ${currentPodcast?.title || 'Loading'}. Click to play this podcast.`}
//                 style={{
//                     opacity: navigationLoading ? 0.6 : 1,
//                     pointerEvents: navigationLoading ? 'none' : 'auto'
//                 }}
//             >
//                 <TrackTitle aria-live="polite">
//                     {navigationLoading ? 'Opening podcast...' : (currentPodcast?.title || 'Loading...')}
//                 </TrackTitle>
//                 <TrackSubtitle>
//                     {navigationLoading
//                         ? 'Please wait while we prepare your audio experience'
//                         : 'Brings real stories from the wild, straight from the field.'
//                     }
//                 </TrackSubtitle>

//                 {/* Audio Waveform Visualization with faded lines - moved below TrackSubtitle */}
//                 <div style={{ position: 'relative', width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
//                     {/* Left faded line extending from waveform */}
//                     <LeftFadedLine />

//                     <AudioVisualization style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none' }}>
//                         {waveformData.map((bar, index) => (
//                             <WaveformBar
//                                 key={index}
//                                 height={bar.height}
//                                 isActive={bar.isActive}
//                             />
//                         ))}
//                     </AudioVisualization>

//                     {/* Right faded line extending from waveform */}
//                     <RightFadedLine />
//                 </div>
//             </CurrentTrack>

//             {/* Navigation Error Display */}
//             {navigationError && (
//                 <div
//                     role="alert"
//                     aria-live="assertive"
//                     style={{
//                         position: 'absolute',
//                         top: '520px', // Adjusted to match new layout
//                         left: '50%',
//                         transform: 'translateX(-50%)',
//                         backgroundColor: 'rgba(220, 53, 69, 0.9)',
//                         color: 'white',
//                         padding: '12px 20px',
//                         borderRadius: '8px',
//                         fontSize: '0.9rem',
//                         textAlign: 'center',
//                         maxWidth: '400px',
//                         zIndex: 10,
//                         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
//                         border: '1px solid rgba(220, 53, 69, 1)'
//                     }}
//                 >
//                     {navigationError}
//                 </div>
//             )}


//             {/* Carousel Dots */}
//             <CarouselDots role="group" aria-label="Podcast indicators">
//                 {podcastData.map((podcast, index) => (
//                     <DotButton
//                         key={index}
//                         variant={index === currentIndex ? "primary" : "ghost"}
//                         size="small"
//                         onClick={() => handleDotClick(index)}
//                         aria-label={`Go to podcast ${index + 1}: ${podcast.title}`}
//                         aria-pressed={index === currentIndex}
//                         title={`${podcast.title} ${index === currentIndex ? '(current)' : ''}`}
//                         disabled={navigationLoading}
//                         isActive={index === currentIndex}
//                     >
//                         &nbsp;
//                     </DotButton>
//                 ))}
//             </CarouselDots>
//         </PodcastCarouselContainer>


//     );
// };

// export default PodcastCarousel;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button } from '../../components/ui';
import LazyImage from '../../components/ui/LazyImage';
import { mediaService } from '../../services/mediaService.js';
import {
    generatePodcastAriaLabel,
    generateCarouselAriaDescription,
    generateLiveAnnouncement,
    KeyboardNavigation,
    ScreenReader,
    HighContrast,
    ReducedMotion,
    focusManager
} from '../../utils/accessibility.js';

// Import podcast images
import PodcastImage1 from '../../assets/images/media/podcastcarousal_1.png';
import PodcastImage2 from '../../assets/images/media/podcastcarousal_2.png';
import PodcastImage3 from '../../assets/images/media/podcastcarousal_3.png';

const PodcastCarouselContainer = styled("div")(({ theme }) => ({
    position: 'relative',
    width: '100%',
    maxWidth: '1000px',
    minHeight: '500px', // Increased height to use more space
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    padding: '3rem 1rem 2rem 1rem', // Increased top padding to push content down
    gap: '1.5rem', // Increased spacing between elements
    overflow: 'visible',
    [theme.breakpoints.down('lg')]: {
        minHeight: '450px',
        padding: '2.5rem 1rem 1.5rem 1rem',
        gap: '1.25rem',
    },
    [theme.breakpoints.down('md')]: {
        minHeight: '400px',
        padding: '2rem 0.5rem 1rem 0.5rem',
        gap: '1rem',
    },
    [theme.breakpoints.down('sm')]: {
        minHeight: '350px',
        padding: '1.5rem 0.25rem 0.75rem 0.25rem',
        gap: '0.75rem',
    },
}));

// Main carousel container for podcast cards - using flex layout
const CarouselContainer = styled("div")(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '350px', // Reduced height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0.5rem', // Reduced margin
    [theme.breakpoints.down('lg')]: {
        height: '300px',
    },
    [theme.breakpoints.down('md')]: {
        height: '250px',
    },
    [theme.breakpoints.down('sm')]: {
        height: '200px',
    },
}));

// Individual podcast card - using TV carousel animation style with accessibility
const PodcastCard = styled(LazyImage)(({ isActive, position }) => ({
    position: 'absolute',
    transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Same as TV carousel
    cursor: 'pointer',
    borderRadius: '50%',
    overflow: 'hidden',
    objectFit: 'cover',
    objectPosition: 'center',
    boxShadow: 'none', // Removed box shadow as requested
    '&:hover': {
        transform: isActive ?
            'translate(-50%, -50%) scale(1.05)' :
            position === 'left' ?
                'translate(-50%, -50%) scale(0.92)' :
                'translate(50%, -50%) scale(0.92)',
        borderColor: 'rgba(255, 232, 161, 0.9)',
    },
    '&:focus': {
        outline: 'none',
        transform: isActive ?
            'translate(-50%, -50%) scale(1.05)' :
            position === 'left' ?
                'translate(-50%, -50%) scale(0.92)' :
                'translate(50%, -50%) scale(0.92)',
        borderColor: 'rgba(255, 232, 161, 0.9)',
    },
    '&:active': {
        transform: isActive ?
            'translate(-50%, -50%) scale(0.98)' :
            position === 'left' ?
                'translate(-50%, -50%) scale(0.85)' :
                'translate(50%, -50%) scale(0.85)',
    },
    ...(isActive ? {
        // Center podcast (active) - matching TV carousel center position
        width: '350px',
        height: '350px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) scale(1)',
        zIndex: 5,
        opacity: 1,
        '@media (max-width: 1200px)': {
            width: '300px',
            height: '300px',
        },
        '@media (max-width: 768px)': {
            width: '240px',
            height: '240px',
        },
        '@media (max-width: 480px)': {
            width: '150px',
            height: '150px',
        },
    } : position === 'left' ? {
        // Left podcast - brought closer to center
        width: '300px',
        height: '300px',
        left: '35%', // Moved from 30% to 35% (closer to center)
        top: '50%',
        transform: 'translate(-50%, -50%) scale(0.9)',
        zIndex: 2,
        opacity: 0.85,
        '@media (max-width: 1200px)': {
            width: '250px',
            height: '250px',
            left: '32%', // Moved from 25% to 32%
        },
        '@media (max-width: 768px)': {
            width: '200px',
            height: '200px',
            left: '28%', // Moved from 20% to 28%
        },
        '@media (max-width: 480px)': {
            width: '120px',
            height: '120px',
            left: '25%', // Moved from 15% to 25%
        },
    } : {
        // Right podcast - brought closer to center
        width: '300px',
        height: '300px',
        right: '35%', // Moved from 30% to 35% (closer to center)
        top: '50%',
        transform: 'translate(50%, -50%) scale(0.9)',
        zIndex: 2,
        opacity: 0.85,
        '@media (max-width: 1200px)': {
            width: '250px',
            height: '250px',
            right: '32%', // Moved from 25% to 32%
        },
        '@media (max-width: 768px)': {
            width: '200px',
            height: '200px',
            right: '28%', // Moved from 20% to 28%
        },
        '@media (max-width: 480px)': {
            width: '120px',
            height: '120px',
            right: '25%', // Moved from 15% to 25%
        },
    }),
}));

// Navigation container - using flex layout
const NavigationContainer = styled("div")(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px', // Match CardCarousel positioning
    zIndex: 10,
    pointerEvents: 'auto', // Allow pointer events for buttons
    [theme.breakpoints.down('md')]: {
        padding: '0 15px', // Slightly reduced for medium screens
    },
    [theme.breakpoints.down('sm')]: {
        padding: '0 10px', // Slightly reduced for small screens
    },
}));

// Navigation button styling - matching TV carousel
const NavButton = styled(Button)(({ theme }) => ({
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
    '&:hover': {
        transform: 'scale(1.1)',
        backgroundColor: 'rgba(255, 232, 161, 1)',
        color: 'rgba(30, 45, 39, 1)',
        boxShadow: '0 6px 30px rgba(255, 232, 161, 0.8)',
    },
    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    [theme.breakpoints.down('md')]: {
        width: '70px',
        height: '70px',
        fontSize: '35px',
        minWidth: '70px',
        minHeight: '70px',
    },
    [theme.breakpoints.down('sm')]: {
        width: '60px',
        height: '60px',
        fontSize: '30px',
        minWidth: '60px',
        minHeight: '60px',
    },
}));

// Current track info - using flex layout
const CurrentTrack = styled("div")(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    color: 'rgba(255, 232, 161, 1)',
    width: '100%',
    maxWidth: '600px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: '0.5rem', // Reduced padding
    '&:hover': {
        opacity: 0.8,
        transform: 'scale(1.02)',
    },
    [theme.breakpoints.down('lg')]: {
        maxWidth: '500px',
        padding: '0.4rem',
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: '400px',
        padding: '0.3rem',
    },
    [theme.breakpoints.down('sm')]: {
        maxWidth: '280px',
        padding: '0.2rem',
    },
}));

const TrackTitle = styled("div")(({ theme }) => ({
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: '24px',
    marginBottom: '10px',
    letterSpacing: '1.8px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    color: 'rgba(255, 232, 161, 1)',
    textTransform: 'uppercase',
    [theme.breakpoints.down('lg')]: {
        fontSize: '22px',
        letterSpacing: '1.5px',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '20px',
        letterSpacing: '1.2px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        letterSpacing: '1px',
    },
}));

const TrackSubtitle = styled("div")(({ theme }) => ({
    fontFamily: 'DM Sans',
    fontWeight: '500',
    fontSize: '16px',
    color: 'rgba(255, 232, 161, 1)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
    lineHeight: '1.5',
    [theme.breakpoints.down('lg')]: {
        fontSize: '15px',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '14px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}));

// Animated Progress Dots Container
const ProgressDotsContainer = styled("div")(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '0.5rem 0',
    [theme.breakpoints.down('lg')]: {
        gap: '10px',
    },
    [theme.breakpoints.down('md')]: {
        gap: '8px',
    },
    [theme.breakpoints.down('sm')]: {
        gap: '6px',
    },
}));

// Individual Progress Dot
const ProgressDot = styled("div")(({ isActive, isPast, theme }) => ({
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 232, 161, 0.4)',
    backgroundColor: isActive ? 'rgba(255, 232, 161, 1)' : 
                    isPast ? 'rgba(255, 232, 161, 0.6)' : 
                    'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    
    // Active dot animation
    ...(isActive && {
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        boxShadow: '0 0 20px rgba(255, 232, 161, 0.4)',
        borderColor: 'rgba(255, 232, 161, 1)',
    }),
    
    // Hover effect
    '&:hover': {
        transform: 'scale(1.2)',
        borderColor: 'rgba(255, 232, 161, 0.8)',
        backgroundColor: isPast || isActive ? 'rgba(255, 232, 161, 0.8)' : 'rgba(255, 232, 161, 0.3)',
    },
    
    // Keyframe animation for active dot
    '@keyframes pulse': {
        '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
        },
        '50%': {
            transform: 'scale(1.1)',
            opacity: '0.8',
        },
    },
    
    [theme.breakpoints.down('md')]: {
        width: '12px',
        height: '12px',
    },
    [theme.breakpoints.down('sm')]: {
        width: '10px',
        height: '10px',
    },
}));

// Progress Line between dots
const ProgressLine = styled("div")(({ isCompleted, theme }) => ({
    width: '24px',
    height: '2px',
    backgroundColor: isCompleted ? 'rgba(255, 232, 161, 0.6)' : 'rgba(255, 232, 161, 0.2)',
    transition: 'all 0.5s ease',
    position: 'relative',
    
    // Animated progress line
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: isCompleted ? '100%' : '0%',
        backgroundColor: 'rgba(255, 232, 161, 1)',
        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    [theme.breakpoints.down('md')]: {
        width: '20px',
    },
    [theme.breakpoints.down('sm')]: {
        width: '16px',
    },
}));

// Audio waveform visualization - updated for relative positioning
const AudioVisualization = styled("div")(({ theme }) => ({
    width: '500px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    zIndex: 4,
    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 232, 161, 0.1) 20%, rgba(255, 232, 161, 0.1) 80%, transparent 100%)',
    borderRadius: '20px',
    padding: '0 20px',
    [theme.breakpoints.down('lg')]: {
        width: '400px',
        height: '35px',
    },
    [theme.breakpoints.down('md')]: {
        width: '300px',
        height: '30px',
        gap: '1.5px',
        padding: '0 15px',
    },
    [theme.breakpoints.down('sm')]: {
        width: '200px',
        height: '25px',
        gap: '1px',
        padding: '0 10px',
    },
}));

// Left faded line extending from waveform
const LeftFadedLine = styled("div")(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '0',
    width: '50%',
    height: '10px',
    transform: 'translateY(-50%)',
    background: 'linear-gradient(90deg, rgba(255, 232, 161, 0.3) 0%, rgba(255, 232, 161, 0.1) 70%, transparent 90%)',
    zIndex: 3,
    [theme.breakpoints.down('lg')]: {
        height: '5px',
    },
    [theme.breakpoints.down('md')]: {
        height: '4px',
    },
    [theme.breakpoints.down('sm')]: {
        height: '3px',
    },
}));

// Right faded line extending from waveform
const RightFadedLine = styled("div")(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    right: '0',
    width: '50%',
    height: '10px',
    transform: 'translateY(-50%)',
    background: 'linear-gradient(90deg, transparent 10%, rgba(255, 232, 161, 0.1) 30%, rgba(255, 232, 161, 0.3) 100%)',
    zIndex: 3,
    [theme.breakpoints.down('lg')]: {
        height: '5px',
    },
    [theme.breakpoints.down('md')]: {
        height: '4px',
    },
    [theme.breakpoints.down('sm')]: {
        height: '3px',
    },
}));

// Individual waveform bar - streamlined horizontal band style
const WaveformBar = styled("div")(({ height, isActive, theme }) => ({
    width: '3px',
    height: `${height}%`,
    backgroundColor: isActive ? 'rgba(255, 232, 161, 1)' : 'rgba(255, 232, 161, 0.8)',
    borderRadius: '1.5px',
    transition: 'all 0.2s ease',
    animation: isActive ? 'waveformPulse 1.2s ease-in-out infinite alternate' : 'none',
    '@keyframes waveformPulse': {
        '0%': {
            opacity: 0.8,
            backgroundColor: 'rgba(255, 232, 161, 0.8)',
            transform: 'scaleY(1)'
        },
        '100%': {
            opacity: 1,
            backgroundColor: 'rgba(255, 232, 161, 1)',
            transform: 'scaleY(1.2)'
        },
    },
    [theme.breakpoints.down('md')]: {
        width: '2.5px',
        borderRadius: '1.25px',
    },
    [theme.breakpoints.down('sm')]: {
        width: '2px',
        borderRadius: '1px',
    },
}));

export const PodcastCarousel = ({ className }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0); // Start with first card active
    const [isPlaying, setIsPlaying] = useState(false);

    // State for podcast data
    const [podcastData, setPodcastData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    // Enhanced navigation functionality
    const [navigationLoading, setNavigationLoading] = useState(false);
    const [navigationError, setNavigationError] = useState(null);

    // Accessibility and keyboard navigation
    const [focusedIndex, setFocusedIndex] = useState(0);
    const cardRefs = React.useRef([]);

    // Accessibility state
    const [announceText, setAnnounceText] = useState('');
    const [isHighContrast, setIsHighContrast] = useState(HighContrast.isHighContrastMode());
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(ReducedMotion.prefersReducedMotion());

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

    // Initialize card refs
    React.useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, podcastData.length);
    }, [podcastData.length]);

    // Auto-rotate carousel - matching TV carousel timing
    useEffect(() => {
        if (podcastData.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % podcastData.length);
        }, 4000); // Same interval as TV carousel
        return () => clearInterval(interval);
    }, [podcastData.length]);

    // Generate horizontal band waveform data
    const waveformData = Array.from({ length: 100 }, (_, i) => {
        // Create a more uniform horizontal band pattern
        let height;
        const position = i / 100; // Position from 0 to 1

        // Create a wave pattern that's more uniform but still has variation
        if (position < 0.15 || position > 0.85) {
            height = Math.random() * 25 + 20; // Lower on edges
        } else if (position >= 0.4 && position <= 0.6) {
            height = Math.random() * 35 + 55; // Higher in center
        } else {
            height = Math.random() * 30 + 35; // Medium elsewhere
        }

        return {
            height,
            isActive: isPlaying && (i % 6 === 0 || i % 9 === 0 || i % 13 === 0) // More frequent active bars
        };
    });

    // Navigation handlers - matching TV carousel logic
    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + podcastData.length) % podcastData.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % podcastData.length);
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };


    const handlePodcastClick = async (index) => {
        const podcast = podcastData[index];

        try {
            setNavigationLoading(true);
            setNavigationError(null);

            if (podcast && podcast.id) {
                // Validate podcast exists before navigation
                await mediaService.getPodcastById(podcast.id);

                // Navigate to podcast detail page with proper URL generation
                const podcastUrl = `/podcast/${podcast.id}`;
                navigate(podcastUrl);
            } else {
                // Fallback: set as current if no ID available
                setCurrentIndex(index);
                setIsPlaying(!isPlaying);

                // Show user feedback for missing podcast data
                setNavigationError('Podcast details not available. Please try again later.');
                setTimeout(() => setNavigationError(null), 3000);
            }
        } catch (error) {
            console.error('Navigation failed:', error);

            // Enhanced error handling with user feedback
            let errorMessage = 'Failed to open podcast. ';

            if (error.message.includes('not found')) {
                errorMessage += 'This podcast may have been removed.';
            } else if (error.message.includes('network') || error.message.includes('connection')) {
                errorMessage += 'Please check your connection and try again.';
            } else {
                errorMessage += 'Please try again later.';
            }

            setNavigationError(errorMessage);

            // Auto-clear error after 5 seconds
            setTimeout(() => setNavigationError(null), 5000);
        } finally {
            setNavigationLoading(false);
        }
    };

    const handleCardClick = handlePodcastClick;

    // Keyboard navigation handlers
    const handleKeyDown = (event, index) => {
        switch (event.key) {
            case 'Enter':
            case ' ': // Space key
                event.preventDefault();
                handlePodcastClick(index);
                break;
            case 'ArrowLeft':
                event.preventDefault();
                const prevIndex = (index - 1 + podcastData.length) % podcastData.length;
                setFocusedIndex(prevIndex);
                setCurrentIndex(prevIndex);
                cardRefs.current[prevIndex]?.focus();
                break;
            case 'ArrowRight':
                event.preventDefault();
                const nextIndex = (index + 1) % podcastData.length;
                setFocusedIndex(nextIndex);
                setCurrentIndex(nextIndex);
                cardRefs.current[nextIndex]?.focus();
                break;
            case 'Home':
                event.preventDefault();
                setFocusedIndex(0);
                setCurrentIndex(0);
                cardRefs.current[0]?.focus();
                break;
            case 'End':
                event.preventDefault();
                const lastIndex = podcastData.length - 1;
                setFocusedIndex(lastIndex);
                setCurrentIndex(lastIndex);
                cardRefs.current[lastIndex]?.focus();
                break;
            default:
                break;
        }
    };

    // Focus management
    const handleFocus = (index) => {
        setFocusedIndex(index);
    };

    const handleBlur = () => {
        // Keep focused index for visual indicators
    };

    // Enhanced podcast data fetching with comprehensive error handling and fallbacks
    const fetchPodcastData = async (currentRetryCount = 0) => {
        const maxRetries = 3;

        try {
            setLoading(true);
            setError(null);
            setRetryCount(currentRetryCount);

            // Get podcasts from API using the carousel-specific method
            const podcasts = await mediaService.getPodcastsForCarousel(6);

            if (podcasts && podcasts.length > 0) {
                // Transform API data to match component format
                let transformedPodcasts = podcasts.map((podcast, index) => ({
                    id: podcast.id,
                    title: podcast.display_title || podcast.title || `Podcast Episode ${index + 1}`,
                    host: podcast.display_host || 'Unknown Host',
                    image: podcast.thumbnail_url || podcast.file_url || PodcastImage1,
                    description: podcast.description || 'No description available',
                    duration: podcast.display_duration || 'Unknown duration',
                    url: `/podcast/${podcast.id}`,
                    isFallback: false
                }));

                // Ensure minimum 3 cards for better carousel presentation
                // Duplicate items if we have fewer than 3
                if (transformedPodcasts.length < 3) {
                    const duplicates = [];
                    let duplicateCount = 0;
                    while (transformedPodcasts.length + duplicates.length < 3) {
                        const original = transformedPodcasts[duplicateCount % transformedPodcasts.length];
                        duplicates.push({
                            ...original,
                            id: `${original.id}-duplicate-${duplicateCount}`
                        });
                        duplicateCount++;
                    }
                    transformedPodcasts = [...transformedPodcasts, ...duplicates];
                }

                setPodcastData(transformedPodcasts);
                setError(null);
                setRetryCount(0);
            } else {
                // No podcasts found - show empty state
                console.log('No podcasts found');
                setPodcastData([]);
                setError('No podcasts available yet. Check back soon!');
            }
        } catch (err) {
            console.error('Failed to fetch podcast data:', err);

            // Implement retry logic for retryable errors
            const isRetryableError = err.message.includes('network') ||
                err.message.includes('timeout') ||
                err.message.includes('fetch') ||
                err.message.includes('500') ||
                err.message.includes('502') ||
                err.message.includes('503');

            if (currentRetryCount < maxRetries && isRetryableError) {
                console.log(`Retrying podcast fetch (attempt ${currentRetryCount + 1}/${maxRetries})`);
                const delay = Math.min(1000 * Math.pow(2, currentRetryCount), 5000); // Exponential backoff with max 5s
                setTimeout(() => fetchPodcastData(currentRetryCount + 1), delay);
                return;
            }

            // Enhanced error messages with actionable suggestions
            let errorMessage = 'Unable to load podcasts. ';
            let suggestions = [];

            if (err.message.includes('network') || err.message.includes('fetch')) {
                errorMessage += 'Please check your internet connection.';
                suggestions = ['Check your internet connection', 'Try refreshing the page', 'Try again in a few moments'];
            } else if (err.message.includes('404')) {
                errorMessage += 'Podcast service is temporarily unavailable.';
                suggestions = ['Try again later', 'Contact support if the problem persists'];
            } else if (err.message.includes('403')) {
                errorMessage += 'Access to podcasts is restricted.';
                suggestions = ['Check your account permissions', 'Contact support for access'];
            } else {
                errorMessage += 'An unexpected error occurred.';
                suggestions = ['Try refreshing the page', 'Try again in a few moments', 'Contact support if the problem persists'];
            }

            setError({ message: errorMessage, suggestions });

            // Set empty array on error
            setPodcastData([]);
        } finally {
            setLoading(false);
        }
    };

    // Manual retry function for user-initiated retries
    const handleRetry = () => {
        setRetryCount(0);
        fetchPodcastData(0);
    };

    // Fetch podcast data on component mount
    useEffect(() => {
        // Fetch real data immediately
        fetchPodcastData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Safely get current podcast with fallback
    const currentPodcast = podcastData[currentIndex] || podcastData[0] || {
        title: 'Loading...',
        host: 'Unknown Host'
    };

    if (error && (!podcastData || podcastData.length === 0)) {
        const errorMessage = typeof error === 'string' ? error : error.message;
        const suggestions = typeof error === 'object' ? error.suggestions : [];

        return (
            <PodcastCarouselContainer className={className}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'rgba(255, 232, 161, 1)',
                    fontSize: '1.1rem',
                    gap: '20px',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Unable to Load Podcasts
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, maxWidth: '400px' }}>
                        {errorMessage}
                    </div>

                    {suggestions.length > 0 && (
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, maxWidth: '350px' }}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Try these solutions:</div>
                            <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0 }}>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} style={{ marginBottom: '4px' }}>{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Button
                            variant="outline"
                            onClick={handleRetry}
                            disabled={loading}
                            style={{
                                border: '2px solid rgba(255, 232, 161, 0.8)',
                                backgroundColor: 'rgba(30, 45, 39, 0.9)',
                                color: 'rgba(255, 232, 161, 1)',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Retrying...' : 'Try Again'}
                        </Button>


                    </div>

                    {retryCount > 0 && (
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                            Retry attempt: {retryCount}/3
                        </div>
                    )}
                </div>
            </PodcastCarouselContainer>
        );
    }

    // Don't render if no podcast data after loading
    if (!podcastData || podcastData.length === 0) {
        return (
            <PodcastCarouselContainer className={className}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'rgba(255, 232, 161, 1)',
                    fontSize: '1.1rem',
                    gap: '20px',
                    textAlign: 'center'
                }}>
                    <div>No podcasts available</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                        Check back soon for new wildlife stories
                    </div>
                </div>
            </PodcastCarouselContainer>
        );
    }

    // Announce changes to screen readers
    const announceToScreenReader = (type, data) => {
        const message = generateLiveAnnouncement(type, data);
        if (message) {
            setAnnounceText(message);
            ScreenReader.announce(message);
        }
    };



    return (
        <PodcastCarouselContainer
            className={`${className} podcast-carousel ${isHighContrast ? 'high-contrast-mode' : ''} ${prefersReducedMotion ? 'reduced-motion' : ''}`}
            role="region"
            aria-label="Podcast carousel"
            aria-describedby="carousel-instructions"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Screen reader instructions */}
            <div
                id="carousel-instructions"
                className="sr-only"
                style={{
                    position: 'absolute',
                    left: '-10000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }}
            >
                {generateCarouselAriaDescription(podcastData.length)}
                Use arrow keys to navigate between podcasts, Enter or Space to select and play a podcast.
                There are {podcastData.length} podcasts available.
            </div>

            {/* Live region for announcements */}
            <div
                className="live-region"
                aria-live="polite"
                aria-atomic="true"
                role="status"
            >
                {announceText}
            </div>

            {/* Main Carousel Container */}
            <CarouselContainer
                role="group"
                aria-label={`Podcast carousel with ${podcastData.length} episodes`}
            >
                {podcastData.map((podcast, index) => {
                    let position = '';
                    if (index === currentIndex) {
                        position = 'center';
                    } else if (index === (currentIndex - 1 + podcastData.length) % podcastData.length) {
                        position = 'left';
                    } else {
                        position = 'right';
                    }

                    return (
                        <React.Fragment key={`podcast-${podcast.id}`}>
                            {/* Hidden description for screen readers */}
                            <div
                                id={`podcast-description-${index}`}
                                style={{
                                    position: 'absolute',
                                    left: '-10000px',
                                    width: '1px',
                                    height: '1px',
                                    overflow: 'hidden'
                                }}
                            >
                                {podcast.description || `Podcast episode ${index + 1} of ${podcastData.length}`}
                                {podcast.duration && `. Duration: ${podcast.duration}`}
                            </div>

                            <PodcastCard
                                key={podcast.id}
                                ref={el => cardRefs.current[index] = el}
                                src={podcast.image}
                                alt={`${podcast.title} by ${podcast.host}. Click to listen to this podcast episode.`}
                                title={navigationLoading ? 'Loading...' : `Click to listen to "${podcast.title}" by ${podcast.host}`}
                                isActive={index === currentIndex}
                                position={position}
                                onClick={() => handleCardClick(index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={() => handleFocus(index)}
                                onBlur={handleBlur}
                                loading="lazy"
                                tabIndex={0}
                                role="button"
                                aria-label={`Podcast: ${podcast.title} by ${podcast.host}. ${index === currentIndex ? 'Currently selected. ' : ''}Press Enter or Space to play, use arrow keys to navigate.`}
                                aria-describedby={`podcast-description-${index}`}
                                aria-pressed={index === currentIndex}
                                style={{
                                    opacity: navigationLoading ? 0.6 : 1,
                                    pointerEvents: navigationLoading ? 'none' : 'auto',
                                    cursor: navigationLoading ? 'wait' : 'pointer'
                                }}
                                onError={(e) => {
                                    // Enhanced fallback handling for missing images with multiple fallbacks
                                    console.warn(`Failed to load image for podcast: ${podcast.title}`);

                                    // Try fallback images in order
                                    if (e.target.src !== PodcastImage1) {
                                        e.target.src = PodcastImage1;
                                    } else if (e.target.src !== PodcastImage2) {
                                        e.target.src = PodcastImage2;
                                    } else if (e.target.src !== PodcastImage3) {
                                        e.target.src = PodcastImage3;
                                    } else {
                                        // Final fallback: create a placeholder
                                        e.target.style.backgroundColor = 'rgba(255, 232, 161, 0.2)';
                                        e.target.style.border = '2px dashed rgba(255, 232, 161, 0.5)';
                                        e.target.alt = `Podcast image unavailable: ${podcast.title}`;
                                    }
                                }}
                            />
                        </React.Fragment>
                    );
                })}

                {/* Navigation Arrows */}
                <NavigationContainer role="group" aria-label="Carousel navigation">
                    <NavButton
                        variant="outline"
                        size="large"
                        onClick={handlePrevious}
                        aria-label="Previous podcast"
                        title="Go to previous podcast"
                        disabled={navigationLoading}
                    >
                        ❮
                    </NavButton>
                    <NavButton
                        variant="outline"
                        size="large"
                        onClick={handleNext}
                        aria-label="Next podcast"
                        title="Go to next podcast"
                        disabled={navigationLoading}
                    >
                        ❯
                    </NavButton>
                </NavigationContainer>
            </CarouselContainer>

            {/* Current Track Info */}
            <CurrentTrack
                onClick={() => handleCardClick(currentIndex)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(currentIndex);
                    }
                }}
                title={`Click to listen to "${currentPodcast?.title || 'this podcast'}"`}
                tabIndex={0}
                role="button"
                aria-label={`Currently selected: ${currentPodcast?.title || 'Loading'}. Click to play this podcast.`}
                style={{
                    opacity: navigationLoading ? 0.6 : 1,
                    pointerEvents: navigationLoading ? 'none' : 'auto'
                }}
            >
                <TrackTitle aria-live="polite">
                    {navigationLoading ? 'Opening podcast...' : (currentPodcast?.title || 'Loading...')}
                </TrackTitle>
                <TrackSubtitle>
                    {navigationLoading
                        ? 'Please wait while we prepare your audio experience'
                        : 'Brings real stories from the wild, straight from the field.'
                    }
                </TrackSubtitle>

                {/* Audio Waveform Visualization with faded lines - moved below TrackSubtitle */}
                <div style={{ position: 'relative', width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                    {/* Left faded line extending from waveform */}
                    <LeftFadedLine />

                    <AudioVisualization style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none' }}>
                        {waveformData.map((bar, index) => (
                            <WaveformBar
                                key={index}
                                height={bar.height}
                                isActive={bar.isActive}
                            />
                        ))}
                    </AudioVisualization>

                    {/* Right faded line extending from waveform */}
                    <RightFadedLine />
                </div>
            </CurrentTrack>

            {/* Navigation Error Display */}
            {navigationError && (
                <div
                    role="alert"
                    aria-live="assertive"
                    style={{
                        position: 'absolute',
                        top: '520px', // Adjusted to match new layout
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(220, 53, 69, 0.9)',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        maxWidth: '400px',
                        zIndex: 10,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(220, 53, 69, 1)'
                    }}
                >
                    {navigationError}
                </div>
            )}


            {/* Animated Progress Dots */}
            <ProgressDotsContainer role="group" aria-label="Podcast indicators">
                {podcastData.map((podcast, index) => (
                    <React.Fragment key={index}>
                        <ProgressDot
                            isActive={index === currentIndex}
                            isPast={index < currentIndex}
                            onClick={() => handleDotClick(index)}
                            title={`Go to podcast ${index + 1}: ${podcast.title}`}
                        />
                        {index < podcastData.length - 1 && (
                            <ProgressLine isCompleted={index < currentIndex} />
                        )}
                    </React.Fragment>
                ))}
            </ProgressDotsContainer>
        </PodcastCarouselContainer>


    );
};

export default PodcastCarousel; 