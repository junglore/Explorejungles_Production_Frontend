import React from 'react';
import { styled } from '@mui/material/styles';
import { useRewards } from '../../contexts/RewardsContext';
import { CurrencyDisplay } from '../rewards';
import {
    designTokens,
    animations,
    Card,
    Button,
    Heading,
    Text
} from './QuizDesignSystem';

// Enhanced results container with accessibility
const ResultsContainer = styled(Card)({
    marginBottom: designTokens.spacing.xl,
    position: 'relative',
    '&:focus-within': {
        borderColor: designTokens.colors.borderActive,
    },
});

// Enhanced score section with better accessibility
const ScoreSection = styled('div')({
    textAlign: 'center',
    marginBottom: designTokens.spacing.xl,
    animation: `${animations.fadeIn} 0.6s ease-out`,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        marginBottom: designTokens.spacing.lg,
    },
});

const ScoreDisplay = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.lg,
    flexWrap: 'wrap',
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        gap: designTokens.spacing.md,
        marginBottom: designTokens.spacing.md,
    },
    [`@media (max-width: ${designTokens.breakpoints.xs})`]: {
        flexDirection: 'column',
        gap: designTokens.spacing.sm,
    },
});

// Progress bar for visual score representation
const ProgressBarContainer = styled('div')({
    width: '100%',
    maxWidth: '400px',
    margin: '24px auto',
    '@media (max-width: 768px)': {
        maxWidth: '300px',
        margin: '20px auto',
    },
});

const ProgressBarLabel = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
});

const ProgressBarTrack = styled('div')({
    width: '100%',
    height: '12px',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    borderRadius: '6px',
    overflow: 'hidden',
    position: 'relative',
});

const ProgressBarFill = styled('div')(({ percentage, level }) => {
    let backgroundColor = '#4CAF50'; // excellent

    if (level === 'good') {
        backgroundColor = '#FFC107';
    } else if (level === 'fair') {
        backgroundColor = '#FF9800';
    } else if (level === 'poor') {
        backgroundColor = '#F44336';
    }

    return {
        width: `${percentage}%`,
        height: '100%',
        backgroundColor,
        borderRadius: '6px',
        transition: 'width 1s ease-out',
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite',
        },
        '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
        },
    };
});

// Enhanced circular progress with accessibility
const CircularProgressContainer = styled('div')({
    position: 'relative',
    width: '120px',
    height: '120px',
    margin: `0 auto ${designTokens.spacing.lg}`,
    animation: `${animations.fadeIn} 0.8s ease-out`,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        width: '100px',
        height: '100px',
        marginBottom: designTokens.spacing.md,
    },
});

const CircularProgressSvg = styled('svg')({
    width: '100%',
    height: '100%',
    transform: 'rotate(-90deg)',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
});

const CircularProgressTrack = styled('circle')({
    fill: 'none',
    stroke: designTokens.colors.border,
    strokeWidth: '8',
});

const CircularProgressFill = styled('circle')(({ percentage, level }) => {
    let stroke = designTokens.colors.success; // excellent

    if (level === 'good') {
        stroke = designTokens.colors.warning;
    } else if (level === 'fair') {
        stroke = '#FF9800';
    } else if (level === 'poor') {
        stroke = designTokens.colors.error;
    }

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return {
        fill: 'none',
        stroke,
        strokeWidth: '8',
        strokeLinecap: 'round',
        strokeDasharray,
        strokeDashoffset,
        transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
        },
    };
});

const CircularProgressText = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: designTokens.colors.text,
    fontFamily: designTokens.typography.fontFamily,
    fontWeight: designTokens.typography.fontWeights.black,
    fontSize: designTokens.typography.sizes['2xl'],
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        fontSize: designTokens.typography.sizes.xl,
    },
});

const ScoreItem = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
});

const ScoreValue = styled('div')(({ type }) => {
    let color = '#FFE8A1';
    let fontSize = '48px';

    if (type === 'percentage') {
        fontSize = '36px';
    } else if (type === 'time') {
        fontSize = '24px';
        color = '#CDD99D';
    }

    return {
        color,
        fontFamily: 'DM Sans, sans-serif',
        fontSize,
        fontWeight: 900,
        lineHeight: 1,
        '@media (max-width: 768px)': {
            fontSize: type === 'score' ? '36px' : type === 'percentage' ? '28px' : '20px',
        },
        '@media (max-width: 480px)': {
            fontSize: type === 'score' ? '32px' : type === 'percentage' ? '24px' : '18px',
        },
    };
});

const ScoreLabel = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    '@media (max-width: 768px)': {
        fontSize: '12px',
    },
});

// Performance indicator
const PerformanceIndicator = styled('div')(({ level }) => {
    let backgroundColor = 'rgba(76, 175, 80, 0.2)';
    let borderColor = '#4CAF50';
    let color = '#4CAF50';
    let text = 'Excellent!';

    if (level === 'good') {
        backgroundColor = 'rgba(255, 193, 7, 0.2)';
        borderColor = '#FFC107';
        color = '#FFC107';
        text = 'Good Job!';
    } else if (level === 'fair') {
        backgroundColor = 'rgba(255, 152, 0, 0.2)';
        borderColor = '#FF9800';
        color = '#FF9800';
        text = 'Not Bad!';
    } else if (level === 'poor') {
        backgroundColor = 'rgba(244, 67, 54, 0.2)';
        borderColor = '#F44336';
        color = '#F44336';
        text = 'Keep Trying!';
    }

    return {
        backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '12px 24px',
        color,
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '16px',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '24px',
        '@media (max-width: 768px)': {
            fontSize: '14px',
            padding: '10px 20px',
            marginBottom: '20px',
        },
        '&::before': {
            content: `"${text}"`,
        },
    };
});

// Question breakdown section
const BreakdownSection = styled('div')({
    marginBottom: '32px',
    '@media (max-width: 768px)': {
        marginBottom: '24px',
    },
});

// Enhanced Rewards Section
const RewardsSection = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
    border: '2px solid rgba(255, 232, 161, 0.2)',
    '@media (max-width: 768px)': {
        padding: '20px',
        marginBottom: '24px',
    },
});

const RewardsTitle = styled('h3')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    '&::before': {
        content: '"🏆"',
        fontSize: '24px',
    },
    '@media (max-width: 768px)': {
        fontSize: '18px',
        marginBottom: '16px',
    },
});

const RewardsEarned = styled('div')({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '24px',
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '20px',
    },
});

const RewardItem = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    borderRadius: '12px',
    minWidth: '120px',
    border: '1px solid rgba(255, 232, 161, 0.3)',
    '@media (max-width: 768px)': {
        minWidth: '100px',
        padding: '12px',
    },
});

const RewardIcon = styled('div')({
    fontSize: '32px',
    marginBottom: '8px',
    '@media (max-width: 768px)': {
        fontSize: '28px',
        marginBottom: '6px',
    },
});

const RewardAmount = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '4px',
    '@media (max-width: 768px)': {
        fontSize: '20px',
    },
});

const RewardLabel = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    '@media (max-width: 768px)': {
        fontSize: '12px',
    },
});

const DailyProgressSection = styled('div')({
    marginBottom: '24px',
    '@media (max-width: 768px)': {
        marginBottom: '20px',
    },
});

const ProgressLabel = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

const ProgressBar = styled('div')({
    width: '100%',
    height: '8px',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
});

const ProgressFill = styled('div')(({ percentage }) => ({
    height: '100%',
    backgroundColor: '#FFE8A1',
    borderRadius: '4px',
    width: `${Math.min(percentage, 100)}%`,
    transition: 'width 0.8s ease-out',
    boxShadow: percentage >= 100 ? '0 0 8px rgba(255, 232, 161, 0.6)' : 'none',
}));

const LeaderboardPreview = styled('div')({
    marginTop: '20px',
    padding: '16px',
    backgroundColor: 'rgba(255, 232, 161, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 232, 161, 0.2)',
});

const LeaderboardTitle = styled('h4')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&::before': {
        content: '"🏅"',
        fontSize: '18px',
    },
});

const RankingInfo = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
});

const RankLabel = styled('span')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
});

const RankValue = styled('span')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
});

const PersonalBestBadge = styled('div')({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    color: '#4CAF50',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'DM Sans, sans-serif',
    marginTop: '8px',
    '&::before': {
        content: '"⭐"',
        fontSize: '14px',
    },
});

const BreakdownTitle = styled('h3')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '20px',
    '@media (max-width: 768px)': {
        fontSize: '18px',
        marginBottom: '16px',
    },
});

const QuestionItem = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
        padding: '16px',
        marginBottom: '12px',
    },
});

const QuestionHeader = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    '@media (max-width: 480px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
    },
});

const QuestionNumber = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    opacity: 0.8,
});

const QuestionStatus = styled('div')(({ correct }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: correct ? '#4CAF50' : '#F44336',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
    border: `1px solid ${correct ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
}));

const QuestionText = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px',
    lineHeight: 1.4,
    '@media (max-width: 768px)': {
        fontSize: '14px',
        marginBottom: '12px',
    },
});

const AnswerSection = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
});

const AnswerItem = styled('div')(({ type }) => {
    let color = '#CDD99D';
    let fontWeight = 500;
    let backgroundColor = 'transparent';
    let borderColor = 'transparent';
    let icon = '';

    if (type === 'correct') {
        color = '#4CAF50';
        fontWeight = 600;
        backgroundColor = 'rgba(76, 175, 80, 0.1)';
        borderColor = 'rgba(76, 175, 80, 0.3)';
        icon = '✓';
    } else if (type === 'incorrect') {
        color = '#F44336';
        fontWeight = 600;
        backgroundColor = 'rgba(244, 67, 54, 0.1)';
        borderColor = 'rgba(244, 67, 54, 0.3)';
        icon = '✗';
    }

    return {
        color,
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '14px',
        fontWeight,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor,
        border: `1px solid ${borderColor}`,
        marginBottom: '8px',
        '&::before': {
            content: `"${icon}"`,
            fontWeight: 'bold',
            fontSize: '16px',
            minWidth: '20px',
            textAlign: 'center',
        },
        '@media (max-width: 768px)': {
            fontSize: '13px',
            padding: '10px',
            gap: '10px',
        },
    };
});

const ExplanationText = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    lineHeight: 1.6,
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'rgba(255, 232, 161, 0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 232, 161, 0.15)',
    position: 'relative',
    '&::before': {
        content: '"💡"',
        position: 'absolute',
        top: '12px',
        left: '16px',
        fontSize: '16px',
    },
    '& > strong': {
        color: '#FFE8A1',
        marginLeft: '24px',
    },
    '@media (max-width: 768px)': {
        fontSize: '13px',
        padding: '12px',
        marginTop: '12px',
        '&::before': {
            top: '10px',
            left: '12px',
        },
        '& > strong': {
            marginLeft: '20px',
        },
    },
});

// Statistics summary for breakdown section
const BreakdownStats = styled('div')({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    marginBottom: '24px',
    '@media (max-width: 768px)': {
        padding: '16px',
        marginBottom: '20px',
    },
    '@media (max-width: 480px)': {
        flexDirection: 'column',
        gap: '12px',
    },
});

const StatItem = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
});

const StatValue = styled('div')(({ type }) => {
    let color = '#FFE8A1';
    if (type === 'correct') color = '#4CAF50';
    if (type === 'incorrect') color = '#F44336';

    return {
        color,
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '24px',
        fontWeight: 900,
        '@media (max-width: 768px)': {
            fontSize: '20px',
        },
    };
});

const StatLabel = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
});

// Action buttons
const ActionSection = styled('div')({
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '@media (max-width: 480px)': {
        flexDirection: 'column',
        gap: '12px',
    },
});

const ActionButton = styled('button')(({ variant = 'secondary' }) => ({
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
    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        transform: 'none',
    },
    '@media (max-width: 768px)': {
        padding: '10px 20px',
        fontSize: '13px',
    },
}));

// Option letters for multiple choice
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function QuizResults({
    result,
    quiz,
    onRetakeQuiz,
    onBackToQuizzes,
    onShareResults,
    showDetailedBreakdown = true,
}) {
    const { stats, balance, getUserPosition } = useRewards();
    
    if (!result || !quiz) {
        return null;
    }

    // Calculate performance level
    const getPerformanceLevel = (percentage) => {
        if (percentage >= 90) return 'excellent';
        if (percentage >= 75) return 'good';
        if (percentage >= 60) return 'fair';
        return 'poor';
    };

    // Format time
    const formatTime = (seconds) => {
        if (!seconds) return 'N/A';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes === 0) return `${remainingSeconds}s`;
        return `${minutes}m ${remainingSeconds}s`;
    };

    // Calculate daily progress (mock data for now, will be real data later)
    const getDailyProgress = () => {
        const creditsEarned = result.credits_earned || 0;
        const dailyGoal = 60; // Updated to reflect new conservative daily cap
        const progressPercentage = Math.min((creditsEarned / dailyGoal) * 100, 100);
        
        return {
            earned: creditsEarned,
            goal: dailyGoal,
            percentage: progressPercentage,
            remaining: Math.max(dailyGoal - creditsEarned, 0)
        };
    };

    // Check if this is a personal best (updated thresholds for new system)
    const isPersonalBest = result.percentage >= 90 || (result.credits_earned || 0) > 15;

    const performanceLevel = getPerformanceLevel(result.percentage);
    const dailyProgress = getDailyProgress();

    return (
        <ResultsContainer>
            {/* Score Section */}
            <ScoreSection>
                <Heading level={1} color="text">
                    Quiz Complete!
                </Heading>

                {/* Circular Progress Visualization */}
                <CircularProgressContainer>
                    <CircularProgressSvg>
                        <CircularProgressTrack
                            cx="60"
                            cy="60"
                            r="50"
                        />
                        <CircularProgressFill
                            cx="60"
                            cy="60"
                            r="50"
                            percentage={result.percentage}
                            level={performanceLevel}
                        />
                    </CircularProgressSvg>
                    <CircularProgressText>
                        {result.percentage}%
                    </CircularProgressText>
                </CircularProgressContainer>

                <ScoreDisplay>
                    <ScoreItem>
                        <ScoreValue type="score">
                            {result.score}/{result.max_score}
                        </ScoreValue>
                        <ScoreLabel>Score</ScoreLabel>
                    </ScoreItem>

                    <ScoreItem>
                        <ScoreValue type="percentage">
                            {result.percentage}%
                        </ScoreValue>
                        <ScoreLabel>Accuracy</ScoreLabel>
                    </ScoreItem>

                    {result.time_taken && (
                        <ScoreItem>
                            <ScoreValue type="time">
                                {formatTime(result.time_taken)}
                            </ScoreValue>
                            <ScoreLabel>Time Taken</ScoreLabel>
                        </ScoreItem>
                    )}
                </ScoreDisplay>

                {/* Progress Bar Visualization */}
                <ProgressBarContainer>
                    <ProgressBarLabel>
                        <span>Progress</span>
                        <span>{result.score} / {result.max_score} correct</span>
                    </ProgressBarLabel>
                    <ProgressBarTrack>
                        <ProgressBarFill
                            percentage={result.percentage}
                            level={performanceLevel}
                        />
                    </ProgressBarTrack>
                </ProgressBarContainer>

                <PerformanceIndicator level={performanceLevel} />
            </ScoreSection>

            {/* Enhanced Rewards Section */}
            <RewardsSection>
                <RewardsTitle>Rewards Earned</RewardsTitle>
                
                <RewardsEarned>
                    <RewardItem>
                        <RewardIcon>⭐</RewardIcon>
                        <RewardAmount>{result.points_earned || 0}</RewardAmount>
                        <RewardLabel>Points</RewardLabel>
                        {/* Show breakdown if multipliers were applied */}
                        {result.bonus_info?.bonuses && result.bonus_info.bonuses.length > 0 && (
                            <div style={{ 
                                fontSize: '11px', 
                                color: '#A8B2A8', 
                                marginTop: '4px',
                                lineHeight: '1.2'
                            }}>
                                Base: {result.bonus_info.base_points || 20} × {(result.bonus_info.multiplier || 1).toFixed(1)}x
                                <br />
                                <span style={{ fontSize: '10px', opacity: 0.8 }}>
                                    {result.bonus_info.bonuses.slice(0, 2).join(', ')}
                                </span>
                            </div>
                        )}
                    </RewardItem>
                    
                    <RewardItem>
                        <RewardIcon>🪙</RewardIcon>
                        <RewardAmount>{result.credits_earned || 0}</RewardAmount>
                        <RewardLabel>Credits</RewardLabel>
                        {/* Show breakdown if credit multipliers were applied */}
                        {result.bonus_info?.credits_multiplier && result.bonus_info.credits_multiplier > 1 && (
                            <div style={{ 
                                fontSize: '11px', 
                                color: '#A8B2A8', 
                                marginTop: '4px' 
                            }}>
                                Base: {result.bonus_info.base_credits || 10} × {result.bonus_info.credits_multiplier.toFixed(1)}x
                            </div>
                        )}
                    </RewardItem>
                    
                    {result.reward_tier && (
                        <RewardItem>
                            <RewardIcon>🏅</RewardIcon>
                            <RewardAmount>{result.reward_tier}</RewardAmount>
                            <RewardLabel>Tier</RewardLabel>
                        </RewardItem>
                    )}
                </RewardsEarned>

                {/* Daily Progress */}
                <DailyProgressSection>
                    <ProgressLabel>
                        <span>Daily Credits Progress</span>
                        <span>{dailyProgress.earned} / {dailyProgress.goal}</span>
                    </ProgressLabel>
                    <ProgressBar>
                        <ProgressFill percentage={dailyProgress.percentage} />
                    </ProgressBar>
                    {dailyProgress.percentage >= 100 && (
                        <div style={{ 
                            color: '#4CAF50', 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            textAlign: 'center', 
                            marginTop: '8px' 
                        }}>
                            🎉 Daily goal achieved!
                        </div>
                    )}
                </DailyProgressSection>
            </RewardsSection>

            {/* Detailed Breakdown */}
            {showDetailedBreakdown && result.answers && (
                <BreakdownSection>
                    <BreakdownTitle>Question Breakdown</BreakdownTitle>

                    {/* Breakdown Statistics */}
                    <BreakdownStats>
                        <StatItem>
                            <StatValue type="correct">
                                {result.answers.filter(a => a.is_correct).length}
                            </StatValue>
                            <StatLabel>Correct</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatValue type="incorrect">
                                {result.answers.filter(a => !a.is_correct).length}
                            </StatValue>
                            <StatLabel>Incorrect</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatValue>
                                {result.answers.length}
                            </StatValue>
                            <StatLabel>Total</StatLabel>
                        </StatItem>
                    </BreakdownStats>

                    {result.answers.map((answer, index) => {
                        const question = quiz.questions[answer.question_index];
                        if (!question) return null;

                        const isCorrect = answer.is_correct;
                        const userAnswer = question.options[answer.selected_answer];
                        const correctAnswer = question.options[answer.correct_answer];

                        return (
                            <QuestionItem key={index}>
                                <QuestionHeader>
                                    <QuestionNumber>
                                        Question {answer.question_index + 1}
                                    </QuestionNumber>
                                    <QuestionStatus correct={isCorrect}>
                                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                        {answer.points_earned !== undefined && (
                                            <span>+{answer.points_earned} pts</span>
                                        )}
                                    </QuestionStatus>
                                </QuestionHeader>

                                <QuestionText>{question.question}</QuestionText>

                                <AnswerSection>
                                    <AnswerItem type={isCorrect ? 'correct' : 'incorrect'}>
                                        <span>Your answer:</span>
                                        <strong>
                                            {OPTION_LETTERS[answer.selected_answer]} - {userAnswer}
                                        </strong>
                                    </AnswerItem>

                                    {!isCorrect && (
                                        <AnswerItem type="correct">
                                            <span>Correct answer:</span>
                                            <strong>
                                                {OPTION_LETTERS[answer.correct_answer]} - {correctAnswer}
                                            </strong>
                                        </AnswerItem>
                                    )}
                                </AnswerSection>

                                {answer.explanation && (
                                    <ExplanationText>
                                        <strong>Explanation:</strong> {answer.explanation}
                                    </ExplanationText>
                                )}
                            </QuestionItem>
                        );
                    })}
                </BreakdownSection>
            )}

            {/* Action Buttons */}
            <ActionSection>
                <ActionButton variant="secondary" onClick={onBackToQuizzes}>
                    Back to Quizzes
                </ActionButton>

                <ActionButton variant="primary" onClick={onRetakeQuiz}>
                    Retake Quiz
                </ActionButton>

                {onShareResults && (
                    <ActionButton variant="secondary" onClick={onShareResults}>
                        Share Results
                    </ActionButton>
                )}
            </ActionSection>
        </ResultsContainer>
    );
}

export default QuizResults;