// import React, { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { styled } from '@mui/material/styles';
// import { Link } from 'react-router-dom';

// // Import images
// import AboutUsPageImage from '../../assets/images/pages/AboutUsPage.png';

// // Import reused assets from other pages
// import RectangleImage from '../../assets/images/media/Rectangle.png';
// import PlantsImage from '../../assets/images/media/lost-found-albion-place-leeds-i-want-plants-1.png';
// import Desktop3TreeBranch2Image from '../../assets/images/Desktop3_tree_branch_2.png';
// import Tree1Image from '../../assets/images/Fullpage_tree_1.png';

// // New imports for birds
// import Bird2Image from '../../assets/images/bird2.png';

// // New imports for core values images
// import CoreValues1Image from '../../assets/images/corevalues1.png';
// import CoreValues2Image from '../../assets/images/corevalues2.png';
// import CoreValues3Image from '../../assets/images/corevalues3.png';
// import CoreValues4Image from '../../assets/images/corevalues4.png';

// // Import SVG titles
// import OurJourneySvg from '../../assets/icons/OUR JOURNEY.svg';
// import CoreValuesSvg from '../../assets/icons/CORE VALUES.svg';
// import FounderSvg from '../../assets/icons/FOUNDER.svg';

// // Existing imports
// import Header from '../../components/common/Header.jsx';
// import Footer from '../../components/common/Footer.jsx';

// // Register GSAP plugins
// gsap.registerPlugin(ScrollTrigger);

// const AboutUsContainer = styled("div")({
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
//     overflow: `hidden`,
// });

// // Hero Section
// const HeroSection = styled("div")({
//     backgroundImage: `url(${AboutUsPageImage})`,
//     backgroundPosition: `center`,
//     backgroundSize: `cover`,
//     backgroundRepeat: `no-repeat`,
//     display: `flex`,
//     position: `relative`,
//     flexDirection: `column`,
//     justifyContent: `center`,
//     alignItems: `flex-start`,
//     padding: `120px 8% 80px`,
//     boxSizing: `border-box`,
//     width: `100%`,
//     minHeight: `100vh`,
//     overflow: `hidden`,
// });

// const JourneyContent = styled("div")({
//     position: `relative`,
//     zIndex: 10,
//     maxWidth: `484px`,
//     textAlign: `left`,
//     paddingTop: `200px`,
//     '@media (max-width: 768px)': {
//         maxWidth: `100%`,
//         textAlign: `center`,
//         paddingTop: `150px`,
//     },
//     '@media (max-width: 480px)': {
//         paddingTop: `100px`,
//     },
// });

// const OurJourneyTitle = styled("img")({
//     height: `auto`,
//     width: `400px`,
//     marginBottom: `20px`,
//     '@media (max-width: 768px)': {
//         width: `300px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `250px`,
//     },
// });

// const JourneySubtitle = styled("div")({
//     color: `rgba(255, 232, 161, 0.9)`,
//     fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
//     fontWeight: `400`,
//     fontSize: `32px`,
//     lineHeight: `1.2`,
//     marginBottom: `20px`,
//     '@media (max-width: 768px)': {
//         fontSize: `24px`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `20px`,
//     },
// });

// const JourneyDescription = styled("div")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `500`,
//     fontSize: `16px`,
//     lineHeight: `1.5`,
//     letterSpacing: `0.5px`,
//     '@media (max-width: 480px)': {
//         fontSize: `14px`,
//     },
// });

// // Mission/Vision Section
// const MissionVisionSection = styled("div")({
//     position: `relative`,
//     width: `100%`,
//     minHeight: `100vh`,
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     display: `flex`,
//     alignItems: `center`,
//     justifyContent: `center`,
//     padding: `80px 8%`,
//     overflow: `hidden`,
//     '@media (max-width: 768px)': {
//         padding: `60px 5%`,
//         flexDirection: `column`,
//         gap: `10px`,
//     },
// });

// const MissionVisionGrid = styled("div")({
//     display: `grid`,
//     gridTemplateColumns: `1fr 1fr`,
//     gap: `10px`,
//     maxWidth: `800px`,
//     width: `100%`,
//     alignItems: `center`,
//     marginLeft: `-180px`,
//     '@media (max-width: 768px)': {
//         gridTemplateColumns: `1fr`,
//         gap: `30px`,
//         marginLeft: `10px`,
//     },
// });

// const CircleContainer = styled("div")({
//     position: `relative`,
//     display: `flex`,
//     flexDirection: `column`,
//     alignItems: `center`,
//     textAlign: `center`,
// });

// const Circle = styled("div")({
//     width: `450px`,
//     height: `400px`,
//     borderRadius: `50%`,
//     backgroundColor: `transparent`,
//     border: `3px solid rgba(255, 232, 161, 0.3)`,
//     display: `flex`,
//     flexDirection: `column`,
//     alignItems: `center`,
//     justifyContent: `center`,
//     padding: `40px`,
//     marginBottom: `30px`,
//     '@media (max-width: 768px)': {
//         width: `300px`,
//         height: `300px`,
//         padding: `30px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `250px`,
//         height: `250px`,
//         padding: `20px`,
//     },
// });

// const CircleTitle = styled("div")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
//     fontWeight: `700`,
//     fontSize: `25px`,
//     lineHeight: `1.1`,
//     marginBottom: `20px`,
//     textTransform: `uppercase`,
//     '@media (max-width: 768px)': {
//         fontSize: `24px`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `20px`,
//     },
// });

// const CircleText = styled("div")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `500`,
//     fontSize: `18px`,
//     lineHeight: `1.4`,
//     letterSpacing: `0.5px`,
//     '@media (max-width: 768px)': {
//         fontSize: `16px`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `14px`,
//     },
// });

