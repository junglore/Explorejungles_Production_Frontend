// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { SquareCheckboxSolid } from "../ui/SquareCheckboxSolid";
// import ReCAPTCHA from "react-google-recaptcha";
// import { useAuth } from "../../contexts/AuthContext";
// import GoogleLoginButton from "./GoogleLoginButton";
// import FacebookLoginButton from "./FacebookLoginButton";
// import LinkedInLoginButton from "./LinkedInLoginButton";
// import arrowBackIos24Px from "../../assets/icons/arrow-back-ios-24px.svg";
// import jungloreLogoSvg from "../../assets/images/Junglore_Favicon_.png";
// import "./Auth.css";

// export const Login = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { login, googleLogin, facebookLogin, linkedinLogin, loading, error } = useAuth();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//         rememberMe: false
//     });
//     const [successMessage, setSuccessMessage] = useState('');


//     useEffect(() => {
//         // Check for success message from routing state
//         if (location.state?.message) {
//             setSuccessMessage(location.state.message);
//         }
//     }, [location.state]);

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             await login(formData.email, formData.password);
//             // Redirect to dashboard or home page on successful login
//             navigate('/');
//         } catch (error) {
//             console.error('Login failed:', error);
            
//             // Check if it's an email verification error
//             if (error.message && error.message.includes('verify your email')) {
//                 // Show verification option
//                 const shouldVerify = window.confirm(
//                     'Your email address is not verified. Would you like to verify it now?'
//                 );
                
//                 if (shouldVerify) {
//                     navigate('/verify-email-sent', { state: { email: formData.email } });
//                 }
//             }
//             // Error is handled by AuthContext and displayed via error state
//         }
//     };

//     const handleGoogleSuccess = async (credentialResponse) => {
//         try {
//             await googleLogin(credentialResponse);
//             navigate('/');
//         } catch (error) {
//             console.error('Google login failed:', error);
//         }
//     };

//     const handleGoogleError = (error) => {
//         console.error('Google login error:', error);
//         // You might want to show an error message to the user
//     };

//     const handleFacebookSuccess = async (response) => {
//         try {
//             await facebookLogin(response);
//             navigate('/');
//         } catch (error) {
//             console.error('Facebook login failed:', error);
//         }
//     };

//     const handleFacebookError = (error) => {
//         console.error('Facebook login error:', error);
//     };

//     const handleLinkedInSuccess = async (response) => {
//         try {
//             await linkedinLogin(response);
//             navigate('/');
//         } catch (error) {
//             console.error('LinkedIn login failed:', error);
//         }
//     };

//     const handleLinkedInError = (error) => {
//         console.error('LinkedIn login error:', error);
//     };

//     return (
//         <div className="auth-container">
//             <div className="auth-left">
//                 <Link to="/">
//                     <img src={jungloreLogoSvg} alt="Junglore Logo" className="jungle-logo" />
//                 </Link>
//             </div>

//             <div className="auth-right">
//                 <div className="back-button">
//                     <Link to="/" className="back-link">
//                         <img src={arrowBackIos24Px} alt="Back" className="back-icon" />
//                         <span>Back</span>
//                     </Link>
//                 </div>

//                 <div className="auth-form">
//                     <h1 className="auth-title">Account Login</h1>
//                     <p className="auth-subtitle">
//                         If you are already a member you can login with your email address and password.
//                     </p>

//                     {successMessage && (
//                         <div className="success-message" style={{
//                             color: '#27ae60',
//                             backgroundColor: '#d5f4e6',
//                             padding: '10px',
//                             borderRadius: '5px',
//                             marginBottom: '15px',
//                             fontSize: '14px'
//                         }}>
//                             {successMessage}
//                         </div>
//                     )}

//                     {error && (
//                         <div className="error-message" style={{
//                             color: '#e74c3c',
//                             backgroundColor: '#fadbd8',
//                             padding: '10px',
//                             borderRadius: '5px',
//                             marginBottom: '15px',
//                             fontSize: '14px'
//                         }}>
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="form">
//                         <div className="form-group">
//                             <label className="form-label">Email address</label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange}
//                                 className="form-input"
//                                 required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Password</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleInputChange}
//                                 className="form-input"
//                                 required
//                             />
//                         </div>

//                         <div className="form-extras">
//                             <div className="checkbox-group">
//                                 <SquareCheckboxSolid
//                                     checked={formData.rememberMe}
//                                     onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
//                                     color="#2C73EB"
//                                 />
//                                 <span className="checkbox-label">Remember me</span>
//                             </div>
//                             <Link to="/forgot-password" className="forgot-password-link">
//                                 Forgot password?
//                             </Link>
//                         </div>

//                         <button
//                             type="submit"
//                             className="auth-button"
//                             disabled={loading}
//                             style={{
//                                 opacity: loading ? 0.7 : 1,
//                                 cursor: loading ? 'not-allowed' : 'pointer'
//                             }}
//                         >
//                             {loading ? 'Signing in...' : 'Login'}
//                         </button>

