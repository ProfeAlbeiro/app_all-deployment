// frontend_web/react_node_express/src/tests/unit/components.test.jsx
import { render, screen } from '@testing-library/react';
import jwtService from '../../services/jwtService';
import AlertMessage from '../../views/common/AlertMessage';

describe('Nivel 1: Pruebas Unitarias - Frontend', () => {

  // UT-01: Token válido
  test('UT-01: jwtService debe validar como true un token no expirado', () => {
    const payload = {
      id: 1,
      email: 'test@test.com',
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expira en 1 hora
    };
    
    const tokenValido = jwtService.generateToken(payload);
    const resultado = jwtService.verifyToken(tokenValido);
    
    expect(resultado).toBe(true);
  });

  // UT-02: Token expirado
  test('UT-02: jwtService debe validar como false un token expirado', () => {
    const payloadExpirado = {
      id: 1,
      email: 'test@test.com',
      exp: Math.floor(Date.now() / 1000) - (60 * 60 * 2) // Expiró hace 2 horas
    };
    
    const tokenExpirado = jwtService.generateToken(payloadExpirado);
    const resultado = jwtService.verifyToken(tokenExpirado);
    
    expect(resultado).toBe(false);
  });

  // UT-05 (Frontend): Renderizado del componente AlertMessage
  test('UT-05: AlertMessage debe renderizar el mensaje en pantalla', () => {
    // Renderizamos el componente aislado
    render(<AlertMessage type="error" message="Error de prueba unitaria" />);
    
    // Buscamos el texto en el DOM virtual (jsdom)
    const mensajeEnPantalla = screen.getByText('Error de prueba unitaria');
    
    // Verificamos que exista
    expect(mensajeEnPantalla).toBeInTheDocument();
  });

});