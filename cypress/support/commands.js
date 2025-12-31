// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for login
Cypress.Commands.add('login', (email = 'test@example.com', password = 'testpassword') => {
    cy.session([email, password], () => {
        cy.visit('/login')
        cy.get('[data-cy=email-input]').type(email)
        cy.get('[data-cy=password-input]').type(password)
        cy.get('[data-cy=login-button]').click()
        cy.url().should('not.include', '/login')
        cy.window().its('localStorage.access_token').should('exist')
    })
})

// Custom command for logout
Cypress.Commands.add('logout', () => {
    cy.window().then((win) => {
        win.localStorage.removeItem('access_token')
        win.localStorage.removeItem('refresh_token')
        win.localStorage.removeItem('user')
    })
    cy.visit('/')
})

// Custom command for API authentication
Cypress.Commands.add('authenticateAPI', (token = 'test-token') => {
    cy.window().then((win) => {
        win.localStorage.setItem('access_token', token)
    })
})

// Custom command for waiting for page load
Cypress.Commands.add('waitForPageLoad', () => {
    cy.get('[data-cy=loading]', { timeout: 10000 }).should('not.exist')
    cy.get('body').should('be.visible')
})

// Custom command for checking responsive design
Cypress.Commands.add('checkResponsive', (selector) => {
    // Desktop
    cy.viewport(1280, 720)
    cy.get(selector).should('be.visible')

    // Tablet
    cy.viewport(768, 1024)
    cy.get(selector).should('be.visible')

    // Mobile
    cy.viewport(375, 667)
    cy.get(selector).should('be.visible')
})

// Custom command for testing search functionality
Cypress.Commands.add('searchFor', (query) => {
    cy.get('[data-cy=search-input]').clear().type(query)
    cy.get('[data-cy=search-input]').type('{enter}')
    cy.url().should('include', `/search?q=${encodeURIComponent(query)}`)
})

// Custom command for navigation testing
Cypress.Commands.add('navigateToSection', (section) => {
    cy.get(`[data-cy=nav-${section}]`).click()
    cy.url().should('include', `/${section}`)
    cy.waitForPageLoad()
})

// Custom command for content interaction
Cypress.Commands.add('clickContentItem', (contentType, index = 0) => {
    cy.get(`[data-cy=${contentType}-item]`).eq(index).click()
    cy.waitForPageLoad()
})

// Custom command for form validation testing
Cypress.Commands.add('testFormValidation', (formSelector, requiredFields) => {
    // Try to submit empty form
    cy.get(`${formSelector} [type=submit]`).click()

    // Check that required field errors are shown
    requiredFields.forEach(field => {
        cy.get(`[data-cy=${field}-error]`).should('be.visible')
    })
})

// Custom command for accessibility testing
Cypress.Commands.add('checkA11y', (selector = null) => {
    // Basic accessibility checks
    if (selector) {
        cy.get(selector).should('have.attr', 'role').or('have.attr', 'aria-label')
    }

    // Check for proper heading hierarchy
    cy.get('h1').should('have.length.at.most', 1)

    // Check for alt text on images
    cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt')
    })

    // Check for proper form labels
    cy.get('input, textarea, select').each(($input) => {
        const id = $input.attr('id')
        if (id) {
            cy.get(`label[for="${id}"]`).should('exist')
        }
    })
})

// Custom command for performance testing
Cypress.Commands.add('measurePageLoad', () => {
    cy.window().then((win) => {
        const performance = win.performance
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart

        // Assert that page loads within reasonable time (5 seconds)
        expect(loadTime).to.be.lessThan(5000)
    })
})

// Custom command for error handling testing
Cypress.Commands.add('testErrorHandling', (apiEndpoint, errorStatus = 500) => {
    cy.intercept('GET', apiEndpoint, {
        statusCode: errorStatus,
        body: { error: 'Server error' }
    }).as('apiError')

    cy.reload()
    cy.wait('@apiError')

    // Check that error message is displayed
    cy.get('[data-cy=error-message]').should('be.visible')
})

// Custom command for mobile menu testing
Cypress.Commands.add('testMobileMenu', () => {
    cy.viewport(375, 667)

    // Check that mobile menu button is visible
    cy.get('[data-cy=mobile-menu-button]').should('be.visible')

    // Open mobile menu
    cy.get('[data-cy=mobile-menu-button]').click()
    cy.get('[data-cy=mobile-menu]').should('be.visible')

    // Test navigation items in mobile menu
    cy.get('[data-cy=mobile-menu] [data-cy^=nav-]').should('have.length.at.least', 1)

    // Close mobile menu
    cy.get('[data-cy=mobile-menu-button]').click()
    cy.get('[data-cy=mobile-menu]').should('not.be.visible')
})

// Custom command for content loading testing
Cypress.Commands.add('testContentLoading', (contentType) => {
    cy.visit(`/${contentType}`)

    // Check loading state
    cy.get('[data-cy=loading]').should('be.visible')

    // Wait for content to load
    cy.get(`[data-cy=${contentType}-list]`).should('be.visible')
    cy.get('[data-cy=loading]').should('not.exist')

    // Check that content items are displayed
    cy.get(`[data-cy=${contentType}-item]`).should('have.length.at.least', 1)
})

// Custom command for pagination testing
Cypress.Commands.add('testPagination', () => {
    // Check that pagination controls exist
    cy.get('[data-cy=pagination]').should('be.visible')

    // Test next page
    cy.get('[data-cy=next-page]').click()
    cy.waitForPageLoad()

    // Test previous page
    cy.get('[data-cy=prev-page]').click()
    cy.waitForPageLoad()
})

// Override default commands for better error handling
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
    return originalFn(url, {
        ...options,
        failOnStatusCode: false,
        timeout: 30000
    })
})

Cypress.Commands.overwrite('get', (originalFn, selector, options) => {
    return originalFn(selector, {
        timeout: 10000,
        ...options
    })
})

Cypress.Commands.overwrite('click', (originalFn, subject, options) => {
    return originalFn(subject, {
        timeout: 10000,
        ...options
    })
})