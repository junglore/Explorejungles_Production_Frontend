// import React, { useEffect, useRef, useState } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { styled } from '@mui/material/styles';
// import { useTheme } from '@mui/material/styles';
// import { useMediaQuery } from '@mui/material';
// import { Link } from 'react-router-dom';

// // Import images
// import MediaPageImage from '../../assets/images/pages/MediaPage.png';
// import MediaWildlifeImage from '../../assets/images/Media_Wildlife.png';
// import Header from '../../components/common/Header.jsx';
// import Footer from '../../components/common/Footer.jsx';
// import { CardCarousel } from './CardCarousel.jsx';
// import { PodcastCarousel } from './PodcastCarousel.jsx';

// // Import new Figma assets for Gallery and Podcast sections (you'll need to add these)
// // Note: These imports will cause errors until assets are added. Comment out if assets don't exist yet.
// import PodcastsImage from '../../assets/icons/PODCASTS.svg';
// import VinesImage from '../../assets/images/media/download-vines-leaves-green-royalty-free-stock-illustration-image-4.png';
// import PlantsImage from '../../assets/images/media/lost-found-albion-place-leeds-i-want-plants-1.png';
// import RectangleImage from '../../assets/images/media/Rectangle.png';


// // Register GSAP plugins
// gsap.registerPlugin(ScrollTrigger);

// const MediaContainer = styled("div")({
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     display: `flex`,
//     position: `relative`,
//     flexDirection: `column`,
//     width: `100%`,
//     minHeight: `100vh`,
//     justifyContent: `flex-start`,
//     alignItems: `flex-start`,
//     padding: `0px`,
//     boxSizing: `border-box`,
//     overflow: `visible`,
// });

// // Hero Section (keeping original)
// const HeroSection = styled("div")({
//     backgroundImage: `url(${MediaPageImage})`,
//     backgroundPosition: `center`,
//     backgroundSize: `cover`,
//     backgroundRepeat: `no-repeat`,
//     display: `flex`,
//     position: `relative`,
//     flexDirection: `column`,
//     justifyContent: `center`,
//     alignItems: `center`,
//     padding: `120px 40px 80px`,
//     boxSizing: `border-box`,
//     width: `100%`,
//     minHeight: `100vh`,
//     overflow: `hidden`,
// });

// // Hero Image Component (original)
// const HeroImage = styled("img")({
//     maxWidth: `80%`,
//     maxHeight: `80%`,
//     width: `auto`,
//     height: `auto`,
//     objectFit: `contain`,
// });

// // Hero Text Component - "A VOYAGE THROUGH SIGHTS WORTH SAILING FOR!" (Responsive)
// const HeroText = styled("div")(({ theme }) => ({
//     position: `absolute`,
//     bottom: `10%`,
//     left: `50%`,
//     transform: `translateX(-50%)`,
//     width: `90%`,
//     maxWidth: `924px`,
//     fontFamily: `"DM Sans", Helvetica`,
//     fontWeight: `700`,
//     fontSize: `28px`,
//     lineHeight: `48px`,
//     letterSpacing: `0.56px`,
//     textAlign: `center`,
//     display: `flex`,
//     alignItems: `center`,
//     justifyContent: `center`,
//     color: `rgba(255, 232, 161, 0.9)`,
//     zIndex: 2,
//     padding: `0 20px`,
//     [theme.breakpoints.down('lg')]: {
//         fontSize: `24px`,
//         lineHeight: `40px`,
//         letterSpacing: `0.4px`,
//     },
//     [theme.breakpoints.down('md')]: {
//         fontSize: `20px`,
//         lineHeight: `32px`,
//         letterSpacing: `0.3px`,
//         bottom: `10%`,
//     },
//     [theme.breakpoints.down('sm')]: {
//         fontSize: `18px`,
//         lineHeight: `28px`,
//         letterSpacing: `0.2px`,
//         bottom: `8%`,
//     },
// }));

// // Unified section layout (following HomePage pattern)
// const SectionLayout = styled('div')(({ height, bgColor }) => ({
//     position: 'relative',
//     width: '100%',
//     height: height || '100vh',
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     backgroundColor: bgColor || 'rgba(30, 45, 39, 1)',
//     overflow: 'visible',
//     padding: '0 8%',
// }));

// // Large background text (following HomePage pattern)
// const BackgroundText = styled("div")(({ align }) => ({
//     textAlign: align || 'center',
//     color: `rgba(205, 217, 157, 0.15)`,
//     fontFamily: `"Helvetica Compressed", sans-serif`,
//     fontWeight: `700`,
//     fontSize: `170px`,
//     lineHeight: `280px`,
//     letterSpacing: `5px`,
//     position: `absolute`,
//     [align === 'right' ? 'right' : 'left']: align === 'right' ? '1%' : '50%',
//     transform: align === 'right' ? 'none' : 'translateX(-50%)',
//     top: `40px`,
//     zIndex: 1,
//     userSelect: `none`,
//     pointerEvents: `none`,
// }));

// // Content container
// const SectionContent = styled("div")({
//     position: `relative`,
//     width: `100%`,
//     height: `100%`,
//     display: `flex`,
//     alignItems: `flex-start`,
//     justifyContent: `space-between`,
//     zIndex: 2,
// });

// // Text block for sections (following HomePage pattern)
// const SectionTextBlock = styled('div')(({ align, marginTop }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     justifyContent: 'flex-start',
//     marginLeft: align === 'right' ? '0' : '20px',
//     marginRight: align === 'right' ? '20px' : '0',
//     paddingTop: marginTop || '300px',
//     zIndex: 10,
//     maxWidth: '540px',
//     textAlign: align === 'right' ? 'right' : 'left',
// }));

// // Main text content (following HomePage pattern)
// const MainTextBlock = styled("div")(({ align }) => ({
//     width: '381px',
//     color: '#ffe8a1',
//     fontFamily: '"DM Sans-Medium", Helvetica',
//     fontWeight: 500,
//     fontSize: '20px',
//     lineHeight: '20px',
//     letterSpacing: '0.56px',
//     textAlign: align === 'right' ? 'right' : 'left',
//     marginBottom: '20px',
// }));

// // Explore link (following HomePage pattern)
// const ExploreLink = styled(Link)({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `700`,
//     fontSize: `16px`,
//     letterSpacing: `2px`,
//     textTransform: `uppercase`,
//     cursor: `pointer`,
//     textDecoration: 'none',
//     position: `relative`,
//     paddingBottom: `5px`,
//     marginTop: `16px`,
//     display: 'inline-block',
//     '&::after': {
//         content: '""',
//         position: `absolute`,
//         bottom: `0`,
//         left: `0`,
//         width: `100%`,
//         height: `2px`,
//         backgroundColor: `rgba(255, 232, 161, 1)`,
//     },
//     '&:hover': {
//         opacity: 0.8,
//     },
// });

// // Gallery section with 3D carousel (Responsive)
// const GallerySection = styled("div")({
//     position: 'relative',
//     width: '100%',
//     minHeight: '130vh',
//     backgroundColor: 'rgba(30, 45, 39, 1)',
//     overflow: 'visible',
//     '@media (max-width: 1200px)': {
//         minHeight: '130vh',
//     },
//     '@media (max-width: 768px)': {
//         minHeight: '110vh',
//     },
//     '@media (max-width: 480px)': {
//         minHeight: '120vh',
//     },
// });

// // Gallery content text - Figma specs (Fixed positioning)
// const GalleryText = styled("div")({
//     position: `absolute`,
//     width: `562px`,
//     height: `59px`,
//     top: `163px`,
//     left: `50%`,
//     transform: `translateX(-50%)`,
//     color: `#FFE8A1`,
//     fontFamily: '"DM Sans-Medium", Helvetica',
//     fontWeight: `500`,
//     fontSize: `16px`,
//     lineHeight: `20px`,
//     letterSpacing: `0.56px`,
//     textAlign: `center`,
//     display: `flex`,
//     alignItems: `center`,
//     justifyContent: `center`,
//     zIndex: 10,
//     '@media (max-width: 1200px)': {
//         width: `90%`,
//         maxWidth: `562px`,
//         fontSize: `15px`,
//         lineHeight: `19px`,
//     },
//     '@media (max-width: 768px)': {
//         fontSize: `14px`,
//         lineHeight: `18px`,
//         letterSpacing: `0.4px`,
//         width: `85%`,
//         top: `120px`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `12px`,
//         lineHeight: `16px`,
//         letterSpacing: `0.3px`,
//         width: `90%`,
//         top: `100px`,
//     },
// });

// // Decorative elements (Responsive) - Positioned at bottom of screen
// const VinesDecoration = styled("img")(({ theme }) => ({
//     position: `absolute`,
//     left: `-3%`,
//     width: `40%`,
//     bottom: `-50%`,
//     height: `auto`,
//     maxWidth: `555px`,
//     zIndex: 15,
//     [theme.breakpoints.down('lg')]: {
//         width: `35%`,
//         left: `-2%`,
//         bottom: `-40%`,
//     },
//     [theme.breakpoints.down('md')]: {
//         width: `30%`,
//         left: `-1%`,
//         bottom: `-45%`,
//     },
//     [theme.breakpoints.down('sm')]: {
//         width: `25%`,
//         left: `0%`,
//         bottom: `-10%`,
//     },
// }));

// const RectangleDecoration = styled("img")({
//     position: `absolute`,
//     right: `0`,
//     top: `0`,
//     width: `27%`,
//     height: `auto`,
//     maxWidth: `390px`,
//     zIndex: 3,
//     '@media (max-width: 1200px)': {
//         width: `25%`,
//     },
//     '@media (max-width: 768px)': {
//         width: `22%`,
//     },
//     '@media (max-width: 480px)': {
//         width: `20%`,
//     },
// });

// // Podcast section (Responsive) - Matching Figma layout
// const PodcastSection = styled("div")({
//     position: 'relative',
//     width: '100%',
//     minHeight: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//     backgroundColor: 'rgba(30, 45, 39, 1)',
//     overflow: 'visible',
//     padding: '0px',
//     paddingBottom: '2rem', // Add bottom padding to prevent footer overlap
//     '@media (max-width: 1200px)': {
//         padding: '0px',
//         paddingBottom: '2rem',
//     },
//     '@media (max-width: 768px)': {
//         padding: '0px',
//         paddingBottom: '2rem',
//         alignItems: 'center',
//         textAlign: 'center',
//     },
//     '@media (max-width: 480px)': {
//         padding: '0px',
//         paddingBottom: '2rem',
//         minHeight: '100vh',
//     },
// });

// const PodcastsTitle = styled("img")({
//     position: 'absolute',
//     height: `auto`,
//     width: `366px`,
//     left: `128px`,
//     top: `0px`,
//     '@media (max-width: 1200px)': {
//         width: `320px`,
//         left: `80px`,
//     },
//     '@media (max-width: 768px)': {
//         width: `280px`,
//         left: `50%`,
//         transform: `translateX(-50%)`,
//     },
//     '@media (max-width: 480px)': {
//         width: `250px`,
//     },
// });

// const PodcastText = styled("div")({
//     position: 'absolute',
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
//     fontSize: `24px`,
//     fontWeight: `400`,
//     letterSpacing: `0.5618497729301453px`,
//     lineHeight: `20px`,
//     maxWidth: `461px`,
//     width: `461px`,
//     height: `43px`,
//     left: `128px`,
//     top: `101px`,
//     '@media (max-width: 1200px)': {
//         fontSize: `22px`,
//         width: `400px`,
//         left: `80px`,
//         top: `90px`,
//     },
//     '@media (max-width: 768px)': {
//         fontSize: `20px`,
//         letterSpacing: `0.4px`,
//         lineHeight: `18px`,
//         width: `90%`,
//         left: `50%`,
//         transform: `translateX(-50%)`,
//         textAlign: `center`,
//         top: `80px`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `18px`,
//         letterSpacing: `0.3px`,
//         lineHeight: `16px`,
//         width: `90%`,
//         top: `70px`,
//     },
// });

// const PodcastSubtext = styled("span")({
//     fontFamily: `"DM Sans-Medium", Helvetica`,
//     fontSize: `16px`,
//     fontWeight: `500`,
//     letterSpacing: `0.09px`,
// });

// // Podcast Carousel Container - Simple wrapper for positioning
// const PodcastCarouselContainer = styled("div")({
//     position: 'relative',
//     width: '100%',
//     marginTop: '4rem', // Increased top margin to push carousel down
//     marginBottom: '2rem',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'visible',
//     '@media (max-width: 1200px)': {
//         marginTop: '3rem',
//         marginBottom: '1.5rem',
//     },
//     '@media (max-width: 768px)': {
//         marginTop: '2.5rem',
//         marginBottom: '1rem',
//     },
//     '@media (max-width: 480px)': {
//         marginTop: '2rem',
//         marginBottom: '0.5rem',
//     },
// });

// const PlantsDecoration = styled("img")(({ theme }) => ({
//     position: `absolute`,
//     right: `0%`,
//     bottom: `0%`,
//     width: `28%`,
//     height: `auto`,
//     maxWidth: `350px`,
//     zIndex: 3,
//     [theme.breakpoints.down('lg')]: {
//         width: `20%`,
//         right: `0%`,
//         bottom: `0%`,
//     },
//     [theme.breakpoints.down('md')]: {
//         width: `18%`,
//         right: `0%`,
//         bottom: `0%`,
//     },
//     [theme.breakpoints.down('sm')]: {
//         width: `16%`,
//         right: `0%`,
//         bottom: `0%`,
//     },
// }));

// function MediaPage() {
//     const galleryRef = useRef(null);
//     const podcastRef = useRef(null);
//     const footerRef = useRef(null);
//     const [error, setError] = useState(null);

//     // Error boundary for component-level error handling
//     const handleError = (error, errorInfo) => {
//         console.error('MediaPage Error:', error, errorInfo);
//         setError('An error occurred while loading the media page. Please refresh and try again.');
//     };

//     useEffect(() => {
//         // Wrap animations in try-catch to prevent crashes
//         try {
//             // Gallery section animations
//             ScrollTrigger.create({
//                 trigger: galleryRef.current,
//                 start: "top 80%",
//                 onEnter: () => {
//                     gsap.fromTo(galleryRef.current?.querySelector('.gallery-text'),
//                         { y: 30, opacity: 0 },
//                         { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
//                     );
//                 },
//                 once: true
//             });

//             // Podcast section animations
//             ScrollTrigger.create({
//                 trigger: podcastRef.current,
//                 start: "top 80%",
//                 onEnter: () => {
//                     gsap.fromTo(podcastRef.current?.querySelector('.podcast-title'),
//                         { x: -50, opacity: 0 },
//                         { x: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
//                     );
//                     gsap.fromTo(podcastRef.current?.querySelector('.podcast-text'),
//                         { x: -30, opacity: 0 },
//                         { x: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out", clearProps: "all" }
//                     );
//                 },
//                 once: true
//             });

//             // Footer animations
//             ScrollTrigger.create({
//                 trigger: footerRef.current,
//                 start: "top 90%",
//                 onEnter: () => {
//                     gsap.fromTo(footerRef.current?.querySelector('.footer-content'),
//                         { y: 30, opacity: 0 },
//                         { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
//                     );
//                 },
//                 once: true
//             });

//             return () => {
//                 ScrollTrigger.getAll().forEach(t => t.kill());
//             };
//         } catch (animationError) {
//             console.error('Animation setup error:', animationError);
//             handleError(animationError, { component: 'MediaPage', section: 'animations' });
//         }
//     }, []);

//     // Show error state if there's an error
//     if (error) {
//         return (
//             <MediaContainer>
//                 <Header />
//                 <div style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     minHeight: '60vh',
//                     padding: '2rem',
//                     color: 'rgba(255, 232, 161, 1)',
//                     textAlign: 'center'
//                 }}>
//                     <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
//                     <h2>Oops! Something went wrong</h2>
//                     <p style={{ maxWidth: '500px', marginBottom: '2rem' }}>{error}</p>
//                     <button
//                         onClick={() => {
//                             setError(null);
//                             window.location.reload();
//                         }}
//                         style={{
//                             padding: '12px 24px',
//                             backgroundColor: 'rgba(255, 232, 161, 0.2)',
//                             color: 'rgba(255, 232, 161, 1)',
//                             border: '2px solid rgba(255, 232, 161, 0.8)',
//                             borderRadius: '8px',
//                             cursor: 'pointer',
//                             fontSize: '1rem',
//                             fontWeight: 'bold'
//                         }}
//                     >
//                         Refresh Page
//                     </button>
//                 </div>
//                 <Footer />
//             </MediaContainer>
//         );
//     }

//     return (
//         <MediaContainer>
//             {/* Header */}
//             <Header />

//             {/* Hero Section with Media background */}
//             <HeroSection>
//                 <HeroImage
//                     src={MediaWildlifeImage}
//                     alt="Media Wildlife"
//                     onError={(e) => {
//                         console.warn('Failed to load hero image');
//                         e.target.style.display = 'none';
//                     }}
//                 />
//                 <HeroText>A VOYAGE THROUGH SIGHTS WORTH SAILING FOR!</HeroText>
//             </HeroSection>

//             {/* Gallery Section with Carousel */}
//             <GallerySection ref={galleryRef}>
//                 <GalleryText className="gallery-text">
//                     You've set sail on a sea of thought, where ideas drift like clouds
//                     and knowledge rises with the tide. Let each image be a lighthouse,
//                     guiding you through the ever-unfolding map of discovery.
//                 </GalleryText>

//                 {/* Carousel Container */}
//                 <div style={{
//                     position: 'absolute',
//                     top: '280px',
//                     left: '50%',
//                     transform: 'translateX(-50%)',
//                     width: '100%',
//                     height: 'calc(100vh - 280px)',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'flex-start',
//                     paddingTop: '40px',
//                     overflow: 'visible',
//                     '@media (max-width: 768px)': {
//                         top: '200px',
//                         paddingTop: '20px',
//                     },
//                     '@media (max-width: 480px)': {
//                         top: '160px',
//                         paddingTop: '10px',
//                     },
//                 }}>
//                     {/* VinesDecoration at bottom of carousel section */}
//                     <VinesDecoration
//                         src={VinesImage}
//                         alt="Vines decoration"
//                         onError={(e) => {
//                             console.warn('Failed to load vines decoration');
//                             e.target.style.display = 'none';
//                         }}
//                     />

//                     {/* 3D CardCarousel component */}
//                     <CardCarousel
//                         className="card-carousel-instance"
//                         autoRotate={true}
//                         rotationInterval={5000}
//                     />
//                 </div>

//                 {/* Decorative elements */}
//                 <RectangleDecoration
//                     src={RectangleImage}
//                     alt="Rectangle decoration"
//                     onError={(e) => {
//                         console.warn('Failed to load rectangle decoration');
//                         e.target.style.display = 'none';
//                     }}
//                 />
//             </GallerySection>

//             {/* Podcast Section */}
//             <PodcastSection ref={podcastRef}>
//                 <PodcastsTitle
//                     src={PodcastsImage}
//                     alt="Podcasts"
//                     className="podcast-title"
//                     onError={(e) => {
//                         console.warn('Failed to load podcasts title image');
//                         e.target.style.display = 'none';
//                     }}
//                 />
//                 <PodcastText className="podcast-text">
//                     <span style={{ letterSpacing: '0.13px' }}>ECHOES FROM THE WILD</span><br />
//                     <PodcastSubtext>
//                         Tune into voices from the forest floor to the open skies.
//                     </PodcastSubtext>
//                 </PodcastText>

//                 {/* PodcastCarousel component with proper positioning */}
//                 <PodcastCarouselContainer>
//                     <PodcastCarousel className="podcast-carousel-instance" />
//                 </PodcastCarouselContainer>

//                 <PlantsDecoration
//                     src={PlantsImage}
//                     alt="Plants decoration"
//                 />
//             </PodcastSection>

//             {/* Footer */}
//             <Footer ref={footerRef} />

//         </MediaContainer>
//     );
// }

// export default MediaPage;




import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';

// Import images
import MediaPageImage from '../../assets/images/pages/MediaPage.png';
import MediaWildlifeImage from '../../assets/images/Media_Wildlife.png';
import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import FaunaBot from '../../components/common/FaunaBot.jsx';
import { CardCarousel } from './CardCarousel.jsx';
import { PodcastCarousel } from './PodcastCarousel.jsx';

// Import new Figma assets for Gallery and Podcast sections (you'll need to add these)
// Note: These imports will cause errors until assets are added. Comment out if assets don't exist yet.
import PodcastsImage from '../../assets/icons/PODCASTS.svg';
import VinesImage from '../../assets/images/media/download-vines-leaves-green-royalty-free-stock-illustration-image-4.png';
import PlantsImage from '../../assets/images/media/lost-found-albion-place-leeds-i-want-plants-1.png';
import RectangleImage from '../../assets/images/media/Rectangle.png';


// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const MediaContainer = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100%`,
    minHeight: `100vh`,
    justifyContent: `flex-start`,
    alignItems: `flex-start`,
    padding: `0px`,
    boxSizing: `border-box`,
    overflow: `visible`,
});

// Hero Section (keeping original)
const HeroSection = styled("div")({
    backgroundImage: `url(${MediaPageImage})`,
    backgroundPosition: `center`,
    backgroundSize: `cover`,
    backgroundRepeat: `no-repeat`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `120px 40px 80px`,
    boxSizing: `border-box`,
    width: `100%`,
    minHeight: `100vh`,
    overflow: `hidden`,
});

// Hero Image Component (original)
const HeroImage = styled("img")({
    maxWidth: `80%`,
    maxHeight: `80%`,
    width: `auto`,
    height: `auto`,
    objectFit: `contain`,
});

// Hero Text Component - "A VOYAGE THROUGH SIGHTS WORTH SAILING FOR!" (Responsive)
const HeroText = styled("div")(({ theme }) => ({
    position: `absolute`,
    bottom: `10%`,
    left: `50%`,
    transform: `translateX(-50%)`,
    width: `90%`,
    maxWidth: `924px`,
    fontFamily: `"DM Sans", Helvetica`,
    fontWeight: `700`,
    fontSize: `28px`,
    lineHeight: `48px`,
    letterSpacing: `0.56px`,
    textAlign: `center`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    color: `rgba(255, 232, 161, 0.9)`,
    zIndex: 2,
    padding: `0 20px`,
    [theme.breakpoints.down('lg')]: {
        fontSize: `24px`,
        lineHeight: `40px`,
        letterSpacing: `0.4px`,
    },
    [theme.breakpoints.down('md')]: {
        fontSize: `20px`,
        lineHeight: `32px`,
        letterSpacing: `0.3px`,
        bottom: `10%`,
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: `18px`,
        lineHeight: `28px`,
        letterSpacing: `0.2px`,
        bottom: `8%`,
    },
}));

// Unified section layout (following HomePage pattern)
const SectionLayout = styled('div')(({ height, bgColor }) => ({
    position: 'relative',
    width: '100%',
    height: height || '100vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: bgColor || 'rgba(30, 45, 39, 1)',
    overflow: 'visible',
    padding: '0 8%',
}));

// Large background text (following HomePage pattern)
const BackgroundText = styled("div")(({ align }) => ({
    textAlign: align || 'center',
    color: `rgba(205, 217, 157, 0.15)`,
    fontFamily: `"Helvetica Compressed", sans-serif`,
    fontWeight: `700`,
    fontSize: `170px`,
    lineHeight: `280px`,
    letterSpacing: `5px`,
    position: `absolute`,
    [align === 'right' ? 'right' : 'left']: align === 'right' ? '1%' : '50%',
    transform: align === 'right' ? 'none' : 'translateX(-50%)',
    top: `40px`,
    zIndex: 1,
    userSelect: `none`,
    pointerEvents: `none`,
}));

// Content container
const SectionContent = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `100%`,
    display: `flex`,
    alignItems: `flex-start`,
    justifyContent: `space-between`,
    zIndex: 2,
});

// Text block for sections (following HomePage pattern)
const SectionTextBlock = styled('div')(({ align, marginTop }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: align === 'right' ? '0' : '20px',
    marginRight: align === 'right' ? '20px' : '0',
    paddingTop: marginTop || '300px',
    zIndex: 10,
    maxWidth: '540px',
    textAlign: align === 'right' ? 'right' : 'left',
}));

// Main text content (following HomePage pattern)
const MainTextBlock = styled("div")(({ align }) => ({
    width: '381px',
    color: '#ffe8a1',
    fontFamily: '"DM Sans-Medium", Helvetica',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '20px',
    letterSpacing: '0.56px',
    textAlign: align === 'right' ? 'right' : 'left',
    marginBottom: '20px',
}));

// Explore link (following HomePage pattern)
const ExploreLink = styled(Link)({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `2px`,
    textTransform: `uppercase`,
    cursor: `pointer`,
    textDecoration: 'none',
    position: `relative`,
    paddingBottom: `5px`,
    marginTop: `16px`,
    display: 'inline-block',
    '&::after': {
        content: '""',
        position: `absolute`,
        bottom: `0`,
        left: `0`,
        width: `100%`,
        height: `2px`,
        backgroundColor: `rgba(255, 232, 161, 1)`,
    },
    '&:hover': {
        opacity: 0.8,
    },
});

// Gallery section with 3D carousel (Responsive)
const GallerySection = styled("div")({
    position: 'relative',
    width: '100%',
    minHeight: '130vh',
    backgroundColor: 'rgba(30, 45, 39, 1)',
    overflow: 'visible',
    '@media (max-width: 1200px)': {
        minHeight: '120vh',
    },
    '@media (max-width: 768px)': {
        minHeight: '100vh',
    },
    '@media (max-width: 480px)': {
        minHeight: '90vh',
    },
});

// Gallery content text - Figma specs (Fixed positioning)
const GalleryText = styled("div")({
    position: `absolute`,
    width: `562px`,
    height: `59px`,
    top: `163px`,
    left: `50%`,
    transform: `translateX(-50%)`,
    color: `#FFE8A1`,
    fontFamily: '"DM Sans-Medium", Helvetica',
    fontWeight: `500`,
    fontSize: `16px`,
    lineHeight: `20px`,
    letterSpacing: `0.56px`,
    textAlign: `center`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    zIndex: 10,
    '@media (max-width: 1200px)': {
        width: `90%`,
        maxWidth: `562px`,
        fontSize: `15px`,
        lineHeight: `19px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `14px`,
        lineHeight: `18px`,
        letterSpacing: `0.4px`,
        width: `85%`,
        top: `120px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `12px`,
        lineHeight: `16px`,
        letterSpacing: `0.3px`,
        width: `90%`,
        top: `100px`,
    },
});

