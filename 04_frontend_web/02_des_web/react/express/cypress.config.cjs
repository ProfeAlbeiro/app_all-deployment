// frontend_web/react_node_express/cypress.config.cjs
const { defineConfig } = require("cypress");
const { merge } = require('mochawesome-merge');
const marge = require('mochawesome-report-generator');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    keystrokeDelay: 50, // Escribe con 50ms de retardo entre teclas
    video: true,
    screenshotOnRunFailure: true,
    
    // 👇 CONFIGURACIÓN DE REPORTES HTML
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/html', // Carpeta donde se guardan los JSON
      overwrite: false,                 // No sobrescribir si hay varios archivos
      html: false,                      // No generar HTML individual por cada test
      json: true,                       // Generar JSON para luego fusionarlo
    },

    setupNodeEvents(on, config) {
      // Tarea para fusionar los reportes JSON en un solo HTML al finalizar
      on('after:run', async () => {
        const jsonReport = await merge({
          files: ['cypress/reports/html/*.json'],
        });
        await marge.create(jsonReport, {
          reportDir: 'cypress/reports/html',
          reportFilename: 'reporte-cypress.html',
          reportTitle: 'Reporte de Pruebas E2E - Cypress',
          inline: true,
        });
        console.log('✅ Reporte HTML de Cypress generado exitosamente.');
      });
      return config;
    },
  },
});