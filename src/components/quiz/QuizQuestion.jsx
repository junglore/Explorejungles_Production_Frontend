import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
    designTokens,
    animations,
    Card,
    Button,
    Heading,
    Text,
    ProgressBar,
    ProgressFill
} from './QuizDesignSystem';

// Enhanced question container with improved accessibility
const QuestionContainer = styled(Card)({
    marginBottom: designTokens.spacing.lg,
    position: 'relative',
    '&:focus-within': {
        borderColor: designTokens.colors.borderActive,
        boxShadow: `0 0 0 2px ${designTokens.colors.primary}40`,
    },
});

// Enhanced progress indicator with accessibility
const ProgressSection = styled('div')({
    marginBottom: designTokens.spacing.lg,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        marginBottom: designTokens.spacing.md,
    },
});

const ProgressText = styled(Text)({
    textAlign: 'center',
    marginTop: designTokens.spacing.sm,
});

// Enhanced question content with better typography
const QuestionNumber = styled(Text)({
    opacity: 0.8,
    marginBottom: designTokens.spacing.md,
});

const QuestionText = styled(Heading)({
    marginBottom: designTokens.spacing.xl,
    lineHeight: 1.4,
});

// Enhanced answer options with improved accessibility
const OptionsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing.md,
    marginBottom: designTokens.spacing.xl,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        gap: designTokens.spacing.sm,
        marginBottom: designTokens.spacing.lg,
    },
});

const OptionButton = styled('button')(({ selected, isCorrect, isIncorrect, showResults, disabled }) => {
    let backgroundColor = designTokens.colors.overlay;
    let borderColor = designTokens.colors.border;
    let color = designTokens.colors.text;
    let transform = 'none';
    let boxShadow = 'none';

    if (selected && !showResults) {
        backgroundColor = designTokens.colors.surfaceHover;
        borderColor = designTokens.colors.primary;
        boxShadow = `0 0 0 1px ${designTokens.colors.primary}40`;
    }

    if (showResults) {
        if (isCorrect) {
            backgroundColor = designTokens.colors.successBg;
            borderColor = designTokens.colors.success;
            color = designTokens.colors.success;
            boxShadow = `0 0 0 1px ${designTokens.colors.success}40`;
        } else if (isIncorrect) {
            backgroundColor = designTokens.colors.errorBg;
            borderColor = designTokens.colors.error;
            color = designTokens.colors.error;
            boxShadow = `0 0 0 1px ${designTokens.colors.error}40`;
        }
    }

    return {
        backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: designTokens.borderRadius.md,
        padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
        fontFamily: designTokens.typography.fontFamily,
        fontSize: designTokens.typography.sizes.base,
        fontWeight: designTokens.typography.fontWeights.medium,
        color,
        cursor: showResults || disabled ? 'default' : 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: designTokens.spacing.sm,
        width: '100%',
        position: 'relative',
        boxShadow,
        transform,
        animation: `${animations.fadeIn} 0.3s ease-out`,
        '&:hover': (showResults || disabled) ? {} : {
            backgroundColor: designTokens.colors.surfaceHover,
            transform: 'translateY(-1px)',
            boxShadow: designTokens.shadows.md,
        },
        '&:focus': {
            outline: `2px solid ${designTokens.colors.primary}`,
            outlineOffset: '2px',
        },
        '&:focus:not(:focus-visible)': {
            outline: 'none',
        },
        '&:disabled': {
            cursor: 'not-allowed',
            opacity: 0.6,
        },
        '&:active': (showResults || disabled) ? {} : {
            transform: 'translateY(0)',
        },
        [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
            padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
            fontSize: designTokens.typography.sizes.sm,
            gap: designTokens.spacing.xs,
        },
        // High contrast mode support
        '@media (prefers-contrast: high)': {
            borderWidth: '3px',
        },
        // Reduced motion support
        '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            animation: 'none',
            '&:hover': {
                transform: 'none',
            },
        },
    };
});

const OptionLetter = styled('span')(({ isCorrect, isIncorrect, showResults }) => {
    let backgroundColor = designTokens.colors.border;
    let color = designTokens.colors.text;

    if (showResults) {
        if (isCorrect) {
            backgroundColor = designTokens.colors.success;
            color = 'white';
        } else if (isIncorrect) {
            backgroundColor = designTokens.colors.error;
            color = 'white';
        }
    }

    return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: designTokens.borderRadius.full,
        backgroundColor,
        color,
        fontWeight: designTokens.typography.fontWeights.bold,
        fontSize: designTokens.typography.sizes.sm,
        flexShrink: 0,
        transition: 'all 0.2s ease',
        [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
            width: '28px',
            height: '28px',
            fontSize: designTokens.typography.sizes.xs,
        },
        [`@media (max-width: ${designTokens.breakpoints.xs})`]: {
            width: '24px',
            height: '24px',
            fontSize: '11px',
        },
    };
});

const OptionText = styled('span')({
    flex: 1,
    lineHeight: 1.5,
    wordBreak: 'break-word',
});

const OptionIcon = styled('span')({
    fontSize: '20px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        fontSize: '18px',
    },
});

// Enhanced navigation section with better responsive design
const NavigationSection = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: designTokens.spacing.md,
    flexWrap: 'wrap',
    [`@media (max-width: ${designTokens.breakpoints.xs})`]: {
        flexDirection: 'column',
        gap: designTokens.spacing.sm,
    },
});

