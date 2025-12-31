/**
 * Authentication Service
 * Handles user authentication, registration, and profile management
 */

import apiService from './api.js';

class AuthService {
    constructor() {
        this.currentUser = null;
    }

    // Login user
    async login(email, password, recaptchaToken) {
        try {
            const response = await apiService.post('/auth/login', {
                email,
                password,
                recaptchaToken: recaptchaToken
            });

            if (response.access_token) {
                apiService.setToken(response.access_token);

                // Store refresh token if provided
                if (response.refresh_token) {
                    localStorage.setItem('refresh_token', response.refresh_token);
                }

                // Store user data
                this.currentUser = response.user;
                localStorage.setItem('user', JSON.stringify(response.user));

                return response;
            }

            throw new Error('Invalid login response');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Register new user
    async register(userData) {
        try {
            const response = await apiService.post('/auth/signup', userData);
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Google OAuth login
    async googleLogin(credentialResponse) {
        try {
            const response = await apiService.post('/auth/google', {
                credential: credentialResponse
            });

            if (response.access_token) {
                apiService.setToken(response.access_token);

                // Store refresh token if provided
                if (response.refresh_token) {
                    localStorage.setItem('refresh_token', response.refresh_token);
                }

                // Store user data
                this.currentUser = response.user;
                localStorage.setItem('user', JSON.stringify(response.user));

                return response;
            }

            throw new Error('Invalid Google login response');
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    }

    // Facebook OAuth login
    async facebookLogin(facebookResponse) {
        try {
            const response = await apiService.post('/auth/facebook', {
                accessToken: facebookResponse.accessToken,
                userID: facebookResponse.userID,
                name: facebookResponse.name,
                email: facebookResponse.email,
                picture: facebookResponse.picture?.data?.url
            });

            if (response.access_token) {
                apiService.setToken(response.access_token);

                // Store refresh token if provided
                if (response.refresh_token) {
                    localStorage.setItem('refresh_token', response.refresh_token);
                }

                // Store user data
                this.currentUser = response.user;
                localStorage.setItem('user', JSON.stringify(response.user));

                return response;
            }

            throw new Error('Invalid Facebook login response');
        } catch (error) {
            console.error('Facebook login error:', error);
            throw error;
        }
    }

    // LinkedIn OAuth login
    async linkedinLogin(linkedinResponse) {
        try {
            const response = await apiService.post('/auth/linkedin', {
                code: linkedinResponse.code
            });

            if (response.access_token) {
                apiService.setToken(response.access_token);

                // Store refresh token if provided
                if (response.refresh_token) {
                    localStorage.setItem('refresh_token', response.refresh_token);
                }

                // Store user data
                this.currentUser = response.user;
                localStorage.setItem('user', JSON.stringify(response.user));

                return response;
            }

            throw new Error('Invalid LinkedIn login response');
        } catch (error) {
            console.error('LinkedIn login error:', error);
            throw error;
        }
    }


    // Logout user
    async logout() {
        try {
            // Call logout endpoint if available
            await apiService.post('/auth/logout').catch(() => {
                // Ignore logout endpoint errors
            });
        } finally {
            // Clear local state regardless of API call result
            apiService.clearAuth();
            this.currentUser = null;
        }
    }

    // Get current user
    getCurrentUser() {
        if (this.currentUser) {
            return this.currentUser;
        }

        // Try to get from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                return this.currentUser;
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
            }
        }

        return null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = apiService.getToken();
        const user = this.getCurrentUser();
        return !!(token && user);
    }

    // Get user profile
    async getProfile() {
        try {
            const response = await apiService.get('/auth/profile');

            // Update stored user data
            this.currentUser = response.user || response;
            localStorage.setItem('user', JSON.stringify(this.currentUser));

            return this.currentUser;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }

    // Update user profile
    async updateProfile(profileData) {
        try {
            const response = await apiService.put('/auth/profile', profileData);

            // Update stored user data
            this.currentUser = response.user || response;
            localStorage.setItem('user', JSON.stringify(this.currentUser));

            return this.currentUser;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }

    // Refresh access token
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await apiService.post('/auth/refresh', {
                refresh_token: refreshToken
            });

            if (response.access_token) {
                apiService.setToken(response.access_token);

                // Update refresh token if provided
                if (response.refresh_token) {
                    localStorage.setItem('refresh_token', response.refresh_token);
                }

                return response;
            }

            throw new Error('Invalid refresh response');
        } catch (error) {
            console.error('Token refresh error:', error);
            // Clear auth on refresh failure
            this.logout();
            throw error;
        }
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await apiService.post('/auth/change-password', {
                current_password: currentPassword,
                new_password: newPassword
            });

            return response;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    }

    // Request password reset
    async requestPasswordReset(email) {
        try {
            const response = await apiService.post('/auth/forgot-password', {
                email
            });

            return response;
        } catch (error) {
            console.error('Password reset request error:', error);
            throw error;
        }
    }

    // Reset password with token
    async resetPassword(token, newPassword) {
        try {
            const response = await apiService.post('/auth/reset-password', {
                token,
                new_password: newPassword
            });

            return response;
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }

    // Verify email with OTP
    async verifyEmailOTP(email, otp) {
        try {
            const response = await apiService.post('/auth/verify-email', {
                email,
                otp
            });

            return response;
        } catch (error) {
            console.error('Email OTP verification error:', error);
            throw error;
        }
    }

    // Verify password reset OTP
    async verifyResetOTP(email, otp) {
        try {
            const response = await apiService.post('/auth/verify-reset-otp', {
                email,
                otp
            });

            return response;
        } catch (error) {
            console.error('Reset OTP verification error:', error);
            throw error;
        }
    }

    // Reset password with OTP
    async resetPasswordWithOTP(email, otp, newPassword) {
        try {
            const response = await apiService.post('/auth/reset-password', {
                email,
                otp,
                new_password: newPassword
            });

            return response;
        } catch (error) {
            console.error('Password reset with OTP error:', error);
            throw error;
        }
    }

    // Verify email (legacy token-based - keeping for backward compatibility)
    async verifyEmail(token) {
        try {
            const response = await apiService.post('/auth/verify-email', {
                token
            });

            return response;
        } catch (error) {
            console.error('Email verification error:', error);
            throw error;
        }
    }

    // Resend verification email
    async resendVerification(email) {
        try {
            const response = await apiService.post('/auth/resend-verification', {
                email
            });

            return response;
        } catch (error) {
            console.error('Resend verification error:', error);
            throw error;
        }
    }
}

// Create singleton instance
const authService = new AuthService();
export default authService;
