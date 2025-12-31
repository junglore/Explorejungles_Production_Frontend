


import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import JeepAnimation from './JeepAnimation.jsx';
import Header from '../../components/common/Header.jsx';

import ForestTree2Image from '../../assets/images/Fullpage_forest_tree_2.png';
import Tree1Image from '../../assets/images/Fullpage_tree_1.png';
import PathToJungleImage from '../../assets/images/Fullpage_path_to_jungle.png';
import YourSvgImage from '../../assets/icons/YOUR.svg';

// Animal Images
import AnimalLionImage from '../../assets/images/Fullpage_Animal_Lion.png';
import AnimalGiraffeImage from '../../assets/images/Fullpage_Animal_Girraffe.png';
import AnimalElephantImage from '../../assets/images/Fullpage_Animal_Elephant.png';
import AnimalZebraImage from '../../assets/images/Fullpage_Animal_Zebra.png';
import AnimalDogImage from '../../assets/images/Fullpage_Animal_Dog.png';
import AnimalDeerImage from '../../assets/images/Fullpage_Animal_Deer.png';

// Desktop3 Resources Images
import Desktop3RectangleImage from '../../assets/images/Desktop3_Rectangle.png';
import Desktop3TreeBranch2Image from '../../assets/images/Desktop3_tree_branch_2.png';

// Quiz section images
import PlantsImage from '../../assets/images/media/lost-found-albion-place-leeds-i-want-plants-1.png';

// Components
import FaunaBot from '../../components/common/FaunaBot.jsx';

import { styled } from '@mui/material/styles';
import Footer from '../../components/common/Footer.jsx';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const HomePageContainer = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100vw`,
    minHeight: `100vh`,
    justifyContent: `flex-start`,
    alignItems: `flex-start`,
    padding: `0px`,
    margin: `0px`,
    boxSizing: `border-box`,
    overflow: `hidden`,
    gap: `0px`,
    '@media (max-width: 768px)': {
        overflow: `visible`,
    },
});

// Hero section container
const HeroSection = styled("div")({
    backgroundImage: `url(${PathToJungleImage})`,
    backgroundPosition: `center`,
    backgroundSize: `cover`,
    backgroundRepeat: `no-repeat`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `flex-start`,
    alignItems: `flex-start`,
    padding: `0px`,
    boxSizing: `border-box`,
    width: `100%`,
    height: `100vh`,
    overflow: `hidden`,
    '@media (max-width: 768px)': {
        height: `100vh`,
        backgroundPosition: `center center`,
    },
    '@media (max-width: 480px)': {
        height: `100vh`,
        backgroundPosition: `30% center`,
    },
});

// Hero content positioning
const HeroContent = styled("div")({
    position: `absolute`,
    right: `8%`,
    bottom: `15%`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `flex-end`,
    textAlign: `right`,
    maxWidth: `400px`,
    '@media (max-width: 1200px)': {
        right: `5%`,
        bottom: `12%`,
        maxWidth: `350px`,
    },
    '@media (max-width: 768px)': {
        right: `5%`,
        bottom: `20%`,
        maxWidth: `300px`,
        alignItems: `center`,
        textAlign: `center`,
        left: `5%`,
        width: `90%`,
    },
    '@media (max-width: 480px)': {
        right: `5%`,
        bottom: `25%`,
        maxWidth: `280px`,
        left: `5%`,
        width: `90%`,
    },
});

const YourImage = styled('img')({
    width: 'auto',
    height: '140px',
    marginBottom: '5px',
    display: 'block',
    '@media (max-width: 768px)': {
        height: '100px',
    },
    '@media (max-width: 480px)': {
        height: '80px',
    },
});

const HeroTitle = styled("div")({
    color: `#ffe8a1e6`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontWeight: `400`,
    fontSize: `32px`,
    lineHeight: `32px`,
    letterSpacing: `0.56px`,
    marginBottom: `20px`,
    textShadow: `2px 2px 4px rgba(0, 0, 0, 0.5)`,
    '@media (max-width: 1200px)': {
        fontSize: `28px`,
        lineHeight: `28px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `24px`,
        lineHeight: `24px`,
        marginBottom: `15px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
        lineHeight: `20px`,
        marginBottom: `10px`,
        letterSpacing: `0.3px`,
    },
});

const HeroSubtitle = styled("div")({
    color: `#ffe8a1`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `500`,
    fontSize: `16px`,
    lineHeight: `20px`,
    letterSpacing: `0.56px`,
    textShadow: `1px 1px 2px rgba(0, 0, 0, 0.5)`,
    '@media (max-width: 768px)': {
        fontSize: `14px`,
        lineHeight: `18px`,
        letterSpacing: `0.4px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `12px`,
        lineHeight: `16px`,
        letterSpacing: `0.3px`,
    },
});

// Wild finds you section
const WildFindsYouSection = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `5px`,
    boxSizing: `border-box`,
    width: `100%`,
    minHeight: `100%`,
    background: `linear-gradient(90deg, rgba(109, 115, 83, 1) 0%, rgba(157, 166, 120, 1) 50%, rgba(109, 115, 83, 1) 100%)`,
    '@media (max-width: 768px)': {
        padding: `30px 15px`,
        minHeight: `400px`,
    },
    '@media (max-width: 480px)': {
        padding: `25px 10px`,
        minHeight: `350px`,
    },
});

const WildTitle = styled("div")({
    textAlign: `center`,
    color: `rgba(30, 45, 39, 1)`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontWeight: `700`,
    fontSize: `64px`,
    letterSpacing: `2px`,
    textTransform: `uppercase`,
    '@media (max-width: 1200px)': {
        fontSize: `54px`,
        letterSpacing: `1.5px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `36px`,
        letterSpacing: `1px`,
        marginBottom: `15px`,
        lineHeight: `1.2`,
    },
    '@media (max-width: 480px)': {
        fontSize: `24px`,
        letterSpacing: `0.5px`,
        marginBottom: `10px`,
        lineHeight: `1.3`,
    },
});

const WildSubtitle = styled("div")({
    textAlign: `center`,
    color: `rgba(30, 45, 39, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `18px`,
    lineHeight: `1`,
    letterSpacing: `1px`,
    textTransform: `uppercase`,
    '@media (max-width: 768px)': {
        fontSize: `14px`,
        letterSpacing: `0.5px`,
        lineHeight: `1.5`,
        marginBottom: `20px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `11px`,
        letterSpacing: `0.3px`,
        lineHeight: `1.6`,
        marginBottom: `15px`,
    },
});

// Animal banner
const AnimalBannerContainer = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `150px`,
    overflow: `hidden`,
    backgroundColor: `transparent`,
    display: `flex`,
    alignItems: `center`,
    '@media (max-width: 768px)': {
        height: `150px`,
    },
    '@media (max-width: 480px)': {
        height: `120px`,
    },
});

const AnimalBannerTrack = styled("div")({
    display: `flex`,
    alignItems: `center`,
    whiteSpace: `nowrap`,
    animation: `scrollBanner 30s linear infinite`,
    willChange: 'transform',
    '& img': {
        flexShrink: 0,
    },
    '@keyframes scrollBanner': {
        '0%': { transform: `translateX(0)` },
        '100%': { transform: `translateX(-50%)` },
    },
});

const AnimalBannerImage = styled("img")({
    width: `180px`,
    height: `120px`,
    objectFit: `cover`,
    marginRight: `15px`,
    flexShrink: 0,
    transition: `transform 0.3s ease`,
    '&:hover': { transform: `scale(1.05)` },
    '@media (max-width: 768px)': {
        width: `135px`,
        height: `90px`,
        marginRight: `12px`,
    },
    '@media (max-width: 480px)': {
        width: `108px`,
        height: `72px`,
        marginRight: `10px`,
    },
});

const VisitInfo = styled("div")({
    textAlign: `center`,
    color: `rgba(30, 45, 39, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `18px`,
    letterSpacing: `1px`,
    textTransform: `uppercase`,
    '@media (max-width: 768px)': {
        fontSize: `14px`,
        letterSpacing: `0.5px`,
        marginTop: `20px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `11px`,
        letterSpacing: `0.3px`,
        marginTop: `15px`,
    },
});

