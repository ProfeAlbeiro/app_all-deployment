// src/models/UserModel.js
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class UserModel {
  // GET - Obtener todos los usuarios
  static async getAllUsers() {
    try {
      console.log('📋 Obteniendo todos los usuarios')
      const users = await httpService.get(API_CONFIG.ENDPOINTS.USERS, true)
      return {
        success: true,
        data: users
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // GET - Obtener usuario por ID
  static async getUserById(id) {
    try {
      console.log(`🔍 Obteniendo usuario con ID: ${id}`)
      const user = await httpService.get(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, true)
      return {
        success: true,
        data: user
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // POST - Crear nuevo usuario (registro)
  static async createUser(userData) {
    try {
      console.log('➕ Creando nuevo usuario:', userData.email)
      
      // Verificar si el email ya existe
      const users = await this.getAllUsers()
      if (users.success) {
        const emailExists = users.data.find(u => u.email === userData.email)
        if (emailExists) {
          return {
            success: false,
            error: 'El email ya está registrado'
          }
        }
      }
      
      // Obtener el último ID
      const lastId = users.success && users.data.length > 0 
        ? Math.max(...users.data.map(u => u.id)) 
        : 0
      const newId = lastId + 1
      
      const newUser = {
        id: newId,
        email: userData.email,
        password: userData.password || '123456' // Contraseña por defecto
      }
      
      const response = await httpService.post(API_CONFIG.ENDPOINTS.USERS, newUser, true)
      return {
        success: true,
        data: response,
        message: 'Usuario creado exitosamente'
      }
    } catch (error) {
      console.error('Error al crear usuario:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // PUT - Actualizar todos los datos del usuario
  static async updateUser(id, userData) {
    try {
      console.log(`✏️ Actualizando usuario ID: ${id}`, userData)
      
      // Verificar si el usuario existe
      const existingUser = await this.getUserById(id)
      if (!existingUser.success) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        }
      }
      
      // Actualizar todos los campos
      const updatedUser = {
        ...existingUser.data,
        ...userData,
        id: id // Asegurar que el ID no cambie
      }
      
      const response = await httpService.put(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, updatedUser, true)
      return {
        success: true,
        data: response,
        message: 'Usuario actualizado completamente'
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // PATCH - Actualizar un solo campo del usuario
  static async patchUser(id, partialData) {
    try {
      console.log(`📝 Actualizando campo(s) de usuario ID: ${id}`, partialData)
      
      // Verificar si el usuario existe
      const existingUser = await this.getUserById(id)
      if (!existingUser.success) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        }
      }
      
      const response = await httpService.patch(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, partialData, true)
      return {
        success: true,
        data: response,
        message: 'Campo(s) actualizado(s) correctamente'
      }
    } catch (error) {
      console.error('Error al actualizar campo:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // DELETE - Eliminar usuario
  static async deleteUser(id) {
    try {
      console.log(`🗑️ Eliminando usuario ID: ${id}`)
      
      // Verificar si el usuario existe
      const existingUser = await this.getUserById(id)
      if (!existingUser.success) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        }
      }
      
      await httpService.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, true)
      return {
        success: true,
        message: 'Usuario eliminado exitosamente'
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default UserModel