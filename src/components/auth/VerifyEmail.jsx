import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/auth";
import arrowBackIos24Px from "../../assets/icons/arrow-back-ios-24px.svg";
import jungloreLogoSvg from "../../assets/images/Junglore_Favicon_.png";
import "./Auth.css";

export const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        const emailParam = searchParams.get('email');
        
        if (!tokenParam) {
            setError('Invalid verification link. Please request a new verification email.');
            setLoading(false);
            return;
        }
        
        setToken(tokenParam);
        if (emailParam) setEmail(emailParam);
        
        // Auto-verify when component mounts
        verifyEmail(tokenParam);
    }, [searchParams]);

    const verifyEmail = async (verificationToken) => {
        try {
            await authService.verifyEmail(verificationToken);
            setSuccess(true);
        } catch (error) {
            console.error('Email verification failed:', error);
            setError(error.message || 'Failed to verify email. The link may be expired or invalid.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!email) {
            setError('Email address not found. Please signup again.');
            return;
        }

        setLoading(true);
        try {
            await authService.resendVerification(email);
            setError(null);
            alert('Verification email sent successfully!');
        } catch (error) {
            console.error('Failed to resend verification:', error);
            setError(error.message || 'Failed to resend verification email.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="auth-container">
                <div className="auth-left">
                    <Link to="/">
                        <img src={jungloreLogoSvg} alt="Junglore Logo" className="jungle-logo" />
                    </Link>
                </div>

                <div className="auth-right">
                    <div className="auth-form">
                        <h1 className="auth-title">Verifying Email...</h1>
                        <p className="auth-subtitle">
                            Please wait while we verify your email address.
                        </p>

                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-left">
                    <Link to="/">
                        <img src={jungloreLogoSvg} alt="Junglore Logo" className="jungle-logo" />
                    </Link>
                </div>

                <div className="auth-right">
                    <div className="back-button">
                        <Link to="/login" className="back-link">
                            <img src={arrowBackIos24Px} alt="Back" className="back-icon" />
                            <span>Back to Login</span>
                        </Link>
                    </div>

                    <div className="auth-form">
                        <h1 className="auth-title">Email Verified!</h1>
                        <p className="auth-subtitle">
                            Your email has been successfully verified. You can now access all features of your Junglore account.
                        </p>

                        <div className="success-message">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="success-icon">
                                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/>
                                <path d="m9 12 2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p>Email verification successful!</p>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="auth-button"
                        >
                            Continue to Login
                        </button>

                        <p className="auth-link">
                            Ready to explore? <Link to="/" className="link-text">Go to Homepage</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-left">
                <Link to="/">
                    <img src={jungloreLogoSvg} alt="Junglore Logo" className="jungle-logo" />
                </Link>
            </div>

            <div className="auth-right">
                <div className="back-button">
                    <Link to="/login" className="back-link">
                        <img src={arrowBackIos24Px} alt="Back" className="back-icon" />
                        <span>Back to Login</span>
                    </Link>
                </div>

                <div className="auth-form">
                    <h1 className="auth-title">Email Verification Failed</h1>
                    <p className="auth-subtitle">
                        We couldn't verify your email address. The verification link may be expired or invalid.
                    </p>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="verification-actions">
                        {email && (
                            <button
                                onClick={handleResendVerification}
                                className="auth-button"
                                disabled={loading}
                                style={{
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/signup')}
                            className="auth-button secondary"
                        >
                            Sign Up Again
                        </button>
                    </div>

                    <p className="auth-link">
                        Already verified? <Link to="/login" className="link-text">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
