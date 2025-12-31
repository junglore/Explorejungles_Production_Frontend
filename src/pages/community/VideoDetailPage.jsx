
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../../components/common/Footer';
import BackIcon from '../../assets/icons/backIcon.svg';
import saveIcon from '../../assets/icons/saveIcon.svg';
import shareIcon from '../../assets/icons/shareIcon.svg';
import eyeIcon from '../../assets/icons/eyeIcon.svg';
import calenderIcon from '../../assets/icons/calenderIcon.svg';
import timeIcon from '../../assets/icons/timeIcon.svg';
import aboutIcon from '../../assets/icons/aboutInfo.svg';
import commentsIcon from '../../assets/icons/commentsIcon.svg';
import likeIcon from '../../assets/icons/likeIcon.svg';
import dislikeIcon from '../../assets/icons/dislikeIcon.svg';
import reportIcon from '../../assets/icons/reportIcon.svg';
import previousIcon from '../../assets/icons/previousIcon.svg';
import nextIcon from '../../assets/icons/nextIcon.svg';
import overviewIcon from '../../assets/icons/overviewIcon.svg';

const VideoDetailContainer = styled("div")({
    backgroundColor: `hsla(156, 20%, 15%, 1.00)`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100%`,
    minHeight: `100vh`,
    justifyContent: `flex-start`,
    alignItems: `stretch`,
    padding: `0px`,
    margin: `0px`,
    boxSizing: `border-box`,
});

const FadeContainer = styled("div")(({ fade }) => ({
    opacity: fade ? 0 : 1,
    transition: `opacity 0.3s ease-in-out`,
    width: '100%',
}));

// Page Header Section
const PageHeader = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `20px 56px`, // Matched horizontal padding to main content
    borderBottom: `1px solid rgba(68, 122, 101, 0.2)`,
    width: `100%`,
    boxSizing: `border-box`,
    '@media (max-width: 768px)': {
        padding: `15px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `10px 15px`,
    },
});

const HeaderContent = styled("div")({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    width: '100%', // Full width to align with fluid content
    margin: `0`, 
});

const BackSection = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `10px`,
    cursor: `pointer`,
    color: `rgba(255, 232, 161, 1)`,
    transition: `all 0.3s ease`,
    '&:hover': {
        color: `rgba(255, 232, 161, 0.8)`,
    },
});

const BackArrow = styled("img")({
    width: `18px`,
    height: `16px`,
    filter: `brightness(0) saturate(100%) invert(91%) sepia(31%) saturate(457%) hue-rotate(342deg) brightness(103%) contrast(103%)`,
});

const BackText = styled("div")({
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `16px`,
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const ActionButtons = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `12px`,
    '@media (max-width: 768px)': {
        alignSelf: `auto`,
    },
    '@media (max-width: 480px)': {
        gap: `8px`,
    },
});

const ActionButton = styled("div")({
    width: `40px`,
    height: `40px`,
    backgroundColor: `transparent`,
    border: `none`,
    borderRadius: `8px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.1)`,
    },
    '@media (max-width: 480px)': {
        width: `35px`,
        height: `35px`,
    },
});

const ActionIcon = styled("img")({
    width: `20px`,
    height: `20px`,
    filter: `brightness(0) saturate(100%) invert(91%) sepia(31%) saturate(457%) hue-rotate(342deg) brightness(103%) contrast(103%)`,
    '@media (max-width: 480px)': {
        width: `18px`,
        height: `18px`,
    },
});

// Main Content Wrapper
const MainContentWrapper = styled("div")({
    width: `100%`,
    flex: 1,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `24px 56px`, // Youtube-style standard padding
    boxSizing: `border-box`,
    '@media (max-width: 1024px)': {
        padding: `20px`,
    },
    '@media (max-width: 480px)': {
        padding: `16px`,
    },
});

// --- DEFINITIVE GRID LAYOUT FIX ---
const ContentContainer = styled("div")({
    // CSS GRID: This is the key. It creates two rigid columns.
    display: `grid`,
    
    // Column 1 (Video): Takes ALL remaining space (1fr)
    // Column 2 (Sidebar): Fixed at 400px
    gridTemplateColumns: `minmax(0, 1fr) 400px`, 
    
    // FULL WIDTH: No max-width cap. This fixes the 80% zoom issue.
    width: `100%`, 
    maxWidth: `100%`, 
    
    gap: `24px`,
    alignItems: `start`, 
    
    // Mobile Breakpoint: Switch to vertical stack
    '@media (max-width: 1024px)': {
        display: `flex`,
        flexDirection: `column`,
        gap: `20px`,
    },
});

const VideoSection = styled("div")({
    // In Grid, this naturally fills the 1fr column.
    // minWidth: 0 is crucial to prevent the video from expanding the grid cell
    width: `100%`,
    minWidth: 0, 
    boxSizing: `border-box`,
    display: `flex`,
    flexDirection: `column`,
    gap: `20px`,
    alignItems: `stretch`,
});

const SidebarSection = styled("div")({
    // In Grid, this fills the 400px column.
    width: `100%`, 
    position: 'sticky',
    top: '24px',
    maxHeight: 'calc(100vh - 48px)',
    overflowY: 'auto',
    
    // Scrollbar styling
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(68, 122, 101, 0.1)',
        borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(68, 122, 101, 0.4)',
        borderRadius: '3px',
        '&:hover': {
            background: 'rgba(68, 122, 101, 0.6)',
        },
    },
    
    '@media (max-width: 1024px)': {
        display: `none`,
    },
});

// Mobile Playlist Wrapper
const MobilePlaylistWrapper = styled("div")({
    display: `none`,
    '@media (max-width: 1024px)': {
        display: `block`,
        order: -1,
        marginTop: `10px`,
    },  
});

// Desktop Playlist Wrapper
const DesktopPlaylistWrapper = styled("div")({
    display: `block`,
    '@media (max-width: 1024px)': {
        display: `none`,
    },
});

// Mobile Related Videos Wrapper
const MobileRelatedWrapper = styled("div")({
    display: `none`,
    '@media (max-width: 1024px)': {
        display: `block`,
        order: 1,
    },
});

// Desktop Related Videos Wrapper
const DesktopRelatedWrapper = styled("div")({
    display: `block`,
    '@media (max-width: 1024px)': {
        display: `none`,
    },
});

// Unified Video Container
const UnifiedVideoContainer = styled("div")({
    backgroundColor: `rgba(19, 38, 32, 1)`,
    borderRadius: `16px`,
    overflow: `hidden`,
    width: `100%`,
    boxShadow: `0 4px 30px rgba(0, 0, 0, 0.5), 0 0 100px rgba(68, 122, 101, 0.2)`,
    '@media (max-width: 1024px)': {
        order: -2,
        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`,
    },
});

const VideoPlayer = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `0`,
    paddingBottom: `56.25%`, // 16:9 aspect ratio
    backgroundColor: `#000`,
});

const PartBadge = styled("div")({
    position: `absolute`,
    top: `16px`,
    left: `16px`,
    backgroundColor: `rgba(255, 232, 161, 0.9)`,
    color: `rgba(30, 45, 39, 1)`,
    padding: `6px 12px`,
    borderRadius: `20px`,
    fontSize: `12px`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    zIndex: 2,
});

const VideoThumbnail = styled("div")({
    position: `absolute`,
    top: 0,
    left: 0,
    width: `100%`,
    height: `100%`,
    backgroundImage: `url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)`,
    backgroundSize: `cover`,
    backgroundPosition: `center`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
});

const VideoPlayerElement = styled("video")({
    position: `absolute`,
    top: 0,
    left: 0,
    width: `100%`,
    height: `100%`,
    objectFit: `cover`,
    zIndex: 1,
});

const PlayButtonOverlay = styled("div")({
    position: `absolute`,
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    width: `60px`,
    height: `60px`,
    backgroundColor: `rgba(255, 232, 161, 0.9)`,
    borderRadius: `50%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    cursor: `pointer`,
    zIndex: 3,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(255, 232, 161, 1)`,
        transform: `translate(-50%, -50%) scale(1.1)`,
    },
});

const PlayButtonIcon = styled("div")({
    width: 0,
    height: 0,
    borderLeft: `20px solid rgba(19, 38, 32, 1)`,
    borderTop: `12px solid transparent`,
    borderBottom: `12px solid transparent`,
    marginLeft: `4px`,
});

// End Screen Overlay Components
const EndScreenOverlay = styled("div")({
    position: `absolute`,
    top: 0,
    left: 0,
    width: `100%`,
    height: `100%`,
    backgroundColor: `rgba(0, 0, 0, 0.9)`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
    zIndex: 10,
    padding: `20px`,
});

const AutoPlayMessage = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontSize: `24px`,
    fontWeight: `600`,
    marginBottom: `20px`,
    textAlign: `center`,
    '@media (max-width: 768px)': {
        fontSize: `18px`,
    },
});

const CountdownTimer = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontSize: `48px`,
    fontWeight: `700`,
    marginBottom: `20px`,
    '@media (max-width: 768px)': {
        fontSize: `36px`,
    },
});

const CancelAutoPlayButton = styled("button")({
    backgroundColor: `rgba(68, 122, 101, 1)`,
    color: `rgba(255, 232, 161, 1)`,
    border: `none`,
    padding: `12px 24px`,
    borderRadius: `8px`,
    fontFamily: `DM Sans`,
    fontSize: `16px`,
    fontWeight: `600`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.8)`,
    },
});

const RelatedVideosGrid = styled("div")({
    display: `grid`,
    gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
    gap: `16px`,
    width: `100%`,
    maxWidth: `900px`,
    maxHeight: `70%`,
    overflowY: `auto`,
    padding: `20px`,
    '@media (max-width: 768px)': {
        gridTemplateColumns: `1fr`,
        maxHeight: `60%`,
    },
});

const RelatedVideoCard = styled("div")({
    backgroundColor: `rgba(19, 38, 32, 1)`,
    borderRadius: `12px`,
    overflow: `hidden`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        transform: `scale(1.05)`,
        backgroundColor: `rgba(30, 45, 39, 1)`,
    },
});

const RelatedVideoThumb = styled("div")({
    width: `100%`,
    height: `160px`,
    backgroundSize: `cover`,
    backgroundPosition: `center`,
    position: `relative`,
});

const RelatedVideoDurationBadge = styled("div")({
    position: `absolute`,
    bottom: `8px`,
    right: `8px`,
    backgroundColor: `rgba(0, 0, 0, 0.8)`,
    color: `rgba(255, 232, 161, 1)`,
    padding: `4px 8px`,
    borderRadius: `4px`,
    fontSize: `12px`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
});

const RelatedVideoCardInfo = styled("div")({
    padding: `12px`,
});

const RelatedVideoCardTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontSize: `14px`,
    fontWeight: `600`,
    marginBottom: `8px`,
    lineHeight: `1.4`,
    overflow: `hidden`,
    textOverflow: `ellipsis`,
    display: `-webkit-box`,
    WebkitLineClamp: 2,
    WebkitBoxOrient: `vertical`,
});

const RelatedVideoCardChannel = styled("div")({
    color: `rgba(205, 217, 157, 0.7)`,
    fontFamily: `DM Sans`,
    fontSize: `12px`,
    fontWeight: `400`,
});

const EndScreenTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontSize: `28px`,
    fontWeight: `700`,
    marginBottom: `30px`,
    textAlign: `center`,
    '@media (max-width: 768px)': {
        fontSize: `20px`,
        marginBottom: `20px`,
    },
});

// Video Information Section
const VideoInfoSection = styled("div")({
    padding: `24px`,
    display: `flex`,
    flexDirection: `column`,
    gap: `16px`,
});

const VideoCategoryTag = styled("div")({
    display: `inline-block`,
    backgroundColor: `rgba(68, 122, 101, 0.2)`,
    color: `rgba(255, 232, 161, 1)`,
    padding: `4px 12px`,
    borderRadius: `12px`,
    fontSize: `12px`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    marginBottom: `12px`,
    width: `fit-content`,
});

const VideoTitle = styled("h1")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `28px`,
    margin: `0 0 16px 0`,
    lineHeight: `1.3`,
    '@media (max-width: 768px)': {
        fontSize: `24px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
    },
});

const VideoMetadata = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `10px`,
    marginBottom: `20px`,
    flexWrap: 'wrap',
});

const MetadataItem = styled("div")(({ clickable, active }) => ({
    display: `flex`,
    alignItems: `center`,
    gap: `6px`,
    cursor: clickable ? `pointer` : `default`,
    padding: clickable ? `6px 10px` : `0`,
    borderRadius: clickable ? `8px` : `0`,
    backgroundColor: clickable && active ? `rgba(68, 122, 101, 0.3)` : `transparent`,
    transition: `all 0.3s ease`,
    '&:hover': clickable ? {
        backgroundColor: `rgba(68, 122, 101, 0.2)`,
    } : {},
}));

const MetadataIcon = styled("img")({
    width: `16px`,
    height: `16px`,
    filter: `brightness(0) saturate(100%) invert(91%) sepia(21%) saturate(1067%) hue-rotate(317deg) brightness(105%) contrast(102%)`,
});

const MetadataText = styled("span")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `14px`,
});

const VideoActionsSection = styled("div")({
    display: `flex`,
    gap: `16px`,
    padding: `16px 0`,
    borderBottom: `1px solid rgba(68, 122, 101, 0.2)`,
    '@media (max-width: 768px)': {
        gap: `12px`,
        padding: `12px 0`,
    },
});

const LikeDislikeButton = styled("button")(({ active }) => ({
    display: `flex`,
    alignItems: `center`,
    gap: `8px`,
    padding: `10px 20px`,
    backgroundColor: active ? `rgba(68, 122, 101, 0.3)` : `rgba(30, 45, 39, 1)`,
    border: `1px solid ${active ? 'rgba(68, 122, 101, 0.5)' : 'rgba(68, 122, 101, 0.2)'}`,
    borderRadius: `8px`,
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontSize: `14px`,
    fontWeight: `500`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.2)`,
        borderColor: `rgba(68, 122, 101, 0.4)`,
    },
    '@media (max-width: 768px)': {
        padding: `8px 16px`,
        fontSize: `13px`,
    },
}));

const LikeActionIcon = styled("img")(({ active }) => ({
    width: `18px`,
    height: `18px`,
    filter: active
        ? `brightness(0) saturate(100%) invert(91%) sepia(24%) saturate(2032%) hue-rotate(357deg) brightness(104%) contrast(101%)`
        : `brightness(0) saturate(100%) invert(74%) sepia(15%) saturate(25%) hue-rotate(81deg) brightness(94%) contrast(89%)`,
}));

const PlaylistContainer = styled("div")({
    backgroundColor: `rgba(19, 38, 32, 1)`,
    borderRadius: `16px`,
    padding: `24px`,
    height: `fit-content`,
    '@media (max-width: 1024px)': {
        backgroundColor: `transparent`,
        padding: `0`,
        borderRadius: `0`,
    },
});

const PlaylistHeader = styled("div")({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    marginBottom: `20px`,
    '@media (max-width: 1024px)': {
        marginBottom: `16px`,
        paddingLeft: `0`,
    },
});

const PlaylistTitle = styled("h3")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `18px`,
    margin: 0,
});

const PlaylistBadge = styled("div")({
    backgroundColor: `rgba(255, 232, 161, 1)`,
    color: `rgba(19, 38, 32, 1)`,
    padding: `4px 8px`,
    borderRadius: `12px`,
    fontSize: `12px`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
});

const PlaylistVideos = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    gap: `12px`,
    marginBottom: `20px`,
    '@media (max-width: 1024px)': {
        flexDirection: `row`,
        overflowX: `auto`,
        overflowY: `hidden`,
        gap: `16px`,
        marginBottom: `20px`,
        paddingBottom: `8px`,
        scrollbarWidth: `none`,
        '&::-webkit-scrollbar': {
            display: `none`,
        },
    },
});

const PlaylistVideo = styled("div")(({ isActive }) => ({
    display: `flex`,
    alignItems: `center`,
    gap: `12px`,
    padding: `12px`,
    borderRadius: `12px`,
    cursor: `pointer`,
    backgroundColor: isActive ? `rgba(68, 122, 101, 0.2)` : `rgba(19, 38, 32, 0.6)`,
    border: isActive ? `2px solid rgba(68, 122, 101, 0.8)` : `2px solid rgba(68, 122, 101, 0.2)`,
    borderLeft: isActive ? `4px solid rgba(255, 232, 161, 1)` : `2px solid rgba(68, 122, 101, 0.2)`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.3)`,
        border: `2px solid rgba(68, 122, 101, 0.6)`,
    },
    '@media (max-width: 1024px)': {
        flexDirection: `column`,
        minWidth: `50%`,
        maxWidth: `50%`,
        flexShrink: 0,
        padding: `0`,
        gap: `12px`,
        backgroundColor: `transparent`,
        border: `none`,
        borderLeft: `none`,
        '&:hover': {
            backgroundColor: `transparent`,
            border: `none`,
        },
    },
}));

const VideoThumbnailSmall = styled("div")({
    position: `relative`,
    width: `120px`,
    height: `70px`,
    backgroundColor: `#000`,
    borderRadius: `8px`,
    backgroundImage: `url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80)`,
    backgroundSize: `cover`,
    backgroundPosition: `center`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    flexShrink: 0,
    '@media (max-width: 1024px)': {
        width: `100%`,
        height: `0`,
        paddingBottom: `70%`,
        borderRadius: `16px`,
    },
});

const PlayIcon = styled("div")({
    width: `24px`,
    height: `24px`,
    backgroundColor: `rgba(255, 232, 161, 0.9)`,
    borderRadius: `50%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(255, 232, 161, 1)`,
        transform: `scale(1.05)`,
    },
    '@media (max-width: 1024px)': {
        position: `absolute`,
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        width: `48px`,
        height: `48px`,
        backgroundColor: `rgba(255, 232, 161, 1)`,
        '&:hover': {
            backgroundColor: `rgba(255, 232, 161, 1)`,
            transform: `translate(-50%, -50%) scale(1.05)`,
        },
    },
});

const PlayIconTriangle = styled("div")({
    width: 0,
    height: 0,
    borderLeft: `10px solid rgba(19, 38, 32, 1)`,
    borderTop: `6px solid transparent`,
    borderBottom: `6px solid transparent`,
    marginLeft: `2px`,
    '@media (max-width: 1024px)': {
        borderLeft: `14px solid rgba(19, 38, 32, 1)`,
        borderTop: `9px solid transparent`,
        borderBottom: `9px solid transparent`,
        marginLeft: `3px`,
    },
});

const VideoDuration = styled("div")({
    position: `absolute`,
    bottom: `4px`,
    right: `4px`,
    backgroundColor: `rgba(0, 0, 0, 0.8)`,
    color: `white`,
    padding: `2px 4px`,
    borderRadius: `4px`,
    fontSize: `10px`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    '@media (max-width: 1024px)': {
        fontSize: `10px`,
        padding: `3px 6px`,
    },
});

const VideoInfo = styled("div")({
    flex: 1,
    display: `flex`,
    alignItems: `center`,
    gap: `8px`,
    '@media (max-width: 1024px)': {
        flexDirection: `row`,
        alignItems: `center`,
        gap: `8px`,
        width: `100%`,
        marginTop: `8px`,
    },
});

const VideoNumber = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `14px`,
    minWidth: `28px`,
    height: `28px`,
    backgroundColor: `rgba(68, 122, 101, 1)`,
    borderRadius: `50%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    flexShrink: 0,
    '@media (max-width: 1024px)': {
        minWidth: `32px`,
        height: `32px`,
        fontSize: `16px`,
        fontWeight: `700`,
    },
});

const VideoTitleSmall = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `14px`,
    lineHeight: `1.3`,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    '@media (max-width: 1024px)': {
        fontSize: `14px`,
        lineHeight: `1.4`,
        fontWeight: `500`,
        flex: 1,
    },
});

const PlaylistActions = styled("div")({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    gap: `12px`,
    '@media (max-width: 1024px)': {
        display: `none`,
    },
});

const ActionButtonPlaylist = styled("button")({
    flex: 1,
    height: `48px`,
    backgroundColor: `rgba(255, 232, 161, 0.1)`,
    borderRadius: `8px`,
    border: `1px solid rgba(255, 232, 161, 0.2)`,
    cursor: `pointer`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    gap: `8px`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `14px`,
    color: `rgba(255, 232, 161, 1)`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(255, 232, 161, 0.2)`,
    },
});

const NextButton = styled("button")({
    flex: 1,
    backgroundColor: `rgba(68, 122, 101, 1)`,
    color: `rgba(255, 232, 161, 1)`,
    border: `none`,
    borderRadius: `8px`,
    padding: `14px 18px`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `14px`,
    cursor: `pointer`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    gap: `8px`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.8)`,
    },
});

const NavigationIcon = styled("img")({
    width: `16px`,
    height: `16px`,
    filter: `brightness(0) saturate(100%) invert(91%) sepia(31%) saturate(457%) hue-rotate(342deg) brightness(103%) contrast(103%)`,
});

// Related Videos Section Components
const RelatedVideosContainer = styled("div")({
    backgroundColor: `rgba(19, 38, 32, 1)`,
    borderRadius: `16px`,
    padding: `24px`,
    marginTop: `20px`,
    height: `fit-content`,
    '@media (max-width: 1024px)': {
        marginTop: `0`,
    },
});

const RelatedVideosHeader = styled("div")({
    marginBottom: `20px`,
});

const RelatedVideosTitle = styled("h3")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `18px`,
    margin: 0,
});

const RelatedVideosList = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    gap: `16px`,
    marginBottom: `20px`,
});

const RelatedVideoItem = styled("div")({
    display: `flex`,
    alignItems: `flex-start`,
    gap: `12px`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.1)`,
    },
    borderRadius: `8px`,
    padding: `8px`,
});

const RelatedVideoThumbnail = styled("div")({
    position: `relative`,
    width: `120px`,
    height: `70px`,
    backgroundColor: `#000`,
    borderRadius: `8px`,
    backgroundImage: `url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80)`,
    backgroundSize: `cover`,
    backgroundPosition: `center`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    flexShrink: 0,
});

const RelatedPlayIcon = styled("div")({
    width: `24px`,
    height: `24px`,
    backgroundColor: `rgba(255, 232, 161, 0.9)`,
    borderRadius: `50%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(255, 232, 161, 1)`,
        transform: `scale(1.05)`,
    },
});

const RelatedPlayIconTriangle = styled("div")({
    width: 0,
    height: 0,
    borderLeft: `8px solid rgba(19, 38, 32, 1)`,
    borderTop: `5px solid transparent`,
    borderBottom: `5px solid transparent`,
    marginLeft: `2px`,
});

const RelatedVideoDuration = styled("div")({
    position: `absolute`,
    bottom: `4px`,
    right: `4px`,
    backgroundColor: `rgba(0, 0, 0, 0.8)`,
    color: `white`,
    padding: `2px 4px`,
    borderRadius: `4px`,
    fontSize: `10px`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
});

const RelatedVideoInfo = styled("div")({
    flex: 1,
    display: `flex`,
    flexDirection: `column`,
    gap: `4px`,
});

const RelatedVideoTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `14px`,
    lineHeight: `1.3`,
    marginBottom: `4px`,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
});

const RelatedVideoAuthor = styled("div")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `12px`,
});

const RelatedVideoMeta = styled("div")({
    color: `rgba(205, 217, 157, 0.7)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `11px`,
});

const ViewAllVideosButton = styled("button")({
    width: `100%`,
    backgroundColor: `rgba(255, 232, 161, 0.1)`,
    color: `rgba(255, 232, 161, 1)`,
    border: `1px solid rgba(255, 232, 161, 0.3)`,
    borderRadius: `8px`,
    padding: `12px 16px`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `14px`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(255, 232, 161, 0.2)`,
        borderColor: `rgba(255, 232, 161, 0.5)`,
    },
});

// Overview and Comments Components
// MIN-HEIGHT STABILITY FIX
const OverviewContainer = styled("div")({
    backgroundColor: `rgba(19, 38, 32, 1)`,
    borderRadius: `16px`,
    overflow: `hidden`,
    width: `100%`,
    display: `block`,
    minHeight: `600px`, // Ensures page height stability
    boxSizing: `border-box`,
    '@media (max-width: 1024px)': {
        order: 0,
        minHeight: `auto`,
    },
});

const CommentsContainer = styled("div")({
    backgroundColor: `rgba(19, 38, 32, 1)`,
    borderRadius: `16px`,
    overflow: `hidden`,
    width: `100%`,
    display: `block`,
    minHeight: `600px`, // Matching min-height for stability
    boxSizing: `border-box`,
    '@media (max-width: 1024px)': {
        order: 0,
        minHeight: `auto`,
    },
});

