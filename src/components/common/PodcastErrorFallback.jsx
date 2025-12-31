/**
 * Podcast Error Fallback Component
 * Displays when there's an error in podcast-related pages
 */

import React from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const ErrorContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '40px 20px',
    backgroundColor: '#1E2D27',
    color: '#FFE8A1',
    textAlign: 'center',
});

const ErrorTitle = styled('h2')({
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    fontSize: '32px',
    marginBottom: '16px',
    color: '#FFE8A1',
});

const ErrorMessage = styled('p')({
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    marginBottom: '32px',
    maxWidth: '600px',
    lineHeight: 1.6,
    color: '#CDD99D',
});

const ErrorActions = styled('div')({
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
});

const ActionButton = styled('button')({
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

const SecondaryButton = styled('button')({
    backgroundColor: 'transparent',
    color: '#FFE8A1',
    border: '1px solid #FFE8A1',
    borderRadius: '8px',
    padding: '12px 24px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 232, 161, 0.1)',
        transform: 'translateY(-2px)',
    },
});

const PodcastErrorFallback = ({ error }) => {
    const navigate = useNavigate();

    const handleRetry = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoToMedia = () => {
        navigate('/media');
    };

    return (
        <ErrorContainer>
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>
                We encountered an issue while loading the podcast content.
                This might be a temporary problem with our servers or your connection.
            </ErrorMessage>

            {process.env.NODE_ENV === 'development' && error && (
                <details style={{
                    marginBottom: '24px',
                    padding: '16px',
                    backgroundColor: 'rgba(255, 232, 161, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    textAlign: 'left',
                    maxWidth: '600px',
                    width: '100%'
                }}>
                    <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                        Error Details (Development)
                    </summary>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px' }}>
                        {error.toString()}
                    </pre>
                </details>
            )}

            <ErrorActions>
                <ActionButton onClick={handleRetry}>
                    Try Again
                </ActionButton>
                <SecondaryButton onClick={handleGoToMedia}>
                    Back to Media
                </SecondaryButton>
                <SecondaryButton onClick={handleGoHome}>
                    Go Home
                </SecondaryButton>
            </ErrorActions>
        </ErrorContainer>
    );
};

export default PodcastErrorFallback;