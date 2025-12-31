import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
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
    padding: '120px 24px 80px 24px',
    '@media (max-width: 1024px)': {
        padding: '100px 20px 60px 20px',
        maxWidth: '100%'
    },
    '@media (max-width: 768px)': {
        padding: '80px 16px 40px 16px'
    },
    '@media (max-width: 480px)': {
        padding: '70px 12px 30px 12px'
    },
});

const BackButton = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    marginBottom: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    padding: '8px 0',
    '&:hover': {
        opacity: 0.8,
        transform: 'translateX(-4px)',
    },
    '@media (max-width: 768px)': {
        marginBottom: '24px',
        fontSize: '13px'
    },
});

const ArticleContainer = styled('div')({
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,232,161,0.1)',
    '@media (max-width: 768px)': {
        borderRadius: '12px',
    },
    '@media (max-width: 480px)': {
        borderRadius: '8px',
    },
});

const BannerImage = styled('div')({
    width: '100%',
    height: '400px',
    background: 'linear-gradient(135deg, #2a4a3f 0%, #1E2D27 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '18px',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
        height: '300px',
        fontSize: '16px',
    },
    '@media (max-width: 480px)': {
        height: '240px',
        fontSize: '14px',
    },
});

const ArticleContent = styled('div')({
    padding: '48px',
    '@media (max-width: 768px)': {
        padding: '32px 24px',
    },
    '@media (max-width: 480px)': {
        padding: '24px 16px',
    },
});

const ArticleHeader = styled('div')({
    marginBottom: '32px',
    '@media (max-width: 768px)': {
        marginBottom: '24px',
    },
});

const ArticleTitle = styled('h1')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '48px',
    lineHeight: '1.2',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
        fontSize: '36px',
        lineHeight: '1.3',
        marginBottom: '12px',
    },
    '@media (max-width: 480px)': {
        fontSize: '28px',
        lineHeight: '1.4',
        marginBottom: '8px',
    },
});

const ArticleMeta = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    opacity: 0.8,
    '@media (max-width: 768px)': {
        gap: '12px',
        fontSize: '14px',
        marginBottom: '20px',
    },
    '@media (max-width: 480px)': {
        gap: '8px',
        fontSize: '13px',
    },
});

const MetaItem = styled('div')({
    color: '#FFE8A1',
    fontSize: '14px',
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '@media (max-width: 480px)': {
        gap: '2px',
        fontSize: '12px',
    },
});

const ArticleDescription = styled('div')({
    color: '#FFE8A1',
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '32px',
    opacity: 0.9,
    fontFamily: 'DM Sans, sans-serif',
    '@media (max-width: 768px)': {
        fontSize: '16px',
        marginBottom: '24px',
    },
    '@media (max-width: 480px)': {
        fontSize: '15px',
        marginBottom: '20px',
    },
});

const ContentSection = styled('div')({
    marginBottom: '32px',
    '@media (max-width: 768px)': {
        marginBottom: '24px',
    },
});

const SectionTitle = styled('h2')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '24px',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
        fontSize: '20px',
        marginBottom: '12px',
    },
    '@media (max-width: 480px)': {
        fontSize: '18px',
        marginBottom: '10px',
    },
});

const ContentText = styled('div')({
    color: '#FFE8A1',
    fontSize: '16px',
    lineHeight: '1.7',
    fontFamily: 'DM Sans, sans-serif',
    '& h1, & h2, & h3, & h4, & h5, & h6': {
        color: '#FFE8A1',
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 600,
        marginTop: '24px',
        marginBottom: '12px',
    },
    '& p': {
        marginBottom: '16px',
    },
    '& ul, & ol': {
        marginBottom: '16px',
        paddingLeft: '24px',
    },
    '& li': {
        marginBottom: '8px',
    },
    '& img': {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        margin: '16px 0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    '& blockquote': {
        borderLeft: '4px solid #FFE8A1',
        paddingLeft: '16px',
        margin: '16px 0',
        fontStyle: 'italic',
        opacity: 0.9,
        backgroundColor: 'rgba(255,232,161,0.05)',
        padding: '12px 16px',
        borderRadius: '0 8px 8px 0',
    },
    '& a': {
        color: '#FFE8A1',
        textDecoration: 'underline',
        '&:hover': {
            opacity: 0.8,
        },
    },
    '@media (max-width: 768px)': {
        fontSize: '15px',
        lineHeight: '1.6',
        '& ul, & ol': {
            paddingLeft: '20px',
        },
    },
    '@media (max-width: 480px)': {
        fontSize: '14px',
        '& ul, & ol': {
            paddingLeft: '16px',
        },
    },
});

