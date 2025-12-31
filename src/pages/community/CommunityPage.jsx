import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import CreatePostModal from '../../components/community/CreatePostModal';
import discussionService from '../../services/discussionService';
import videoService from '../../services/videoService';
import authService from '../../services/auth';

// Import images
import CommunityPageImage from '../../assets/images/pages/CommunityPage.png';
import CommunityForumImage from '../../assets/images/pages/Community_Forum.png';
import Tv1Image from '../../assets/images/tv1.png';
import Tv2Image from '../../assets/images/tv2.png';
import Tv3Image from '../../assets/images/tv3.png';
import RectangleImage from '../../assets/images/media/Rectangle.png';
import Rectangle1Image from '../../assets/images/media/download-vines-leaves-green-royalty-free-stock-illustration-image-4.png';
import Live1Image from '../../assets/images/community/live1.jpg';
import Live2Image from '../../assets/images/community/live2.jpg';
import Live3Image from '../../assets/images/community/live3.jpg';
import PodcastAvatar from '../../assets/images/media/podcastcarousal_1.png';
import AnimalBirdsImage from '../../assets/images/community/animal_birds.png';
import AnimalMammalImage from '../../assets/images/community/animal_mammal.png';
import AnimalMammalsImage from '../../assets/images/community/animal_mammals.png';
import PlantsAndBotanyImage from '../../assets/images/community/plantsandbotany.png';
import CommunitySvg from '../../assets/icons/COMMUNITY.svg';
import DiscussionIcon from '../../assets/icons/discussionIcon.svg';
import CommentsIcon from '../../assets/icons/commentsIcon.svg';
import TimeIcon from '../../assets/icons/timeIcon.svg';
import watchedIcon from '../../assets/icons/watchedIcon.svg';
import deleteIcon from '../../assets/icons/deleteIcon.svg';
import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import { API_BASE_URL } from '../../services/api';

const CommunityContainer = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100%`,
    minHeig : `100vh`,
    justifyContent: `flex-start`,
    alignItems: `flex-start`,
    padding: `0px`,
    margin: `0px`,
    boxSizing: `border-box`,
    overflow: `hidden`,
});

// Hero Section
const HeroSection = styled("div")({
    backgroundImage: `url(${CommunityPageImage})`,
    backgroundPosition: `center`,
    backgroundSize: `cover`,
    backgroundRepeat: `no-repeat`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `120px 40px 0px`,
    margin: `0px`,
    boxSizing: `border-box`,
    width: `100%`,
    height: `100vh`,
    overflow: `hidden`,
});

// TV Carousel Section (Desktop 7)
const TVCarouselSection = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `0px`,
    margin: `0px`,
    boxSizing: `border-box`,
    width: `100%`,
    height: `100vh`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `hidden`,
});

const CarouselContainer = styled("div")({
    position: `relative`,
    width: `100%`,
    maxWidth: `1440px`,
    height: `600px`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    '@media (max-width: 768px)': {
        height: `400px`,
        padding: `0 20px`,
    },
});

const TVImage = styled("img")(({ isActive, position }) => ({
    position: `absolute`,
    transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    cursor: `pointer`,
    borderRadius: `15px`,
    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`,
    '&:hover': {
        transform: isActive ?
            `translate(-50%, -50%) scale(1.02)` :
            position === 'left' ?
                `translate(-50%, -50%) scale(0.87)` :
                `translate(50%, -50%) scale(0.87)`,
        boxShadow: `0 25px 50px rgba(255, 232, 161, 0.2)`,
    },
    ...(isActive ? {
        // Center TV (active)
        width: `450px`,
        height: `480px`,
        left: `50%`,
        top: `50%`,
        transform: `translate(-50%, -50%) scale(1)`,
        zIndex: 5,
        opacity: 1,
        '@media (max-width: 768px)': {
            width: `280px`,
            height: `300px`,
        },
        '@media (max-width: 480px)': {
            width: `220px`,
            height: `235px`,
        },
    } : position === 'left' ? {
        // Left TV
        width: `300px`,
        height: `320px`,
        left: `35%`,
        top: `50%`,
        transform: `translate(-50%, -50%) scale(0.85)`,
        zIndex: 2,
        opacity: 0.6,
        '@media (max-width: 768px)': {
            width: `180px`,
            height: `192px`,
            left: `30%`,
        },
        '@media (max-width: 480px)': {
            width: `140px`,
            height: `150px`,
            left: `25%`,
        },
    } : {
        // Right TV
        width: `300px`,
        height: `320px`,
        right: `35%`,
        top: `50%`,
        transform: `translate(50%, -50%) scale(0.85)`,
        zIndex: 2,
        opacity: 0.6,
        '@media (max-width: 768px)': {
            width: `180px`,
            height: `192px`,
            right: `30%`,
        },
        '@media (max-width: 480px)': {
            width: `140px`,
            height: `150px`,
            right: `25%`,
        },
    }),
}));

const TVFrameImg = styled("img")({
    width: `100%`,
    height: `100%`,
    objectFit: `cover`,
    display: `block`,
    borderRadius: `15px`,
});

// The actual thumbnail that appears inside the TV "screen" area
const ScreenImg = styled("img")(({ isActive }) => ({
    position: `absolute`,
    // these values position the screen area inside the TV frame; tweak if frames change
    width: isActive ? `66%` : `60%`,
    height: isActive ? `52%` : `48%`,
    left: `50%`,
    top: `46%`,
    transform: `translate(-50%, -50%)`,
    objectFit: `cover`,
    borderRadius: `8px`,
    zIndex: 6,
    boxShadow: `inset 0 2px 8px rgba(0,0,0,0.25)`,
    '@media (max-width: 768px)': {
        width: isActive ? `68%` : `62%`,
        height: isActive ? `56%` : `50%`,
    },
    '@media (max-width: 480px)': {
        width: `70%`,
        height: `56%`,
    },
}));
const CarouselTitle = styled("div")({
    textAlign: `center`,
    whiteSpace: `pre-wrap`,
    color: `rgba(255, 232, 161, 1)`,
    fontStyle: `italic`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `20px`,
    letterSpacing: `2px`,
    textTransform: `uppercase`,
    position: `absolute`,
    bottom: `80px`,
    left: `50%`,
    transform: `translateX(-50%)`,
    zIndex: 5,
    textShadow: `2px 2px 4px rgba(0, 0, 0, 0.5)`,
    '@media (max-width: 768px)': {
        fontSize: `16px`,
        bottom: `60px`,
        letterSpacing: `1px`,
    },
    '@media (max-width: 480px)': {
        bottom: `50px`,
        fontSize: `14px`,
    },
});

const CarouselDots = styled("div")({
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    gap: `15px`,
    position: `absolute`,
    bottom: `30px`,
    left: `50%`,
    transform: `translateX(-50%)`,
    zIndex: 5,
    '@media (max-width: 768px)': {
        bottom: `20px`,
        gap: `10px`,
    },
    '@media (max-width: 480px)': {
        bottom: `15px`,
        gap: `8px`,
    },
});

// Dot component removed - using reusable Button component instead

// Decorative Elements - Fixed to viewport corners
const DecorativeRectangle = styled("img")({
    position: `absolute`,

    zIndex: 1,
    '@media (max-width: 768px)': {
        opacity: 0.6,
    },
    '@media (max-width: 480px)': {
        opacity: 0.4,
    },
});

const BackgroundRectangle = styled(DecorativeRectangle)({
    width: `550px`,
    height: `380px`,
    right: `0px`,
    bottom: `0px`,
    transform: `scaleX(-1)`,
    '@media (max-width: 768px)': {
        width: `250px`,
        height: `200px`,
    },
    '@media (max-width: 480px)': {
        width: `200px`,
        height: `160px`,
    },
});

const SecondRectangleDecoration = styled(DecorativeRectangle)({
    width: `300px`,
    height: `200px`,
    left: `0px`,
    top: `0px`, // Absolute top-left corner of page
    transform: `scaleX(-1)`, // Mirror the image
    '@media (max-width: 768px)': {
        width: `250px`,
        height: `160px`,
    },
    '@media (max-width: 480px)': {
        width: `200px`,
        height: `130px`,
    },
});

