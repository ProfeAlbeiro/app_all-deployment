// backend/nodejs_express/tests/integration/users.integration.test.js
const request = require('supertest');
const app = require('../../server'); // Importamos la app de Express
const db = require('../../config/config'); // Importamos la conexión a la BD

describe('Nivel 2: Pruebas de Integración - Rutas de Usuarios', () => {
  let tokenAdmin = '';
  let idUsuarioCreado = '';

  // 🛠️ Configuración inicial: Limpiamos la BD de pruebas y creamos un Admin
  beforeAll(async () => {
    // 1. Limpiamos la tabla
    await new Promise((resolve, reject) => {
      db.query('DELETE FROM users', (err) => (err ? reject(err) : resolve()));
    });

    // 2. Insertamos un usuario Admin directamente (Saltamos el controlador para tener el token rápido)
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 10);
    
    await new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (name, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)`;
      db.query(sql, ['Admin', 'Test', 'admin@test.com', hash, 'admin'], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    // 3. Hacemos login para obtener el token real
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
      
    tokenAdmin = loginRes.body.data.session_token;
  });

  // Cerramos la conexión a la BD al terminar todas las pruebas
  afterAll(async () => {
    await new Promise((resolve) => db.end(resolve));
  });

  // IT-01: Crear usuario (Integración Router + Controller + Model + BD)
  test('IT-01: POST /api/users/create debe guardar un usuario en la BD', async () => {
    const nuevoUsuario = {
      name: "Test Integracion",
      lastname: "Apellido",
      email: "integracion@test.com",
      password: "password123",
      role: "user"
    };

    const response = await request(app)
      .post('/api/users/create')
      .send(nuevoUsuario);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');

    // Verificamos directamente en la BD que el usuario realmente se guardó
    const [rows] = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [nuevoUsuario.email], (err, res) => {
        if (err) reject(err);
        else resolve([res]);
      });
    });
    
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe(nuevoUsuario.name);
    idUsuarioCreado = rows[0].id; // Guardamos el ID para las siguientes pruebas
  });

  // IT-02: Login exitoso (Integración Auth + BD)
  test('IT-02: POST /api/users/login debe retornar un token válido', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'admin@test.com', password: 'admin123' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('session_token');
    expect(response.body.data.session_token).toContain('JWT');
  });

  // IT-03: Listar usuarios (Integración Middleware Auth + Controller)
  test('IT-03: GET /api/users debe listar usuarios si el token es válido', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', tokenAdmin); // Enviamos el token real

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // IT-04: Actualizar usuario (Integración Modelo dinámico)
  test('IT-04: PUT /api/users/ debe actualizar un campo en la BD', async () => {
    const response = await request(app)
      .put(`/api/users/`) // 👈 Quitamos el /${id} porque su ruta es solo '/'
      .set('Authorization', tokenAdmin)
      .send({ 
        id: idUsuarioCreado, // 👈 Enviamos el ID en el cuerpo (body)
        name: "Nombre Actualizado" 
      });

    expect(response.status).toBe(200);
    
    // Verificamos en la BD que el cambio se aplicó
    const [rows] = await new Promise((resolve, reject) => {
      db.query('SELECT name FROM users WHERE id = ?', [idUsuarioCreado], (err, res) => {
        if (err) reject(err);
        else resolve([res]);
      });
    });
    expect(rows[0].name).toBe("Nombre Actualizado");
  });

  // IT-05: Eliminar usuario (Integración Auth + Controller DELETE)
  test('IT-05: DELETE /api/users/delete/:id debe borrar al usuario', async () => {
    const response = await request(app)
      .delete(`/api/users/delete/${idUsuarioCreado}`)
      .set('Authorization', tokenAdmin);

    expect(response.status).toBe(200);

    // Verificamos que ya no exista en la BD
    const [rows] = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', [idUsuarioCreado], (err, res) => {
        if (err) reject(err);
        else resolve([res]);
      });
    });
    expect(rows.length).toBe(0); // Cero filas encontradas
  });
});