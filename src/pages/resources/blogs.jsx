import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Header from '../../components/common/Header';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import FollowButton from '../../components/ui/FollowButton';
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

// Blog cards grid
const BlogGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '40px',
    '@media (max-width: 900px)': {
        gap: '28px',
    },
});

const BlogCard = styled('div')(({ reverse }) => ({
    display: 'flex',
    flexDirection: reverse ? 'row-reverse' : 'row',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: '16px',
    overflow: 'hidden',
    minHeight: '240px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '0',
    alignItems: 'stretch',
    gap: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    '@media (max-width: 900px)': {
        flexDirection: 'column',
        minHeight: '220px',
    },
}));

const BlogImagePlaceholder = styled('div')({
    width: '340px',
    minWidth: '340px',
    height: '100%',
    background: 'rgba(255,232,161,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '14px',
    borderTopLeftRadius: '16px',
    borderBottomLeftRadius: '16px',
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    overflow: 'hidden',
    objectFit: 'cover',
    '@media (max-width: 900px)': {
        width: '100%',
        minWidth: '0',
        height: '180px',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0',
    },
});

const BlogContent = styled('div')({
    flex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%',
    '@media (max-width: 900px)': {
        padding: '16px',
    },
});

const BlogMeta = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
});

const BlogAvatar = styled('div')({
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

const BlogAuthor = styled('div')({
    color: '#FFE8A1',
    fontWeight: 700,
    fontSize: '16px',
    textTransform: 'uppercase',
});

const BlogDate = styled('div')({
    color: '#FFE8A1',
    fontWeight: 400,
    fontSize: '14px',
    marginLeft: 'auto',
    opacity: 0.8,
});

const BlogTitle = styled('div')({
    color: '#FFE8A1',
    fontWeight: 700,
    fontSize: '22px',
    margin: '8px 0 0 0',
    lineHeight: 1.2,
    '@media (max-width: 600px)': {
        fontSize: '18px',
    },
});

const BlogReadMore = styled('div')({
    color: '#FFE8A1',
    fontWeight: 400,
    fontSize: '16px',
    textDecoration: 'underline',
    cursor: 'pointer',
    marginTop: '16px',
    width: 'fit-content',
    transition: 'all 0.3s ease',
    '&:hover': {
        opacity: 0.8,
        transform: 'translateY(-2px)',
    },
});

// Influencer section
const InfluencerSection = styled('div')({
    margin: '64px 0 0 0',
});

const InfluencerTitle = styled('div')({
    color: '#FFE8A1',
    fontWeight: 700,
    fontSize: '28px',
    marginBottom: '24px',
    '@media (max-width: 600px)': {
        fontSize: '20px',
        marginBottom: '16px',
    },
});

const InfluencerGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    '@media (max-width: 600px)': {
        gridTemplateColumns: '1fr',
        gap: '16px',
    },
});

const InfluencerCard = styled('div')({
    background: 'rgba(0,0,0,0.18)',
    border: '1px solid #FFE8A1',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '220px',
    position: 'relative',
    '@media (max-width: 600px)': {
        padding: '16px',
        minHeight: '160px',
    },
});

const InfluencerAvatar = styled('div')({
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(255,232,161,0.15)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFE8A1',
    fontSize: '16px',
});

const InfluencerName = styled('div')({
    color: '#FFE8A1',
    fontWeight: 700,
    fontSize: '16px',
    marginBottom: '4px',
});

const InfluencerFollowers = styled('div')({
    color: '#FFE8A1',
    fontWeight: 400,
    fontSize: '12px',
    marginBottom: '8px',
});

const InfluencerBio = styled('div')({
    color: '#FFE8A1',
    fontWeight: 400,
    fontSize: '12px',
    textAlign: 'center',
    marginBottom: 'auto',
});

const FollowButtonWrapper = styled('div')({
    marginTop: '16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
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

// API service for fetching blogs
const fetchBlogs = async (page = 1, limit = 9) => {
    try {
        const response = await contentService.fetchBlogs({ page, limit });

        // Handle the standardized API response format
        return {
            blogs: response.data || response.result || response.items || [],
            pagination: {
                page: response.page || response.currentPage || response.current_page || 1,
                limit: response.limit || response.per_page || 9,
                total: response.total || response.total_count || 0,
                pages: response.pages || response.totalPages || response.total_pages || 1
            }
        };
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return { blogs: [], pagination: { page: 1, limit: 9, total: 0, pages: 0 } };
    }
};

// Static influencer data removed - will be managed through admin panel in future

function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async (page = 1) => {
        setLoading(true);
        try {
            const data = await fetchBlogs(page, 9);
            setBlogs(data.blogs || []);
            setPagination(data.pagination || { page: 1, limit: 9, total: 0, pages: 0 });
        } catch (error) {
            console.error('Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowMore = async () => {
        if (pagination.page < pagination.pages) {
            const nextPage = pagination.page + 1;
            const data = await fetchBlogs(nextPage, 9);
            setBlogs(prevBlogs => [...prevBlogs, ...(data.blogs || [])]);
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
            <ContentWrapper>
                <Title>BLOGS</Title>
                <Subtitle>Discover fresh perspectives and stories that bring the wild closer to you.</Subtitle>
                <SectionTitle>FEATURED BLOGS</SectionTitle>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#FFE8A1' }}>
                        Loading blogs...
                    </div>
                ) : blogs.length > 0 ? (
                    <BlogGrid>
                        {blogs.map((blog, idx) => (
                            <BlogCard key={blog.id} reverse={idx % 2 === 1} onClick={() => navigate(`/resources/blog/${blog.id}`)} style={{ cursor: 'pointer' }}>
                                <BlogImagePlaceholder>
                                    {blog.image ? (
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentNode.textContent = 'Blog Image';
                                            }}
                                        />
                                    ) : (
                                        'Blog Image'
                                    )}
                                </BlogImagePlaceholder>
                                <BlogContent>
                                    <BlogMeta>
                                        <BlogAvatar>
                                            {blog.title?.charAt(0).toUpperCase() || 'B'}
                                        </BlogAvatar>
                                        <BlogAuthor>{blog.author_name || 'JUNGLORE'}</BlogAuthor>
                                        <BlogDate>{formatDate(blog.publishedAt || blog.createdAt)}</BlogDate>
                                    </BlogMeta>
                                    <BlogTitle>{blog.title}</BlogTitle>
                                    {blog.description && (
                                        <div style={{
                                            color: '#FFE8A1',
                                            fontSize: '14px',
                                            margin: '8px 0',
                                            lineHeight: 1.4,
                                            opacity: 0.9
                                        }}>
                                            {blog.description}
                                        </div>
                                    )}
                                    <BlogReadMore>Read more</BlogReadMore>
                                </BlogContent>
                            </BlogCard>
                        ))}
                    </BlogGrid>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#FFE8A1' }}>
                        <div style={{ fontSize: '18px', marginBottom: '16px' }}>No blogs available yet</div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Check back later for exciting wildlife content!
                        </div>
                    </div>
                )}
                {pagination.page < pagination.pages && (
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

export default BlogsPage;
