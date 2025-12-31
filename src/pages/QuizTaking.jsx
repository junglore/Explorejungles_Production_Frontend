import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizTimer from '../components/quiz/QuizTimer';
import { useAuth } from '../contexts/AuthContext';
import { useRewards } from '../contexts/RewardsContext';
import { RewardNotification } from '../components/rewards';
import quizService from '../services/quizService';
import notificationService from '../services/notificationService';

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
const QuizTakingContainer = styled('div')({
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

// Quiz header
const QuizHeader = styled('div')({
    marginBottom: '32px',
    textAlign: 'center',
    '@media (max-width: 768px)': {
        marginBottom: '24px',
    },
});

const QuizTitle = styled('h1')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '32px',
    marginBottom: '8px',
    '@media (max-width: 768px)': {
        fontSize: '24px',
    },
    '@media (max-width: 480px)': {
        fontSize: '20px',
    },
});

const QuizSubtitle = styled('p')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    margin: 0,
    '@media (max-width: 768px)': {
        fontSize: '14px',
    },
});

// Exit confirmation modal
const ModalOverlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
});

const ModalContent = styled('div')({
    backgroundColor: '#1E2D27',
    border: '1px solid rgba(255, 232, 161, 0.3)',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    '@media (max-width: 768px)': {
        padding: '24px',
    },
});

const ModalTitle = styled('h3')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '16px',
    '@media (max-width: 768px)': {
        fontSize: '18px',
    },
});

const ModalText = styled('p')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    lineHeight: 1.5,
    marginBottom: '24px',
});

const ModalButtons = styled('div')({
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    '@media (max-width: 480px)': {
        flexDirection: 'column',
    },
});

const ModalButton = styled('button')(({ variant = 'secondary' }) => ({
    backgroundColor: variant === 'primary' ? '#FFE8A1' : 'transparent',
    color: variant === 'primary' ? '#1E2D27' : '#FFE8A1',
    border: variant === 'primary' ? 'none' : '1px solid rgba(255, 232, 161, 0.3)',
    borderRadius: '8px',
    padding: '12px 24px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: variant === 'primary' ? '#FFE8A1' : 'rgba(255, 232, 161, 0.1)',
        transform: 'translateY(-1px)',
    },
}));

const BottomSpacer = styled('div')({
    minHeight: '80px',
    '@media (max-width: 768px)': { minHeight: '60px' },
    '@media (max-width: 480px)': { minHeight: '40px' },
});

