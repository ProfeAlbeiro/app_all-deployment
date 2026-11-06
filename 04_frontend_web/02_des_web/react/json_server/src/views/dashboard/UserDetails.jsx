// src/views/dashboard/UserDetails.jsx
const UserDetails = ({ user, onClose, onEdit }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalles del Usuario</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="user-details">
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{user.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Fecha Registro:</span>
            <span className="detail-value">
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Última Actualización:</span>
            <span className="detail-value">
              {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onEdit}>
            Editar Usuario
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDetails