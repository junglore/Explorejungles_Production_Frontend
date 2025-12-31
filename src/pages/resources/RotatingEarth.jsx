// import React, { useState, useEffect, useRef } from 'react';
// import { styled } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';

// // Import main globe image
// import AGlobe1Image from '../../assets/images/RotatingEarth/RotatingEarth_a_globe_1.png';

// // Import ring image
// import RingImage from '../../assets/images/RotatingEarth/ring.png';

// // Import continent placeholder images
// import ContinentPlaceholderImage from '../../assets/images/RotatingEarth/continentplaceholder.png';
// import ContinentPlaceholder1Image from '../../assets/images/RotatingEarth/continentplaceholder1.png';
// import ContinentPlaceholder2Image from '../../assets/images/RotatingEarth/continentplaceholder2.png';
// import ContinentPlaceholder3Image from '../../assets/images/RotatingEarth/continentplaceholder3.png';
// import ContinentPlaceholder4Image from '../../assets/images/RotatingEarth/continentplaceholder4.png';
// import ContinentPlaceholder5Image from '../../assets/images/RotatingEarth/continentplaceholder5.png';
// import ContinentPlaceholder6Image from '../../assets/images/RotatingEarth/continentplaceholder6.png';

// // Import the 4 key info card images for Variant 1
// import Group27Image from '../../assets/images/RotatingEarth/RotatingEarth_Group_27.png';
// import Group28Image from '../../assets/images/RotatingEarth/RotatingEarth_Group_28.png';
// import Group29Image from '../../assets/images/RotatingEarth/RotatingEarth_Group_29.png';
// import Group34Image from '../../assets/images/RotatingEarth/RotatingEarth_Group_34.png';

// // Import the 4 key info card images for Variant 2
// import Variant2Group27Image from '../../assets/images/RotatingEarth/Variant2Group27.png';
// import Variant2Group28Image from '../../assets/images/RotatingEarth/Variant2Group28.png';
// import Variant2Group29Image from '../../assets/images/RotatingEarth/Variant2Group29.png';
// import Variant2Group35Image from '../../assets/images/RotatingEarth/Variant2Group35.png';

// // Add CSS keyframes for animations
// const globalStyles = `
// @keyframes typing-cursor-blink {
//     0%, 50% { opacity: 1; }
//     51%, 100% { opacity: 0; }
// }

// @keyframes connection-line-pulse {
//     0%, 100% { opacity: 0.6; }
//     50% { opacity: 0.9; }
// }
// `;

// // Inject global styles
// if (typeof document !== 'undefined') {
//     const styleSheet = document.createElement('style');
//     styleSheet.textContent = globalStyles;
//     document.head.appendChild(styleSheet);
// }

// // Helper function to get background color for each variant
// const getVariantBackgroundColor = (variant) => {
//     const colors = {
//         1: '#315346',
//         2: '#23372F',
//         3: '#1E2D27',
//         4: '#2B634E',
//         5: '#2B6362',
//         6: '#2B5863',
//         7: '#2B4063'
//     };
//     return colors[variant] || colors[1];
// };

// // Main container with responsive scaling and dynamic background
// const RotatingEarthContainer = styled("div")(({ variant }) => ({
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     height: '100%',
//     minHeight: '100vh',
//     backgroundColor: getVariantBackgroundColor(variant),
//     position: 'relative',
//     overflow: 'hidden',
//     padding: '20px',
//     boxSizing: 'border-box',
//     transition: 'background-color 0.8s ease-in-out',
//     // Enhanced responsive breakpoints
//     '@media (max-width: 1440px)': {
//         minHeight: '800px',
//         padding: '18px',
//     },
//     '@media (max-width: 1024px)': {
//         minHeight: '700px',
//         padding: '15px',
//     },
//     '@media (max-width: 768px)': {
//         minHeight: '600px',
//         padding: '12px',
//     },
//     '@media (max-width: 480px)': {
//         minHeight: '550px',
//         padding: '10px',
//     },
//     '@media (max-width: 320px)': {
//         minHeight: '500px',
//         padding: '8px',
//     },
// }));

// // Central content area
// const CentralArea = styled("div")({
//     position: 'relative',
//     width: '100%',
//     maxWidth: '1200px',
//     height: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     // Enhanced responsive sizing
//     '@media (max-width: 1440px)': {
//         maxWidth: '1000px',
//     },
//     '@media (max-width: 1024px)': {
//         maxWidth: '800px',
//     },
//     // Mobile layout: switch to vertical stack
//     '@media (max-width: 768px)': {
//         maxWidth: '600px',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//         height: 'auto',
//         minHeight: '100vh',
//         paddingTop: '20px',
//         paddingBottom: '120px', // Space for typing animation
//     },
//     '@media (max-width: 480px)': {
//         maxWidth: '400px',
//         paddingTop: '15px',
//         paddingBottom: '100px',
//     },
//     '@media (max-width: 320px)': {
//         maxWidth: '300px',
//         paddingTop: '10px',
//         paddingBottom: '80px',
//     },
// });

// // Main globe component with enhanced responsive sizing and rotation
// const MainGlobe = styled("div")(({ rotation }) => ({
//     width: '400px',
//     height: '400px',
//     backgroundImage: `url(${AGlobe1Image})`,
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     backgroundRepeat: 'no-repeat',
//     position: 'relative',
//     transform: `rotate(${rotation || 0}deg)`,
//     zIndex: 0.5,
//     transition: 'transform 0.8s ease-in-out',
//     // Enhanced responsive sizes for all device types
//     '@media (max-width: 1440px)': {
//         width: '380px',
//         height: '380px',
//     },
//     '@media (max-width: 1024px)': {
//         width: '320px',
//         height: '320px',
//     },
//     '@media (max-width: 768px)': {
//         width: '280px',
//         height: '280px',
//     },
//     '@media (max-width: 480px)': {
//         width: '240px',
//         height: '240px',
//     },
//     '@media (max-width: 375px)': {
//         width: '200px',
//         height: '200px',
//     },
//     '@media (max-width: 320px)': {
//         width: '180px',
//         height: '180px',
//     },
// }));

// // Continent placeholder with larger responsive sizing
// const ContinentPlaceholder = styled("img")({
//     position: 'absolute',
//     width: '460px', // Larger size for outer position
//     height: '460px',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     zIndex: 0.5, // Above ring
//     pointerEvents: 'none',
//     // Larger responsive sizes
//     '@media (max-width: 1440px)': {
//         width: '440px',
//         height: '440px',
//     },
//     '@media (max-width: 1024px)': {
//         width: '380px',
//         height: '380px',
//     },
//     '@media (max-width: 768px)': {
//         width: '340px',
//         height: '340px',
//     },
//     '@media (max-width: 480px)': {
//         width: '300px',
//         height: '300px',
//     },
//     '@media (max-width: 375px)': {
//         width: '257px',
//         height: '257px',
//     },
//     '@media (max-width: 320px)': {
//         width: '237px',
//         height: '237px',
//     },
// });

// // Ring component positioned between globe and placeholder
// const Ring = styled("img")({
//     position: 'absolute',
//     width: '380px',
//     height: '380px',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     zIndex: 0.5,
//     pointerEvents: 'none',
//     // Responsive sizing smaller than globe
//     '@media (max-width: 1440px)': {
//         width: '360px',
//         height: '360px',
//     },
//     '@media (max-width: 1024px)': {
//         width: '300px',
//         height: '300px',
//     },
//     '@media (max-width: 768px)': {
//         width: '260px',
//         height: '260px',
//     },
//     '@media (max-width: 480px)': {
//         width: '220px',
//         height: '220px',
//     },
//     '@media (max-width: 375px)': {
//         width: '185px',
//         height: '185px',
//     },
//     '@media (max-width: 320px)': {
//         width: '165px',
//         height: '165px',
//     },
// });

// // Info card base styling with enhanced responsive design
// const InfoCardBase = styled("div")(({ position }) => ({
//     position: 'absolute',
//     width: '280px',
//     height: 'auto',
//     borderRadius: '15px',
//     overflow: 'hidden',
//     zIndex: 1,
//     transition: 'all 0.3s ease',
//     cursor: 'pointer',
//     '&:hover': {
//         transform: 'scale(1.05)',
//         zIndex: 3,
//         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
//     },
//     // Enhanced responsive sizing
//     '@media (max-width: 1440px)': {
//         width: '250px',
//         borderRadius: '12px',
//     },
//     '@media (max-width: 1024px)': {
//         width: '220px',
//         borderRadius: '10px',
//     },
//     // Mobile layout: static positioning with order
//     '@media (max-width: 768px)': {
//         position: 'static',
//         width: '180px',
//         borderRadius: '8px',
//         margin: '10px 0',
//         transform: 'none !important', // Override any transform
//         flexShrink: 0,
//         '&:hover': {
//             transform: 'scale(1.05) !important',
//         },
//     },
//     '@media (max-width: 480px)': {
//         width: '150px',
//         borderRadius: '6px',
//         margin: '8px 0',
//     },
//     '@media (max-width: 375px)': {
//         width: '130px',
//         borderRadius: '5px',
//         margin: '6px 0',
//     },
//     '@media (max-width: 320px)': {
//         width: '110px',
//         borderRadius: '4px',
//         margin: '5px 0',
//     },
//     // Enhanced position-specific responsive styles (only for desktop)
//     ...(position === 'top-left' && {
//         top: '8%',
//         left: '5%',
//         transform: 'rotate(-5deg)',
//         '@media (max-width: 1024px)': {
//             top: '6%',
//             left: '3%',
//         },
//         // Mobile: first in order
//         '@media (max-width: 768px)': {
//             order: 1,
//         },
//     }),
//     ...(position === 'top-right' && {
//         top: '9%',
//         right: '8%',
//         transform: 'rotate(3deg)',
//         '@media (max-width: 1024px)': {
//             top: '7%',
//             right: '5%',
//         },
//         // Mobile: second in order
//         '@media (max-width: 768px)': {
//             order: 2,
//         },
//     }),
//     ...(position === 'bottom-left' && {
//         bottom: '6%',
//         left: '2%',
//         transform: 'rotate(2deg)',
//         '@media (max-width: 1024px)': {
//             bottom: '5%',
//             left: '1%',
//         },
//         // Mobile: fourth in order (after globe)
//         '@media (max-width: 768px)': {
//             order: 4,
//         },
//     }),
//     ...(position === 'bottom-right' && {
//         bottom: '10%',
//         right: '5%',
//         transform: 'rotate(-3deg)',
//         '@media (max-width: 1024px)': {
//             bottom: '8%',
//             right: '3%',
//         },
//         // Mobile: fifth in order (after globe)
//         '@media (max-width: 768px)': {
//             order: 5,
//         },
//     }),
// }));

// // Info card component with forwardRef
// const InfoCard = React.forwardRef(({ position, children, ...props }, ref) => {
//     return (
//         <InfoCardBase position={position} ref={ref} {...props}>
//             {children}
//         </InfoCardBase>
//     );
// });

// // Info card image
// const InfoCardImage = styled("img")({
//     width: '100%',
//     height: 'auto',
//     display: 'block',
//     borderRadius: '15px',
// });

// // Navigation arrows
// const NavigationArrows = styled("div")({
//     position: 'absolute',
//     top: '50%',
//     left: '0',
//     right: '0',
//     transform: 'translateY(-50%)',
//     pointerEvents: 'none',
//     zIndex: 1000,
//     padding: '0 20px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     '@media (max-width: 768px)': {
//         position: 'absolute',
//         bottom: '20px',
//         top: 'auto',
//         left: '50%',
//         right: 'auto',
//         transform: 'translateX(-50%)',
//         padding: '0',
//         gap: '20px',
//         justifyContent: 'center',
//         width: 'auto',
//     },
// });

// const ArrowButton = styled("button")({
//     backgroundColor: 'rgba(255, 232, 161, 0.9)',
//     border: '2px solid #ffe8a1',
//     borderRadius: '50%',
//     width: '50px',
//     height: '50px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '24px',
//     color: '#1e2d27',
//     cursor: 'pointer',
//     pointerEvents: 'auto',
//     transition: 'all 0.3s ease',
//     zIndex: 1001,
//     padding: '0',
//     '@media (max-width: 768px)': {
//         width: '40px',
//         height: '40px',
//         fontSize: '20px',
//     },
//     '@media (max-width: 480px)': {
//         width: '35px',
//         height: '35px',
//         fontSize: '18px',
//     },
//     '&:hover': {
//         backgroundColor: '#ffe8a1',
//         transform: 'scale(1.1)',
//         boxShadow: '0 4px 20px rgba(255, 232, 161, 0.3)',
//     },
//     '&:active': {
//         transform: 'scale(0.95)',
//     },
// });

// // SVG container for curved dotted lines - already responsive
// const ConnectionLinesContainer = styled("svg")({
//     position: 'absolute',
//     top: '0',
//     left: '0',
//     width: '100%',
//     height: '100%',
//     zIndex: 0,
//     pointerEvents: 'none',
//     // Hide on mobile devices since vertical layout doesn't need connection lines
//     '@media (max-width: 768px)': {
//         display: 'none',
//     },
// });

// // Styling for the curved dotted lines with enhanced responsive design
// const CurvedLine = styled("path")({
//     stroke: '#ffe8a1',
//     strokeWidth: '2',
//     strokeDasharray: '8,6',
//     fill: 'none',
//     opacity: 0.6,
//     transition: 'opacity 0.3s ease',
//     animation: 'connection-line-pulse 3s ease-in-out infinite',
//     '&:nth-child(1)': { animationDelay: '0s' },
//     '&:nth-child(2)': { animationDelay: '0.5s' },
//     '&:nth-child(3)': { animationDelay: '1s' },
//     '&:nth-child(4)': { animationDelay: '1.5s' },
//     // Enhanced responsive stroke and dash patterns
//     '@media (max-width: 1024px)': {
//         strokeWidth: '1.8',
//         strokeDasharray: '7,5',
//     },
//     '@media (max-width: 768px)': {
//         strokeWidth: '1.5',
//         strokeDasharray: '6,4',
//     },
//     '@media (max-width: 480px)': {
//         strokeWidth: '1.2',
//         strokeDasharray: '5,3',
//     },
//     '@media (max-width: 320px)': {
//         strokeWidth: '1',
//         strokeDasharray: '4,3',
//     },
// });

// // Globe container to keep globe, ring, and continent placeholder together
// const GlobeContainer = styled("div")({
//     position: 'relative',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     // Desktop: absolute positioning (invisible container)
//     '@media (min-width: 769px)': {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: '100%',
//         height: '100%',
//     },
//     // Mobile: static positioning with true center order
//     '@media (max-width: 768px)': {
//         position: 'relative',
//         top: '300px',
//         order: 3,
//         margin: '30px 0',
//         flexShrink: 0,
//     },
//     '@media (max-width: 480px)': {
//         margin: '25px 0',
//     },
//     '@media (max-width: 375px)': {
//         margin: '20px 0',
//     },
//     '@media (max-width: 320px)': {
//         margin: '15px 0',
//     },
// });

// // Typing animation text area positioned on the left side of the earth
// const TypingTextArea = styled("div")({
//     position: 'absolute',
//     left: '-3%',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     width: '25%',
//     maxWidth: '300px',
//     textAlign: 'left',
//     zIndex: 4,
//     padding: '20px',
//     // Enhanced responsive positioning and sizing
//     '@media (max-width: 1440px)': {
//         left: '-3%',
//         width: '28%',
//         maxWidth: '280px',
//         padding: '18px',
//     },
//     '@media (max-width: 1024px)': {
//         display: 'none',
//     },
//     // Hide typing animation on mobile/tablet devices
//     '@media (max-width: 768px)': {
//         display: 'none',
//     },
// });

// const TypingText = styled("p")({
//     fontSize: '16px',
//     color: '#ffe8a1',
//     fontFamily: 'DM Sans',
//     fontStyle: 'italic',
//     textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
//     margin: '0 0 15px 0',
//     minHeight: '25px',
//     lineHeight: '1.5',
//     // Enhanced responsive typography
//     '@media (max-width: 1440px)': {
//         fontSize: '15px',
//         lineHeight: '1.4',
//     },
//     '@media (max-width: 1024px)': {
//         fontSize: '14px',
//         lineHeight: '1.4',
//         margin: '0 0 12px 0',
//     },
//     '@media (max-width: 768px)': {
//         fontSize: '13px',
//         lineHeight: '1.3',
//         margin: '0 0 10px 0',
//         minHeight: '20px',
//     },
//     '@media (max-width: 480px)': {
//         fontSize: '12px',
//         lineHeight: '1.3',
//         margin: '0 0 8px 0',
//         minHeight: '18px',
//     },
//     '@media (max-width: 375px)': {
//         fontSize: '11px',
//         lineHeight: '1.2',
//         margin: '0 0 6px 0',
//         minHeight: '16px',
//     },
//     '@media (max-width: 320px)': {
//         fontSize: '10px',
//         lineHeight: '1.2',
//         margin: '0 0 5px 0',
//         minHeight: '14px',
//     },
// });

// const TypingCursor = styled("span")({
//     display: 'inline-block',
//     width: '2px',
//     height: '1em',
//     backgroundColor: '#ffe8a1',
//     marginLeft: '2px',
//     animation: 'typing-cursor-blink 1s infinite',
//     // Responsive cursor sizing
//     '@media (max-width: 480px)': {
//         width: '1.5px',
//     },
//     '@media (max-width: 320px)': {
//         width: '1px',
//     },
// });

// // Coming Soon component for variants 3-7
// const ComingSoonContainer = styled("div")({
//     position: 'absolute',
//     top: '15%',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     textAlign: 'center',
//     zIndex: 4,
//     '@media (max-width: 768px)': {
//         top: '12%',
//     },
//     '@media (max-width: 480px)': {
//         top: '10%',
//     },
// });

// const ComingSoonTitle = styled("h1")({
//     fontSize: '48px',
//     color: '#ffe8a1',
//     fontFamily: 'DM Sans',
//     fontWeight: 'bold',
//     textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)',
//     margin: '0',
//     letterSpacing: '2px',
//     '@media (max-width: 1024px)': {
//         fontSize: '40px',
//     },
//     '@media (max-width: 768px)': {
//         fontSize: '32px',
//         letterSpacing: '1px',
//     },
//     '@media (max-width: 480px)': {
//         fontSize: '24px',
//         letterSpacing: '0.5px',
//     },
//     '@media (max-width: 320px)': {
//         fontSize: '20px',
//     },
// });

// const ComingSoonSubtitle = styled("p")({
//     fontSize: '18px',
//     color: '#ffe8a1',
//     fontFamily: 'DM Sans',
//     fontStyle: 'italic',
//     textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
//     margin: '10px 0 0 0',
//     opacity: 0.8,
//     '@media (max-width: 1024px)': {
//         fontSize: '16px',
//     },
//     '@media (max-width: 768px)': {
//         fontSize: '14px',
//     },
//     '@media (max-width: 480px)': {
//         fontSize: '12px',
//     },
//     '@media (max-width: 320px)': {
//         fontSize: '10px',
//     },
// });

// // Helper function to get variant-specific data
// const getVariantData = (variant) => {
//     const placeholderImages = {
//         1: ContinentPlaceholderImage,
//         2: ContinentPlaceholder1Image,
//         3: ContinentPlaceholder2Image,
//         4: ContinentPlaceholder3Image,
//         5: ContinentPlaceholder4Image,
//         6: ContinentPlaceholder5Image,
//         7: ContinentPlaceholder6Image,
//     };

//     const rotations = {
//         1: 0,
//         2: 45,
//         3: 90,
//         4: 135,
//         5: 180,
//         6: 225,
//         7: 270,
//     };

//     switch (variant) {
//         case 1:
//             return {
//                 images: {
//                     placeholder: placeholderImages[1],
//                     topLeft: Group28Image,
//                     topRight: Group27Image,
//                     bottomLeft: Group29Image,
//                     bottomRight: Group34Image,
//                 },
//                 showTyping: true,
//                 showLines: true,
//                 showCards: true,
//                 comingSoon: false,
//                 globeRotation: rotations[1],
//             };
//         case 2:
//             return {
//                 images: {
//                     placeholder: placeholderImages[2],
//                     topLeft: Variant2Group28Image,
//                     topRight: Variant2Group27Image,
//                     bottomLeft: Variant2Group29Image,
//                     bottomRight: Variant2Group35Image,
//                 },
//                 showTyping: false,
//                 showLines: true,
//                 showCards: true,
//                 comingSoon: false,
//                 globeRotation: rotations[2],
//             };
//         case 3:
//         case 4:
//         case 5:
//         case 6:
//         case 7:
//             return {
//                 images: {
//                     placeholder: placeholderImages[variant],
//                 },
//                 showTyping: false,
//                 showLines: false,
//                 showCards: false,
//                 comingSoon: true,
//                 globeRotation: rotations[variant],
//             };
//         default:
//             return getVariantData(1);
//     }
// };

// // Main component
// function RotatingEarth() {
//     const [currentVariant, setCurrentVariant] = useState(1);
//     const navigate = useNavigate();

//     // Refs for dynamic positioning
//     const containerRef = useRef(null);
//     const globeRef = useRef(null);
//     const cardRefs = {
//         topLeft: useRef(null),
//         topRight: useRef(null),
//         bottomLeft: useRef(null),
//         bottomRight: useRef(null),
//     };

//     // State for dynamic line paths
//     const [linePaths, setLinePaths] = useState({});

//     // Function to calculate connection points and create S-shaped paths
//     const calculateLinePaths = () => {
//         const C = containerRef.current;
//         const G = globeRef.current;
//         if (!C || !G) return;

//         // Force a small delay to ensure all elements are properly rendered
//         setTimeout(() => {
//             const cRect = C.getBoundingClientRect();
//             const gRect = G.getBoundingClientRect();
//             const cw = cRect.width, ch = cRect.height;

//             // normalize to a 0–1000 coord system
//             const centerX = ((gRect.left + gRect.width / 2) - cRect.left) / cw * 1000;
//             const centerY = ((gRect.top + gRect.height / 2) - cRect.top) / ch * 1000;
//             const radius = (gRect.width / 2) / cw * 1000;

//             // Responsive wiggle factor based on screen size
//             const getResponsiveWiggle = () => {
//                 const screenWidth = window.innerWidth;
//                 if (screenWidth <= 320) return 200;      // Very small phones
//                 if (screenWidth <= 375) return 250;      // Small phones
//                 if (screenWidth <= 480) return 300;      // Medium phones
//                 if (screenWidth <= 768) return 350;      // Large phones/small tablets
//                 if (screenWidth <= 1024) return 400;     // Tablets
//                 if (screenWidth <= 1440) return 450;     // Small desktops
//                 return 480;                              // Large desktops
//             };

//             const newPaths = {};

//             Object.entries(cardRefs).forEach(([key, ref]) => {
//                 const cardEl = ref.current;
//                 if (!cardEl) return;

//                 // Get fresh card position
//                 const cardRect = cardEl.getBoundingClientRect();
//                 const cardCenterX = ((cardRect.left + cardRect.width / 2) - cRect.left) / cw * 1000;
//                 const cardCenterY = ((cardRect.top + cardRect.height / 2) - cRect.top) / ch * 1000;

//                 // Calculate appropriate starting point on globe edge based on card position
//                 const angle = Math.atan2(cardCenterY - centerY, cardCenterX - centerX);
//                 const startX = centerX + radius * Math.cos(angle) * 0.85;
//                 const startY = centerY + radius * Math.sin(angle) * 0.85;

//                 // build an S‑curve with responsive wiggle
//                 const dx = cardCenterX - startX;
//                 const dy = cardCenterY - startY;
//                 const wiggle = getResponsiveWiggle();

//                 // More controlled S-curve with better targeting
//                 const midX = startX + dx * 0.5;
//                 const midY = startY + dy * 0.5;

//                 // Control points for more precise S-curve
//                 const c1x = startX + dx * 0.25 + (Math.random() - 0.5) * wiggle * 0.3;
//                 const c1y = startY + dy * 0.25 + (Math.random() - 0.5) * wiggle * 0.3;
//                 const c2x = startX + dx * 0.75 + (Math.random() - 0.5) * wiggle * 0.3;
//                 const c2y = startY + dy * 0.75 + (Math.random() - 0.5) * wiggle * 0.3;

//                 // Ensure the line ends exactly at the card center
//                 newPaths[key] = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${cardCenterX} ${cardCenterY}`;
//             });

//             setLinePaths(newPaths);
//         }, 50); // Small delay to ensure DOM is ready
//     };

//     // Calculate paths on mount and window resize - only for variants with lines and desktop
//     useEffect(() => {
//         const variantData = getVariantData(currentVariant);
//         if (!variantData.showLines) return;

//         // Don't calculate lines on mobile devices
//         const isMobile = window.innerWidth <= 768;
//         if (isMobile) return;

//         const handleResize = () => {
//             const isMobileOnResize = window.innerWidth <= 768;
//             if (isMobileOnResize) return;
//             setTimeout(calculateLinePaths, 100); // Small delay to ensure DOM is updated
//         };

//         calculateLinePaths();
//         window.addEventListener('resize', handleResize);

//         return () => window.removeEventListener('resize', handleResize);
//     }, [currentVariant]);

//     // Typing animation state (only used in variant 1)
//     const fullText = [
//         "We begin our journey not by chance, but by choice - with INDIA",
//         "A land where tigers roam, rivers breathe, and climate conversations grow louder by the day. From ancient ecosystems to modern solutions, India holds a mirror to the world.",
//     ];

//     const [currentTextIndex, setCurrentTextIndex] = useState(0);
//     const [displayedText, setDisplayedText] = useState(['', '']);
//     const [currentCharIndex, setCurrentCharIndex] = useState(0);
//     const [isTyping, setIsTyping] = useState(true);

