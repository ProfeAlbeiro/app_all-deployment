// src/views/dashboard/DashboardStats.jsx
const DashboardStats = ({ stats }) => {
  const statItems = [
    { label: 'Usuarios Activos', value: stats?.activeUsers || 0, icon: '👥' },
    { label: 'Visitas Hoy', value: stats?.todayVisits || 0, icon: '📊' },
    { label: 'Sesiones Activas', value: stats?.activeSessions || 0, icon: '🟢' },
    { label: 'Tasa de Éxito', value: `${stats?.successRate || 0}%`, icon: '📈' }
  ]

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  }

  const cardStyles = {
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease'
  }

  return (
    <div style={gridStyles}>
      {statItems.map((item, index) => (
        <div key={index} style={cardStyles}>
          <div style={{ fontSize: '40px' }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#333', margin: '0 0 5px 0' }}>
              {item.value}
            </h3>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats