import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import contentService from '../../services/contentService';

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

const Title = styled('h1')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '48px',
    letterSpacing: '-1px',
    margin: '0 0 16px 0',
    lineHeight: 1.2,
    '@media (max-width: 768px)': {
        fontSize: '36px',
        marginBottom: '12px',
        lineHeight: 1.3
    },
    '@media (max-width: 480px)': {
        fontSize: '28px',
        marginBottom: '8px',
        lineHeight: 1.4
    },
});

const Meta = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    opacity: 0.8,
    marginBottom: '32px',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
        fontSize: '14px',
        marginBottom: '24px',
        gap: '12px'
    },
    '@media (max-width: 480px)': {
        fontSize: '13px',
        gap: '8px'
    },
});

const MetaItem = styled('span')({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '@media (max-width: 480px)': {
        gap: '4px'
    },
});

const MetaDivider = styled('span')({
    color: '#FFE8A1',
    opacity: 0.5,
    '@media (max-width: 480px)': {
        display: 'none'
    },
});

const FeaturedImage = styled('div')({
    width: '100%',
    height: '400px',
    background: 'rgba(255,232,161,0.08)',
    borderRadius: '16px',
    marginBottom: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '16px',
    fontWeight: 500,
    overflow: 'hidden',
    position: 'relative',
    '@media (max-width: 768px)': {
        height: '300px',
        marginBottom: '32px',
        borderRadius: '12px'
    },
    '@media (max-width: 480px)': {
        height: '240px',
        marginBottom: '24px',
        borderRadius: '8px'
    },
});

const ContentBody = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    lineHeight: 1.8,
    fontSize: '18px',
    width: '100%',
    maxWidth: '100%',
    '& p': {
        marginBottom: '24px',
        '&:last-child': {
            marginBottom: 0,
        },
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
        color: '#FFE8A1',
        fontWeight: 700,
        marginTop: '32px',
        marginBottom: '16px',
        '&:first-child': {
            marginTop: 0,
        },
    },
    '& h1': { fontSize: '32px' },
    '& h2': { fontSize: '28px' },
    '& h3': { fontSize: '24px' },
    '& strong, & b': {
        fontWeight: 700,
        color: '#FFE8A1',
    },
    '& em, & i': {
        fontStyle: 'italic',
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
        paddingLeft: '20px',
        margin: '24px 0',
        fontStyle: 'italic',
        opacity: 0.9,
        backgroundColor: 'rgba(255,232,161,0.05)',
        padding: '16px 20px',
        borderRadius: '0 8px 8px 0',
    },
    '& ul, & ol': {
        paddingLeft: '24px',
        marginBottom: '24px',
        '& li': {
            marginBottom: '8px',
        },
    },
    '& code': {
        backgroundColor: 'rgba(255, 232, 161, 0.1)',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '0.9em',
        fontFamily: 'monospace',
    },
    '& pre': {
        backgroundColor: 'rgba(255, 232, 161, 0.05)',
        padding: '16px',
        borderRadius: '8px',
        overflow: 'auto',
        margin: '24px 0',
        border: '1px solid rgba(255,232,161,0.1)',
        '& code': {
            backgroundColor: 'transparent',
            padding: 0,
        },
    },
    '& a': {
        color: '#FFE8A1',
        textDecoration: 'underline',
        '&:hover': {
            opacity: 0.8,
        },
    },
    '@media (max-width: 768px)': {
        fontSize: '16px',
        lineHeight: 1.7,
        '& p': { marginBottom: '20px' },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: '24px',
            marginBottom: '12px',
        },
        '& h1': { fontSize: '28px' },
        '& h2': { fontSize: '24px' },
        '& h3': { fontSize: '20px' },
        '& blockquote': {
            padding: '12px 16px',
            margin: '20px 0',
        },
    },
    '@media (max-width: 480px)': {
        fontSize: '15px',
        lineHeight: 1.6,
        '& p': { marginBottom: '16px' },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: '20px',
            marginBottom: '10px',
        },
        '& h1': { fontSize: '24px' },
        '& h2': { fontSize: '20px' },
        '& h3': { fontSize: '18px' },
        '& blockquote': {
            paddingLeft: '16px',
            margin: '20px 0',
            padding: '12px 16px',
        },
        '& ul, & ol': {
            paddingLeft: '20px',
        },
    },
});

const LoadingState = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    textAlign: 'center',
    padding: '80px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
        fontSize: '16px',
        padding: '60px 0',
    },
});

const ErrorState = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    textAlign: 'center',
    padding: '80px 0',
    opacity: 0.8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
        fontSize: '16px',
        padding: '60px 0',
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

function CaseStudyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [caseStudy, setCaseStudy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const response = await contentService.fetchCaseStudyById(id);
                setCaseStudy(response);
            } catch (err) {
                console.error('Error fetching case study:', err);
                setError('Case study not found or failed to load.');
                // Navigate back to case studies page after a delay
                setTimeout(() => navigate('/resources/casestudies'), 3000);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetail();
    }, [id, navigate]);

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
            <ContentWrapper>
                {loading ? (
                    <LoadingState>
                        <LoadingSpinner />
                        <div>Loading case study...</div>
                    </LoadingState>
                ) : error ? (
                    <ErrorState>
                        <ErrorIcon>⚠️</ErrorIcon>
                        <div>{error}</div>
                        <BackButton onClick={() => navigate('/resources/casestudies')}>
                            ← Back to Case Studies
                        </BackButton>
                    </ErrorState>
                ) : caseStudy ? (
                    <>
                        <BackButton onClick={() => navigate('/resources/casestudies')}>
                            ← Back to Case Studies
                        </BackButton>

                        <Title>{caseStudy.title}</Title>

                        <Meta>
                            <MetaItem>
                                <span>👤</span>
                                <span>{caseStudy.author_name || 'JUNGLORE'}</span>
                            </MetaItem>
                            <MetaDivider>•</MetaDivider>
                            <MetaItem>
                                <span>📅</span>
                                <span>{formatDate(caseStudy.publishedAt || caseStudy.createdAt)}</span>
                            </MetaItem>
                            {caseStudy.featured && (
                                <>
                                    <MetaDivider>•</MetaDivider>
                                    <MetaItem>
                                        <span>⭐</span>
                                        <span>Featured</span>
                                    </MetaItem>
                                </>
                            )}
                        </Meta>

                        {(caseStudy.image || caseStudy.banner) && (
                            <FeaturedImage>
                                <img
                                    src={caseStudy.image || caseStudy.banner}
                                    alt={caseStudy.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: 'inherit'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentNode.innerHTML = '🔬 Case Study Image';
                                    }}
                                />
                            </FeaturedImage>
                        )}

                        <ContentBody>
                            {caseStudy.content ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: caseStudy.content.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')
                                    }}
                                />
                            ) : (
                                <div style={{
                                    fontStyle: 'italic',
                                    opacity: 0.7,
                                    textAlign: 'center',
                                    padding: '40px 0',
                                    backgroundColor: 'rgba(255,232,161,0.05)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,232,161,0.1)'
                                }}>
                                    {caseStudy.description || 'No content available for this case study.'}
                                </div>
                            )}
                        </ContentBody>
                    </>
                ) : null}
            </ContentWrapper>
            <Footer />
        </PageContainer>
    );
}

export default CaseStudyDetail;
