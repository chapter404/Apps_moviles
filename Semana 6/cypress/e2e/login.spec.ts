describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('Muestra la pagina de iniciar sesión', () => {
      cy.contains('Iniciar Sesión');
      cy.get('ion-input[name="email"]').should('be.visible');
      cy.get('ion-input[name="password"]').should('be.visible');
    });
  
    it('Valida los campos de entrada', () => {
      cy.get('ion-button[type="submit"]').click();
      cy.get('ion-input[name="email"]').then(($input) => {
        expect(($input[0] as HTMLInputElement).checkValidity()).to.be.false;
      });
      cy.get('ion-input[name="password"]').then(($input) => {
        expect(($input[0] as HTMLInputElement).checkValidity()).to.be.false;
      });
    });
  
    it('Se ingresa correctamente al utilizar las credenciales', () => {
      cy.get('ion-input[name="email"]').type('prueba@prueba.cl');
      cy.get('ion-input[name="password"]').type('prueba12345');
      cy.get('ion-button[type="submit"]').click();
      cy.url().should('include', '/tabs');
    });
  
    it('Muestra un mensaje de error al ocupar credenciales invalidas', () => {
      cy.get('ion-input[name="email"]').type('invalid@correo.cl');
      cy.get('ion-input[name="password"]').type('invalidpassword');
      cy.get('ion-button[type="submit"]').click();
      cy.contains('Correo o contraseña incorrectos.').should('be.visible');
    });
  
    it('Redirecciona a la pagina de registro', () => {
      cy.contains('Registrarse').click();
      cy.url().should('include', '/sign-up');
    });
  });