// import React, { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { styled } from '@mui/material/styles';

// // Import components
// import Header from '../../components/common/Header.jsx';
// import Footer from '../../components/common/Footer.jsx';
// import MythsVsFacts from './MythsVsFacts.jsx';
// import RotatingEarth from './RotatingEarth.jsx';

// // Import images
// import ResourcesPageImage from '../../assets/images/pages/ResourcesPage.png';
// import ResourcesBackgroundGif from '../../assets/gif/resourcesgif.gif';
// import ResourcesSvg from '../../assets/icons/Resources.svg';

// // Register GSAP plugins
// gsap.registerPlugin(ScrollTrigger);

// const ResourcesContainer = styled("div")({
//     backgroundColor: `rgba(49, 83, 70, 1)`,
//     display: `flex`,
//     position: `relative`,
//     flexDirection: `column`,
//     width: `100%`,
//     minHeight: `100vh`,
//     justifyContent: `flex-start`,
//     alignItems: `flex-start`,
//     padding: `0px`,
//     margin: `0px`,
//     boxSizing: `border-box`,
//     overflow: `hidden`,
//     gap: `0px`,
//     // GIF overlay to appear above all content
//     '&::before': {
//         content: '""',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundImage: `url(${ResourcesBackgroundGif})`,
//         backgroundPosition: `center center`,
//         backgroundSize: `cover`,
//         backgroundRepeat: `no-repeat`,
//         opacity: 0.3, // Make GIF semi-transparent so content is still visible
//         zIndex: 1000, // High z-index to appear above all content
//         pointerEvents: 'none',
//     },
//     '@media (max-width: 768px)': {
//         overflow: `visible`,
//     },
// });

// // Hero Section
// const HeroSection = styled("div")({
//     backgroundImage: `url(${ResourcesPageImage})`,
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
//     '&::before': {
//         content: '""',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(49, 83, 70, 0.3)',
//         zIndex: 1,
//     },
//     '@media (max-width: 1200px)': {
//         padding: `100px 30px 60px`,
//     },
//     '@media (max-width: 768px)': {
//         height: `100vh`,
//         backgroundPosition: `center center`,
//         padding: `80px 20px 40px`,
//     },
//     '@media (max-width: 480px)': {
//         height: `100vh`,
//         backgroundPosition: `30% center`,
//         padding: `60px 15px 30px`,
//     },
// });

// // Hero Image Component
// const HeroImage = styled("img")({
//     maxWidth: `80%`,
//     height: `auto`,
//     objectFit: `contain`,
//     zIndex: 2,
//     position: `relative`,
//     display: 'block',
//     margin: '0 auto',
// });

// // Hero Text Component - "READY TO EXPLORE RESOURCES AROUND THE WORLD!" (Responsive)
// const HeroText = styled("div")({
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
//     '@media (max-width: 1200px)': {
//         fontSize: `24px`,
//         lineHeight: `40px`,
//         letterSpacing: `0.4px`,
//     },
//     '@media (max-width: 768px)': {
//         fontSize: `20px`,
//         lineHeight: `32px`,
//         letterSpacing: `0.3px`,
//         bottom: `10%`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `18px`,
//         lineHeight: `28px`,
//         letterSpacing: `0.2px`,
//         bottom: `8%`,
//     },
// });

// // Page 1 - Rotating Earth (Interactive Globe Experience)
// const Page1Section = styled("div")({
//     display: `flex`,
//     position: `relative`,
//     alignItems: `center`,
//     padding: `0px`,
//     overflow: `visible`,
//     width: `100%`,
//     height: `130vh`,
//     backgroundColor: `rgba(49, 83, 70, 1)`,
//     '@media (max-width: 1200px)': {
//         minHeight: `100vh`,
//         height: `auto`,
//     },
//     '@media (max-width: 768px)': {
//         padding: `20px 10px`,
//         minHeight: `100vh`,
//         height: `auto`,
//     },
//     '@media (max-width: 480px)': {
//         padding: `15px 5px`,
//         minHeight: `100vh`,
//     },
// });



