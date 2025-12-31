import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';

// Timer container
const TimerContainer = styled('div')(({ warning, critical }) => {
    let backgroundColor = 'rgba(255, 232, 161, 0.1)';
    let borderColor = 'rgba(255, 232, 161, 0.3)';
    let color = '#FFE8A1';

    if (critical) {
        backgroundColor = 'rgba(244, 67, 54, 0.2)';
        borderColor = '#F44336';
        color = '#F44336';
    } else if (warning) {
        backgroundColor = 'rgba(255, 152, 0, 0.2)';
        borderColor = '#FF9800';
        color = '#FF9800';
    }

    return {
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '24px',
        transition: 'all 0.3s ease',
        '@media (max-width: 768px)': {
            padding: '12px 16px',
            marginBottom: '20px',
            gap: '8px',
        },
        '@media (max-width: 480px)': {
            padding: '10px 14px',
            marginBottom: '16px',
            gap: '6px',
        },
    };
});

const TimerIcon = styled('span')({
    fontSize: '20px',
    '@media (max-width: 768px)': {
        fontSize: '18px',
    },
    '@media (max-width: 480px)': {
        fontSize: '16px',
    },
});

const TimerText = styled('div')({
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    '@media (max-width: 768px)': {
        fontSize: '14px',
    },
    '@media (max-width: 480px)': {
        fontSize: '13px',
    },
});

const TimerDisplay = styled('div')({
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    letterSpacing: '1px',
    '@media (max-width: 768px)': {
        fontSize: '18px',
    },
    '@media (max-width: 480px)': {
        fontSize: '16px',
    },
});