function QuizTaking() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { refreshBalance, showNotification, clearLeaderboardCache } = useRewards();

    // State management
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [startTime, setStartTime] = useState(null);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [timerPaused, setTimerPaused] = useState(false);

    // Fetch quiz data
    const fetchQuiz = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!quizId) {
                throw new Error('Quiz ID is required');
            }



            const quizData = await quizService.getQuiz(quizId);
            setQuiz(quizData);
            setStartTime(Date.now());
            setQuestionStartTime(Date.now());

            // Initialize timer if quiz has time limit
            if (quizData.time_limit) {
                setTimeRemaining(quizData.time_limit * 60); // Convert minutes to seconds
            }

        } catch (err) {
            console.error('Error fetching quiz:', err);
            setError(err.message || 'Failed to load quiz');
        } finally {
            setLoading(false);
        }
    };

    // Initialize component
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

    // Handle browser navigation (back button, refresh, etc.)
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (quiz && Object.keys(answers).length > 0) {
                e.preventDefault();
                e.returnValue = 'You have unsaved progress. Are you sure you want to leave?';
                return e.returnValue;
            }
        };

        const handlePopState = (e) => {
            if (quiz && Object.keys(answers).length > 0) {
                e.preventDefault();
                setShowExitModal(true);
                // Push the current state back to prevent navigation
                window.history.pushState(null, '', window.location.pathname);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        // Push initial state to handle back button
        window.history.pushState(null, '', window.location.pathname);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [quiz, answers]);

    // Handle answer selection
    const handleAnswerSelect = useCallback((optionIndex) => {
        const currentTime = Date.now();
        const timeTaken = questionStartTime ? Math.floor((currentTime - questionStartTime) / 1000) : 0;

        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: {
                question_index: currentQuestionIndex,
                selected_answer: optionIndex,
                time_taken: timeTaken
            }
        }));
    }, [currentQuestionIndex, questionStartTime]);

    // Handle next question
    const handleNext = useCallback(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setQuestionStartTime(Date.now());
        }
    }, [currentQuestionIndex, quiz]);

    // Handle previous question
    const handlePrevious = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setQuestionStartTime(Date.now());
        }
    }, [currentQuestionIndex]);

    // Submit quiz function (shared between manual and auto-submit)
    const submitQuiz = useCallback(async () => {
        if (!quiz || isSubmitting) return;

        // Check if all questions are answered
        const unansweredQuestions = [];
        for (let i = 0; i < quiz.questions.length; i++) {
            if (!(i in answers)) {
                unansweredQuestions.push(i + 1);
            }
        }

        setIsSubmitting(true);
        setTimerPaused(true); // Pause timer during submission

        try {
            const totalTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

            // Convert answers to array format expected by API
            const answersArray = Object.values(answers);

            const submission = {
                answers: answersArray,
                total_time_taken: totalTime
            };

            const result = await quizService.submitQuiz(quizId, submission);

            // Refresh rewards balance and show notification if rewards were earned
            if (isAuthenticated && refreshBalance && showNotification) {
                try {
                    await refreshBalance();
                    
                    // Clear leaderboard cache so it refreshes with new data
                    if (clearLeaderboardCache) {
                        clearLeaderboardCache();
                    }
                    
                    // Show reward notification if the quiz was completed successfully
                    if (result && result.score !== undefined) {
                        const accuracy = ((result.score / quiz.questions.length) * 100).toFixed(1);
                        const tier = accuracy >= 90 ? 'Gold' : accuracy >= 70 ? 'Silver' : 'Bronze';
                        
                        showNotification({
                            type: 'quiz_completion',
                            tier: tier,
                            title: 'Quiz Completed!',
                            message: `Great job! You scored ${result.score}/${quiz.questions.length}`,
                            points: result.points_earned || 0,
                            credits: result.credits_earned || 0,
                            bonuses: result.bonuses || [],
                            autoHide: false
                        });
                    }
                } catch (rewardError) {
                    console.error('Error updating rewards:', rewardError);
                    // Don't fail the quiz submission if rewards fail
                }
            }

            // Navigate to results page
            navigate(`/quizzes/${quizId}/results`, {
                state: { result }
            });

        } catch (err) {
            console.error('Error submitting quiz:', err);
            
            // Use notification service for proper toast notifications
            const errorInfo = quizService.handleApiError(err, 'Quiz submission failed');
            notificationService.error(errorInfo.message, {
                title: 'Quiz Submission Failed',
                duration: 8000 // Show error longer
            });
        } finally {
            setIsSubmitting(false);
            setTimerPaused(false);
        }
    }, [quiz, isSubmitting, answers, startTime, quizId, navigate, isAuthenticated, refreshBalance, showNotification]);

    // Handle timer events
    const handleTimeUp = useCallback(async () => {
        if (isSubmitting) return;

        // Auto-submit when time runs out
        alert('Time is up! Your quiz will be submitted automatically.');
        await submitQuiz();
    }, [isSubmitting, submitQuiz]);

    const handleTimeWarning = useCallback((type, remaining) => {
        if (type === 'warning') {
            // Optional: Show a less intrusive warning
            console.log(`Warning: ${remaining} seconds remaining`);
        } else if (type === 'critical') {
            // Optional: Show a more urgent warning
            console.log(`Critical: ${remaining} seconds remaining`);
        }
    }, []);

    // Handle quiz submission (with confirmation for unanswered questions)
    const handleSubmit = async () => {
        if (!quiz || isSubmitting) return;

        // Check if all questions are answered
        const unansweredQuestions = [];
        for (let i = 0; i < quiz.questions.length; i++) {
            if (!(i in answers)) {
                unansweredQuestions.push(i + 1);
            }
        }

        if (unansweredQuestions.length > 0) {
            const confirmSubmit = window.confirm(
                `You have ${unansweredQuestions.length} unanswered question(s). Are you sure you want to submit?`
            );
            if (!confirmSubmit) return;
        }

        await submitQuiz();
    };

    // Handle exit confirmation
    const handleExitConfirm = () => {
        navigate(`/quizzes/${quizId}`);
    };

    const handleExitCancel = () => {
        setShowExitModal(false);
    };

    // Handle retry
    const handleRetry = () => {
        fetchQuiz();
    };

    // Render loading state
    if (loading) {
        return (
            <QuizTakingContainer>
                <Header />
                <ContentWrapper>
                    <LoadingContainer>
                        <SimpleSpinner />
                        <LoadingText>Loading quiz...</LoadingText>
                    </LoadingContainer>
                </ContentWrapper>
                <Footer />
            </QuizTakingContainer>
        );
    }

    // Render error state
    if (error) {
        return (
            <QuizTakingContainer>
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
            </QuizTakingContainer>
        );
    }

    // Render quiz not found
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <QuizTakingContainer>
                <Header />
                <ContentWrapper>
                    <ErrorContainer>
                        <ErrorMessage>Quiz not found or has no questions</ErrorMessage>
                        <RetryButton onClick={() => navigate(`/quizzes/${quizId}`)}>
                            Back to Quiz
                        </RetryButton>
                    </ErrorContainer>
                </ContentWrapper>
                <Footer />
            </QuizTakingContainer>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedAnswer = answers[currentQuestionIndex]?.selected_answer;
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const canGoNext = selectedAnswer !== undefined;
    const canGoPrevious = currentQuestionIndex > 0;

    return (
        <QuizTakingContainer>
            <Header />
            <ContentWrapper>
                <QuizHeader>
                    <QuizTitle>{quiz.title}</QuizTitle>
                    <QuizSubtitle>
                        Answer all questions to complete the quiz
                    </QuizSubtitle>
                </QuizHeader>

                {/* Quiz Timer */}
                {quiz.time_limit && timeRemaining !== null && (
                    <QuizTimer
                        totalTimeLimit={timeRemaining}
                        onTimeUp={handleTimeUp}
                        onWarning={handleTimeWarning}
                        variant="full"
                        showProgress={true}
                        warningThreshold={300} // 5 minutes
                        criticalThreshold={60} // 1 minute
                        autoSubmit={true}
                        paused={timerPaused || showExitModal}
                    />
                )}

                <QuizQuestion
                    question={currentQuestion}
                    questionIndex={currentQuestionIndex}
                    totalQuestions={quiz.questions.length}
                    selectedAnswer={selectedAnswer}
                    onAnswerSelect={handleAnswerSelect}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onSubmit={handleSubmit}
                    isLastQuestion={isLastQuestion}
                    canGoNext={canGoNext}
                    canGoPrevious={canGoPrevious}
                    disabled={isSubmitting}
                />

                <BottomSpacer />
            </ContentWrapper>

            {/* Exit confirmation modal */}
            {showExitModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalTitle>Leave Quiz?</ModalTitle>
                        <ModalText>
                            You have unsaved progress. If you leave now, your answers will be lost.
                        </ModalText>
                        <ModalButtons>
                            <ModalButton variant="secondary" onClick={handleExitCancel}>
                                Stay
                            </ModalButton>
                            <ModalButton variant="primary" onClick={handleExitConfirm}>
                                Leave
                            </ModalButton>
                        </ModalButtons>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Reward Notification */}
            <RewardNotification />

            <Footer />
        </QuizTakingContainer>
    );
}

export default QuizTaking;