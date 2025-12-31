describe('Content Management E2E Tests', () => {
    describe('Resources Page', () => {
        beforeEach(() => {
            cy.visit('/resources')
        })

        it('should load resources page with all content types', () => {
            cy.waitForPageLoad()
            cy.get('[data-cy=resources-page]').should('be.visible')
        })

        it('should display blog content', () => {
            cy.testContentLoading('blogs')
            cy.get('[data-cy=blogs-section]').should('be.visible')
        })

        it('should display case studies', () => {
            cy.testContentLoading('casestudies')
            cy.get('[data-cy=casestudies-section]').should('be.visible')
        })

        it('should display conservation efforts', () => {
            cy.testContentLoading('conservation')
            cy.get('[data-cy=conservation-section]').should('be.visible')
        })

        it('should display daily updates', () => {
            cy.testContentLoading('dailynews')
            cy.get('[data-cy=dailynews-section]').should('be.visible')
        })

        it('should handle content filtering', () => {
            cy.get('[data-cy=content-filter]').select('blogs')
            cy.get('[data-cy=blogs-item]').should('be.visible')
            cy.get('[data-cy=casestudies-item]').should('not.exist')
        })

        it('should support content search', () => {
            cy.get('[data-cy=content-search]').type('conservation')
            cy.get('[data-cy=search-results]').should('be.visible')
        })
    })

    describe('Blog Content Flow', () => {
        beforeEach(() => {
            cy.visit('/resources')
        })

        it('should navigate from blog list to blog detail', () => {
            cy.clickContentItem('blogs', 0)
            cy.url().should('include', '/blog/')
            cy.get('[data-cy=blog-detail]').should('be.visible')
        })

        it('should display blog content properly', () => {
            cy.clickContentItem('blogs', 0)
            cy.get('[data-cy=blog-title]').should('be.visible')
            cy.get('[data-cy=blog-content]').should('be.visible')
            cy.get('[data-cy=blog-author]').should('be.visible')
            cy.get('[data-cy=blog-date]').should('be.visible')
        })

        it('should handle blog sharing', () => {
            cy.clickContentItem('blogs', 0)
            cy.get('[data-cy=share-button]').click()
            cy.get('[data-cy=share-options]').should('be.visible')
        })

        it('should support blog navigation', () => {
            cy.clickContentItem('blogs', 0)
            cy.get('[data-cy=back-to-blogs]').click()
            cy.url().should('include', '/resources')
        })
    })

    describe('Case Studies Flow', () => {
        beforeEach(() => {
            cy.visit('/resources')
        })

        it('should display case study details', () => {
            cy.clickContentItem('casestudies', 0)
            cy.get('[data-cy=casestudy-detail]').should('be.visible')
            cy.get('[data-cy=casestudy-methodology]').should('be.visible')
            cy.get('[data-cy=casestudy-results]').should('be.visible')
        })

        it('should handle case study media', () => {
            cy.clickContentItem('casestudies', 0)
            cy.get('[data-cy=casestudy-images]').should('be.visible')
            cy.get('[data-cy=casestudy-images] img').should('have.attr', 'alt')
        })
    })

    describe('Conservation Efforts Flow', () => {
        beforeEach(() => {
            cy.visit('/resources')
        })

        it('should display conservation effort details', () => {
            cy.clickContentItem('conservation', 0)
            cy.get('[data-cy=conservation-detail]').should('be.visible')
            cy.get('[data-cy=conservation-goals]').should('be.visible')
            cy.get('[data-cy=conservation-progress]').should('be.visible')
        })

        it('should show conservation location', () => {
            cy.clickContentItem('conservation', 0)
            cy.get('[data-cy=conservation-location]').should('be.visible')
        })
    })

    describe('Daily Updates Flow', () => {
        beforeEach(() => {
            cy.visit('/resources')
        })

        it('should display daily update details', () => {
            cy.clickContentItem('dailynews', 0)
            cy.get('[data-cy=dailynews-detail]').should('be.visible')
            cy.get('[data-cy=dailynews-source]').should('be.visible')
        })

        it('should show publication date', () => {
            cy.clickContentItem('dailynews', 0)
            cy.get('[data-cy=publication-date]').should('be.visible')
        })
    })

    describe('Content Pagination', () => {
        beforeEach(() => {
            cy.visit('/resources')
        })

        it('should handle blog pagination', () => {
            cy.get('[data-cy=blogs-section]').within(() => {
                cy.testPagination()
            })
        })

        it('should maintain filters across pages', () => {
            cy.get('[data-cy=content-filter]').select('blogs')
            cy.get('[data-cy=next-page]').click()
            cy.get('[data-cy=content-filter]').should('have.value', 'blogs')
        })
    })

    describe('Content Loading States', () => {
        it('should show loading indicators', () => {
            cy.intercept('GET', '**/api/v1/blogs/**', (req) => {
                req.reply((res) => {
                    res.delay(2000)
                    res.send({ fixture: 'blogs.json' })
                })
            }).as('slowBlogs')

            cy.visit('/resources')
            cy.get('[data-cy=loading]').should('be.visible')
            cy.wait('@slowBlogs')
            cy.get('[data-cy=loading]').should('not.exist')
        })

        it('should handle empty content states', () => {
            cy.intercept('GET', '**/api/v1/blogs/**', {
                body: {
                    status: true,
                    data: { result: [], totalPages: 0, currentPage: 1, limit: 0 }
                }
            }).as('emptyBlogs')

            cy.visit('/resources')
            cy.wait('@emptyBlogs')
            cy.get('[data-cy=empty-state]').should('be.visible')
        })
    })

    describe('Content Error Handling', () => {
        it('should handle content loading errors', () => {
            cy.testErrorHandling('**/api/v1/blogs/**', 500)
        })

        it('should handle network errors', () => {
            cy.intercept('GET', '**/api/v1/blogs/**', { forceNetworkError: true }).as('networkError')

            cy.visit('/resources')
            cy.get('[data-cy=error-message]').should('be.visible')
            cy.get('[data-cy=retry-button]').should('be.visible')
        })

        it('should allow retry after error', () => {
            cy.intercept('GET', '**/api/v1/blogs/**', { statusCode: 500 }).as('firstError')
            cy.intercept('GET', '**/api/v1/blogs/**', { fixture: 'blogs.json' }).as('retrySuccess')

            cy.visit('/resources')
            cy.wait('@firstError')
            cy.get('[data-cy=retry-button]').click()
            cy.wait('@retrySuccess')
            cy.get('[data-cy=blogs-item]').should('be.visible')
        })
    })

    describe('Content Search and Filtering', () => {
        beforeEach(() => {
            cy.visit('/resources')
        })

        it('should filter content by type', () => {
            cy.get('[data-cy=filter-blogs]').click()
            cy.get('[data-cy=blogs-item]').should('be.visible')
            cy.get('[data-cy=casestudies-item]').should('not.exist')
        })

        it('should search across all content types', () => {
            cy.get('[data-cy=content-search]').type('wildlife')
            cy.get('[data-cy=search-button]').click()
            cy.get('[data-cy=search-results]').should('be.visible')
        })

        it('should handle advanced filtering', () => {
            cy.get('[data-cy=advanced-filters]').click()
            cy.get('[data-cy=date-filter]').select('last-month')
            cy.get('[data-cy=category-filter]').select('conservation')
            cy.get('[data-cy=apply-filters]').click()
            cy.get('[data-cy=filtered-results]').should('be.visible')
        })
    })

    describe('Content Accessibility', () => {
        beforeEach(() => {
            cy.visit('/resources')
        })

        it('should have accessible content navigation', () => {
            cy.checkA11y('[data-cy=content-navigation]')
        })

        it('should support keyboard navigation through content', () => {
            cy.get('[data-cy=blogs-item]').first().focus()
            cy.focused().type('{enter}')
            cy.url().should('include', '/blog/')
        })

        it('should have proper ARIA labels for content', () => {
            cy.get('[data-cy=blogs-item]').should('have.attr', 'aria-label')
            cy.get('[data-cy=content-filter]').should('have.attr', 'aria-label')
        })
    })

    describe('Content Performance', () => {
        it('should load content efficiently', () => {
            cy.visit('/resources')
            cy.measurePageLoad()
        })

        it('should handle large content lists', () => {
            // Mock large dataset
            cy.intercept('GET', '**/api/v1/blogs/**', {
                body: {
                    status: true,
                    data: {
                        result: Array.from({ length: 50 }, (_, i) => ({
                            id: i.toString(),
                            title: `Blog Post ${i + 1}`,
                            excerpt: `Excerpt for blog post ${i + 1}`,
                            image: `/test-images/blog-${i + 1}.jpg`,
                            status: true,
                            type: 'blog',
                            createdAt: new Date().toISOString()
                        })),
                        totalPages: 5,
                        currentPage: 1,
                        limit: 50
                    }
                }
            }).as('largeBlogList')

            cy.visit('/resources')
            cy.wait('@largeBlogList')
            cy.get('[data-cy=blogs-item]').should('have.length', 50)
        })
    })
})