// // Page 2 - Myths vs Facts (Interactive Game Experience)
// const Page2Section = styled("div")({
//     display: `flex`,
//     position: `relative`,
//     alignItems: `center`,
//     width: `100%`,
//     height: `100vh`,
//     backgroundColor: `rgba(49, 83, 70, 1)`,
//     '@media (max-width: 1200px)': {
//         minHeight: `100vh`,
//         height: `auto`,
//     },
//     '@media (max-width: 768px)': {
//         padding: `20px 10px`,
//         minHeight: `100vh`,
//         height: `auto`,
//     },
//     '@media (max-width: 480px)': {
//         padding: `15px 5px`,
//         minHeight: `100vh`,
//     },
// });

// function ResourcesPage() {
//     const heroRef = useRef(null);
//     const page1Ref = useRef(null);
//     const page2Ref = useRef(null);

//     useEffect(() => {
//         // Hero title animation
//         const hero = heroRef.current;
//         if (hero) {
//             gsap.fromTo(hero.querySelector('.hero-title'),
//                 { y: 100, opacity: 0 },
//                 { y: 0, opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.5 }
//             );
//         }

//         // Cleanup function
//         return () => {
//             ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//         };
//     }, []);


//     return (
//         <ResourcesContainer>
//             {/* Header */}
//             <Header />

//             {/* Hero Section */}
//             <HeroSection ref={heroRef}>
//                 <HeroImage src={ResourcesSvg} alt="Resources" />
//                 <HeroText>READY TO EXPLORE RESOURCES AROUND THE WORLD!</HeroText>
//             </HeroSection>

//             {/* Page 1 - Rotating Earth */}
//             <Page1Section ref={page1Ref}>
//                 <RotatingEarth property1="default" />
//             </Page1Section>

//             {/* Page 2 - Myths vs Facts */}
//             <Page2Section ref={page2Ref}>
//                 <MythsVsFacts />
//             </Page2Section>

//             {/* Footer */}
//             <Footer />
//         </ResourcesContainer>
//     );
// }

// export default ResourcesPage; 



import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { styled } from '@mui/material/styles';

// Import components
import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import FaunaBot from '../../components/common/FaunaBot.jsx';
import MythsVsFacts from './MythsVsFacts.jsx';
import RotatingEarth from './RotatingEarth.jsx';

// Import images
import ResourcesPageImage from '../../assets/images/pages/ResourcesPage.png';
import ResourcesBackgroundGif from '../../assets/gif/resourcesgif.gif';
import ResourcesSvg from '../../assets/icons/Resources.svg';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Helper function to get background color for each variant (moved from RotatingEarth)
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

const ResourcesContainer = styled("div")(({ variant }) => ({
    backgroundColor: getVariantBackgroundColor(variant),
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100%`,
    minHeight: `100vh`,
    justifyContent: `flex-start`,
    alignItems: `flex-start`,
    padding: `0px`,
    margin: `0px`,
    boxSizing: `border-box`,
    overflow: `hidden`,
    gap: `0px`,
    transition: 'background-color 0.8s ease-in-out', // Smooth transition for background color changes
    // GIF overlay to appear above all content
    '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${ResourcesBackgroundGif})`,
        backgroundPosition: `center center`,
        backgroundSize: `cover`,
        backgroundRepeat: `no-repeat`,
        opacity: 0.3, // Make GIF semi-transparent so content is still visible
        zIndex: 1000, // High z-index to appear above all content
        pointerEvents: 'none',
    },
    '@media (max-width: 768px)': {
        overflow: `visible`,
    },
}));

// Hero Section
const HeroSection = styled("div")({
    backgroundImage: `url(${ResourcesPageImage})`,
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
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(49, 83, 70, 0.3)',
        zIndex: 1,
    },
    '@media (max-width: 1200px)': {
        padding: `100px 30px 60px`,
    },
    '@media (max-width: 768px)': {
        height: `100vh`,
        backgroundPosition: `center center`,
        padding: `80px 20px 40px`,
    },
    '@media (max-width: 480px)': {
        height: `100vh`,
        backgroundPosition: `30% center`,
        padding: `60px 15px 30px`,
    },
});

