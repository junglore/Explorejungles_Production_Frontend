import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../../contexts/AuthContext";
import { validatePassword, checkPasswordMatch } from "../../utils/passwordValidation";
import PasswordStrengthIndicator from "../common/PasswordStrengthIndicator";
import GoogleLoginButton from "./GoogleLoginButton";
import FacebookLoginButton from "./FacebookLoginButton";
import LinkedInLoginButton from "./LinkedInLoginButton";
import arrowBackIos24Px from "../../assets/icons/arrow-back-ios-24px.svg";
import jungloreLogoSvg from "../../assets/images/Junglore_Favicon_.png";
import "./Auth.css";

export const Signup = () => {
    const navigate = useNavigate();
    const { signup, googleLogin, facebookLogin, linkedinLogin, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: '',
        country: ''
    });

    const [validationErrors, setValidationErrors] = useState({
        password: [],
        confirmPassword: null
    });

    const [recaptchaToken, setRecaptchaToken] = useState('');
    const recaptchaRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

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
        
        // Verify reCAPTCHA token exists
        if (!recaptchaToken) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }
        
        // Validate password before submission
        const passwordValidation = validatePassword(formData.password);
        const confirmValidation = checkPasswordMatch(formData.password, formData.confirmPassword);
        
        if (!passwordValidation.isValid) {
            setValidationErrors(prev => ({
                ...prev,
                password: passwordValidation.errors
            }));
            return;
        }
        
        if (!confirmValidation.isValid) {
            setValidationErrors(prev => ({
                ...prev,
                confirmPassword: confirmValidation.error
            }));
            return;
        }

        // Clear validation errors if all is good
        setValidationErrors({ password: [], confirmPassword: null });
        
        // Original validation
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const result = await signup({ ...formData, recaptcha_token: recaptchaToken });
            // If signup doesn't throw an error, it was successful
            // Navigate to email verification page (OTP-based)
            navigate('/verify-email-sent', { state: { email: formData.email } });
        } catch (error) {
            console.error('Signup error:', error);
            
            // Reset reCAPTCHA on error
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                setRecaptchaToken('');
            }
            // Error handling is done in AuthContext, no need to handle here
        }
    };

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse);
            navigate('/');
        } catch (error) {
            console.error('Google signup failed:', error);
        }
    };

    const handleGoogleError = (error) => {
        console.error('Google signup error:', error);
        // You might want to show an error message to the user
    };

    const handleFacebookSuccess = async (response) => {
        try {
            await facebookLogin(response);
            navigate('/');
        } catch (error) {
            console.error('Facebook signup failed:', error);
        }
    };

    const handleFacebookError = (error) => {
        console.error('Facebook signup error:', error);
    };

    const handleLinkedInSuccess = async (response) => {
        try {
            await linkedinLogin(response);
            navigate('/');
        } catch (error) {
            console.error('LinkedIn signup failed:', error);
        }
    };

    const handleLinkedInError = (error) => {
        console.error('LinkedIn signup error:', error);
    };    return (
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
                    <h1 className="auth-title">Account Signup</h1>
                    <p className="auth-subtitle">
                        Join the Junglore community and explore wildlife like never before.
                    </p>

                    {error && (
                        <div className="error-message" style={{
                            color: '#e74c3c',
                            backgroundColor: '#fadbd8',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="form-input"
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
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="form-input"
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

                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="form-input"
                            >
                                <option value="">Select (Optional)</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="e.g., India"
                            />
                        </div>

                        {/* Google reCAPTCHA */}
                        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-start', transform: 'scale(0.85)', transformOrigin: 'left' }}>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={handleRecaptchaChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading || !recaptchaToken}
                            style={{
                                opacity: (loading || !recaptchaToken) ? 0.7 : 1,
                                cursor: (loading || !recaptchaToken) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <p className="auth-link">
                            Already have an account? <Link to="/login" className="link-text">Sign in here</Link>
                        </p>

                        {(import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_FACEBOOK_APP_ID || import.meta.env.VITE_LINKEDIN_CLIENT_ID) && (
                            <>
                                <div className="or-divider" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '20px 0',
                                    color: '#666'
                                }}>
                                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                                    <span style={{ padding: '0 15px', fontSize: '14px' }}>OR</span>
                                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                                </div>

                                <div className="social-login-buttons">
                                    {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                                        <GoogleLoginButton 
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            text=""
                                        />
                                    )}
                                    
                                    {import.meta.env.VITE_FACEBOOK_APP_ID && (
                                        <FacebookLoginButton 
                                            onSuccess={handleFacebookSuccess}
                                            onError={handleFacebookError}
                                            text=""
                                        />
                                    )}
                                    
                                    {import.meta.env.VITE_LINKEDIN_CLIENT_ID && (
                                        <LinkedInLoginButton 
                                            onSuccess={handleLinkedInSuccess}
                                            onError={handleLinkedInError}
                                            text=""
                                        />
                                    )}
                                </div>
                            </>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
};