const CommunityTitle = styled("img")({
    position: `absolute`,
    right: `15%`,
    top: `1%`,
    width: `300px`,
    height: `auto`,
    zIndex: 2,
    '@media (max-width: 768px)': {
        width: `250px`,
        left: `2%`,
        top: `1%`,
    },
    '@media (max-width: 480px)': {
        width: `200px`,
        left: `1%`,
        top: `1%`,
    },
});

// Navigation Arrows (Frame 27)
const NavigationContainer = styled("div")({
    position: `absolute`,
    top: `50%`,
    transform: `translateY(-50%)`,
    width: `100%`,
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    padding: `0 30px`,
    zIndex: 10,
    pointerEvents: `none`,
    '@media (max-width: 768px)': {
        padding: `0 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `0 15px`,
    },
});

// NavigationButton component removed - using reusable Button component instead



// Hero Image Component
const HeroImage = styled("img")({
    maxWidth: `80%`,
    maxHeight: `80%`,
    width: `auto`,
    height: `auto`,
    objectFit: `contain`,
    transform: `translateY(-30px)`,
    '@media (max-width: 768px)': {
        transform: `translateY(-20px)`,
    },
    '@media (max-width: 480px)': {
        transform: `translateY(-15px)`,
    },
});

// Hero Text Component - "A space for questions, conversations, and collective wisdom!" (Responsive)
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
        bottom: `5%`,
    },
    '@media (max-width: 480px)': {
        fontSize: `18px`,
        lineHeight: `28px`,
        letterSpacing: `0.2px`,
        bottom: `3%`,
    },
});

// Live on Junglore Section Components
const LiveSection = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `80px 40px`,
    boxSizing: `border-box`,
    width: `100%`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `hidden`,
    '@media (max-width: 1024px)': {
        padding: `70px 30px`,
    },
    '@media (max-width: 768px)': {
        padding: `60px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `40px 15px`,
    },
});

const LiveTitle = styled("div")({
    textAlign: `left`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `32px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    width: `100%`,
    maxWidth: `1200px`,
    margin: `0px 0px 60px 0px`,
    '@media (max-width: 768px)': {
        fontSize: `24px`,
        margin: `0px 0px 40px 0px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
        margin: `0px 0px 30px 0px`,
    },
});

const LiveCardsContainer = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `flex-start`,
    gap: `25px`,
    maxWidth: `1200px`,
    width: `100%`,
    '@media (max-width: 1024px)': {
        justifyContent: `center`,
        flexWrap: `wrap`,
        gap: `20px`,
    },
    '@media (max-width: 768px)': {
        flexDirection: `column`,
        alignItems: `center`,
        gap: `30px`,
    },
});

const LiveCard = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100%`,
    maxWidth: `376px`,
    minWidth: `300px`,
    flex: `1`,
    backgroundColor: `transparent`,
    borderRadius: `10px`,
    overflow: `visible`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        transform: `translateY(-5px)`,
        '& img': {
            transform: `scale(1.05)`,
        },
    },
    '@media (max-width: 1024px)': {
        maxWidth: `350px`,
        minWidth: `280px`,
    },
    '@media (max-width: 768px)': {
        maxWidth: `450px`,
        minWidth: `320px`,
        flex: `none`,
    },
    '@media (max-width: 480px)': {
        maxWidth: `100%`,
        minWidth: `280px`,
    },
});

const LiveVideo = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `234px`,
    borderRadius: `10px`,
    overflow: `hidden`,
    marginBottom: `15px`,
    '@media (max-width: 480px)': {
        height: `180px`,
    },
});

const LiveVideoImage = styled("img")({
    width: `100%`,
    height: `100%`,
    objectFit: `cover`,
    transition: `transform 0.3s ease`,
});

const LiveBadge = styled("div")({
    position: `absolute`,
    top: `15px`,
    left: `16px`,
    backgroundColor: `rgba(241, 63, 63, 1)`,
    borderRadius: `2px`,
    padding: `2px 6px`,
    color: `rgba(255, 255, 255, 1)`,
    fontStyle: `italic`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `8px`,
    letterSpacing: `0.37px`,
    lineHeight: `13px`,
    textTransform: `none`,
    zIndex: 3,
    '@media (max-width: 480px)': {
        top: `12px`,
        left: `12px`,
        fontSize: `7px`,
        padding: `2px 5px`,
    },
});

const ViewerCount = styled("div")({
    position: `absolute`,
    bottom: `16px`,
    left: `16px`,
    backgroundColor: `rgba(0, 0, 0, 0.5)`,
    borderRadius: `2px`,
    padding: `4px 8px`,
    color: `rgba(255, 255, 255, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `8px`,
    letterSpacing: `0.37px`,
    lineHeight: `13px`,
    textTransform: `none`,
    zIndex: 3,
    '@media (max-width: 480px)': {
        bottom: `12px`,
        left: `12px`,
        fontSize: `7px`,
        padding: `3px 6px`,
    },
});

const LiveInfo = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    padding: `0px 70px 0px 15px`,
    gap: `5px`,
    marginBottom: `15px`,
    '@media (max-width: 480px)': {
        padding: `0px 60px 0px 15px`,
    },
});

const LiveVideoTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    lineHeight: `1.3`,
    wordWrap: `break-word`,
    overflow: `hidden`,
    '@media (max-width: 768px)': {
        fontSize: `15px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const LiveChannel = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `12px`,
    letterSpacing: `0px`,
    textTransform: `uppercase`,
    lineHeight: `1.3`,
    opacity: 0.9,
    '@media (max-width: 480px)': {
        fontSize: `11px`,
    },
});

const LiveCategory = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `12px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    lineHeight: `1.3`,
    opacity: 0.8,
    '@media (max-width: 480px)': {
        fontSize: `11px`,
    },
});

const LiveTags = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    gap: `5px`,
    padding: `0px 15px`,
    marginBottom: `10px`,
    flexWrap: `wrap`,
    alignItems: `flex-start`,
    '@media (max-width: 480px)': {
        gap: `4px`,
    },
});

const LiveTag = styled("div")({
    backgroundColor: `rgba(68, 122, 101, 1)`,
    borderRadius: `34px`,
    padding: `4px 12px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `10px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    textAlign: `center`,
    lineHeight: `1.4`,
    whiteSpace: `nowrap`,
    flexShrink: 0,
    '@media (max-width: 480px)': {
        fontSize: `9px`,
        padding: `3px 10px`,
    },
});

const LiveAvatar = styled("img")({
    position: `absolute`,
    bottom: `55px`,
    right: `15px`,
    width: `49px`,
    height: `49px`,
    borderRadius: `50%`,
    objectFit: `cover`,
    border: `2px solid rgba(255, 232, 161, 0.3)`,
    zIndex: 2,
    '@media (max-width: 768px)': {
        width: `45px`,
        height: `45px`,
        bottom: `50px`,
    },
    '@media (max-width: 480px)': {
        width: `40px`,
        height: `40px`,
        bottom: `45px`,
        right: `10px`,
    },
});

const ShowMoreContainer = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    justifyContent: `center`,
    alignItems: `center`,
    width: `100%`,
    maxWidth: `1200px`,
    marginTop: `60px`,
    gap: `20px`,
    '@media (max-width: 768px)': {
        marginTop: `40px`,
        gap: `15px`,
    },
    '@media (max-width: 480px)': {
        marginTop: `30px`,
        gap: `10px`,
    },
});

const ShowMoreLine = styled("div")({
    border: `1px solid rgba(255, 232, 161, 1)`,
    height: `0px`,
    flex: `1`,
    '@media (max-width: 480px)': {
        display: `none`,
    },
});

// ShowMoreButton component removed - using reusable Button component instead

const ShowMoreText = styled("div")({
    textAlign: `center`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `12px`,
    letterSpacing: `0.56px`,
    lineHeight: `20px`,
    textTransform: `none`,
});

const ShowMoreArrow = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontSize: `16px`,
    fontWeight: `bold`,
    transform: `rotate(90deg)`,
});

const DeleteButton = styled("button")({
    background: `transparent`,
    border: `none`,
    cursor: `pointer`,
    padding: `4px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    transition: `all 0.3s ease`,
    opacity: 0.8,
    '&:hover': {
        opacity: 1,
        transform: `scale(1.1)`,
    },
});

const DeleteIconImg = styled("img")({
    width: `18px`,
    height: `18px`,
});

// Categories Section Components
const CategoriesSection = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `80px 40px 100px 40px`,
    boxSizing: `border-box`,
    width: `100%`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `hidden`,
    '@media (max-width: 1024px)': {
        padding: `70px 30px 80px 30px`,
    },
    '@media (max-width: 768px)': {
        padding: `100px 20px 80px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `120px 15px 60px 15px`,
    },
});