const OverviewContent = styled("div")({
    padding: `32px`,
    width: `100%`,
    boxSizing: `border-box`,
});

const OverviewTitle = styled("h3")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `18px`,
    margin: `0 0 16px 0`,
});

const OverviewDescription = styled("p")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `14px`,
    lineHeight: `1.6`,
    margin: `0 0 16px 0`,
});

const OverviewParagraph = styled("p")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `14px`,
    lineHeight: `1.6`,
    margin: `0 0 16px 0`,
});

const OverviewTagsSection = styled("div")({
    marginTop: `20px`,
});

const OverviewTagsTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `14px`,
    margin: `0 0 12px 0`,
});

const OverviewTags = styled("div")({
    display: `flex`,
    flexWrap: `wrap`,
    gap: `8px`,
});

const OverviewTag = styled("span")({
    backgroundColor: `rgba(68, 122, 101, 0.3)`,
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `12px`,
    padding: `4px 8px`,
    borderRadius: `12px`,
    border: `1px solid rgba(68, 122, 101, 0.5)`,
});

const CommentsContent = styled("div")({
    padding: `32px`,
    width: `100%`,
    boxSizing: `border-box`,
});

const CommentsHeader = styled("div")({
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
    marginBottom: `24px`,
});

const CommentsCount = styled("h3")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `18px`,
    margin: 0,
});

const CommentsList = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    gap: `24px`,
    '@media (max-width: 768px)': {
        gap: `16px`,
    },
});

const CommentItem = styled("div")({
    display: `flex`,
    gap: `16px`,
    '@media (max-width: 768px)': {
        gap: `12px`,
    },
});

const CommentAvatarWrapper = styled("div")({
    flexShrink: 0,
});

const CommentLikeButton = styled("button")({
    background: `transparent`,
    border: `none`,
    cursor: `pointer`,
    padding: `8px 12px`,
    display: `flex`,
    alignItems: `center`,
    gap: `8px`,
    borderRadius: `20px`,
    transition: `all 0.3s ease`,
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontSize: `13px`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.2)`,
    },
});

const CommentLikeIcon = styled("img")({
    width: `16px`,
    height: `16px`,
    filter: `brightness(0) saturate(100%) invert(91%) sepia(31%) saturate(457%) hue-rotate(342deg) brightness(103%) contrast(103%)`,
    '@media (max-width: 768px)': {
        width: `14px`,
        height: `14px`,
    },
});

const CommentRightSection = styled("div")({
    flex: 1,
    display: `flex`,
    flexDirection: `column`,
    gap: `8px`,
});

const CommentAuthorSection = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `12px`,
});

const CommentAvatar = styled("div")({
    width: `40px`,
    height: `40px`,
    borderRadius: `50%`,
    backgroundColor: `rgba(68, 122, 101, 1)`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `14px`,
    flexShrink: 0,
    '@media (max-width: 768px)': {
        width: `32px`,
        height: `32px`,
        fontSize: `12px`,
    },
});

const CommentAuthorInfo = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    gap: `2px`,
});

const CommentAuthorName = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `14px`,
    '@media (max-width: 768px)': {
        fontSize: `13px`,
    },
});

const CommentTime = styled("div")({
    color: `rgba(205, 217, 157, 0.7)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `12px`,
    '@media (max-width: 768px)': {
        fontSize: `11px`,
    },
});

const CommentText = styled("p")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `14px`,
    lineHeight: `1.6`,
    margin: `8px 0`,
    '@media (max-width: 768px)': {
        fontSize: `13px`,
        lineHeight: `1.5`,
        margin: `6px 0`,
    },
});

const CancelReplyButton = styled("button")({
    backgroundColor: `transparent`,
    border: `none`,
    color: `rgba(205, 217, 157, 0.8)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `14px`,
    cursor: `pointer`,
    padding: `8px 16px`,
    borderRadius: `8px`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.2)`,
        color: `rgba(205, 217, 157, 1)`,
    },
    '@media (max-width: 768px)': {
        fontSize: `13px`,
        padding: `6px 12px`,
    },
});

