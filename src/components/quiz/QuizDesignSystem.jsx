/**
 * Quiz Design System
 * Centralized design tokens and styled components for quiz interfaces
 * Following Junglore's design patterns and accessibility standards
 */

import { styled, keyframes } from '@mui/material/styles';

// Design tokens following Junglore theme
export const designTokens = {
    colors: {
        primary: '#FFE8A1',
        primaryDark: '#E6D18A',
        secondary: '#CDD99D',
        background: '#1E2D27',
        surface: 'rgba(255, 232, 161, 0.05)',
        surfaceHover: 'rgba(255, 232, 161, 0.1)',
        border: 'rgba(255, 232, 161, 0.2)',
        borderActive: 'rgba(255, 232, 161, 0.6)',
        text: '#FFE8A1',
        textSecondary: '#CDD99D',
        textMuted: 'rgba(255, 232, 161, 0.7)',
        success: '#4CAF50',
        successBg: 'rgba(76, 175, 80, 0.1)',
        error: '#F44336',
        errorBg: 'rgba(244, 67, 54, 0.1)',
        warning: '#FF9800',
        warningBg: 'rgba(255, 152, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.2)',
        overlayDark: 'rgba(0, 0, 0, 0.4)',
    },
    typography: {
        fontFamily: '"DM Sans", sans-serif',
        fontWeights: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            black: 900,
        },
        sizes: {
            xs: '12px',
            sm: '14px',
            base: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
            '3xl': '32px',
            '4xl': '48px',
        },
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
    },
    borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '50%',
    },
    shadows: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
        md: '0 4px 16px rgba(0, 0, 0, 0.15)',
        lg: '0 8px 32px rgba(0, 0, 0, 0.2)',
        glow: '0 0 20px rgba(255, 232, 161, 0.3)',
    },
    breakpoints: {
        xs: '480px',
        sm: '768px',
        md: '1024px',
        lg: '1200px',
        xl: '1440px',
    },
};

