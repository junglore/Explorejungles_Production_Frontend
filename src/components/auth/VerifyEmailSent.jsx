import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import arrowBackIos24Px from "../../assets/icons/arrow-back-ios-24px.svg";
import jungloreLogoSvg from "../../assets/images/Junglore_Favicon_.png";
import "./Auth.css";

export const VerifyEmailSent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleResendVerification = async () => {
        if (!email) {
            setMessage('Email address not found. Please signup again.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await authService.resendVerification(email);
            setMessage('New verification code sent successfully! Please check your inbox.');
        } catch (error) {
            console.error('Failed to resend verification:', error);
            setMessage(error.message || 'Failed to resend verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length !== 6) {
            setMessage('Please enter a valid 6-digit verification code.');
            return;
        }

        setVerifying(true);
        setMessage('');

        try {
            await authService.verifyEmailOTP(email, otp);
            setMessage('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('OTP verification failed:', error);
            
            // Parse error message for better user feedback
            let errorMessage = error.message || 'Invalid or expired verification code. Please try again.';
            
            if (errorMessage.includes('expired')) {
                errorMessage = 'Your verification code has expired. Please request a new one using the "Resend" button below.';
            } else if (errorMessage.includes('Invalid')) {
                errorMessage = 'The verification code you entered is incorrect. Please check your email for the correct 6-digit code and try again.';
            }
            
            setMessage(errorMessage);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <Link to="/">
                    <img src={jungloreLogoSvg} alt="Junglore Logo" className="jungle-logo" />
                </Link>
            </div>

            <div className="auth-right">
                <div className="back-button">
                    <Link to="/signup" className="back-link">
                        <img src={arrowBackIos24Px} alt="Back" className="back-icon" />
                        <span>Back to Signup</span>
                    </Link>
                </div>

                <div className="auth-form">
                    <h1 className="auth-title">Check Your Email</h1>
                    <p className="auth-subtitle">
                        We've sent a 6-digit verification code to{' '}
                        <strong>{email || 'your email address'}</strong>. 
                        Enter the code below to verify your account.
                    </p>

                    <div className="email-verification-info">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="email-icon">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="otp-form">
                        <div className="form-group">
                            <label className="form-label">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="form-input otp-input"
                                placeholder="Enter 6-digit code"
                                maxLength="6"
                                required
                                style={{
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    letterSpacing: '0.5rem',
                                    fontWeight: 'bold'
                                }}
                            />
                            <small className="form-help">The code expires in 15 minutes</small>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={verifying || otp.length !== 6}
                            style={{
                                opacity: (verifying || otp.length !== 6) ? 0.7 : 1,
                                cursor: (verifying || otp.length !== 6) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {verifying ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>

                    {message && (
                        <div className={`message ${message.includes('successfully') ? 'success-message' : 'error-message'}`}>
                            {message}
                        </div>
                    )}

                    <div className="verification-actions">
                        <button
                            onClick={handleResendVerification}
                            className="auth-button secondary"
                            disabled={loading || !email}
                            style={{
                                opacity: (loading || !email) ? 0.7 : 1,
                                cursor: (loading || !email) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Sending...' : 'Resend Verification Code'}
                        </button>
                    </div>

                    <div className="email-help">
                        <h4>Didn't receive the code?</h4>
                        <ul>
                            <li>Check your spam or junk mail folder</li>
                            <li>Make sure you entered the correct email address</li>
                            <li>Wait a few minutes and check again</li>
                            <li>Use the "Resend" button to get a new code</li>
                            <li><strong>Note:</strong> Verification codes expire after 15 minutes</li>
                            <li><strong>Tip:</strong> If you signed up multiple times, only the latest code will work</li>
                        </ul>
                    </div>

                    <p className="auth-link">
                        Wrong email address? <Link to="/signup" className="link-text">Sign up again</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
