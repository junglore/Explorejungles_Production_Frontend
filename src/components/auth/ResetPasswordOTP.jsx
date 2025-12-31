import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import { validatePassword, checkPasswordMatch } from "../../utils/passwordValidation";
import PasswordStrengthIndicator from "../common/PasswordStrengthIndicator";
import arrowBackIos24Px from "../../assets/icons/arrow-back-ios-24px.svg";
import jungloreLogoSvg from "../../assets/images/Junglore_Favicon_.png";
import "./Auth.css";

export const ResetPasswordOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: OTP verification, 2: New password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        password: [],
        confirmPassword: null
    });

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit verification code.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.verifyResetOTP(email, otp);
            setStep(2); // Move to password reset step
        } catch (error) {
            console.error('OTP verification failed:', error);
            setError(error.message || 'Invalid or expired verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'newPassword') {
            setNewPassword(value);
            
            // Real-time password validation
            const passwordValidation = validatePassword(value);
            setValidationErrors(prev => ({
                ...prev,
                password: passwordValidation.errors
            }));
            
            // Also validate confirm password if it exists
            if (confirmPassword) {
                const confirmValidation = checkPasswordMatch(value, confirmPassword);
                setValidationErrors(prev => ({
                    ...prev,
                    confirmPassword: confirmValidation.error
                }));
            }
        }
        
        if (name === 'confirmPassword') {
            setConfirmPassword(value);
            const confirmValidation = checkPasswordMatch(newPassword, value);
            setValidationErrors(prev => ({
                ...prev,
                confirmPassword: confirmValidation.error
            }));
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validate password before submission
        const passwordValidation = validatePassword(newPassword);
        const confirmValidation = checkPasswordMatch(newPassword, confirmPassword);
        
        if (!passwordValidation.isValid) {
            setValidationErrors(prev => ({
                ...prev,
                password: passwordValidation.errors
            }));
            setError('Please ensure your password meets all security requirements.');
            return;
        }
        
        if (!confirmValidation.isValid) {
            setValidationErrors(prev => ({
                ...prev,
                confirmPassword: confirmValidation.error
            }));
            setError('Please ensure passwords match.');
            return;
        }

        // Clear validation errors if all is good
        setValidationErrors({ password: [], confirmPassword: null });

        setLoading(true);
        setError('');

        try {
            await authService.resetPasswordWithOTP(email, otp, newPassword);
            navigate('/login', { 
                state: { 
                    message: 'Password reset successfully! Please login with your new password.' 
                } 
            });
        } catch (error) {
            console.error('Password reset failed:', error);
            setError(error.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResendLoading(true);
        setError('');

        try {
            await authService.requestPasswordReset(email);
            setError('New verification code sent successfully! Please check your email.');
        } catch (error) {
            console.error('Failed to resend code:', error);
            setError(error.message || 'Failed to resend verification code. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    // Step 1: OTP Verification
    if (step === 1) {
        return (
            <div className="auth-container">
                <div className="auth-left">
                    <Link to="/">
                        <img src={jungloreLogoSvg} alt="Junglore Logo" className="jungle-logo" />
                    </Link>
                </div>

                <div className="auth-right">
                    <div className="back-button">
                        <Link to="/forgot-password" className="back-link">
                            <img src={arrowBackIos24Px} alt="Back" className="back-icon" />
                            <span>Back</span>
                        </Link>
                    </div>

                    <div className="auth-form">
                        <h1 className="auth-title">Enter Verification Code</h1>
                        <p className="auth-subtitle">
                            We've sent a 6-digit verification code to{' '}
                            <strong>{email}</strong>. Enter the code below to proceed.
                        </p>

                        <div className="email-verification-info">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="email-icon">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#f57c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

                            {error && (
                                <div className={`message ${error.includes('successfully') ? 'success-message' : 'error-message'}`}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading || otp.length !== 6}
                                style={{
                                    opacity: (loading || otp.length !== 6) ? 0.7 : 1,
                                    cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>

                            <button
                                type="button"
                                onClick={handleResendCode}
                                className="auth-button secondary"
                                disabled={resendLoading}
                                style={{
                                    opacity: resendLoading ? 0.7 : 1,
                                    cursor: resendLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {resendLoading ? 'Sending...' : 'Resend Code'}
                            </button>
                        </form>

                        <p className="auth-link">
                            Remember your password? <Link to="/login" className="link-text">Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: New Password
    return (
        <div className="auth-container">
            <div className="auth-left">
                <Link to="/">
                    <img src={jungloreLogoSvg} alt="Junglore Logo" className="jungle-logo" />
                </Link>
            </div>

            <div className="auth-right">
                <div className="back-button">
                    <button onClick={() => setStep(1)} className="back-link">
                        <img src={arrowBackIos24Px} alt="Back" className="back-icon" />
                        <span>Back</span>
                    </button>
                </div>

                <div className="auth-form">
                    <h1 className="auth-title">Create New Password</h1>
                    <p className="auth-subtitle">
                        Set a new password for <strong>{email}</strong>. Make sure it's secure and memorable.
                    </p>

                    <form onSubmit={handleResetPassword} className="form">
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                className="form-input"
                                placeholder="Enter new password"
                                required
                                minLength="8"
                            />
                            <PasswordStrengthIndicator 
                                password={newPassword} 
                                showRequirements={true}
                            />
                            {validationErrors.password.length > 0 && (
                                <div className="password-errors" style={{
                                    color: '#e74c3c',
                                    fontSize: '12px',
                                    marginTop: '4px'
                                }}>
                                    {validationErrors.password.map((error, index) => (
                                        <div key={index}>• {error}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handlePasswordChange}
                                className="form-input"
                                placeholder="Confirm new password"
                                required
                                minLength="8"
                            />
                            {validationErrors.confirmPassword && (
                                <div className="confirm-password-error" style={{
                                    color: '#e74c3c',
                                    fontSize: '12px',
                                    marginTop: '4px'
                                }}>
                                    {validationErrors.confirmPassword}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                            style={{
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Updating Password...' : 'Update Password'}
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