// // Core Values Section
// const CoreValuesSection = styled("div")({
//     position: `relative`,
//     width: `100%`,
//     minHeight: `100vh`,
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     backgroundImage: `repeating-linear-gradient(
//         90deg,
//         rgba(255, 232, 161, 0.02) 0px,
//         rgba(255, 232, 161, 0.02) 1px,
//         transparent 1px,
//         transparent 40px
//     )`,
//     padding: `80px 5%`,
//     overflow: `visible`,
//     display: `flex`,
//     flexDirection: `column`,
//     alignItems: `center`,
//     '@media (max-width: 768px)': {
//         padding: `60px 5%`,
//     },
// });

// const CoreValuesHeader = styled("div")({
//     textAlign: `left`,
//     marginBottom: `60px`,
//     position: `absolute`,
//     top: `5px`,
//     right: `15%`,
//     zIndex: 10,
//     maxWidth: `400px`,
//     '@media (max-width: 768px)': {
//         position: `relative`,
//         top: `auto`,
//         right: `auto`,
//         textAlign: `center`,
//         maxWidth: `100%`,
//     },
// });

// const CoreValuesTitle = styled("img")({
//     height: `auto`,
//     width: `500px`,
//     marginBottom: `10px`,
//     '@media (max-width: 768px)': {
//         width: `400px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `300px`,
//     },
// });

// const CoreValuesSubtitle = styled("div")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
//     fontWeight: `400`,
//     fontSize: `24px`,
//     lineHeight: `1.2`,
//     marginBottom: `15px`,
//     letterSpacing: `2px`,
//     textTransform: `uppercase`,
//     '@media (max-width: 768px)': {
//         fontSize: `16px`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `14px`,
//     },
// });

// const CoreValuesDescription = styled("div")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `400`,
//     fontSize: `16px`,
//     lineHeight: `1.5`,
//     letterSpacing: `0.5px`,
//     maxWidth: `500px`,
//     '@media (max-width: 480px)': {
//         fontSize: `14px`,
//     },
// });

// const ValuesContainer = styled("div")({
//     position: `relative`,
//     width: `100%`,
//     maxWidth: `1200px`,
//     display: `flex`,
//     justifyContent: `center`,
//     alignItems: `end`,
//     gap: `40px`,
//     marginTop: `300px`,
//     '@media (max-width: 1024px)': {
//         display: `grid`,
//         gridTemplateColumns: `repeat(2, 1fr)`,
//         gap: `40px`,
//         alignItems: `center`,
//         marginTop: `40px`,
//     },
//     '@media (max-width: 768px)': {
//         gridTemplateColumns: `1fr`,
//         gap: `30px`,
//         marginTop: `40px`,
//     },
// });

// const ValueCard = styled("div")({
//     backgroundColor: `rgba(205, 217, 157, 1)`,
//     borderRadius: `25px`,
//     padding: `30px 25px 35px`,
//     textAlign: `center`,
//     position: `relative`,
//     width: `260px`,
//     transition: `transform 0.3s ease, box-shadow 0.3s ease`,
//     display: `flex`,
//     flexDirection: `column`,
//     alignItems: `center`,
//     '&:hover': {
//         transform: `translateY(-10px)`,
//         boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2)`,
//     },
//     '&:nth-of-type(2), &:nth-of-type(4)': {
//         transform: `translateY(-100px)`,
//         '&:hover': {
//             transform: `translateY(-110px)`,
//         },
//         '@media (max-width: 1024px)': {
//             transform: `translateY(0)`,
//             '&:hover': {
//                 transform: `translateY(-10px)`,
//             },
//         },
//     },
//     '@media (max-width: 768px)': {
//         width: `280px`,
//         margin: `0 auto`,
//     },
//     '@media (max-width: 480px)': {
//         width: `250px`,
//         padding: `25px 20px 30px`,
//     },
// });

// const ValueImageContainer = styled("div")({
//     width: `200px`,
//     height: `200px`,
//     borderRadius: `50%`,
//     overflow: `hidden`,
//     marginBottom: `20px`,
//     border: `3px solid rgba(255, 255, 255, 0.1)`,
//     '@media (max-width: 768px)': {
//         width: `180px`,
//         height: `180px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `160px`,
//         height: `160px`,
//     },
// });

// const ValueImage = styled("img")({
//     width: `100%`,
//     height: `100%`,
//     objectFit: `cover`,
// });

// const ValueCardTitle = styled("div")({
//     color: `rgba(30, 45, 39, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `700`,
//     fontSize: `16px`,
//     lineHeight: `1.2`,
//     marginBottom: `15px`,
//     textTransform: `uppercase`,
//     letterSpacing: `0.5px`,
//     '@media (max-width: 480px)': {
//         fontSize: `15px`,
//     },
// });

// const ValueCardText = styled("div")({
//     color: `rgba(30, 45, 39, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `500`,
//     fontSize: `14px`,
//     lineHeight: `1.4`,
//     letterSpacing: `0.3px`,
//     '@media (max-width: 480px)': {
//         fontSize: `13px`,
//     },
// });

// // Founder Section
// const FounderSection = styled("div")({
//     position: `relative`,
//     width: `100%`,
//     minHeight: `100vh`,
//     backgroundColor: `rgba(30, 45, 39, 1)`,
//     display: `flex`,
//     alignItems: `center`,
//     justifyContent: `space-between`,
//     padding: `80px 8%`,
//     overflow: `hidden`,
//     '@media (max-width: 768px)': {
//         flexDirection: `column`,
//         padding: `60px 5%`,
//         gap: `40px`,
//     },
// });

// const FounderContent = styled("div")({
//     flex: `1`,
//     maxWidth: `500px`,
//     zIndex: 10,
//     '@media (max-width: 768px)': {
//         maxWidth: `100%`,
//         textAlign: `center`,
//     },
// });

// const FounderTitle = styled("img")({
//     height: `auto`,
//     width: `300px`,
//     marginBottom: `20px`,
//     '@media (max-width: 768px)': {
//         width: `250px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `200px`,
//     },
// });