const CategoriesTitle = styled("div")({
    textAlign: `left`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `32px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    width: `100%`,
    maxWidth: `1200px`,
    margin: `0px 0px 60px 0px`,
    '@media (max-width: 768px)': {
        fontSize: `24px`,
        margin: `0px 0px 40px 0px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
        margin: `0px 0px 30px 0px`,
    },
});

const CategoriesSpan1 = styled("span")({
    color: `rgba(255, 232, 161, 1)`,
});

const CategoriesSpan2 = styled("span")({
    color: `rgba(205, 217, 157, 1)`,
});

const CategoriesCardsContainer = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    gap: `20px`,
    maxWidth: `1200px`,
    width: `100%`,
    overflowX: `auto`,
    scrollBehavior: `smooth`,
    paddingBottom: `10px`,
    '&::-webkit-scrollbar': {
        height: `8px`,
    },
    '&::-webkit-scrollbar-track': {
        background: `rgba(255, 232, 161, 0.1)`,
        borderRadius: `10px`,
    },
    '&::-webkit-scrollbar-thumb': {
        background: `rgba(255, 232, 161, 0.3)`,
        borderRadius: `10px`,
        '&:hover': {
            background: `rgba(255, 232, 161, 0.5)`,
        },
    },
    '@media (max-width: 768px)': {
        gap: `15px`,
    },
});

const CategoryCard = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `280px`,
    minWidth: `280px`,
    flexShrink: 0,
    backgroundColor: `transparent`,
    borderRadius: `10px`,
    overflow: `hidden`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        transform: `translateY(-5px)`,
        '& img': {
            transform: `scale(1.05)`,
        },
    },
    '@media (max-width: 768px)': {
        width: `260px`,
        minWidth: `260px`,
    },
    '@media (max-width: 480px)': {
        width: `240px`,
        minWidth: `240px`,
    },
});

const CategoryImage = styled("img")({
    width: `100%`,
    height: `355px`,
    objectFit: `cover`,
    borderRadius: `10px`,
    marginBottom: `15px`,
    transition: `transform 0.3s ease`,
    '@media (max-width: 768px)': {
        height: `300px`,
    },
    '@media (max-width: 480px)': {
        height: `250px`,
    },
});

const CategoryInfo = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    padding: `0px 5px`,
    gap: `5px`,
    marginBottom: `15px`,
});

const CategoryTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    lineHeight: `1.3`,
    wordWrap: `break-word`,
    '@media (max-width: 768px)': {
        fontSize: `15px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const CategoryViewers = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `12px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    lineHeight: `1.3`,
    opacity: 0.8,
    '@media (max-width: 480px)': {
        fontSize: `11px`,
    },
});

const CategoryTags = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    gap: `5px`,
    padding: `0px 5px`,
    marginBottom: `30px`,
    flexWrap: `wrap`,
    alignItems: `flex-start`,
    '@media (max-width: 480px)': {
        gap: `4px`,
        marginBottom: `20px`,
    },
});

const CategoryTag = styled("div")({
    backgroundColor: `rgba(68, 122, 101, 1)`,
    borderRadius: `34px`,
    padding: `4px 12px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `10px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    textAlign: `center`,
    lineHeight: `1.4`,
    whiteSpace: `nowrap`,
    flexShrink: 0,
    '@media (max-width: 480px)': {
        fontSize: `9px`,
        padding: `3px 10px`,
    },
});

// Recently Watched Section Components
const RecentlyWatchedSection = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `80px 40px`,
    boxSizing: `border-box`,
    width: `100%`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `hidden`,
    '@media (max-width: 1024px)': {
        padding: `70px 30px`,
    },
    '@media (max-width: 768px)': {
        padding: `60px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `40px 15px`,
    },
});

const RecentlyWatchedTitle = styled("div")({
    textAlign: `left`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `32px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    width: `100%`,
    maxWidth: `1200px`,
    margin: `0px 0px 60px 0px`,
    '@media (max-width: 768px)': {
        fontSize: `24px`,
        margin: `0px 0px 40px 0px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
        margin: `0px 0px 30px 0px`,
    },
});

const RecentlyWatchedCardsContainer = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `flex-start`,
    gap: `25px`,
    maxWidth: `1200px`,
    width: `100%`,
    '@media (max-width: 1024px)': {
        justifyContent: `center`,
        flexWrap: `wrap`,
        gap: `20px`,
    },
    '@media (max-width: 768px)': {
        flexDirection: `column`,
        alignItems: `center`,
        gap: `30px`,
    },
});

const RecentlyWatchedCard = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100%`,
    maxWidth: `376px`,
    minWidth: `300px`,
    flex: `1`,
    backgroundColor: `transparent`,
    borderRadius: `10px`,
    overflow: `visible`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        transform: `translateY(-5px)`,
        '& img': {
            transform: `scale(1.05)`,
        },
    },
    '@media (max-width: 1024px)': {
        maxWidth: `350px`,
        minWidth: `280px`,
    },
    '@media (max-width: 768px)': {
        maxWidth: `450px`,
        minWidth: `320px`,
        flex: `none`,
    },
    '@media (max-width: 480px)': {
        maxWidth: `100%`,
        minWidth: `280px`,
    },
});

const RecentlyWatchedVideo = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `234px`,
    borderRadius: `10px`,
    overflow: `hidden`,
    marginBottom: `15px`,
    '@media (max-width: 480px)': {
        height: `180px`,
    },
});

const RecentlyWatchedVideoImage = styled("img")({
    width: `100%`,
    height: `100%`,
    objectFit: `cover`,
    transition: `transform 0.3s ease`,
});

const RecentlyWatchedBadge = styled("div")({
    position: `absolute`,
    top: `15px`,
    left: `16px`,
    backgroundColor: `rgba(241, 63, 63, 1)`,
    borderRadius: `2px`,
    padding: `2px 6px`,
    color: `rgba(255, 255, 255, 1)`,
    fontStyle: `italic`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `8px`,
    letterSpacing: `0.37px`,
    lineHeight: `13px`,
    textTransform: `none`,
    zIndex: 3,
    '@media (max-width: 480px)': {
        top: `12px`,
        left: `12px`,
        fontSize: `7px`,
        padding: `2px 5px`,
    },
});

const RecentlyWatchedViewerCount = styled("div")({
    position: `absolute`,
    bottom: `16px`,
    left: `16px`,
    backgroundColor: `rgba(0, 0, 0, 0.5)`,
    borderRadius: `2px`,
    padding: `4px 8px`,
    color: `rgba(255, 255, 255, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `8px`,
    letterSpacing: `0.37px`,
    lineHeight: `13px`,
    textTransform: `none`,
    zIndex: 3,
    '@media (max-width: 480px)': {
        bottom: `12px`,
        left: `12px`,
        fontSize: `7px`,
        padding: `3px 6px`,
    },
});

const RecentlyWatchedInfo = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    padding: `0px 70px 0px 15px`,
    gap: `5px`,
    marginBottom: `15px`,
    '@media (max-width: 480px)': {
        padding: `0px 60px 0px 15px`,
    },
});

const RecentlyWatchedVideoTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    lineHeight: `1.3`,
    wordWrap: `break-word`,
    overflow: `hidden`,
    '@media (max-width: 768px)': {
        fontSize: `15px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const RecentlyWatchedChannel = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `12px`,
    letterSpacing: `0px`,
    textTransform: `uppercase`,
    lineHeight: `1.3`,
    opacity: 0.9,
    '@media (max-width: 480px)': {
        fontSize: `11px`,
    },
});

