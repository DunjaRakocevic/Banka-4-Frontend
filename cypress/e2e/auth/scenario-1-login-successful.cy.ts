import { visitEmployeeLogin, fillLoginForm, submitLogin, assertTokenStored } from '../../support/authHelpers';

describe('Feature 1 - Autentifikacija korisnika', () => {
    it('Scenario 1: Uspešno logovanje zaposlenog', () => {
        if (Cypress.env('USE_STUBS')) {
            cy.intercept('POST', '**/api/auth/login', {
                statusCode: 200,
                body: {
                    token: 'fake-access',
                    refresh_token: 'fake-refresh',
                    user: { identity_type: 'employee', permissions: [] },
                },
            }).as('login');
        }

        visitEmployeeLogin();
        fillLoginForm('admin@raf.rs', 'admin123');
        submitLogin();

        if (Cypress.env('USE_STUBS')) cy.wait('@login');

        cy.url().should('include', '/admin');
        assertTokenStored();
    });
});