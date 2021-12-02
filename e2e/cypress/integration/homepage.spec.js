describe('Homepage', () => {
    it('should load successfully',  ()=> {
        cy.visit('/');
    });
    it('should contain right spells',  ()=> {
        cy.contains('Users');
        cy.contains('Admin');
        cy.get('mat-select').click();
        cy.contains('Register');
    })
})
