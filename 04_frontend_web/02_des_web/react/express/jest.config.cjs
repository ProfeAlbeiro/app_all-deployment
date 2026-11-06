// frontend_web/react_node_express/jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: ['**/tests/**/*.test.(js|jsx)'],
  verbose: true,

  // 👇 CONFIGURACIÓN DE REPORTES
  reporters: [
    'default', // Muestra el resumen en consola
    [
      'jest-html-reporters',
      {
        publicPath: './reports/frontend', // Carpeta donde se guardará el HTML
        filename: 'reporte-frontend.html',
        expand: true,
        pageTitle: 'Reporte de Pruebas - Frontend React',
        hideIcon: false,
      },
    ],
  ],
};