// Carousel wrapper with responsive positioning
const CarouselWrapper = styled('div')({
    position: 'absolute',
    top: '280px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    height: 'calc(100vh - 280px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '40px',
    overflow: 'visible',
    '@media (max-width: 768px)': {
        top: '200px',
        paddingTop: '20px',
    },
    '@media (max-width: 480px)': {
        top: '160px',
        paddingTop: '10px',
    },
});

// Decorative elements (Responsive) - Positioned at bottom of screen
const VinesDecoration = styled("img")(({ theme }) => ({
    position: `absolute`,
    left: `-3%`,
    width: `40%`,
    bottom: `-50%`,
    height: `auto`,
    maxWidth: `555px`,
    zIndex: 15,
    [theme.breakpoints.down('lg')]: {
        width: `35%`,
        left: `-2%`,
        bottom: `-40%`,
    },
    [theme.breakpoints.down('md')]: {
        width: `30%`,
        left: `-1%`,
        bottom: `-45%`,
    },
    [theme.breakpoints.down('sm')]: {
        width: `25%`,
        left: `0%`,
        bottom: `-10%`,
    },
}));

const RectangleDecoration = styled("img")({
    position: `absolute`,
    right: `0`,
    top: `0`,
    width: `27%`,
    height: `auto`,
    maxWidth: `390px`,
    zIndex: 3,
    '@media (max-width: 1200px)': {
        width: `25%`,
    },
    '@media (max-width: 768px)': {
        width: `22%`,
    },
    '@media (max-width: 480px)': {
        width: `20%`,
    },
});

// Podcast section (Responsive) - Matching Figma layout
const PodcastSection = styled("div")({
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(30, 45, 39, 1)',
    overflow: 'hidden',
    padding: '0px',
    '@media (max-width: 1200px)': {
        padding: '0px',
        minHeight: '95vh',
    },
    '@media (max-width: 768px)': {
        padding: '0px',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '90vh', // Increased to match iPad layout
    },
    '@media (max-width: 480px)': {
        padding: '0px',
        minHeight: '85vh', // Increased to accommodate proper spacing like iPad
    },
});

const PodcastsTitle = styled("img")({
    position: 'absolute',
    height: `auto`,
    width: `366px`,
    left: `128px`,
    top: `0px`,
    '@media (max-width: 1200px)': {
        width: `320px`,
        left: `80px`,
    },
    '@media (max-width: 768px)': {
        width: `280px`,
        left: `50%`,
        transform: `translateX(-50%)`,
    },
    '@media (max-width: 480px)': {
        width: `250px`,
    },
});

const PodcastText = styled("div")({
    position: 'absolute',
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontSize: `24px`,
    fontWeight: `400`,
    letterSpacing: `0.5618497729301453px`,
    lineHeight: `20px`,
    maxWidth: `461px`,
    width: `461px`,
    height: `43px`,
    left: `128px`,
    top: `101px`,
    '@media (max-width: 1200px)': {
        fontSize: `22px`,
        width: `400px`,
        left: `80px`,
        top: `90px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `20px`,
        letterSpacing: `0.4px`,
        lineHeight: `18px`,
        width: `90%`,
        left: `50%`,
        transform: `translateX(-50%)`,
        textAlign: `center`,
        top: `80px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `18px`,
        letterSpacing: `0.3px`,
        lineHeight: `16px`,
        width: `90%`,
        top: `70px`,
    },
});

const PodcastSubtext = styled("span")({
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontSize: `16px`,
    fontWeight: `500`,
    letterSpacing: `0.09px`,
});

// Podcast Carousel Container - Centered to match Card Carousel
const PodcastCarouselContainer = styled("div")({
    position: 'absolute',
    width: `1185px`,
    height: `650px`,
    left: `50%`,
    transform: `translateX(-50%)`,
    top: `180px`,
    '@media (max-width: 1200px)': {
        width: `900px`,
        height: `520px`,
        top: `160px`,
    },
    '@media (max-width: 768px)': {
        width: `90%`,
        height: `450px`, // Increased to match iPad layout
        top: `140px`,
    },
    '@media (max-width: 480px)': {
        width: `95%`,
        height: `420px`, // Increased to accommodate proper spacing like iPad
        top: `120px`,
    },
});

const PlantsDecoration = styled("img")(({ theme }) => ({
    position: `absolute`,
    right: `0%`,
    bottom: `0%`,
    width: `28%`,
    height: `auto`,
    maxWidth: `350px`,
    zIndex: 3,
    [theme.breakpoints.down('lg')]: {
        width: `20%`,
        right: `0%`,
        bottom: `0%`,
    },
    [theme.breakpoints.down('md')]: {
        width: `18%`,
        right: `0%`,
        bottom: `0%`,
    },
    [theme.breakpoints.down('sm')]: {
        width: `16%`,
        right: `0%`,
        bottom: `0%`,
    },
}));

function MediaPage() {
    const galleryRef = useRef(null);
    const podcastRef = useRef(null);
    const footerRef = useRef(null);
    const [error, setError] = useState(null);

    // Error boundary for component-level error handling
    const handleError = (error, errorInfo) => {
        console.error('MediaPage Error:', error, errorInfo);
        setError('An error occurred while loading the media page. Please refresh and try again.');
    };

    useEffect(() => {
        // Wrap animations in try-catch to prevent crashes
        try {
            // Gallery section animations
            ScrollTrigger.create({
                trigger: galleryRef.current,
                start: "top 80%",
                onEnter: () => {
                    gsap.fromTo(galleryRef.current?.querySelector('.gallery-text'),
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
                    );
                },
                once: true
            });

            // Podcast section animations
            ScrollTrigger.create({
                trigger: podcastRef.current,
                start: "top 80%",
                onEnter: () => {
                    gsap.fromTo(podcastRef.current?.querySelector('.podcast-title'),
                        { x: -50, opacity: 0 },
                        { x: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
                    );
                    gsap.fromTo(podcastRef.current?.querySelector('.podcast-text'),
                        { x: -30, opacity: 0 },
                        { x: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out", clearProps: "all" }
                    );
                },
                once: true
            });

            // Footer animations
            ScrollTrigger.create({
                trigger: footerRef.current,
                start: "top 90%",
                onEnter: () => {
                    gsap.fromTo(footerRef.current?.querySelector('.footer-content'),
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
                    );
                },
                once: true
            });

            return () => {
                ScrollTrigger.getAll().forEach(t => t.kill());
            };
        } catch (animationError) {
            console.error('Animation setup error:', animationError);
            handleError(animationError, { component: 'MediaPage', section: 'animations' });
        }
    }, []);

    // Show error state if there's an error
    if (error) {
        return (
            <MediaContainer>
                <Header />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    padding: '2rem',
                    color: 'rgba(255, 232, 161, 1)',
                    textAlign: 'center'
                }}>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                    <h2>Oops! Something went wrong</h2>
                    <p style={{ maxWidth: '500px', marginBottom: '2rem' }}>{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            window.location.reload();
                        }}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'rgba(255, 232, 161, 0.2)',
                            color: 'rgba(255, 232, 161, 1)',
                            border: '2px solid rgba(255, 232, 161, 0.8)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
                <Footer />
            </MediaContainer>
        );
    }

    return (
        <MediaContainer>
            {/* Header */}
            <Header />

            {/* Hero Section with Media background */}
            <HeroSection>
                <HeroImage
                    src={MediaWildlifeImage}
                    alt="Media Wildlife"
                    onError={(e) => {
                        console.warn('Failed to load hero image');
                        e.target.style.display = 'none';
                    }}
                />
                <HeroText>A VOYAGE THROUGH SIGHTS WORTH SAILING FOR!</HeroText>
            </HeroSection>

            {/* Gallery Section with Carousel */}
            <GallerySection ref={galleryRef}>
                <GalleryText className="gallery-text">
                    You've set sail on a sea of thought, where ideas drift like clouds
                    and knowledge rises with the tide. Let each image be a lighthouse,
                    guiding you through the ever-unfolding map of discovery.
                </GalleryText>

                {/* Carousel Container */}
                <CarouselWrapper>
                    {/* VinesDecoration at bottom of carousel section */}
                    <VinesDecoration
                        src={VinesImage}
                        alt="Vines decoration"
                        onError={(e) => {
                            console.warn('Failed to load vines decoration');
                            e.target.style.display = 'none';
                        }}
                    />

                    {/* 3D CardCarousel component */}
                    <CardCarousel
                        className="card-carousel-instance"
                        autoRotate={true}
                        rotationInterval={5000}
                    />
                </CarouselWrapper>

                {/* Decorative elements */}
                <RectangleDecoration
                    src={RectangleImage}
                    alt="Rectangle decoration"
                    onError={(e) => {
                        console.warn('Failed to load rectangle decoration');
                        e.target.style.display = 'none';
                    }}
                />
            </GallerySection>

            {/* Podcast Section */}
            <PodcastSection ref={podcastRef}>
                <PodcastsTitle
                    src={PodcastsImage}
                    alt="Podcasts"
                    className="podcast-title"
                    onError={(e) => {
                        console.warn('Failed to load podcasts title image');
                        e.target.style.display = 'none';
                    }}
                />
                <PodcastText className="podcast-text">
                    <span style={{ letterSpacing: '0.13px' }}>ECHOES FROM THE WILD</span><br />
                    <PodcastSubtext>
                        Tune into voices from the forest floor to the open skies.
                    </PodcastSubtext>
                </PodcastText>

                {/* PodcastCarousel component with proper positioning */}
                <PodcastCarouselContainer>
                    <PodcastCarousel className="podcast-carousel-instance" />
                </PodcastCarouselContainer>

                <PlantsDecoration
                    src={PlantsImage}
                    alt="Plants decoration"
                />
            </PodcastSection>

            {/* Footer */}
            <Footer ref={footerRef} />

            {/* Floating FaunaBot - Available throughout the page */}
            <FaunaBot />


        </MediaContainer>
    );
}

export default MediaPage;