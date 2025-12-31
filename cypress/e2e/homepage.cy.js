describe('Homepage E2E Tests', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    describe('Page Load and Basic Elements', () => {
        it('should load the homepage successfully', () => {
            cy.get('body').should('be.visible')
            cy.title().should('not.be.empty')
        })

        it('should display the header with navigation', () => {
            cy.get('[data-cy=header]').should('be.visible')
            cy.get('[data-cy=logo]').should('be.visible')
            cy.get('[data-cy=nav-resources]').should('contain', 'RESOURCES')
            cy.get('[data-cy=nav-media]').should('contain', 'MEDIA')
            cy.get('[data-cy=nav-community]').should('contain', 'COMMUNITY')
            cy.get('[data-cy=nav-about]').should('contain', 'ABOUT US')
        })

        it('should display search functionality', () => {
            cy.get('[data-cy=search-input]').should('be.visible')
            cy.get('[data-cy=search-input]').should('have.attr', 'placeholder', 'Search')
        })

        it('should display authentication elements', () => {
            cy.get('[data-cy=login-button]').should('be.visible')
            cy.get('[data-cy=login-button]').should('contain', 'Login')
        })
    })

    describe('Navigation', () => {
        it('should navigate to resources page', () => {
            cy.navigateToSection('resources')
            cy.url().should('include', '/resources')
        })

        it('should navigate to media page', () => {
            cy.navigateToSection('media')
            cy.url().should('include', '/media')
        })

        it('should navigate to community page', () => {
            cy.navigateToSection('community')
            cy.url().should('include', '/community')
        })

        it('should navigate to about page', () => {
            cy.navigateToSection('about')
            cy.url().should('include', '/about')
        })

        it('should return to homepage when logo is clicked', () => {
            cy.navigateToSection('resources')
            cy.get('[data-cy=logo]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })
    })

    describe('Search Functionality', () => {
        it('should perform search and navigate to results', () => {
            cy.searchFor('wildlife conservation')
            cy.url().should('include', '/search?q=wildlife%20conservation')
        })

        it('should handle empty search gracefully', () => {
            cy.get('[data-cy=search-input]').type('{enter}')
            cy.url().should('not.include', '/search')
        })

        it('should handle special characters in search', () => {
            cy.searchFor('wildlife & conservation!')
            cy.url().should('include', '/search')
        })
    })

    describe('Responsive Design', () => {
        it('should display properly on desktop', () => {
            cy.viewport(1280, 720)
            cy.get('[data-cy=header]').should('be.visible')
            cy.get('[data-cy=nav-resources]').should('be.visible')
        })

        it('should display mobile menu on small screens', () => {
            cy.testMobileMenu()
        })

        it('should adapt search bar for mobile', () => {
            cy.viewport(375, 667)
            cy.get('[data-cy=search-input]').should('be.visible')
        })
    })

    describe('Performance', () => {
        it('should load within acceptable time', () => {
            cy.measurePageLoad()
        })

        it('should not have console errors', () => {
            cy.visit('/', {
                onBeforeLoad(win) {
                    cy.stub(win.console, 'error').as('consoleError')
                }
            })
            cy.get('@consoleError').should('not.have.been.called')
        })
    })

    describe('Accessibility', () => {
        it('should have proper accessibility attributes', () => {
            cy.checkA11y()
        })

        it('should support keyboard navigation', () => {
            cy.get('body').tab()
            cy.focused().should('be.visible')
        })

        it('should have proper heading hierarchy', () => {
            cy.get('h1').should('have.length.at.most', 1)
        })
    })

    describe('Error Handling', () => {
        it('should handle API errors gracefully', () => {
            cy.intercept('GET', '**/api/v1/**', {
                statusCode: 500,
                body: { error: 'Server error' }
            }).as('apiError')

            cy.reload()
            cy.wait('@apiError')

            // Page should still load even with API errors
            cy.get('body').should('be.visible')
        })

        it('should handle network errors', () => {
            cy.intercept('GET', '**/api/v1/**', { forceNetworkError: true }).as('networkError')

            cy.reload()

            // Page should handle network errors gracefully
            cy.get('body').should('be.visible')
        })
    })

    describe('SEO and Meta Tags', () => {
        it('should have proper meta tags', () => {
            cy.get('head title').should('not.be.empty')
            cy.get('head meta[name="description"]').should('exist')
            cy.get('head meta[name="viewport"]').should('exist')
        })

        it('should have proper Open Graph tags', () => {
            cy.get('head meta[property="og:title"]').should('exist')
            cy.get('head meta[property="og:description"]').should('exist')
        })
    })
})