// const FounderSubtitle = styled("div")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
//     fontWeight: `400`,
//     fontSize: `24px`,
//     lineHeight: `1.2`,
//     marginBottom: `20px`,
//     letterSpacing: `0.5px`,
//     '@media (max-width: 768px)': {
//         fontSize: `20px`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `18px`,
//     },
// });

// const FounderDescription = styled("div")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `500`,
//     fontSize: `16px`,
//     lineHeight: `1.5`,
//     letterSpacing: `0.5px`,
//     marginBottom: `40px`,
//     '@media (max-width: 480px)': {
//         fontSize: `14px`,
//     },
// });

// const FounderImageContainer = styled("div")({
//     flex: `1`,
//     display: `flex`,
//     justifyContent: `center`,
//     alignItems: `center`,
//     position: `relative`,
//     '@media (max-width: 768px)': {
//         order: `-1`,
//     },
// });

// const FounderImagePlaceholder = styled("div")({
//     width: `400px`,
//     height: `400px`,
//     borderRadius: `50%`,
//     backgroundColor: `rgba(205, 217, 157, 0.3)`,
//     border: `3px solid rgba(255, 232, 161, 0.3)`,
//     display: `flex`,
//     alignItems: `center`,
//     justifyContent: `center`,
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `600`,
//     fontSize: `24px`,
//     '@media (max-width: 768px)': {
//         width: `300px`,
//         height: `300px`,
//         fontSize: `20px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `250px`,
//         height: `250px`,
//         fontSize: `18px`,
//     },
// });

// const CTASection = styled("div")({
//     textAlign: `center`,
//     marginTop: `60px`,
//     padding: `40px`,
//     backgroundColor: `rgba(255, 232, 161, 0.1)`,
//     borderRadius: `20px`,
//     border: `2px solid rgba(255, 232, 161, 0.3)`,
// });

// const CTATitle = styled("div")({
//     color: `rgba(255, 255, 255, 1)`,
//     fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
//     fontWeight: `400`,
//     fontSize: `24px`,
//     lineHeight: `1.2`,
//     marginBottom: `10px`,
//     letterSpacing: `0.5px`,
//     '@media (max-width: 480px)': {
//         fontSize: `20px`,
//     },
// });

// const CTASubtitle = styled("div")({
//     color: `rgba(255, 232, 161, 1)`,
//     fontFamily: `DM Sans`,
//     fontWeight: `500`,
//     fontSize: `16px`,
//     lineHeight: `1.4`,
//     marginBottom: `30px`,
//     letterSpacing: `0.5px`,
//     '@media (max-width: 480px)': {
//         fontSize: `14px`,
//     },
// });

// const ExploreButton = styled(Link)({
//     display: `inline-flex`,
//     alignItems: `center`,
//     gap: `10px`,
//     backgroundColor: `rgba(255, 232, 161, 1)`,
//     color: `rgba(30, 45, 39, 1)`,
//     padding: `15px 30px`,
//     borderRadius: `25px`,
//     fontFamily: `DM Sans`,
//     fontWeight: `600`,
//     fontSize: `16px`,
//     textDecoration: `none`,
//     transition: `all 0.3s ease`,
//     '&:hover': {
//         backgroundColor: `rgba(255, 232, 161, 0.9)`,
//         transform: `translateY(-2px)`,
//     },
// });

// // Decorative Elements
// const RectangleDecoration = styled("img")({
//     position: `absolute`,
//     left: `0`,
//     top: `0`,
//     width: `27%`,
//     height: `auto`,
//     maxWidth: `390px`,
//     zIndex: 3,
//     transform: `scaleX(-1)`, // Mirror for left side
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

// const TreeBranchDecoration = styled("img")({
//     position: `absolute`,
//     left: `-50px`,
//     top: `-50px`,
//     width: `300px`,
//     height: `auto`,
//     zIndex: 3,
//     transform: `scaleX(-1)`, // Mirror for left side
//     '@media (max-width: 768px)': {
//         width: `250px`,
//         left: `-30px`,
//         top: `-30px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `200px`,
//         left: `-20px`,
//         top: `-20px`,
//     },
// });

// const PlantsDecoration = styled("img")({
//     position: `absolute`,
//     right: `0%`,
//     bottom: `0%`,
//     width: `375px`,
//     height: `auto`,
//     maxWidth: `450px`,
//     zIndex: 3,
//     '@media (max-width: 1200px)': {
//         width: `24%`,
//         right: `3%`,
//     },
//     '@media (max-width: 768px)': {
//         width: `22%`,
//         right: `2%`,
//         bottom: `3%`,
//     },
//     '@media (max-width: 480px)': {
//         width: `20%`,
//         right: `1%`,
//         bottom: `2%`,
//     },
// });

// const TreeDecoration = styled("img")({
//     position: `absolute`,
//     right: `0px`,
//     bottom: `-50px`,
//     width: `400px`,
//     height: `auto`,
//     zIndex: 3,
//     '@media (max-width: 768px)': {
//         width: `300px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `200px`,
//     },
// });

// const CoreValuesBirdDecoration = styled("img")({
//     position: `absolute`,
//     bottom: `-120px`,
//     left: `4.5%`,
//     width: `120px`,
//     height: `auto`,
//     zIndex: 5,
//     '@media (max-width: 768px)': {
//         width: `100px`,
//         bottom: `-80px`,
//         left: `5%`,
//     },
//     '@media (max-width: 480px)': {
//         width: `80px`,
//         bottom: `-60px`,
//         left: `3%`,
//     },
// });



// function AboutUsPage() {
//     const heroRef = useRef(null);
//     const missionRef = useRef(null);
//     const valuesRef = useRef(null);
//     const founderRef = useRef(null);

//     useEffect(() => {
//         // Hero section animations
//         ScrollTrigger.create({
//             trigger: heroRef.current,
//             start: "top 80%",
//             onEnter: () => {
//                 gsap.fromTo(heroRef.current?.querySelector('.journey-content'),
//                     { y: 50, opacity: 0 },
//                     { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
//                 );
//             },
//             once: true
//         });

//         // Mission/Vision section animations
//         ScrollTrigger.create({
//             trigger: missionRef.current,
//             start: "top 80%",
//             onEnter: () => {
//                 gsap.fromTo(missionRef.current?.querySelectorAll('.circle-container'),
//                     { y: 50, opacity: 0 },
//                     { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.3, clearProps: "all" }
//                 );
//             },
//             once: true
//         });

//         // Values section animations
//         ScrollTrigger.create({
//             trigger: valuesRef.current,
//             start: "top 80%",
//             onEnter: () => {
//                 gsap.fromTo(valuesRef.current?.querySelectorAll('.value-card'),
//                     { y: 30, opacity: 0 },
//                     { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.2, clearProps: "all" }
//                 );
//             },
//             once: true
//         });

//         // Founder section animations
//         ScrollTrigger.create({
//             trigger: founderRef.current,
//             start: "top 80%",
//             onEnter: () => {
//                 gsap.fromTo(founderRef.current?.querySelector('.founder-content'),
//                     { x: -50, opacity: 0 },
//                     { x: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
//                 );
//                 gsap.fromTo(founderRef.current?.querySelector('.founder-image'),
//                     { scale: 0.8, opacity: 0 },
//                     { scale: 1, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out", clearProps: "all" }
//                 );
//             },
//             once: true
//         });

//         return () => {
//             ScrollTrigger.getAll().forEach(t => t.kill());
//         };
//     }, []);

//     return (
//         <AboutUsContainer>
//             {/* Header */}
//             <Header />

//             {/* Hero Section with About Us background */}
//             <HeroSection ref={heroRef}>
//                 <JourneyContent className="journey-content">
//                     <OurJourneyTitle src={OurJourneySvg} alt="Our Journey" />
//                     <JourneySubtitle>
//                         EXPLORE<br />
//                         PREDICT<br />
//                         ENCOUNTER
//                     </JourneySubtitle>
//                     <JourneyDescription>
//                         Junglore turns safaris into seamless adventures, with AI and planning tools, we boost sightings. Wildlife moments, made unforgettable.
//                     </JourneyDescription>
//                 </JourneyContent>
//             </HeroSection>

//             {/* Mission/Vision Section */}
//             <MissionVisionSection ref={missionRef}>
//                 <MissionVisionGrid>
//                     <CircleContainer className="circle-container">
//                         <Circle>
//                             <CircleTitle>Our Mission</CircleTitle>
//                             <CircleText>
//                                 We aim to provide wildlife lovers with a thrilling safari experience by ensuring maximal animal sightings. Using advanced AI, predictive models, educational resources, and trained guides, we strive to make safaris an enthralling experience for all.
//                             </CircleText>
//                         </Circle>
//                     </CircleContainer>

//                     <CircleContainer className="circle-container">
//                         <Circle>
//                             <CircleTitle>Our Vision</CircleTitle>
//                             <CircleText>
//                                 We aspire to make jungle expeditions a truly enriching experience for wildlife enthusiasts across the globe. By combining AI, predictive models, and innovative practices, we go beyond just sightings, helping people connect deeply with Nature, while supporting biodiversity and the greater good.
//                             </CircleText>
//                         </Circle>
//                     </CircleContainer>
//                 </MissionVisionGrid>

//                 {/* Decorative Elements */}
//                 <RectangleDecoration src={RectangleImage} alt="Rectangle decoration" />
//                 <PlantsDecoration src={PlantsImage} alt="Plants decoration" />
//             </MissionVisionSection>

//             {/* Core Values Section */}
//             <CoreValuesSection ref={valuesRef}>
//                 <CoreValuesHeader>
//                     <CoreValuesTitle src={CoreValuesSvg} alt="Core Values" />
//                     <CoreValuesSubtitle>RESPECT.CONNECT.CONSERVE</CoreValuesSubtitle>
//                     <CoreValuesDescription>
//                         Rooted in care for nature, our values guide every step toward a wilder, wiser world.
//                     </CoreValuesDescription>
//                 </CoreValuesHeader>

//                 <ValuesContainer>
//                     <ValueCard className="value-card">
//                         <ValueImageContainer>
//                             <ValueImage src={CoreValues1Image} alt="Community Engagement" />
//                         </ValueImageContainer>
//                         <ValueCardTitle>Community<br />Engagement</ValueCardTitle>
//                         <ValueCardText>
//                             Connect with a vibrant community of wildlife enthusiasts to share unforgettable experiences.
//                         </ValueCardText>
//                     </ValueCard>

//                     <ValueCard className="value-card">
//                         <ValueImageContainer>
//                             <ValueImage src={CoreValues2Image} alt="Education" />
//                         </ValueImageContainer>
//                         <ValueCardTitle>Education</ValueCardTitle>
//                         <ValueCardText>
//                             With education, we help you understand and appreciate wildlife better.
//                         </ValueCardText>
//                     </ValueCard>

//                     <ValueCard className="value-card">
//                         <ValueImageContainer>
//                             <ValueImage src={CoreValues3Image} alt="Excellence" />
//                         </ValueImageContainer>
//                         <ValueCardTitle>Excellence</ValueCardTitle>
//                         <ValueCardText>
//                             Our well-planned safaris and trained guides result in an excellent safari experience.
//                         </ValueCardText>
//                     </ValueCard>

//                     <ValueCard className="value-card">
//                         <ValueImageContainer>
//                             <ValueImage src={CoreValues4Image} alt="Innovation" />
//                         </ValueImageContainer>
//                         <ValueCardTitle>Innovation</ValueCardTitle>
//                         <ValueCardText>
//                             We introduced AI and predictive models for maximal animal sightings.
//                         </ValueCardText>
//                     </ValueCard>
//                 </ValuesContainer>

