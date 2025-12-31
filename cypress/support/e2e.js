// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log to reduce noise
Cypress.on('window:before:load', (win) => {
    // Stub console methods to reduce noise in tests
    cy.stub(win.console, 'log')
    cy.stub(win.console, 'warn')
    cy.stub(win.console, 'error')
})

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    // on uncaught exceptions. We can be more selective about which
    // errors we want to ignore.

    // Ignore specific errors that are expected or not critical
    if (
        err.message.includes('ResizeObserver loop limit exceeded') ||
        err.message.includes('Non-Error promise rejection captured') ||
        err.message.includes('Loading chunk')
    ) {
        return false
    }

    // Let other errors fail the test
    return true
})

// Add custom assertions
chai.use((chai, utils) => {
    chai.Assertion.addMethod('beVisible', function () {
        const obj = this._obj
        this.assert(
            obj.should('be.visible'),
            'expected #{this} to be visible',
            'expected #{this} not to be visible'
        )
    })
})

// Set up global test data
beforeEach(() => {
    // Clear localStorage and sessionStorage before each test
    cy.clearLocalStorage()
    cy.clearCookies()

    // Set up viewport
    cy.viewport(1280, 720)

    // Intercept API calls and provide default responses
    cy.intercept('GET', '**/api/v1/health', { fixture: 'health.json' }).as('healthCheck')
    cy.intercept('GET', '**/api/v1/blogs/**', { fixture: 'blogs.json' }).as('getBlogs')
    cy.intercept('GET', '**/api/v1/casestudies/**', { fixture: 'casestudies.json' }).as('getCaseStudies')
    cy.intercept('GET', '**/api/v1/conservation-efforts/**', { fixture: 'conservation.json' }).as('getConservation')
    cy.intercept('GET', '**/api/v1/dailynews/**', { fixture: 'dailynews.json' }).as('getDailyNews')
})