const RecentlyWatchedCategory = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `12px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    lineHeight: `1.3`,
    opacity: 0.8,
    '@media (max-width: 480px)': {
        fontSize: `11px`,
    },
});

const RecentlyWatchedTags = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    gap: `5px`,
    padding: `0px 15px`,
    marginBottom: `10px`,
    flexWrap: `wrap`,
    alignItems: `flex-start`,
    '@media (max-width: 480px)': {
        gap: `4px`,
    },
});

const RecentlyWatchedTag = styled("div")({
    backgroundColor: `rgba(68, 122, 101, 1)`,
    borderRadius: `34px`,
    padding: `4px 12px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `10px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    textAlign: `center`,
    lineHeight: `1.4`,
    whiteSpace: `nowrap`,
    flexShrink: 0,
    '@media (max-width: 480px)': {
        fontSize: `9px`,
        padding: `3px 10px`,
    },
});

const RecentlyWatchedAvatar = styled("img")({
    position: `absolute`,
    bottom: `55px`,
    right: `15px`,
    width: `49px`,
    height: `49px`,
    borderRadius: `50%`,
    objectFit: `cover`,
    border: `2px solid rgba(255, 232, 161, 0.3)`,
    zIndex: 2,
    '@media (max-width: 768px)': {
        width: `45px`,
        height: `45px`,
        bottom: `50px`,
    },
    '@media (max-width: 480px)': {
        width: `40px`,
        height: `40px`,
        bottom: `45px`,
        right: `10px`,
    },
});

// Recommendations Section Components (reusing the same styling as Recently Watched)
const RecommendationsSection = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `80px 40px`,
    boxSizing: `border-box`,
    width: `100%`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `hidden`,
    '@media (max-width: 1024px)': {
        padding: `70px 30px`,
    },
    '@media (max-width: 768px)': {
        padding: `60px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `40px 15px`,
    },
});

const RecommendationsTitle = styled("div")({
    textAlign: `left`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `32px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    width: `100%`,
    maxWidth: `1200px`,
    margin: `0px 0px 60px 0px`,
    '@media (max-width: 768px)': {
        fontSize: `24px`,
        margin: `0px 0px 40px 0px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
        margin: `0px 0px 30px 0px`,
    },
});

