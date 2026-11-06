// src/views/dashboard/UserForm.jsx
import { useState, useEffect } from 'react'
import useUsers from '../../hooks/useUsers'
import useAuth from '../../hooks/useAuth'

const UserForm = ({ user, isEdit, onSuccess, onClose }) => {
  const { createUser, updateUser, patchUser } = useUsers()
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [patchMode, setPatchMode] = useState(false)
  const [patchField, setPatchField] = useState('')
  const [patchValue, setPatchValue] = useState('')

  // Cargar datos del usuario si es edición
  useEffect(() => {
    if (user && isEdit) {
      setFormData({
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        phone: user.phone || '',
        role: user.role || 'user'
      })
    }
  }, [user, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  // Verificar si el usuario actual puede asignar roles (solo admin)
  const canAssignRole = () => {
    return currentUser?.role === 'admin'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.email) {
      setError('El email es requerido')
      return
    }

    if (!isEdit && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (!isEdit && formData.password.length < 5) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (!isEdit && !formData.name) {
      setError('El nombre es requerido')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isEdit) {
        if (patchMode && patchField) {
          // Modo PATCH - Actualizar solo un campo
          const patchData = {}
          patchData[patchField] = patchValue
          await patchUser(user.id, patchData)
        } else {
          // Modo PUT - Actualizar todos los datos
          const updateData = {
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone
          }
          // Solo incluir rol si el usuario actual es admin
          if (canAssignRole()) {
            updateData.role = formData.role
          }
          if (formData.password) {
            updateData.password = formData.password
          }
          await updateUser(user.id, updateData)
        }
      } else {
        // Modo POST - Crear nuevo usuario
        const newUserData = {
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: canAssignRole() ? formData.role : 'user'
        }
        await createUser(newUserData)
      }
      onSuccess()
    } catch (err) {
      setError(err.error || 'Error al guardar usuario')
    } finally {
      setLoading(false)
    }
  }

  const handlePatchSubmit = async (e) => {
    e.preventDefault()
    if (!patchField || !patchValue) {
      setError('Seleccione un campo y un valor')
      return
    }
    
    setLoading(true)
    try {
      const patchData = {}
      patchData[patchField] = patchValue
      await patchUser(user.id, patchData)
      onSuccess()
    } catch (err) {
      setError(err.error || 'Error al actualizar campo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        {/* Mostrar toggle de PATCH solo para admin en modo edición */}
        {isEdit && canAssignRole() && (
          <div className="patch-toggle">
            <label>
              <input
                type="radio"
                checked={!patchMode}
                onChange={() => setPatchMode(false)}
              />
              Actualizar todos los datos (PUT)
            </label>
            <label>
              <input
                type="radio"
                checked={patchMode}
                onChange={() => setPatchMode(true)}
              />
              Actualizar campo específico (PATCH)
            </label>
          </div>
        )}

        {patchMode && isEdit ? (
          // Formulario PATCH - Actualizar un solo campo
          <form onSubmit={handlePatchSubmit} className="user-form">
            <div className="form-group">
              <label>Campo a actualizar</label>
              <select
                value={patchField}
                onChange={(e) => setPatchField(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Seleccionar campo</option>
                <option value="name">Nombre</option>
                <option value="lastname">Apellido</option>
                <option value="email">Email</option>
                <option value="phone">Teléfono</option>
                <option value="password">Contraseña</option>
                {canAssignRole() && <option value="role">Rol</option>}
              </select>
            </div>

            <div className="form-group">
              <label>Nuevo valor</label>
              {patchField === 'role' ? (
                <select
                  value={patchValue}
                  onChange={(e) => setPatchValue(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar rol</option>
                  <option value="admin">Administrador</option>
                  <option value="seller">Vendedor</option>
                  <option value="customer">Cliente</option>
                  <option value="user">Usuario</option>
                </select>
              ) : (
                <input
                  type={patchField === 'email' ? 'email' : (patchField === 'password' ? 'password' : 'text')}
                  value={patchValue}
                  onChange={(e) => setPatchValue(e.target.value)}
                  placeholder={`Nuevo valor para ${patchField}`}
                  className="form-control"
                  required
                />
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Campo'}
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          // Formulario completo (PUT para edición, POST para creación)
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre {!isEdit && '*'}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className="form-control"
                  required={!isEdit}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Apellido {!isEdit && '*'}</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Apellido"
                  className="form-control"
                  required={!isEdit}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="usuario@ejemplo.com"
                className="form-control"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono (opcional)"
                className="form-control"
                disabled={loading}
              />
            </div>

            {!isEdit && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contraseña *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      className="form-control"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar Contraseña *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repita la contraseña"
                      className="form-control"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {isEdit && !patchMode && (
              <div className="form-group">
                <label>Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Dejar en blanco para mantener actual"
                  className="form-control"
                  disabled={loading}
                />
              </div>
            )}

            {/* Selector de rol - Solo visible para admin */}
            {canAssignRole() && (
              <div className="form-group">
                <label>Rol</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-control"
                  disabled={loading}
                >
                  <option value="user">Usuario</option>
                  <option value="customer">Cliente</option>
                  <option value="seller">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
                <small className="form-hint">Define los permisos del usuario</small>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default UserForm