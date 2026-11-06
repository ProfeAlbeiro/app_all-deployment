// frontend_web/react_node_express/cypress/support/commands.js

/**
 * Comando personalizado para hacer login programático.
 * Evita tener que llenar el formulario en cada test.
 */
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://10.1.195.62:3000/api/users/login',
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(201)
    const token = response.body.data.session_token.replace('JWT ', '')
    
    // Guardamos el token en localStorage tal como lo hace la app React
    window.localStorage.setItem('auth_token', token)
    window.localStorage.setItem('user_data', JSON.stringify(response.body.data))
  })
})