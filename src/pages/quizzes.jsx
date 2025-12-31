import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useRewards } from '../contexts/RewardsContext';
import { CurrencyDisplay, RewardNotification, Leaderboard } from '../components/rewards';
import quizService from '../services/quizService';
import { ListSkeleton } from '../components/ui/SkeletonLoader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { NetworkError, GenericError, useErrorHandler } from '../components/quiz/QuizErrorHandling';
import { ErrorMessage } from '../components/quiz/QuizDesignSystem';
import { API_BASE_URL } from '../services/api';

// Styled components (outside the function)
// Solid background (no stripes)
const QuizPageContainer = styled('div')({
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

const QuizzesTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '72px',
    letterSpacing: '4px', // Increased letter spacing for better readability
    marginBottom: '8px',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '48px', letterSpacing: '3px' },
    '@media (max-width: 480px)': { fontSize: '32px', letterSpacing: '2px' },
});

const QuizzesSubtitle = styled('div')({
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
    marginBottom: '32px',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '24px', marginBottom: '24px' },
    '@media (max-width: 480px)': { fontSize: '18px', marginBottom: '16px' },
});

const QuizGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridAutoRows: 'minmax(220px, auto)',
    gap: '32px',
    '@media (max-width: 1024px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
    },
    '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        gap: '18px',
    },
});

const QuizCard = styled('div')(({ featured, coverImage }) => ({
    position: 'relative',
    backgroundColor: coverImage ? 'transparent' : 'rgba(0,0,0,0.25)',
    backgroundImage: coverImage ? `url(${coverImage})` : 'linear-gradient(135deg, #2A4A3A 0%, #1E3A2E 50%, #0F2921 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '16px',
    overflow: 'hidden',
    minHeight: featured ? '260px' : '220px',
    gridColumn: featured ? 'span 2' : 'span 1',
    gridRow: featured ? 'span 1' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    boxShadow: featured ? '0 8px 32px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.10)',
    transition: 'all 0.3s ease',
    '&:hover': { 
        transform: 'translateY(-4px) scale(1.01)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
    },
    '@media (max-width: 1024px)': {
        minHeight: featured ? '200px' : '160px',
        gridColumn: 'span 1', // Always 1 column on tablet/mobile
    },
    '@media (max-width: 768px)': {
        minHeight: '140px',
        gridColumn: 'span 1',
    },
}));

const CardOverlay = styled('div')({
    position: 'relative',
    zIndex: 2,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
    '@media (max-width: 768px)': { padding: '16px' },
});

const CardHeader = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
});

const CardTitle = styled('div')({
    color: '#FFFFFF',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: 1.2,
    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
    letterSpacing: '0.5px',
    '@media (max-width: 1024px)': {
        fontSize: '16px',
    },
    '@media (max-width: 768px)': {
        fontSize: '15px',
    },
    '@media (max-width: 600px)': {
        fontSize: '14px',
    },
});

const Badge = styled('div')(({ status }) => ({
    background: status === 'completed' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 193, 7, 0.9)',
    color: status === 'completed' ? '#FFFFFF' : '#000000',
    fontWeight: 700,
    fontSize: '10px',
    borderRadius: '6px',
    padding: '4px 8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    alignSelf: 'flex-start',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    marginBottom: '8px',
}));

const CardFooter = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '16px',
});

const Stat = styled('div')({
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 700,
    fontSize: '12px',
    gap: '6px',
    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '20px',
    padding: '6px 12px',
});

const TimeDisplay = styled('div')({
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 700,
    fontSize: '12px',
    gap: '6px',
    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '20px',
    padding: '6px 12px',
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

// Difficulty level mapping
const difficultyLabels = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard'
};

// Format time from seconds to readable format
const formatTime = (seconds) => {
    if (!seconds) return 'No time limit';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
        return `${remainingSeconds} sec`;
    } else if (remainingSeconds === 0) {
        return `${minutes} min`;
    } else {
        return `${minutes} min ${remainingSeconds} sec`;
    }
};

const FilterSection = styled('div')({
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
        gap: '12px',
        marginBottom: '24px',
    },
});

const FilterButton = styled('button')(({ active }) => ({
    backgroundColor: active ? '#FFE8A1' : 'rgba(255, 232, 161, 0.1)',
    color: active ? '#1E2D27' : '#FFE8A1',
    border: `1px solid ${active ? '#FFE8A1' : 'rgba(255, 232, 161, 0.3)'}`,
    borderRadius: '8px',
    padding: '8px 16px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: active ? '#FFE8A1' : 'rgba(255, 232, 161, 0.2)',
        transform: 'translateY(-1px)',
    },
    '@media (max-width: 768px)': {
        fontSize: '12px',
        padding: '6px 12px',
    },
}));

