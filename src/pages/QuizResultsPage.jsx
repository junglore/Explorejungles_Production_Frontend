import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import QuizResults from '../components/quiz/QuizResults';
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
const ResultsPageContainer = styled('div')({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1E2D27',
    display: 'flex',
    flexDirection: 'column',
});

const ContentWrapper = styled('div')({
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '120px 24px 0 24px',
    '@media (max-width: 1024px)': { padding: '100px 20px 0 20px' },
    '@media (max-width: 768px)': { padding: '80px 16px 0 16px' },
    '@media (max-width: 480px)': { padding: '70px 12px 0 12px' },
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

const RetryButton = styled('button')({
    backgroundColor: '#FFE8A1',
    color: '#1E2D27',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(255, 232, 161, 0.3)',
    },
});

// Page header
const PageHeader = styled('div')({
    marginBottom: '32px',
    textAlign: 'center',
    '@media (max-width: 768px)': {
        marginBottom: '24px',
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

const BottomSpacer = styled('div')({
    minHeight: '80px',
    '@media (max-width: 768px)': { minHeight: '60px' },
    '@media (max-width: 480px)': { minHeight: '40px' },
});

function QuizResultsPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // State management
    const [quiz, setQuiz] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get result from navigation state or fetch from API
    useEffect(() => {
        // Check authentication
        if (!isAuthenticated) {
            navigate('/login', {
                state: {
                    from: location.pathname,
                    message: 'Please log in to view quiz results'
                }
            });
            return;
        }

        const initializeResults = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get quiz data
                const quizData = await quizService.getQuiz(quizId);
                setQuiz(quizData);

                // Check if result was passed via navigation state
                if (location.state?.result) {
                    setResult(location.state.result);
                } else {
                    // Fetch user's most recent result for this quiz
                    const userResult = await quizService.getUserQuizResult(quizId);
                    if (userResult) {
                        setResult(userResult);
                    } else {
                        throw new Error('No quiz results found. Please take the quiz first.');
                    }
                }

            } catch (err) {
                console.error('Error loading quiz results:', err);
                setError(err.message || 'Failed to load quiz results');
            } finally {
                setLoading(false);
            }
        };

        initializeResults();
    }, [quizId, isAuthenticated, navigate, location]);

    // Handle retake quiz
    const handleRetakeQuiz = () => {
        navigate(`/quizzes/${quizId}/take`);
    };

    // Handle back to quizzes
    const handleBackToQuizzes = () => {
        navigate('/quizzes');
    };

    // Handle share results
    const handleShareResults = () => {
        if (!result || !quiz) return;

        const shareText = `I just completed "${quiz.title}" and scored ${result.score}/${result.max_score} (${result.percentage}%)! 🎉`;

        if (navigator.share) {
            // Use native sharing if available
            navigator.share({
                title: `Quiz Results - ${quiz.title}`,
                text: shareText,
                url: window.location.href,
            }).catch(err => {
                console.log('Error sharing:', err);
                fallbackShare(shareText);
            });
        } else {
            fallbackShare(shareText);
        }
    };

    // Fallback sharing method
    const fallbackShare = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Results copied to clipboard!');
            }).catch(() => {
                alert('Unable to copy results. Please share manually.');
            });
        } else {
            // Create a temporary text area for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Results copied to clipboard!');
            } catch (err) {
                alert('Unable to copy results. Please share manually.');
            }
            document.body.removeChild(textArea);
        }
    };

    // Handle retry
    const handleRetry = () => {
        window.location.reload();
    };

    // Render loading state
    if (loading) {
        return (
            <ResultsPageContainer>
                <Header />
                <ContentWrapper>
                    <LoadingContainer>
                        <SimpleSpinner />
                        <LoadingText>Loading results...</LoadingText>
                    </LoadingContainer>
                </ContentWrapper>
                <Footer />
            </ResultsPageContainer>
        );
    }

    // Render error state
    if (error) {
        return (
            <ResultsPageContainer>
                <Header />
                <ContentWrapper>
                    <ErrorContainer>
                        <ErrorMessage>{error}</ErrorMessage>
                        <RetryButton onClick={handleRetry}>
                            Try Again
                        </RetryButton>
                    </ErrorContainer>
                </ContentWrapper>
                <Footer />
            </ResultsPageContainer>
        );
    }

    // Render results not found
    if (!quiz || !result) {
        return (
            <ResultsPageContainer>
                <Header />
                <ContentWrapper>
                    <ErrorContainer>
                        <ErrorMessage>Quiz results not found</ErrorMessage>
                        <RetryButton onClick={handleBackToQuizzes}>
                            Back to Quizzes
                        </RetryButton>
                    </ErrorContainer>
                </ContentWrapper>
                <Footer />
            </ResultsPageContainer>
        );
    }

    return (
        <ResultsPageContainer>
            <Header />
            <ContentWrapper>
                <PageHeader>
                    <PageTitle>Quiz Results</PageTitle>
                    <PageSubtitle>
                        Here's how you performed on "{quiz.title}"
                    </PageSubtitle>
                </PageHeader>

                <QuizResults
                    result={result}
                    quiz={quiz}
                    onRetakeQuiz={handleRetakeQuiz}
                    onBackToQuizzes={handleBackToQuizzes}
                    onShareResults={handleShareResults}
                    showDetailedBreakdown={true}
                />

                <BottomSpacer />
            </ContentWrapper>
            <Footer />
        </ResultsPageContainer>
    );
}

export default QuizResultsPage;