const QuestionInfo = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.md,
    color: designTokens.colors.textSecondary,
    fontFamily: designTokens.typography.fontFamily,
    fontSize: designTokens.typography.sizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        fontSize: designTokens.typography.sizes.xs,
        gap: designTokens.spacing.sm,
    },
    [`@media (max-width: ${designTokens.breakpoints.xs})`]: {
        order: -1,
        width: '100%',
        justifyContent: 'center',
    },
});

const NavigationButtons = styled('div')({
    display: 'flex',
    gap: designTokens.spacing.sm,
    [`@media (max-width: ${designTokens.breakpoints.xs})`]: {
        width: '100%',
        '& > *': {
            flex: 1,
        },
    },
});

// Enhanced explanation section with better accessibility
const ExplanationSection = styled(Card)({
    marginTop: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.overlayDark,
    animation: `${animations.slideIn} 0.4s ease-out`,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        marginTop: designTokens.spacing.md,
    },
});

const ExplanationTitle = styled(Heading)({
    marginBottom: designTokens.spacing.sm,
});

const ExplanationText = styled(Text)({
    margin: 0,
});

// Option letters for multiple choice
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function QuizQuestion({
    question,
    questionIndex,
    totalQuestions,
    selectedAnswer,
    onAnswerSelect,
    onNext,
    onPrevious,
    onSubmit,
    showResults = false,
    correctAnswer = null,
    explanation = null,
    isLastQuestion = false,
    canGoNext = false,
    canGoPrevious = false,
    timeRemaining = null,
    disabled = false
}) {
    // Calculate progress percentage
    const progress = ((questionIndex + 1) / totalQuestions) * 100;

    // Handle option selection
    const handleOptionSelect = (optionIndex) => {
        if (disabled || showResults) return;
        onAnswerSelect(optionIndex);
    };



    // Handle navigation
    const handleNext = () => {
        if (isLastQuestion) {
            onSubmit();
        } else {
            onNext();
        }
    };

    // Format time remaining
    const formatTime = (seconds) => {
        if (!seconds) return '';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };



    return (
        <QuestionContainer>
            {/* Progress Section */}
            <ProgressSection>
                <ProgressBar>
                    <ProgressFill progress={progress} />
                </ProgressBar>
                <ProgressText size="sm" weight="medium">
                    Question {questionIndex + 1} of {totalQuestions}
                </ProgressText>
            </ProgressSection>

            {/* Question Content */}
            <QuestionNumber size="base" weight="semibold" color="text">
                Question {questionIndex + 1}
            </QuestionNumber>

            <QuestionText level={2} color="text">
                {question.question}
            </QuestionText>

            {/* Answer Options */}
            <OptionsContainer>
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = showResults && index === correctAnswer;
                    const isIncorrect = showResults && isSelected && index !== correctAnswer;

                    return (
                        <OptionButton
                            key={index}
                            selected={isSelected}
                            isCorrect={isCorrect}
                            isIncorrect={isIncorrect}
                            showResults={showResults}
                            onClick={() => handleOptionSelect(index)}
                            disabled={disabled}
                        >
                            <OptionLetter
                                isCorrect={isCorrect}
                                isIncorrect={isIncorrect}
                                showResults={showResults}
                            >
                                {OPTION_LETTERS[index]}
                            </OptionLetter>
                            <OptionText>
                                {option}
                            </OptionText>
                            {showResults && isCorrect && (
                                <OptionIcon>✓</OptionIcon>
                            )}
                            {showResults && isIncorrect && (
                                <OptionIcon>✗</OptionIcon>
                            )}
                        </OptionButton>
                    );
                })}
            </OptionsContainer>

            {/* Explanation */}
            {showResults && explanation && (
                <ExplanationSection>
                    <ExplanationTitle level={3} color="text">
                        Explanation
                    </ExplanationTitle>
                    <ExplanationText size="sm" color="textSecondary">
                        {explanation}
                    </ExplanationText>
                </ExplanationSection>
            )}

            {/* Enhanced Navigation Section */}
            <NavigationSection>
                <NavigationButtons>
                    <Button
                        variant="secondary"
                        size="medium"
                        onClick={onPrevious}
                        disabled={!canGoPrevious || disabled}
                    >
                        <span>←</span>
                        Previous
                    </Button>

                    <Button
                        variant="primary"
                        size="medium"
                        onClick={handleNext}
                        disabled={!canGoNext || disabled}
                    >
                        {isLastQuestion ? 'Submit Quiz' : 'Next'}
                        <span>→</span>
                    </Button>
                </NavigationButtons>

                <QuestionInfo>
                    {question.points && (
                        <span>
                            <span>🏆</span>
                            {question.points} point{question.points !== 1 ? 's' : ''}
                        </span>
                    )}
                    {question.time_limit && (
                        <span>
                            <span>⏱️</span>
                            {question.time_limit}s
                        </span>
                    )}
                    {timeRemaining && (
                        <span>
                            <span>⏰</span>
                            {formatTime(timeRemaining)}
                        </span>
                    )}
                </QuestionInfo>
            </NavigationSection>


        </QuestionContainer>
    );
}

export default QuizQuestion;