const SubmitReplyButton = styled("button")({
    backgroundColor: `rgba(68, 122, 101, 1)`,
    border: `none`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `14px`,
    cursor: `pointer`,
    padding: `8px 20px`,
    borderRadius: `8px`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.8)`,
    },
    '&:disabled': {
        backgroundColor: `rgba(68, 122, 101, 0.5)`,
        cursor: `not-allowed`,
    },
    '@media (max-width: 768px)': {
        fontSize: `13px`,
        padding: `6px 16px`,
    },
});

const ReplyInputContainer = styled("div")({
    marginTop: `16px`,
    padding: `16px`,
    backgroundColor: `rgba(19, 38, 32, 0.5)`,
    borderRadius: `12px`,
    border: `1px solid rgba(68, 122, 101, 0.3)`,
    '@media (max-width: 768px)': {
        marginTop: `12px`,
        padding: `12px`,
    },
});

const ReplyInputBox = styled("textarea")({
    width: `100%`,
    minHeight: `80px`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    border: `1px solid rgba(68, 122, 101, 0.3)`,
    borderRadius: `8px`,
    padding: `12px`,
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontSize: `14px`,
    resize: `vertical`,
    outline: `none`,
    transition: `all 0.3s ease`,
    '&:focus': {
        borderColor: `rgba(68, 122, 101, 0.6)`,
        backgroundColor: `rgba(30, 45, 39, 1)`,
    },
    '&::placeholder': {
        color: `rgba(205, 217, 157, 0.5)`,
    },
    '@media (max-width: 768px)': {
        minHeight: `70px`,
        padding: `10px`,
        fontSize: `13px`,
    },
});

const ReplyActions = styled("div")({
    display: `flex`,
    justifyContent: `flex-end`,
    gap: `12px`,
    marginTop: `12px`,
    '@media (max-width: 768px)': {
        gap: `8px`,
        marginTop: `10px`,
    },
});

function VideoDetailPage() {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const [isMobile, setIsMobile] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSection, setActiveSection] = useState('about');
    const [showReplies, setShowReplies] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [replyText, setReplyText] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    
    // Dynamic data state
    const [videoData, setVideoData] = useState(null);
    const [seriesVideos, setSeriesVideos] = useState([]);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [autoPlayCancelled, setAutoPlayCancelled] = useState(false);
    
    // Likes/Dislikes state
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userVote, setUserVote] = useState(null);
    
    // Comments state
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    // Fetch video data
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                setFadeOut(true);
                await new Promise(resolve => setTimeout(resolve, 150));
                
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
                const response = await fetch(`${apiUrl}/videos/${videoId}`);
                
                if (!response.ok) {
                    throw new Error('Video not found');
                }
                
                const data = await response.json();
                setVideoData(data.video);
                setSeriesVideos(data.series_videos || []);
                setRelatedVideos(data.related_videos || []);
                
                if (data.series_videos && data.series_videos.length > 0) {
                    const currentIndex = data.series_videos.findIndex(v => v.is_current);
                    setCurrentSeriesIndex(currentIndex !== -1 ? currentIndex : 0);
                }
                
                setLoading(false);
                setVideoEnded(false);
                setAutoPlayCancelled(false);
                setIsPlaying(false);
                
                await new Promise(resolve => setTimeout(resolve, 50));
                setFadeOut(false);
            } catch (err) {
                console.error('Error fetching video:', err);
                setError(err.message);
                setLoading(false);
                setFadeOut(false);
            }
        };
        
        if (videoId) {
            fetchVideoData();
        }
    }, [videoId]);
    
    useEffect(() => {
        if (videoId) {
            fetchLikes();
            fetchComments();
        }
    }, [videoId]);
    
    // Helper function to format duration
    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };
    
    // Helper function to format views
    const formatViews = (views) => {
        if (!views) return '0 views';
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
        return `${views} views`;
    };

    const handleBackToVideos = () => {
        navigate('/community/videos');
    };

    const handleSave = () => console.log('Save video');
    const handleShare = () => console.log('Share video');

    const handlePlayVideo = () => {
        setIsPlaying(true);
        setVideoEnded(false);
        setAutoPlayCancelled(false);
        incrementViewCount();
    };
    
    const incrementViewCount = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            const response = await fetch(`${apiUrl}/videos/${videoId}/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (videoData) {
                    setVideoData({ ...videoData, views: data.views });
                }
            }
        } catch (err) {
            console.error('Error incrementing view count:', err);
        }
    };
    
    const handleVideoEnded = () => {
        setVideoEnded(true);
        setIsPlaying(false);
        setCountdown(3);
    };
    
    const handleCancelAutoPlay = () => {
        setAutoPlayCancelled(true);
    };
    
    // Save watch progress
    const saveWatchProgress = async (currentTime, duration) => {
        if (!videoData) return;
        
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : '00000000-0000-0000-0000-000000000000';
            
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            await fetch(`${apiUrl}/videos/${videoId}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': userId
                },
                body: JSON.stringify({
                    current_time: currentTime,
                    duration: duration,
                    video_type: videoData.type
                })
            });
        } catch (err) {
            console.error('Error saving progress:', err);
        }
    };

    const [resumeTime, setResumeTime] = useState(0);

    // Fetch saved progress
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const headers = {};
                if (userStr) headers['X-User-ID'] = JSON.parse(userStr).id;
                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
                const res = await fetch(`${apiUrl}/videos/${videoId}/progress`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    setResumeTime(data.current_time || 0);
                }
            } catch (e) {
                // ignore
            }
        };

        if (videoId) fetchProgress();
    }, [videoId]);

    // Apply resume time
    useEffect(() => {
        if (!isPlaying) return;
        const videoElement = document.querySelector('video');
        if (!videoElement) return;

        const applyResume = () => {
            if (resumeTime && resumeTime > 0 && videoElement.duration && resumeTime < videoElement.duration - 1) {
                try { videoElement.currentTime = resumeTime; } catch (e) {}
            }
            videoElement.play().catch(() => {});
        };

        if (videoElement.readyState >= 1) applyResume();
        else videoElement.addEventListener('loadedmetadata', applyResume, { once: true });

        return () => {
            if (videoElement) videoElement.removeEventListener('loadedmetadata', applyResume);
        };
    }, [isPlaying, resumeTime, videoId]);

    const fetchLikes = async () => {
        if (!videoId) return;
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : '00000000-0000-0000-0000-000000000000';
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            const response = await fetch(`${apiUrl}/videos/${videoId}/likes`, {
                headers: { 'X-User-ID': userId }
            });
            
            if (response.ok) {
                const data = await response.json();
                setLikes(data.likes || 0);
                setDislikes(data.dislikes || 0);
                setUserVote(data.user_vote);
            }
        } catch (err) {
            console.error('Error fetching likes:', err);
        }
    };
    
    const handleVote = async (vote) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to like/dislike videos');
            return;
        }
        
        try {
            const userId = JSON.parse(userStr).id;
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            const response = await fetch(`${apiUrl}/videos/${videoId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': userId
                },
                body: JSON.stringify({ vote })
            });
            
            if (response.ok) {
                await fetchLikes();
            }
        } catch (err) {
            console.error('Error voting:', err);
        }
    };
    
    const fetchComments = async () => {
        if (!videoId) return;
        try {
            setCommentsLoading(true);
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            const response = await fetch(`${apiUrl}/videos/${videoId}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments || []);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setCommentsLoading(false);
        }
    };
    
    const handleAddComment = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to comment');
            return;
        }
        
        if (!newComment.trim()) return;
        
        try {
            const userId = JSON.parse(userStr).id;
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            const response = await fetch(`${apiUrl}/videos/${videoId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': userId
                },
                body: JSON.stringify({ content: newComment })
            });
            
            if (response.ok) {
                setNewComment('');
                await fetchComments();
            }
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };
    
    const handleAddReply = async () => {
        if (!replyText[replyingTo?.id]?.trim() || !replyingTo) return;
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to reply');
            return;
        }
        
        try {
            const userId = JSON.parse(userStr).id;
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            const response = await fetch(`${apiUrl}/videos/${videoData.slug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': userId
                },
                body: JSON.stringify({
                    content: replyText[replyingTo.id],
                    parent_id: replyingTo.id
                })
            });
            
            if (response.ok) {
                setReplyText(prev => ({ ...prev, [replyingTo.id]: '' }));
                setReplyingTo(null);
                await fetchComments();
            }
        } catch (err) {
            console.error('Error adding reply:', err);
        }
    };
    
    const handleCommentLike = async (commentId) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to like comments');
            return;
        }
        try {
            const userId = JSON.parse(userStr).id;
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            const response = await fetch(`${apiUrl}/videos/comments/${commentId}/like`, {
                method: 'POST',
                headers: { 'X-User-ID': userId }
            });
            if (response.ok) {
                await fetchComments();
            }
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };
    
    const fetchReplies = async (commentId) => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            const response = await fetch(`${apiUrl}/videos/comments/${commentId}/replies`);
            if (response.ok) {
                const data = await response.json();
                setComments(prevComments => 
                    prevComments.map(comment => 
                        comment.id === commentId 
                            ? { ...comment, replies: data.replies || [] }
                            : comment
                    )
                );
            }
        } catch (err) {
            console.error('Error fetching replies:', err);
        }
    };
    
    const toggleReplies = async (commentId) => {
        const comment = comments.find(c => c.id === commentId);
        if (showReplies[commentId]) {
            setShowReplies(prev => ({ ...prev, [commentId]: false }));
        } else {
            if (!comment.replies || comment.replies.length === 0) {
                await fetchReplies(commentId);
            }
            setShowReplies(prev => ({ ...prev, [commentId]: true }));
        }
    };
    
    const handleEditComment = async (commentId, newContent) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        try {
            const userId = JSON.parse(userStr).id;
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
            const response = await fetch(`${apiUrl}/videos/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': userId
                },
                body: JSON.stringify({ content: newContent })
            });
            if (response.ok) {
                await fetchComments();
            }
        } catch (err) {
            console.error('Error editing comment:', err);
        }
    };
    
    useEffect(() => {
        if (!isPlaying) return;
        const videoElement = document.querySelector('video');
        if (!videoElement) return;
        
        const interval = setInterval(() => {
            const currentTime = videoElement.currentTime;
            const duration = videoElement.duration;
            if (currentTime > 0 && duration > 0) {
                saveWatchProgress(currentTime, duration);
            }
        }, 5000);
        
        return () => clearInterval(interval);
    }, [isPlaying, videoId, videoData]);
    
    useEffect(() => {
        if (videoEnded && !autoPlayCancelled && videoData?.type === 'series' && currentSeriesIndex < seriesVideos.length - 1) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleNextVideo();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [videoEnded, autoPlayCancelled, currentSeriesIndex, seriesVideos.length, videoData]);

    const handleViewAllVideos = () => navigate('/community/videos');
    const handleToggleSection = (section) => setActiveSection(section);
    
    const handleSeriesVideoClick = (slug) => navigate(`/community/video/${slug}`);
    
    const handlePreviousVideo = () => {
        if (currentSeriesIndex > 0 && seriesVideos.length > 0) {
            const prevVideo = seriesVideos[currentSeriesIndex - 1];
            navigate(`/community/video/${prevVideo.slug}`);
        }
    };
    
    const handleNextVideo = () => {
        if (currentSeriesIndex < seriesVideos.length - 1 && seriesVideos.length > 0) {
            const nextVideo = seriesVideos[currentSeriesIndex + 1];
            navigate(`/community/video/${nextVideo.slug}`);
        }
    };
    
    const handleRelatedVideoClick = (slug) => navigate(`/community/video/${slug}`);
    
    if (loading) {
        return (
            <VideoDetailContainer>
                <PageHeader>
                    <HeaderContent>
                        <BackSection onClick={handleBackToVideos}>
                            <BackArrow src={BackIcon} alt="Back" />
                            <BackText>Back to Videos</BackText>
                        </BackSection>
                    </HeaderContent>
                </PageHeader>
                <div style={{ color: 'rgba(255, 232, 161, 1)', padding: '40px', textAlign: 'center', fontFamily: 'DM Sans' }}>
                    Loading video...
                </div>
            </VideoDetailContainer>
        );
    }
    
    if (error || !videoData) {
        return (
            <VideoDetailContainer>
                <PageHeader>
                    <HeaderContent>
                        <BackSection onClick={handleBackToVideos}>
                            <BackArrow src={BackIcon} alt="Back" />
                            <BackText>Back to Videos</BackText>
                        </BackSection>
                    </HeaderContent>
                </PageHeader>
                <div style={{ color: 'rgba(255, 232, 161, 1)', padding: '40px', textAlign: 'center', fontFamily: 'DM Sans' }}>
                    {error || 'Video not found'}
                </div>
            </VideoDetailContainer>
        );
    }
    
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
    const baseUrl = apiUrl.replace('/api/v1', '');

    return (
        <VideoDetailContainer>
            <PageHeader>
                <HeaderContent>
                    <BackSection onClick={handleBackToVideos}>
                        <BackArrow src={BackIcon} alt="Back" />
                        <BackText>Back to Videos</BackText>
                    </BackSection>
                    
                    <ActionButtons>
                        <ActionButton onClick={handleSave}>
                            <ActionIcon src={saveIcon} alt="Save" />
                        </ActionButton>
                        <ActionButton onClick={handleShare}>
                            <ActionIcon src={shareIcon} alt="Share" />
                        </ActionButton>
                    </ActionButtons>
                </HeaderContent>
            </PageHeader>

            <FadeContainer fade={fadeOut}>
                <MainContentWrapper>
                    <ContentContainer>
                        <VideoSection>
                            <UnifiedVideoContainer>
                                <VideoPlayer>
                                    {videoData.type === 'series' && (
                                        <PartBadge>Part {videoData.episode_number} of {videoData.total_episodes}</PartBadge>
                                    )}
                                    <VideoThumbnail style={{ backgroundImage: `url(${baseUrl}${videoData.thumbnail_url})` }} />
                                    <VideoPlayerElement 
                                        controls={isPlaying}
                                        style={{ display: isPlaying ? 'block' : 'none' }}
                                        onEnded={handleVideoEnded}
                                    >
                                        <source src={`${baseUrl}${videoData.video_url}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </VideoPlayerElement>
                                    {!isPlaying && !videoEnded && (
                                        <PlayButtonOverlay onClick={handlePlayVideo}>
                                            <PlayButtonIcon />
                                        </PlayButtonOverlay>
                                    )}
                                    
                                    {videoEnded && (
                                        <EndScreenOverlay>
                                            {videoData.type === 'series' && currentSeriesIndex < seriesVideos.length - 1 && !autoPlayCancelled ? (
                                                <>
                                                    <AutoPlayMessage>Up Next</AutoPlayMessage>
                                                    <CountdownTimer>{countdown}</CountdownTimer>
                                                    <AutoPlayMessage style={{ fontSize: '18px', marginBottom: '30px' }}>
                                                        {seriesVideos[currentSeriesIndex + 1]?.title}
                                                    </AutoPlayMessage>
                                                    <CancelAutoPlayButton onClick={handleCancelAutoPlay}>
                                                        Cancel
                                                    </CancelAutoPlayButton>
                                                </>
                                            ) : (
                                                <>
                                                    <EndScreenTitle>Watch More Videos</EndScreenTitle>
                                                    <RelatedVideosGrid>
                                                        {relatedVideos.slice(0, 6).map((relVideo) => (
                                                            <RelatedVideoCard 
                                                                key={relVideo.id}
                                                                onClick={() => handleRelatedVideoClick(relVideo.slug)}
                                                            >
                                                                <RelatedVideoThumb style={{ backgroundImage: `url(${baseUrl}${relVideo.thumbnail_url})` }}>
                                                                    <RelatedVideoDurationBadge>
                                                                        {formatDuration(relVideo.duration)}
                                                                    </RelatedVideoDurationBadge>
                                                                </RelatedVideoThumb>
                                                                <RelatedVideoCardInfo>
                                                                    <RelatedVideoCardTitle>{relVideo.title}</RelatedVideoCardTitle>
                                                                    <RelatedVideoCardChannel>
                                                                        {relVideo.type === 'series' ? relVideo.series_name : relVideo.channel_name}
                                                                    </RelatedVideoCardChannel>
                                                                </RelatedVideoCardInfo>
                                                            </RelatedVideoCard>
                                                        ))}
                                                    </RelatedVideosGrid>
                                                </>
                                            )}
                                        </EndScreenOverlay>
                                    )}
                                </VideoPlayer>

                                <VideoInfoSection>
                                    {videoData.tags && videoData.tags.length > 0 && (
                                        <VideoCategoryTag>{videoData.tags[0]}</VideoCategoryTag>
                                    )}

                                    <VideoTitle>{videoData.title}</VideoTitle>

                                    <VideoMetadata>
                                        <MetadataItem clickable={false}>
                                            <MetadataIcon src={eyeIcon} alt="Views" />
                                            <MetadataText>{formatViews(videoData.views)}</MetadataText>
                                        </MetadataItem>
                                        <MetadataItem clickable={false}>
                                            <MetadataIcon src={calenderIcon} alt="Date" />
                                            <MetadataText>{formatDate(videoData.created_at)}</MetadataText>
                                        </MetadataItem>
                                        <MetadataItem clickable={false}>
                                            <MetadataIcon src={timeIcon} alt="Duration" />
                                            <MetadataText>{formatDuration(videoData.duration)}</MetadataText>
                                        </MetadataItem>
                                        <MetadataItem 
                                            clickable={true} 
                                            active={activeSection === 'about'}
                                            onClick={() => handleToggleSection('about')}
                                        >
                                            <MetadataIcon src={aboutIcon} alt="About" />
                                            <MetadataText>About</MetadataText>
                                        </MetadataItem>
                                        <MetadataItem 
                                            clickable={true} 
                                            active={activeSection === 'comments'}
                                            onClick={() => handleToggleSection('comments')}
                                        >
                                            <MetadataIcon src={commentsIcon} alt="Comments" />
                                            <MetadataText>Comments</MetadataText>
                                        </MetadataItem>
                                    </VideoMetadata>
                                    
                                    <VideoActionsSection>
                                        <LikeDislikeButton 
                                            active={userVote === 1}
                                            onClick={() => handleVote(1)}
                                        >
                                            <LikeActionIcon src={likeIcon} alt="Like" active={userVote === 1} />
                                            <span>{likes}</span>
                                        </LikeDislikeButton>
                                        <LikeDislikeButton 
                                            active={userVote === -1}
                                            onClick={() => handleVote(-1)}
                                        >
                                            <LikeActionIcon src={dislikeIcon} alt="Dislike" active={userVote === -1} />
                                            <span>{dislikes}</span>
                                        </LikeDislikeButton>
                                    </VideoActionsSection>
                                </VideoInfoSection>
                            </UnifiedVideoContainer>

                            {activeSection === 'about' ? (
                                <OverviewContainer>
                                    <OverviewContent>
                                        <OverviewTitle>About this video</OverviewTitle>
                                        <OverviewDescription style={{ whiteSpace: 'pre-wrap' }}>
                                            {videoData.description || 'No description available.'}
                                        </OverviewDescription>
                                        
                                        {videoData.subtitle && (
                                            <OverviewParagraph>
                                                {videoData.subtitle}
                                            </OverviewParagraph>
                                        )}
                                        
                                        {videoData.hashtags && (
                                            <OverviewTagsSection>
                                                <OverviewTagsTitle>Hashtags</OverviewTagsTitle>
                                                <OverviewTags>
                                                    {videoData.hashtags.split(' ').filter(h => h.trim()).map((hashtag, index) => (
                                                        <OverviewTag key={index}>{hashtag}</OverviewTag>
                                                    ))}
                                                </OverviewTags>
                                            </OverviewTagsSection>
                                        )}
                                    </OverviewContent>
                                </OverviewContainer>
                            ) : (
                                <CommentsContainer>
                                    <CommentsContent>
                                        <CommentsHeader>
                                            <CommentsCount>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</CommentsCount>
                                        </CommentsHeader>
                                        
                                        <ReplyInputContainer style={{ marginBottom: '24px' }}>
                                            <ReplyInputBox 
                                                placeholder="Add a comment..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            <ReplyActions>
                                                <CancelReplyButton onClick={() => setNewComment('')}>
                                                    Clear
                                                </CancelReplyButton>
                                                <SubmitReplyButton 
                                                    onClick={handleAddComment}
                                                    disabled={!newComment.trim()}
                                                >
                                                    Comment
                                                </SubmitReplyButton>
                                            </ReplyActions>
                                        </ReplyInputContainer>

                                        {commentsLoading ? (
                                            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(205, 217, 157, 0.7)' }}>
                                                Loading comments...
                                            </div>
                                        ) : comments.length === 0 ? (
                                            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(205, 217, 157, 0.7)' }}>
                                                No comments yet. Be the first to comment!
                                            </div>
                                        ) : (
                                            <CommentsList>
                                                {comments.map((comment) => (
                                                    <CommentItem key={comment.id}>
                                                        <CommentAvatarWrapper>
                                                            <CommentAvatar>
                                                                {comment.user.username.substring(0, 2).toUpperCase()}
                                                            </CommentAvatar>
                                                        </CommentAvatarWrapper>

                                                        <CommentRightSection>
                                                            <CommentAuthorSection>
                                                                <CommentAuthorInfo>
                                                                    <div>
                                                                        <CommentAuthorName>
                                                                            {comment.user.username}
                                                                        </CommentAuthorName>
                                                                    </div>
                                                                    <CommentTime>
                                                                        {new Date(comment.created_at).toLocaleString()}
                                                                    </CommentTime>
                                                                </CommentAuthorInfo>
                                                            </CommentAuthorSection>

                                                            {editingComment === comment.id ? (
                                                                <ReplyInputContainer style={{ marginTop: '12px' }}>
                                                                    <ReplyInputBox 
                                                                        value={editText}
                                                                        onChange={(e) => setEditText(e.target.value)}
                                                                        autoFocus
                                                                    />
                                                                    <ReplyActions>
                                                                        <CancelReplyButton onClick={() => {
                                                                            setEditingComment(null);
                                                                            setEditText('');
                                                                        }}>
                                                                            Cancel
                                                                        </CancelReplyButton>
                                                                        <SubmitReplyButton 
                                                                            onClick={() => {
                                                                                handleEditComment(comment.id, editText);
                                                                                setEditingComment(null);
                                                                                setEditText('');
                                                                            }}
                                                                            disabled={!editText.trim()}
                                                                        >
                                                                            Save
                                                                        </SubmitReplyButton>
                                                                    </ReplyActions>
                                                                </ReplyInputContainer>
                                                            ) : (
                                                                <CommentText>{comment.content}</CommentText>
                                                            )}
                                                            
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                                                <CommentLikeButton onClick={() => handleCommentLike(comment.id)}>
                                                                    <CommentLikeIcon src={likeIcon} alt="Like" />
                                                                    {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
                                                                </CommentLikeButton>
                                                                <CancelReplyButton 
                                                                    onClick={() => setReplyingTo({ id: comment.id, username: comment.user.username })}
                                                                    style={{ fontSize: '13px', padding: '8px 12px' }}
                                                                >
                                                                    Reply
                                                                </CancelReplyButton>
                                                                {(() => {
                                                                    const userStr = localStorage.getItem('user');
                                                                    if (userStr) {
                                                                        const currentUser = JSON.parse(userStr);
                                                                        if (currentUser.id === comment.user.id) {
                                                                            return (
                                                                                <CancelReplyButton 
                                                                                    onClick={() => {
                                                                                        setEditingComment(comment.id);
                                                                                        setEditText(comment.content);
                                                                                    }}
                                                                                    style={{ fontSize: '13px', padding: '8px 12px' }}
                                                                                >
                                                                                    Edit
                                                                                </CancelReplyButton>
                                                                            );
                                                                        }
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </div>
                                                            
                                                            {replyingTo?.id === comment.id && (
                                                                <ReplyInputContainer style={{ marginTop: '12px' }}>
                                                                    <ReplyInputBox 
                                                                        placeholder={`Replying to ${replyingTo.username}...`}
                                                                        value={replyText[comment.id] || ''}
                                                                        onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                                                        autoFocus
                                                                    />
                                                                    <ReplyActions>
                                                                        <CancelReplyButton onClick={() => {
                                                                            setReplyingTo(null);
                                                                            setReplyText(prev => ({ ...prev, [comment.id]: '' }));
                                                                        }}>
                                                                            Cancel
                                                                        </CancelReplyButton>
                                                                        <SubmitReplyButton 
                                                                            onClick={handleAddReply}
                                                                            disabled={!replyText[comment.id]?.trim()}
                                                                        >
                                                                            Reply
                                                                        </SubmitReplyButton>
                                                                    </ReplyActions>
                                                                </ReplyInputContainer>
                                                            )}
                                                            
                                                            {comment.replies_count > 0 && (
                                                                <>
                                                                    <CancelReplyButton
                                                                        onClick={() => toggleReplies(comment.id)}
                                                                        style={{ 
                                                                            marginTop: '12px',
                                                                            fontSize: '13px', 
                                                                            padding: '8px 12px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px'
                                                                        }}
                                                                    >
                                                                        {showReplies[comment.id] ? '▼' : '▶'} {comment.replies_count} {comment.replies_count === 1 ? 'reply' : 'replies'}
                                                                    </CancelReplyButton>
                                                                    
                                                                    {showReplies[comment.id] && comment.replies && (
                                                                        <div style={{ 
                                                                            marginTop: '16px', 
                                                                            paddingLeft: '16px',
                                                                            borderLeft: '2px solid rgba(68, 122, 101, 0.3)'
                                                                        }}>
                                                                            {comment.replies.map((reply) => (
                                                                                <CommentItem key={reply.id} style={{ marginBottom: '12px' }}>
                                                                                    <CommentAvatarWrapper>
                                                                                        <CommentAvatar style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                                                            {reply.user.username.substring(0, 2).toUpperCase()}
                                                                                        </CommentAvatar>
                                                                                    </CommentAvatarWrapper>
                                                                                    
                                                                                    <CommentRightSection>
                                                                                        <CommentAuthorSection>
                                                                                            <CommentAuthorInfo>
                                                                                                <CommentAuthorName style={{ fontSize: '13px' }}>
                                                                                                    {reply.user.username}
                                                                                                </CommentAuthorName>
                                                                                                <CommentTime style={{ fontSize: '11px' }}>
                                                                                                    {new Date(reply.created_at).toLocaleString()}
                                                                                                </CommentTime>
                                                                                            </CommentAuthorInfo>
                                                                                        </CommentAuthorSection>
                                                                                        
                                                                                        <CommentText style={{ fontSize: '13px' }}>{reply.content}</CommentText>
                                                                                        
                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                                                                            <CommentLikeButton onClick={() => handleCommentLike(reply.id)}>
                                                                                                <CommentLikeIcon src={likeIcon} alt="Like" />
                                                                                                {reply.likes_count > 0 && <span>{reply.likes_count}</span>}
                                                                                            </CommentLikeButton>
                                                                                            {(() => {
                                                                                                const userStr = localStorage.getItem('user');
                                                                                                if (userStr) {
                                                                                                    const currentUser = JSON.parse(userStr);
                                                                                                    if (currentUser.id === reply.user_id) {
                                                                                                        return (
                                                                                                            <CancelReplyButton 
                                                                                                                onClick={() => {
                                                                                                                    setEditingComment(reply.id);
                                                                                                                    setEditText(reply.content);
                                                                                                                }}
                                                                                                                style={{ fontSize: '12px', padding: '6px 10px' }}
                                                                                                            >
                                                                                                                Edit
                                                                                                            </CancelReplyButton>
                                                                                                        );
                                                                                                    }
                                                                                                }
                                                                                                return null;
                                                                                            })()}
                                                                                        </div>
                                                                                    </CommentRightSection>
                                                                                </CommentItem>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </CommentRightSection>
                                                    </CommentItem>
                                                ))}
                                            </CommentsList>
                                        )}
                                    </CommentsContent>
                                </CommentsContainer>
                            )}

                            {videoData.type === 'series' && seriesVideos.length > 0 && (
                                <MobilePlaylistWrapper>
                                    <PlaylistContainer>
                                        <PlaylistHeader>
                                            <PlaylistTitle>{videoData.series_name}</PlaylistTitle>
                                            <PlaylistBadge>{videoData.episode_number}/{videoData.total_episodes}</PlaylistBadge>
                                        </PlaylistHeader>
                                        
                                        <PlaylistVideos>
                                            {seriesVideos.slice(0, 5).map((seriesVideo, index) => (
                                                <PlaylistVideo 
                                                    key={seriesVideo.id} 
                                                    isActive={seriesVideo.is_current}
                                                    onClick={() => !seriesVideo.is_current && handleSeriesVideoClick(seriesVideo.slug)}
                                                    style={{ cursor: seriesVideo.is_current ? 'default' : 'pointer' }}
                                                >
                                                    <VideoThumbnailSmall style={{ backgroundImage: `url(${baseUrl}${seriesVideo.thumbnail_url})` }}>
                                                        <PlayIcon>
                                                            <PlayIconTriangle />
                                                        </PlayIcon>
                                                        <VideoDuration>{formatDuration(seriesVideo.duration)}</VideoDuration>
                                                    </VideoThumbnailSmall>
                                                    <VideoInfo>
                                                        <VideoNumber>{seriesVideo.position}</VideoNumber>
                                                        <VideoTitleSmall>{seriesVideo.title}</VideoTitleSmall>
                                                    </VideoInfo>
                                                </PlaylistVideo>
                                            ))}
                                        </PlaylistVideos>
                                        
                                        <PlaylistActions>
                                            <ActionButtonPlaylist 
                                                onClick={handlePreviousVideo}
                                                disabled={currentSeriesIndex === 0}
                                                style={{ opacity: currentSeriesIndex === 0 ? 0.5 : 1, cursor: currentSeriesIndex === 0 ? 'not-allowed' : 'pointer' }}
                                            >
                                                <NavigationIcon src={previousIcon} alt="Previous" />
                                                Previous
                                            </ActionButtonPlaylist>
                                            <NextButton 
                                                onClick={handleNextVideo}
                                                disabled={currentSeriesIndex === seriesVideos.length - 1}
                                                style={{ opacity: currentSeriesIndex === seriesVideos.length - 1 ? 0.5 : 1, cursor: currentSeriesIndex === seriesVideos.length - 1 ? 'not-allowed' : 'pointer' }}
                                            >
                                                Next 
                                                <NavigationIcon src={nextIcon} alt="Next" />
                                            </NextButton>
                                        </PlaylistActions>
                                    </PlaylistContainer>
                                </MobilePlaylistWrapper>
                            )}

                            {relatedVideos.length > 0 && (
                                <MobileRelatedWrapper>
                                    <RelatedVideosContainer>
                                        <RelatedVideosHeader>
                                            <RelatedVideosTitle>Related Videos</RelatedVideosTitle>
                                        </RelatedVideosHeader>
                                        
                                        <RelatedVideosList>
                                            {relatedVideos.map((relatedVideo) => (
                                                <RelatedVideoItem 
                                                    key={relatedVideo.id} 
                                                    onClick={() => handleRelatedVideoClick(relatedVideo.slug)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <RelatedVideoThumbnail style={{ backgroundImage: `url(${baseUrl}${relatedVideo.thumbnail_url})` }}>
                                                        <RelatedPlayIcon>
                                                            <RelatedPlayIconTriangle />
                                                        </RelatedPlayIcon>
                                                        <RelatedVideoDuration>{formatDuration(relatedVideo.duration)}</RelatedVideoDuration>
                                                    </RelatedVideoThumbnail>
                                                    <RelatedVideoInfo>
                                                        <RelatedVideoTitle>{relatedVideo.title}</RelatedVideoTitle>
                                                        <RelatedVideoAuthor>
                                                            {relatedVideo.type === 'series' ? relatedVideo.series_name : relatedVideo.channel_name}
                                                        </RelatedVideoAuthor>
                                                        <RelatedVideoMeta>{formatViews(relatedVideo.views)}</RelatedVideoMeta>
                                                    </RelatedVideoInfo>
                                                </RelatedVideoItem>
                                            ))}
                                        </RelatedVideosList>

                                        <ViewAllVideosButton onClick={handleViewAllVideos}>
                                            View All Videos
                                        </ViewAllVideosButton>
                                    </RelatedVideosContainer>
                                </MobileRelatedWrapper>
                            )}
                        </VideoSection>

                        <SidebarSection>
                            {videoData.type === 'series' && seriesVideos.length > 0 && (
                                <DesktopPlaylistWrapper>
                                    <PlaylistContainer>
                                        <PlaylistHeader>
                                            <PlaylistTitle>{videoData.series_name}</PlaylistTitle>
                                            <PlaylistBadge>{videoData.episode_number}/{videoData.total_episodes}</PlaylistBadge>
                                        </PlaylistHeader>
                                        
                                        <PlaylistVideos>
                                            {seriesVideos.slice(0, 5).map((seriesVideo, index) => (
                                                <PlaylistVideo 
                                                    key={seriesVideo.id} 
                                                    isActive={seriesVideo.is_current}
                                                    onClick={() => !seriesVideo.is_current && handleSeriesVideoClick(seriesVideo.slug)}
                                                    style={{ cursor: seriesVideo.is_current ? 'default' : 'pointer' }}
                                                >
                                                    <VideoThumbnailSmall style={{ backgroundImage: `url(${baseUrl}${seriesVideo.thumbnail_url})` }}>
                                                        <PlayIcon>
                                                            <PlayIconTriangle />
                                                        </PlayIcon>
                                                        <VideoDuration>{formatDuration(seriesVideo.duration)}</VideoDuration>
                                                    </VideoThumbnailSmall>
                                                    <VideoInfo>
                                                        <VideoNumber>{seriesVideo.position}</VideoNumber>
                                                        <VideoTitleSmall>{seriesVideo.title}</VideoTitleSmall>
                                                    </VideoInfo>
                                                </PlaylistVideo>
                                            ))}
                                        </PlaylistVideos>
                                        
                                        <PlaylistActions>
                                            <ActionButtonPlaylist 
                                                onClick={handlePreviousVideo}
                                                disabled={currentSeriesIndex === 0}
                                                style={{ opacity: currentSeriesIndex === 0 ? 0.5 : 1, cursor: currentSeriesIndex === 0 ? 'not-allowed' : 'pointer' }}
                                            >
                                                <NavigationIcon src={previousIcon} alt="Previous" />
                                                Previous
                                            </ActionButtonPlaylist>
                                            <NextButton 
                                                onClick={handleNextVideo}
                                                disabled={currentSeriesIndex === seriesVideos.length - 1}
                                                style={{ opacity: currentSeriesIndex === seriesVideos.length - 1 ? 0.5 : 1, cursor: currentSeriesIndex === seriesVideos.length - 1 ? 'not-allowed' : 'pointer' }}
                                            >
                                                Next 
                                                <NavigationIcon src={nextIcon} alt="Next" />
                                            </NextButton>
                                        </PlaylistActions>
                                    </PlaylistContainer>
                                </DesktopPlaylistWrapper>
                            )}

                            {relatedVideos.length > 0 && (
                                <DesktopRelatedWrapper>
                                    <RelatedVideosContainer>
                                        <RelatedVideosHeader>
                                            <RelatedVideosTitle>Related Videos</RelatedVideosTitle>
                                        </RelatedVideosHeader>
                                        
                                        <RelatedVideosList>
                                            {relatedVideos.map((relatedVideo) => (
                                                <RelatedVideoItem 
                                                    key={relatedVideo.id}
                                                    onClick={() => handleRelatedVideoClick(relatedVideo.slug)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <RelatedVideoThumbnail style={{ backgroundImage: `url(${baseUrl}${relatedVideo.thumbnail_url})` }}>
                                                        <RelatedPlayIcon>
                                                            <RelatedPlayIconTriangle />
                                                        </RelatedPlayIcon>
                                                        <RelatedVideoDuration>{formatDuration(relatedVideo.duration)}</RelatedVideoDuration>
                                                    </RelatedVideoThumbnail>
                                                    <RelatedVideoInfo>
                                                        <RelatedVideoTitle>{relatedVideo.title}</RelatedVideoTitle>
                                                        <RelatedVideoAuthor>
                                                            {relatedVideo.type === 'series' ? relatedVideo.series_name : relatedVideo.channel_name}
                                                        </RelatedVideoAuthor>
                                                        <RelatedVideoMeta>{formatViews(relatedVideo.views)}</RelatedVideoMeta>
                                                    </RelatedVideoInfo>
                                                </RelatedVideoItem>
                                            ))}
                                        </RelatedVideosList>

                                        <ViewAllVideosButton onClick={handleViewAllVideos}>
                                            View All Videos
                                        </ViewAllVideosButton>
                                    </RelatedVideosContainer>
                                </DesktopRelatedWrapper>
                            )}
                        </SidebarSection>
                    </ContentContainer>
                </MainContentWrapper>
            </FadeContainer>

            <Footer />
        </VideoDetailContainer>
    );
}

export default VideoDetailPage;