// Animation keyframes
export const animations = {
    fadeIn: keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `,
    slideIn: keyframes`
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,
    pulse: keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  `,
    spin: keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `,
    bounce: keyframes`
    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
    40%, 43% { transform: translateY(-8px); }
    70% { transform: translateY(-4px); }
    90% { transform: translateY(-2px); }
  `,
    shimmer: keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  `,
};

// Base container for quiz interfaces
export const QuizContainer = styled('div')({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: designTokens.colors.background,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
});

// Content wrapper with responsive padding
export const ContentWrapper = styled('div')({
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: `120px ${designTokens.spacing.lg} 0 ${designTokens.spacing.lg}`,
    animation: `${animations.fadeIn} 0.6s ease-out`,
    [`@media (max-width: ${designTokens.breakpoints.md})`]: {
        padding: `100px ${designTokens.spacing.md} 0 ${designTokens.spacing.md}`,
    },
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        padding: `80px ${designTokens.spacing.md} 0 ${designTokens.spacing.md}`,
    },
    [`@media (max-width: ${designTokens.breakpoints.xs})`]: {
        padding: `70px ${designTokens.spacing.sm} 0 ${designTokens.spacing.sm}`,
    },
});

// Loading spinner with Junglore styling
export const LoadingSpinner = styled('div')({
    width: '40px',
    height: '40px',
    border: `3px solid ${designTokens.colors.border}`,
    borderTop: `3px solid ${designTokens.colors.primary}`,
    borderRadius: '50%',
    animation: `${animations.spin} 1s linear infinite`,
    margin: '0 auto',
});

// Enhanced loading container
export const LoadingContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: designTokens.colors.text,
    textAlign: 'center',
    gap: designTokens.spacing.md,
    animation: `${animations.fadeIn} 0.4s ease-out`,
});

export const LoadingText = styled('div')({
    fontFamily: designTokens.typography.fontFamily,
    fontSize: designTokens.typography.sizes.lg,
    fontWeight: designTokens.typography.fontWeights.medium,
    color: designTokens.colors.textSecondary,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        fontSize: designTokens.typography.sizes.base,
    },
});

// Skeleton loader components
export const SkeletonBase = styled('div')({
    background: `linear-gradient(90deg, ${designTokens.colors.surface} 25%, ${designTokens.colors.surfaceHover} 50%, ${designTokens.colors.surface} 75%)`,
    backgroundSize: '200px 100%',
    animation: `${animations.shimmer} 2s infinite linear`,
    borderRadius: designTokens.borderRadius.sm,
});

export const SkeletonText = styled(SkeletonBase)(({ width = '100%', height = '16px' }) => ({
    width,
    height,
    marginBottom: designTokens.spacing.sm,
}));

export const SkeletonCard = styled(SkeletonBase)({
    width: '100%',
    height: '200px',
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
});

// Error handling components
export const ErrorContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: designTokens.colors.text,
    textAlign: 'center',
    padding: designTokens.spacing.lg,
    animation: `${animations.fadeIn} 0.4s ease-out`,
});

export const ErrorIcon = styled('div')({
    fontSize: '48px',
    marginBottom: designTokens.spacing.md,
    opacity: 0.7,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        fontSize: '36px',
    },
});

export const ErrorMessage = styled('div')({
    fontFamily: designTokens.typography.fontFamily,
    fontSize: designTokens.typography.sizes.lg,
    fontWeight: designTokens.typography.fontWeights.medium,
    marginBottom: designTokens.spacing.md,
    color: designTokens.colors.text,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        fontSize: designTokens.typography.sizes.base,
    },
});

export const ErrorDescription = styled('div')({
    fontFamily: designTokens.typography.fontFamily,
    fontSize: designTokens.typography.sizes.sm,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.lg,
    maxWidth: '400px',
    lineHeight: 1.5,
});

// Button components with consistent styling
export const Button = styled('button')(({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false
}) => {
    const variants = {
        primary: {
            backgroundColor: designTokens.colors.primary,
            color: designTokens.colors.background,
            border: 'none',
            '&:hover': !disabled && {
                backgroundColor: designTokens.colors.primaryDark,
                transform: 'translateY(-2px)',
                boxShadow: designTokens.shadows.glow,
            },
        },
        secondary: {
            backgroundColor: 'transparent',
            color: designTokens.colors.primary,
            border: `2px solid ${designTokens.colors.border}`,
            '&:hover': !disabled && {
                backgroundColor: designTokens.colors.surfaceHover,
                borderColor: designTokens.colors.borderActive,
                transform: 'translateY(-1px)',
            },
        },
        success: {
            backgroundColor: designTokens.colors.success,
            color: 'white',
            border: 'none',
            '&:hover': !disabled && {
                backgroundColor: '#45a049',
                transform: 'translateY(-2px)',
            },
        },
        error: {
            backgroundColor: designTokens.colors.error,
            color: 'white',
            border: 'none',
            '&:hover': !disabled && {
                backgroundColor: '#d32f2f',
                transform: 'translateY(-2px)',
            },
        },
    };

    const sizes = {
        small: {
            padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
            fontSize: designTokens.typography.sizes.sm,
        },
        medium: {
            padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
            fontSize: designTokens.typography.sizes.base,
        },
        large: {
            padding: `${designTokens.spacing.lg} ${designTokens.spacing.xl}`,
            fontSize: designTokens.typography.sizes.lg,
        },
    };

    return {
        ...variants[variant],
        ...sizes[size],
        fontFamily: designTokens.typography.fontFamily,
        fontWeight: designTokens.typography.fontWeights.semibold,
        borderRadius: designTokens.borderRadius.md,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: designTokens.spacing.sm,
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
        transform: disabled ? 'none' : undefined,
        '&:focus': {
            outline: `2px solid ${designTokens.colors.primary}`,
            outlineOffset: '2px',
        },
        '&:focus:not(:focus-visible)': {
            outline: 'none',
        },
        [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
            ...sizes[size === 'large' ? 'medium' : size === 'medium' ? 'small' : 'small'],
        },
    };
});

// Card components
export const Card = styled('div')(({ variant = 'default', interactive = false }) => {
    const variants = {
        default: {
            backgroundColor: designTokens.colors.surface,
            border: `1px solid ${designTokens.colors.border}`,
        },
        elevated: {
            backgroundColor: designTokens.colors.surface,
            border: `1px solid ${designTokens.colors.border}`,
            boxShadow: designTokens.shadows.md,
        },
        success: {
            backgroundColor: designTokens.colors.successBg,
            border: `1px solid ${designTokens.colors.success}`,
        },
        error: {
            backgroundColor: designTokens.colors.errorBg,
            border: `1px solid ${designTokens.colors.error}`,
        },
        warning: {
            backgroundColor: designTokens.colors.warningBg,
            border: `1px solid ${designTokens.colors.warning}`,
        },
    };

    return {
        ...variants[variant],
        borderRadius: designTokens.borderRadius.lg,
        padding: designTokens.spacing.xl,
        animation: `${animations.fadeIn} 0.4s ease-out`,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': interactive && {
            transform: 'translateY(-2px)',
            boxShadow: designTokens.shadows.lg,
        },
        [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
            padding: designTokens.spacing.lg,
        },
        [`@media (max-width: ${designTokens.breakpoints.xs})`]: {
            padding: designTokens.spacing.md,
        },
    };
});

// Typography components
export const Heading = styled('h1')(({ level = 1, color = 'text' }) => {
    const levels = {
        1: { fontSize: designTokens.typography.sizes['4xl'], fontWeight: designTokens.typography.fontWeights.black },
        2: { fontSize: designTokens.typography.sizes['3xl'], fontWeight: designTokens.typography.fontWeights.bold },
        3: { fontSize: designTokens.typography.sizes['2xl'], fontWeight: designTokens.typography.fontWeights.bold },
        4: { fontSize: designTokens.typography.sizes.xl, fontWeight: designTokens.typography.fontWeights.semibold },
        5: { fontSize: designTokens.typography.sizes.lg, fontWeight: designTokens.typography.fontWeights.semibold },
        6: { fontSize: designTokens.typography.sizes.base, fontWeight: designTokens.typography.fontWeights.semibold },
    };

    return {
        ...levels[level],
        fontFamily: designTokens.typography.fontFamily,
        color: designTokens.colors[color] || color,
        lineHeight: 1.2,
        margin: 0,
        marginBottom: designTokens.spacing.md,
        [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
            fontSize: level <= 2 ? designTokens.typography.sizes['2xl'] :
                level <= 4 ? designTokens.typography.sizes.lg :
                    designTokens.typography.sizes.base,
        },
    };
});

export const Text = styled('p')(({ size = 'base', color = 'textSecondary', weight = 'regular' }) => ({
    fontFamily: designTokens.typography.fontFamily,
    fontSize: designTokens.typography.sizes[size],
    fontWeight: designTokens.typography.fontWeights[weight],
    color: designTokens.colors[color] || color,
    lineHeight: 1.6,
    margin: 0,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        fontSize: size === 'lg' ? designTokens.typography.sizes.base :
            size === 'xl' ? designTokens.typography.sizes.lg :
                designTokens.typography.sizes[size],
    },
}));

// Progress components
export const ProgressBar = styled('div')({
    width: '100%',
    height: '8px',
    backgroundColor: designTokens.colors.border,
    borderRadius: designTokens.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: designTokens.spacing.md,
});

export const ProgressFill = styled('div')(({ progress = 0 }) => ({
    width: `${Math.min(Math.max(progress, 0), 100)}%`,
    height: '100%',
    backgroundColor: designTokens.colors.primary,
    borderRadius: designTokens.borderRadius.sm,
    transition: 'width 0.3s ease',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
        animation: progress > 0 ? `${animations.shimmer} 2s infinite` : 'none',
    },
}));

// Accessibility helpers
export const VisuallyHidden = styled('span')({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
});

// Focus trap for modals and overlays
export const FocusTrap = styled('div')({
    '&:focus': {
        outline: 'none',
    },
});

// Responsive utilities
export const responsiveStyles = {
    hideOnMobile: {
        [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
            display: 'none',
        },
    },
    hideOnDesktop: {
        [`@media (min-width: ${designTokens.breakpoints.sm})`]: {
            display: 'none',
        },
    },
    mobileOnly: {
        display: 'none',
        [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
            display: 'block',
        },
    },
    desktopOnly: {
        display: 'block',
        [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
            display: 'none',
        },
    },
};

export default {
    designTokens,
    animations,
    QuizContainer,
    ContentWrapper,
    LoadingSpinner,
    LoadingContainer,
    LoadingText,
    SkeletonBase,
    SkeletonText,
    SkeletonCard,
    ErrorContainer,
    ErrorIcon,
    ErrorMessage,
    ErrorDescription,
    Button,
    Card,
    Heading,
    Text,
    ProgressBar,
    ProgressFill,
    VisuallyHidden,
    FocusTrap,
    responsiveStyles,
};