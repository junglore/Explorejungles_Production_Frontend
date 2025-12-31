import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';
import quizService from '../services/quizService';

// Import enhanced loading and error components
import { QuizDetailSkeleton, QuizLoadingOverlay } from '../components/quiz/QuizSkeletonLoaders';
import { QuizNotFoundError, PermissionError, GenericError, useErrorHandler } from '../components/quiz/QuizErrorHandling';

// Main container
const QuizDetailContainer = styled('div')({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1E2D27',
    display: 'flex',
    flexDirection: 'column',
});

const ContentWrapper = styled('div')({
    width: '100%',
    maxWidth: '800px',
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

// Quiz header section
const QuizHeader = styled('div')({
    marginBottom: '32px',
    '@media (max-width: 768px)': {
        marginBottom: '24px',
    },
});

const BackButton = styled('button')({
    backgroundColor: 'transparent',
    color: '#FFE8A1',
    border: '1px solid rgba(255, 232, 161, 0.3)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 232, 161, 0.1)',
        transform: 'translateY(-1px)',
    },
});

const QuizTitle = styled('h1')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '48px',
    letterSpacing: '-1px',
    marginBottom: '16px',
    lineHeight: 1.1,
    '@media (max-width: 768px)': {
        fontSize: '36px',
        marginBottom: '12px',
    },
    '@media (max-width: 480px)': {
        fontSize: '28px',
        marginBottom: '8px',
    },
});

const QuizDescription = styled('p')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    lineHeight: 1.6,
    marginBottom: '24px',
    '@media (max-width: 768px)': {
        fontSize: '14px',
        marginBottom: '20px',
    },
});

const QuizMeta = styled('div')({
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '32px',
    '@media (max-width: 768px)': {
        gap: '16px',
        marginBottom: '24px',
    },
    '@media (max-width: 480px)': {
        flexDirection: 'column',
        gap: '12px',
    },
});

const MetaItem = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
});

// Quiz start section
const QuizStartSection = styled('div')({
    backgroundColor: 'rgba(255, 232, 161, 0.05)',
    border: '1px solid rgba(255, 232, 161, 0.2)',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    marginBottom: '32px',
    '@media (max-width: 768px)': {
        padding: '24px',
        marginBottom: '24px',
    },
    '@media (max-width: 480px)': {
        padding: '20px',
        marginBottom: '20px',
    },
});

const StartTitle = styled('h2')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '24px',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
        fontSize: '20px',
        marginBottom: '12px',
    },
});

const StartDescription = styled('p')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    lineHeight: 1.5,
    marginBottom: '24px',
    '@media (max-width: 768px)': {
        fontSize: '14px',
        marginBottom: '20px',
    },
});

const StartButton = styled('button')({
    backgroundColor: '#FFE8A1',
    color: '#1E2D27',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(255, 232, 161, 0.3)',
    },
    '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
    },
    '@media (max-width: 768px)': {
        padding: '14px 28px',
        fontSize: '14px',
    },
});

// Quiz instructions
const InstructionsSection = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    '@media (max-width: 768px)': {
        padding: '20px',
        marginBottom: '24px',
    },
});

const InstructionsTitle = styled('h3')({
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

const InstructionsList = styled('ul')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    lineHeight: 1.6,
    paddingLeft: '20px',
    '& li': {
        marginBottom: '8px',
    },
});

