// src/views/dashboard/UserForm.jsx
import { useState, useEffect } from 'react'
import useUsers from '../../hooks/useUsers'

const UserForm = ({ user, isEdit, onSuccess, onClose }) => {
  const { createUser, updateUser, patchUser } = useUsers()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [patchMode, setPatchMode] = useState(false)
  const [patchField, setPatchField] = useState('')
  const [patchValue, setPatchValue] = useState('')

  useEffect(() => {
    if (user && isEdit) {
      setFormData({
        email: user.email,
        password: '',
        confirmPassword: ''
      })
    }
  }, [user, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email) {
      setError('El email es requerido')
      return
    }

    if (!isEdit && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
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
            email: formData.email,
            password: formData.password || user.password
          }
          await updateUser(user.id, updateData)
        }
      } else {
        // Modo POST - Crear nuevo usuario
        await createUser({
          email: formData.email,
          password: formData.password
        })
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

        {isEdit && (
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
                <option value="email">Email</option>
                <option value="password">Contraseña</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nuevo valor</label>
              <input
                type={patchField === 'email' ? 'email' : 'text'}
                value={patchValue}
                onChange={(e) => setPatchValue(e.target.value)}
                placeholder={patchField === 'email' ? 'nuevo@email.com' : 'Nueva contraseña'}
                className="form-control"
                required
              />
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
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
              <label>Email</label>
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

            {!isEdit && (
              <>
                <div className="form-group">
                  <label>Contraseña</label>
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
                  <label>Confirmar Contraseña</label>
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