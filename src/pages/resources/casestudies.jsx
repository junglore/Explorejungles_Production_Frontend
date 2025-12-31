import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
// Removed unused FollowButton import
import DesktopTreeBranch from '../../assets/images/Desktop3_tree_branch_2.png';
import { useNavigate } from 'react-router-dom';
import contentService from '../../services/contentService.js';

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

const TitleRow = styled('div')({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minHeight: '180px',
    marginBottom: '8px',
    '@media (max-width: 1024px)': { minHeight: '120px' },
    '@media (max-width: 600px)': { minHeight: '70px' },
});

const Title = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '64px',
    letterSpacing: '-2px',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '40px' },
    '@media (max-width: 480px)': { fontSize: '28px' },
});

const TreeBranchImg = styled('img')({
    position: 'absolute',
    top: '120px',
    right: '0',
    height: '380px',
    width: 'auto',
    zIndex: 0,
    pointerEvents: 'none',
    '@media (max-width: 1024px)': {
        position: 'absolute',
        height: '120px',
        top: '30px',
        right: '-20px'
    },
    '@media (max-width: 768px)': {
        position: 'absolute',
        height: '80px',
        top: '20px',
        right: '-10px'
    },
    '@media (max-width: 600px)': {
        position: 'absolute',
        height: '70px',
        top: '20px',
        right: '-5px'
    },
    '@media (max-width: 480px)': {
        display: 'none'
    },
});

const Subtitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '18px',
    marginBottom: '48px',
    textAlign: 'left',
    maxWidth: '500px',
    '@media (max-width: 768px)': { fontSize: '16px', marginBottom: '32px' },
    '@media (max-width: 480px)': { fontSize: '14px', marginBottom: '24px' },
});

const SectionTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '32px',
    margin: '48px 0 24px 0',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '24px', margin: '32px 0 16px 0' },
    '@media (max-width: 480px)': { fontSize: '18px', margin: '24px 0 12px 0' },
});

const CardGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
        gap: '24px',
    },
});

const Card = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: '16px',
    overflow: 'hidden',
    minHeight: '320px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    '@media (max-width: 600px)': {
        minHeight: '220px',
    },
});

const ImagePlaceholder = styled('div')({
    width: '100%',
    height: '200px',
    background: 'rgba(255,232,161,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '14px',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    '@media (max-width: 600px)': {
        height: '140px',
    },
});

const CardContent = styled('div')({
    flex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    '@media (max-width: 600px)': {
        padding: '16px',
    },
});

const CardMeta = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
});

const CardAvatar = styled('div')({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,232,161,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '12px',
    fontWeight: 700,
});

const CardAuthor = styled('div')({
    color: '#FFE8A1',
    fontWeight: 700,
    fontSize: '16px',
    textTransform: 'uppercase',
});

const CardDate = styled('div')({
    color: '#FFE8A1',
    fontWeight: 400,
    fontSize: '14px',
    marginLeft: 'auto',
    opacity: 0.8,
});

const CardTitle = styled('div')({
    color: '#FFE8A1',
    fontWeight: 700,
    fontSize: '22px',
    margin: '8px 0 0 0',
    lineHeight: 1.2,
    '@media (max-width: 600px)': {
        fontSize: '18px',
    },
});

const CardDesc = styled('div')({
    color: '#FFE8A1',
    fontWeight: 400,
    fontSize: '15px',
    margin: '8px 0 0 0',
    lineHeight: 1.5,
    '@media (max-width: 600px)': {
        fontSize: '13px',
    },
});

const CardStats = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    marginTop: '16px',
    color: '#FFE8A1',
    fontSize: '13px',
    opacity: 0.8,
});

// Removed unused influencer section styled components

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

// Removed unused latest section styled components

