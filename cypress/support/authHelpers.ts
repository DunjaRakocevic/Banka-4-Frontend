export function visitEmployeeLogin() {
    cy.visit('/login');
    cy.contains('button', 'Zaposleni').click();
}

export function fillLoginForm(email: string, password: string) {
    cy.get('#email').clear().type(email);
    cy.get('#password').clear().type(password, { log: false });
}

export function submitLogin() {
    cy.contains('button', 'Prijavi se').click();
}

export function assertTokenStored() {
    cy.window().then((win) => {
        const token = win.localStorage.getItem('token');
        expect(token, 'localStorage.token').to.be.a('string').and.not.be.empty;
    });
}