function CommunityPage() {
    const navigate = useNavigate();
    const [currentTVIndex, setCurrentTVIndex] = useState(0);
    const [activeKnowledgeTab, setActiveKnowledgeTab] = useState('video'); // 'video' or 'general'
    const [isMobile, setIsMobile] = useState(false);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
    const [discussions, setDiscussions] = useState([]);
    const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [nationalParks, setNationalParks] = useState([]);
    const [parksLoading, setParksLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [featuredSeries, setFeaturedSeries] = useState(null);
    const [featuredLoading, setFeaturedLoading] = useState(true);
    const [recentVideos, setRecentVideos] = useState([]);
    const [recentLoading, setRecentLoading] = useState(true);
    const [tvItems, setTvItems] = useState([]); // {slug, title, thumbnail_url, position}
    
    const baseUrl = API_BASE_URL.replace('/api/v1', '');
    
        // Wrapper so we can keep the TV frame image and overlay a thumbnail "screen" inside it
        const TVWrapper = styled("div")(({ isActive, position }) => ({
            position: `absolute`,
            transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            cursor: `pointer`,
            borderRadius: `15px`,
            boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`,
            '&:hover': {
                boxShadow: `0 25px 50px rgba(255, 232, 161, 0.2)`,
            },
            ...(isActive ? {
                width: `450px`,
                height: `480px`,
                left: `50%`,
                top: `50%`,
                transform: `translate(-50%, -50%) scale(1)`,
                zIndex: 5,
                opacity: 1,
                '@media (max-width: 768px)': {
                    width: `280px`,
                    height: `300px`,
                },
                '@media (max-width: 480px)': {
                    width: `220px`,
                    height: `235px`,
                },
            } : position === 'left' ? {
                width: `300px`,
                height: `320px`,
                left: `35%`,
                top: `50%`,
                transform: `translate(-50%, -50%) scale(0.85)`,
                zIndex: 2,
                opacity: 0.6,
                '@media (max-width: 768px)': {
                    width: `180px`,
                    height: `192px`,
                    left: `30%`,
                },
                '@media (max-width: 480px)': {
                    width: `140px`,
                    height: `150px`,
                    left: `25%`,
                },
            } : {
                width: `300px`,
                height: `320px`,
                right: `35%`,
                top: `50%`,
                transform: `translate(50%, -50%) scale(0.85)`,
                zIndex: 2,
                opacity: 0.6,
                '@media (max-width: 768px)': {
                    width: `180px`,
                    height: `192px`,
                    right: `30%`,
                },
                '@media (max-width: 480px)': {
                    width: `140px`,
                    height: `150px`,
                    right: `25%`,
                },
            }),
        }));

    // Fetch TV playlist from API
    useEffect(() => {
        const fetchTv = async () => {
            try {
                const base = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
                const res = await fetch(`${base}/videos/tv_playlist`);
                if (!res.ok) return;
                const data = await res.json();
                setTvItems(data.playlist || []);
                if ((data.playlist || []).length > 0) setCurrentTVIndex(0);
            } catch (err) {
                console.error('Failed to load TV playlist', err);
            }
        };

        fetchTv();
    }, []);

    // Fetch national parks from API
    useEffect(() => {
        const fetchNationalParks = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/national-parks?is_active=true`);
                if (response.ok) {
                    const parks = await response.json();
                    setNationalParks(parks);
                } else {
                    console.error('Failed to fetch national parks');
                }
            } catch (error) {
                console.error('Error fetching national parks:', error);
            } finally {
                setParksLoading(false);
            }
        };

        fetchNationalParks();
    }, []);

    // Get current user
    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
    }, []);

    // Fetch featured series
    useEffect(() => {
        const fetchFeaturedSeries = async () => {
            try {
                setFeaturedLoading(true);
                const data = await videoService.getFeaturedSeries();
                setFeaturedSeries(data.featured_series);
            } catch (error) {
                console.error('Error fetching featured series:', error);
            } finally {
                setFeaturedLoading(false);
            }
        };

        fetchFeaturedSeries();
    }, []);

    // Fetch recent watched videos
    useEffect(() => {
        const fetchRecentVideos = async () => {
            try {
                setRecentLoading(true);
                const data = await videoService.getRecentWatched(3);
                setRecentVideos(data.recent_videos || []);
            } catch (error) {
                console.error('Error fetching recent videos:', error);
            } finally {
                setRecentLoading(false);
            }
        };

        fetchRecentVideos();
    }, []);

    // Fetch categories for the category cards section
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const categoriesData = await discussionService.getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Check if screen is mobile
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Auto-rotate carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTVIndex((prev) => {
                const len = tvItems.length || 1;
                return (prev + 1) % len;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [tvItems.length]);


    // Helper function to get button state
    const getVideoButtonState = (video) => {
        if (!video) return { text: 'Watch', completed: false };
        
        const progress = video.progress_percentage || 0;
        const completed = video.completed || false;
        
        if (completed) {
            return { text: '✓ Watched', completed: true };
        } else if (progress > 0 && progress < 100) {
            return { text: 'Continue', completed: false };
        } else {
            return { text: 'Watch', completed: false };
        }
    };

    const handleTVClick = (slug) => {
        // Navigate to the selected community video page
        if (!slug) return;
        navigate(`/community/video/${slug}`);
    };

    const handleDotClick = (index) => {
        setCurrentTVIndex(index);
    };

    const handlePrevious = () => {
        setCurrentTVIndex((prev) => {
            const len = tvItems.length || 1;
            return (prev - 1 + len) % len;
        });
    };

    const handleNext = () => {
        setCurrentTVIndex((prev) => {
            const len = tvItems.length || 1;
            return (prev + 1) % len;
        });
    };

    const handleCategoryClick = (categoryId) => {
        // Navigate to discussions page with category filter
        navigate(`/community/discussions?category=${categoryId}`);
    };

    const handleStartDiscussion = () => {
        setIsCreatePostModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreatePostModalOpen(false);
    };

    const handleDeleteDiscussion = async (e, discussionId) => {
        e.stopPropagation(); // Prevent card click navigation
        
        if (!window.confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
            return;
        }

        try {
            await discussionService.deleteDiscussion(discussionId);
            // Reload the discussions list to maintain 4 discussions and good UX
            await loadRecentDiscussions();
            alert('Discussion deleted successfully');
        } catch (error) {
            console.error('Error deleting discussion:', error);
            if (error.response?.status === 401) {
                alert('Please log in to delete discussions');
            } else if (error.response?.status === 403) {
                alert('You do not have permission to delete this discussion');
            } else {
                alert('Failed to delete discussion. Please try again.');
            }
        }
    };

    // Helper function to get initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Helper function to format time ago
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        
        const years = Math.floor(months / 12);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    };

    // Helper function to get badge text from author
    const getBadgeText = (author) => {
        if (!author) return 'Member';
        if (author.badges && author.badges.length > 0) {
            return author.badges[0];
        }
        return 'Member';
    };

    // Fetch recent discussions function (extracted for reuse)
    const loadRecentDiscussions = async () => {
        try {
            setIsLoadingDiscussions(true);
            const data = await discussionService.getDiscussions({
                status: 'approved',
                sort_by: 'recent',
                page: 1,
                page_size: 4
            });
            setDiscussions(data.items || []);
        } catch (error) {
            console.error('Failed to load discussions:', error);
            setDiscussions([]);
        } finally {
            setIsLoadingDiscussions(false);
        }
    };

    // Fetch recent discussions
    useEffect(() => {
        loadRecentDiscussions();
    }, []);

    return (
        <CommunityContainer>
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <HeroSection>
                <HeroImage src={CommunityForumImage} alt="Community Forum" />
                <HeroText>A space for questions, conversations, and collective wisdom!</HeroText>
            </HeroSection>

            {/* TV Carousel Section - Desktop 7 Design */}
            <TVCarouselSection>
                {/* Decorative Elements */}
                <BackgroundRectangle src={Rectangle1Image} alt="Background Rectangle" />
                <SecondRectangleDecoration src={RectangleImage} alt="Second Rectangle Decoration" />

                <CarouselContainer>
                    {tvItems.length === 0 ? (
                        // Fallback: show static placeholders
                        [Tv1Image, Tv2Image, Tv3Image].map((tvImage, index) => {
                            let position = '';
                            if (index === currentTVIndex) position = 'center';
                            else if (index === (currentTVIndex - 1 + 3) % 3) position = 'left';
                            else position = 'right';
                            return (
                                <TVImage
                                    key={`fallback-${index}`}
                                    src={tvImage}
                                    alt={`TV ${index + 1}`}
                                    isActive={index === currentTVIndex}
                                    position={position}
                                    onClick={() => handleTVClick(null)}
                                    loading="lazy"
                                />
                            );
                        })
                    ) : (
                        tvItems.map((item, index) => {
                            const len = tvItems.length;
                            let position = '';
                            if (index === currentTVIndex) position = 'center';
                            else if (index === (currentTVIndex - 1 + len) % len) position = 'left';
                            else position = 'right';

                            return (
                                <TVWrapper
                                    key={item.slug || index}
                                    isActive={index === currentTVIndex}
                                    position={position}
                                    onClick={() => handleTVClick(item.slug)}
                                >
                                    <TVFrameImg src={Tv1Image} alt="TV Frame" />
                                    <ScreenImg
                                        src={item.thumbnail_url || Tv1Image}
                                        alt={item.title || `TV ${index + 1}`}
                                        isActive={index === currentTVIndex}
                                        loading="lazy"
                                    />
                                </TVWrapper>
                            );
                        })
                    )}

                    {/* Navigation Arrows */}
                    <NavigationContainer>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={handlePrevious}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                border: '2px solid rgba(255, 232, 161, 0.8)',
                                backgroundColor: 'rgba(30, 45, 39, 0.9)',
                                color: 'rgba(255, 232, 161, 1)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            ‹
                        </Button>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={handleNext}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                border: '2px solid rgba(255, 232, 161, 0.8)',
                                backgroundColor: 'rgba(30, 45, 39, 0.9)',
                                color: 'rgba(255, 232, 161, 1)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            ›
                        </Button>
                    </NavigationContainer>
                </CarouselContainer>

                <CarouselTitle>CLICK TO WATCH LIVE STREAMS</CarouselTitle>

                <CarouselDots>
                    {(tvItems.length === 0 ? [0,1,2] : tvItems.map((_, i) => i)).map((_, index) => (
                        <Button
                            key={index}
                            variant={index === currentTVIndex ? "primary" : "ghost"}
                            size="small"
                            onClick={() => handleDotClick(index)}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                padding: '0',
                                minWidth: '12px',
                                minHeight: '12px'
                            }}
                        />
                    ))}
                </CarouselDots>
            </TVCarouselSection>

            {/* Categories Section */}
            <CategoriesSection>
                <CommunityTitle src={CommunitySvg} alt="Community Title" />
                <CategoriesTitle>
                    <CategoriesSpan1>CATEGORIES </CategoriesSpan1>
                    <CategoriesSpan2>we think you'll like</CategoriesSpan2>
                </CategoriesTitle>

                <CategoriesCardsContainer>
                    {categoriesLoading ? (
                        <div style={{ color: '#fff', padding: '20px' }}>Loading categories...</div>
                    ) : categories.length === 0 ? (
                        <div style={{ color: '#fff', padding: '20px' }}>No categories available</div>
                    ) : (
                        categories.map((category) => (
                            <CategoryCard key={category.id} onClick={() => handleCategoryClick(category.id)}>
                                <CategoryImage 
                                    src={category.image_url || AnimalBirdsImage} 
                                    alt={`${category.name} Category`} 
                                />
                                <CategoryInfo>
                                    <CategoryTitle>{category.name.toUpperCase()}</CategoryTitle>
                                </CategoryInfo>
                                <CategoryTags>
                                    <CategoryTag>#{category.slug}</CategoryTag>
                                </CategoryTags>
                            </CategoryCard>
                        ))
                    )}
                </CategoriesCardsContainer>
            </CategoriesSection>

            {/* National Parks Section */}
            <CategoriesSection>
                <CategoriesTitle>
                    <CategoriesSpan1>NATIONAL PARKS </CategoriesSpan1>
                    <CategoriesSpan2>parks-specific communities</CategoriesSpan2>
                </CategoriesTitle>
                <CategoriesCardsContainer>
                    {parksLoading ? (
                        <div style={{ 
                            textAlign: 'center', 
                            color: 'rgba(255, 232, 161, 1)', 
                            fontFamily: 'DM Sans',
                            padding: '40px',
                            width: '100%'
                        }}>
                            Loading national parks...
                        </div>
                    ) : nationalParks.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            color: 'rgba(255, 232, 161, 1)', 
                            fontFamily: 'DM Sans',
                            padding: '40px',
                            width: '100%'
                        }}>
                            No national parks available
                        </div>
                    ) : (
                        nationalParks.map((park) => {
                            // Use banner if it's an image, otherwise use first media_url or fallback
                            const cardImage = park.banner_media_type === 'image' && park.banner_media_url
                                ? park.banner_media_url
                                : (park.media_urls && park.media_urls.length > 0)
                                    ? park.media_urls[0]
                                    : AnimalBirdsImage;
                            
                            return (
                                <CategoryCard 
                                    key={park.id} 
                                    onClick={() => navigate(`/community/park/${park.slug}`)}
                                >
                                    <CategoryImage 
                                        src={cardImage} 
                                        alt={park.name} 
                                    />
                                    <CategoryInfo>
                                        <CategoryTitle>{park.name}</CategoryTitle>
                                        <CategoryViewers>{park.state || 'India'}</CategoryViewers>
                                    </CategoryInfo>
                                    <CategoryTags>
                                        <CategoryTag>#{park.slug}</CategoryTag>
                                    </CategoryTags>
                                </CategoryCard>
                            );
                        })
                    )}
                </CategoriesCardsContainer>
            </CategoriesSection>

            {/* Trending Discussions Section */}
            <CategoriesSection>
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: isMobile ? 'center' : 'space-between',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    width: '100%',
                    maxWidth: '1200px',
                    marginBottom: isMobile ? '40px' : '60px',
                    gap: isMobile ? '24px' : '0',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    <div style={{
                        width: isMobile ? '100%' : 'auto',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        <CategoriesTitle style={{ 
                            margin: 0,
                            textAlign: isMobile ? 'center' : 'left'
                        }}>
                            <CategoriesSpan1>TRENDING DISCUSSIONS</CategoriesSpan1>
                        </CategoriesTitle>
                        <div style={{
                            color: 'rgba(205, 217, 157, 1)',
                            fontFamily: 'DM Sans',
                            fontWeight: '400',
                            fontSize: isMobile ? '14px' : '16px',
                            marginTop: '8px',
                            textAlign: isMobile ? 'center' : 'left',
                            marginBottom: isMobile ? '20px' : '0'
                        }}>
                            join the conversation with wildlife enthusiasts
                        </div>
                        
                        {/* Button for mobile - placed below text */}
                        {isMobile && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%'
                            }}>
                                <Button 
                                    variant="primary"
                                    onClick={handleStartDiscussion}
                                    style={{
                                        backgroundColor: '#447A65',
                                        border: 'none',
                                        borderRadius: '50px',
                                        padding: '14px 28px',
                                        color: 'white',
                                        fontFamily: 'DM Sans',
                                        fontWeight: '600',
                                        fontSize: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#3a6b56';
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(68, 122, 101, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#447A65';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <img 
                                        src={DiscussionIcon} 
                                        alt="Discussion Icon" 
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            filter: 'brightness(0) invert(1)'
                                        }}
                                    />
                                    Start a Discussion
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    {/* Button for desktop - positioned on the right */}
                    {!isMobile && (
                        <Button 
                            variant="primary"
                            onClick={handleStartDiscussion}
                            style={{
                                backgroundColor: '#447A65',
                                border: 'none',
                                borderRadius: '50px',
                                padding: '16px 32px',
                                color: 'white',
                                fontFamily: 'DM Sans',
                                fontWeight: '600',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#3a6b56';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(68, 122, 101, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#447A65';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <img 
                                src={DiscussionIcon} 
                                alt="Discussion Icon" 
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    filter: 'brightness(0) invert(1)'
                                }}
                            />
                            Start a Discussion
                        </Button>
                    )}
                </div>
                
                {/* Discussion content */}
                {isLoadingDiscussions ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '60px 0',
                        width: '100%'
                    }}>
                        <div style={{
                            color: 'rgba(255, 232, 161, 1)',
                            fontFamily: 'DM Sans',
                            fontSize: '16px'
                        }}>
                            Loading discussions...
                        </div>
                    </div>
                ) : discussions.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '60px 0',
                        width: '100%'
                    }}>
                        <div style={{
                            color: 'rgba(255, 232, 161, 1)',
                            fontFamily: 'DM Sans',
                            fontSize: '16px',
                            textAlign: 'center'
                        }}>
                            No discussions yet. Be the first to start one!
                        </div>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                        gap: isMobile ? '16px' : '24px',
                        width: '100%',
                        maxWidth: '1200px'
                    }}>
                        {discussions.map((discussion) => {
                            const authorName = discussion.author?.full_name || discussion.author?.username || '[Deleted User]';
                            const authorAvatar = discussion.author?.avatar_url;
                            const badgeText = getBadgeText(discussion.author);
                            const timeAgo = formatTimeAgo(discussion.created_at);
                            const initials = getInitials(authorName);
                            
                            return (
                                <div 
                                    key={discussion.id} 
                                    style={{
                                        backgroundColor: '#132620',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        border: '1px solid rgba(255, 232, 161, 0.2)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        height: '260px', // Fixed height for consistent cards
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '@media (max-width: 768px)': {
                                            padding: '18px',
                                            borderRadius: '10px',
                                            height: '270px'
                                        },
                                        '@media (max-width: 480px)': {
                                            padding: '16px',
                                            borderRadius: '8px',
                                            height: '270px'
                                        }
                                    }}
                                    onClick={() => navigate(`/community/discussions/${discussion.slug || discussion.id}`)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {/* User Info */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '16px',
                                        '@media (max-width: 480px)': {
                                            marginBottom: '14px'
                                        }
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: '#447A65',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontFamily: 'DM Sans',
                                            fontWeight: '700',
                                            fontSize: '14px',
                                            marginRight: '12px',
                                            flexShrink: 0,
                                            overflow: 'hidden',
                                            '@media (max-width: 480px)': {
                                                width: '36px',
                                                height: '36px',
                                                fontSize: '12px',
                                                marginRight: '10px'
                                            }
                                        }}>
                                            {authorAvatar ? (
                                                <img 
                                                    src={authorAvatar} 
                                                    alt={authorName}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        objectPosition: 'center'
                                                    }}
                                                />
                                            ) : (
                                                initials
                                            )}
                                        </div>
                                        <div style={{
                                            flex: 1,
                                            minWidth: 0
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                flexWrap: 'wrap',
                                                '@media (max-width: 480px)': {
                                                    gap: '6px'
                                                }
                                            }}>
                                                <span style={{
                                                    color: 'rgba(255, 232, 161, 1)',
                                                    fontFamily: 'DM Sans',
                                                    fontWeight: '600',
                                                    fontSize: '14px',
                                                    '@media (max-width: 480px)': {
                                                        fontSize: '13px'
                                                    }
                                                }}>
                                                    {authorName}
                                                </span>
                                                <span style={{
                                                    backgroundColor: 'rgba(255, 232, 161, 0.2)',
                                                    color: 'rgba(255, 232, 161, 1)',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '10px',
                                                    fontFamily: 'DM Sans',
                                                    fontWeight: '500',
                                                    '@media (max-width: 480px)': {
                                                        fontSize: '9px',
                                                        padding: '2px 6px'
                                                    }
                                                }}>
                                                    {badgeText}
                                                </span>
                                            </div>
                                            <div style={{
                                                color: '#4A5E54',
                                                fontSize: '12px',
                                                fontFamily: 'DM Sans',
                                                marginTop: '2px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                '@media (max-width: 480px)': {
                                                    fontSize: '11px'
                                                }
                                            }}>
                                                <img 
                                                    src={TimeIcon} 
                                                    alt="Time" 
                                                    style={{
                                                        width: '12px',
                                                        height: '12px',
                                                        filter: 'brightness(0) saturate(100%) invert(29%) sepia(12%) saturate(932%) hue-rotate(86deg) brightness(95%) contrast(88%)',
                                                        '@media (max-width: 480px)': {
                                                            width: '10px',
                                                            height: '10px'
                                                        }
                                                    }}
                                                />
                                                {timeAgo}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Discussion Title */}
                                    <h3 style={{
                                        color: 'rgba(255, 232, 161, 1)',
                                        fontFamily: 'DM Sans',
                                        fontWeight: '700',
                                        fontSize: '16px',
                                        margin: '0 0 12px 0',
                                        lineHeight: '1.4',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        textOverflow: 'ellipsis',
                                        maxHeight: '44.8px', // 2 lines * 1.4 lineHeight * 16px fontSize
                                    }}>
                                        {discussion.title}
                                    </h3>

                                    {/* Discussion Description */}
                                    {discussion.excerpt && (
                                        <p style={{
                                            color: 'rgba(255, 232, 161, 1)',
                                            fontFamily: 'DM Sans',
                                            fontSize: '14px',
                                            lineHeight: '1.5',
                                            margin: '0 0 auto 0',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            textOverflow: 'ellipsis',
                                            maxHeight: '42px', // 2 lines * 1.5 lineHeight * 14px fontSize
                                        }}>
                                            {discussion.excerpt}
                                        </p>
                                    )}

                                    {/* Tags */}
                                    {discussion.tags && discussion.tags.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            marginBottom: '16px',
                                            flexWrap: 'wrap',
                                            '@media (max-width: 480px)': {
                                                gap: '6px',
                                                marginBottom: '14px'
                                            }
                                        }}>
                                            {discussion.tags.map((tag, index) => (
                                                <span 
                                                    key={index}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        color: 'rgba(255, 232, 161, 1)',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '10px',
                                                        fontFamily: 'DM Sans',
                                                        fontWeight: '500',
                                                        border: '1px solid rgba(53, 94, 59, 0.3)',
                                                        whiteSpace: 'nowrap',
                                                        '@media (max-width: 480px)': {
                                                            fontSize: '9px',
                                                            padding: '3px 10px'
                                                        }
                                                    }}
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Comments */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '16px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <img 
                                                src={CommentsIcon} 
                                                alt="Comments" 
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    filter: 'brightness(0) saturate(100%) invert(91%) sepia(21%) saturate(1067%) hue-rotate(317deg) brightness(105%) contrast(102%)',
                                                    '@media (max-width: 480px)': {
                                                        width: '14px',
                                                        height: '14px'
                                                    }
                                                }}
                                            />
                                            <span style={{
                                                color: 'rgba(255, 232, 161, 1)',
                                                fontFamily: 'DM Sans',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                '@media (max-width: 480px)': {
                                                    fontSize: '12px'
                                                }
                                            }}>
                                                {discussion.comment_count || 0} {discussion.comment_count === 1 ? 'comment' : 'comments'}
                                            </span>
                                        </div>
                                        {currentUser && discussion.author?.id === currentUser.id && (
                                            <DeleteButton onClick={(e) => handleDeleteDiscussion(e, discussion.id)}>
                                                <DeleteIconImg src={deleteIcon} alt="delete" />
                                            </DeleteButton>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {/* View All Discussions Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '32px'
                }}>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/community/discussions')}
                        style={{
                            backgroundColor: '#447A65',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '14px 28px',
                            color: 'white',
                            fontFamily: 'DM Sans',
                            fontWeight: '600',
                            fontSize: '15px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#3a6b56';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(68, 122, 101, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#447A65';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        View All Discussions
                    </Button>
                </div>
                
            </CategoriesSection>

            {/* This Week's Knowledge Series Section */}
            <CategoriesSection>
                <div style={{
                    width: '100%',
                    maxWidth: '1200px',
                    marginBottom: isMobile ? '30px' : '40px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    <CategoriesTitle style={{ 
                        margin: 0,
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        <CategoriesSpan1>THIS WEEK'S KNOWLEDGE SERIES</CategoriesSpan1>
                    </CategoriesTitle>
                    <div style={{
                        color: 'rgba(205, 217, 157, 1)',
                        fontFamily: 'DM Sans',
                        fontWeight: '400',
                        fontSize: isMobile ? '14px' : '16px',
                        marginTop: '8px',
                        marginBottom: '24px',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        Curated video series and educational content
                    </div>

                    {/* Tab Buttons */}
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'rgba(68, 122, 101, 0.2)',
                        border: '1px solid rgba(68, 122, 101, 0.3)',
                        borderRadius: '50px',
                        padding: '4px',
                        width: 'fit-content',
                        gap: '0',
                        margin: isMobile ? '0 auto' : '0'
                    }}>
                        <button
                            onClick={() => setActiveKnowledgeTab('video')}
                            style={{
                                backgroundColor: activeKnowledgeTab === 'video' ? 'rgba(19, 38, 32, 1)' : 'transparent',
                                border: 'none',
                                borderRadius: '50px',
                                padding: '12px 24px',
                                color: activeKnowledgeTab === 'video' ? 'rgba(255, 232, 161, 1)' : 'rgba(255, 232, 161, 0.7)',
                                fontFamily: 'DM Sans',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Video Series
                        </button>
                        
                        <button
                            onClick={() => setActiveKnowledgeTab('general')}
                            style={{
                                backgroundColor: activeKnowledgeTab === 'general' ? 'rgba(19, 38, 32, 1)' : 'transparent',
                                border: 'none',
                                borderRadius: '50px',
                                padding: '12px 24px',
                                color: activeKnowledgeTab === 'general' ? 'rgba(255, 232, 161, 1)' : 'rgba(255, 232, 161, 0.7)',
                                fontFamily: 'DM Sans',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            General Knowledge
                        </button>
                    </div>
                </div>

                {/* Knowledge Series Content */}
                <div style={{
                    width: '100%',
                    maxWidth: '1200px',
                    marginTop: '10px'
                }}>
                    {/* Featured Series Card */}
                    {featuredLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(205, 217, 157, 1)' }}>
                            Loading featured series...
                        </div>
                    ) : featuredSeries ? (
                        <div style={{
                            backgroundColor: 'rgba(68, 122, 101, 0.1)',
                            borderRadius: '16px',
                            padding: '24px',
                            border: '1px solid rgba(68, 122, 101, 0.3)',
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: isMobile ? 'center' : 'space-between',
                            alignItems: 'center',
                            gap: isMobile ? '16px' : '20px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            textAlign: isMobile ? 'center' : 'left'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        >
                            <div style={{
                                flex: isMobile ? 'none' : 1,
                                textAlign: isMobile ? 'center' : 'left',
                                width: isMobile ? '100%' : 'auto'
                            }}>
                                <h3 style={{
                                    color: 'rgba(255, 232, 161, 1)',
                                    fontFamily: 'DM Sans',
                                    fontWeight: '500',
                                    fontSize: isMobile ? '20px' : '24px',
                                    margin: '0 0 8px 0',
                                    lineHeight: '1.3',
                                    textAlign: isMobile ? 'center' : 'left'
                                }}>
                                    {featuredSeries.title}
                                </h3>
                                <p style={{
                                    color: 'rgba(205, 217, 157, 1)',
                                    fontFamily: 'DM Sans',
                                    fontWeight: '350',
                                    fontSize: isMobile ? '14px' : '16px',
                                    margin: 0,
                                    lineHeight: '1.5',
                                    textAlign: isMobile ? 'center' : 'left',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {featuredSeries.subtitle || featuredSeries.description || `${featuredSeries.total_videos} videos`}
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    const firstVideo = featuredSeries.videos?.[0];
                                    if (firstVideo) {
                                        navigate(`/community/video/${firstVideo.slug}`);
                                    }
                                }}
                                style={{
                                    backgroundColor: '#447A65',
                                    border: 'none',
                                    borderRadius: '50px',
                                    padding: isMobile ? '12px 20px' : '14px 24px',
                                    color: 'white',
                                    fontFamily: 'DM Sans',
                                    fontWeight: '600',
                                    fontSize: isMobile ? '14px' : '15px',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    flexShrink: 0,
                                    alignSelf: isMobile ? 'center' : 'auto'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#3a6b56';
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(68, 122, 101, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#447A65';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                {getVideoButtonState(featuredSeries.videos?.[0]).text} Series
                            </Button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(205, 217, 157, 1)' }}>
                            No featured series available
                        </div>
                    )}

                    {/* Video Cards Grid - Only show when Video Series tab is active */}
                    {activeKnowledgeTab === 'video' && (
                        <div style={{
                            width: '100%',
                            maxWidth: '1200px',
                            marginTop: '24px'
                        }}>
                            {/* Video Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                                gap: '20px',
                                width: '100%'
                            }}>
                                {featuredSeries && featuredSeries.videos && featuredSeries.videos.slice(0, 3).map((video, index) => {
                                    const buttonState = getVideoButtonState(video);
                                    const totalVideos = featuredSeries.total_videos || featuredSeries.videos.length;
                                    
                                    return (
                                        <div 
                                            key={video.id}
                                            style={{
                                                backgroundColor: 'rgba(19, 38, 32, 1)',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                position: 'relative'
                                            }}
                                            onClick={() => navigate(`/community/video/${video.slug}`)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                                                const playButton = e.currentTarget.querySelector('.play-button');
                                                if (playButton) playButton.style.opacity = '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                                const playButton = e.currentTarget.querySelector('.play-button');
                                                if (playButton) playButton.style.opacity = '0';
                                            }}
                                        >
                                            <div style={{
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                backgroundImage: `url(${video.thumbnail_url ? baseUrl + video.thumbnail_url : Live1Image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {video.duration && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '8px',
                                                        right: '8px',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '30px',
                                                        fontSize: '12px',
                                                        fontFamily: 'DM Sans',
                                                        fontWeight: '450',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <img src={TimeIcon} alt="Time" style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} />
                                                        {videoService.formatDuration(video.duration)}
                                                    </div>
                                                )}
                                                
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    left: '8px',
                                                    backgroundColor: 'rgba(255, 232, 161, 0.9)',
                                                    color: 'rgba(30, 45, 39, 1)',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontFamily: 'DM Sans',
                                                    fontWeight: '500'
                                                }}>
                                                    Part {video.position || index + 1} of {totalVideos}
                                                </div>
                                                
                                                {buttonState.completed && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        right: '8px',
                                                        backgroundColor: 'rgba(68, 122, 101, 0.9)',
                                                        color: 'rgba(255, 232, 161, 1)',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        fontFamily: 'DM Sans',
                                                        fontWeight: '500',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <img src={watchedIcon} alt="Watched" style={{ width: '14px', height: '13px' }} />
                                                        Watched
                                                    </div>
                                                )}

                                                {video.progress_percentage > 0 && !buttonState.completed && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '0',
                                                        left: '0',
                                                        width: '100%',
                                                        height: '4px',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                                                    }}>
                                                        <div style={{
                                                            height: '100%',
                                                            width: `${video.progress_percentage}%`,
                                                            backgroundColor: 'rgba(68, 122, 101, 1)',
                                                            transition: 'width 0.3s ease'
                                                        }} />
                                                    </div>
                                                )}

                                                <div 
                                                    className="play-button"
                                                    style={{
                                                        opacity: '0',
                                                        transition: 'opacity 0.3s ease',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                        borderRadius: '50%',
                                                        width: '60px',
                                                        height: '60px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '24px',
                                                        color: '#447A65'
                                                    }}
                                                >
                                                    ▶
                                                </div>
                                            </div>

                                            <div style={{
                                                padding: '16px'
                                            }}>
                                                <h4 style={{
                                                    color: 'rgba(255, 232, 161, 1)',
                                                    fontFamily: 'DM Sans',
                                                    fontWeight: '600',
                                                    fontSize: '16px',
                                                    margin: '0 0 8px 0',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {video.title}
                                                </h4>
                                                <p style={{
                                                    color: 'rgba(205, 217, 157, 1)',
                                                    fontFamily: 'DM Sans',
                                                    fontWeight: '400',
                                                    fontSize: '14px',
                                                    margin: 0,
                                                    lineHeight: '1.5',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {video.subtitle || video.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* View All Videos Button */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '32px'
                            }}>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/community/videos')}
                                    style={{
                                        backgroundColor: '#447A65',
                                        border: 'none',
                                        borderRadius: '50px',
                                        padding: '14px 28px',
                                        color: 'white',
                                        fontFamily: 'DM Sans',
                                        fontWeight: '600',
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#3a6b56';
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(68, 122, 101, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#447A65';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    View All Videos
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* General Knowledge Content - Recent Watched Videos */}
                    {activeKnowledgeTab === 'general' && (
                        <div style={{
                            width: '100%',
                            maxWidth: '1200px',
                            marginTop: '24px'
                        }}>
                            {recentLoading ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(205, 217, 157, 1)' }}>
                                    Loading recent videos...
                                </div>
                            ) : recentVideos && recentVideos.length > 0 ? (
                                <>
                                    {/* Three Video Cards */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                                        gap: '20px',
                                        width: '100%'
                                    }}>
                                        {recentVideos.map((video, index) => {
                                            const buttonState = getVideoButtonState(video);
                                            return (
                                                <div 
                                                    key={video.id}
                                                    style={{
                                                        backgroundColor: 'rgba(19, 38, 32, 1)',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        position: 'relative'
                                                    }}
                                                    onClick={() => navigate(`/community/video/${video.slug}`)}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                                                        const playButton = e.currentTarget.querySelector('.play-button');
                                                        if (playButton) playButton.style.opacity = '1';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                        const playButton = e.currentTarget.querySelector('.play-button');
                                                        if (playButton) playButton.style.opacity = '0';
                                                    }}
                                                >
                                                    {/* Video Thumbnail */}
                                                    <div style={{
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        backgroundImage: `url(${video.thumbnail_url ? baseUrl + video.thumbnail_url : Live1Image})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        {/* Duration Badge */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '8px',
                                                            right: '8px',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            borderRadius: '30px',
                                                            fontSize: '12px',
                                                            fontFamily: 'DM Sans',
                                                            fontWeight: '450',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}>
                                                            <img src={TimeIcon} alt="Time" style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} />
                                                            {videoService.formatDuration(video.duration || 0)}
                                                        </div>
                                                        
                                                        {/* Watched Badge */}
                                                        {buttonState.completed && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '8px',
                                                                right: '8px',
                                                                backgroundColor: 'rgba(68, 122, 101, 0.9)',
                                                                color: 'rgba(255, 232, 161, 1)',
                                                                padding: '4px 8px',
                                                                borderRadius: '12px',
                                                                fontSize: '12px',
                                                                fontFamily: 'DM Sans',
                                                                fontWeight: '500',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}>
                                                                <img src={watchedIcon} alt="Watched" style={{ width: '14px', height: '13px' }} />
                                                                Watched
                                                            </div>
                                                        )}

                                                        {/* Play Button (appears on hover) */}
                                                        <div 
                                                            className="play-button"
                                                            style={{
                                                                opacity: '0',
                                                                transition: 'opacity 0.3s ease',
                                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                                borderRadius: '50%',
                                                                width: '60px',
                                                                height: '60px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '24px',
                                                                color: '#447A65'
                                                            }}
                                                        >
                                                            ▶
                                                        </div>
                                                    </div>

                                                    {/* Video Info */}
                                                    <div style={{
                                                        padding: '16px'
                                                    }}>
                                                        <h4 style={{
                                                            color: 'rgba(255, 232, 161, 1)',
                                                            fontFamily: 'DM Sans',
                                                            fontWeight: '600',
                                                            fontSize: '16px',
                                                            margin: '0 0 8px 0',
                                                            lineHeight: '1.4'
                                                        }}>
                                                            {video.title}
                                                        </h4>
                                                        <p style={{
                                                            color: 'rgba(205, 217, 157, 1)',
                                                            fontFamily: 'DM Sans',
                                                            fontWeight: '400',
                                                            fontSize: '14px',
                                                            margin: '0 0 12px 0',
                                                            lineHeight: '1.5',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                            {video.subtitle || video.description || ''}
                                                        </p>
                                                        
                                                        {/* Channel and Views */}
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            marginBottom: '12px'
                                                        }}>
                                                            <div style={{
                                                                color: 'rgba(255, 232, 161, 0.8)',
                                                                fontFamily: 'DM Sans',
                                                                fontWeight: '400',
                                                                fontSize: '13px'
                                                            }}>
                                                                {video.parent_name || (video.type === 'series' ? 'Video Series' : 'General Knowledge')}
                                                            </div>
                                                            <div style={{
                                                                color: 'rgba(205, 217, 157, 0.7)',
                                                                fontFamily: 'DM Sans',
                                                                fontWeight: '400',
                                                                fontSize: '13px'
                                                            }}>
                                                                👁 {videoService.formatViews(video.views || 0)}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Tags */}
                                                        {video.tags && video.tags.length > 0 && (
                                                            <div style={{
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                gap: '6px',
                                                                marginBottom: video.progress_percentage > 0 && video.progress_percentage < 100 ? '12px' : '0'
                                                            }}>
                                                                {video.tags.slice(0, 3).map((tag, tagIndex) => (
                                                                    <div 
                                                                        key={tagIndex}
                                                                        style={{
                                                                            backgroundColor: 'rgba(68, 122, 101, 0.2)',
                                                                            color: 'rgba(255, 232, 161, 0.9)',
                                                                            padding: '4px 10px',
                                                                            borderRadius: '12px',
                                                                            fontSize: '11px',
                                                                            fontFamily: 'DM Sans',
                                                                            fontWeight: '500'
                                                                        }}
                                                                    >
                                                                        {tag}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        
                                                        {/* Progress Bar */}
                                                        {video.progress_percentage > 0 && video.progress_percentage < 100 && (
                                                            <>
                                                                <div style={{
                                                                    width: '100%',
                                                                    height: '4px',
                                                                    backgroundColor: 'rgba(68, 122, 101, 0.3)',
                                                                    borderRadius: '2px',
                                                                    overflow: 'hidden',
                                                                    marginBottom: '8px'
                                                                }}>
                                                                    <div style={{
                                                                        width: `${video.progress_percentage}%`,
                                                                        height: '100%',
                                                                        backgroundColor: 'rgba(68, 122, 101, 1)',
                                                                        borderRadius: '2px'
                                                                    }} />
                                                                </div>
                                                                <div style={{
                                                                    color: 'rgba(205, 217, 157, 0.8)',
                                                                    fontFamily: 'DM Sans',
                                                                    fontWeight: '400',
                                                                    fontSize: '12px',
                                                                    margin: 0
                                                                }}>
                                                                    {Math.round(video.progress_percentage)}% complete
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* View All Videos Button */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginTop: '32px'
                                    }}>
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate('/community/videos')}
                                            style={{
                                                backgroundColor: '#447A65',
                                                border: 'none',
                                                borderRadius: '50px',
                                                padding: '14px 28px',
                                                color: 'white',
                                                fontFamily: 'DM Sans',
                                                fontWeight: '600',
                                                fontSize: '15px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#3a6b56';
                                                e.target.style.transform = 'translateY(-1px)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(68, 122, 101, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#447A65';
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            View All Videos
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(205, 217, 157, 1)' }}>
                                    No videos available
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CategoriesSection>

            {/* Footer */}
            <Footer />

            {/* Create Post Modal */}
            <CreatePostModal 
                isOpen={isCreatePostModalOpen}
                onClose={handleCloseModal}
            />
        </CommunityContainer>
    );
}

export default CommunityPage;