// Remove old loading and error components - using new ones from imports

const EmptyState = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    color: '#FFE8A1',
    textAlign: 'center',
    padding: '24px',
});

const UserStatsSection = styled('div')({
    marginBottom: '32px',
    '@media (max-width: 768px)': {
        marginBottom: '24px',
    },
});

const LeaderboardSection = styled('div')({
    marginBottom: '32px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '@media (max-width: 768px)': {
        marginBottom: '24px',
        padding: '16px',
    },
});

const StatsTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '18px',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
        fontSize: '16px',
        marginBottom: '12px',
    },
});

const StatsGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    '@media (max-width: 768px)': {
        gap: '12px',
    },
    '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: '8px',
    },
});

const StatCard = styled('div')({
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    border: '1px solid rgba(255, 232, 161, 0.2)',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    '@media (max-width: 768px)': {
        padding: '12px',
    },
});

const StatNumber = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '24px',
    marginBottom: '4px',
    '@media (max-width: 768px)': {
        fontSize: '20px',
    },
});

const StatLabel = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    '@media (max-width: 768px)': {
        fontSize: '11px',
    },
});

const BottomSpacer = styled('div')({
    minHeight: '80px',
    '@media (max-width: 768px)': { minHeight: '60px' },
    '@media (max-width: 480px)': { minHeight: '40px' },
});

