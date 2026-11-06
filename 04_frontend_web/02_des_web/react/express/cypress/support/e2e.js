// frontend_web/react_node_express/cypress/support/e2e.js
import './commands.js' // Importa los comandos (asegúrese de que commands también use export/import si es necesario)

// Silencia errores no capturados de la app
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})