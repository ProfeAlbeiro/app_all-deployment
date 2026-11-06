// src/controllers/UserController.js
import UserModel from '../models/UserModel'
import AuthController from './AuthController'  // ← NUEVO: para verificar roles

class UserController {
  // Obtener todos los usuarios (requiere rol admin/seller)
  static async getAllUsers(onSuccess, onError) {
    try {
      // Verificar si el usuario tiene permiso (opcional - el backend ya lo hace)
      if (!AuthController.hasAnyRole(['admin', 'seller'])) {
        onError('No tiene permisos para ver la lista de usuarios')
        return
      }
      
      const result = await UserModel.getAllUsers()
      if (result.success) {
        console.log(`✅ Controlador: ${result.data?.length || 0} usuarios obtenidos`)
        onSuccess(result.data)
      } else {
        console.error('❌ Controlador: Error al obtener usuarios:', result.error)
        onError(result.error)
      }
    } catch (error) {
      console.error('❌ Error en getAllUsers:', error)
      onError('Error al cargar usuarios')
    }
  }

  // Obtener usuario por ID (requiere rol admin/seller)
  static async getUserById(id, onSuccess, onError) {
    try {
      if (!id) {
        onError('ID de usuario no proporcionado')
        return
      }
      
      // Verificar permisos
      if (!AuthController.hasAnyRole(['admin', 'seller'])) {
        onError('No tiene permisos para ver este usuario')
        return
      }
      
      const result = await UserModel.getUserById(id)
      if (result.success) {
        console.log(`✅ Controlador: Usuario ${id} encontrado`)
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error('❌ Error en getUserById:', error)
      onError('Error al obtener usuario')
    }
  }

  // Crear usuario (registro público - NO requiere token)
  static async createUser(userData, onSuccess, onError) {
    try {
      // Validaciones de negocio
      if (!userData.email) {
        onError('El email es requerido')
        return
      }
      
      if (!userData.password) {
        onError('La contraseña es requerida')
        return
      }
      
      if (userData.password.length < 5) {
        onError('La contraseña debe tener al menos 6 caracteres')
        return
      }
      
      const result = await UserModel.createUser(userData)
      if (result.success) {
        console.log('✅ Controlador: Usuario creado exitosamente')
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error('❌ Error en createUser:', error)
      onError('Error al crear usuario')
    }
  }

  // Actualizar todos los datos (PUT) - requiere rol admin/seller
  static async updateUser(id, userData, onSuccess, onError) {
    try {
      if (!id || !userData) {
        onError('Datos incompletos')
        return
      }
      
      // Verificar permisos
      if (!AuthController.hasAnyRole(['admin', 'seller'])) {
        onError('No tiene permisos para actualizar usuarios')
        return
      }
      
      // No permitir que un usuario se actualice a sí mismo a un rol superior
      const currentUser = AuthController.getAuthState().currentUser
      if (currentUser && currentUser.id === parseInt(id) && userData.role) {
        console.warn('⚠️ Usuario intentando cambiar su propio rol')
        // Opcional: permitir o denegar según política
      }
      
      const result = await UserModel.updateUser(id, userData)
      if (result.success) {
        console.log(`✅ Controlador: Usuario ${id} actualizado`)
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error('❌ Error en updateUser:', error)
      onError('Error al actualizar usuario')
    }
  }

  // Actualizar campo específico (PATCH) - usa PUT ya que la API no tiene PATCH específico
  static async patchUser(id, partialData, onSuccess, onError) {
    try {
      if (!id || !partialData) {
        onError('Datos incompletos')
        return
      }
      
      // Verificar permisos
      if (!AuthController.hasAnyRole(['admin', 'seller'])) {
        onError('No tiene permisos para actualizar usuarios')
        return
      }
      
      const result = await UserModel.patchUser(id, partialData)
      if (result.success) {
        console.log(`✅ Controlador: Campo(s) actualizado(s) para usuario ${id}`)
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error('❌ Error en patchUser:', error)
      onError('Error al actualizar campo')
    }
  }

  // Eliminar usuario (DELETE) - SOLO admin
  static async deleteUser(id, onSuccess, onError) {
    try {
      if (!id) {
        onError('ID de usuario no proporcionado')
        return
      }
      
      // Verificar permisos (SOLO admin puede eliminar)
      if (!AuthController.hasRole('admin')) {
        onError('No tiene permisos para eliminar usuarios. Se requiere rol de administrador.')
        return
      }
      
      // No permitir que un admin se elimine a sí mismo
      const currentUser = AuthController.getAuthState().currentUser
      if (currentUser && currentUser.id === parseInt(id)) {
        onError('No puede eliminar su propio usuario')
        return
      }
      
      const result = await UserModel.deleteUser(id)
      if (result.success) {
        console.log(`✅ Controlador: Usuario ${id} eliminado`)
        onSuccess()
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error('❌ Error en deleteUser:', error)
      onError('Error al eliminar usuario')
    }
  }
}

export default UserController