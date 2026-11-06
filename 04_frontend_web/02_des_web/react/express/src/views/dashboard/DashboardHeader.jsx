// src/views/dashboard/DashboardHeader.jsx
const DashboardHeader = ({ user, onLogout, activeTab, onTabChange }) => {
  // Estilos inline para asegurar que se vea bien
  const headerStyles = {
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '0 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
    gap: '15px'
  }

  const headerLeftStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px 0'
  }

  const headerRightStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  }

  const badgeStyles = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600
  }

  const tabStyles = {
    display: 'flex',
    gap: '5px',
    background: '#f0f0f0',
    padding: '4px',
    borderRadius: '12px'
  }

  const tabBtnStyles = (isActive) => ({
    padding: '8px 20px',
    border: 'none',
    background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    color: isActive ? 'white' : '#666'
  })

  const logoutBtnStyles = {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500
  }

  return (
    <header style={headerStyles}>
      <div style={headerLeftStyles}>
        <h1 style={{ fontSize: '20px', color: '#333', margin: 0 }}>Sistema de Información Web</h1>
        <span style={badgeStyles}>Admin Panel</span>
      </div>
      
      <div style={tabStyles}>
        <button 
          style={tabBtnStyles(activeTab === 'dashboard')}
          onClick={() => onTabChange('dashboard')}
        >
          Dashboard
        </button>
        <button 
          style={tabBtnStyles(activeTab === 'users')}
          onClick={() => onTabChange('users')}
        >
          Usuarios
        </button>
      </div>
      
      <div style={headerRightStyles}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, color: '#333', fontSize: '14px' }}>
            {user?.name || user?.email?.split('@')[0] || 'Usuario'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>{user?.email}</div>
        </div>
        <button onClick={onLogout} style={logoutBtnStyles}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader