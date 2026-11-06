// backend/nodejs_express/tests/unit/auth.test.js
const { verifyToken } = require('../../middlewares/authMiddleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔥 MOCK: Simulamos la librería jsonwebtoken para no depender de tokens reales
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((token, secret, callback) => {
    if (token === 'token_valido_simulado') {
      callback(null, { id: 1, role: 'admin' }); // Simula éxito
    } else {
      callback(new Error('Token inválido'), null); // Simula error
    }
  })
}));

describe('Nivel 1: Pruebas Unitarias - Backend', () => {
  
  // UT-03: Middleware rechaza peticiones sin token
  test('UT-03: verifyToken debe retornar 403 si no hay cabecera de autorización', () => {
    // 1. Simulamos los objetos req, res y next de Express
    const req = { headers: {} }; // Sin cabecera 'authorization'
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    // 2. Ejecutamos el middleware
    verifyToken(req, res, next);

    // 3. Verificamos el resultado
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "No se proporcionó un token"
    }));
    expect(next).not.toHaveBeenCalled(); // No debe pasar al siguiente middleware
  });

  // UT-04: El modelo debe encriptar la contraseña
  test('UT-04: bcrypt debe encriptar la contraseña (no dejarla en texto plano)', async () => {
    const passwordPlana = "miPassword123";
    
    // Simulamos lo que hace User.create en models/user.js
    const hash = await bcrypt.hash(passwordPlana, 10);
    
    // Verificamos que el hash no sea igual a la contraseña plana
    expect(hash).not.toBe(passwordPlana);
    // Verificamos que el hash inicie con el prefijo de bcrypt (ej: $2a$10$...)
    expect(hash).toMatch(/^\$2[ayb]\$.{56}$/);
  });

  // UT-05: Verificar que bcrypt valide correctamente (Caso Positivo y Negativo)
  test('UT-05: bcrypt.compare debe validar correctamente una contraseña', async () => {
    const passwordPlana = "miPassword123";
    const hashFalso = await bcrypt.hash(passwordPlana, 10);
    
    // Caso positivo
    const esValida = await bcrypt.compare(passwordPlana, hashFalso);
    expect(esValida).toBe(true);

    // Caso negativo (contraseña incorrecta)
    const esInvalida = await bcrypt.compare("password_incorrecta", hashFalso);
    expect(esInvalida).toBe(false);
  });

});