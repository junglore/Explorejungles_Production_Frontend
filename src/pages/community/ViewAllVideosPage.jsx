import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import videoService from '../../services/videoService';
// import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import BackIcon from '../../assets/icons/backIcon.svg';
import searchIcon from '../../assets/icons/searchIcon.svg';
import timeIcon from '../../assets/icons/timeIcon.svg';
import watchedIcon from '../../assets/icons/watchedIcon.svg';
import { API_BASE_URL } from '../../services/api';

const ViewAllVideosContainer = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
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
});

// Page Header Section
const PageHeader = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `20px 40px`,
    borderBottom: `1px solid rgba(68, 122, 101, 0.2)`,
    width: `100%`,
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
    maxWidth: `1200px`,
    margin: `0 auto`,
    width: `100%`,
    '@media (max-width: 768px)': {
        flexDirection: `column`,
        gap: `15px`,
        alignItems: `flex-start`,
    },
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
        alignSelf: `flex-end`,
    },
    '@media (max-width: 480px)': {
        gap: `8px`,
    },
});

const GridViewButton = styled("div")({
    width: `40px`,
    height: `40px`,
    backgroundColor: `rgba(68, 122, 101, 1)`,
    borderRadius: `8px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.8)`,
    },
    '@media (max-width: 480px)': {
        width: `35px`,
        height: `35px`,
    },
});

const ListViewButton = styled("div")({
    width: `40px`,
    height: `40px`,
    backgroundColor: `transparent`,
    border: `1px solid rgba(68, 122, 101, 0.5)`,
    borderRadius: `8px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(68, 122, 101, 0.1)`,
        borderColor: `rgba(68, 122, 101, 0.8)`,
    },
    '@media (max-width: 480px)': {
        width: `35px`,
        height: `35px`,
    },
});

const GridIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1" fill="white"/>
        <rect x="12" y="2" width="6" height="6" rx="1" fill="white"/>
        <rect x="2" y="12" width="6" height="6" rx="1" fill="white"/>
        <rect x="12" y="12" width="6" height="6" rx="1" fill="white"/>
    </svg>
);

const ListIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="2" rx="1" fill="rgba(68, 122, 101, 0.7)"/>
        <rect x="2" y="9" width="16" height="2" rx="1" fill="rgba(68, 122, 101, 0.7)"/>
        <rect x="2" y="15" width="16" height="2" rx="1" fill="rgba(68, 122, 101, 0.7)"/>
    </svg>
);

// Page Title Section
const PageTitleSection = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `40px 40px 20px 40px`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `30px 20px 15px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `25px 15px 10px 15px`,
    },
});

const TitleContent = styled("div")({
    maxWidth: `1200px`,
    margin: `0 auto`,
    width: `100%`,
});

const MainTitle = styled("h1")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `48px`,
    margin: `0 0 12px 0`,
    lineHeight: `1.2`,
    '@media (max-width: 768px)': {
        fontSize: `36px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        fontSize: `28px`,
    },
});

const Subtitle = styled("p")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `18px`,
    margin: `0`,
    lineHeight: `1.5`,
    '@media (max-width: 768px)': {
        fontSize: `16px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

// Main Content Section
const MainContent = styled("div")({
    flex: 1,
    padding: `40px`,
    maxWidth: `1200px`,
    margin: `0 auto`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `30px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `20px 15px`,
    },
});

// Search Section
const SearchSection = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `30px 40px`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `25px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `20px 15px`,
    },
});

const SearchContainer = styled("div")({
    position: `relative`,
    width: `100%`,
    maxWidth: `1200px`,
    display: `flex`,
    alignItems: `center`,
});

const SearchInput = styled("input")({
    width: `100%`,
    height: `48px`,
    backgroundColor: `rgba(68, 122, 101, 0.1)`,
    border: `1px solid rgba(68, 122, 101, 0.3)`,
    borderRadius: `30px`,
    padding: `0 50px 0 20px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontSize: `16px`,
    color: `rgba(255, 232, 161, 1)`,
    outline: `none`,
    transition: `all 0.3s ease`,
    '&::placeholder': {
        color: `rgba(255, 232, 161, 0.5)`,
        fontSize: `16px`,
    },
    '&:focus': {
        borderColor: `rgba(68, 122, 101, 0.6)`,
        backgroundColor: `rgba(68, 122, 101, 0.15)`,
        boxShadow: `0 0 0 3px rgba(68, 122, 101, 0.1)`,
    },
    '@media (max-width: 480px)': {
        height: `44px`,
        fontSize: `14px`,
        padding: `0 45px 0 15px`,
        '&::placeholder': {
            fontSize: `14px`,
        },
    },
});

const SearchIconContainer = styled("div")({
    position: `absolute`,
    right: `15px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    width: `20px`,
    height: `20px`,
    cursor: `pointer`,
    transition: `opacity 0.3s ease`,
    '&:hover': {
        opacity: 0.8,
    },
    '@media (max-width: 480px)': {
        right: `12px`,
        width: `18px`,
        height: `18px`,
    },
});

const SearchIcon = styled("img")({
    width: `100%`,
    height: `100%`,
    objectFit: `contain`,
});

// Category Filter Section
const CategoryFilterSection = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `20px 40px 30px 40px`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `15px 20px 25px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `10px 15px 20px 15px`,
    },
});

const CategoryFilterContainer = styled("div")({
    display: `flex`,
    flexWrap: `wrap`,
    gap: `12px`,
    width: `100%`,
    maxWidth: `1200px`,
    justifyContent: `flex-start`,
    alignItems: `center`,
    '@media (max-width: 768px)': {
        gap: `10px`,
    },
    '@media (max-width: 480px)': {
        gap: `8px`,
        justifyContent: `center`,
    },
});

const CategoryButton = styled("button")(({ isActive }) => ({
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    gap: `8px`,
    padding: `10px 16px`,
    backgroundColor: isActive ? `rgba(255, 232, 161, 1)` : `rgba(68, 122, 101, 0.1)`,
    color: isActive ? `rgba(30, 45, 39, 1)` : `rgba(255, 232, 161, 1)`,
    border: `1px solid ${isActive ? 'rgba(255, 232, 161, 1)' : 'rgba(68, 122, 101, 0.3)'}`,
    borderRadius: `24px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontSize: `14px`,
    fontWeight: isActive ? 600 : 500,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    outline: `none`,
    whiteSpace: `nowrap`,
    '&:hover': {
        backgroundColor: isActive ? `rgba(255, 232, 161, 0.9)` : `rgba(68, 122, 101, 0.2)`,
        borderColor: isActive ? `rgba(255, 232, 161, 0.9)` : `rgba(68, 122, 101, 0.5)`,
        transform: `translateY(-1px)`,
    },
    '&:active': {
        transform: `translateY(0)`,
    },
    '@media (max-width: 480px)': {
        fontSize: `12px`,
        padding: `8px 12px`,
        gap: `6px`,
    },
}));

const CategoryCount = styled("span")({
    backgroundColor: `rgba(0, 0, 0, 0.1)`,
    borderRadius: `12px`,
    padding: `2px 6px`,
    fontSize: `12px`,
    fontWeight: 600,
    '@media (max-width: 480px)': {
        fontSize: `10px`,
        padding: `1px 4px`,
    },
});

// Video Cards Section
const VideoCardsSection = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    padding: `0 40px 40px 40px`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `flex-start`,
    width: `100%`,
    '@media (max-width: 768px)': {
        padding: `0 20px 30px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `0 15px 25px 15px`,
    },
});

const VideoCardsContainer = styled("div")({
    width: `100%`,
    maxWidth: `1200px`,
    display: `flex`,
    flexDirection: `column`,
    gap: `20px`,
});

const VideoCardsHeader = styled("div")({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    marginBottom: `20px`,
    '@media (max-width: 480px)': {
        flexDirection: `column`,
        alignItems: `flex-start`,
        gap: `10px`,
    },
});

