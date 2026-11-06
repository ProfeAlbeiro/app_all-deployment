// backend/nodejs_express/server.js
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const usersRoutes = require('./routes/userRoutes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*', // Permite conexiones desde React y desde Azure
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

const swaggerOptions = {  
  swaggerOptions: {
    docExpansion: 'list',           
    defaultModelsExpandDepth: -1,   
    defaultModelExpandDepth: 1,     
    displayRequestDuration: true,   
    filter: false,                  
    layout: 'BaseLayout',  
    showExtensions: true,
    showCommonExtensions: true,
    deepLinking: true,         
    persistAuthorization: true,
    tagsSorter: 'alpha',       
    operationsSorter: function(a, b) {
      const methodOrder = { 'post': 1, 'get': 2, 'put': 3, 'delete': 4 };
      return methodOrder[a.get('method')] - methodOrder[b.get('method')];
    }  
  }  
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => res.send('Ruta raíz del Backend'));
app.get('/test', (req, res) => res.send('Ruta TEST'));

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

// 👇 LÓGICA DE ARRANQUE PARA AZURE (Solo se ejecuta en Producción)
if (process.env.NODE_ENV === 'production') {
  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Servidor de AZURE corriendo en el puerto ${port}`);
  });
}

module.exports = app;