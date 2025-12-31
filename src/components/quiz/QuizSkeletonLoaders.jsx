/**
 * Quiz-specific skeleton loaders
 * Provides loading states that match the actual quiz component layouts
 */

import React from 'react';
import { styled } from '@mui/material/styles';
import {
    designTokens,
    animations,
    SkeletonBase,
    Card,
    ContentWrapper
} from './QuizDesignSystem';

// Base skeleton with shimmer animation
const Skeleton = styled(SkeletonBase, {
    shouldForwardProp: (prop) => !['borderRadius'].includes(prop),
})(({ width = '100%', height = '16px', borderRadius = designTokens.borderRadius.sm }) => ({
    width,
    height,
    borderRadius,
    marginBottom: designTokens.spacing.sm,
}));

// Quiz list skeleton loader
export const QuizListSkeleton = ({ count = 6 }) => (
    <ContentWrapper>
        {/* Title skeleton */}
        <Skeleton
            width="200px"
            height="48px"
            borderRadius={designTokens.borderRadius.md}
            style={{ marginBottom: designTokens.spacing.lg }}
        />

        {/* Subtitle skeleton */}
        <Skeleton
            width="400px"
            height="18px"
            style={{ marginBottom: designTokens.spacing.xl }}
        />

        {/* Filter buttons skeleton */}
        <div style={{
            display: 'flex',
            gap: designTokens.spacing.md,
            marginBottom: designTokens.spacing.xl,
            flexWrap: 'wrap'
        }}>
            {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                    key={index}
                    width="80px"
                    height="36px"
                    borderRadius={designTokens.borderRadius.sm}
                />
            ))}
        </div>

        {/* Quiz cards grid skeleton */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: designTokens.spacing.lg,
        }}>
            {Array.from({ length: count }).map((_, index) => (
                <QuizCardSkeleton key={index} featured={index === 0} />
            ))}
        </div>
    </ContentWrapper>
);

// Individual quiz card skeleton
export const QuizCardSkeleton = ({ featured = false }) => (
    <Card
        style={{
            minHeight: featured ? '260px' : '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: `${animations.fadeIn} 0.4s ease-out`,
        }}
    >
        {/* Badge skeleton */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: designTokens.spacing.sm }}>
            <Skeleton
                width="80px"
                height="24px"
                borderRadius={designTokens.borderRadius.md}
            />
        </div>

        {/* Title skeleton */}
        <Skeleton
            width="80%"
            height="24px"
            style={{ marginBottom: designTokens.spacing.md }}
        />

        {/* Description skeleton */}
        <div style={{ marginBottom: 'auto' }}>
            <Skeleton width="100%" height="16px" />
            <Skeleton width="60%" height="16px" />
        </div>

        {/* Footer stats skeleton */}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: designTokens.spacing.md
        }}>
            <Skeleton width="80px" height="16px" />
            <Skeleton width="60px" height="16px" />
            <Skeleton width="70px" height="16px" />
        </div>
    </Card>
);

// Quiz detail page skeleton
export const QuizDetailSkeleton = () => (
    <ContentWrapper>
        {/* Back button skeleton */}
        <Skeleton
            width="120px"
            height="36px"
            borderRadius={designTokens.borderRadius.sm}
            style={{ marginBottom: designTokens.spacing.lg }}
        />

        {/* Title skeleton */}
        <Skeleton
            width="70%"
            height="48px"
            style={{ marginBottom: designTokens.spacing.md }}
        />

        {/* Description skeleton */}
        <div style={{ marginBottom: designTokens.spacing.lg }}>
            <Skeleton width="100%" height="16px" />
            <Skeleton width="80%" height="16px" />
            <Skeleton width="60%" height="16px" />
        </div>

        {/* Meta info skeleton */}
        <div style={{
            display: 'flex',
            gap: designTokens.spacing.lg,
            marginBottom: designTokens.spacing.xl,
            flexWrap: 'wrap'
        }}>
            <Skeleton width="100px" height="20px" />
            <Skeleton width="80px" height="20px" />
            <Skeleton width="90px" height="20px" />
        </div>

        {/* Start section skeleton */}
        <Card style={{ textAlign: 'center', marginBottom: designTokens.spacing.xl }}>
            <Skeleton
                width="200px"
                height="28px"
                style={{ margin: `0 auto ${designTokens.spacing.md}` }}
            />
            <div style={{ marginBottom: designTokens.spacing.lg }}>
                <Skeleton width="100%" height="16px" />
                <Skeleton width="80%" height="16px" />
            </div>
            <Skeleton
                width="150px"
                height="48px"
                borderRadius={designTokens.borderRadius.md}
                style={{ margin: '0 auto' }}
            />
        </Card>

        {/* Instructions skeleton */}
        <Card>
            <Skeleton
                width="150px"
                height="20px"
                style={{ marginBottom: designTokens.spacing.md }}
            />
            <div>
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        width="100%"
                        height="16px"
                        style={{ marginBottom: designTokens.spacing.sm }}
                    />
                ))}
            </div>
        </Card>
    </ContentWrapper>
);

// Quiz question skeleton
export const QuizQuestionSkeleton = () => (
    <Card>
        {/* Progress bar skeleton */}
        <div style={{ marginBottom: designTokens.spacing.lg }}>
            <Skeleton
                width="100%"
                height="8px"
                borderRadius={designTokens.borderRadius.sm}
                style={{ marginBottom: designTokens.spacing.sm }}
            />
            <Skeleton
                width="150px"
                height="14px"
                style={{ margin: '0 auto' }}
            />
        </div>

        {/* Question number skeleton */}
        <Skeleton
            width="120px"
            height="16px"
            style={{ marginBottom: designTokens.spacing.md }}
        />

        {/* Question text skeleton */}
        <div style={{ marginBottom: designTokens.spacing.xl }}>
            <Skeleton width="100%" height="24px" />
            <Skeleton width="80%" height="24px" />
        </div>

        {/* Options skeleton */}
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: designTokens.spacing.md,
            marginBottom: designTokens.spacing.xl
        }}>
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: designTokens.spacing.sm,
                    padding: designTokens.spacing.md,
                    border: `2px solid ${designTokens.colors.border}`,
                    borderRadius: designTokens.borderRadius.md,
                }}>
                    <Skeleton
                        width="32px"
                        height="32px"
                        borderRadius={designTokens.borderRadius.full}
                    />
                    <Skeleton width="100%" height="16px" />
                </div>
            ))}
        </div>

        {/* Navigation skeleton */}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: designTokens.spacing.md
        }}>
            <Skeleton
                width="100px"
                height="40px"
                borderRadius={designTokens.borderRadius.sm}
            />
            <div style={{ display: 'flex', gap: designTokens.spacing.md }}>
                <Skeleton width="60px" height="16px" />
                <Skeleton width="50px" height="16px" />
            </div>
            <Skeleton
                width="100px"
                height="40px"
                borderRadius={designTokens.borderRadius.sm}
            />
        </div>
    </Card>
);

// Quiz results skeleton
export const QuizResultsSkeleton = () => (
    <Card>
        {/* Title skeleton */}
        <Skeleton
            width="200px"
            height="32px"
            style={{ margin: `0 auto ${designTokens.spacing.lg}` }}
        />

        {/* Circular progress skeleton */}
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: designTokens.spacing.lg
        }}>
            <Skeleton
                width="120px"
                height="120px"
                borderRadius={designTokens.borderRadius.full}
            />
        </div>

        {/* Score display skeleton */}
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: designTokens.spacing.xl,
            marginBottom: designTokens.spacing.lg,
            flexWrap: 'wrap'
        }}>
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                    <Skeleton
                        width="60px"
                        height="48px"
                        style={{ margin: `0 auto ${designTokens.spacing.sm}` }}
                    />
                    <Skeleton width="80px" height="14px" />
                </div>
            ))}
        </div>

        {/* Progress bar skeleton */}
        <div style={{
            maxWidth: '400px',
            margin: `0 auto ${designTokens.spacing.lg}`
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: designTokens.spacing.sm
            }}>
                <Skeleton width="60px" height="14px" />
                <Skeleton width="80px" height="14px" />
            </div>
            <Skeleton
                width="100%"
                height="12px"
                borderRadius={designTokens.borderRadius.sm}
            />
        </div>

        {/* Performance indicator skeleton */}
        <Skeleton
            width="150px"
            height="40px"
            borderRadius={designTokens.borderRadius.md}
            style={{ margin: `0 auto ${designTokens.spacing.lg}` }}
        />

        {/* Action buttons skeleton */}
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: designTokens.spacing.md,
            flexWrap: 'wrap'
        }}>
            <Skeleton
                width="120px"
                height="40px"
                borderRadius={designTokens.borderRadius.sm}
            />
            <Skeleton
                width="100px"
                height="40px"
                borderRadius={designTokens.borderRadius.sm}
            />
        </div>
    </Card>
);

// Quiz history skeleton
export const QuizHistorySkeleton = ({ count = 5 }) => (
    <ContentWrapper>
        {/* Title skeleton */}
        <Skeleton
            width="200px"
            height="32px"
            style={{ marginBottom: designTokens.spacing.lg }}
        />

        {/* Stats cards skeleton */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: designTokens.spacing.md,
            marginBottom: designTokens.spacing.xl,
        }}>
            {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} style={{ textAlign: 'center' }}>
                    <Skeleton
                        width="60px"
                        height="36px"
                        style={{ margin: `0 auto ${designTokens.spacing.sm}` }}
                    />
                    <Skeleton width="100px" height="14px" style={{ margin: '0 auto' }} />
                </Card>
            ))}
        </div>

        {/* History list skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.md }}>
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: designTokens.spacing.sm
                    }}>
                        <Skeleton width="200px" height="20px" />
                        <Skeleton width="80px" height="16px" />
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: designTokens.spacing.lg,
                        marginBottom: designTokens.spacing.sm
                    }}>
                        <Skeleton width="60px" height="14px" />
                        <Skeleton width="80px" height="14px" />
                        <Skeleton width="70px" height="14px" />
                    </div>
                    <Skeleton width="120px" height="14px" />
                </Card>
            ))}
        </div>
    </ContentWrapper>
);

// Loading overlay for quiz transitions
export const QuizLoadingOverlay = ({ message = 'Loading...' }) => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(30, 45, 39, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: `${animations.fadeIn} 0.3s ease-out`,
    }}>
        <div style={{
            width: '60px',
            height: '60px',
            border: `4px solid ${designTokens.colors.border}`,
            borderTop: `4px solid ${designTokens.colors.primary}`,
            borderRadius: '50%',
            animation: `${animations.spin} 1s linear infinite`,
            marginBottom: designTokens.spacing.lg,
        }} />
        <div style={{
            color: designTokens.colors.text,
            fontFamily: designTokens.typography.fontFamily,
            fontSize: designTokens.typography.sizes.lg,
            fontWeight: designTokens.typography.fontWeights.medium,
            textAlign: 'center',
        }}>
            {message}
        </div>
    </div>
);

export default {
    QuizListSkeleton,
    QuizCardSkeleton,
    QuizDetailSkeleton,
    QuizQuestionSkeleton,
    QuizResultsSkeleton,
    QuizHistorySkeleton,
    QuizLoadingOverlay,
};