const VideoCountText = styled("div")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontSize: `16px`,
    fontWeight: 400,
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const VideoCardsGrid = styled("div")({
    display: `grid`,
    gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr))`,
    gap: `20px`,
    width: `100%`,
    '@media (max-width: 768px)': {
        gridTemplateColumns: `repeat(auto-fill, minmax(280px, 1fr))`,
        gap: `16px`,
    },
    '@media (max-width: 480px)': {
        gridTemplateColumns: `1fr`,
        gap: `16px`,
    },
});

const VideoCard = styled("div")({
    backgroundColor: `rgba(19, 38, 32, 1)`,
    borderRadius: `12px`,
    overflow: `hidden`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    position: `relative`,
    '&:hover': {
        transform: `translateY(-4px)`,
        boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2)`,
    },
});

const VideoThumbnail = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `200px`,
    backgroundSize: `cover`,
    backgroundPosition: `center`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    overflow: `hidden`,
});

const VideoProgressBar = styled("div")({
    position: `absolute`,
    bottom: 0,
    left: 0,
    width: `100%`,
    height: `4px`,
    backgroundColor: `rgba(255, 255, 255, 0.3)`,
});

const VideoProgressFill = styled("div")(({ progress }) => ({
    height: `100%`,
    width: `${progress}%`,
    backgroundColor: `rgba(255, 232, 161, 1)`,
    transition: `width 0.3s ease`,
}));

const VideoDuration = styled("div")({
    position: `absolute`,
    bottom: `8px`,
    right: `8px`,
    backgroundColor: `rgba(0, 0, 0, 0.8)`,
    color: `white`,
    padding: `4px 8px`,
    borderRadius: `30px`,
    fontSize: `12px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 450,
    display: `flex`,
    alignItems: `center`,
    gap: `4px`,
});

const TimeIcon = styled("img")({
    width: `12px`,
    height: `12px`,
    filter: `brightness(0) invert(1)`,
});

const WatchedIcon = styled("img")({
    width: `14px`,
    height: `13px`,
    objectFit: `contain`,
});

const VideoStatus = styled("div")(({ status }) => ({
    position: `absolute`,
    top: `8px`,
    right: `8px`,
    backgroundColor: status === 'watched' ? `rgba(68, 122, 101, 0.9)` : `rgba(255, 232, 161, 0.9)`,
    color: status === 'watched' ? `rgba(255, 232, 161, 1)` : `rgba(30, 45, 39, 1)`,
    padding: `4px 8px`,
    borderRadius: `12px`,
    fontSize: `12px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 500,
    display: `flex`,
    alignItems: `center`,
    gap: `4px`,
}));

const VideoPartBadge = styled("div")({
    position: `absolute`,
    top: `8px`,
    left: `8px`,
    backgroundColor: `rgba(255, 232, 161, 0.9)`,
    color: `rgba(30, 45, 39, 1)`,
    padding: `4px 8px`,
    borderRadius: `12px`,
    fontSize: `12px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 500,
});

const PlayButton = styled("div")({
    opacity: 0,
    transition: `opacity 0.3s ease`,
    backgroundColor: `rgba(255, 255, 255, 0.9)`,
    borderRadius: `50%`,
    width: `60px`,
    height: `60px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    fontSize: `24px`,
    color: `#447A65`,
    position: `absolute`,
    '&:hover': {
        backgroundColor: `rgba(255, 255, 255, 1)`,
    },
});

const VideoInfo = styled("div")({
    padding: `16px`,
});

const VideoTitle = styled("h4")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 600,
    fontSize: `16px`,
    margin: `0 0 8px 0`,
    lineHeight: 1.4,
});

const VideoDescription = styled("p")({
    color: `rgba(205, 217, 157, 1)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 400,
    fontSize: `14px`,
    margin: `0 0 12px 0`,
    lineHeight: 1.5,
    display: `-webkit-box`,
    WebkitLineClamp: 3,
    WebkitBoxOrient: `vertical`,
    overflow: `hidden`,
    textOverflow: `ellipsis`,
});

const VideoMeta = styled("div")({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    gap: `8px`,
});

const VideoChannel = styled("div")({
    color: `rgba(255, 232, 161, 0.8)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 400,
    fontSize: `13px`,
});

const VideoViews = styled("div")({
    color: `rgba(205, 217, 157, 0.8)`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 400,
    fontSize: `12px`,
    display: `flex`,
    alignItems: `center`,
    gap: `4px`,
});

