describe('Authentication E2E Tests', () => {
    describe('Login Flow', () => {
        beforeEach(() => {
            cy.visit('/login')
        })

        it('should display login form', () => {
            cy.get('[data-cy=login-form]').should('be.visible')
            cy.get('[data-cy=email-input]').should('be.visible')
            cy.get('[data-cy=password-input]').should('be.visible')
            cy.get('[data-cy=login-button]').should('be.visible')
        })

        it('should validate required fields', () => {
            cy.testFormValidation('[data-cy=login-form]', ['email', 'password'])
        })

        it('should validate email format', () => {
            cy.get('[data-cy=email-input]').type('invalid-email')
            cy.get('[data-cy=password-input]').type('password123')
            cy.get('[data-cy=login-button]').click()
            cy.get('[data-cy=email-error]').should('contain', 'valid email')
        })

        it('should handle successful login', () => {
            cy.intercept('POST', '**/api/v1/auth/login', {
                statusCode: 200,
                body: {
                    access_token: 'test-token',
                    refresh_token: 'refresh-token',
                    token_type: 'bearer',
                    user: {
                        id: '1',
                        email: 'test@example.com',
                        full_name: 'Test User',
                        username: 'testuser'
                    }
                }
            }).as('loginSuccess')

            cy.get('[data-cy=email-input]').type('test@example.com')
            cy.get('[data-cy=password-input]').type('password123')
            cy.get('[data-cy=login-button]').click()

            cy.wait('@loginSuccess')
            cy.url().should('not.include', '/login')
            cy.window().its('localStorage.access_token').should('exist')
        })

        it('should handle login errors', () => {
            cy.intercept('POST', '**/api/v1/auth/login', {
                statusCode: 401,
                body: { detail: 'Invalid credentials' }
            }).as('loginError')

            cy.get('[data-cy=email-input]').type('test@example.com')
            cy.get('[data-cy=password-input]').type('wrongpassword')
            cy.get('[data-cy=login-button]').click()

            cy.wait('@loginError')
            cy.get('[data-cy=error-message]').should('contain', 'Invalid credentials')
        })

        it('should show loading state during login', () => {
            cy.intercept('POST', '**/api/v1/auth/login', (req) => {
                req.reply((res) => {
                    res.delay(2000)
                    res.send({
                        statusCode: 200,
                        body: { access_token: 'test-token' }
                    })
                })
            }).as('slowLogin')

            cy.get('[data-cy=email-input]').type('test@example.com')
            cy.get('[data-cy=password-input]').type('password123')
            cy.get('[data-cy=login-button]').click()

            cy.get('[data-cy=login-button]').should('be.disabled')
            cy.get('[data-cy=loading-spinner]').should('be.visible')
        })

        it('should redirect to intended page after login', () => {
            cy.visit('/profile')
            cy.url().should('include', '/login')

            // Perform login
            cy.intercept('POST', '**/api/v1/auth/login', {
                statusCode: 200,
                body: { access_token: 'test-token', user: {} }
            }).as('loginRedirect')

            cy.get('[data-cy=email-input]').type('test@example.com')
            cy.get('[data-cy=password-input]').type('password123')
            cy.get('[data-cy=login-button]').click()

            cy.wait('@loginRedirect')
            cy.url().should('include', '/profile')
        })
    })

    describe('Signup Flow', () => {
        beforeEach(() => {
            cy.visit('/signup')
        })

        it('should display signup form', () => {
            cy.get('[data-cy=signup-form]').should('be.visible')
            cy.get('[data-cy=email-input]').should('be.visible')
            cy.get('[data-cy=password-input]').should('be.visible')
            cy.get('[data-cy=confirm-password-input]').should('be.visible')
            cy.get('[data-cy=full-name-input]').should('be.visible')
            cy.get('[data-cy=signup-button]').should('be.visible')
        })

        it('should validate required fields', () => {
            cy.testFormValidation('[data-cy=signup-form]', [
                'email', 'password', 'confirm-password', 'full-name'
            ])
        })

        it('should validate password confirmation', () => {
            cy.get('[data-cy=password-input]').type('password123')
            cy.get('[data-cy=confirm-password-input]').type('different123')
            cy.get('[data-cy=signup-button]').click()
            cy.get('[data-cy=confirm-password-error]').should('contain', 'match')
        })

        it('should handle successful signup', () => {
            cy.intercept('POST', '**/api/v1/auth/signup', {
                statusCode: 200,
                body: {
                    id: '1',
                    email: 'newuser@example.com',
                    full_name: 'New User',
                    username: 'newuser'
                }
            }).as('signupSuccess')

            cy.get('[data-cy=email-input]').type('newuser@example.com')
            cy.get('[data-cy=password-input]').type('password123')
            cy.get('[data-cy=confirm-password-input]').type('password123')
            cy.get('[data-cy=full-name-input]').type('New User')
            cy.get('[data-cy=username-input]').type('newuser')
            cy.get('[data-cy=signup-button]').click()

            cy.wait('@signupSuccess')
            cy.get('[data-cy=success-message]').should('be.visible')
        })

        it('should handle signup errors', () => {
            cy.intercept('POST', '**/api/v1/auth/signup', {
                statusCode: 400,
                body: { detail: 'Email already registered' }
            }).as('signupError')

            cy.get('[data-cy=email-input]').type('existing@example.com')
            cy.get('[data-cy=password-input]').type('password123')
            cy.get('[data-cy=confirm-password-input]').type('password123')
            cy.get('[data-cy=full-name-input]').type('Existing User')
            cy.get('[data-cy=signup-button]').click()

            cy.wait('@signupError')
            cy.get('[data-cy=error-message]').should('contain', 'Email already registered')
        })
    })

    describe('Authenticated User Experience', () => {
        beforeEach(() => {
            cy.authenticateAPI('test-token')
            cy.visit('/')
        })

        it('should display user information in header', () => {
            cy.get('[data-cy=user-info]').should('be.visible')
            cy.get('[data-cy=user-avatar]').should('be.visible')
            cy.get('[data-cy=logout-button]').should('be.visible')
        })

        it('should handle logout', () => {
            cy.get('[data-cy=logout-button]').click()
            cy.window().its('localStorage.access_token').should('not.exist')
            cy.get('[data-cy=login-button]').should('be.visible')
        })

        it('should access protected routes', () => {
            cy.visit('/profile')
            cy.get('[data-cy=profile-page]').should('be.visible')
        })

        it('should handle token expiration', () => {
            cy.intercept('GET', '**/api/v1/**', {
                statusCode: 401,
                body: { detail: 'Token expired' }
            }).as('tokenExpired')

            cy.visit('/profile')
            cy.wait('@tokenExpired')
            cy.url().should('include', '/login')
        })
    })

    describe('Protected Routes', () => {
        it('should redirect unauthenticated users to login', () => {
            cy.visit('/profile')
            cy.url().should('include', '/login')
        })

        it('should allow access to public routes', () => {
            cy.visit('/')
            cy.get('body').should('be.visible')

            cy.visit('/resources')
            cy.get('body').should('be.visible')
        })

        it('should handle admin routes', () => {
            cy.authenticateAPI('admin-token')
            cy.visit('/admin')
            cy.get('[data-cy=admin-panel]').should('be.visible')
        })
    })

    describe('Session Management', () => {
        it('should persist login across page refreshes', () => {
            cy.login()
            cy.visit('/')
            cy.reload()
            cy.get('[data-cy=user-info]').should('be.visible')
        })

        it('should handle multiple tabs', () => {
            cy.login()
            cy.window().then((win) => {
                win.open('/', '_blank')
            })
            // In a real test, you'd switch to the new tab and verify auth state
        })

        it('should clear session on logout', () => {
            cy.login()
            cy.logout()
            cy.window().its('localStorage.access_token').should('not.exist')
            cy.window().its('localStorage.refresh_token').should('not.exist')
        })
    })

    describe('Password Reset Flow', () => {
        beforeEach(() => {
            cy.visit('/forgot-password')
        })

        it('should display password reset form', () => {
            cy.get('[data-cy=forgot-password-form]').should('be.visible')
            cy.get('[data-cy=email-input]').should('be.visible')
            cy.get('[data-cy=reset-button]').should('be.visible')
        })

        it('should handle password reset request', () => {
            cy.intercept('POST', '**/api/v1/auth/forgot-password', {
                statusCode: 200,
                body: { message: 'Reset email sent' }
            }).as('resetRequest')

            cy.get('[data-cy=email-input]').type('test@example.com')
            cy.get('[data-cy=reset-button]').click()

            cy.wait('@resetRequest')
            cy.get('[data-cy=success-message]').should('contain', 'Reset email sent')
        })
    })

    describe('Authentication Security', () => {
        it('should handle CSRF protection', () => {
            cy.intercept('POST', '**/api/v1/auth/login', {
                statusCode: 403,
                body: { detail: 'CSRF token missing' }
            }).as('csrfError')

            cy.visit('/login')
            cy.get('[data-cy=email-input]').type('test@example.com')
            cy.get('[data-cy=password-input]').type('password123')
            cy.get('[data-cy=login-button]').click()

            cy.wait('@csrfError')
            cy.get('[data-cy=error-message]').should('be.visible')
        })

        it('should handle rate limiting', () => {
            cy.intercept('POST', '**/api/v1/auth/login', {
                statusCode: 429,
                body: { detail: 'Too many attempts' }
            }).as('rateLimited')

            cy.visit('/login')
            cy.get('[data-cy=email-input]').type('test@example.com')
            cy.get('[data-cy=password-input]').type('wrongpassword')

            // Simulate multiple failed attempts
            for (let i = 0; i < 5; i++) {
                cy.get('[data-cy=login-button]').click()
            }

            cy.wait('@rateLimited')
            cy.get('[data-cy=error-message]').should('contain', 'Too many attempts')
        })

        it('should not expose sensitive information in errors', () => {
            cy.intercept('POST', '**/api/v1/auth/login', {
                statusCode: 401,
                body: { detail: 'Invalid credentials' }
            }).as('loginError')

            cy.visit('/login')
            cy.get('[data-cy=email-input]').type('nonexistent@example.com')
            cy.get('[data-cy=password-input]').type('password123')
            cy.get('[data-cy=login-button]').click()

            cy.wait('@loginError')
            cy.get('[data-cy=error-message]').should('not.contain', 'user not found')
            cy.get('[data-cy=error-message]').should('contain', 'Invalid credentials')
        })
    })

    describe('Authentication Accessibility', () => {
        it('should have accessible login form', () => {
            cy.visit('/login')
            cy.checkA11y('[data-cy=login-form]')
        })

        it('should support keyboard navigation', () => {
            cy.visit('/login')
            cy.get('[data-cy=email-input]').tab()
            cy.focused().should('have.attr', 'data-cy', 'password-input')
        })

        it('should have proper ARIA labels', () => {
            cy.visit('/login')
            cy.get('[data-cy=email-input]').should('have.attr', 'aria-label')
            cy.get('[data-cy=password-input]').should('have.attr', 'aria-label')
        })

        it('should announce errors to screen readers', () => {
            cy.visit('/login')
            cy.get('[data-cy=login-button]').click()
            cy.get('[data-cy=email-error]').should('have.attr', 'role', 'alert')
        })
    })
})