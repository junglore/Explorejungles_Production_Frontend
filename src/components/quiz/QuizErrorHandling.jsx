/**
 * Quiz Error Handling Components
 * Provides comprehensive error states with user-friendly messages and recovery options
 */

import React from 'react';
import { styled } from '@mui/material/styles';
import {
    designTokens,
    animations,
    ErrorContainer,
    ErrorIcon,
    ErrorMessage,
    ErrorDescription,
    Button,
    Card,
    Heading,
    Text,
    ContentWrapper
} from './QuizDesignSystem';

// Enhanced error container with better visual hierarchy
const EnhancedErrorContainer = styled(ErrorContainer)({
    padding: designTokens.spacing.xl,
    maxWidth: '500px',
    margin: '0 auto',
});

// Error illustration component
const ErrorIllustration = styled('div')(({ type }) => {
    const illustrations = {
        network: '🌐',
        notFound: '🔍',
        permission: '🔒',
        timeout: '⏰',
        server: '🔧',
        validation: '⚠️',
        generic: '❌',
    };

    return {
        fontSize: '64px',
        marginBottom: designTokens.spacing.lg,
        animation: `${animations.bounce} 2s infinite`,
        '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
        },
        [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
            fontSize: '48px',
        },
        '&::before': {
            content: `"${illustrations[type] || illustrations.generic}"`,
        },
    };
});

// Action buttons container
const ErrorActions = styled('div')({
    display: 'flex',
    gap: designTokens.spacing.md,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: designTokens.spacing.lg,
    [`@media (max-width: ${designTokens.breakpoints.xs})`]: {
        flexDirection: 'column',
        '& > *': {
            width: '100%',
        },
    },
});

// Network error component
export const NetworkError = ({ onRetry, onGoBack }) => (
    <EnhancedErrorContainer>
        <ErrorIllustration type="network" />
        <Heading level={2} color="text">
            Connection Problem
        </Heading>
        <Text size="lg" color="textSecondary" style={{ marginBottom: designTokens.spacing.md }}>
            We're having trouble connecting to our servers. Please check your internet connection and try again.
        </Text>
        <Text size="sm" color="textMuted">
            If the problem persists, please try again in a few minutes.
        </Text>
        <ErrorActions>
            <Button variant="primary" onClick={onRetry}>
                Try Again
            </Button>
            {onGoBack && (
                <Button variant="secondary" onClick={onGoBack}>
                    Go Back
                </Button>
            )}
        </ErrorActions>
    </EnhancedErrorContainer>
);

// Quiz not found error
export const QuizNotFoundError = ({ onGoBack, onBrowseQuizzes }) => (
    <EnhancedErrorContainer>
        <ErrorIllustration type="notFound" />
        <Heading level={2} color="text">
            Quiz Not Found
        </Heading>
        <Text size="lg" color="textSecondary" style={{ marginBottom: designTokens.spacing.md }}>
            The quiz you're looking for doesn't exist or may have been removed.
        </Text>
        <Text size="sm" color="textMuted">
            Try browsing our available quizzes or check the URL and try again.
        </Text>
        <ErrorActions>
            <Button variant="primary" onClick={onBrowseQuizzes}>
                Browse Quizzes
            </Button>
            {onGoBack && (
                <Button variant="secondary" onClick={onGoBack}>
                    Go Back
                </Button>
            )}
        </ErrorActions>
    </EnhancedErrorContainer>
);

// Permission error (authentication required)
export const PermissionError = ({ onLogin, onGoBack }) => (
    <EnhancedErrorContainer>
        <ErrorIllustration type="permission" />
        <Heading level={2} color="text">
            Login Required
        </Heading>
        <Text size="lg" color="textSecondary" style={{ marginBottom: designTokens.spacing.md }}>
            You need to be logged in to access this quiz.
        </Text>
        <Text size="sm" color="textMuted">
            Please log in to your account to continue taking quizzes and track your progress.
        </Text>
        <ErrorActions>
            <Button variant="primary" onClick={onLogin}>
                Log In
            </Button>
            {onGoBack && (
                <Button variant="secondary" onClick={onGoBack}>
                    Go Back
                </Button>
            )}
        </ErrorActions>
    </EnhancedErrorContainer>
);

// Server error component
export const ServerError = ({ onRetry, onGoBack, errorCode }) => (
    <EnhancedErrorContainer>
        <ErrorIllustration type="server" />
        <Heading level={2} color="text">
            Server Error
        </Heading>
        <Text size="lg" color="textSecondary" style={{ marginBottom: designTokens.spacing.md }}>
            Something went wrong on our end. We're working to fix this issue.
        </Text>
        <Text size="sm" color="textMuted">
            {errorCode && `Error code: ${errorCode}. `}
            Please try again in a few minutes. If the problem continues, contact support.
        </Text>
        <ErrorActions>
            <Button variant="primary" onClick={onRetry}>
                Try Again
            </Button>
            {onGoBack && (
                <Button variant="secondary" onClick={onGoBack}>
                    Go Back
                </Button>
            )}
        </ErrorActions>
    </EnhancedErrorContainer>
);

// Timeout error component
export const TimeoutError = ({ onRetry, onGoBack }) => (
    <EnhancedErrorContainer>
        <ErrorIllustration type="timeout" />
        <Heading level={2} color="text">
            Request Timeout
        </Heading>
        <Text size="lg" color="textSecondary" style={{ marginBottom: designTokens.spacing.md }}>
            The request is taking longer than expected to complete.
        </Text>
        <Text size="sm" color="textMuted">
            This might be due to a slow connection or high server load. Please try again.
        </Text>
        <ErrorActions>
            <Button variant="primary" onClick={onRetry}>
                Try Again
            </Button>
            {onGoBack && (
                <Button variant="secondary" onClick={onGoBack}>
                    Go Back
                </Button>
            )}
        </ErrorActions>
    </EnhancedErrorContainer>
);

// Validation error component
export const ValidationError = ({ errors = [], onGoBack, onRetry }) => (
    <EnhancedErrorContainer>
        <ErrorIllustration type="validation" />
        <Heading level={2} color="text">
            Validation Error
        </Heading>
        <Text size="lg" color="textSecondary" style={{ marginBottom: designTokens.spacing.md }}>
            There were some issues with your submission:
        </Text>

        {errors.length > 0 && (
            <Card variant="error" style={{ marginBottom: designTokens.spacing.lg, textAlign: 'left' }}>
                <ul style={{
                    margin: 0,
                    paddingLeft: designTokens.spacing.lg,
                    color: designTokens.colors.error
                }}>
                    {errors.map((error, index) => (
                        <li key={index} style={{ marginBottom: designTokens.spacing.xs }}>
                            <Text size="sm" color="inherit">{error}</Text>
                        </li>
                    ))}
                </ul>
            </Card>
        )}

        <ErrorActions>
            {onRetry && (
                <Button variant="primary" onClick={onRetry}>
                    Try Again
                </Button>
            )}
            {onGoBack && (
                <Button variant="secondary" onClick={onGoBack}>
                    Go Back
                </Button>
            )}
        </ErrorActions>
    </EnhancedErrorContainer>
);

// Generic error component with customizable content
export const GenericError = ({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    details,
    onRetry,
    onGoBack,
    onContactSupport,
    type = 'generic'
}) => (
    <EnhancedErrorContainer>
        <ErrorIllustration type={type} />
        <Heading level={2} color="text">
            {title}
        </Heading>
        <Text size="lg" color="textSecondary" style={{ marginBottom: designTokens.spacing.md }}>
            {message}
        </Text>
        {details && (
            <Text size="sm" color="textMuted">
                {details}
            </Text>
        )}
        <ErrorActions>
            {onRetry && (
                <Button variant="primary" onClick={onRetry}>
                    Try Again
                </Button>
            )}
            {onGoBack && (
                <Button variant="secondary" onClick={onGoBack}>
                    Go Back
                </Button>
            )}
            {onContactSupport && (
                <Button variant="secondary" onClick={onContactSupport}>
                    Contact Support
                </Button>
            )}
        </ErrorActions>
    </EnhancedErrorContainer>
);

// Offline error component
export const OfflineError = ({ onRetry }) => (
    <EnhancedErrorContainer>
        <ErrorIllustration type="network" />
        <Heading level={2} color="text">
            You're Offline
        </Heading>
        <Text size="lg" color="textSecondary" style={{ marginBottom: designTokens.spacing.md }}>
            It looks like you've lost your internet connection.
        </Text>
        <Text size="sm" color="textMuted">
            Please check your connection and try again. Some features may not work while offline.
        </Text>
        <ErrorActions>
            <Button variant="primary" onClick={onRetry}>
                Try Again
            </Button>
        </ErrorActions>
    </EnhancedErrorContainer>
);

// Error boundary fallback component
export const ErrorBoundaryFallback = ({ error, resetError }) => (
    <ContentWrapper>
        <EnhancedErrorContainer>
            <ErrorIllustration type="generic" />
            <Heading level={2} color="text">
                Oops! Something went wrong
            </Heading>
            <Text size="lg" color="textSecondary" style={{ marginBottom: designTokens.spacing.md }}>
                We encountered an unexpected error. This has been reported to our team.
            </Text>

            {process.env.NODE_ENV === 'development' && error && (
                <Card variant="error" style={{
                    marginBottom: designTokens.spacing.lg,
                    textAlign: 'left',
                    maxWidth: '100%',
                    overflow: 'auto'
                }}>
                    <Text size="xs" color="error" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {error.toString()}
                    </Text>
                </Card>
            )}

            <ErrorActions>
                <Button variant="primary" onClick={resetError}>
                    Try Again
                </Button>
                <Button variant="secondary" onClick={() => window.location.href = '/quizzes'}>
                    Go to Quizzes
                </Button>
            </ErrorActions>
        </EnhancedErrorContainer>
    </ContentWrapper>
);

// Hook for handling common error scenarios
export const useErrorHandler = () => {
    const handleError = (error, context = {}) => {
        // Log error for debugging
        console.error('Quiz Error:', error, context);

        // Determine error type and return appropriate component props
        if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
            return { type: 'network', component: NetworkError };
        }

        if (error.status === 404 || error.code === 'NOT_FOUND') {
            return { type: 'notFound', component: QuizNotFoundError };
        }

        if (error.status === 401 || error.status === 403 || error.code === 'UNAUTHORIZED') {
            return { type: 'permission', component: PermissionError };
        }

        if (error.status >= 500 || error.code === 'SERVER_ERROR') {
            return { type: 'server', component: ServerError };
        }

        if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
            return { type: 'timeout', component: TimeoutError };
        }

        if (error.name === 'ValidationError' || error.code === 'VALIDATION_ERROR') {
            return { type: 'validation', component: ValidationError };
        }

        // Default to generic error
        return { type: 'generic', component: GenericError };
    };

    return { handleError };
};

export default {
    NetworkError,
    QuizNotFoundError,
    PermissionError,
    ServerError,
    TimeoutError,
    ValidationError,
    GenericError,
    OfflineError,
    ErrorBoundaryFallback,
    useErrorHandler,
};