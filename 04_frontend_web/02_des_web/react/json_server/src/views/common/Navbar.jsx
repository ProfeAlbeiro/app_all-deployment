// src/views/common/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import '../../styles/Navbar.css'

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // No mostrar navbar en dashboard
  if (location.pathname.includes('/dashboard')) {
    return null
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <h2>Sistema Web</h2>
          </Link>
        </div>

        <div className="navbar-menu">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="nav-link btn-primary">
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <span className="user-welcome">
                Hola, {currentUser?.name || currentUser?.email}
              </span>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-link btn-logout">
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar