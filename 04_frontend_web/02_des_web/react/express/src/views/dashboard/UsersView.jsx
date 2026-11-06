// src/views/dashboard/UsersView.jsx
import { useState } from 'react'
import useUsers from '../../hooks/useUsers'
import useAuth from '../../hooks/useAuth'  // ← NUEVO: para saber el rol del usuario actual
import AlertMessage from '../common/AlertMessage'
import UserForm from './UserForm'
import UserDetails from './UserDetails'
import '../../styles/Users.css'

const UsersView = () => {
  const { users, loading, error, deleteUser, loadUsers } = useUsers()
  const { currentUser } = useAuth()  // ← NUEVO: usuario logueado
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar usuarios por búsqueda (ahora incluye nombre y rol)
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id?.toString().includes(searchTerm) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // NUEVA FUNCIÓN: Verificar si el usuario actual puede EDITAR
  const canEdit = (user) => {
    if (!currentUser) return false
    // Admin puede editar todo
    if (currentUser.role === 'admin') return true
    // Seller puede editar pero no eliminar
    if (currentUser.role === 'seller') return true
    return false
  }

  // NUEVA FUNCIÓN: Verificar si el usuario actual puede ELIMINAR
  const canDelete = (user) => {
    if (!currentUser) return false
    // Solo admin puede eliminar
    if (currentUser.role !== 'admin') return false
    // No puede eliminarse a sí mismo
    if (currentUser.id === user.id) return false
    return true
  }

  // NUEVA FUNCIÓN: Obtener clase CSS para el rol (color según rol)
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-badge role-admin'
      case 'seller':
        return 'role-badge role-seller'
      case 'customer':
        return 'role-badge role-customer'
      default:
        return 'role-badge role-user'
    }
  }

  // NUEVA FUNCIÓN: Texto legible del rol
  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return '👑 Administrador'
      case 'seller': return '🛒 Vendedor'
      case 'customer': return '👤 Cliente'
      default: return '👤 Usuario'
    }
  }

  // Manejar eliminación (ahora con verificación de permisos)
  const handleDelete = async (user) => {
    if (!canDelete(user)) {
      setMessage({ type: 'error', text: 'No tiene permisos para eliminar este usuario' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    if (window.confirm(`¿Estás seguro de eliminar al usuario "${user.email}"?`)) {
      try {
        await deleteUser(user.id)
        setMessage({ type: 'success', text: 'Usuario eliminado exitosamente' })
        setTimeout(() => setMessage(null), 3000)
      } catch (err) {
        setMessage({ type: 'error', text: err.error || 'Error al eliminar usuario' })
      }
    }
  }

  // Manejar edición (ahora con verificación de permisos)
  const handleEdit = (user) => {
    if (!canEdit(user)) {
      setMessage({ type: 'error', text: 'No tiene permisos para editar este usuario' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    setSelectedUser(user)
    setEditMode(true)
    setShowForm(true)
    setShowDetails(false)
  }

  // Manejar ver detalles (siempre permitido para admin/seller)
  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setShowDetails(true)
    setShowForm(false)
    setEditMode(false)
  }

  // Manejar éxito del formulario
  const handleFormSuccess = () => {
    setShowForm(false)
    setEditMode(false)
    setSelectedUser(null)
    loadUsers()
    setMessage({ type: 'success', text: 'Operación completada exitosamente' })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditMode(false)
    setSelectedUser(null)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedUser(null)
  }

  // NUEVA FUNCIÓN: Verificar si puede crear usuarios
  const canCreateUser = () => {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')
  }

  if (loading && users.length === 0) {
    return <div className="loading-container">Cargando usuarios...</div>
  }

  // NUEVO: Si hay error de permisos (403), mostrar pantalla de acceso denegado
  if (error && (error.includes('No tiene permisos') || error.includes('403'))) {
    return (
      <div className="error-container">
        <div className="error-icon">🔒</div>
        <h3>Acceso Denegado</h3>
        <p>No tiene permisos para ver la lista de usuarios.</p>
        <p className="error-hint">Contacte al administrador si necesita acceso.</p>
      </div>
    )
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Gestión de Usuarios</h2>
        {/* NUEVO: Solo mostrar botón si tiene permisos */}
        {canCreateUser() && (
          <button 
            className="btn-primary"
            onClick={() => {
              setSelectedUser(null)
              setEditMode(false)
              setShowForm(true)
              setShowDetails(false)
            }}
          >
            + Nuevo Usuario
          </button>
        )}
      </div>

      {message && (
        <AlertMessage 
          type={message.type} 
          message={message.text} 
          onClose={() => setMessage(null)}
        />
      )}

      <div className="users-search">
        <input
          type="text"
          placeholder="Buscar por email, nombre, ID o rol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {error && !error.includes('No tiene permisos') && (
        <div className="error-message">
          Error: {error}
          <button onClick={loadUsers}>Reintentar</button>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>        {/* NUEVO: Columna de nombre */}
              <th>Email</th>
              <th>Rol</th>           {/* NUEVO: Columna de rol */}
              <th>Teléfono</th>      {/* NUEVO: Columna de teléfono */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className={currentUser?.id === user.id ? 'current-user-row' : ''}>
                  <td>{user.id}</td>
                  <td>{user.name} {user.lastname || ''}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={getRoleBadgeClass(user.role)}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td>{user.phone || '—'}</td>
                  <td className="actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetails(user)}
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(user)}
                      title="Editar"
                      disabled={!canEdit(user)}  // NUEVO: Deshabilitar si no tiene permiso
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(user)}
                      title="Eliminar"
                      disabled={!canDelete(user)}  // NUEVO: Deshabilitar si no tiene permiso
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <UserForm
          user={selectedUser}
          isEdit={editMode}
          onSuccess={handleFormSuccess}
          onClose={handleCloseForm}
        />
      )}

      {showDetails && selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={handleCloseDetails}
          onEdit={() => {
            handleCloseDetails()
            handleEdit(selectedUser)
          }}
        />
      )}
    </div>
  )
}

export default UsersView