//                 {/* Decorative Elements */}
//                 <TreeBranchDecoration src={Desktop3TreeBranch2Image} alt="Tree branch decoration" />
//                 <CoreValuesBirdDecoration src={Bird2Image} alt="Bird decoration" />
//             </CoreValuesSection>

//             {/* Founder Section */}
//             <FounderSection ref={founderRef}>
//                 <FounderContent className="founder-content">
//                     <FounderTitle src={FounderSvg} alt="Founder" />
//                     <FounderSubtitle>DRIVEN BY WILD VISION</FounderSubtitle>
//                     <FounderDescription>
//                         Our founder, a lifelong wildlife enthusiast, turned passion into purpose; crafting Junglore to make every jungle journey insightful, seamless, and unforgettable.
//                     </FounderDescription>

//                     <CTASection>
//                         <CTATitle>KICKSTART YOUR ADVENTUROUS TRAIL WITH US</CTATitle>
//                         <CTASubtitle>Make your safari experience thrilling and satisfying with Junglore!</CTASubtitle>
//                         <ExploreButton to="/resources">
//                             EXPLORE →
//                         </ExploreButton>
//                     </CTASection>
//                 </FounderContent>

//                 <FounderImageContainer className="founder-image">
//                     <FounderImagePlaceholder>
//                         FOUNDER IMAGE
//                     </FounderImagePlaceholder>
//                 </FounderImageContainer>

//                 {/* Decorative Elements */}
//                 <TreeDecoration src={Tree1Image} alt="Tree decoration" />
//             </FounderSection>

//             {/* Footer */}
//             <Footer />
//         </AboutUsContainer>
//     );
// }

// export default AboutUsPage; 





import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// Import images
import AboutUsPageImage from '../../assets/images/pages/AboutUsPage.png';

// Import reused assets from other pages
import RectangleImage from '../../assets/images/media/Rectangle.png';
import PlantsImage from '../../assets/images/media/lost-found-albion-place-leeds-i-want-plants-1.png';
import Desktop3TreeBranch2Image from '../../assets/images/Desktop3_tree_branch_2.png';
import Tree1Image from '../../assets/images/Fullpage_tree_1.png';

// New imports for birds
import Bird2Image from '../../assets/images/bird2.png';

// New imports for core values images
import CoreValues1Image from '../../assets/images/corevalues1.png';
import CoreValues2Image from '../../assets/images/corevalues2.png';
import CoreValues3Image from '../../assets/images/corevalues3.png';
import CoreValues4Image from '../../assets/images/corevalues4.png';

// Import SVG titles
import OurJourneySvg from '../../assets/icons/OUR JOURNEY.svg';
import CoreValuesSvg from '../../assets/icons/CORE VALUES.svg';
import FounderSvg from '../../assets/icons/FOUNDER.svg';

// Existing imports
import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import FaunaBot from '../../components/common/FaunaBot.jsx';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AboutUsContainer = styled("div")({
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
    overflow: `hidden`,
});

// Hero Section
const HeroSection = styled("div")({
    backgroundImage: `url(${AboutUsPageImage})`,
    backgroundPosition: `center`,
    backgroundSize: `cover`,
    backgroundRepeat: `no-repeat`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `flex-start`,
    padding: `120px 8% 80px`,
    boxSizing: `border-box`,
    width: `100%`,
    minHeight: `100vh`,
    overflow: `hidden`,
});

const JourneyContent = styled("div")({
    position: `relative`,
    zIndex: 10,
    maxWidth: `484px`,
    textAlign: `left`,
    paddingTop: `200px`,
    '@media (max-width: 768px)': {
        maxWidth: `100%`,
        textAlign: `center`,
        paddingTop: `150px`,
    },
    '@media (max-width: 480px)': {
        paddingTop: `100px`,
    },
});

const OurJourneyTitle = styled("img")({
    height: `auto`,
    width: `400px`,
    marginBottom: `20px`,
    '@media (max-width: 768px)': {
        width: `300px`,
    },
    '@media (max-width: 480px)': {
        width: `250px`,
    },
});

const JourneySubtitle = styled("div")({
    color: `rgba(255, 232, 161, 0.9)`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontWeight: `400`,
    fontSize: `32px`,
    lineHeight: `1.2`,
    marginBottom: `20px`,
    '@media (max-width: 768px)': {
        fontSize: `24px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
    },
});

const JourneyDescription = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `16px`,
    lineHeight: `1.5`,
    letterSpacing: `0.5px`,
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

// Mission/Vision Section
const MissionVisionSection = styled("div")({
    position: `relative`,
    width: `100%`,
    minHeight: `100vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    padding: `80px 8%`,
    overflow: `hidden`,
    '@media (max-width: 768px)': {
        padding: `80px 5% 60px`,
        flexDirection: `column`,
        gap: `10px`,
    },
    '@media (max-width: 480px)': {
        padding: `60px 5% 40px`,
    },
});

const MissionVisionGrid = styled("div")({
    display: `grid`,
    gridTemplateColumns: `1fr 1fr`,
    gap: `10px`,
    maxWidth: `800px`,
    width: `100%`,
    alignItems: `center`,
    marginLeft: `-180px`,
    '@media (max-width: 768px)': {
        gridTemplateColumns: `1fr`,
        gap: `40px`,
        marginLeft: `0`,
        justifyItems: `center`,
    },
});

const CircleContainer = styled("div")({
    position: `relative`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    textAlign: `center`,
});

const Circle = styled("div")({
    width: `450px`,
    height: `400px`,
    borderRadius: `50%`,
    backgroundColor: `transparent`,
    border: `3px solid rgba(255, 232, 161, 0.3)`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
    padding: `40px`,
    marginBottom: `30px`,
    '@media (max-width: 768px)': {
        width: `300px`,
        height: `300px`,
        padding: `30px 25px`,
    },
    '@media (max-width: 480px)': {
        width: `280px`,
        height: `280px`,
        padding: `15px`,
    },
});

const CircleTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontWeight: `700`,
    fontSize: `25px`,
    lineHeight: `1.1`,
    marginBottom: `20px`,
    textTransform: `uppercase`,
    '@media (max-width: 768px)': {
        fontSize: `22px`,
        marginBottom: `15px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `18px`,
        marginBottom: `10px`,
    },
});

const CircleText = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `18px`,
    lineHeight: `1.4`,
    letterSpacing: `0.5px`,
    '@media (max-width: 768px)': {
        fontSize: `15px`,
        lineHeight: `1.3`,
    },
    '@media (max-width: 480px)': {
        fontSize: `12px`,
        lineHeight: `1.3`,
        letterSpacing: `0.3px`,
    },
});

// Core Values Section
const CoreValuesSection = styled("div")({
    position: `relative`,
    width: `100%`,
    minHeight: `100vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    backgroundImage: `repeating-linear-gradient(
        90deg,
        rgba(255, 232, 161, 0.02) 0px,
        rgba(255, 232, 161, 0.02) 1px,
        transparent 1px,
        transparent 40px
    )`,
    padding: `80px 5%`,
    overflow: `visible`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    '@media (max-width: 768px)': {
        padding: `60px 5%`,
    },
});

