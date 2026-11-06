// src/views/dashboard/UsersView.jsx
import { useState } from 'react'
import useUsers from '../../hooks/useUsers'
import AlertMessage from '../common/AlertMessage'
import UserForm from './UserForm'
import UserDetails from './UserDetails'
import '../../styles/Users.css'

const UsersView = () => {
  const { users, loading, error, deleteUser, loadUsers } = useUsers()
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm)
  )

  // Manejar eliminación
  const handleDelete = async (user) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${user.email}?`)) {
      try {
        await deleteUser(user.id)
        setMessage({ type: 'success', text: 'Usuario eliminado exitosamente' })
        setTimeout(() => setMessage(null), 3000)
      } catch (err) {
        setMessage({ type: 'error', text: err.error || 'Error al eliminar usuario' })
      }
    }
  }

  // Manejar edición
  const handleEdit = (user) => {
    setSelectedUser(user)
    setEditMode(true)
    setShowForm(true)
    setShowDetails(false)
  }

  // Manejar ver detalles
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

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false)
    setEditMode(false)
    setSelectedUser(null)
  }

  // Cerrar detalles
  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedUser(null)
  }

  if (loading && users.length === 0) {
    return <div className="loading-container">Cargando usuarios...</div>
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Gestión de Usuarios</h2>
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
          placeholder="Buscar por email o ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {error && (
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
              <th>Email</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
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
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(user)}
                      title="Eliminar"
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

      {/* Modal de Formulario */}
      {showForm && (
        <UserForm
          user={selectedUser}
          isEdit={editMode}
          onSuccess={handleFormSuccess}
          onClose={handleCloseForm}
        />
      )}

      {/* Modal de Detalles */}
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