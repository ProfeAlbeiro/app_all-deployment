// backend/nodejs_express/config/config.js
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: envFile });

const mysql = require('mysql2'); // 👈 Obligatorio para Azure

const isProduction = process.env.NODE_ENV === 'production';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

// 👇 Solo agregamos SSL si estamos en Azure
if (isProduction) {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const db = mysql.createConnection(dbConfig);

db.connect(function(err) {
  if (err) {
    console.error('❌ Error de conexión a la BD:', err);
    throw err;
  }
  console.log(`✅ Base de datos conectada: ${process.env.DB_NAME} (${isProduction ? 'Producción' : 'Desarrollo'})`);
});

module.exports = db;