// Sample data (replace with backend data later)
// API service for fetching case studies
const fetchCaseStudies = async (page = 1, limit = 9) => {
    try {
        const response = await contentService.fetchCaseStudies({ page, limit });
        // Transform the response to match the expected format
        return {
            casestudies: response.data || response.result || response.items || [],
            pagination: {
                page: response.page || response.currentPage || response.current_page || 1,
                limit: response.limit || response.per_page || 9,
                total: response.total || response.total_count || 0,
                pages: response.pages || response.totalPages || response.total_pages || 1
            }
        };
    } catch (error) {
        console.error('Error fetching case studies:', error);
        return { casestudies: [], pagination: { page: 1, limit: 9, total: 0, pages: 0 } };
    }
};

// Static influencer data removed - will be managed through admin panel in future

function CaseStudiesPage() {
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        loadCaseStudies();
    }, []);

    const loadCaseStudies = async (page = 1) => {
        setLoading(true);
        try {
            const data = await fetchCaseStudies(page, 9);
            setCaseStudies(data.casestudies || []);
            setPagination(data.pagination || { page: 1, limit: 9, total: 0, pages: 0 });
        } catch (error) {
            console.error('Error loading case studies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowMore = async () => {
        if (pagination.page < pagination.pages) {
            const nextPage = pagination.page + 1;
            const data = await fetchCaseStudies(nextPage, 9);
            setCaseStudies(prevStudies => [...prevStudies, ...(data.casestudies || [])]);
            setPagination(data.pagination || pagination);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recent';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffWeeks = Math.floor(diffDays / 7);
            const diffMonths = Math.floor(diffDays / 30);

            // More precise time calculations
            if (diffMinutes < 1) {
                return 'Just now';
            } else if (diffMinutes < 60) {
                return `${diffMinutes}m ago`;
            } else if (diffHours < 24) {
                return `${diffHours}h ago`;
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else if (diffDays < 7) {
                return `${diffDays}d ago`;
            } else if (diffWeeks < 4) {
                return `${diffWeeks}w ago`;
            } else if (diffMonths < 12) {
                return `${diffMonths}mo ago`;
            } else {
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Recent';
        }
    };

    return (
        <PageContainer>
            <Header />
            <TreeBranchImg src={DesktopTreeBranch} alt="Tree Branch" />
            <ContentWrapper>
                <TitleRow>
                    <Title>CASE STUDIES</Title>
                </TitleRow>
                <Subtitle>Uncover the untamed stories of India’s wild through data, insight, and discovery</Subtitle>
                <SectionTitle>RECOMMENDATIONS BY JUNGLORE</SectionTitle>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#FFE8A1' }}>
                        Loading case studies...
                    </div>
                ) : caseStudies.length > 0 ? (
                    <CardGrid>
                        {caseStudies.map((study) => (
                            <Card key={study.id} onClick={() => navigate(`/resources/casestudy/${study.id}`)} style={{ cursor: 'pointer' }}>
                                <ImagePlaceholder>
                                    {study.image ? (
                                        <img src={study.image} alt={study.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        'Case Study Image'
                                    )}
                                </ImagePlaceholder>
                                <CardContent>
                                    <CardMeta>
                                        <CardAvatar>
                                            {study.title?.charAt(0).toUpperCase() || 'C'}
                                        </CardAvatar>
                                        <CardAuthor>{study.author_name || study.authorName || 'JUNGLORE'}</CardAuthor>
                                        <CardDate>{formatDate(study.publishedAt || study.createdAt)}</CardDate>
                                    </CardMeta>
                                    <CardTitle>{study.title}</CardTitle>
                                    <CardDesc>{study.description || 'Explore this fascinating case study about wildlife conservation.'}</CardDesc>
                                    <CardStats>
                                        <span>Type: Case Study</span>
                                        <span>Status: {study.status ? 'Published' : 'Draft'}</span>
                                    </CardStats>
                                </CardContent>
                            </Card>
                        ))}
                    </CardGrid>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#FFE8A1' }}>
                        <div style={{ fontSize: '18px', marginBottom: '16px' }}>No case studies available yet</div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Check back later for exciting wildlife case studies!
                        </div>
                    </div>
                )}
                {pagination.page < pagination.pages && caseStudies.length > 0 && (
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
        </PageContainer>
    );
}

export default CaseStudiesPage;