// QuizPage Component
function QuizPage() {
    // Calculate quiz rewards based on quiz data
    const getQuizRewards = (quiz) => {
        if (!quiz.total_questions) return { points: 0, credits: 0 };
        
        // Use credits from backend if available, otherwise calculate with new conservative approach
        const backendCredits = quiz.credits_on_completion;
        let credits;
        
        if (backendCredits && backendCredits > 0) {
            credits = backendCredits;
        } else {
            // Conservative fallback calculation for credits (business-safe)
            credits = 10; // New default base credits
        }
        
        // Calculate points (this can stay as frontend calculation with full multipliers)
        const basePoints = quiz.total_questions * 10;
        const difficultyMultiplier = quiz.difficulty === 3 ? 1.5 : 
                                   quiz.difficulty === 2 ? 1.2 : 1.0;
        const totalPoints = Math.round(basePoints * difficultyMultiplier);
        
        return { points: totalPoints, credits };
    };

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { balance } = useRewards();
    const { handleError } = useErrorHandler();

    // State management
    const [quizzes, setQuizzes] = useState([]);
    const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [errorInfo, setErrorInfo] = useState(null);
    const [filters, setFilters] = useState({
        difficulty: null,
        category_id: null,
        completion_status: null,
    });
    const [pagination, setPagination] = useState({
        skip: 0,
        limit: 12,
        hasMore: true,
    });

    // Enhanced fetch quizzes with better error handling
    const fetchQuizzes = async (reset = false) => {
        try {
            if (reset) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);
            setErrorInfo(null);

            const params = {
                skip: reset ? 0 : pagination.skip,
                limit: pagination.limit,
                active_only: true,
                // Only include API-supported filters
                ...(filters.difficulty && { difficulty: filters.difficulty }),
                ...(filters.category_id && { category_id: filters.category_id }),
            };

            const response = await quizService.getQuizzes(params);

            // Apply client-side completion status filtering
            let filteredResponse = response;
            if (filters.completion_status && isAuthenticated) {
                filteredResponse = response.filter(quiz => {
                    const isCompleted = completedQuizzes.has(quiz.id);
                    return filters.completion_status === 'completed' ? isCompleted : !isCompleted;
                });
            }

            if (reset) {
                setQuizzes(filteredResponse);
                setPagination(prev => ({ ...prev, skip: response.length }));
            } else {
                setQuizzes(prev => [...prev, ...filteredResponse]);
                setPagination(prev => ({
                    ...prev,
                    skip: prev.skip + response.length,
                    hasMore: response.length === pagination.limit
                }));
            }

        } catch (err) {
            console.error('Error fetching quizzes:', err);
            const errorDetails = handleError(err, { context: 'fetchQuizzes', reset });
            setError(err);
            setErrorInfo(errorDetails);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Fetch user's completed quizzes
    const fetchCompletedQuizzes = async () => {

        if (!isAuthenticated) return;

        try {
            const history = await quizService.getUserQuizHistory();
            if (history && history.results) {
                const completedIds = new Set(history.results.map(result => result.quiz_id));
                setCompletedQuizzes(completedIds);
            }
        } catch (err) {
            console.error('Error fetching quiz history:', err);
            // Don't show error for this, just continue without completion status
        }
    };

    // Initial load
    useEffect(() => {


        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            if (loading) {

                setError('Loading timeout - please try again');
                setLoading(false);
            }
        }, 10000); // 10 second timeout

        fetchQuizzes(true);
        fetchCompletedQuizzes();

        return () => clearTimeout(timeoutId);
    }, [filters, isAuthenticated]);

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType] === value ? null : value
        }));
        setPagination(prev => ({ ...prev, skip: 0, hasMore: true }));
    };

    // Handle show more with loading state
    const handleShowMore = () => {
        if (!loading && !loadingMore && pagination.hasMore) {
            fetchQuizzes(false);
        }
    };

    // Helper function to get full image URL
    const getFullImageUrl = (coverImage) => {
        if (!coverImage) return null;
        if (coverImage.startsWith('http')) return coverImage;
        const baseURL = API_BASE_URL.replace('/api/v1', ''); // Remove API prefix for static files
        return `${baseURL}${coverImage}`;
    };

    // Handle quiz click
    const handleQuizClick = (quizId) => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            navigate('/login', {
                state: {
                    from: `/quizzes/${quizId}`,
                    message: 'Please log in to take quizzes'
                }
            });
            return;
        }

        // Check if quiz is already completed
        if (completedQuizzes.has(quizId)) {
            const confirmRetake = window.confirm(
                'You have already completed this quiz. Would you like to view your results instead of retaking it?'
            );

            if (confirmRetake) {
                // Navigate to results view (we'll implement this later)
                navigate(`/quizzes/${quizId}/results`);
                return;
            }
            // If user chooses not to view results, they can still retake
        }

        // Navigate to quiz detail page
        navigate(`/quizzes/${quizId}`);
    };

    // Handle retry
    const handleRetry = () => {
        fetchQuizzes(true);
        fetchCompletedQuizzes();
    };

    // Determine quiz status
    const getQuizStatus = (quiz) => {
        if (!isAuthenticated) return 'new';
        return completedQuizzes.has(quiz.id) ? 'completed' : 'new';
    };

    // Render loading state with skeleton
    if (loading && quizzes.length === 0) {
        return (
            <QuizPageContainer>
                <Header />
                <ListSkeleton items={6} />
                <Footer />
            </QuizPageContainer>
        );
    }

    // Render error state with enhanced error handling
    if (error && quizzes.length === 0) {
        const ErrorComponent = errorInfo?.component || GenericError;

        return (
            <QuizPageContainer>
                <Header />
                <ContentWrapper>
                    <QuizzesTitle>QUIZZES</QuizzesTitle>
                    <QuizzesSubtitle>
                        Discover fresh perspectives and stories that bring the wild closer to you.
                    </QuizzesSubtitle>
                    <ErrorComponent
                        onRetry={handleRetry}
                        onGoBack={() => navigate('/')}
                        error={error}
                        {...(errorInfo?.type === 'validation' && { errors: error.details })}
                        {...(errorInfo?.type === 'server' && { errorCode: error.status })}
                    />
                </ContentWrapper>
                <Footer />
            </QuizPageContainer>
        );
    }

    return (
        <QuizPageContainer>
            <Header />
            <ContentWrapper>
                <QuizzesTitle>QUIZZES</QuizzesTitle>
                <QuizzesSubtitle>
                    Discover fresh perspectives and stories that bring the wild closer to you.
                </QuizzesSubtitle>

                {/* User Statistics */}
                {isAuthenticated && (
                    <UserStatsSection>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <StatsTitle>Your Progress</StatsTitle>
                            <CurrencyDisplay variant="compact" showBoth={true} />
                        </div>
                        {completedQuizzes.size > 0 && (
                            <StatsGrid>
                                <StatCard>
                                    <StatNumber>{completedQuizzes.size}</StatNumber>
                                    <StatLabel>Completed</StatLabel>
                                </StatCard>
                                <StatCard>
                                    <StatNumber>{quizzes.length - completedQuizzes.size}</StatNumber>
                                    <StatLabel>Remaining</StatLabel>
                                </StatCard>
                                <StatCard>
                                    <StatNumber>
                                        {quizzes.length > 0 ? Math.round((completedQuizzes.size / quizzes.length) * 100) : 0}%
                                    </StatNumber>
                                    <StatLabel>Progress</StatLabel>
                                </StatCard>
                            </StatsGrid>
                        )}
                    </UserStatsSection>
                )}

                {/* Leaderboard Section */}
                <LeaderboardSection>
                    <StatsTitle style={{ marginBottom: '16px', fontSize: '24px' }}>LEADERBOARD</StatsTitle>
                    <Leaderboard 
                        defaultType="weekly" 
                        showTabs={true}
                        limit={50}
                        className="quizzes-leaderboard"
                    />
                </LeaderboardSection>

                <SectionTitle>PICK A DECK</SectionTitle>

                {/* Filter Section */}
                <FilterSection>
                    <FilterButton
                        active={filters.difficulty === null && filters.completion_status === null}
                        onClick={() => {
                            setFilters({ difficulty: null, category_id: null, completion_status: null });
                            setPagination(prev => ({ ...prev, skip: 0, hasMore: true }));
                        }}
                    >
                        All Quizzes
                    </FilterButton>
                    <FilterButton
                        active={filters.difficulty === 1}
                        onClick={() => handleFilterChange('difficulty', 1)}
                    >
                        Easy
                    </FilterButton>
                    <FilterButton
                        active={filters.difficulty === 2}
                        onClick={() => handleFilterChange('difficulty', 2)}
                    >
                        Medium
                    </FilterButton>
                    <FilterButton
                        active={filters.difficulty === 3}
                        onClick={() => handleFilterChange('difficulty', 3)}
                    >
                        Hard
                    </FilterButton>
                    {isAuthenticated && (
                        <>
                            <FilterButton
                                active={filters.completion_status === 'completed'}
                                onClick={() => handleFilterChange('completion_status', 'completed')}
                            >
                                Completed
                            </FilterButton>
                            <FilterButton
                                active={filters.completion_status === 'new'}
                                onClick={() => handleFilterChange('completion_status', 'new')}
                            >
                                Not Started
                            </FilterButton>
                        </>
                    )}
                </FilterSection>

                {/* Quiz Grid */}
                {quizzes.length === 0 ? (
                    <EmptyState>
                        <ErrorMessage>No quizzes found</ErrorMessage>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Try adjusting your filters or check back later for new quizzes.
                        </div>
                    </EmptyState>
                ) : (
                    <>
                        <QuizGrid>
                            {quizzes.map((quiz, idx) => {
                                const status = getQuizStatus(quiz);
                                const isFeatured = idx === 0; // Make first quiz featured
                                const rewards = getQuizRewards(quiz);

                                return (
                                    <QuizCard
                                        key={quiz.id}
                                        featured={isFeatured}
                                        coverImage={getFullImageUrl(quiz.cover_image)}
                                        onClick={() => handleQuizClick(quiz.id)}
                                    >
                                        <CardOverlay>
                                            <CardHeader>
                                                <Badge status={status}>
                                                    {status === 'completed' ? '✓ COMPLETED' : 'NEW'}
                                                </Badge>
                                                <CardTitle>{quiz.title.toUpperCase()}</CardTitle>
                                            </CardHeader>
                                            <CardFooter>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                    <Stat>
                                                        📚 {quiz.total_questions} CARDS
                                                    </Stat>
                                                    <TimeDisplay>
                                                        ⏱️ {quiz.time_limit ? `${Math.ceil(quiz.time_limit / 60)} min ${quiz.time_limit % 60 === 0 ? '' : (quiz.time_limit % 60) + ' sec'}`.trim() : '2 min 30 sec'}
                                                    </TimeDisplay>
                                                    {isAuthenticated && (
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '8px', 
                                                            fontSize: '11px',
                                                            color: '#FFE8A1',
                                                            marginTop: '4px',
                                                            fontWeight: 600
                                                        }}>
                                                            <span>🏆 {rewards.points} pts</span>
                                                            <span>💎 {rewards.credits} credits</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardFooter>
                                        </CardOverlay>
                                    </QuizCard>
                                );
                            })}
                        </QuizGrid>

                        {/* Show More Section with loading state */}
                        {pagination.hasMore && (
                            <ShowMoreSection>
                                <Line />
                                <ShowMoreButton onClick={handleShowMore} disabled={loadingMore}>
                                    <ShowMoreText>
                                        {loadingMore ? 'LOADING...' : 'SHOW MORE'}
                                    </ShowMoreText>
                                    {!loadingMore && <ShowMoreArrow>›</ShowMoreArrow>}
                                </ShowMoreButton>
                                <Line />
                            </ShowMoreSection>
                        )}

                        {/* Loading overlay for pagination */}
                        {loadingMore && (
                            <LoadingSpinner text="Loading more quizzes..." />
                        )}
                    </>
                )}

                <BottomSpacer />
            </ContentWrapper>
            
            {/* Reward Notification */}
            <RewardNotification />
            
            <Footer />
        </QuizPageContainer>
    );
}

export default QuizPage;