//     // Typing animation effect (only for variant 1)
//     useEffect(() => {
//         const variantData = getVariantData(currentVariant);
//         if (!variantData.showTyping || !isTyping) return;

//         const timer = setTimeout(() => {
//             if (currentTextIndex < fullText.length) {
//                 const currentText = fullText[currentTextIndex];

//                 if (currentCharIndex < currentText.length) {
//                     // Add next character
//                     setDisplayedText(prev => {
//                         const newDisplayedText = [...prev];
//                         newDisplayedText[currentTextIndex] = currentText.substring(0, currentCharIndex + 1);
//                         return newDisplayedText;
//                     });
//                     setCurrentCharIndex(prev => prev + 1);
//                 } else {
//                     // Move to next text or finish
//                     if (currentTextIndex < fullText.length - 1) {
//                         // Add a pause between paragraphs
//                         setTimeout(() => {
//                             setCurrentTextIndex(prev => prev + 1);
//                             setCurrentCharIndex(0);
//                         }, 1000); // 1 second pause between paragraphs
//                     } else {
//                         setIsTyping(false);
//                     }
//                 }
//             }
//         }, 50); // Typing speed - adjust this value to make it faster/slower

//         return () => clearTimeout(timer);
//     }, [currentTextIndex, currentCharIndex, isTyping, fullText, currentVariant]);

//     const nextVariant = () => {
//         setCurrentVariant((prev) => (prev % 7) + 1); // Cycle between 1 and 7
//         // Recalculate paths after variant change
//         setTimeout(() => {
//             calculateLinePaths();
//         }, 100);
//     };

//     const prevVariant = () => {
//         setCurrentVariant((prev) => (prev === 1 ? 7 : prev - 1));
//         // Recalculate paths after variant change
//         setTimeout(() => {
//             calculateLinePaths();
//         }, 100);
//     };

//     // Get current variant data
//     const variantData = getVariantData(currentVariant);

//     return (
//         <RotatingEarthContainer variant={currentVariant} ref={containerRef}>
//             <CentralArea>
//                 {/* Dynamic curved dotted lines connecting globe to info cards - MOVED TO TOP - only for variants with lines */}
//                 {variantData.showLines && (
//                     <ConnectionLinesContainer
//                         viewBox="0 0 1000 1000"
//                         preserveAspectRatio="xMidYMid meet"
//                     >
//                         {Object.keys(cardRefs).map(key => (
//                             <CurvedLine
//                                 key={key}
//                                 d={linePaths[key] || ''}
//                                 vectorEffect="non-scaling-stroke"
//                             />
//                         ))}
//                     </ConnectionLinesContainer>
//                 )}

//                 {/* Info Cards positioned around the globe - only for variants with cards */}
//                 {variantData.showCards && (
//                     <>
//                         <InfoCard position="top-left" data-card="top-left" ref={cardRefs.topLeft} onClick={() => navigate('/resources/dailyupdates')}>
//                             <InfoCardImage
//                                 src={variantData.images.topLeft}
//                                 alt="Top Left Card"
//                             />
//                         </InfoCard>

//                         <InfoCard position="top-right" data-card="top-right" ref={cardRefs.topRight} onClick={() => navigate('/resources/casestudies')}>
//                             <InfoCardImage
//                                 src={variantData.images.topRight}
//                                 alt="Top Right Card"
//                             />
//                         </InfoCard>
//                     </>
//                 )}

//                 {/* Globe Container - wraps globe, ring, and continent placeholder */}
//                 <GlobeContainer>
//                     {/* Main Globe - with ref for dynamic positioning and rotation */}
//                     <MainGlobe ref={globeRef} rotation={variantData.globeRotation} />

//                     {/* Ring component positioned between globe and placeholder */}
//                     <Ring
//                         src={RingImage}
//                         alt="Ring"
//                     />

//                     {/* Continent Placeholder - dynamic based on variant */}
//                     <ContinentPlaceholder
//                         src={variantData.images.placeholder}
//                         alt="Continent Labels"
//                     />
//                 </GlobeContainer>

//                 {/* Info Cards positioned around the globe - only for variants with cards */}
//                 {variantData.showCards && (
//                     <>
//                         <InfoCard position="bottom-left" data-card="bottom-left" ref={cardRefs.bottomLeft} onClick={() => navigate('/resources/blogs')}>
//                             <InfoCardImage
//                                 src={variantData.images.bottomLeft}
//                                 alt="Bottom Left Card"
//                             />
//                         </InfoCard>

//                         <InfoCard position="bottom-right" data-card="bottom-right" ref={cardRefs.bottomRight} onClick={() => navigate('/resources/conservationefforts')}>
//                             <InfoCardImage
//                                 src={variantData.images.bottomRight}
//                                 alt="Bottom Right Card"
//                             />
//                         </InfoCard>
//                     </>
//                 )}

//                 {/* Typing Animation Text - only show for variant 1 */}
//                 {variantData.showTyping && (
//                     <TypingTextArea>
//                         <TypingText>
//                             {displayedText[0]}
//                             {currentTextIndex === 0 && isTyping && <TypingCursor>|</TypingCursor>}
//                         </TypingText>
//                         {displayedText[1] && (
//                             <TypingText>
//                                 {displayedText[1]}
//                                 {currentTextIndex === 1 && isTyping && <TypingCursor>|</TypingCursor>}
//                             </TypingText>
//                         )}
//                     </TypingTextArea>
//                 )}
//             </CentralArea>

//             {/* Coming Soon message for variants 3-7 */}
//             {variantData.comingSoon && (
//                 <ComingSoonContainer>
//                     <ComingSoonTitle>COMING SOON!</ComingSoonTitle>
//                     <ComingSoonSubtitle>This continent's journey is being crafted...</ComingSoonSubtitle>
//                 </ComingSoonContainer>
//             )}

//             {/* Navigation Arrows */}
//             <NavigationArrows>
//                 {currentVariant > 1 ? (
//                     <ArrowButton onClick={prevVariant}>
//                         <span>&#8249;</span>
//                     </ArrowButton>
//                 ) : (
//                     <div></div> // Empty div to maintain space-between layout
//                 )}
//                 {currentVariant < 7 && (
//                     <ArrowButton onClick={nextVariant}>
//                         <span>&#8250;</span>
//                     </ArrowButton>
//                 )}
//             </NavigationArrows>
//         </RotatingEarthContainer>
//     );
// }

// export default RotatingEarth;




import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Import main globe image
import AGlobe1Image from '../../assets/images/RotatingEarth/RotatingEarth_a_globe_1.png';

// Import continent placeholder images
import ContinentPlaceholderImage from '../../assets/images/RotatingEarth/continentplaceholder.png';
import ContinentPlaceholder1Image from '../../assets/images/RotatingEarth/continentplaceholder1.png';
import ContinentPlaceholder2Image from '../../assets/images/RotatingEarth/continentplaceholder2.png';
import ContinentPlaceholder3Image from '../../assets/images/RotatingEarth/continentplaceholder3.png';
import ContinentPlaceholder4Image from '../../assets/images/RotatingEarth/continentplaceholder4.png';
import ContinentPlaceholder5Image from '../../assets/images/RotatingEarth/continentplaceholder5.png';
import ContinentPlaceholder6Image from '../../assets/images/RotatingEarth/continentplaceholder6.png';

// Import the 4 key info card images for Variant 1
import Group27Image from '../../assets/images/RotatingEarth/RotatingEarth_Group_27.png';
import Group28Image from '../../assets/images/RotatingEarth/RotatingEarth_Group_28.png';
import Group29Image from '../../assets/images/RotatingEarth/RotatingEarth_Group_29.png';
import Group34Image from '../../assets/images/RotatingEarth/RotatingEarth_Group_34.png';

// Import the 4 key info card images for Variant 2
import Variant2Group27Image from '../../assets/images/RotatingEarth/Variant2Group27.png';
import Variant2Group28Image from '../../assets/images/RotatingEarth/Variant2Group28.png';
import Variant2Group29Image from '../../assets/images/RotatingEarth/Variant2Group29.png';
import Variant2Group35Image from '../../assets/images/RotatingEarth/Variant2Group35.png';

// Add CSS keyframes for animations
const globalStyles = `
@keyframes typing-cursor-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

@keyframes connection-line-pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.9; }
}
`;

// Inject global styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = globalStyles;
    document.head.appendChild(styleSheet);
}

// Helper function to get background color for each variant
const getVariantBackgroundColor = (variant) => {
    const colors = {
        1: '#315346',
        2: '#23372F',
        3: '#1E2D27',
        4: '#2B634E',
        5: '#2B6362',
        6: '#2B5863',
        7: '#2B4063'
    };
    return colors[variant] || colors[1];
};