const VideoTags = styled("div")({
    display: `flex`,
    flexWrap: `wrap`,
    gap: `6px`,
    marginTop: `8px`,
});

const VideoTag = styled("span")({
    backgroundColor: `rgba(68, 122, 101, 0.2)`,
    color: `rgba(255, 232, 161, 1)`,
    padding: `2px 8px`,
    borderRadius: `12px`,
    fontSize: `11px`,
    fontFamily: `'DM Sans', sans-serif`,
    fontWeight: 500,
});

function ViewAllVideosPage() {
    const navigate = useNavigate();
    
    const baseUrl = API_BASE_URL.replace('/api/v1', '');
    
    // State for videos and categories
    const [allVideos, setAllVideos] = useState([]); // Store ALL videos
    const [displayedVideos, setDisplayedVideos] = useState([]); // Filtered videos to display
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    
    // Fetch all videos and categories on mount
    useEffect(() => {
        fetchAllVideos();
    }, []);
    
    // Filter videos when category or search changes
    useEffect(() => {
        filterVideos();
    }, [activeCategory, searchQuery, allVideos]);
    
    const fetchAllVideos = async () => {
        try {
            setLoading(true);
            const response = await videoService.getAllVideos();
            setAllVideos(response.videos || []);
            
            // Fetch categories after getting videos
            await fetchCategories(response.videos || []);
            
            setError(null);
        } catch (err) {
            console.error('Error fetching videos:', err);
            setError('Failed to load videos');
        } finally {
            setLoading(false);
        }
    };
    
    const fetchCategories = async (videosData) => {
        try {
            const response = await videoService.getCategories();
            
            // Calculate counts based on ALL videos
            const allCount = videosData.length;
            const seriesCount = videosData.filter(v => v.type === 'series').length;
            
            // Build categories array with "All Videos" and "Video Series" first
            const categoriesArray = [
                { id: 'all', label: 'All Videos', count: allCount },
                { id: 'series', label: 'Video Series', count: seriesCount }
            ];
            
            // Add tag-based categories
            if (response.categories && response.categories.length > 0) {
                response.categories.forEach(cat => {
                    categoriesArray.push({
                        id: cat.name,
                        label: cat.label,
                        count: cat.count
                    });
                });
            }
            
            setCategories(categoriesArray);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };
    
    const filterVideos = () => {
        let filtered = [...allVideos];
        
        // Apply search filter
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(v =>
                v.title.toLowerCase().includes(searchLower) ||
                (v.subtitle || '').toLowerCase().includes(searchLower) ||
                (v.description || '').toLowerCase().includes(searchLower)
            );
        }
        
        // Apply category filter
        if (activeCategory !== 'all') {
            if (activeCategory === 'series') {
                filtered = filtered.filter(v => v.type === 'series');
            } else {
                // Filter by tag
                filtered = filtered.filter(v =>
                    v.tags && v.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase())
                );
            }
        }
        
        setDisplayedVideos(filtered);
    };
    
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    
    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
    };
    
    const handleBackToCore = () => {
        navigate('/community');
    };
    
    const handleVideoClick = (videoSlug) => {
        navigate(`/community/video/${videoSlug}`);
    };
    
    // Transform video data for display
    const getVideoDisplayData = (video) => {
        return {
            id: video.id,
            title: video.title,
            description: video.subtitle || video.description,
            thumbnail: video.thumbnail_url ? baseUrl + video.thumbnail_url : 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80',
            duration: videoService.formatDuration(video.duration),
            channel: video.type === 'series' ? video.series_name : video.channel_name,
            views: videoService.formatViews(video.views),
            status: null, // Can be enhanced later with user watch history
            part: video.type === 'series' ? `Episode ${video.episode_number}` : null,
            tags: video.hashtags ? video.hashtags.split(' ').filter(t => t) : []
        };
    };

    return (
        <ViewAllVideosContainer>
            {/* Header */}
            {/* <Header /> */}
            
            {/* Page Header */}
            <PageHeader>
                <HeaderContent>
                    <BackSection onClick={handleBackToCore}>
                        <BackArrow src={BackIcon} alt="Back" />
                        <BackText>Back to Community</BackText>
                    </BackSection>  
                </HeaderContent>
            </PageHeader>

            {/* Page Title Section */}
            <PageTitleSection>
                <TitleContent>
                    <MainTitle>Knowledge Videos</MainTitle>
                    <Subtitle>Educational content and wildlife documentaries</Subtitle>
                </TitleContent>
            </PageTitleSection>

            {/* Search Section */}
            <SearchSection>
                <SearchContainer>
                    <SearchInput 
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <SearchIconContainer>
                        <SearchIcon src={searchIcon} alt="Search" />
                    </SearchIconContainer>
                </SearchContainer>
            </SearchSection>

            {/* Category Filter Section */}
            <CategoryFilterSection>
                <CategoryFilterContainer>
                    {categories.map((category) => (
                        <CategoryButton
                            key={category.id}
                            isActive={activeCategory === category.id}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.label}
                            <CategoryCount>{category.count}</CategoryCount>
                        </CategoryButton>
                    ))}
                </CategoryFilterContainer>
            </CategoryFilterSection>

            {/* Video Cards Section */}
            <VideoCardsSection>
                <VideoCardsContainer>
                    <VideoCardsHeader>
                        <VideoCountText>
                            {loading ? 'Loading videos...' : 
                             error ? 'Error loading videos' : 
                             `Showing ${displayedVideos.length} videos`}
                        </VideoCountText>
                    </VideoCardsHeader>
                    
                    {!loading && !error && (
                        <VideoCardsGrid>
                            {displayedVideos.map((video) => {
                                const displayData = getVideoDisplayData(video);
                                return (
                                    <VideoCard 
                                        key={video.id}
                                        onClick={() => handleVideoClick(video.slug)}
                                        style={{ cursor: 'pointer' }}
                                        onMouseEnter={(e) => {
                                            const playButton = e.currentTarget.querySelector('.play-button');
                                            if (playButton) playButton.style.opacity = '1';
                                        }}
                                        onMouseLeave={(e) => {
                                            const playButton = e.currentTarget.querySelector('.play-button');
                                            if (playButton) playButton.style.opacity = '0';
                                        }}
                                    >
                                        <VideoThumbnail style={{ backgroundImage: `url(${displayData.thumbnail})` }}>
                                            {displayData.part && (
                                                <VideoPartBadge>{displayData.part}</VideoPartBadge>
                                            )}
                                            
                                            {displayData.status && (
                                                <VideoStatus status={displayData.status}>
                                                    <WatchedIcon src={watchedIcon} alt="Watched" />
                                                    Watched
                                                </VideoStatus>
                                            )}
                                            
                                            <VideoDuration>
                                                <TimeIcon src={timeIcon} alt="Time" />
                                                {displayData.duration}
                                            </VideoDuration>
                                            
                                            <PlayButton className="play-button">
                                                ▶
                                            </PlayButton>
                                            
                                            {/* Progress Bar */}
                                            {video.progress_percentage > 0 && (
                                                <VideoProgressBar>
                                                    <VideoProgressFill progress={video.progress_percentage} />
                                                </VideoProgressBar>
                                            )}
                                        </VideoThumbnail>
                                        
                                        <VideoInfo>
                                            <VideoTitle>{displayData.title}</VideoTitle>
                                            <VideoDescription>{displayData.description}</VideoDescription>
                                            
                                            <VideoMeta>
                                                <VideoChannel>{displayData.channel}</VideoChannel>
                                                <VideoViews>
                                                    👁 {displayData.views}
                                                </VideoViews>
                                            </VideoMeta>
                                            
                                            <VideoTags>
                                                {displayData.tags.map((tag, index) => (
                                                    <VideoTag key={index}>{tag}</VideoTag>
                                                ))}
                                            </VideoTags>
                                        </VideoInfo>
                                    </VideoCard>
                                );
                            })}
                        </VideoCardsGrid>
                    )}
                </VideoCardsContainer>
            </VideoCardsSection>

            {/* Footer */}
            <Footer />
        </ViewAllVideosContainer>
    );
}

export default ViewAllVideosPage;