//                         <p className="auth-link">
//                             Don't have an account? <Link to="/signup" className="link-text">Create one here</Link>
//                         </p>
                        
//                         {(import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_FACEBOOK_APP_ID || import.meta.env.VITE_LINKEDIN_CLIENT_ID) && (
//                             <>
//                                 <div className="or-divider" style={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     margin: '20px 0',
//                                     color: '#666'
//                                 }}>
//                                     <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
//                                     <span style={{ padding: '0 15px', fontSize: '14px' }}>OR</span>
//                                     <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
//                                 </div>

//                                 <div className="social-login-buttons">
//                                     {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
//                                         <GoogleLoginButton 
//                                             onSuccess={handleGoogleSuccess}
//                                             onError={handleGoogleError}
//                                             text="Continue with Google"
//                                         />
//                                     )}
                                    
//                                     {import.meta.env.VITE_FACEBOOK_APP_ID && (
//                                         <FacebookLoginButton 
//                                             onSuccess={handleFacebookSuccess}
//                                             onError={handleFacebookError}
//                                             text="Continue with Facebook"
//                                         />
//                                     )}
                                    
//                                     {import.meta.env.VITE_LINKEDIN_CLIENT_ID && (
//                                         <LinkedInLoginButton 
//                                             onSuccess={handleLinkedInSuccess}
//                                             onError={handleLinkedInError}
//                                             text="Continue with LinkedIn"
//                                         />
//                                     )}
//                                 </div>
//                             </>
//                         )}
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }; 




import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { SquareCheckboxSolid } from "../ui/SquareCheckboxSolid";
import { useAuth } from "../../contexts/AuthContext";
import GoogleLoginButton from "./GoogleLoginButton";
import FacebookLoginButton from "./FacebookLoginButton";
import LinkedInLoginButton from "./LinkedInLoginButton";
import arrowBackIos24Px from "../../assets/icons/arrow-back-ios-24px.svg";
import jungloreLogoSvg from "../../assets/images/Junglore_Favicon_.png";
import "./Auth.css";

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, googleLogin, facebookLogin, linkedinLogin, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const recaptchaRef = useRef(null);

    useEffect(() => {
        // Check for success message from routing state
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verify reCAPTCHA token exists
        if (!recaptchaToken) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }

        try {
            await login(formData.email, formData.password, recaptchaToken);
            // Redirect to dashboard or home page on successful login
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            
            // Reset reCAPTCHA on error
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                setRecaptchaToken('');
            }
            
            // Check if it's an email verification error
            if (error.message && error.message.includes('verify your email')) {
                // Show verification option
                const shouldVerify = window.confirm(
                    'Your email address is not verified. Would you like to verify it now?'
                );
                
                if (shouldVerify) {
                    navigate('/verify-email-sent', { state: { email: formData.email } });
                }
            }
            // Error is handled by AuthContext and displayed via error state
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
            console.error('Google login failed:', error);
        }
    };

    const handleGoogleError = (error) => {
        console.error('Google login error:', error);
        // You might want to show an error message to the user
    };

    const handleFacebookSuccess = async (response) => {
        try {
            await facebookLogin(response);
            navigate('/');
        } catch (error) {
            console.error('Facebook login failed:', error);
        }
    };

    const handleFacebookError = (error) => {
        console.error('Facebook login error:', error);
    };

    const handleLinkedInSuccess = async (response) => {
        try {
            await linkedinLogin(response);
            navigate('/');
        } catch (error) {
            console.error('LinkedIn login failed:', error);
        }
    };

    const handleLinkedInError = (error) => {
        console.error('LinkedIn login error:', error);
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
                    <Link to="/" className="back-link">
                        <img src={arrowBackIos24Px} alt="Back" className="back-icon" />
                        <span>Back</span>
                    </Link>
                </div>

                <div className="auth-form">
                    <h1 className="auth-title">Account Login</h1>
                    <p className="auth-subtitle">
                        If you are already a member you can login with your email address and password.
                    </p>

                    {successMessage && (
                        <div className="success-message" style={{
                            color: '#27ae60',
                            backgroundColor: '#d5f4e6',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            fontSize: '14px'
                        }}>
                            {successMessage}
                        </div>
                    )}

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
                            <label className="form-label">Email address</label>
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
                            />
                        </div>

                        <div className="form-extras">
                            <div className="checkbox-group">
                                <SquareCheckboxSolid
                                    checked={formData.rememberMe}
                                    onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
                                    color="#1E2D27"
                                />
                                <span className="checkbox-label">Remember me</span>
                            </div>
                            <Link to="/forgot-password" className="forgot-password-link">
                                Forgot password?
                            </Link>
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
                            {loading ? 'Signing in...' : 'Login'}
                        </button>

                        <p className="auth-link">
                            Don't have an account? <Link to="/signup" className="link-text">Create one here</Link>
                        </p>
                        
                        {(import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_FACEBOOK_APP_ID || import.meta.env.VITE_LINKEDIN_CLIENT_ID) && (
                            <>
                                <div className="or-divider" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '12px 0',
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