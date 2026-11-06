// cypress/e2e/acceptance/users.acceptance.cy.js

describe('Nivel 5: Pruebas de Aceptación (UAT) - Criterios del Cliente', () => {
  
  // AT-01: Registro de Cliente Autónomo
  it('AT-01: El cliente debe poder registrarse y ver un mensaje de confirmación', () => {
    cy.visit('/register');
    
    // Generamos datos únicos para el nuevo cliente
    const emailCliente = `cliente_${Date.now()}@test.com`;
    
    // Llenamos el formulario de registro
    cy.get('input[name="name"]').type('Cliente');
    cy.get('input[name="lastname"]').type('Aceptacion');
    cy.get('input[name="email"]').type(emailCliente);
    cy.get('input[name="phone"]').type('3001234567');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    // Por defecto el rol es 'user', así que lo dejamos así
    cy.get('button[type="submit"]').click();
    
    // El sistema debe confirmar el registro (AlertMessage de éxito)
    cy.contains('Usuario registrado exitosamente').should('be.visible');
    
    // Y debe redirigir al login después de 2 segundos (según su código)
    cy.url().should('include', '/login', { timeout: 5000 });
  });

  // AT-02: Restricción de Rol (Vendedor no puede eliminar)
  it('AT-02: Un usuario con rol "Vendedor" no debe ver el botón de eliminar', () => {
    // 1. Creamos un usuario vendedor por API para agilizar el test
    const emailVendedor = `vendedor_${Date.now()}@test.com`;
    cy.request({
      method: 'POST',
      url: 'http://10.1.195.62:3000/api/users/create', // 👈 Asegúrese de usar su IP correcta
      body: { 
        name: "Vendedor", 
        lastname: "Test", 
        email: emailVendedor, 
        password: "password123",
        role: "seller" // 👈 Forzamos el rol de vendedor
      }
    });

    // 2. Hacemos login con ese vendedor
    cy.login(emailVendedor, 'password123');
    cy.visit('/dashboard');
    cy.contains('button', 'Usuarios').click();

    // 3. Buscamos el botón de eliminar en la tabla
    // Debe existir en el DOM, pero estar deshabilitado por la lógica de React (canDelete)
    cy.get('button.btn-delete').first().should('be.disabled');
  });

  // AT-03: Restricción de Rol (Admin no puede auto-eliminarse)
  it('AT-03: Un administrador no debe poder eliminar su propio usuario', () => {
    cy.login('admin@test.com', 'password123');
    cy.visit('/dashboard');
    cy.contains('button', 'Usuarios').click();

    // Buscamos la fila del administrador logueado
    cy.contains('tr', 'admin@test.com').within(() => {
      // Verificamos que el botón de eliminar esté deshabilitado (por la lógica de React)
      cy.get('button.btn-delete').should('be.disabled');
    });
  });

  // AT-04: Persistencia de Datos
  it('AT-04: Los datos creados deben persistir al recargar la página', () => {
    cy.login('admin@test.com', 'password123');
    cy.visit('/dashboard');
    cy.contains('button', 'Usuarios').click();

    // Creamos un usuario rápido
    const emailPersistente = `persistente_${Date.now()}@test.com`;
    cy.request({
      method: 'POST',
      url: 'http://10.1.195.62:3000/api/users/create', // 👈 Asegúrese de usar su IP correcta
      body: { name: "Persistente", lastname: "Test", email: emailPersistente, password: "123" }
    });

    // Recargamos la página fuertemente
    cy.reload();
    cy.contains('button', 'Usuarios').click();

    // El usuario debe seguir en la tabla (porque está en la BD real)
    cy.get('table').should('contain', emailPersistente);
  });

  // AT-05: Cierre de Sesión Seguro
  it('AT-05: El usuario debe poder cerrar sesión y limpiar el almacenamiento local', () => {
    cy.login('admin@test.com', 'password123');
    cy.visit('/dashboard');

    // Hacemos clic en Cerrar Sesión (está en el Header del Dashboard)
    cy.contains('button', 'Cerrar Sesión').click();

    // Verificamos que redirige al login
    cy.url().should('include', '/login');

    // Verificamos que el token y los datos del usuario se borraron
    cy.window().then((win) => {
      expect(win.localStorage.getItem('auth_token')).to.be.null;
      expect(win.localStorage.getItem('user_data')).to.be.null;
    });
  });

});