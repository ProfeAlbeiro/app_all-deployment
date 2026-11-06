// backend/nodejs_express/tests/unit/smoke.test.js
describe('Configuración de Jest en Backend', () => {
  test('Jest está funcionando correctamente', () => {
    expect(1 + 1).toBe(2);
  });

  test('El entorno es Node.js', () => {
    expect(typeof process.version).toBe('string');
  });

  test('Las variables de entorno de prueba se cargan', () => {
    // Si configuró .env.test, esto debería existir
    console.log('NODE_ENV:', process.env.NODE_ENV);
    expect(process.env.NODE_ENV).toBe('test');
  });
});