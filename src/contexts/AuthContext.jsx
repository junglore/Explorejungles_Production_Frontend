import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.js';
import apiService from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize authentication state
    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            setLoading(true);
            const currentUser = authService.getCurrentUser();
            const token = apiService.getToken();

            // Only try to fetch profile if we have BOTH user data and a token
            if (currentUser && token) {
                // Verify token is still valid by fetching profile
                try {
                    const profile = await authService.getProfile();
                    setUser(profile);
                } catch (error) {
                    // Token might be expired or invalid, clear auth silently
                    console.log('Token validation failed, clearing auth:', error.message);
                    await authService.logout();
                    setUser(null);
                }
            } else {
                // No valid auth state, ensure everything is cleared
                if (!token || !currentUser) {
                    apiService.clearAuth();
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            // Don't set error state for initialization failures
            apiService.clearAuth();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password, recaptchaToken) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login(email, password, recaptchaToken);
            setUser(response.user);

            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        try {
            setLoading(true);
            setError('');

            const response = await authService.register(userData);

            // Don't login automatically - user needs to verify email first
            return response;

        } catch (error) {
            const errorMessage = error.message || 'Signup failed. Please try again.';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async (credentialResponse) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.googleLogin(credentialResponse);
            setUser(response.user);

            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const facebookLogin = async (facebookResponse) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.facebookLogin(facebookResponse);
            setUser(response.user);

            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const linkedinLogin = async (linkedinResponse) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.linkedinLogin(linkedinResponse);
            setUser(response.user);

            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            setError(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Clear state even if logout fails
            setUser(null);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            setError(null);

            const updatedUser = await authService.updateProfile(profileData);
            setUser(updatedUser);

            return updatedUser;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        // State
        user,
        loading,
        error,

        // Computed values
        isAuthenticated: !!user,
        isAdmin: user?.is_admin || false,

        // Methods
        login,
        signup,
        googleLogin,
        facebookLogin,
        linkedinLogin,
        logout,
        updateProfile,
        clearError,
        refreshAuth: initializeAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};