import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';
import quizService from '../services/quizService';

// Loading spinner component
const SimpleSpinner = styled('div')({
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 232, 161, 0.3)',
    borderTop: '3px solid #FFE8A1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
});

// Main container
const HistoryPageContainer = styled('div')({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1E2D27',
    display: 'flex',
    flexDirection: 'column',
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

// Page header
const PageHeader = styled('div')({
    marginBottom: '40px',
    textAlign: 'center',
    '@media (max-width: 768px)': {
        marginBottom: '32px',
    },
});

const PageTitle = styled('h1')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '48px',
    letterSpacing: '-1px',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
        fontSize: '36px',
        marginBottom: '12px',
    },
    '@media (max-width: 480px)': {
        fontSize: '28px',
        marginBottom: '8px',
    },
});

const PageSubtitle = styled('p')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    margin: 0,
    '@media (max-width: 768px)': {
        fontSize: '14px',
    },
});

// Statistics section
const StatsSection = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
        marginBottom: '32px',
        gap: '16px',
    },
});

const StatCard = styled('div')({
    backgroundColor: 'rgba(255, 232, 161, 0.05)',
    border: '1px solid rgba(255, 232, 161, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
    },
    '@media (max-width: 768px)': {
        padding: '20px',
    },
});

const StatValue = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '36px',
    fontWeight: 900,
    marginBottom: '8px',
    '@media (max-width: 768px)': {
        fontSize: '28px',
    },
});

const StatLabel = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
});

// Filter section
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
    backgroundColor: active ? '#FFE8A1' : 'transparent',
    color: active ? '#1E2D27' : '#FFE8A1',
    border: active ? 'none' : '1px solid rgba(255, 232, 161, 0.3)',
    borderRadius: '8px',
    padding: '10px 20px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: active ? '#FFE8A1' : 'rgba(255, 232, 161, 0.1)',
        transform: 'translateY(-1px)',
    },
    '@media (max-width: 768px)': {
        padding: '8px 16px',
        fontSize: '13px',
    },
}));

// Quiz history list
const HistoryList = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
});

const HistoryItem = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        transform: 'translateY(-2px)',
    },
    '@media (max-width: 768px)': {
        padding: '20px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
    },
});

const QuizInfo = styled('div')({
    flex: 1,
});

const QuizTitle = styled('h3')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '8px',
    margin: 0,
    '@media (max-width: 768px)': {
        fontSize: '16px',
        marginBottom: '6px',
    },
});

const QuizMeta = styled('div')({
    display: 'flex',
    gap: '16px',
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '4px',
        fontSize: '13px',
    },
});

const ScoreDisplay = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
        width: '100%',
        justifyContent: 'space-between',
    },
});

const ScoreBadge = styled('div')(({ percentage }) => {
    let backgroundColor = '#4CAF50';
    let color = 'white';

    if (percentage < 60) {
        backgroundColor = '#F44336';
    } else if (percentage < 75) {
        backgroundColor = '#FF9800';
    } else if (percentage < 90) {
        backgroundColor = '#FFC107';
        color = '#1E2D27';
    }

    return {
        backgroundColor,
        color,
        padding: '8px 16px',
        borderRadius: '20px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '14px',
        fontWeight: 700,
        '@media (max-width: 768px)': {
            fontSize: '13px',
            padding: '6px 12px',
        },
    };
});

const ViewButton = styled('button')({
    backgroundColor: 'transparent',
    color: '#FFE8A1',
    border: '1px solid rgba(255, 232, 161, 0.3)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 232, 161, 0.1)',
        transform: 'translateY(-1px)',
    },
    '@media (max-width: 768px)': {
        fontSize: '13px',
        padding: '6px 12px',
    },
});

// Loading and error states
const LoadingContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: '#FFE8A1',
    textAlign: 'center',
});

const LoadingText = styled('div')({
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    marginTop: '16px',
    '@media (max-width: 768px)': {
        fontSize: '16px',
    },
});

const ErrorContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: '#FFE8A1',
    textAlign: 'center',
    padding: '24px',
});

const ErrorMessage = styled('div')({
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
        fontSize: '16px',
    },
});

const EmptyState = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    color: '#CDD99D',
    textAlign: 'center',
    padding: '40px',
});

const EmptyStateIcon = styled('div')({
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5,
});

const EmptyStateText = styled('div')({
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    marginBottom: '8px',
    '@media (max-width: 768px)': {
        fontSize: '16px',
    },
});

const EmptyStateSubtext = styled('div')({
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    opacity: 0.7,
    '@media (max-width: 768px)': {
        fontSize: '13px',
    },
});

const BottomSpacer = styled('div')({
    minHeight: '80px',
    '@media (max-width: 768px)': { minHeight: '60px' },
    '@media (max-width: 480px)': { minHeight: '40px' },
});

function QuizHistoryPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // State management
    const [history, setHistory] = useState(null);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    // Filter options
    const filters = [
        { key: 'all', label: 'All Quizzes' },
        { key: 'excellent', label: 'Excellent (90%+)' },
        { key: 'good', label: 'Good (75-89%)' },
        { key: 'fair', label: 'Fair (60-74%)' },
        { key: 'poor', label: 'Needs Work (<60%)' },
    ];

    // Load quiz history
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {
                state: {
                    from: '/quiz-history',
                    message: 'Please log in to view your quiz history'
                }
            });
            return;
        }

        const loadHistory = async () => {
            try {
                setLoading(true);
                setError(null);
                const historyData = await quizService.getUserQuizHistory();
                setHistory(historyData);
                setFilteredHistory(historyData.results || []);
            } catch (err) {
                console.error('Error loading quiz history:', err);
                setError(err.message || 'Failed to load quiz history');
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [isAuthenticated, navigate]);

    // Filter history based on active filter
    useEffect(() => {
        if (!history || !history.results) return;

        let filtered = [...history.results];

        switch (activeFilter) {
            case 'excellent':
                filtered = filtered.filter(result => result.percentage >= 90);
                break;
            case 'good':
                filtered = filtered.filter(result => result.percentage >= 75 && result.percentage < 90);
                break;
            case 'fair':
                filtered = filtered.filter(result => result.percentage >= 60 && result.percentage < 75);
                break;
            case 'poor':
                filtered = filtered.filter(result => result.percentage < 60);
                break;
            default:
                // 'all' - no filtering
                break;
        }

        // Sort by completion date (most recent first)
        filtered.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

        setFilteredHistory(filtered);
    }, [history, activeFilter]);

    // Calculate statistics
    const getStatistics = () => {
        if (!history || !history.results || history.results.length === 0) {
            return {
                totalQuizzes: 0,
                averageScore: 0,
                bestScore: 0,
                totalTime: 0,
            };
        }

        const results = history.results;
        const totalQuizzes = results.length;
        const averageScore = Math.round(
            results.reduce((sum, result) => sum + result.percentage, 0) / totalQuizzes
        );
        const bestScore = Math.max(...results.map(result => result.percentage));
        const totalTime = results.reduce((sum, result) => sum + (result.time_taken || 0), 0);

        return {
            totalQuizzes,
            averageScore,
            bestScore,
            totalTime,
        };
    };

    // Format time
    const formatTime = (seconds) => {
        if (!seconds) return 'N/A';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Handle quiz click
    const handleQuizClick = (result) => {
        navigate(`/quizzes/${result.quiz_id}/results`, {
            state: { result }
        });
    };

    // Handle filter change
    const handleFilterChange = (filterKey) => {
        setActiveFilter(filterKey);
    };

    const statistics = getStatistics();

    // Render loading state
    if (loading) {
        return (
            <HistoryPageContainer>
                <Header />
                <ContentWrapper>
                    <LoadingContainer>
                        <SimpleSpinner />
                        <LoadingText>Loading your quiz history...</LoadingText>
                    </LoadingContainer>
                </ContentWrapper>
                <Footer />
            </HistoryPageContainer>
        );
    }

    // Render error state
    if (error) {
        return (
            <HistoryPageContainer>
                <Header />
                <ContentWrapper>
                    <ErrorContainer>
                        <ErrorMessage>{error}</ErrorMessage>
                    </ErrorContainer>
                </ContentWrapper>
                <Footer />
            </HistoryPageContainer>
        );
    }

    return (
        <HistoryPageContainer>
            <Header />
            <ContentWrapper>
                <PageHeader>
                    <PageTitle>Quiz History</PageTitle>
                    <PageSubtitle>
                        Track your learning progress and review past quiz results
                    </PageSubtitle>
                </PageHeader>

                {/* Statistics Section */}
                <StatsSection>
                    <StatCard>
                        <StatValue>{statistics.totalQuizzes}</StatValue>
                        <StatLabel>Quizzes Completed</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{statistics.averageScore}%</StatValue>
                        <StatLabel>Average Score</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{statistics.bestScore}%</StatValue>
                        <StatLabel>Best Score</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{formatTime(statistics.totalTime)}</StatValue>
                        <StatLabel>Total Time Spent</StatLabel>
                    </StatCard>
                </StatsSection>

                {/* Filter Section */}
                {statistics.totalQuizzes > 0 && (
                    <FilterSection>
                        {filters.map(filter => (
                            <FilterButton
                                key={filter.key}
                                active={activeFilter === filter.key}
                                onClick={() => handleFilterChange(filter.key)}
                            >
                                {filter.label}
                            </FilterButton>
                        ))}
                    </FilterSection>
                )}

                {/* History List */}
                {filteredHistory.length > 0 ? (
                    <HistoryList>
                        {filteredHistory.map((result, index) => (
                            <HistoryItem
                                key={`${result.quiz_id}-${result.completed_at}-${index}`}
                                onClick={() => handleQuizClick(result)}
                            >
                                <QuizInfo>
                                    <QuizTitle>{result.quiz_title || 'Quiz'}</QuizTitle>
                                    <QuizMeta>
                                        <span>Completed on {formatDate(result.completed_at)}</span>
                                        <span>•</span>
                                        <span>{result.answers?.length || 0} questions</span>
                                        {result.time_taken && (
                                            <>
                                                <span>•</span>
                                                <span>{formatTime(result.time_taken)}</span>
                                            </>
                                        )}
                                    </QuizMeta>
                                </QuizInfo>
                                <ScoreDisplay>
                                    <ScoreBadge percentage={result.percentage}>
                                        {result.score}/{result.max_score} ({result.percentage}%)
                                    </ScoreBadge>
                                    <ViewButton>View Details</ViewButton>
                                </ScoreDisplay>
                            </HistoryItem>
                        ))}
                    </HistoryList>
                ) : statistics.totalQuizzes === 0 ? (
                    <EmptyState>
                        <EmptyStateIcon>🎯</EmptyStateIcon>
                        <EmptyStateText>No quizzes completed yet</EmptyStateText>
                        <EmptyStateSubtext>
                            Start taking quizzes to track your learning progress!
                        </EmptyStateSubtext>
                    </EmptyState>
                ) : (
                    <EmptyState>
                        <EmptyStateIcon>🔍</EmptyStateIcon>
                        <EmptyStateText>No quizzes match your filter</EmptyStateText>
                        <EmptyStateSubtext>
                            Try selecting a different filter to see more results
                        </EmptyStateSubtext>
                    </EmptyState>
                )}

                <BottomSpacer />
            </ContentWrapper>
            <Footer />
        </HistoryPageContainer>
    );
}

export default QuizHistoryPage;