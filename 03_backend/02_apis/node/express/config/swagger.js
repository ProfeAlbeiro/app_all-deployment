// backend/nodejs_express/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Mi Proyecto',
      version: '1.0.0',
      description: 'Documentación completa de la API REST',
      contact: {
        name: 'Albeiro Ramos',
        email: 'profealbeiro2020@gmail.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
             ? 'https://api-project-deployment-b8hca8gdh7fvakfn.chilecentral-01.azurewebsites.net' 
             : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Servidor en Azure' : 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' }, email: { type: 'string' }, name: { type: 'string' },
            lastname: { type: 'string' }, role: { type: 'string', enum: ['admin', 'seller', 'user'] }
          },
          example: { email: "juan@example.com", name: "Juan", lastname: "Pérez", role: "user" }
        },
        Login: {
          type: 'object', required: ['email', 'password'],
          properties: { email: { type: 'string' }, password: { type: 'string' } },
          example: { email: "usuario@example.com", password: "miContraseña123" }
        },
        Error: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' } } }
      }
    }
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);