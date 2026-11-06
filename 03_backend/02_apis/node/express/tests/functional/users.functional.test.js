// backend/nodejs_express/tests/functional/users.functional.test.js
const request = require('supertest');
const app = require('../../server');
const db = require('../../config/config');

describe('Nivel 3: Pruebas Funcionales (Caja Negra) - Reglas de Negocio', () => {
  let tokenAdmin = '';
  let tokenUser = '';

  // 🛠️ Configuración inicial
  beforeAll(async () => {
    // 1. Limpiamos la tabla
    await new Promise((resolve, reject) => {
      db.query('DELETE FROM users', (err) => (err ? reject(err) : resolve()));
    });

    // 2. Insertamos usuarios de prueba directamente en la BD (Admin y User)
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('password123', 10);
    
    await new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (name, lastname, email, password, role) VALUES ?`;
      const values = [
        ['Admin', 'Test', 'admin@test.com', hash, 'admin'],
        ['User', 'Test', 'user@test.com', hash, 'user']
      ];
      db.query(sql, [values], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    // 3. Obtenemos los tokens para ambos roles
    const loginAdmin = await request(app).post('/api/users/login').send({ email: 'admin@test.com', password: 'password123' });
    tokenAdmin = loginAdmin.body.data.session_token;

    const loginUser = await request(app).post('/api/users/login').send({ email: 'user@test.com', password: 'password123' });
    tokenUser = loginUser.body.data.session_token;
  });

  afterAll(async () => {
    await new Promise((resolve) => db.end(resolve));
  });

  // FT-01: Registro con email duplicado
  test('FT-01: No debe permitir registrar un usuario con un email que ya existe', async () => {
    const response = await request(app)
      .post('/api/users/create')
      .send({ 
        name: "Copia", 
        email: "admin@test.com", // Email que ya existe en la BD
        password: "password123" 
      });

    // El backend actualmente devuelve 501 si la BD arroja un error (ej. Duplicado)
    expect(response.status).toBe(501); 
    expect(response.body.success).toBe(false);
  });

  // FT-02: Login con contraseña incorrecta
  test('FT-02: Debe rechazar el login si la contraseña es incorrecta', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'admin@test.com', password: 'incorrecta' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Contraseña o correo incorrecto");
  });

  // FT-03: Control de acceso por Rol (Caja Negra)
  test('FT-03: Un usuario con rol "user" NO debe poder listar todos los usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', tokenUser); // Enviamos token de USER

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Acceso denegado");
  });

  // FT-04: Validación de datos obligatorios
  test('FT-04: No debe crear un usuario si falta el email (campo obligatorio)', async () => {
    const response = await request(app)
      .post('/api/users/create')
      .send({ 
        name: "Sin Correo", 
        lastname: "Prueba", // 👈 Agregamos el lastname para que el error sea por el email
        password: "password123" 
        // Falta el email
      });

    expect(response.status).toBe(501); 
    expect(response.body.success).toBe(false);
  });

  // FT-05: Actualización parcial (Solo un campo)
  test('FT-05: Debe actualizar solo el teléfono sin alterar los demás campos', async () => {
    // 1. Primero obtenemos el ID del usuario "User" que creamos
    const [rows] = await new Promise((resolve, reject) => {
      db.query('SELECT id FROM users WHERE email = ?', ['user@test.com'], (err, res) => {
        if (err) reject(err);
        else resolve([res]);
      });
    });
    const idUser = rows[0].id;

    // 2. Hacemos la actualización enviando solo el teléfono
    const response = await request(app)
      .put('/api/users/')
      .set('Authorization', tokenAdmin)
      .send({ 
        id: idUser, 
        phone: "3000000000" 
      });

    expect(response.status).toBe(200);

    // 3. Verificamos en la BD que el teléfono cambió, pero el nombre y email siguen igual
    const [rowsDespues] = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', [idUser], (err, res) => {
        if (err) reject(err);
        else resolve([res]);
      });
    });
    
    expect(rowsDespues[0].phone).toBe("3000000000");
    expect(rowsDespues[0].name).toBe("User"); // No se alteró
    expect(rowsDespues[0].email).toBe("user@test.com"); // No se alteró
  });
});