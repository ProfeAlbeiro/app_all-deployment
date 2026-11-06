// cypress/e2e/system/users.system.cy.js

describe('Nivel 4: Pruebas de Sistema (E2E) - Flujos Completos', () => {
  
  // ST-01: Login exitoso y redirección
  it('ST-01: Debe permitir el login y redirigir al Dashboard', () => {
    cy.visit('/login');
    
    cy.get('input[type="email"]').type('admin@test.com');
    cy.get('input[type="password"]').type('password123'); // 👈 Reemplace con su contraseña
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Bienvenido,').should('be.visible');
  });

  // ST-02: Protección de Rutas
  it('ST-02: Debe redirigir al login si se intenta acceder al Dashboard sin estar autenticado', () => {
    cy.clearLocalStorage();
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  // ST-03: Crear un usuario desde la interfaz gráfica
  it('ST-03: Debe crear un usuario a través del formulario y mostrarlo en la tabla', () => {
    cy.login('admin@test.com', 'password123');
    cy.visit('/dashboard');
    
    cy.contains('button', 'Usuarios').click();
    cy.contains('button', '+ Nuevo Usuario').click();
    
    const emailUnico = `cypress_${Date.now()}@test.com`;
    cy.get('input[name="name"]').type('Usuario Creado por Cypress');
    cy.get('input[name="lastname"]').type('ApellidoTest');
    cy.get('input[name="email"]').type(emailUnico);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    cy.contains('button', 'Crear').click();
    
    cy.contains('Operación completada exitosamente').should('be.visible');
    cy.get('table').should('contain', emailUnico);
  });

  // ST-04: Eliminar un usuario desde la interfaz gráfica
  it('ST-04: Debe eliminar un usuario de la tabla', () => {
    cy.login('admin@test.com', 'password123');
    cy.visit('/dashboard');
    cy.contains('button', 'Usuarios').click();

    const emailAEliminar = `eliminar_${Date.now()}@test.com`;
    cy.request({
      method: 'POST',
      url: 'http://10.1.195.62:3000/api/users/create', // 👈 Asegúrese de usar su IP correcta
      body: { name: "Para Borrar", lastname: "Test", email: emailAEliminar, password: "123" }
    });

    cy.reload();
    cy.contains('button', 'Usuarios').click();

    cy.contains('tr', emailAEliminar).within(() => {
      cy.get('button.btn-delete').click();
    });

    cy.on('window:confirm', () => true);

    cy.contains('Usuario eliminado exitosamente').should('be.visible');
    cy.get('table').should('not.contain', emailAEliminar);
  });

  // ST-05: Validación de UI
  it('ST-05: Debe mostrar un mensaje de error si se intenta hacer login con campos vacíos', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains('Por favor complete todos los campos').should('be.visible');
  });

});