// Main container with responsive scaling
const RotatingEarthContainer = styled("div")({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
    boxSizing: 'border-box',
    // Enhanced responsive breakpoints
    '@media (max-width: 1440px)': {
        minHeight: '800px',
        padding: '18px',
    },
    '@media (max-width: 1024px)': {
        minHeight: '700px',
        padding: '15px',
    },
    '@media (max-width: 768px)': {
        minHeight: '600px',
        padding: '12px',
    },
    '@media (max-width: 480px)': {
        minHeight: '550px',
        padding: '10px',
    },
    '@media (max-width: 320px)': {
        minHeight: '500px',
        padding: '8px',
    },
});

// Central content area
const CentralArea = styled("div")({
    position: 'relative',
    width: '100%',
    maxWidth: '1200px',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Enhanced responsive sizing
    '@media (max-width: 1440px)': {
        maxWidth: '1000px',
    },
    '@media (max-width: 1024px)': {
        maxWidth: '800px',
    },
    // Mobile layout: switch to vertical stack
    '@media (max-width: 768px)': {
        maxWidth: '600px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 'auto',
        minHeight: '100vh',
        paddingTop: '20px',
        paddingBottom: '120px', // Space for typing animation
    },
    '@media (max-width: 480px)': {
        maxWidth: '400px',
        paddingTop: '15px',
        paddingBottom: '100px',
    },
    '@media (max-width: 320px)': {
        maxWidth: '300px',
        paddingTop: '10px',
        paddingBottom: '80px',
    },
});

