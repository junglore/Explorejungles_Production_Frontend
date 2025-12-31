import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useNavigate } from 'react-router-dom';
import contentService from '../../services/contentService.js';
import FollowButton from '../../components/ui/FollowButton';

const PageContainer = styled('div')({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1E2D27',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

const ContentWrapper = styled('div')({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '120px 24px 0 24px',
    '@media (max-width: 1024px)': { padding: '100px 20px 0 20px' },
    '@media (max-width: 768px)': { padding: '80px 16px 0 16px' },
    '@media (max-width: 480px)': { padding: '70px 12px 0 12px' },
});

const Title = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '64px',
    letterSpacing: '-2px',
    marginBottom: '8px',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '40px' },
    '@media (max-width: 480px)': { fontSize: '28px' },
});

const Subtitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '18px',
    marginBottom: '48px',
    textAlign: 'left',
    maxWidth: '600px',
    '@media (max-width: 768px)': { fontSize: '16px', marginBottom: '32px' },
    '@media (max-width: 480px)': { fontSize: '14px', marginBottom: '24px' },
});

// Featured Article Section
const FeaturedArticle = styled('div')({
    position: 'relative',
    width: '100%',
    height: '547px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '80px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    '@media (max-width: 768px)': {
        height: '400px',
        marginBottom: '60px',
    },
    '@media (max-width: 480px)': {
        height: '300px',
        marginBottom: '40px',
    },
});

const FeaturedImage = styled('div')({
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #2a4a3f 0%, #1E2D27 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '18px',
    position: 'relative',
});

const FeaturedOverlay = styled('div')({
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    padding: '40px',
    '@media (max-width: 768px)': { padding: '24px' },
    '@media (max-width: 480px)': { padding: '16px' },
});

const FeaturedTitle = styled('div')({
    color: '#FFFFFF',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '32px',
    lineHeight: '1.2',
    maxWidth: '739px',
    '@media (max-width: 768px)': { fontSize: '24px' },
    '@media (max-width: 480px)': { fontSize: '18px' },
});

// Latest News Section
const SectionTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '32px',
    margin: '80px 0 48px 0',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '24px', margin: '60px 0 32px 0' },
    '@media (max-width: 480px)': { fontSize: '18px', margin: '40px 0 24px 0' },
});

const NewsGrid = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
    '@media (max-width: 768px)': { gap: '32px' },
    '@media (max-width: 480px)': { gap: '24px' },
});

const NewsCard = styled('div')({
    display: 'flex',
    backgroundColor: '#CDD99D',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '8px 8px 5px rgba(14, 14, 14, 0.81)',
    gap: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '12px 12px 8px rgba(14, 14, 14, 0.85)',
        backgroundColor: '#D4E1A6',
    },
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        padding: '20px',
        gap: '16px',
    },
    '@media (max-width: 480px)': {
        padding: '16px',
        gap: '12px',
    },
});

const NewsContent = styled('div')({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
});

const NewsTitle = styled('div')({
    color: '#1E2D27',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '28px',
    lineHeight: '1.2',
    '@media (max-width: 768px)': { fontSize: '22px' },
    '@media (max-width: 480px)': { fontSize: '18px' },
});

const NewsMeta = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1E2D27',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
});

const NewsSource = styled('span')({
    fontWeight: 700,
});

const NewsDot = styled('div')({
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#1E2D27',
});

const NewsTime = styled('span')({
    fontWeight: 400,
});

const NewsImage = styled('div')({
    width: '200px',
    height: '120px',
    background: 'rgba(30, 45, 39, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1E2D27',
    fontSize: '12px',
    flexShrink: 0,
    '@media (max-width: 768px)': {
        width: '100%',
        height: '100px',
    },
});

// News Channels Section
const ChannelsSection = styled('div')({
    marginTop: '120px',
    '@media (max-width: 768px)': { marginTop: '80px' },
    '@media (max-width: 480px)': { marginTop: '60px' },
});

const ChannelsTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '32px',
    marginBottom: '48px',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '24px', marginBottom: '32px' },
    '@media (max-width: 480px)': { fontSize: '18px', marginBottom: '24px' },
});

const ChannelsGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '48px',
    '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
    },
    '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: '12px',
    },
});

const ChannelCard = styled('div')({
    border: '1px solid #FFE8A1',
    borderRadius: '12px',
    padding: '26px 26px 60px 26px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    height: '320px',
    position: 'relative',
    '@media (max-width: 768px)': {
        height: '280px',
        padding: '20px 20px 50px 20px',
    },
    '@media (max-width: 480px)': {
        height: '260px',
        padding: '16px 16px 45px 16px',
    },
});

const ChannelAvatar = styled('div')({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(255,232,161,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '16px',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
        width: '80px',
        height: '80px',
        fontSize: '14px',
    },
});

const ChannelName = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '16px',
    marginBottom: '4px',
});

const ChannelFollowers = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    marginBottom: '8px',
});

const ChannelBio = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '1.4',
    marginBottom: '16px',
    flex: 1,
});

const ChannelFollowButton = styled(FollowButton)({
    position: 'absolute',
    bottom: '20px',
    width: '164px',
    '@media (max-width: 768px)': {
        width: '140px',
        bottom: '15px',
    },
    '@media (max-width: 480px)': {
        width: '120px',
        bottom: '12px',
    },
});

