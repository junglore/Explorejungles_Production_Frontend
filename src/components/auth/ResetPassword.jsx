import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/auth";
import { validatePassword, checkPasswordMatch } from "../../utils/passwordValidation";
import PasswordStrengthIndicator from "../common/PasswordStrengthIndicator";
import arrowBackIos24Px from "../../assets/icons/arrow-back-ios-24px.svg";
import jungloreLogoSvg from "../../assets/images/Junglore_Favicon_.png";
import "./Auth.css";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        password: [],
        confirmPassword: null
    });

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        const emailParam = searchParams.get('email');
        
        if (!tokenParam) {
            setError('Invalid reset link. Please request a new password reset.');
            return;
        }
        
        setToken(tokenParam);
        if (emailParam) setEmail(emailParam);
    }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (error) setError(null);

        // Real-time password validation
        if (name === 'password') {
            const passwordValidation = validatePassword(value);
            setValidationErrors(prev => ({
                ...prev,
                password: passwordValidation.errors
            }));
            
            // Also validate confirm password if it exists
            if (formData.confirmPassword) {
                const confirmValidation = checkPasswordMatch(value, formData.confirmPassword);
                setValidationErrors(prev => ({
                    ...prev,
                    confirmPassword: confirmValidation.error
                }));
            }
        }

        if (name === 'confirmPassword') {
            const confirmValidation = checkPasswordMatch(formData.password, value);
            setValidationErrors(prev => ({
                ...prev,
                confirmPassword: confirmValidation.error
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate password before submission
        const passwordValidation = validatePassword(formData.password);
        const confirmValidation = checkPasswordMatch(formData.password, formData.confirmPassword);
        
        if (!passwordValidation.isValid) {
            setValidationErrors(prev => ({
                ...prev,
                password: passwordValidation.errors
            }));
            setLoading(false);
            return;
        }
        
        if (!confirmValidation.isValid) {
            setValidationErrors(prev => ({
                ...prev,
                confirmPassword: confirmValidation.error
            }));
            setLoading(false);
            return;
        }

        // Clear validation errors if all is good
        setValidationErrors({ password: [], confirmPassword: null });

        try {
            await authService.resetPassword(token, formData.password);
            setSuccess(true);
        } catch (error) {
            console.error('Password reset failed:', error);
            setError(error.message || 'Failed to reset password. Please try again.');
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
                        <h1 className="auth-title">Password Reset Successful</h1>
                        <p className="auth-subtitle">
                            Your password has been successfully reset. You can now sign in with your new password.
                        </p>

                        <div className="success-message">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="success-icon">
                                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/>
                                <path d="m9 12 2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p>Password updated successfully!</p>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="auth-button"
                        >
                            Sign In Now
                        </button>

                        <p className="auth-link">
                            Need help? <Link to="/contact" className="link-text">Contact support</Link>
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
                    <h1 className="auth-title">Create New Password</h1>
                    <p className="auth-subtitle">
                        {email ? `Set a new password for ${email}` : 'Your new password must be different from previously used passwords.'}
                    </p>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Enter new password"
                                required
                                minLength="8"
                            />
                            <PasswordStrengthIndicator 
                                password={formData.password} 
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
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
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

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading || !token}
                            style={{
                                opacity: (loading || !token) ? 0.7 : 1,
                                cursor: (loading || !token) ? 'not-allowed' : 'pointer'
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
