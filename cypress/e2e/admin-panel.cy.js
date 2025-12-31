describe('Admin Panel E2E Tests', () => {
    beforeEach(() => {
        // Mock admin authentication
        cy.intercept('POST', '**/api/v1/auth/login', {
            statusCode: 200,
            body: {
                access_token: 'admin-token',
                refresh_token: 'admin-refresh-token',
                token_type: 'bearer',
                user: {
                    id: '1',
                    email: 'admin@example.com',
                    full_name: 'Admin User',
                    username: 'admin',
                    is_admin: true
                }
            }
        }).as('adminLogin')

        // Mock admin panel data
        cy.intercept('GET', '**/admin/dashboard', {
            statusCode: 200,
            body: {
                stats: {
                    total_users: 150,
                    total_content: 89,
                    total_blogs: 45,
                    total_casestudies: 12,
                    total_conservation: 18,
                    total_dailynews: 14
                },
                recent_activity: []
            }
        }).as('dashboardData')
    })

    describe('Admin Authentication', () => {
        it('should require admin login to access admin panel', () => {
            cy.visit('/admin')
            cy.url().should('include', '/admin/login')
        })

        it('should allow admin login', () => {
            cy.visit('/admin/login')
            cy.get('[data-cy=admin-email-input]').type('admin@example.com')
            cy.get('[data-cy=admin-password-input]').type('adminpassword')
            cy.get('[data-cy=admin-login-button]').click()

            cy.wait('@adminLogin')
            cy.url().should('include', '/admin/dashboard')
        })

        it('should reject non-admin users', () => {
            cy.intercept('POST', '**/api/v1/auth/login', {
                statusCode: 200,
                body: {
                    access_token: 'user-token',
                    user: { is_admin: false }
                }
            }).as('userLogin')

            cy.visit('/admin/login')
            cy.get('[data-cy=admin-email-input]').type('user@example.com')
            cy.get('[data-cy=admin-password-input]').type('userpassword')
            cy.get('[data-cy=admin-login-button]').click()

            cy.wait('@userLogin')
            cy.get('[data-cy=access-denied]').should('be.visible')
        })
    })

    describe('Admin Dashboard', () => {
        beforeEach(() => {
            cy.authenticateAPI('admin-token')
            cy.visit('/admin/dashboard')
        })

        it('should display dashboard statistics', () => {
            cy.wait('@dashboardData')
            cy.get('[data-cy=admin-dashboard]').should('be.visible')
            cy.get('[data-cy=stats-total-users]').should('contain', '150')
            cy.get('[data-cy=stats-total-content]').should('contain', '89')
            cy.get('[data-cy=stats-total-blogs]').should('contain', '45')
        })

        it('should display navigation menu', () => {
            cy.get('[data-cy=admin-nav]').should('be.visible')
            cy.get('[data-cy=nav-dashboard]').should('be.visible')
            cy.get('[data-cy=nav-content]').should('be.visible')
            cy.get('[data-cy=nav-users]').should('be.visible')
            cy.get('[data-cy=nav-settings]').should('be.visible')
        })

        it('should show recent activity', () => {
            cy.get('[data-cy=recent-activity]').should('be.visible')
        })

        it('should have responsive design', () => {
            cy.checkResponsive('[data-cy=admin-dashboard]')
        })
    })

    describe('Content Management', () => {
        beforeEach(() => {
            cy.authenticateAPI('admin-token')
            cy.visit('/admin/content')
        })

        it('should display content management interface', () => {
            cy.get('[data-cy=content-management]').should('be.visible')
            cy.get('[data-cy=content-list]').should('be.visible')
            cy.get('[data-cy=create-content-button]').should('be.visible')
        })

        it('should create new blog post', () => {
            cy.intercept('POST', '**/admin/content/blogs', {
                statusCode: 200,
                body: {
                    id: 'new-blog-id',
                    title: 'New Blog Post',
                    status: 'published'
                }
            }).as('createBlog')

            cy.get('[data-cy=create-blog-button]').click()
            cy.get('[data-cy=blog-form]').should('be.visible')

            cy.get('[data-cy=blog-title-input]').type('New Blog Post')
            cy.get('[data-cy=blog-content-input]').type('This is the content of the new blog post.')
            cy.get('[data-cy=blog-category-select]').select('Wildlife')
            cy.get('[data-cy=save-blog-button]').click()

            cy.wait('@createBlog')
            cy.get('[data-cy=success-message]').should('contain', 'Blog created successfully')
        })

        it('should edit existing content', () => {
            cy.intercept('PUT', '**/admin/content/blogs/*', {
                statusCode: 200,
                body: { message: 'Blog updated successfully' }
            }).as('updateBlog')

            cy.get('[data-cy=blog-item]').first().within(() => {
                cy.get('[data-cy=edit-button]').click()
            })

            cy.get('[data-cy=blog-form]').should('be.visible')
            cy.get('[data-cy=blog-title-input]').clear().type('Updated Blog Title')
            cy.get('[data-cy=save-blog-button]').click()

            cy.wait('@updateBlog')
            cy.get('[data-cy=success-message]').should('be.visible')
        })

        it('should delete content with confirmation', () => {
            cy.intercept('DELETE', '**/admin/content/blogs/*', {
                statusCode: 200,
                body: { message: 'Blog deleted successfully' }
            }).as('deleteBlog')

            cy.get('[data-cy=blog-item]').first().within(() => {
                cy.get('[data-cy=delete-button]').click()
            })

            cy.get('[data-cy=delete-confirmation]').should('be.visible')
            cy.get('[data-cy=confirm-delete-button]').click()

            cy.wait('@deleteBlog')
            cy.get('[data-cy=success-message]').should('contain', 'deleted successfully')
        })

        it('should handle file uploads', () => {
            cy.get('[data-cy=create-blog-button]').click()

            const fileName = 'test-image.jpg'
            cy.fixture(fileName, 'base64').then(fileContent => {
                cy.get('[data-cy=image-upload]').attachFile({
                    fileContent,
                    fileName,
                    mimeType: 'image/jpeg'
                })
            })

            cy.get('[data-cy=image-preview]').should('be.visible')
        })

        it('should validate form inputs', () => {
            cy.get('[data-cy=create-blog-button]').click()
            cy.get('[data-cy=save-blog-button]').click()

            cy.get('[data-cy=title-error]').should('be.visible')
            cy.get('[data-cy=content-error]').should('be.visible')
        })
    })

    describe('Content Type Management', () => {
        beforeEach(() => {
            cy.authenticateAPI('admin-token')
        })

        it('should manage case studies', () => {
            cy.visit('/admin/content/casestudies')
            cy.get('[data-cy=casestudies-management]').should('be.visible')
            cy.get('[data-cy=create-casestudy-button]').should('be.visible')
        })

        it('should manage conservation efforts', () => {
            cy.visit('/admin/content/conservation')
            cy.get('[data-cy=conservation-management]').should('be.visible')
            cy.get('[data-cy=create-conservation-button]').should('be.visible')
        })

        it('should manage daily updates', () => {
            cy.visit('/admin/content/dailynews')
            cy.get('[data-cy=dailynews-management]').should('be.visible')
            cy.get('[data-cy=create-dailynews-button]').should('be.visible')
        })

        it('should switch between content types', () => {
            cy.visit('/admin/content')
            cy.get('[data-cy=content-type-tabs]').should('be.visible')

            cy.get('[data-cy=tab-blogs]').click()
            cy.get('[data-cy=blogs-list]').should('be.visible')

            cy.get('[data-cy=tab-casestudies]').click()
            cy.get('[data-cy=casestudies-list]').should('be.visible')
        })
    })

    describe('User Management', () => {
        beforeEach(() => {
            cy.authenticateAPI('admin-token')
            cy.visit('/admin/users')
        })

        it('should display user list', () => {
            cy.get('[data-cy=user-management]').should('be.visible')
            cy.get('[data-cy=user-list]').should('be.visible')
        })

        it('should search users', () => {
            cy.get('[data-cy=user-search]').type('john')
            cy.get('[data-cy=search-button]').click()
            cy.get('[data-cy=user-results]').should('be.visible')
        })

        it('should edit user permissions', () => {
            cy.get('[data-cy=user-item]').first().within(() => {
                cy.get('[data-cy=edit-user-button]').click()
            })

            cy.get('[data-cy=user-form]').should('be.visible')
            cy.get('[data-cy=admin-checkbox]').check()
            cy.get('[data-cy=save-user-button]').click()

            cy.get('[data-cy=success-message]').should('be.visible')
        })
    })

    describe('Settings Management', () => {
        beforeEach(() => {
            cy.authenticateAPI('admin-token')
            cy.visit('/admin/settings')
        })

        it('should display settings interface', () => {
            cy.get('[data-cy=settings-panel]').should('be.visible')
            cy.get('[data-cy=general-settings]').should('be.visible')
        })

        it('should update site settings', () => {
            cy.intercept('PUT', '**/admin/settings', {
                statusCode: 200,
                body: { message: 'Settings updated' }
            }).as('updateSettings')

            cy.get('[data-cy=site-title-input]').clear().type('Updated Site Title')
            cy.get('[data-cy=save-settings-button]').click()

            cy.wait('@updateSettings')
            cy.get('[data-cy=success-message]').should('be.visible')
        })
    })

    describe('Admin Panel Security', () => {
        it('should handle session timeout', () => {
            cy.authenticateAPI('admin-token')
            cy.visit('/admin/dashboard')

            cy.intercept('GET', '**/admin/**', {
                statusCode: 401,
                body: { detail: 'Session expired' }
            }).as('sessionExpired')

            cy.get('[data-cy=refresh-button]').click()
            cy.wait('@sessionExpired')
            cy.url().should('include', '/admin/login')
        })

        it('should validate admin permissions for each action', () => {
            cy.authenticateAPI('user-token')
            cy.visit('/admin/content', { failOnStatusCode: false })
            cy.get('[data-cy=access-denied]').should('be.visible')
        })

        it('should log admin actions', () => {
            cy.authenticateAPI('admin-token')
            cy.visit('/admin/content')

            cy.intercept('POST', '**/admin/audit-log', {
                statusCode: 200
            }).as('auditLog')

            cy.get('[data-cy=create-blog-button]').click()
            // Audit logging would be triggered by admin actions
        })
    })

    describe('Admin Panel Performance', () => {
        beforeEach(() => {
            cy.authenticateAPI('admin-token')
        })

        it('should load dashboard efficiently', () => {
            cy.visit('/admin/dashboard')
            cy.measurePageLoad()
        })

        it('should handle large content lists', () => {
            cy.intercept('GET', '**/admin/content/blogs', {
                body: {
                    result: Array.from({ length: 100 }, (_, i) => ({
                        id: i.toString(),
                        title: `Blog ${i + 1}`,
                        status: 'published',
                        created_at: new Date().toISOString()
                    })),
                    total: 100,
                    page: 1,
                    limit: 50
                }
            }).as('largeBlogList')

            cy.visit('/admin/content')
            cy.wait('@largeBlogList')
            cy.get('[data-cy=blog-item]').should('have.length.at.most', 50)
            cy.get('[data-cy=pagination]').should('be.visible')
        })

        it('should implement lazy loading for content', () => {
            cy.visit('/admin/content')
            cy.get('[data-cy=content-list]').scrollTo('bottom')
            cy.get('[data-cy=loading-more]').should('be.visible')
        })
    })

    describe('Admin Panel Accessibility', () => {
        beforeEach(() => {
            cy.authenticateAPI('admin-token')
            cy.visit('/admin/dashboard')
        })

        it('should have accessible navigation', () => {
            cy.checkA11y('[data-cy=admin-nav]')
        })

        it('should support keyboard navigation', () => {
            cy.get('[data-cy=nav-content]').focus()
            cy.focused().type('{enter}')
            cy.url().should('include', '/admin/content')
        })

        it('should have proper ARIA labels', () => {
            cy.get('[data-cy=admin-nav]').should('have.attr', 'role', 'navigation')
            cy.get('[data-cy=content-list]').should('have.attr', 'role', 'list')
        })
    })

    describe('Error Handling', () => {
        beforeEach(() => {
            cy.authenticateAPI('admin-token')
        })

        it('should handle API errors gracefully', () => {
            cy.intercept('GET', '**/admin/dashboard', {
                statusCode: 500,
                body: { error: 'Server error' }
            }).as('dashboardError')

            cy.visit('/admin/dashboard')
            cy.wait('@dashboardError')
            cy.get('[data-cy=error-message]').should('be.visible')
            cy.get('[data-cy=retry-button]').should('be.visible')
        })

        it('should handle network errors', () => {
            cy.intercept('GET', '**/admin/**', { forceNetworkError: true }).as('networkError')

            cy.visit('/admin/dashboard')
            cy.get('[data-cy=network-error]').should('be.visible')
        })

        it('should validate file uploads', () => {
            cy.visit('/admin/content')
            cy.get('[data-cy=create-blog-button]').click()

            // Try to upload invalid file type
            cy.fixture('invalid-file.txt').then(fileContent => {
                cy.get('[data-cy=image-upload]').attachFile({
                    fileContent,
                    fileName: 'invalid-file.txt',
                    mimeType: 'text/plain'
                })
            })

            cy.get('[data-cy=file-error]').should('contain', 'Invalid file type')
        })
    })
})