// cypress/e2e/system/smoke.cy.js
describe('Configuración de Cypress', () => {
  it('Cypress está funcionando correctamente', () => {
    expect(true).to.equal(true)
  })

  it('El frontend está corriendo y responde', () => {
    cy.visit('/') // Usa la baseUrl del config
    cy.contains('Sistema de Información Web') // Texto del LoginView
  })
})