const ShowMoreSection = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    marginTop: '60px',
    marginBottom: '40px',
    gap: '20px',
    '@media (max-width: 768px)': {
        marginTop: '40px',
        marginBottom: '30px',
        gap: '15px',
    },
    '@media (max-width: 480px)': {
        marginTop: '30px',
        marginBottom: '20px',
        gap: '10px',
    },
});

const Line = styled('div')({
    border: '1px solid rgba(255, 232, 161, 1)',
    height: '0px',
    flex: '1',
    '@media (max-width: 480px)': {
        display: 'none',
    },
});

const ShowMoreButton = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
    },
});

const ShowMoreText = styled('div')({
    textAlign: 'center',
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: '12px',
    letterSpacing: '0.56px',
    lineHeight: '20px',
    textTransform: 'none',
});

const ShowMoreArrow = styled('div')({
    color: 'rgba(255, 232, 161, 1)',
    fontSize: '16px',
    fontWeight: 'bold',
    transform: 'rotate(90deg)',
});

const BottomSpacer = styled('div')({
    minHeight: '80px',
    '@media (max-width: 768px)': { minHeight: '60px' },
    '@media (max-width: 480px)': { minHeight: '40px' },
});

// API service for fetching daily updates
const fetchDailyUpdates = async (page = 1, limit = 9) => {
    try {
        const response = await contentService.fetchDailyUpdates({ page, limit });
        // Transform the response to match the expected format
        return {
            dailyupdates: response.data || response.result || response.items || [],
            pagination: {
                page: response.page || response.currentPage || response.current_page || 1,
                limit: response.limit || response.per_page || 9,
                total: response.total || response.total_count || 0,
                pages: response.pages || response.totalPages || response.total_pages || 1
            }
        };
    } catch (error) {
        console.error('Error fetching daily updates:', error);
        return { dailyupdates: [], pagination: { page: 1, limit: 9, total: 0, pages: 0 } };
    }
};

// Static channel data removed - will be managed through admin panel in future

function DailyUpdatesPage() {
    const [dailyUpdates, setDailyUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        loadDailyUpdates();
    }, []);

    const loadDailyUpdates = async (page = 1) => {
        setLoading(true);
        try {
            const data = await fetchDailyUpdates(page, 9);
            setDailyUpdates(data.dailyupdates || []);
            setPagination(data.pagination || { page: 1, limit: 9, total: 0, pages: 0 });
        } catch (error) {
            console.error('Error loading daily updates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowMore = async () => {
        if (pagination.page < pagination.pages) {
            const nextPage = pagination.page + 1;
            const data = await fetchDailyUpdates(nextPage, 9);
            setDailyUpdates(prevUpdates => [...prevUpdates, ...(data.dailyupdates || [])]);
            setPagination(data.pagination || pagination);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recent';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            return `${diffMinutes}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    return (
        <PageContainer>
            <Header />
            <ContentWrapper>
                <Title>DAILY NEWS</Title>
                <Subtitle>Your daily dose of the wild—raw, real, and unfolding one day at a time.</Subtitle>

                {/* Featured Article */}
                <FeaturedArticle>
                    <FeaturedImage>
                        <div>Lions Running Image</div>
                        <FeaturedOverlay>
                            <FeaturedTitle>
                                Roar of the Realm: A Powerful Glimpse into the Daily Life, Dominance, and Majesty of the Lion in the Heart of the Wild
                            </FeaturedTitle>
                        </FeaturedOverlay>
                    </FeaturedImage>
                </FeaturedArticle>

                {/* Latest News Section */}
                <SectionTitle>LATEST NEWS</SectionTitle>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#FFE8A1' }}>
                        Loading daily updates...
                    </div>
                ) : dailyUpdates.length > 0 ? (
                    <NewsGrid>
                        {dailyUpdates.map((news) => (
                            <NewsCard key={news.id} onClick={() => navigate(`/resources/dailyupdate/${news.id}`)} style={{ cursor: 'pointer' }}>
                                <NewsContent>
                                    <NewsTitle>{news.title}</NewsTitle>
                                    <NewsMeta>
                                        <NewsSource>Junglore News</NewsSource>
                                        <NewsDot />
                                        <NewsTime>{formatDate(news.createdAt)}</NewsTime>
                                    </NewsMeta>
                                </NewsContent>
                                <NewsImage>
                                    {news.image ? (
                                        <img src={news.image} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        'News Image'
                                    )}
                                </NewsImage>
                            </NewsCard>
                        ))}
                    </NewsGrid>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#FFE8A1' }}>
                        <div style={{ fontSize: '18px', marginBottom: '16px' }}>No daily updates available yet</div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Check back later for the latest wildlife news and updates!
                        </div>
                    </div>
                )}

                {/* News Channels Section removed - will be managed through admin panel */}
                {pagination.page < pagination.pages && dailyUpdates.length > 0 && (
                    <ShowMoreSection>
                        <Line />
                        <ShowMoreButton onClick={handleShowMore}>
                            <ShowMoreText>SHOW MORE</ShowMoreText>
                            <ShowMoreArrow>›</ShowMoreArrow>
                        </ShowMoreButton>
                        <Line />
                    </ShowMoreSection>
                )}

                <BottomSpacer />
            </ContentWrapper>
            <Footer />
        </PageContainer >
    );
}

export default DailyUpdatesPage;