const ProgressBar = styled('div')({
    width: '100%',
    height: '8px',
    backgroundColor: 'rgba(255, 232, 161, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px',
    '@media (max-width: 480px)': {
        height: '6px',
    },
});

const ProgressFill = styled('div')(({ progress }) => ({
    height: '100%',
    backgroundColor: '#FFE8A1',
    width: `${progress}%`,
    transition: 'width 0.3s ease',
    borderRadius: '4px',
}));

const LoadingContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: '#FFE8A1',
    fontSize: '18px',
    flexDirection: 'column',
    gap: '16px',
    '@media (max-width: 768px)': {
        fontSize: '16px',
        minHeight: '300px',
    },
});

const ErrorContainer = styled('div')({
    textAlign: 'center',
    padding: '48px',
    color: '#FFE8A1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
        padding: '32px 24px',
    },
    '@media (max-width: 480px)': {
        padding: '24px 16px',
    },
});

const LoadingSpinner = styled('div')({
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,232,161,0.3)',
    borderTop: '3px solid #FFE8A1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
});

const ErrorIcon = styled('div')({
    fontSize: '48px',
    opacity: 0.7,
    marginBottom: '8px',
});

function ConservationEffortDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [conservationEffort, setConservationEffort] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConservationEffort = async () => {
            try {
                setLoading(true);
                const data = await contentService.fetchConservationEffortById(id);
                setConservationEffort(data);
            } catch (err) {
                console.error('Error fetching conservation effort:', err);
                setError('Failed to load conservation effort');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchConservationEffort();
        }
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Recent';
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                return 'Today';
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else if (diffDays < 7) {
                return `${diffDays} days ago`;
            } else {
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        } catch (error) {
            return 'Recent';
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <Header />
                <ContentWrapper>
                    <LoadingContainer>
                        <LoadingSpinner />
                        <div>Loading conservation effort...</div>
                    </LoadingContainer>
                </ContentWrapper>
                <Footer />
            </PageContainer>
        );
    }

    if (error || !conservationEffort) {
        return (
            <PageContainer>
                <Header />
                <ContentWrapper>
                    <ErrorContainer>
                        <ErrorIcon>⚠️</ErrorIcon>
                        <div style={{ fontSize: '24px', marginBottom: '16px' }}>Conservation Effort Not Found</div>
                        <div style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.8 }}>
                            The conservation effort you're looking for doesn't exist or has been removed.
                        </div>
                        <BackButton onClick={() => navigate('/resources/conservationefforts')}>
                            ← Back to Conservation Efforts
                        </BackButton>
                    </ErrorContainer>
                </ContentWrapper>
                <Footer />
            </PageContainer>
        );
    }

    const metadata = conservationEffort.content_metadata || {};
    const location = metadata.location || 'Location not specified';
    const progressPercentage = metadata.progress_percentage || 0;

    return (
        <PageContainer>
            <Header />
            <ContentWrapper>
                <BackButton onClick={() => navigate('/resources/conservationefforts')}>
                    ← Back to Conservation Efforts
                </BackButton>

                <ArticleContainer>
                    <BannerImage>
                        {(conservationEffort.image || conservationEffort.banner) ? (
                            <img
                                src={`${(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace('/api/v1', '')}/uploads/${conservationEffort.image || conservationEffort.banner}`}
                                alt={conservationEffort.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = '🌿 Conservation Banner';
                                }}
                            />
                        ) : (
                            '🌿 Conservation Banner'
                        )}
                    </BannerImage>

                    <ArticleContent>
                        <ArticleHeader>
                            <ArticleTitle>{conservationEffort.title}</ArticleTitle>

                            <ArticleMeta>
                                <MetaItem>
                                    <span>👤</span>
                                    <span>{conservationEffort.author_name || 'JUNGLORE'}</span>
                                </MetaItem>
                                <MetaItem>
                                    <span>📅</span>
                                    <span>{formatDate(conservationEffort.createdAt)}</span>
                                </MetaItem>
                                <MetaItem>
                                    <span>🌿</span>
                                    <span>Conservation Effort</span>
                                </MetaItem>
                            </ArticleMeta>

                            {conservationEffort.description && (
                                <ArticleDescription>{conservationEffort.description}</ArticleDescription>
                            )}
                        </ArticleHeader>

                        {conservationEffort.content && (
                            <ContentSection>
                                <SectionTitle>Project Description & Methods</SectionTitle>
                                <ContentText dangerouslySetInnerHTML={{ __html: conservationEffort.content }} />
                            </ContentSection>
                        )}
                    </ArticleContent>
                </ArticleContainer>
            </ContentWrapper>
            <Footer />
        </PageContainer>
    );
}

export default ConservationEffortDetail;
