// frontend_web/react_node_express/src/tests/unit/smoke.test.jsx
import { render, screen } from '@testing-library/react';

describe('Configuración de Jest en Frontend', () => {
  test('Jest funciona con JSX', () => {
    const elemento = <h1>Hola Profe Albeiro</h1>;
    expect(elemento).toBeTruthy();
  });

  test('React Testing Library renderiza componentes', () => {
    render(<h1>Hola Profe Albeiro</h1>);
    expect(screen.getByText('Hola Profe Albeiro')).toBeInTheDocument();
  });
});