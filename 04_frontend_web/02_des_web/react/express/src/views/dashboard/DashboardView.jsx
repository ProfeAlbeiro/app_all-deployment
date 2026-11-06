// src/views/dashboard/DashboardView.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import DashboardHeader from './DashboardHeader'
import DashboardStats from './DashboardStats'
import UsersView from './UsersView'
import AlertMessage from '../common/AlertMessage'
import LoadingSpinner from '../common/LoadingSpinner'
// IMPORTANTE: Importar los estilos
import '../../styles/Dashboard.css'
import '../../styles/Users.css'

const DashboardView = () => {
  const { currentUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [logoutMessage, setLogoutMessage] = useState('')
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      setLogoutMessage('Sesión cerrada exitosamente')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-welcome">
              <h2>Bienvenido, {currentUser?.name || currentUser?.email?.split('@')[0] || 'Usuario'}!</h2>
              <p>Este es tu panel de administración</p>
            </div>
            
            <DashboardStats stats={{
              activeUsers: 150,
              todayVisits: 45,
              activeSessions: 23,
              successRate: 95
            }} />
            
            <div className="dashboard-info">
              <div className="info-card">
                <h3>Información del Sistema</h3>
                <p>Este sistema utiliza un patrón arquitectónico MVC con React.</p>
                <ul>
                  <li>✅ Autenticación JWT simulada</li>
                  <li>✅ Almacenamiento en localStorage</li>
                  <li>✅ Rutas protegidas</li>
                  <li>✅ CRUD de usuarios completo</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Estado de Autenticación</h3>
                <p><strong>Token almacenado:</strong> {localStorage.getItem('auth_token') ? '✓ Activo' : '✗ No encontrado'}</p>
                <p><strong>Usuario actual:</strong> {currentUser?.email}</p>
                <p><strong>Rol:</strong> Administrador</p>
              </div>
            </div>
          </>
        )
      case 'users':
        return <UsersView />
      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader 
        user={currentUser} 
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {logoutMessage && (
        <AlertMessage 
          type="success" 
          message={logoutMessage}
          onClose={() => setLogoutMessage('')}
        />
      )}
      
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  )
}

export default DashboardView