// src/controllers/UserController.js
import UserModel from '../models/UserModel'

class UserController {
  // Obtener todos los usuarios
  static async getAllUsers(onSuccess, onError) {
    try {
      const result = await UserModel.getAllUsers()
      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al cargar usuarios')
    }
  }

  // Obtener usuario por ID
  static async getUserById(id, onSuccess, onError) {
    try {
      const result = await UserModel.getUserById(id)
      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al obtener usuario')
    }
  }

  // Crear usuario
  static async createUser(userData, onSuccess, onError) {
    try {
      if (!userData.email) {
        onError('El email es requerido')
        return
      }
      
      const result = await UserModel.createUser(userData)
      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al crear usuario')
    }
  }

  // Actualizar todos los datos (PUT)
  static async updateUser(id, userData, onSuccess, onError) {
    try {
      if (!id || !userData) {
        onError('Datos incompletos')
        return
      }
      
      const result = await UserModel.updateUser(id, userData)
      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al actualizar usuario')
    }
  }

  // Actualizar campo específico (PATCH)
  static async patchUser(id, partialData, onSuccess, onError) {
    try {
      if (!id || !partialData) {
        onError('Datos incompletos')
        return
      }
      
      const result = await UserModel.patchUser(id, partialData)
      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al actualizar campo')
    }
  }

  // Eliminar usuario (DELETE)
  static async deleteUser(id, onSuccess, onError) {
    try {
      if (!id) {
        onError('ID de usuario no proporcionado')
        return
      }
      
      const result = await UserModel.deleteUser(id)
      if (result.success) {
        onSuccess()
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError('Error al eliminar usuario')
    }
  }
}

export default UserController