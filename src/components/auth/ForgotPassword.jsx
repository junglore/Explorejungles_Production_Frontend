import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import arrowBackIos24Px from "../../assets/icons/arrow-back-ios-24px.svg";
import jungloreLogoSvg from "../../assets/images/Junglore_Favicon_.png";
import "./Auth.css";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.requestPasswordReset(formData.email);
            // Navigate to OTP verification page
            navigate('/reset-password-otp', { state: { email: formData.email } });
        } catch (error) {
            console.error('Password reset request failed:', error);
            setError(error.message || 'Failed to send reset code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className="auth-title">Check Your Email</h1>
                        <p className="auth-subtitle">
                            We've sent a password reset link to {formData.email}. Please check your email and follow the instructions to reset your password.
                        </p>

                        <div className="success-message">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="success-icon">
                                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/>
                                <path d="m9 12 2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p>Reset email sent successfully!</p>
                        </div>

                        <button
                            onClick={() => {
                                setSuccess(false);
                                setFormData({ email: '' });
                            }}
                            className="auth-button"
                        >
                            Send Another Email
                        </button>

                        <p className="auth-link">
                            Remember your password? <Link to="/login" className="link-text">Sign in here</Link>
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
                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-subtitle">
                        Enter your email address and we'll send you a 6-digit code to reset your password.
                    </p>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                            style={{
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Code'}
                        </button>

                        <p className="auth-link">
                            Remember your password? <Link to="/login" className="link-text">Sign in here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
