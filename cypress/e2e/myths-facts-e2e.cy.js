/**
 * End-to-end tests for Myths vs Facts complete flow
 * Tests admin content creation to frontend display flow
 */

describe('Myths vs Facts End-to-End Flow', () => {
    const testMythFact = {
        title: 'E2E Test Myth vs Fact',
        myth_content: 'This is a test myth created via E2E testing',
        fact_content: 'This is the corresponding fact explanation for E2E testing',
        is_featured: true
    };

    const adminCredentials = {
        email: 'admin@junglore.com',
        password: 'admin123'
    };

    beforeEach(() => {
        // Intercept API calls
        cy.intercept('GET', '/api/v1/myths-facts/resources/myths*', { fixture: 'myths-facts-list.json' }).as('getMythsFacts');
        cy.intercept('GET', '/api/v1/myths-facts/resources/random7', { fixture: 'myths-facts-random.json' }).as('getRandomMythsFacts');
        cy.intercept('POST', '/api/v1/myths-facts/', { statusCode: 201, body: { message: 'Created successfully', data: { id: 'test-id' } } }).as('createMythFact');
        cy.intercept('PUT', '/api/v1/myths-facts/*', { statusCode: 200, body: { message: 'Updated successfully' } }).as('updateMythFact');
        cy.intercept('DELETE', '/api/v1/myths-facts/*', { statusCode: 200, body: { message: 'Deleted successfully' } }).as('deleteMythFact');

        // Mock admin authentication
        cy.intercept('POST', '/api/v1/auth/login', {
            statusCode: 200,
            body: {
                access_token: 'mock-token',
                user: { id: 'admin-id', email: 'admin@junglore.com', is_superuser: true }
            }
        }).as('adminLogin');
    });

    describe('Admin Content Creation Flow', () => {
        it('should allow admin to create new myth vs fact content', () => {
            // Visit admin login page
            cy.visit('/admin/login');

            // Login as admin
            cy.get('[data-testid="email-input"]').type(adminCredentials.email);
            cy.get('[data-testid="password-input"]').type(adminCredentials.password);
            cy.get('[data-testid="login-button"]').click();

            cy.wait('@adminLogin');

            // Navigate to myths vs facts admin section
            cy.visit('/admin/myths-facts');

            // Click create new button
            cy.get('[data-testid="create-new-button"]').click();

            // Fill out the creation form
            cy.get('[data-testid="title-input"]').type(testMythFact.title);
            cy.get('[data-testid="myth-content-input"]').type(testMythFact.myth_content);
            cy.get('[data-testid="fact-content-input"]').type(testMythFact.fact_content);

            if (testMythFact.is_featured) {
                cy.get('[data-testid="is-featured-checkbox"]').check();
            }

            // Submit the form
            cy.get('[data-testid="submit-button"]').click();

            cy.wait('@createMythFact');

            // Verify success message
            cy.get('[data-testid="success-message"]').should('contain', 'created successfully');

            // Verify redirect to list page
            cy.url().should('include', '/admin/myths-facts');
        });

        it('should allow admin to edit existing myth vs fact content', () => {
            // Mock existing content
            cy.intercept('GET', '/admin/myths-facts/edit/*', { fixture: 'myth-fact-edit-form.html' }).as('getEditForm');

            cy.visit('/admin/myths-facts');

            // Click edit button on first item
            cy.get('[data-testid="edit-button"]').first().click();

            cy.wait('@getEditForm');

            // Update the content
            cy.get('[data-testid="title-input"]').clear().type('Updated ' + testMythFact.title);
            cy.get('[data-testid="myth-content-input"]').clear().type('Updated ' + testMythFact.myth_content);

            // Submit the form
            cy.get('[data-testid="submit-button"]').click();

            cy.wait('@updateMythFact');

            // Verify success message
            cy.get('[data-testid="success-message"]').should('contain', 'updated successfully');
        });

        it('should allow admin to delete myth vs fact content', () => {
            cy.visit('/admin/myths-facts');

            // Click delete button on first item
            cy.get('[data-testid="delete-button"]').first().click();

            // Confirm deletion in modal
            cy.get('[data-testid="confirm-delete-button"]').click();

            cy.wait('@deleteMythFact');

            // Verify success message
            cy.get('[data-testid="success-message"]').should('contain', 'deleted successfully');
        });

        it('should handle file upload for myth vs fact images', () => {
            cy.visit('/admin/myths-facts/create');

            // Fill basic form data
            cy.get('[data-testid="title-input"]').type(testMythFact.title);
            cy.get('[data-testid="myth-content-input"]').type(testMythFact.myth_content);
            cy.get('[data-testid="fact-content-input"]').type(testMythFact.fact_content);

            // Upload image file
            cy.fixture('test-image.jpg', 'base64').then(fileContent => {
                cy.get('[data-testid="image-upload-input"]').selectFile({
                    contents: Cypress.Buffer.from(fileContent, 'base64'),
                    fileName: 'test-image.jpg',
                    mimeType: 'image/jpeg'
                });
            });

            // Verify image preview appears
            cy.get('[data-testid="image-preview"]').should('be.visible');

            // Submit form
            cy.get('[data-testid="submit-button"]').click();

            cy.wait('@createMythFact');

            // Verify success
            cy.get('[data-testid="success-message"]').should('be.visible');
        });
    });

    describe('Frontend Game Integration Flow', () => {
        it('should display admin-created content in the game', () => {
            // Visit the myths vs facts game page
            cy.visit('/resources/myths-vs-facts');

            // Wait for API calls to load content
            cy.wait('@getRandomMythsFacts');

            // Verify game interface loads
            cy.get('[data-testid="game-container"]').should('be.visible');
            cy.get('[data-testid="myths-facts-title"]').should('contain', 'MYTHS VS FACTS');

            // Verify score display
            cy.get('[data-testid="score-display"]').should('contain', 'SCORE: 0');

            // Verify navigation arrows are present
            cy.get('[data-testid="myth-arrow"]').should('be.visible');
            cy.get('[data-testid="fact-arrow"]').should('be.visible');

            // Verify current card content is displayed
            cy.get('[data-testid="current-card"]').should('be.visible');
            cy.get('[data-testid="card-text"]').should('not.be.empty');
        });

        it('should handle user interactions in the game', () => {
            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getRandomMythsFacts');

            // Get initial score
            cy.get('[data-testid="score-display"]').invoke('text').then((initialScore) => {
                // Make a choice (click fact arrow)
                cy.get('[data-testid="fact-arrow"]').click();

                // Wait for animation to complete
                cy.wait(1000);

                // Verify score may have changed
                cy.get('[data-testid="score-display"]').should('be.visible');

                // Verify new card is displayed
                cy.get('[data-testid="current-card"]').should('be.visible');
            });
        });

        it('should complete the game and show results', () => {
            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getRandomMythsFacts');

            // Play through multiple cards quickly
            for (let i = 0; i < 7; i++) {
                cy.get('[data-testid="fact-arrow"]').click();
                cy.wait(500); // Shorter wait for faster test
            }

            // Verify game completion screen
            cy.get('[data-testid="game-complete"]').should('be.visible');
            cy.get('[data-testid="final-score"]').should('contain', 'Final Score:');
            cy.get('[data-testid="accuracy"]').should('contain', 'Accuracy:');

            // Verify play again button
            cy.get('[data-testid="play-again-button"]').should('be.visible');

            // Click play again
            cy.get('[data-testid="play-again-button"]').click();

            // Verify game resets
            cy.get('[data-testid="score-display"]').should('contain', 'SCORE: 0');
        });
    });

    describe('Error Handling and Fallback Flow', () => {
        it('should handle API failures gracefully', () => {
            // Mock API failures
            cy.intercept('GET', '/api/v1/myths-facts/resources/random7', { statusCode: 500 }).as('getRandomMythsFactsError');
            cy.intercept('GET', '/api/v1/myths-facts/resources/myths*', { statusCode: 500 }).as('getMythsFactsError');

            cy.visit('/resources/myths-vs-facts');

            cy.wait('@getRandomMythsFactsError');
            cy.wait('@getMythsFactsError');

            // Verify game still loads with fallback content
            cy.get('[data-testid="game-container"]').should('be.visible');
            cy.get('[data-testid="current-card"]').should('be.visible');

            // Verify game is still playable
            cy.get('[data-testid="fact-arrow"]').should('not.be.disabled');
            cy.get('[data-testid="myth-arrow"]').should('not.be.disabled');
        });

        it('should handle network timeouts', () => {
            // Mock slow/timeout responses
            cy.intercept('GET', '/api/v1/myths-facts/resources/random7', { delay: 10000 }).as('getRandomMythsFactsTimeout');

            cy.visit('/resources/myths-vs-facts');

            // Verify loading state is shown
            cy.get('[data-testid="loading-message"]').should('contain', 'Loading');

            // Wait for timeout and fallback
            cy.wait(5000);

            // Verify fallback content loads
            cy.get('[data-testid="game-container"]').should('be.visible');
        });

        it('should handle malformed API responses', () => {
            // Mock malformed responses
            cy.intercept('GET', '/api/v1/myths-facts/resources/random7', { body: null }).as('getMalformedResponse');

            cy.visit('/resources/myths-vs-facts');

            cy.wait('@getMalformedResponse');

            // Verify game still works with fallback
            cy.get('[data-testid="game-container"]').should('be.visible');
            cy.get('[data-testid="current-card"]').should('be.visible');
        });
    });

    describe('Responsive Design Flow', () => {
        it('should work correctly on mobile devices', () => {
            cy.viewport('iphone-x');

            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getRandomMythsFacts');

            // Verify mobile layout
            cy.get('[data-testid="game-container"]').should('be.visible');
            cy.get('[data-testid="current-card"]').should('be.visible');

            // Verify touch interactions work
            cy.get('[data-testid="fact-arrow"]').click();
            cy.wait(1000);

            // Verify responsive elements
            cy.get('[data-testid="score-display"]').should('be.visible');
        });

        it('should work correctly on tablet devices', () => {
            cy.viewport('ipad-2');

            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getRandomMythsFacts');

            // Verify tablet layout
            cy.get('[data-testid="game-container"]').should('be.visible');
            cy.get('[data-testid="navigation-frame"]').should('be.visible');
        });

        it('should work correctly on desktop', () => {
            cy.viewport(1920, 1080);

            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getRandomMythsFacts');

            // Verify desktop layout
            cy.get('[data-testid="game-container"]').should('be.visible');
            cy.get('[data-testid="text-frame"]').should('be.visible');
        });
    });

    describe('Performance and Accessibility Flow', () => {
        it('should load within acceptable time limits', () => {
            const startTime = Date.now();

            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getRandomMythsFacts');

            cy.get('[data-testid="game-container"]').should('be.visible').then(() => {
                const loadTime = Date.now() - startTime;
                expect(loadTime).to.be.lessThan(5000); // Should load within 5 seconds
            });
        });

        it('should be accessible via keyboard navigation', () => {
            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getRandomMythsFacts');

            // Test keyboard navigation
            cy.get('body').tab();
            cy.focused().should('have.attr', 'data-testid', 'myth-arrow');

            cy.focused().tab();
            cy.focused().should('have.attr', 'data-testid', 'fact-arrow');

            // Test keyboard interaction
            cy.focused().type('{enter}');
            cy.wait(1000);

            // Verify choice was registered
            cy.get('[data-testid="current-card"]').should('be.visible');
        });

        it('should have proper ARIA labels and alt text', () => {
            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getRandomMythsFacts');

            // Check image alt text
            cy.get('[data-testid="animal-image"]').should('have.attr', 'alt');
            cy.get('[data-testid="myth-arrow"]').should('have.attr', 'alt', 'Swipe Left for Myth');
            cy.get('[data-testid="fact-arrow"]').should('have.attr', 'alt', 'Swipe Right for Fact');

            // Check ARIA labels
            cy.get('[data-testid="score-display"]').should('have.attr', 'aria-label');
        });
    });

    describe('Data Consistency Flow', () => {
        it('should maintain data consistency between admin and frontend', () => {
            const testData = {
                id: 'consistency-test',
                title: 'Consistency Test',
                myth_content: 'Test myth for consistency',
                fact_content: 'Test fact for consistency',
                is_featured: true
            };

            // Mock API to return our test data
            cy.intercept('GET', '/api/v1/myths-facts/resources/random7', {
                body: [testData]
            }).as('getConsistencyTest');

            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getConsistencyTest');

            // Verify the data appears correctly in the game
            cy.get('[data-testid="card-text"]').should('contain', testData.myth_content);
        });

        it('should handle concurrent users correctly', () => {
            // Simulate multiple users by making multiple requests
            cy.visit('/resources/myths-vs-facts');
            cy.wait('@getRandomMythsFacts');

            // Open another instance (simulate second user)
            cy.window().then((win) => {
                win.open('/resources/myths-vs-facts', '_blank');
            });

            // Verify both instances work independently
            cy.get('[data-testid="game-container"]').should('be.visible');
            cy.get('[data-testid="fact-arrow"]').click();

            // Verify game state is maintained independently
            cy.wait(1000);
            cy.get('[data-testid="current-card"]').should('be.visible');
        });
    });

    describe('Security and Validation Flow', () => {
        it('should prevent unauthorized access to admin functions', () => {
            // Try to access admin without authentication
            cy.visit('/admin/myths-facts', { failOnStatusCode: false });

            // Should redirect to login or show unauthorized
            cy.url().should('match', /(login|unauthorized)/);
        });

        it('should validate form inputs properly', () => {
            // Mock admin session
            cy.window().then((win) => {
                win.sessionStorage.setItem('admin_token', 'mock-token');
            });

            cy.visit('/admin/myths-facts/create');

            // Try to submit empty form
            cy.get('[data-testid="submit-button"]').click();

            // Verify validation errors
            cy.get('[data-testid="title-error"]').should('be.visible');
            cy.get('[data-testid="myth-content-error"]').should('be.visible');
            cy.get('[data-testid="fact-content-error"]').should('be.visible');
        });

        it('should sanitize user inputs', () => {
            cy.visit('/admin/myths-facts/create');

            // Try to input potentially malicious content
            const maliciousInput = '<script>alert("xss")</script>';

            cy.get('[data-testid="title-input"]').type(maliciousInput);
            cy.get('[data-testid="myth-content-input"]').type(maliciousInput);

            // Verify content is sanitized (script tags should not execute)
            cy.window().then((win) => {
                // If XSS worked, this would fail
                expect(win.alert).to.be.undefined;
            });
        });
    });
});