describe('Users Page', () => {
    it('show users table', () => {
        cy.visit('/');
        cy.get('[routerlink="admin/users"]').click();
        cy.get('.mat-table');
    });

    it('should display right column names', () => {
        cy.contains('Id');
        cy.contains('Name');
        cy.contains('Username');
        cy.contains('Email');
        cy.contains('Role');
    });
    // it('should navigate to next page', () => {

    //     cy.get('[arial-label="Next Page"]').click();
    // });
    it('should filter value input', () => {
        cy.get('[name="filterName"]').type('ram');
        cy.get('.mat-table').find('mat-row').should('have.length', 1);
    });


})