// Progress bar for visual time representation
const TimerProgress = styled('div')({
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(255, 232, 161, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
    '@media (max-width: 768px)': {
        height: '3px',
        marginTop: '6px',
    },
});

const TimerProgressFill = styled('div')(({ progress, warning, critical }) => {
    let backgroundColor = '#FFE8A1';

    if (critical) {
        backgroundColor = '#F44336';
    } else if (warning) {
        backgroundColor = '#FF9800';
    }

    return {
        width: `${progress}%`,
        height: '100%',
        backgroundColor,
        borderRadius: '2px',
        transition: 'all 0.3s ease',
    };
});

// Compact timer for question view
const CompactTimerContainer = styled('div')(({ warning, critical }) => {
    let color = '#CDD99D';

    if (critical) {
        color = '#F44336';
    } else if (warning) {
        color = '#FF9800';
    }

    return {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color,
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        '@media (max-width: 768px)': {
            fontSize: '12px',
            gap: '4px',
        },
    };
});

// Warning modal for time running out
const WarningModal = styled('div')({
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#1E2D27',
    border: '2px solid #FF9800',
    borderRadius: '12px',
    padding: '16px 20px',
    color: '#FF9800',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    zIndex: 1000,
    animation: 'slideIn 0.3s ease',
    boxShadow: '0 8px 24px rgba(255, 152, 0, 0.3)',
    '@keyframes slideIn': {
        from: {
            transform: 'translateX(100%)',
            opacity: 0,
        },
        to: {
            transform: 'translateX(0)',
            opacity: 1,
        },
    },
    '@media (max-width: 768px)': {
        top: '10px',
        right: '10px',
        left: '10px',
        fontSize: '13px',
        padding: '14px 16px',
    },
});

function QuizTimer({
    totalTimeLimit, // Total quiz time limit in seconds
    questionTimeLimit, // Current question time limit in seconds
    onTimeUp, // Callback when time runs out
    onWarning, // Callback when warning threshold is reached
    variant = 'full', // 'full', 'compact', or 'question'
    showProgress = true,
    warningThreshold = 60, // Show warning when this many seconds remain
    criticalThreshold = 30, // Show critical warning when this many seconds remain
    autoSubmit = true, // Auto-submit when time runs out
    paused = false, // Pause the timer
}) {
    const [timeRemaining, setTimeRemaining] = useState(totalTimeLimit || questionTimeLimit || 0);
    const [showWarning, setShowWarning] = useState(false);
    const [hasWarned, setHasWarned] = useState(false);
    const [hasCriticalWarned, setHasCriticalWarned] = useState(false);

    // Calculate timer states
    const isWarning = timeRemaining <= warningThreshold && timeRemaining > criticalThreshold;
    const isCritical = timeRemaining <= criticalThreshold;
    const progress = totalTimeLimit ? ((totalTimeLimit - timeRemaining) / totalTimeLimit) * 100 : 0;

    // Format time display
    const formatTime = useCallback((seconds) => {
        if (seconds <= 0) return '0:00';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    // Handle time up
    const handleTimeUp = useCallback(() => {
        if (onTimeUp) {
            onTimeUp();
        }
    }, [onTimeUp]);

    // Handle warnings
    useEffect(() => {
        if (isWarning && !hasWarned) {
            setHasWarned(true);
            setShowWarning(true);
            if (onWarning) {
                onWarning('warning', timeRemaining);
            }
            // Hide warning after 3 seconds
            setTimeout(() => setShowWarning(false), 3000);
        }

        if (isCritical && !hasCriticalWarned) {
            setHasCriticalWarned(true);
            if (onWarning) {
                onWarning('critical', timeRemaining);
            }
        }
    }, [isWarning, isCritical, hasWarned, hasCriticalWarned, timeRemaining, onWarning]);

    // Timer countdown effect
    useEffect(() => {
        if (paused || timeRemaining <= 0) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                const newTime = prev - 1;

                if (newTime <= 0) {
                    clearInterval(interval);
                    if (autoSubmit) {
                        handleTimeUp();
                    }
                    return 0;
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [paused, timeRemaining, autoSubmit, handleTimeUp]);

    // Reset timer when time limit changes (for question-specific timers)
    useEffect(() => {
        const newTimeLimit = totalTimeLimit || questionTimeLimit || 0;
        setTimeRemaining(newTimeLimit);
        setHasWarned(false);
        setHasCriticalWarned(false);
        setShowWarning(false);
    }, [totalTimeLimit, questionTimeLimit]);

    // Don't render if no time limit
    if (!totalTimeLimit && !questionTimeLimit) {
        return null;
    }

    // Compact variant for inline display
    if (variant === 'compact') {
        return (
            <CompactTimerContainer warning={isWarning} critical={isCritical}>
                <TimerIcon>⏱️</TimerIcon>
                <span>{formatTime(timeRemaining)}</span>
            </CompactTimerContainer>
        );
    }

    // Question variant for question-specific timing
    if (variant === 'question') {
        return (
            <CompactTimerContainer warning={isWarning} critical={isCritical}>
                <TimerIcon>⏰</TimerIcon>
                <span>Question: {formatTime(timeRemaining)}</span>
            </CompactTimerContainer>
        );
    }

    // Full variant with progress bar
    return (
        <>
            <TimerContainer warning={isWarning} critical={isCritical}>
                <TimerIcon>⏱️</TimerIcon>
                <TimerText>
                    {isCritical ? 'Time Almost Up!' : isWarning ? 'Time Running Low' : 'Time Remaining'}
                </TimerText>
                <TimerDisplay>
                    {formatTime(timeRemaining)}
                </TimerDisplay>
            </TimerContainer>

            {showProgress && totalTimeLimit && (
                <TimerProgress>
                    <TimerProgressFill
                        progress={progress}
                        warning={isWarning}
                        critical={isCritical}
                    />
                </TimerProgress>
            )}

            {/* Warning notification */}
            {showWarning && (
                <WarningModal>
                    ⚠️ Only {formatTime(timeRemaining)} remaining!
                </WarningModal>
            )}
        </>
    );
}

export default QuizTimer;