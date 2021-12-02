import { PASSWORD, USERNAME } from "./constants";

describe('Test Login Flow', () => {
    it('should login user',  ()=> {
        cy.visit('/login');
        cy.get('[formControlName="email"]').type(USERNAME);
        cy.get('[formControlName="password"]').type(PASSWORD);
        cy.get('[type="submit"]').click();
        cy.url().should('include', 'admin')
    });
  
})