const CoreValuesHeader = styled("div")({
    textAlign: `left`,
    marginBottom: `60px`,
    position: `absolute`,
    top: `5px`,
    right: `15%`,
    zIndex: 10,
    maxWidth: `400px`,
    '@media (max-width: 768px)': {
        position: `relative`,
        top: `auto`,
        right: `auto`,
        textAlign: `center`,
        maxWidth: `100%`,
    },
});

const CoreValuesTitle = styled("img")({
    height: `auto`,
    width: `500px`,
    marginBottom: `10px`,
    '@media (max-width: 768px)': {
        width: `400px`,
    },
    '@media (max-width: 480px)': {
        width: `300px`,
    },
});

const CoreValuesSubtitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontWeight: `400`,
    fontSize: `24px`,
    lineHeight: `1.2`,
    marginBottom: `15px`,
    letterSpacing: `2px`,
    textTransform: `uppercase`,
    '@media (max-width: 768px)': {
        fontSize: `16px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const CoreValuesDescription = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `16px`,
    lineHeight: `1.5`,
    letterSpacing: `0.5px`,
    maxWidth: `500px`,
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const ValuesContainer = styled("div")({
    position: `relative`,
    width: `100%`,
    maxWidth: `1200px`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `end`,
    gap: `40px`,
    marginTop: `300px`,
    '@media (max-width: 1024px)': {
        display: `grid`,
        gridTemplateColumns: `repeat(2, 1fr)`,
        gap: `40px`,
        alignItems: `center`,
        marginTop: `40px`,
    },
    '@media (max-width: 768px)': {
        gridTemplateColumns: `1fr`,
        gap: `30px`,
        marginTop: `40px`,
    },
});

const ValueCard = styled("div")({
    backgroundColor: `rgba(205, 217, 157, 1)`,
    borderRadius: `25px`,
    padding: `30px 25px 35px`,
    textAlign: `center`,
    position: `relative`,
    width: `260px`,
    transition: `transform 0.3s ease, box-shadow 0.3s ease`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    '&:hover': {
        transform: `translateY(-10px)`,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2)`,
    },
    '&:nth-of-type(2), &:nth-of-type(4)': {
        transform: `translateY(-100px)`,
        '&:hover': {
            transform: `translateY(-110px)`,
        },
        '@media (max-width: 1024px)': {
            transform: `translateY(0)`,
            '&:hover': {
                transform: `translateY(-10px)`,
            },
        },
    },
    '@media (max-width: 768px)': {
        width: `280px`,
        margin: `0 auto`,
    },
    '@media (max-width: 480px)': {
        width: `250px`,
        padding: `25px 20px 30px`,
    },
});

const ValueImageContainer = styled("div")({
    width: `200px`,
    height: `200px`,
    borderRadius: `50%`,
    overflow: `hidden`,
    marginBottom: `20px`,
    border: `3px solid rgba(255, 255, 255, 0.1)`,
    '@media (max-width: 768px)': {
        width: `180px`,
        height: `180px`,
    },
    '@media (max-width: 480px)': {
        width: `160px`,
        height: `160px`,
    },
});

const ValueImage = styled("img")({
    width: `100%`,
    height: `100%`,
    objectFit: `cover`,
});

const ValueCardTitle = styled("div")({
    color: `rgba(30, 45, 39, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    lineHeight: `1.2`,
    marginBottom: `15px`,
    textTransform: `uppercase`,
    letterSpacing: `0.5px`,
    '@media (max-width: 480px)': {
        fontSize: `15px`,
    },
});

const ValueCardText = styled("div")({
    color: `rgba(30, 45, 39, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `14px`,
    lineHeight: `1.4`,
    letterSpacing: `0.3px`,
    '@media (max-width: 480px)': {
        fontSize: `13px`,
    },
});

// Founder Section
const FounderSection = styled("div")({
    position: `relative`,
    width: `100%`,
    minHeight: `100vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
    padding: `80px 8%`,
    overflow: `hidden`,
    '@media (max-width: 768px)': {
        flexDirection: `column`,
        padding: `60px 5%`,
        gap: `40px`,
    },
});

const FounderContent = styled("div")({
    flex: `1`,
    maxWidth: `500px`,
    zIndex: 10,
    '@media (max-width: 768px)': {
        maxWidth: `100%`,
        textAlign: `center`,
    },
});

const FounderTitle = styled("img")({
    height: `auto`,
    width: `300px`,
    marginBottom: `20px`,
    '@media (max-width: 768px)': {
        width: `250px`,
    },
    '@media (max-width: 480px)': {
        width: `200px`,
    },
});

const FounderSubtitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontWeight: `400`,
    fontSize: `24px`,
    lineHeight: `1.2`,
    marginBottom: `20px`,
    letterSpacing: `0.5px`,
    '@media (max-width: 768px)': {
        fontSize: `20px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `18px`,
    },
});

