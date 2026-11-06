// backend/nodejs_express/jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  maxWorkers: 1, 
  
  // 👇 CONFIGURACIÓN DE REPORTES
  reporters: [
    'default', // Muestra el resumen en consola
    [
      'jest-html-reporters',
      {
        publicPath: './reports/backend', // Carpeta donde se guardará el HTML
        filename: 'reporte-backend.html',
        expand: true,
        pageTitle: 'Reporte de Pruebas - Backend Node.js',
        hideIcon: false,
      },
    ],
  ],
};