// Hero Image Component
const HeroImage = styled("img")({
    maxWidth: `80%`,
    height: `auto`,
    objectFit: `contain`,
    zIndex: 2,
    position: `relative`,
    display: 'block',
    margin: '0 auto',
});

// Hero Text Component - "READY TO EXPLORE RESOURCES AROUND THE WORLD!" (Responsive)
const HeroText = styled("div")({
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
    '@media (max-width: 1200px)': {
        fontSize: `24px`,
        lineHeight: `40px`,
        letterSpacing: `0.4px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `20px`,
        lineHeight: `32px`,
        letterSpacing: `0.3px`,
        bottom: `10%`,
    },
    '@media (max-width: 480px)': {
        fontSize: `18px`,
        lineHeight: `28px`,
        letterSpacing: `0.2px`,
        bottom: `8%`,
    },
});

// Page 1 - Rotating Earth (Interactive Globe Experience)
const Page1Section = styled("div")(({ variant }) => ({
    display: `flex`,
    position: `relative`,
    alignItems: `center`,
    padding: `0px`,
    overflow: `visible`,
    width: `100%`,
    height: `130vh`,
    backgroundColor: getVariantBackgroundColor(variant),
    transition: 'background-color 0.8s ease-in-out',
    '@media (max-width: 1200px)': {
        minHeight: `100vh`,
        height: `auto`,
    },
    '@media (max-width: 768px)': {
        padding: `20px 10px`,
        minHeight: `100vh`,
        height: `auto`,
    },
    '@media (max-width: 480px)': {
        padding: `15px 5px`,
        minHeight: `100vh`,
    },
}));



// Page 2 - Myths vs Facts (Interactive Game Experience)
const Page2Section = styled("div")(({ variant }) => ({
    display: `flex`,
    position: `relative`,
    alignItems: `center`,
    width: `100%`,
    minHeight: `100vh`,
    height: `auto`,
    paddingTop: `120px`, // Space from rotating earth section
    paddingBottom: `80px`, // Space before footer
    backgroundColor: getVariantBackgroundColor(variant),
    transition: 'background-color 0.8s ease-in-out',
    '@media (max-width: 1200px)': {
        paddingTop: `100px`,
        paddingBottom: `60px`,
    },
    '@media (max-width: 768px)': {
        padding: `80px 10px 60px 10px`,
        minHeight: `100vh`,
        height: `auto`,
    },
    '@media (max-width: 480px)': {
        padding: `60px 5px 40px 5px`,
        minHeight: `100vh`,
    },
}));

function ResourcesPage() {
    const heroRef = useRef(null);
    const page1Ref = useRef(null);
    const page2Ref = useRef(null);
    
    // State for current continent variant - this will control the entire page background
    const [currentVariant, setCurrentVariant] = useState(1);

    useEffect(() => {
        // Hero title animation
        const hero = heroRef.current;
        if (hero) {
            gsap.fromTo(hero.querySelector('.hero-title'),
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.5 }
            );
        }

        // Cleanup function
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);


    return (
        <ResourcesContainer variant={currentVariant}>
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <HeroSection ref={heroRef}>
                <HeroImage src={ResourcesSvg} alt="Resources" />
                <HeroText>READY TO EXPLORE RESOURCES AROUND THE WORLD!</HeroText>
            </HeroSection>

            {/* Page 1 - Rotating Earth */}
            <Page1Section ref={page1Ref} variant={currentVariant}>
                <RotatingEarth 
                    property1="default" 
                    currentVariant={currentVariant}
                    setCurrentVariant={setCurrentVariant}
                />
            </Page1Section>

            {/* Page 2 - Myths vs Facts */}
            <Page2Section ref={page2Ref} variant={currentVariant}>
                <MythsVsFacts />
            </Page2Section>

            {/* Footer */}
            <Footer />

            {/* FaunaBot - Floating chat assistant */}
            <FaunaBot />
        </ResourcesContainer>
    );
}

export default ResourcesPage; 