const FounderDescription = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `16px`,
    lineHeight: `1.5`,
    letterSpacing: `0.5px`,
    marginBottom: `40px`,
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const FounderImageContainer = styled("div")({
    flex: `1`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    position: `relative`,
    '@media (max-width: 768px)': {
        order: `-1`,
    },
});

const FounderImagePlaceholder = styled("div")({
    width: `400px`,
    height: `400px`,
    borderRadius: `50%`,
    backgroundColor: `rgba(205, 217, 157, 0.3)`,
    border: `3px solid rgba(255, 232, 161, 0.3)`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `24px`,
    '@media (max-width: 768px)': {
        width: `300px`,
        height: `300px`,
        fontSize: `20px`,
    },
    '@media (max-width: 480px)': {
        width: `250px`,
        height: `250px`,
        fontSize: `18px`,
    },
});

const CTASection = styled("div")({
    textAlign: `center`,
    marginTop: `60px`,
    padding: `40px`,
    backgroundColor: `rgba(255, 232, 161, 0.1)`,
    borderRadius: `20px`,
    border: `2px solid rgba(255, 232, 161, 0.3)`,
});

const CTATitle = styled("div")({
    color: `rgba(255, 255, 255, 1)`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontWeight: `400`,
    fontSize: `24px`,
    lineHeight: `1.2`,
    marginBottom: `10px`,
    letterSpacing: `0.5px`,
    '@media (max-width: 480px)': {
        fontSize: `20px`,
    },
});

const CTASubtitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `16px`,
    lineHeight: `1.4`,
    marginBottom: `30px`,
    letterSpacing: `0.5px`,
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const ExploreButton = styled(Link)({
    display: `inline-flex`,
    alignItems: `center`,
    gap: `10px`,
    backgroundColor: `rgba(255, 232, 161, 1)`,
    color: `rgba(30, 45, 39, 1)`,
    padding: `15px 30px`,
    borderRadius: `25px`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `16px`,
    textDecoration: `none`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(255, 232, 161, 0.9)`,
        transform: `translateY(-2px)`,
    },
});

// Decorative Elements
const RectangleDecoration = styled("img")({
    position: `absolute`,
    left: `0`,
    top: `0`,
    width: `27%`,
    height: `auto`,
    maxWidth: `390px`,
    zIndex: 3,
    transform: `scaleX(-1)`, // Mirror for left side
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

const TreeBranchDecoration = styled("img")({
    position: `absolute`,
    left: `-50px`,
    top: `-50px`,
    width: `300px`,
    height: `auto`,
    zIndex: 3,
    transform: `scaleX(-1)`, // Mirror for left side
    '@media (max-width: 768px)': {
        width: `250px`,
        left: `-30px`,
        top: `-30px`,
    },
    '@media (max-width: 480px)': {
        width: `200px`,
        left: `-20px`,
        top: `-20px`,
    },
});

const PlantsDecoration = styled("img")({
    position: `absolute`,
    right: `0%`,
    bottom: `0%`,
    width: `375px`,
    height: `auto`,
    maxWidth: `450px`,
    zIndex: 3,
    '@media (max-width: 1200px)': {
        width: `24%`,
        right: `3%`,
    },
    '@media (max-width: 768px)': {
        width: `22%`,
        right: `2%`,
        bottom: `3%`,
    },
    '@media (max-width: 480px)': {
        width: `20%`,
        right: `1%`,
        bottom: `2%`,
    },
});

const TreeDecoration = styled("img")({
    position: `absolute`,
    right: `0px`,
    bottom: `-50px`,
    width: `400px`,
    height: `auto`,
    zIndex: 3,
    '@media (max-width: 768px)': {
        width: `300px`,
    },
    '@media (max-width: 480px)': {
        width: `200px`,
    },
});

const CoreValuesBirdDecoration = styled("img")({
    position: `absolute`,
    bottom: `-120px`,
    left: `4.5%`,
    width: `120px`,
    height: `auto`,
    zIndex: 5,
    '@media (max-width: 768px)': {
        width: `100px`,
        bottom: `-80px`,
        left: `5%`,
    },
    '@media (max-width: 480px)': {
        width: `80px`,
        bottom: `-60px`,
        left: `3%`,
    },
});



function AboutUsPage() {
    const heroRef = useRef(null);
    const missionRef = useRef(null);
    const valuesRef = useRef(null);
    const founderRef = useRef(null);

    useEffect(() => {
        // Hero section animations
        ScrollTrigger.create({
            trigger: heroRef.current,
            start: "top 80%",
            onEnter: () => {
                gsap.fromTo(heroRef.current?.querySelector('.journey-content'),
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
                );
            },
            once: true
        });

        // Mission/Vision section animations
        ScrollTrigger.create({
            trigger: missionRef.current,
            start: "top 80%",
            onEnter: () => {
                gsap.fromTo(missionRef.current?.querySelectorAll('.circle-container'),
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.3, clearProps: "all" }
                );
            },
            once: true
        });

        // Values section animations
        ScrollTrigger.create({
            trigger: valuesRef.current,
            start: "top 80%",
            onEnter: () => {
                gsap.fromTo(valuesRef.current?.querySelectorAll('.value-card'),
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.2, clearProps: "all" }
                );
            },
            once: true
        });

        // Founder section animations
        ScrollTrigger.create({
            trigger: founderRef.current,
            start: "top 80%",
            onEnter: () => {
                gsap.fromTo(founderRef.current?.querySelector('.founder-content'),
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
                );
                gsap.fromTo(founderRef.current?.querySelector('.founder-image'),
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out", clearProps: "all" }
                );
            },
            once: true
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <AboutUsContainer>
            {/* Header */}
            <Header />

            {/* Hero Section with About Us background */}
            <HeroSection ref={heroRef}>
                <JourneyContent className="journey-content">
                    <OurJourneyTitle src={OurJourneySvg} alt="Our Journey" />
                    <JourneySubtitle>
                        EXPLORE<br />
                        PREDICT<br />
                        ENCOUNTER
                    </JourneySubtitle>
                    <JourneyDescription>
                        Junglore turns safaris into seamless adventures, with AI and planning tools, we boost sightings. Wildlife moments, made unforgettable.
                    </JourneyDescription>
                </JourneyContent>
            </HeroSection>

            {/* Mission/Vision Section */}
            <MissionVisionSection ref={missionRef}>
                <MissionVisionGrid>
                    <CircleContainer className="circle-container">
                        <Circle>
                            <CircleTitle>Our Mission</CircleTitle>
                            <CircleText>
                                We aim to provide wildlife lovers with a thrilling safari experience by ensuring maximal animal sightings. Using advanced AI, predictive models, educational resources, and trained guides, we strive to make safaris an enthralling experience for all.
                            </CircleText>
                        </Circle>
                    </CircleContainer>

                    <CircleContainer className="circle-container">
                        <Circle>
                            <CircleTitle>Our Vision</CircleTitle>
                            <CircleText>
                                We aspire to make jungle expeditions a truly enriching experience for wildlife enthusiasts across the globe. By combining AI, predictive models, and innovative practices, we go beyond just sightings, helping people connect deeply with Nature, while supporting biodiversity and the greater good.
                            </CircleText>
                        </Circle>
                    </CircleContainer>
                </MissionVisionGrid>

                {/* Decorative Elements */}
                <RectangleDecoration src={RectangleImage} alt="Rectangle decoration" />
                <PlantsDecoration src={PlantsImage} alt="Plants decoration" />
            </MissionVisionSection>

            {/* Core Values Section */}
            <CoreValuesSection ref={valuesRef}>
                <CoreValuesHeader>
                    <CoreValuesTitle src={CoreValuesSvg} alt="Core Values" />
                    <CoreValuesSubtitle>RESPECT.CONNECT.CONSERVE</CoreValuesSubtitle>
                    <CoreValuesDescription>
                        Rooted in care for nature, our values guide every step toward a wilder, wiser world.
                    </CoreValuesDescription>
                </CoreValuesHeader>

                <ValuesContainer>
                    <ValueCard className="value-card">
                        <ValueImageContainer>
                            <ValueImage src={CoreValues1Image} alt="Community Engagement" />
                        </ValueImageContainer>
                        <ValueCardTitle>Community<br />Engagement</ValueCardTitle>
                        <ValueCardText>
                            Connect with a vibrant community of wildlife enthusiasts to share unforgettable experiences.
                        </ValueCardText>
                    </ValueCard>

                    <ValueCard className="value-card">
                        <ValueImageContainer>
                            <ValueImage src={CoreValues2Image} alt="Education" />
                        </ValueImageContainer>
                        <ValueCardTitle>Education</ValueCardTitle>
                        <ValueCardText>
                            With education, we help you understand and appreciate wildlife better.
                        </ValueCardText>
                    </ValueCard>

                    <ValueCard className="value-card">
                        <ValueImageContainer>
                            <ValueImage src={CoreValues3Image} alt="Excellence" />
                        </ValueImageContainer>
                        <ValueCardTitle>Excellence</ValueCardTitle>
                        <ValueCardText>
                            Our well-planned safaris and trained guides result in an excellent safari experience.
                        </ValueCardText>
                    </ValueCard>

                    <ValueCard className="value-card">
                        <ValueImageContainer>
                            <ValueImage src={CoreValues4Image} alt="Innovation" />
                        </ValueImageContainer>
                        <ValueCardTitle>Innovation</ValueCardTitle>
                        <ValueCardText>
                            We introduced AI and predictive models for maximal animal sightings.
                        </ValueCardText>
                    </ValueCard>
                </ValuesContainer>

                {/* Decorative Elements */}
                <TreeBranchDecoration src={Desktop3TreeBranch2Image} alt="Tree branch decoration" />
                <CoreValuesBirdDecoration src={Bird2Image} alt="Bird decoration" />
            </CoreValuesSection>

            {/* Founder Section */}
            <FounderSection ref={founderRef}>
                <FounderContent className="founder-content">
                    <FounderTitle src={FounderSvg} alt="Founder" />
                    <FounderSubtitle>DRIVEN BY WILD VISION</FounderSubtitle>
                    <FounderDescription>
                        Our founder, a lifelong wildlife enthusiast, turned passion into purpose; crafting Junglore to make every jungle journey insightful, seamless, and unforgettable.
                    </FounderDescription>

                    <CTASection>
                        <CTATitle>KICKSTART YOUR ADVENTUROUS TRAIL WITH US</CTATitle>
                        <CTASubtitle>Make your safari experience thrilling and satisfying with Junglore!</CTASubtitle>
                        <ExploreButton to="/resources">
                            EXPLORE →
                        </ExploreButton>
                    </CTASection>
                </FounderContent>

                <FounderImageContainer className="founder-image">
                    <FounderImagePlaceholder>
                        FOUNDER IMAGE
                    </FounderImagePlaceholder>
                </FounderImageContainer>

                {/* Decorative Elements */}
                <TreeDecoration src={Tree1Image} alt="Tree decoration" />
            </FounderSection>

            {/* Footer */}
            <Footer />

            {/* Floating FaunaBot - Available throughout the page */}
            <FaunaBot />
        </AboutUsContainer>
    );
}

export default AboutUsPage; 