const BottomSpacer = styled('div')({
    minHeight: '80px',
    '@media (max-width: 768px)': { minHeight: '60px' },
    '@media (max-width: 480px)': { minHeight: '40px' },
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

function QuizDetail() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { handleError } = useErrorHandler();

    // State management
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorInfo, setErrorInfo] = useState(null);
    const [isStarting, setIsStarting] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);

    // Enhanced fetch quiz data with better error handling
    const fetchQuiz = async () => {
        try {
            setLoading(true);
            setError(null);
            setErrorInfo(null);

            if (!quizId) {
                const error = new Error('Quiz ID is required');
                error.code = 'INVALID_QUIZ_ID';
                throw error;
            }



            const quizData = await quizService.getQuiz(quizId);
            setQuiz(quizData);

            // Check if user has completed this quiz
            if (isAuthenticated) {
                try {
                    const userResult = await quizService.getUserQuizResult(quizId);
                    setHasCompleted(!!userResult);
                } catch (resultErr) {
                    // Don't fail the whole page if we can't get completion status
                    console.warn('Could not fetch completion status:', resultErr);
                }
            }

        } catch (err) {
            console.error('Error fetching quiz:', err);
            const errorDetails = handleError(err, { context: 'fetchQuiz', quizId });
            setError(err);
            setErrorInfo(errorDetails);
        } finally {
            setLoading(false);
        }
    };

    // Initialize component with better authentication handling
    useEffect(() => {
        // Check authentication
        if (!isAuthenticated) {
            navigate('/login', {
                state: {
                    from: location.pathname,
                    message: 'Please log in to take quizzes'
                }
            });
            return;
        }

        fetchQuiz();
    }, [quizId, isAuthenticated, navigate, location.pathname]);

    // Handle back navigation
    const handleBack = () => {
        navigate('/quizzes');
    };

    // Handle quiz start
    const handleStartQuiz = async () => {
        if (!quiz || isStarting) return;

        // If user has already completed the quiz, ask for confirmation
        if (hasCompleted) {
            const confirmRetake = window.confirm(
                'You have already completed this quiz. Are you sure you want to retake it? Your previous score will be replaced.'
            );
            if (!confirmRetake) return;
        }

        setIsStarting(true);

        try {
            // Navigate to quiz taking interface (we'll implement this in the next subtask)
            navigate(`/quizzes/${quizId}/take`);
        } catch (err) {
            console.error('Error starting quiz:', err);
            setIsStarting(false);
        }
    };

    // Handle retry
    const handleRetry = () => {
        fetchQuiz();
    };

    // Render loading state with skeleton
    if (loading) {
        return (
            <QuizDetailContainer>
                <Header />
                <QuizDetailSkeleton />
                <Footer />
                {isStarting && <QuizLoadingOverlay message="Starting quiz..." />}
            </QuizDetailContainer>
        );
    }

    // Render error state with enhanced error handling
    if (error) {
        let ErrorComponent = GenericError;
        let errorProps = {
            onRetry: handleRetry,
            onGoBack: handleBack,
            error: error
        };

        // Handle specific error types
        if (error.status === 404 || error.code === 'NOT_FOUND') {
            ErrorComponent = QuizNotFoundError;
            errorProps = {
                onGoBack: handleBack,
                onBrowseQuizzes: () => navigate('/quizzes')
            };
        } else if (error.status === 401 || error.status === 403) {
            ErrorComponent = PermissionError;
            errorProps = {
                onLogin: () => navigate('/login', {
                    state: { from: location.pathname }
                }),
                onGoBack: handleBack
            };
        }

        return (
            <QuizDetailContainer>
                <Header />
                <ContentWrapper>
                    <ErrorComponent {...errorProps} />
                </ContentWrapper>
                <Footer />
            </QuizDetailContainer>
        );
    }

    // Render quiz not found (shouldn't happen with proper error handling)
    if (!quiz) {
        return (
            <QuizDetailContainer>
                <Header />
                <ContentWrapper>
                    <QuizNotFoundError
                        onGoBack={handleBack}
                        onBrowseQuizzes={() => navigate('/quizzes')}
                    />
                </ContentWrapper>
                <Footer />
            </QuizDetailContainer>
        );
    }

    return (
        <QuizDetailContainer>
            <Header />
            <ContentWrapper>
                <QuizHeader>
                    <BackButton onClick={handleBack}>
                        <span>←</span>
                        Back to Quizzes
                    </BackButton>

                    <QuizTitle>{quiz.title}</QuizTitle>

                    {quiz.description && (
                        <QuizDescription>{quiz.description}</QuizDescription>
                    )}

                    <QuizMeta>
                        <MetaItem>
                            <span role="img" aria-label="questions">📚</span>
                            {quiz.questions?.length || 0} Questions
                        </MetaItem>
                        <MetaItem>
                            <span role="img" aria-label="difficulty">⭐</span>
                            {difficultyLabels[quiz.difficulty_level] || 'Unknown'}
                        </MetaItem>
                        {quiz.time_limit && (
                            <MetaItem>
                                <span role="img" aria-label="time">⏱️</span>
                                {formatTime(quiz.time_limit)}
                            </MetaItem>
                        )}
                        {quiz.category && (
                            <MetaItem>
                                <span role="img" aria-label="category">🏷️</span>
                                {quiz.category.name}
                            </MetaItem>
                        )}
                    </QuizMeta>
                </QuizHeader>

                <QuizStartSection>
                    <StartTitle>
                        {hasCompleted ? 'Retake Quiz' : 'Ready to Start?'}
                    </StartTitle>
                    <StartDescription>
                        {hasCompleted
                            ? 'You have already completed this quiz. You can retake it to improve your score.'
                            : 'Test your knowledge with this interactive quiz. Answer all questions to see your results.'
                        }
                    </StartDescription>
                    <StartButton
                        onClick={handleStartQuiz}
                        disabled={isStarting}
                    >
                        {isStarting ? 'Starting...' : (hasCompleted ? 'Retake Quiz' : 'Start Quiz')}
                    </StartButton>
                </QuizStartSection>

                <InstructionsSection>
                    <InstructionsTitle>Instructions</InstructionsTitle>
                    <InstructionsList>
                        <li>Read each question carefully before selecting your answer</li>
                        <li>You can only select one answer per question</li>
                        <li>Use the navigation buttons to move between questions</li>
                        {quiz.time_limit && (
                            <li>Complete the quiz within the time limit of {formatTime(quiz.time_limit)}</li>
                        )}
                        <li>Review your answers before submitting the quiz</li>
                        <li>You'll see your results and explanations after submission</li>
                    </InstructionsList>
                </InstructionsSection>

                <BottomSpacer />
            </ContentWrapper>
            <Footer />

            {/* Loading overlay when starting quiz */}
            {isStarting && <QuizLoadingOverlay message="Starting quiz..." />}
        </QuizDetailContainer>
    );
}

export default QuizDetail;