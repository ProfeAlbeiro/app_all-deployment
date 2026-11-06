// backend/nodejs_express/index.js
const http = require('http');
const app = require('./server'); // Importa la app de server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',   
    'http://localhost:3000',   
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());
app.set('port', 3000);

const server = http.createServer(app);

server.listen(3000, 'localhost', () => {
  console.log(`🚀 Servidor corriendo en LOCAL en http://localhost:3000`);
  console.log(`📚 Swagger disponible en: http://localhost:3000/api-docs`);
});