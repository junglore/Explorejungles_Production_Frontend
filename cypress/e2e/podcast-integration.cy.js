/**
 * End-to-end integration tests for Podcast functionality
 * Tests complete flow from admin creation to frontend display and playback
 */

describe('Podcast Integration End-to-End Flow', () => {
    const testPodcast = {
        title: 'E2E Test Wildlife Podcast',
        description: 'This is a comprehensive test podcast created via E2E testing to verify the complete podcast workflow from admin creation to frontend playback.',
        photographer: 'E2E Test Host',
        national_park: 'E2E Test Show',
        duration: 1800, // 30 minutes
        file_size: 25000000 // 25MB
    };

    const adminCredentials = {
        email: 'admin@junglore.com',
        password: 'admin123'
    };

    beforeEach(() => {
        // Intercept podcast API calls
        cy.intercept('GET', '/api/v1/media/?media_type=PODCAST*', { fixture: 'podcasts-list.json' }).as('getPodcasts');
        cy.intercept('GET', '/api/v1/media/*/podcast-*', { fixture: 'podcast-detail.json' }).as('getPodcastDetail');
        cy.intercept('POST', '/admin/podcasts/create', { statusCode: 302, headers: { location: '/admin/podcasts/list?upload_success=true' } }).as('createPodcast');
        cy.intercept('POST', '/admin/podcasts/edit/*', { statusCode: 302, headers: { location: '/admin/podcasts/list?update_success=true' } }).as('updatePodcast');
        cy.intercept('DELETE', '/admin/podcasts/delete/*', { statusCode: 302, headers: { location: '/admin/podcasts/list?delete_success=true' } }).as('deletePodcast');

        // Mock admin authentication
        cy.intercept('POST', '/admin/login', {
            statusCode: 302,
            headers: { location: '/admin/podcasts' }
        }).as('adminLogin');

        // Mock file upload
        cy.intercept('POST', '/api/v1/media/upload', {
            statusCode: 200,
            body: {
                upload_success: true,
                file_url: 'audio/test-podcast.mp3',
                file_size: 25000000,
                filename: 'test-podcast.mp3',
                category: 'audio'
            }
        }).as('uploadAudio');
    });

    describe('Admin Podcast Creation Flow', () => {
        it('should allow admin to create new podcast with audio file', () => {
            // Visit admin login page
            cy.visit('/admin/login');

            // Login as admin
            cy.get('input[name="email"]').type(adminCredentials.email);
            cy.get('input[name="password"]').type(adminCredentials.password);
            cy.get('button[type="submit"]').click();

            cy.wait('@adminLogin');

            // Navigate to podcast creation
            cy.visit('/admin/podcasts/create');

            // Fill out the creation form
            cy.get('input[name="title"]').type(testPodcast.title);
            cy.get('textarea[name="description"]').type(testPodcast.description);
            cy.get('input[name="photographer"]').type(testPodcast.photographer);
            cy.get('input[name="national_park"]').type(testPodcast.national_park);

            // Upload audio file
            cy.fixture('test-audio.mp3', 'base64').then(fileContent => {
                cy.get('input[name="audio_file"]').selectFile({
                    contents: Cypress.Buffer.from(fileContent, 'base64'),
                    fileName: 'test-audio.mp3',
                    mimeType: 'audio/mpeg'
                });
            });

            // Verify audio preview appears
            cy.get('#audio-preview').should('be.visible');

            // Upload cover image (optional)
            cy.fixture('test-podcast-cover.jpg', 'base64').then(fileContent => {
                cy.get('input[name="cover_image"]').selectFile({
                    contents: Cypress.Buffer.from(fileContent, 'base64'),
                    fileName: 'test-podcast-cover.jpg',
                    mimeType: 'image/jpeg'
                });
            });

            // Verify image preview appears
            cy.get('#image-preview').should('be.visible');

            // Submit the form
            cy.get('button[type="submit"]').click();

            cy.wait('@createPodcast');

            // Verify redirect to list page with success message
            cy.url().should('include', '/admin/podcasts/list');
            cy.url().should('include', 'upload_success=true');
        });

        it('should validate required fields in podcast creation', () => {
            cy.visit('/admin/podcasts/create');

            // Try to submit without required fields
            cy.get('button[type="submit"]').click();

            // Verify validation errors
            cy.get('#title-error').should('contain', 'required');
            cy.get('#audio-file-error').should('contain', 'required');
        });

        it('should validate audio file types', () => {
            cy.visit('/admin/podcasts/create');

            // Fill required text fields
            cy.get('input[name="title"]').type(testPodcast.title);

            // Try to upload invalid file type
            cy.fixture('test-image.jpg', 'base64').then(fileContent => {
                cy.get('input[name="audio_file"]').selectFile({
                    contents: Cypress.Buffer.from(fileContent, 'base64'),
                    fileName: 'not-audio.jpg',
                    mimeType: 'image/jpeg'
                });
            });

            cy.get('button[type="submit"]').click();

            // Verify file type validation error
            cy.get('#audio-file-error').should('contain', 'Invalid audio file type');
        });

        it('should handle large file uploads with progress indication', () => {
            cy.visit('/admin/podcasts/create');

            cy.get('input[name="title"]').type(testPodcast.title);

            // Mock large file upload with progress
            cy.intercept('POST', '/api/v1/media/upload', (req) => {
                // Simulate upload progress
                req.reply((res) => {
                    res.setDelay(2000); // 2 second delay to simulate large file
                    res.send({
                        statusCode: 200,
                        body: {
                            upload_success: true,
                            file_url: 'audio/large-podcast.mp3',
                            file_size: 100000000 // 100MB
                        }
                    });
                });
            }).as('uploadLargeAudio');

            // Upload large audio file
            cy.fixture('large-audio.mp3', 'base64').then(fileContent => {
                cy.get('input[name="audio_file"]').selectFile({
                    contents: Cypress.Buffer.from(fileContent, 'base64'),
                    fileName: 'large-audio.mp3',
                    mimeType: 'audio/mpeg'
                });
            });

            // Verify upload progress indicator
            cy.get('.upload-progress').should('be.visible');

            cy.get('button[type="submit"]').click();

            cy.wait('@uploadLargeAudio');

            // Verify successful upload
            cy.get('#audio-preview').should('contain', 'large-podcast.mp3');
        });
    });

    describe('Admin Podcast Management Flow', () => {
        it('should display podcast dashboard with statistics', () => {
            cy.visit('/admin/podcasts/');

            // Verify dashboard elements
            cy.get('#totalPodcasts').should('contain', '3');
            cy.get('#totalSize').should('contain', '71.5 MB');
            cy.get('#lastUpload').should('contain', '2024-01-15');

            // Verify action buttons
            cy.get('a[href="/admin/podcasts/create"]').should('be.visible');
            cy.get('a[href="/admin/podcasts/list"]').should('be.visible');
        });

        it('should list all podcasts with management options', () => {
            cy.visit('/admin/podcasts/list');

            // Verify podcast list table
            cy.get('.podcast-list-table').should('be.visible');
            cy.get('.podcast-row').should('have.length.greaterThan', 0);

            // Verify each row has management buttons
            cy.get('.podcast-row').first().within(() => {
                cy.get('.edit-button').should('be.visible');
                cy.get('.delete-button').should('be.visible');
                cy.get('.preview-button').should('be.visible');
            });
        });

        it('should allow editing existing podcasts', () => {
            cy.visit('/admin/podcasts/list');

            // Click edit on first podcast
            cy.get('.edit-button').first().click();

            // Verify edit form loads with existing data
            cy.get('input[name="title"]').should('have.value');
            cy.get('textarea[name="description"]').should('have.value');

            // Update the podcast
            cy.get('input[name="title"]').clear().type('Updated ' + testPodcast.title);
            cy.get('textarea[name="description"]').clear().type('Updated ' + testPodcast.description);

            // Submit update
            cy.get('button[type="submit"]').click();

            cy.wait('@updatePodcast');

            // Verify redirect with success message
            cy.url().should('include', 'update_success=true');
        });

        it('should allow deleting podcasts with confirmation', () => {
            cy.visit('/admin/podcasts/list');

            // Click delete on first podcast
            cy.get('.delete-button').first().click();

            // Verify confirmation modal appears
            cy.get('.delete-confirmation-modal').should('be.visible');
            cy.get('.confirm-delete-button').should('be.visible');
            cy.get('.cancel-delete-button').should('be.visible');

            // Confirm deletion
            cy.get('.confirm-delete-button').click();

            cy.wait('@deletePodcast');

            // Verify redirect with success message
            cy.url().should('include', 'delete_success=true');
        });

        it('should support podcast search and filtering', () => {
            cy.visit('/admin/podcasts/list');

            // Test search functionality
            cy.get('input[name="search"]').type('Wildlife');
            cy.get('.search-button').click();

            // Verify filtered results
            cy.get('.podcast-row').each(($row) => {
                cy.wrap($row).should('contain', 'Wildlife');
            });

            // Test category filter
            cy.get('select[name="category_filter"]').select('Wildlife');
            cy.get('.filter-button').click();

            // Verify category filtered results
            cy.get('.podcast-row').should('have.length.greaterThan', 0);
        });

        it('should handle pagination for large podcast lists', () => {
            cy.visit('/admin/podcasts/list?page=1&limit=5');

            // Verify pagination controls
            cy.get('.pagination-controls').should('be.visible');
            cy.get('.page-number').should('contain', '1');

            // Test next page
            cy.get('.next-page-button').click();

            // Verify page change
            cy.url().should('include', 'page=2');
            cy.get('.page-number').should('contain', '2');
        });
    });

    describe('Frontend Podcast Carousel Flow', () => {
        it('should display podcast carousel on media page', () => {
            cy.visit('/media');

            cy.wait('@getPodcasts');

            // Verify carousel container
            cy.get('[role="region"][aria-label="Podcast carousel"]').should('be.visible');

            // Verify podcast cards are displayed
            cy.get('.podcast-card').should('have.length.greaterThan', 0);

            // Verify navigation arrows
            cy.get('.carousel-nav-prev').should('be.visible');
            cy.get('.carousel-nav-next').should('be.visible');

            // Verify current track info
            cy.get('.current-track-title').should('be.visible');
            cy.get('.current-track-subtitle').should('be.visible');
        });

        it('should navigate through podcast carousel', () => {
            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Get initial podcast title
            cy.get('.current-track-title').invoke('text').then((initialTitle) => {
                // Click next arrow
                cy.get('.carousel-nav-next').click();

                // Wait for animation
                cy.wait(1000);

                // Verify title changed
                cy.get('.current-track-title').should('not.contain', initialTitle);
            });

            // Test previous navigation
            cy.get('.carousel-nav-prev').click();
            cy.wait(1000);

            // Test dot navigation
            cy.get('.carousel-dots .dot').eq(2).click();
            cy.wait(1000);

            // Verify third podcast is active
            cy.get('.carousel-dots .dot').eq(2).should('have.class', 'active');
        });

        it('should auto-rotate through podcasts', () => {
            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Get initial podcast
            cy.get('.current-track-title').invoke('text').then((initialTitle) => {
                // Wait for auto-rotation (4 seconds)
                cy.wait(4500);

                // Verify podcast changed
                cy.get('.current-track-title').should('not.contain', initialTitle);
            });
        });

        it('should handle keyboard navigation in carousel', () => {
            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Focus on first podcast card
            cy.get('.podcast-card').first().focus();

            // Test arrow key navigation
            cy.focused().type('{rightarrow}');
            cy.wait(500);

            // Verify navigation occurred
            cy.get('.current-track-title').should('be.visible');

            // Test Enter key to select
            cy.focused().type('{enter}');

            // Should navigate to podcast detail page
            cy.url().should('include', '/podcast/');
        });

        it('should display fallback content when API fails', () => {
            // Mock API failure
            cy.intercept('GET', '/api/v1/media/?media_type=PODCAST*', { statusCode: 500 }).as('getPodcastsError');

            cy.visit('/media');
            cy.wait('@getPodcastsError');

            // Verify error state with fallback content
            cy.get('.carousel-error-state').should('be.visible');
            cy.get('.retry-button').should('be.visible');
            cy.get('.show-sample-content-button').should('be.visible');

            // Test retry functionality
            cy.intercept('GET', '/api/v1/media/?media_type=PODCAST*', { fixture: 'podcasts-list.json' }).as('getPodcastsRetry');
            cy.get('.retry-button').click();

            cy.wait('@getPodcastsRetry');

            // Verify carousel loads successfully
            cy.get('.podcast-card').should('be.visible');
        });

        it('should show sample content when requested', () => {
            // Mock API failure
            cy.intercept('GET', '/api/v1/media/?media_type=PODCAST*', { statusCode: 500 }).as('getPodcastsError');

            cy.visit('/media');
            cy.wait('@getPodcastsError');

            // Click show sample content
            cy.get('.show-sample-content-button').click();

            // Verify sample content loads
            cy.get('.fallback-indicator').should('contain', 'Showing sample content');
            cy.get('.podcast-card').should('have.length', 3);
            cy.get('.current-track-title').should('contain', 'WILDLIFE STORIES');
        });
    });

    describe('Frontend Podcast Detail Page Flow', () => {
        it('should navigate to podcast detail page from carousel', () => {
            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Click on first podcast card
            cy.get('.podcast-card').first().click();

            cy.wait('@getPodcastDetail');

            // Verify navigation to detail page
            cy.url().should('match', /\/podcast\/[a-f0-9-]+$/);

            // Verify detail page elements
            cy.get('.podcast-title').should('be.visible');
            cy.get('.podcast-cover').should('be.visible');
            cy.get('.audio-player').should('be.visible');
            cy.get('.podcast-description').should('be.visible');
        });

        it('should display complete podcast metadata', () => {
            cy.visit('/podcast/test-podcast-id');
            cy.wait('@getPodcastDetail');

            // Verify metadata display
            cy.get('.podcast-title').should('contain', testPodcast.title);
            cy.get('.podcast-host').should('contain', testPodcast.photographer);
            cy.get('.podcast-show').should('contain', testPodcast.national_park);
            cy.get('.podcast-duration').should('contain', '30:00');
            cy.get('.podcast-date').should('be.visible');

            // Verify additional metadata section
            cy.get('.additional-metadata').should('be.visible');
            cy.get('.metadata-grid').should('be.visible');
            cy.get('.episode-details').should('be.visible');
        });

        it('should handle audio player functionality', () => {
            cy.visit('/podcast/test-podcast-id');
            cy.wait('@getPodcastDetail');

            // Verify audio player elements
            cy.get('.audio-player').should('be.visible');
            cy.get('.play-button').should('be.visible');
            cy.get('.progress-bar').should('be.visible');
            cy.get('.volume-controls').should('be.visible');
            cy.get('.time-display').should('be.visible');

            // Test play button
            cy.get('.play-button').click();

            // Verify play state changes
            cy.get('.pause-button').should('be.visible');
            cy.get('.play-button').should('not.exist');

            // Test pause button
            cy.get('.pause-button').click();

            // Verify pause state
            cy.get('.play-button').should('be.visible');
            cy.get('.pause-button').should('not.exist');
        });

        it('should handle audio player controls', () => {
            cy.visit('/podcast/test-podcast-id');
            cy.wait('@getPodcastDetail');

            // Test volume control
            cy.get('.volume-slider').invoke('val', 0.5).trigger('input');

            // Test mute button
            cy.get('.mute-button').click();
            cy.get('.volume-muted-icon').should('be.visible');

            // Test unmute
            cy.get('.mute-button').click();
            cy.get('.volume-icon').should('be.visible');

            // Test progress bar seeking
            cy.get('.progress-bar').click('center');

            // Verify time updates
            cy.get('.current-time').should('not.contain', '0:00');
        });

        it('should handle audio loading states and errors', () => {
            // Mock audio loading
            cy.intercept('GET', '/uploads/audio/test-podcast.mp3', { delay: 2000 }).as('loadAudio');

            cy.visit('/podcast/test-podcast-id');
            cy.wait('@getPodcastDetail');

            // Click play to start loading
            cy.get('.play-button').click();

            // Verify loading state
            cy.get('.audio-loading').should('be.visible');
            cy.get('.loading-spinner').should('be.visible');

            cy.wait('@loadAudio');

            // Verify loading state clears
            cy.get('.audio-loading').should('not.exist');

            // Test audio error
            cy.intercept('GET', '/uploads/audio/test-podcast.mp3', { statusCode: 404 }).as('audioError');

            cy.reload();
            cy.wait('@getPodcastDetail');

            cy.get('.play-button').click();

            // Verify error state
            cy.get('.audio-error').should('be.visible');
            cy.get('.retry-audio-button').should('be.visible');
        });

        it('should provide back navigation', () => {
            cy.visit('/podcast/test-podcast-id');
            cy.wait('@getPodcastDetail');

            // Test back button
            cy.get('.back-button').should('contain', '← Back to Media');
            cy.get('.back-button').click();

            // Verify navigation back to media page
            cy.url().should('eq', Cypress.config().baseUrl + '/media');
        });

        it('should handle missing podcast gracefully', () => {
            // Mock 404 response
            cy.intercept('GET', '/api/v1/media/nonexistent-podcast', { statusCode: 404 }).as('getPodcastNotFound');

            cy.visit('/podcast/nonexistent-podcast');
            cy.wait('@getPodcastNotFound');

            // Verify error state
            cy.get('.error-state').should('be.visible');
            cy.get('.error-icon').should('contain', '🎧');
            cy.get('.error-message').should('contain', 'Podcast not found');
            cy.get('.back-button').should('be.visible');
        });
    });

    describe('Responsive Design Integration Flow', () => {
        it('should work correctly on mobile devices', () => {
            cy.viewport('iphone-x');

            // Test carousel on mobile
            cy.visit('/media');
            cy.wait('@getPodcasts');

            cy.get('.podcast-carousel').should('be.visible');
            cy.get('.podcast-card').should('be.visible');

            // Test touch navigation
            cy.get('.podcast-card').first().click();
            cy.wait('@getPodcastDetail');

            // Test detail page on mobile
            cy.get('.podcast-title').should('be.visible');
            cy.get('.audio-player').should('be.visible');

            // Volume controls should be hidden on mobile
            cy.get('.volume-controls').should('not.be.visible');
        });

        it('should work correctly on tablet devices', () => {
            cy.viewport('ipad-2');

            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Test tablet layout
            cy.get('.podcast-carousel').should('be.visible');
            cy.get('.carousel-nav-prev').should('be.visible');
            cy.get('.carousel-nav-next').should('be.visible');

            // Navigate to detail page
            cy.get('.podcast-card').first().click();
            cy.wait('@getPodcastDetail');

            // Test tablet detail layout
            cy.get('.podcast-cover').should('be.visible');
            cy.get('.audio-player').should('be.visible');
            cy.get('.volume-controls').should('be.visible');
        });

        it('should work correctly on desktop', () => {
            cy.viewport(1920, 1080);

            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Test desktop layout
            cy.get('.podcast-carousel').should('be.visible');
            cy.get('.audio-visualization').should('be.visible');
            cy.get('.waveform-bars').should('be.visible');

            // Navigate to detail page
            cy.get('.podcast-card').first().click();
            cy.wait('@getPodcastDetail');

            // Test desktop detail layout
            cy.get('.podcast-metadata').should('be.visible');
            cy.get('.additional-metadata').should('be.visible');
            cy.get('.volume-controls').should('be.visible');
        });
    });

    describe('Performance and Accessibility Integration', () => {
        it('should load podcast carousel within acceptable time', () => {
            const startTime = Date.now();

            cy.visit('/media');
            cy.wait('@getPodcasts');

            cy.get('.podcast-carousel').should('be.visible').then(() => {
                const loadTime = Date.now() - startTime;
                expect(loadTime).to.be.lessThan(3000); // Should load within 3 seconds
            });
        });

        it('should load podcast detail page within acceptable time', () => {
            const startTime = Date.now();

            cy.visit('/podcast/test-podcast-id');
            cy.wait('@getPodcastDetail');

            cy.get('.audio-player').should('be.visible').then(() => {
                const loadTime = Date.now() - startTime;
                expect(loadTime).to.be.lessThan(2000); // Should load within 2 seconds
            });
        });

        it('should be accessible via keyboard navigation', () => {
            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Test carousel keyboard navigation
            cy.get('body').tab();
            cy.focused().should('have.class', 'podcast-card');

            // Navigate with arrow keys
            cy.focused().type('{rightarrow}');
            cy.wait(500);

            // Test Enter key
            cy.focused().type('{enter}');
            cy.wait('@getPodcastDetail');

            // Test detail page keyboard navigation
            cy.get('body').tab();
            cy.focused().should('have.class', 'back-button');

            cy.get('body').tab();
            cy.focused().should('have.class', 'play-button');
        });

        it('should have proper ARIA labels and semantic HTML', () => {
            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Check carousel accessibility
            cy.get('[role="region"][aria-label="Podcast carousel"]').should('exist');
            cy.get('.podcast-card').should('have.attr', 'alt');

            // Navigate to detail page
            cy.get('.podcast-card').first().click();
            cy.wait('@getPodcastDetail');

            // Check detail page accessibility
            cy.get('.podcast-cover img').should('have.attr', 'alt');
            cy.get('.play-button').should('have.attr', 'title');
            cy.get('.volume-slider').should('have.attr', 'title');
        });

        it('should support screen readers', () => {
            cy.visit('/podcast/test-podcast-id');
            cy.wait('@getPodcastDetail');

            // Check for screen reader content
            cy.get('[aria-live="polite"]').should('exist');
            cy.get('.sr-only').should('exist');

            // Test audio player announcements
            cy.get('.play-button').click();

            // Verify state announcements
            cy.get('[aria-live="polite"]').should('contain', 'Playing');
        });
    });

    describe('Error Recovery and Resilience Flow', () => {
        it('should recover from network interruptions', () => {
            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Simulate network failure
            cy.intercept('GET', '/api/v1/media/*', { forceNetworkError: true }).as('networkError');

            // Try to navigate to detail page
            cy.get('.podcast-card').first().click();

            // Verify error handling
            cy.get('.network-error').should('be.visible');
            cy.get('.retry-button').should('be.visible');

            // Restore network and retry
            cy.intercept('GET', '/api/v1/media/*', { fixture: 'podcast-detail.json' }).as('networkRestored');
            cy.get('.retry-button').click();

            cy.wait('@networkRestored');

            // Verify recovery
            cy.get('.podcast-title').should('be.visible');
        });

        it('should handle concurrent user interactions', () => {
            cy.visit('/media');
            cy.wait('@getPodcasts');

            // Simulate rapid user interactions
            cy.get('.carousel-nav-next').click();
            cy.get('.carousel-nav-next').click();
            cy.get('.carousel-nav-prev').click();

            // Verify carousel handles rapid clicks gracefully
            cy.get('.podcast-carousel').should('be.visible');
            cy.get('.current-track-title').should('be.visible');
        });

        it('should maintain state during page refresh', () => {
            cy.visit('/podcast/test-podcast-id');
            cy.wait('@getPodcastDetail');

            // Start playing audio
            cy.get('.play-button').click();

            // Refresh page
            cy.reload();
            cy.wait('@getPodcastDetail');

            // Verify page loads correctly after refresh
            cy.get('.podcast-title').should('be.visible');
            cy.get('.audio-player').should('be.visible');
            cy.get('.play-button').should('be.visible'); // Should reset to paused state
        });
    });

    describe('Data Consistency and Security Flow', () => {
        it('should maintain data consistency between admin and frontend', () => {
            const consistencyTestData = {
                id: 'consistency-test-podcast',
                title: 'Consistency Test Podcast',
                description: 'Test podcast for data consistency verification',
                photographer: 'Consistency Host',
                national_park: 'Consistency Show'
            };

            // Mock API to return our test data
            cy.intercept('GET', '/api/v1/media/?media_type=PODCAST*', {
                body: [consistencyTestData]
            }).as('getConsistencyTest');

            cy.visit('/media');
            cy.wait('@getConsistencyTest');

            // Verify data appears correctly in carousel
            cy.get('.current-track-title').should('contain', consistencyTestData.title.toUpperCase());

            // Mock detail API
            cy.intercept('GET', `/api/v1/media/${consistencyTestData.id}`, {
                body: consistencyTestData
            }).as('getConsistencyDetail');

            // Navigate to detail page
            cy.get('.podcast-card').first().click();
            cy.wait('@getConsistencyDetail');

            // Verify data consistency in detail page
            cy.get('.podcast-title').should('contain', consistencyTestData.title);
            cy.get('.podcast-host').should('contain', consistencyTestData.photographer);
            cy.get('.podcast-show').should('contain', consistencyTestData.national_park);
        });

        it('should prevent unauthorized access to admin functions', () => {
            // Try to access admin without authentication
            cy.visit('/admin/podcasts', { failOnStatusCode: false });

            // Should redirect to login
            cy.url().should('include', '/admin/login');
        });

        it('should validate file uploads properly', () => {
            cy.visit('/admin/podcasts/create');

            // Try to upload non-audio file as audio
            cy.fixture('test-image.jpg', 'base64').then(fileContent => {
                cy.get('input[name="audio_file"]').selectFile({
                    contents: Cypress.Buffer.from(fileContent, 'base64'),
                    fileName: 'fake-audio.mp3',
                    mimeType: 'audio/mpeg' // Fake MIME type
                });
            });

            cy.get('input[name="title"]').type('Test Podcast');
            cy.get('button[type="submit"]').click();

            // Should show validation error
            cy.get('.error-message').should('contain', 'Invalid audio file');
        });

        it('should sanitize user inputs', () => {
            cy.visit('/admin/podcasts/create');

            // Try to input potentially malicious content
            const maliciousInput = '<script>alert("xss")</script>';

            cy.get('input[name="title"]').type(maliciousInput);
            cy.get('textarea[name="description"]').type(maliciousInput);

            // Verify content is sanitized (script tags should not execute)
            cy.window().then((win) => {
                // If XSS worked, this would fail
                expect(win.alert).to.be.undefined;
            });
        });
    });
});