// Main globe component with enhanced responsive sizing and rotation
const MainGlobe = styled("div")(({ rotation }) => ({
    width: '400px',
    height: '400px',
    backgroundImage: `url(${AGlobe1Image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    transform: `rotate(${rotation || 0}deg)`,
    zIndex: 0.5,
    transition: 'transform 0.8s ease-in-out',
    // Enhanced responsive sizes for all device types
    '@media (max-width: 1440px)': {
        width: '380px',
        height: '380px',
    },
    '@media (max-width: 1024px)': {
        width: '320px',
        height: '320px',
    },
    '@media (max-width: 768px)': {
        width: '280px',
        height: '280px',
    },
    '@media (max-width: 480px)': {
        width: '240px',
        height: '240px',
    },
    '@media (max-width: 375px)': {
        width: '200px',
        height: '200px',
    },
    '@media (max-width: 320px)': {
        width: '180px',
        height: '180px',
    },
}));

// Continent placeholder with larger responsive sizing
const ContinentPlaceholder = styled("img")({
    position: 'absolute',
    width: '460px', // Larger size for outer position
    height: '460px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 0.5, // Above ring
    pointerEvents: 'none',
    // Larger responsive sizes
    '@media (max-width: 1440px)': {
        width: '440px',
        height: '440px',
    },
    '@media (max-width: 1024px)': {
        width: '380px',
        height: '380px',
    },
    '@media (max-width: 768px)': {
        width: '340px',
        height: '340px',
    },
    '@media (max-width: 480px)': {
        width: '300px',
        height: '300px',
    },
    '@media (max-width: 375px)': {
        width: '257px',
        height: '257px',
    },
    '@media (max-width: 320px)': {
        width: '237px',
        height: '237px',
    },
});

// Interactive Ring Component Container
const InteractiveRingContainer = styled("div")({
    position: 'absolute',
    width: '600px', // Further increased to prevent any cutoff
    height: '600px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 0.5,
    pointerEvents: 'auto',
    // Responsive sizing to match original ring position
    '@media (max-width: 1440px)': {
        width: '580px',
        height: '580px',
    },
    '@media (max-width: 1024px)': {
        width: '480px',
        height: '480px',
    },
    '@media (max-width: 768px)': {
        width: '420px',
        height: '420px',
    },
    '@media (max-width: 480px)': {
        width: '360px',
        height: '360px',
    },
    '@media (max-width: 375px)': {
        width: '320px',
        height: '320px',
    },
    '@media (max-width: 320px)': {
        width: '300px',
        height: '300px',
    },
});

// Interactive Ring SVG Component
const InteractiveRingSVG = styled("svg")({
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
});

// Continent data with mathematically precise equal spacing (52.5° intervals) - rotated to position Africa at top
const continentData = [
    { 
        id: 1, 
        name: 'ASIA', 
        variant: 1, 
        angle: 225,  // Left-top position (300° - 75°)
    },
    { 
        id: 2, 
        name: 'AFRICA', 
        variant: 2, 
        angle: 270,  // Top position (345° - 75°)
    },
    { 
        id: 3, 
        name: 'SOUTH AMERICA', 
        variant: 3, 
        angle: 323,  // Top-right position (38° + 285° = 323°, equivalent to 38° - 75°)
    },
    { 
        id: 4, 
        name: 'EUROPE', 
        variant: 4, 
        angle: 16,   // Right position (91° - 75°)
    },
    { 
        id: 5, 
        name: 'NORTH AMERICA', 
        variant: 5, 
        angle: 68,   // Bottom-right position (143° - 75°)
    },
    { 
        id: 6, 
        name: 'AUSTRALIA', 
        variant: 6, 
        angle: 121,  // Bottom position (196° - 75°)
    },
    { 
        id: 7, 
        name: 'ANTARCTICA', 
        variant: 7, 
        angle: 173,  // Bottom-left position (248° - 75°)
    }
];

// Visual clockwise order for navigation (starting from Asia at 10 o'clock)
const visualOrder = [1, 2, 3, 4, 5, 6, 7]; // ASIA(10:00) → AFRICA(11:30) → SOUTH AMERICA(1:30) → EUROPE(3:00) → NORTH AMERICA(4:45) → AUSTRALIA(6:30) → ANTARCTICA(8:15)

// Clickable continent area component
const ContinentClickableArea = styled("g")(({ isActive }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    
    '& circle': {
        fill: isActive ? 'rgba(255, 232, 161, 0.3)' : 'transparent',
        stroke: isActive ? '#ffe8a1' : 'transparent',
        strokeWidth: '2px',
        transition: 'all 0.3s ease',
    },
    
    '& text': {
        fill: isActive ? '#ffe8a1' : 'rgba(185, 147, 104, 0.9)',
        fontSize: '11px',
        fontFamily: 'DM Sans',
        fontWeight: '600',
        textAnchor: 'middle',
        dominantBaseline: 'central',
        letterSpacing: '0.5px',
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
    },
    
    '&:hover': {
        '& circle': {
            fill: 'rgba(255, 232, 161, 0.4)',
            stroke: '#ffe8a1',
            strokeWidth: '2px',
        },
        '& text': {
            fill: '#ffe8a1',
            fontSize: '12px',
        },
    },
    
    // Responsive text sizing
    '@media (max-width: 1024px)': {
        '& text': {
            fontSize: '10px',
        },
        '&:hover': {
            '& text': {
                fontSize: '11px',
            },
        },
    },
    '@media (max-width: 768px)': {
        '& text': {
            fontSize: '9px',
        },
        '&:hover': {
            '& text': {
                fontSize: '10px',
            },
        },
    },
    '@media (max-width: 480px)': {
        '& text': {
            fontSize: '8px',
        },
        '&:hover': {
            '& text': {
                fontSize: '9px',
            },
        },
    },
    '@media (max-width: 320px)': {
        '& text': {
            fontSize: '7px',
        },
        '&:hover': {
            '& text': {
                fontSize: '8px',
            },
        },
    },
}));

// Interactive Ring Component
const InteractiveRing = ({ currentVariant, onContinentClick }) => {
    return (
        <InteractiveRingContainer>
            <InteractiveRingSVG viewBox="0 0 600 600">
                {/* Outer ring circle - positioned to match original ring position */}
                <circle
                    cx="300"
                    cy="300"
                    r="235"
                    fill="none"
                    stroke="rgba(255, 232, 161, 0.6)"
                    strokeWidth="1.5"
                    strokeDasharray="6,4"
                />
                
                {/* Inner ring circle - properly spaced */}
                <circle
                    cx="300"
                    cy="300"
                    r="205"
                    fill="none"
                    stroke="rgba(255, 232, 161, 0.4)"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                />
                
                {/* Radial lines connecting to continents */}
                {continentData.map((continent) => {
                    const angle = (continent.angle * Math.PI) / 180;
                    const innerRadius = 205;
                    const outerRadius = 235;
                    const startX = 300 + Math.cos(angle) * innerRadius;
                    const startY = 300 + Math.sin(angle) * innerRadius;
                    const endX = 300 + Math.cos(angle) * outerRadius;
                    const endY = 300 + Math.sin(angle) * outerRadius;
                    
                    return (
                        <line
                            key={`line-${continent.id}`}
                            x1={startX}
                            y1={startY}
                            x2={endX}
                            y2={endY}
                            stroke="rgba(255, 232, 161, 0.5)"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                        />
                    );
                })}
                
                {/* Continent dots and labels */}
                {continentData.map((continent) => {
                    const angle = (continent.angle * Math.PI) / 180;
                    const dotRadius = 220; // Middle of the ring
                    const isActive = currentVariant === continent.variant;
                    // Different label distance based on selection state
                    const labelRadius = isActive ? 255 : 250; // Selected ones slightly further out
                    const dotX = 300 + Math.cos(angle) * dotRadius;
                    const dotY = 300 + Math.sin(angle) * dotRadius;
                    const labelX = 300 + Math.cos(angle) * labelRadius;
                    const labelY = 300 + Math.sin(angle) * labelRadius;
                    
                    // Calculate text rotation to keep it readable
                    let textAngle = continent.angle + 90;
                    if (textAngle > 90 && textAngle < 270) {
                        textAngle += 180; // Flip text to keep it readable
                    }
                    
                    // Dynamic sizing based on text length
                    const fontSize = isActive ? 13 : 11;
                    const charWidth = fontSize * 0.6; // Approximate character width
                    const textWidth = continent.name.length * charWidth;
                    const padding = 12; // Padding on left and right
                    const rectWidth = textWidth + (padding * 2);
                    const rectHeight = 24; // Increased height for better spacing
                    
                    // Calculate rectangle position (centered on text)
                    const rectX = labelX - (rectWidth / 2);
                    const rectY = labelY - (rectHeight / 2);
                    
                    // Clickable area (slightly larger than visible rectangle)
                    const clickWidth = rectWidth + 8;
                    const clickHeight = rectHeight + 4;
                    const clickX = labelX - (clickWidth / 2);
                    const clickY = labelY - (clickHeight / 2);
                    
                    return (
                        <ContinentClickableArea
                            key={continent.id}
                            isActive={currentVariant === continent.variant}
                            onClick={() => onContinentClick(continent.variant)}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Dynamic rectangular clickable area */}
                            <rect
                                x={clickX}
                                y={clickY}
                                width={clickWidth}
                                height={clickHeight}
                                fill="transparent"
                                transform={`rotate(${textAngle}, ${labelX}, ${labelY})`}
                            />
                            
                            {/* Background highlight for selected continent - dynamically sized */}
                            {isActive && (
                                <rect
                                    x={rectX}
                                    y={rectY}
                                    width={rectWidth}
                                    height={rectHeight}
                                    fill="rgba(255, 232, 161, 0.15)"
                                    stroke="rgba(255, 232, 161, 0.3)"
                                    strokeWidth="1"
                                    rx="12"
                                    ry="12"
                                    transform={`rotate(${textAngle}, ${labelX}, ${labelY})`}
                                    style={{
                                        filter: 'drop-shadow(0 0 6px rgba(255, 232, 161, 0.4))'
                                    }}
                                />
                            )}
                            
                            {/* Visible dot on the ring - larger when active */}
                            <circle
                                cx={dotX}
                                cy={dotY}
                                r={isActive ? "5" : "3"}
                                fill={isActive ? "#ffe8a1" : "rgba(255, 232, 161, 0.8)"}
                                stroke={isActive ? "#ffe8a1" : "rgba(255, 232, 161, 0.6)"}
                                strokeWidth="1"
                                style={{
                                    filter: isActive ? 
                                        'drop-shadow(0 0 8px #ffe8a1) drop-shadow(0 0 12px #ffe8a1)' : 'none'
                                }}
                            />
                            
                            {/* Continent label with glow effect when active */}
                            <text
                                x={labelX}
                                y={labelY}
                                transform={`rotate(${textAngle}, ${labelX}, ${labelY})`}
                                style={{
                                    fontSize: `${fontSize}px`,
                                    fontWeight: isActive ? '700' : '600',
                                    fill: isActive ? '#ffe8a1' : 'rgba(255, 232, 161, 0.9)',
                                    filter: isActive ? 
                                        'drop-shadow(0 0 4px #ffe8a1) drop-shadow(0 0 8px #ffe8a1)' : 'none',
                                    textAnchor: 'middle',
                                    dominantBaseline: 'middle'
                                }}
                            >
                                {continent.name}
                            </text>
                        </ContinentClickableArea>
                    );
                })}
            </InteractiveRingSVG>
        </InteractiveRingContainer>
    );
};

// Info card base styling with enhanced responsive design
const InfoCardBase = styled("div")(({ position }) => ({
    position: 'absolute',
    width: '280px',
    height: 'auto',
    borderRadius: '15px',
    overflow: 'hidden',
    zIndex: 1,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.05)',
        zIndex: 3,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    },
    // Enhanced responsive sizing
    '@media (max-width: 1440px)': {
        width: '250px',
        borderRadius: '12px',
    },
    '@media (max-width: 1024px)': {
        width: '220px',
        borderRadius: '10px',
    },
    // Mobile layout: static positioning with order
    '@media (max-width: 768px)': {
        position: 'static',
        width: '180px',
        borderRadius: '8px',
        margin: '10px 0',
        transform: 'none !important', // Override any transform
        flexShrink: 0,
        '&:hover': {
            transform: 'scale(1.05) !important',
        },
    },
    '@media (max-width: 480px)': {
        width: '150px',
        borderRadius: '6px',
        margin: '8px 0',
    },
    '@media (max-width: 375px)': {
        width: '130px',
        borderRadius: '5px',
        margin: '6px 0',
    },
    '@media (max-width: 320px)': {
        width: '110px',
        borderRadius: '4px',
        margin: '5px 0',
    },
    // Enhanced position-specific responsive styles (only for desktop)
    ...(position === 'top-left' && {
        top: '8%',
        left: '5%',
        transform: 'rotate(-5deg)',
        '@media (max-width: 1024px)': {
            top: '6%',
            left: '3%',
        },
        // Mobile: first in order
        '@media (max-width: 768px)': {
            order: 1,
        },
    }),
    ...(position === 'top-right' && {
        top: '9%',
        right: '8%',
        transform: 'rotate(3deg)',
        '@media (max-width: 1024px)': {
            top: '7%',
            right: '5%',
        },
        // Mobile: second in order
        '@media (max-width: 768px)': {
            order: 2,
        },
    }),
    ...(position === 'bottom-left' && {
        bottom: '6%',
        left: '2%',
        transform: 'rotate(2deg)',
        '@media (max-width: 1024px)': {
            bottom: '5%',
            left: '1%',
        },
        // Mobile: fourth in order (after globe)
        '@media (max-width: 768px)': {
            order: 4,
        },
    }),
    ...(position === 'bottom-right' && {
        bottom: '10%',
        right: '5%',
        transform: 'rotate(-3deg)',
        '@media (max-width: 1024px)': {
            bottom: '8%',
            right: '3%',
        },
        // Mobile: fifth in order (after globe)
        '@media (max-width: 768px)': {
            order: 5,
        },
    }),
}));

// Info card component with forwardRef
const InfoCard = React.forwardRef(({ position, children, ...props }, ref) => {
    return (
        <InfoCardBase position={position} ref={ref} {...props}>
            {children}
        </InfoCardBase>
    );
});

// Info card image
const InfoCardImage = styled("img")({
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: '15px',
});

// Navigation arrows
const NavigationArrows = styled("div")({
    position: 'absolute',
    top: '50%',
    left: '0',
    right: '0',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    zIndex: 1000,
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '@media (max-width: 768px)': {
        position: 'absolute',
        bottom: '20px',
        top: 'auto',
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
        padding: '0',
        gap: '20px',
        justifyContent: 'center',
        width: 'auto',
    },
});

const ArrowButton = styled("button")({
    backgroundColor: 'rgba(255, 232, 161, 0.9)',
    border: '2px solid #ffe8a1',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#1e2d27',
    cursor: 'pointer',
    pointerEvents: 'auto',
    transition: 'all 0.3s ease',
    zIndex: 1001,
    padding: '0',
    '@media (max-width: 768px)': {
        width: '40px',
        height: '40px',
        fontSize: '20px',
    },
    '@media (max-width: 480px)': {
        width: '35px',
        height: '35px',
        fontSize: '18px',
    },
    '&:hover': {
        backgroundColor: '#ffe8a1',
        transform: 'scale(1.1)',
        boxShadow: '0 4px 20px rgba(255, 232, 161, 0.3)',
    },
    '&:active': {
        transform: 'scale(0.95)',
    },
});

// SVG container for curved dotted lines - already responsive
const ConnectionLinesContainer = styled("svg")({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    // Hide on mobile devices since vertical layout doesn't need connection lines
    '@media (max-width: 768px)': {
        display: 'none',
    },
});

// Styling for the curved dotted lines with enhanced responsive design
const CurvedLine = styled("path")({
    stroke: '#ffe8a1',
    strokeWidth: '2',
    strokeDasharray: '8,6',
    fill: 'none',
    opacity: 0.6,
    transition: 'opacity 0.3s ease',
    animation: 'connection-line-pulse 3s ease-in-out infinite',
    '&:nth-child(1)': { animationDelay: '0s' },
    '&:nth-child(2)': { animationDelay: '0.5s' },
    '&:nth-child(3)': { animationDelay: '1s' },
    '&:nth-child(4)': { animationDelay: '1.5s' },
    // Enhanced responsive stroke and dash patterns
    '@media (max-width: 1024px)': {
        strokeWidth: '1.8',
        strokeDasharray: '7,5',
    },
    '@media (max-width: 768px)': {
        strokeWidth: '1.5',
        strokeDasharray: '6,4',
    },
    '@media (max-width: 480px)': {
        strokeWidth: '1.2',
        strokeDasharray: '5,3',
    },
    '@media (max-width: 320px)': {
        strokeWidth: '1',
        strokeDasharray: '4,3',
    },
});

// Globe container to keep globe, ring, and continent placeholder together
const GlobeContainer = styled("div")({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Desktop: absolute positioning (invisible container)
    '@media (min-width: 769px)': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
    },
    // Mobile: static positioning with true center order
    '@media (max-width: 768px)': {
        position: 'relative',
        top: '300px',
        order: 3,
        margin: '30px 0',
        flexShrink: 0,
    },
    '@media (max-width: 480px)': {
        margin: '25px 0',
    },
    '@media (max-width: 375px)': {
        margin: '20px 0',
    },
    '@media (max-width: 320px)': {
        margin: '15px 0',
    },
});

// Typing animation text area positioned on the left side of the earth
const TypingTextArea = styled("div")({
    position: 'absolute',
    left: '-3%',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '25%',
    maxWidth: '300px',
    textAlign: 'left',
    zIndex: 4,
    padding: '20px',
    // Enhanced responsive positioning and sizing
    '@media (max-width: 1440px)': {
        left: '-3%',
        width: '28%',
        maxWidth: '280px',
        padding: '18px',
    },
    '@media (max-width: 1024px)': {
        display: 'none',
    },
    // Hide typing animation on mobile/tablet devices
    '@media (max-width: 768px)': {
        display: 'none',
    },
});

const TypingText = styled("p")({
    fontSize: '16px',
    color: '#ffe8a1',
    fontFamily: 'DM Sans',
    fontStyle: 'italic',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    margin: '0 0 15px 0',
    minHeight: '25px',
    lineHeight: '1.5',
    // Enhanced responsive typography
    '@media (max-width: 1440px)': {
        fontSize: '15px',
        lineHeight: '1.4',
    },
    '@media (max-width: 1024px)': {
        fontSize: '14px',
        lineHeight: '1.4',
        margin: '0 0 12px 0',
    },
    '@media (max-width: 768px)': {
        fontSize: '13px',
        lineHeight: '1.3',
        margin: '0 0 10px 0',
        minHeight: '20px',
    },
    '@media (max-width: 480px)': {
        fontSize: '12px',
        lineHeight: '1.3',
        margin: '0 0 8px 0',
        minHeight: '18px',
    },
    '@media (max-width: 375px)': {
        fontSize: '11px',
        lineHeight: '1.2',
        margin: '0 0 6px 0',
        minHeight: '16px',
    },
    '@media (max-width: 320px)': {
        fontSize: '10px',
        lineHeight: '1.2',
        margin: '0 0 5px 0',
        minHeight: '14px',
    },
});

const TypingCursor = styled("span")({
    display: 'inline-block',
    width: '2px',
    height: '1em',
    backgroundColor: '#ffe8a1',
    marginLeft: '2px',
    animation: 'typing-cursor-blink 1s infinite',
    // Responsive cursor sizing
    '@media (max-width: 480px)': {
        width: '1.5px',
    },
    '@media (max-width: 320px)': {
        width: '1px',
    },
});

// Coming Soon component for variants 3-7
const ComingSoonContainer = styled("div")({
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    zIndex: 4,
    '@media (max-width: 768px)': {
        top: '12%',
    },
    '@media (max-width: 480px)': {
        top: '10%',
    },
});

const ComingSoonTitle = styled("h1")({
    fontSize: '48px',
    color: '#ffe8a1',
    fontFamily: 'DM Sans',
    fontWeight: 'bold',
    textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)',
    margin: '0',
    letterSpacing: '2px',
    '@media (max-width: 1024px)': {
        fontSize: '40px',
    },
    '@media (max-width: 768px)': {
        fontSize: '32px',
        letterSpacing: '1px',
    },
    '@media (max-width: 480px)': {
        fontSize: '24px',
        letterSpacing: '0.5px',
    },
    '@media (max-width: 320px)': {
        fontSize: '20px',
    },
});

const ComingSoonSubtitle = styled("p")({
    fontSize: '18px',
    color: '#ffe8a1',
    fontFamily: 'DM Sans',
    fontStyle: 'italic',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    margin: '10px 0 0 0',
    opacity: 0.8,
    '@media (max-width: 1024px)': {
        fontSize: '16px',
    },
    '@media (max-width: 768px)': {
        fontSize: '14px',
    },
    '@media (max-width: 480px)': {
        fontSize: '12px',
    },
    '@media (max-width: 320px)': {
        fontSize: '10px',
    },
});

// Helper function to get variant-specific data
const getVariantData = (variant) => {
    const placeholderImages = {
        1: ContinentPlaceholderImage,
        2: ContinentPlaceholder1Image,
        3: ContinentPlaceholder2Image,
        4: ContinentPlaceholder3Image,
        5: ContinentPlaceholder4Image,
        6: ContinentPlaceholder5Image,
        7: ContinentPlaceholder6Image,
    };

    const rotations = {
        1: 0,
        2: 45,
        3: 90,
        4: 135,
        5: 180,
        6: 225,
        7: 270,
    };

    switch (variant) {
        case 1:
            return {
                images: {
                    placeholder: placeholderImages[1],
                    topLeft: Group28Image,
                    topRight: Group27Image,
                    bottomLeft: Group29Image,
                    bottomRight: Group34Image,
                },
                showTyping: true,
                showLines: true,
                showCards: true,
                comingSoon: false,
                globeRotation: rotations[1],
            };
        case 2:
            return {
                images: {
                    placeholder: placeholderImages[2],
                    topLeft: Variant2Group28Image,
                    topRight: Variant2Group27Image,
                    bottomLeft: Variant2Group29Image,
                    bottomRight: Variant2Group35Image,
                },
                showTyping: false,
                showLines: true,
                showCards: true,
                comingSoon: false,
                globeRotation: rotations[2],
            };
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            return {
                images: {
                    placeholder: placeholderImages[variant],
                },
                showTyping: false,
                showLines: false,
                showCards: false,
                comingSoon: true,
                globeRotation: rotations[variant],
            };
        default:
            return getVariantData(1);
    }
};

// Main component
function RotatingEarth({ currentVariant = 1, setCurrentVariant = () => {} }) {
    const navigate = useNavigate();

    // Refs for dynamic positioning
    const containerRef = useRef(null);
    const globeRef = useRef(null);
    const cardRefs = {
        topLeft: useRef(null),
        topRight: useRef(null),
        bottomLeft: useRef(null),
        bottomRight: useRef(null),
    };

    // State for dynamic line paths
    const [linePaths, setLinePaths] = useState({});

    // Function to calculate connection points and create S-shaped paths
    const calculateLinePaths = () => {
        const C = containerRef.current;
        const G = globeRef.current;
        if (!C || !G) return;

        // Force a small delay to ensure all elements are properly rendered
        setTimeout(() => {
            const cRect = C.getBoundingClientRect();
            const gRect = G.getBoundingClientRect();
            const cw = cRect.width, ch = cRect.height;

            // normalize to a 0–1000 coord system
            const centerX = ((gRect.left + gRect.width / 2) - cRect.left) / cw * 1000;
            const centerY = ((gRect.top + gRect.height / 2) - cRect.top) / ch * 1000;
            const radius = (gRect.width / 2) / cw * 1000;

            // Responsive wiggle factor based on screen size
            const getResponsiveWiggle = () => {
                const screenWidth = window.innerWidth;
                if (screenWidth <= 320) return 200;      // Very small phones
                if (screenWidth <= 375) return 250;      // Small phones
                if (screenWidth <= 480) return 300;      // Medium phones
                if (screenWidth <= 768) return 350;      // Large phones/small tablets
                if (screenWidth <= 1024) return 400;     // Tablets
                if (screenWidth <= 1440) return 450;     // Small desktops
                return 480;                              // Large desktops
            };

            const newPaths = {};

            Object.entries(cardRefs).forEach(([key, ref]) => {
                const cardEl = ref.current;
                if (!cardEl) return;

                // Get fresh card position
                const cardRect = cardEl.getBoundingClientRect();
                const cardCenterX = ((cardRect.left + cardRect.width / 2) - cRect.left) / cw * 1000;
                const cardCenterY = ((cardRect.top + cardRect.height / 2) - cRect.top) / ch * 1000;

                // Calculate appropriate starting point on globe edge based on card position
                const angle = Math.atan2(cardCenterY - centerY, cardCenterX - centerX);
                const startX = centerX + radius * Math.cos(angle) * 0.85;
                const startY = centerY + radius * Math.sin(angle) * 0.85;

                // build an S‑curve with responsive wiggle
                const dx = cardCenterX - startX;
                const dy = cardCenterY - startY;
                const wiggle = getResponsiveWiggle();

                // More controlled S-curve with better targeting
                const midX = startX + dx * 0.5;
                const midY = startY + dy * 0.5;

                // Control points for more precise S-curve
                const c1x = startX + dx * 0.25 + (Math.random() - 0.5) * wiggle * 0.3;
                const c1y = startY + dy * 0.25 + (Math.random() - 0.5) * wiggle * 0.3;
                const c2x = startX + dx * 0.75 + (Math.random() - 0.5) * wiggle * 0.3;
                const c2y = startY + dy * 0.75 + (Math.random() - 0.5) * wiggle * 0.3;

                // Ensure the line ends exactly at the card center
                newPaths[key] = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${cardCenterX} ${cardCenterY}`;
            });

            setLinePaths(newPaths);
        }, 50); // Small delay to ensure DOM is ready
    };

    // Calculate paths on mount and window resize - only for variants with lines and desktop
    useEffect(() => {
        const variantData = getVariantData(currentVariant);
        if (!variantData.showLines) return;

        // Don't calculate lines on mobile devices
        const isMobile = window.innerWidth <= 768;
        if (isMobile) return;

        const handleResize = () => {
            const isMobileOnResize = window.innerWidth <= 768;
            if (isMobileOnResize) return;
            setTimeout(calculateLinePaths, 100); // Small delay to ensure DOM is updated
        };

        calculateLinePaths();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [currentVariant]);

    // Typing animation state (only used in variant 1)
    const fullText = [
        "We begin our journey not by chance, but by choice - with INDIA",
        "A land where tigers roam, rivers breathe, and climate conversations grow louder by the day. From ancient ecosystems to modern solutions, India holds a mirror to the world.",
    ];

    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState(['', '']);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    // Typing animation effect (only for variant 1)
    useEffect(() => {
        const variantData = getVariantData(currentVariant);
        if (!variantData.showTyping || !isTyping) return;

        const timer = setTimeout(() => {
            if (currentTextIndex < fullText.length) {
                const currentText = fullText[currentTextIndex];

                if (currentCharIndex < currentText.length) {
                    // Add next character
                    setDisplayedText(prev => {
                        const newDisplayedText = [...prev];
                        newDisplayedText[currentTextIndex] = currentText.substring(0, currentCharIndex + 1);
                        return newDisplayedText;
                    });
                    setCurrentCharIndex(prev => prev + 1);
                } else {
                    // Move to next text or finish
                    if (currentTextIndex < fullText.length - 1) {
                        // Add a pause between paragraphs
                        setTimeout(() => {
                            setCurrentTextIndex(prev => prev + 1);
                            setCurrentCharIndex(0);
                        }, 1000); // 1 second pause between paragraphs
                    } else {
                        setIsTyping(false);
                    }
                }
            }
        }, 50); // Typing speed - adjust this value to make it faster/slower

        return () => clearTimeout(timer);
    }, [currentTextIndex, currentCharIndex, isTyping, fullText, currentVariant]);

    const nextVariant = () => {
        const currentIndex = visualOrder.indexOf(currentVariant);
        const nextIndex = (currentIndex + 1) % visualOrder.length;
        setCurrentVariant(visualOrder[nextIndex]);
        // Recalculate paths after variant change
        setTimeout(() => {
            calculateLinePaths();
        }, 100);
    };

    const prevVariant = () => {
        const currentIndex = visualOrder.indexOf(currentVariant);
        const prevIndex = currentIndex === 0 ? visualOrder.length - 1 : currentIndex - 1;
        setCurrentVariant(visualOrder[prevIndex]);
        // Recalculate paths after variant change
        setTimeout(() => {
            calculateLinePaths();
        }, 100);
    };

    // Navigate to specific continent variant
    const navigateToContinent = (variant) => {
        if (variant !== currentVariant) {
            setCurrentVariant(variant);
            // Recalculate paths after variant change
            setTimeout(() => {
                calculateLinePaths();
            }, 100);
        }
    };

    // Get current variant data
    const variantData = getVariantData(currentVariant);

    return (
        <RotatingEarthContainer ref={containerRef}>
            <CentralArea>
                {/* Dynamic curved dotted lines connecting globe to info cards - MOVED TO TOP - only for variants with lines */}
                {variantData.showLines && (
                    <ConnectionLinesContainer
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {Object.keys(cardRefs).map(key => (
                            <CurvedLine
                                key={key}
                                d={linePaths[key] || ''}
                                vectorEffect="non-scaling-stroke"
                            />
                        ))}
                    </ConnectionLinesContainer>
                )}

                {/* Info Cards positioned around the globe - only for variants with cards */}
                {variantData.showCards && (
                    <>
                        <InfoCard position="top-left" data-card="top-left" ref={cardRefs.topLeft} onClick={() => navigate('/resources/dailyupdates')}>
                            <InfoCardImage
                                src={variantData.images.topLeft}
                                alt="Top Left Card"
                            />
                        </InfoCard>

                        <InfoCard position="top-right" data-card="top-right" ref={cardRefs.topRight} onClick={() => navigate('/resources/casestudies')}>
                            <InfoCardImage
                                src={variantData.images.topRight}
                                alt="Top Right Card"
                            />
                        </InfoCard>
                    </>
                )}

                {/* Globe Container - wraps globe, ring, and continent placeholder */}
                <GlobeContainer>
                    {/* Main Globe - with ref for dynamic positioning and rotation */}
                    <MainGlobe ref={globeRef} rotation={variantData.globeRotation} />

                    {/* Interactive Ring component with clickable continents */}
                    <InteractiveRing 
                        currentVariant={currentVariant}
                        onContinentClick={navigateToContinent}
                    />

                    {/* Continent Placeholder - dynamic based on variant - TEMPORARILY HIDDEN */}
                    {/*
                    <ContinentPlaceholder
                        src={variantData.images.placeholder}
                        alt="Continent Labels"
                    />
                    */}
                </GlobeContainer>

                {/* Info Cards positioned around the globe - only for variants with cards */}
                {variantData.showCards && (
                    <>
                        <InfoCard position="bottom-left" data-card="bottom-left" ref={cardRefs.bottomLeft} onClick={() => navigate('/resources/blogs')}>
                            <InfoCardImage
                                src={variantData.images.bottomLeft}
                                alt="Bottom Left Card"
                            />
                        </InfoCard>

                        <InfoCard position="bottom-right" data-card="bottom-right" ref={cardRefs.bottomRight} onClick={() => navigate('/resources/conservationefforts')}>
                            <InfoCardImage
                                src={variantData.images.bottomRight}
                                alt="Bottom Right Card"
                            />
                        </InfoCard>
                    </>
                )}

                {/* Typing Animation Text - only show for variant 1 */}
                {variantData.showTyping && (
                    <TypingTextArea>
                        <TypingText>
                            {displayedText[0]}
                            {currentTextIndex === 0 && isTyping && <TypingCursor>|</TypingCursor>}
                        </TypingText>
                        {displayedText[1] && (
                            <TypingText>
                                {displayedText[1]}
                                {currentTextIndex === 1 && isTyping && <TypingCursor>|</TypingCursor>}
                            </TypingText>
                        )}
                    </TypingTextArea>
                )}
            </CentralArea>

            {/* Coming Soon message for variants 3-7 */}
            {variantData.comingSoon && (
                <ComingSoonContainer>
                    <ComingSoonTitle>COMING SOON!</ComingSoonTitle>
                    <ComingSoonSubtitle>This continent's journey is being crafted...</ComingSoonSubtitle>
                </ComingSoonContainer>
            )}

            {/* Navigation Arrows */}
            <NavigationArrows>
                <ArrowButton onClick={prevVariant}>
                    <span>&#8249;</span>
                </ArrowButton>
                <ArrowButton onClick={nextVariant}>
                    <span>&#8250;</span>
                </ArrowButton>
            </NavigationArrows>
        </RotatingEarthContainer>
    );
}

export default RotatingEarth;