// Ahoy section
const AhoySection = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `0px`,
    boxSizing: `border-box`,
    width: `100%`,
    height: `100vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    '@media (max-width: 768px)': {
        height: `50vh`,
        padding: `20px`,
    },
    '@media (max-width: 480px)': {
        height: `40vh`,
        padding: `15px`,
    },
});

const AhoyTitle = styled("div")({
    textAlign: `center`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontWeight: `700`,
    fontSize: `80px`,
    lineHeight: `1.1`,
    letterSpacing: `3px`,
    textTransform: `uppercase`,
    textShadow: `3px 3px 6px rgba(0, 0, 0, 0.3)`,
    '@media (max-width: 1200px)': {
        fontSize: `64px`,
        letterSpacing: `2px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `48px`,
        letterSpacing: `1.5px`,
        lineHeight: `1.2`,
    },
    '@media (max-width: 480px)': {
        fontSize: `32px`,
        letterSpacing: `1px`,
        lineHeight: `1.3`,
    },
});

// Desktop sections following Figma structure
const Desktop3 = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `90vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `visible`,
    padding: `0 20px`,
    boxSizing: `border-box`,
    '@media (max-width: 1200px)': {
        height: `100vh`,
        padding: `0 15px`,
    },
    '@media (max-width: 768px)': {
        height: `80vh`,
        padding: `0 10px`,
    },
    '@media (max-width: 480px)': {
        height: `70vh`,
        padding: `0 5px`,
    },
});

const Desktop4 = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `100vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `visible`,
    padding: `0 20px`,
    boxSizing: `border-box`,
    '@media (max-width: 1200px)': {
        height: `100vh`,
        padding: `0 15px`,
    },
    '@media (max-width: 768px)': {
        height: `80vh`,
        padding: `0 10px`,
    },
    '@media (max-width: 480px)': {
        height: `70vh`,
        padding: `0 5px`,
    },
});

const Desktop5 = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `100vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `visible`,
    padding: `0 20px`,
    boxSizing: `border-box`,
    '@media (max-width: 1200px)': {
        height: `100vh`,
        padding: `0 15px`,
    },
    '@media (max-width: 768px)': {
        height: `80vh`,
        padding: `0 10px`,
    },
    '@media (max-width: 480px)': {
        height: `70vh`,
        padding: `0 5px`,
    },
});

const Desktop6 = styled("div")({
    position: `relative`,
    width: `100%`,
    minHeight: `110vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `visible`,
    padding: `0 20px`,
    boxSizing: `border-box`,
    '@media (max-width: 1240px)': {
        minHeight: `120vh`,
        padding: `0 15px`,
    },
    '@media (max-width: 1024px)': {
        minHeight: `130vh`,
        padding: `0 15px`,
    },
    '@media (max-width: 900px)': {
        minHeight: `140vh`,
        padding: `0 12px`,
    },
    '@media (max-width: 768px)': {
        minHeight: `100vh`,
        padding: `0 10px`,
    },
    '@media (max-width: 480px)': {
        minHeight: `70vh`,
        padding: `0 5px`,
    },
});

const ResourcesSecondPage = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `50vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `visible`,
    '@media (max-width: 768px)': {
        height: `30vh`,
    },
    '@media (max-width: 480px)': {
        height: `20vh`,
    },
});

// Section text styling
const Resources1 = styled("div")({
    position: `absolute`,
    left: `calc(8% + 40px)`,
    top: `110px`,
    color: `rgba(205, 217, 157, 0.15)`,
    fontFamily: `"Helvetica Compressed", sans-serif`,
    fontWeight: `700`,
    fontSize: `200px`,
    lineHeight: `280px`,
    letterSpacing: `5px`,
    zIndex: 1,
    userSelect: `none`,
    pointerEvents: `none`,
    '@media (max-width: 1200px)': {
        fontSize: `160px`,
        lineHeight: `220px`,
        left: `calc(5% + 30px)`,
    },
    '@media (max-width: 768px)': {
        fontSize: `80px`,
        lineHeight: `120px`,
        left: `20px`,
        top: `50px`,
        letterSpacing: `3px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `50px`,
        lineHeight: `70px`,
        left: `10px`,
        top: `30px`,
        letterSpacing: `2px`,
    },
});

const Media1 = styled("div")({
    position: `absolute`,
    right: `calc(8% - 25px)`,
    top: `40px`,
    color: `rgba(205, 217, 157, 0.15)`,
    fontFamily: `"Helvetica Compressed", sans-serif`,
    fontWeight: `700`,
    fontSize: `200px`,
    lineHeight: `340px`,
    letterSpacing: `5px`,
    textAlign: `right`,
    zIndex: 1,
    userSelect: `none`,
    pointerEvents: `none`,
    '@media (max-width: 1200px)': {
        fontSize: `160px`,
        lineHeight: `280px`,
        right: `calc(5% - 5px)`,
    },
    '@media (max-width: 768px)': {
        fontSize: `80px`,
        lineHeight: `120px`,
        right: `20px`,
        top: `20px`,
        letterSpacing: `3px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `50px`,
        lineHeight: `70px`,
        right: `10px`,
        top: `10px`,
        letterSpacing: `2px`,
    },
});

const Community1 = styled("div")({
    position: `absolute`,
    left: `calc(8% + 40px)`,
    top: `20px`,
    color: `rgba(205, 217, 157, 0.15)`,
    fontFamily: `"Helvetica Compressed", sans-serif`,
    fontWeight: `700`,
    fontSize: `200px`,
    lineHeight: `280px`,
    letterSpacing: `5px`,
    zIndex: 1,
    userSelect: `none`,
    pointerEvents: `none`,
    '@media (max-width: 1200px)': {
        fontSize: `160px`,
        lineHeight: `220px`,
        left: `calc(5% + 30px)`,
    },
    '@media (max-width: 768px)': {
        fontSize: `80px`,
        lineHeight: `120px`,
        left: `20px`,
        top: `10px`,
        letterSpacing: `3px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `50px`,
        lineHeight: `70px`,
        left: `10px`,
        top: `5px`,
        letterSpacing: `2px`,
    },
});

const Quizzes = styled("div")({
    position: `absolute`,
    right: `calc(8% - 60px)`,
    top: `40px`,
    color: `rgba(205, 217, 157, 0.15)`,
    fontFamily: `"Helvetica Compressed", sans-serif`,
    fontWeight: `700`,
    fontSize: `170px`,
    lineHeight: `340px`,
    letterSpacing: `5px`,
    textAlign: `right`,
    zIndex: 1,
    userSelect: `none`,
    pointerEvents: `none`,
    '@media (max-width: 1200px)': {
        fontSize: `140px`,
        lineHeight: `280px`,
        right: `calc(5% - 30px)`,
    },
    '@media (max-width: 768px)': {
        fontSize: `80px`,
        lineHeight: `160px`,
        right: `20px`,
        top: `20px`,
        letterSpacing: `3px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `50px`,
        lineHeight: `100px`,
        right: `10px`,
        top: `10px`,
        letterSpacing: `2px`,
    },
});

// Content text blocks
const FromWildCaseStudiesA = styled("div")({
    position: `absolute`,
    left: `calc(8% + 40px)`,
    top: `350px`,
    width: `381px`,
    color: `#ffe8a1`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `500`,
    fontSize: `20px`,
    lineHeight: `28px`,
    letterSpacing: `0.56px`,
    zIndex: 10,
    '@media (max-width: 1200px)': {
        left: `calc(5% + 30px)`,
        width: `350px`,
        fontSize: `18px`,
        lineHeight: `26px`,
    },
    '@media (max-width: 768px)': {
        position: `relative`,
        left: `auto`,
        top: `auto`,
        width: `100%`,
        maxWidth: `90%`,
        margin: `200px auto 0 auto`,
        textAlign: `left`,
        padding: `0 20px`,
        fontSize: `16px`,
        lineHeight: `24px`,
    },
    '@media (max-width: 480px)': {
        margin: `150px auto 0 auto`,
        padding: `0 10px`,
        fontSize: `14px`,
        lineHeight: `22px`,
    },
});

const AsYouExploreTheTerra = styled("div")({
    position: `absolute`,
    right: `calc(8% + 50px)`,
    top: `315px`,
    width: `381px`,
    color: `#ffe8a1`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `500`,
    fontSize: `20px`,
    lineHeight: `28px`,
    letterSpacing: `0.56px`,
    zIndex: 10,
    '@media (max-width: 1200px)': {
        right: `calc(5% + 30px)`,
        width: `350px`,
        fontSize: `18px`,
        lineHeight: `26px`,
    },
    '@media (max-width: 768px)': {
        position: `relative`,
        right: `auto`,
        top: `auto`,
        width: `100%`,
        maxWidth: `90%`,
        margin: `200px auto 0 auto`,
        textAlign: `left`,
        padding: `0 20px`,
        fontSize: `16px`,
        lineHeight: `24px`,
    },
    '@media (max-width: 480px)': {
        margin: `150px auto 0 auto`,
        padding: `0 10px`,
        fontSize: `14px`,
        lineHeight: `22px`,
    },
});

const EverySafariTellsADif = styled("div")({
    position: `absolute`,
    left: `calc(8% + 40px)`,
    top: `260px`,
    width: `381px`,
    color: `#ffe8a1`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `500`,
    fontSize: `20px`,
    lineHeight: `28px`,
    letterSpacing: `0.56px`,
    zIndex: 10,
    '@media (max-width: 1200px)': {
        left: `calc(5% + 30px)`,
        width: `350px`,
        fontSize: `18px`,
        lineHeight: `26px`,
    },
    '@media (max-width: 768px)': {
        position: `relative`,
        left: `auto`,
        top: `auto`,
        width: `100%`,
        maxWidth: `90%`,
        margin: `200px auto 0 auto`,
        textAlign: `left`,
        padding: `0 20px`,
        fontSize: `16px`,
        lineHeight: `24px`,
    },
    '@media (max-width: 480px)': {
        margin: `150px auto 0 auto`,
        padding: `0 10px`,
        fontSize: `14px`,
        lineHeight: `22px`,
    },
});

const EverySafariTellsADif1 = styled("div")({
    position: `absolute`,
    right: `calc(8% + 50px)`,
    top: `310px`,
    width: `381px`,
    color: `#ffe8a1`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `500`,
    fontSize: `20px`,
    lineHeight: `28px`,
    letterSpacing: `0.56px`,
    zIndex: 10,
    '@media (max-width: 1200px)': {
        right: `calc(5% + 30px)`,
        width: `350px`,
        fontSize: `18px`,
        lineHeight: `26px`,
    },
    '@media (max-width: 768px)': {
        position: `relative`,
        right: `auto`,
        top: `auto`,
        width: `100%`,
        maxWidth: `90%`,
        margin: `200px auto 0 auto`,
        textAlign: `left`,
        padding: `0 20px`,
        fontSize: `16px`,
        lineHeight: `24px`,
    },
    '@media (max-width: 480px)': {
        margin: `150px auto 0 auto`,
        padding: `0 10px`,
        fontSize: `14px`,
        lineHeight: `22px`,
    },
});

// "CLICK TO EXPLORE" links for each section
const ResourcesClickToExplore = styled(Link)({
    position: `absolute`,
    left: `calc(8% + 40px)`,
    top: `620px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `2px`,
    textTransform: `uppercase`,
    cursor: `pointer`,
    textDecoration: 'none',
    paddingBottom: `5px`,
    display: 'inline-block',
    zIndex: 10,
    transition: `all 0.3s ease`,
    '&::after': {
        content: '""',
        position: `absolute`,
        bottom: `0`,
        left: `0`,
        width: `100%`,
        height: `2px`,
        backgroundColor: `rgba(255, 232, 161, 1)`,
    },
    '&:hover': { opacity: 0.8 },
    '@media (max-width: 1200px)': {
        left: `calc(5% + 30px)`,
        fontSize: `15px`,
        letterSpacing: `1.5px`,
    },
    '@media (max-width: 768px)': {
        position: `relative`,
        left: `auto`,
        top: `auto`,
        display: `block`,
        textAlign: `center`,
        margin: `40px auto 0 auto`,
        width: `fit-content`,
        fontSize: `14px`,
        letterSpacing: `1px`,
    },
    '@media (max-width: 480px)': {
        margin: `30px auto 0 auto`,
        fontSize: `12px`,
        letterSpacing: `0.5px`,
    },
});

const MediaClickToExplore = styled(Link)({
    position: `absolute`,
    right: `calc(8% + 240px)`,
    top: `430px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `2px`,
    textTransform: `uppercase`,
    cursor: `pointer`,
    textDecoration: 'none',
    paddingBottom: `5px`,
    display: 'inline-block',
    zIndex: 10,
    transition: `all 0.3s ease`,
    '&::after': {
        content: '""',
        position: `absolute`,
        bottom: `0`,
        left: `0`,
        width: `100%`,
        height: `2px`,
        backgroundColor: `rgba(255, 232, 161, 1)`,
    },
    '&:hover': { opacity: 0.8 },
    '@media (max-width: 1200px)': {
        right: `calc(5% + 150px)`,
        fontSize: `15px`,
        letterSpacing: `1.5px`,
    },
    '@media (max-width: 768px)': {
        position: `relative`,
        right: `auto`,
        top: `auto`,
        display: `block`,
        textAlign: `center`,
        margin: `40px auto 0 auto`,
        width: `fit-content`,
        fontSize: `14px`,
        letterSpacing: `1px`,
    },
    '@media (max-width: 480px)': {
        margin: `30px auto 0 auto`,
        fontSize: `12px`,
        letterSpacing: `0.5px`,
    },
});

const CommunityClickToExplore = styled(Link)({
    position: `absolute`,
    left: `calc(8% + 40px)`,
    top: `450px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `2px`,
    textTransform: `uppercase`,
    cursor: `pointer`,
    textDecoration: 'none',
    paddingBottom: `5px`,
    display: 'inline-block',
    zIndex: 10,
    transition: `all 0.3s ease`,
    '&::after': {
        content: '""',
        position: `absolute`,
        bottom: `0`,
        left: `0`,
        width: `100%`,
        height: `2px`,
        backgroundColor: `rgba(255, 232, 161, 1)`,
    },
    '&:hover': { opacity: 0.8 },
    '@media (max-width: 1200px)': {
        left: `calc(5% + 30px)`,
        fontSize: `15px`,
        letterSpacing: `1.5px`,
    },
    '@media (max-width: 768px)': {
        position: `relative`,
        left: `auto`,
        top: `auto`,
        display: `block`,
        textAlign: `center`,
        margin: `40px auto 0 auto`,
        width: `fit-content`,
        fontSize: `14px`,
        letterSpacing: `1px`,
    },
    '@media (max-width: 480px)': {
        margin: `30px auto 0 auto`,
        fontSize: `12px`,
        letterSpacing: `0.5px`,
    },
});

const QuizClickToExplore = styled(Link)({
    position: `absolute`,
    right: `calc(8% + 240px)`,
    top: `500px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `2px`,
    textTransform: `uppercase`,
    cursor: `pointer`,
    textDecoration: 'none',
    paddingBottom: `5px`,
    display: 'inline-block',
    zIndex: 10,
    transition: `all 0.3s ease`,
    '&::after': {
        content: '""',
        position: `absolute`,
        bottom: `0`,
        left: `0`,
        width: `100%`,
        height: `2px`,
        backgroundColor: `rgba(255, 232, 161, 1)`,
    },
    '&:hover': { opacity: 0.8 },
    '@media (max-width: 1200px)': {
        right: `calc(5% + 30px)`,
        fontSize: `15px`,
        letterSpacing: `1.5px`,
    },
    '@media (max-width: 768px)': {
        position: `relative`,
        right: `auto`,
        top: `auto`,
        display: `block`,
        textAlign: `center`,
        margin: `40px auto 0 auto`,
        width: `fit-content`,
        fontSize: `14px`,
        letterSpacing: `1px`,
    },
    '@media (max-width: 480px)': {
        margin: `30px auto 0 auto`,
        fontSize: `12px`,
        letterSpacing: `0.5px`,
    },
});

// Image positioning
const PositionedImage = styled("img")(({ position, width, height, bottom, right, left, responsive }) => ({
    position: `absolute`,
    ...(right && { right }),
    ...(left && { left }),
    ...(bottom && { bottom }),
    width: width || 'auto',
    height: height || 'auto',
    zIndex: 3,
    ...(responsive && {
        '@media (max-width: 1200px)': {
            width: width ? `calc(${width} * 0.8)` : 'auto',
        },
        '@media (max-width: 768px)': {
            width: width ? `calc(${width} * 0.6)` : 'auto',
            bottom: bottom ? `calc(${bottom} * 0.5)` : 'auto',
            left: left === '0px' ? '10px' : left,
        },
        '@media (max-width: 480px)': {
            width: width ? `calc(${width} * 0.4)` : 'auto',
            bottom: bottom ? `calc(${bottom} * 0.3)` : 'auto',
            left: left === '0px' ? '5px' : left,
        },
    }),
}));



function HomePage() {
    const heroRef = useRef(null);
    const wildRef = useRef(null);
    const ahoyRef = useRef(null);
    const resourcesRef = useRef(null);
    const mediaRef = useRef(null);
    const communityRef = useRef(null);
    const quizRef = useRef(null);
    const footerRef = useRef(null);

    const [isMobile, setIsMobile] = useState(false);



    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Simplified animations
        const masterTl = gsap.timeline();

        // Hero animation
        masterTl.fromTo(heroRef.current?.querySelector('.hero-content'),
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
        );

        // Simple scroll animations for each section
        const sections = [
            { ref: wildRef, selector: '.wild-title' },
            { ref: ahoyRef, selector: '.ahoy-title' },
            { ref: resourcesRef, selector: '.main-anim' },
            { ref: mediaRef, selector: '.main-anim' },
            { ref: communityRef, selector: '.main-anim' },
            { ref: quizRef, selector: '.main-anim' },
            { ref: footerRef, selector: '.footer-content' }
        ];

        sections.forEach(({ ref, selector }) => {
            if (ref.current) {
                if (isMobile) {
                    // Mobile: fade in/out on scroll
                    ScrollTrigger.create({
                        trigger: ref.current,
                        start: "top 80%",
                        end: "bottom 20%",
                        onEnter: () => {
                            gsap.fromTo(ref.current.querySelector(selector),
                                { y: 100, opacity: 0, scale: 0.8 },
                                { y: 0, opacity: 1, scale: 1, duration: 2, ease: "power3.out" }
                            );
                        },
                        onLeave: () => {
                            gsap.to(ref.current.querySelector(selector),
                                { y: -100, opacity: 0, scale: 0.8, duration: 2, ease: "power3.out" }
                            );
                        },
                        onEnterBack: () => {
                            gsap.to(ref.current.querySelector(selector),
                                { y: 0, opacity: 1, scale: 1, duration: 2, ease: "power3.out" }
                            );
                        },
                        onLeaveBack: () => {
                            gsap.to(ref.current.querySelector(selector),
                                { y: 100, opacity: 0, scale: 0.8, duration: 2, ease: "power3.out" }
                            );
                        }
                    });
                } else {
                    // Desktop: original fade in once
                    ScrollTrigger.create({
                        trigger: ref.current,
                        start: "top 80%",
                        onEnter: () => {
                            gsap.fromTo(ref.current.querySelector(selector),
                                { y: 50, opacity: 0 },
                                { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
                            );
                        },
                        once: true
                    });
                }
            }
        });

        return () => {
            window.removeEventListener('resize', checkMobile);
            ScrollTrigger.getAll().forEach(t => t.kill());
            masterTl.kill();
        };
    }, []);

    return (
        <HomePageContainer>
            <style dangerouslySetInnerHTML={{__html: 'html, body { overflow-x: hidden; }'}} />
            { !isMobile && <JeepAnimation /> }

            {/* Hero Section */}
            <HeroSection ref={heroRef}>
                <Header />
                <HeroContent className="hero-content">
                    <YourImage src={YourSvgImage} alt="YOUR" />
                    <HeroTitle>SAFARI<br />STARTS<br />HERE</HeroTitle>
                    <HeroSubtitle>
                        We use AI and experience to make every wildlife sighting count.
                    </HeroSubtitle>
                </HeroContent>
            </HeroSection>

            {/* Wild Finds You Section */}
            <WildFindsYouSection ref={wildRef}>
                <WildTitle className="wild-title">WHERE THE WILD FINDS YOU</WildTitle>
                <WildSubtitle className="wild-subtitle">AI-POWERED SIGHTINGS. SAFARI . ADVENTURE. TRAINED GUIDES</WildSubtitle>

                <AnimalBannerContainer>
                    <AnimalBannerTrack>
                        {/* Repeat animal images for smooth scrolling */}
                        {[...Array(6)].map((_, setIndex) => (
                            <React.Fragment key={setIndex}>
                                <AnimalBannerImage src={AnimalLionImage} alt="Lion" />
                                <AnimalBannerImage src={AnimalGiraffeImage} alt="Giraffe" />
                                <AnimalBannerImage src={AnimalDogImage} alt="Wild Dog" />
                                <AnimalBannerImage src={AnimalZebraImage} alt="Zebra" />
                                <AnimalBannerImage src={AnimalElephantImage} alt="Elephant" />
                            </React.Fragment>
                        ))}
                    </AnimalBannerTrack>
                </AnimalBannerContainer>
                <VisitInfo>VISIT JUNGLORE.COM FOR MORE INFO.</VisitInfo>
            </WildFindsYouSection>

            {/* Ahoy Section */}
            <AhoySection ref={ahoyRef}>
                <AhoyTitle className="ahoy-title">AHOY,<br />PASSENGERS!</AhoyTitle>
            </AhoySection>

            {/* Resources Section */}
            <Desktop3 ref={resourcesRef}>
                <Resources1>RESOURCES</Resources1>
                <FromWildCaseStudiesA className="main-anim">
                    From wild case studies and rare fact sightings to the elusive truth behind myths, daily tracks, and conservation tales.<br /><br />
                    We've packed this jeep with all the knowledge you'll need. Keep your eyes peeled, you never know what gem you'll spot next in the wild!
                </FromWildCaseStudiesA>
                <ResourcesClickToExplore to="/resources">CLICK TO EXPLORE •</ResourcesClickToExplore>
                <PositionedImage
                    src={Desktop3TreeBranch2Image}
                    right="0px"
                    bottom="-230px"
                    width="580px"
                    responsive={true}
                    alt=""
                />
            </Desktop3>

            {/* Resources Second Page */}
            <ResourcesSecondPage>
                <PositionedImage
                    src={Desktop3RectangleImage}
                    right="0px"
                    bottom="-320px"
                    width="650px"
                    responsive={true}
                    alt="Resources Rectangle"
                />
            </ResourcesSecondPage>

            {/* Media Section */}
            <Desktop4 ref={mediaRef}>
                <Media1>MEDIA</Media1>
                <AsYouExploreTheTerra className="main-anim">
                    As you explore the terrain in your jeep, unlock a deeper layer of connection with nature through this curated media collection.
                </AsYouExploreTheTerra>
                <MediaClickToExplore to="/media">CLICK TO EXPLORE •</MediaClickToExplore>
                <PositionedImage
                    src={ForestTree2Image}
                    left="-15px"
                    bottom="-80px"
                    width="620px"
                    responsive={true}
                    alt=""
                />
            </Desktop4>

            {/* Community Section */}
            <Desktop5 ref={communityRef}>
                <Community1>COMMUNITY</Community1>
                <EverySafariTellsADif className="main-anim">
                    Every safari tells a different story — now it's time to share yours. This space is for passengers like you to exchange sightings, post snapshots, ask questions, and connect with fellow nature lovers.
                </EverySafariTellsADif>
                <CommunityClickToExplore to="/community">CLICK TO EXPLORE •</CommunityClickToExplore>
                <PositionedImage src={AnimalDeerImage} left="40px" bottom="-150px" width="180px" responsive={true} alt="" />
                <PositionedImage src={Tree1Image} right="0px" bottom="-150px" width="400px" responsive={true} alt="" />
            </Desktop5>

            {/* Quiz Section */}
            <Desktop6 ref={quizRef}>
                <Quizzes>QUIZZES</Quizzes>
                <EverySafariTellsADif1 className="quiz-content main-anim">
                    Every safari tells a different story — now it's time to share yours. This space is for passengers like you to exchange sightings, post snapshots, ask questions, and connect with fellow nature lovers.
                </EverySafariTellsADif1>
                <QuizClickToExplore to="/quizzes">CLICK TO EXPLORE •</QuizClickToExplore>

                {/* Left side plants image */}
                <PositionedImage
                    src={PlantsImage}
                    left="0px"
                    bottom="0px"
                    width="400px"
                    responsive={true}
                    alt="Tropical plants"
                />
            </Desktop6>

            {/* Footer */}
            <Footer ref={footerRef} />

            {/* Floating FaunaBot - Available throughout the page */}
            <FaunaBot />
        </HomePageContainer>
    );
}

export default HomePage;