// src/models/UserModel.js
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class UserModel {
  // GET - Obtener todos los usuarios
  static async getAllUsers() {
    try {
      console.log('📋 Obteniendo todos los usuarios desde API real')
      
      const response = await httpService.get(API_CONFIG.ENDPOINTS.USERS, true)
      
      console.log('📦 Respuesta completa de getAllUsers:', response)
      
      let usersArray = []
      
      if (response && response.data && Array.isArray(response.data)) {
        usersArray = response.data
      } else if (Array.isArray(response)) {
        usersArray = response
      } else {
        console.warn('⚠️ La respuesta no contiene un array de usuarios:', response)
        usersArray = []
      }
      
      console.log('✅ Usuarios obtenidos:', usersArray.length)
      
      return {
        success: true,
        data: usersArray
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      return {
        success: false,
        error: error.message || 'Error al cargar usuarios'
      }
    }
  }

  // GET - Obtener usuario por ID
  static async getUserById(id) {
    try {
      console.log(`🔍 Obteniendo usuario con ID: ${id}`)
      
      const endpoint = API_CONFIG.ENDPOINTS.USER_BY_ID.replace(':id', id)
      const response = await httpService.get(endpoint, true)
      
      let userData = null
      if (response && response.data) {
        userData = response.data
      } else if (response && response.id) {
        userData = response
      } else {
        userData = response
      }
      
      return {
        success: true,
        data: userData
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return {
        success: false,
        error: error.message || 'Usuario no encontrado'
      }
    }
  }

  // POST - Crear nuevo usuario
  static async createUser(userData) {
    try {
      console.log('➕ Creando nuevo usuario:', userData.email)
      
      const newUser = {
        name: userData.name,
        lastname: userData.lastname || '',
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        image: userData.image || '',
        role: userData.role || 'user'
      }
      
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.REGISTER,
        newUser,
        false
      )
      
      let createdUser = null
      if (response && response.data) {
        createdUser = response.data
      } else {
        createdUser = response
      }
      
      return {
        success: true,
        data: createdUser,
        message: 'Usuario creado exitosamente'
      }
    } catch (error) {
      console.error('Error al crear usuario:', error)
      return {
        success: false,
        error: error.message || 'Error al crear usuario'
      }
    }
  }

  // PUT - Actualizar usuario (tu backend usa PUT /:id)
  static async updateUser(id, userData) {
    try {
      console.log(`✏️ Actualizando usuario ID: ${id}`)
      console.log('📝 Datos a enviar:', userData)
      
      // Usar el endpoint correcto: /users/:id (sin "update/")
      const endpoint = API_CONFIG.ENDPOINTS.USER_UPDATE.replace(':id', id)
      
      // Limpiar datos undefined y solo enviar los que tienen valor
      const updateData = {}
      if (userData.name !== undefined && userData.name !== '') updateData.name = userData.name
      if (userData.lastname !== undefined) updateData.lastname = userData.lastname
      if (userData.email !== undefined && userData.email !== '') updateData.email = userData.email
      if (userData.password && userData.password !== '') updateData.password = userData.password
      if (userData.phone !== undefined) updateData.phone = userData.phone
      if (userData.image !== undefined) updateData.image = userData.image
      if (userData.role !== undefined) updateData.role = userData.role
      
      console.log('📦 Enviando PUT a:', endpoint)
      console.log('📦 Con datos:', updateData)
      
      const response = await httpService.put(endpoint, updateData, true)
      
      console.log('✅ Respuesta del servidor:', response)
      
      let updatedUser = null
      if (response && response.data) {
        updatedUser = response.data
      } else {
        updatedUser = response
      }
      
      return {
        success: true,
        data: updatedUser,
        message: 'Usuario actualizado exitosamente'
      }
    } catch (error) {
      console.error('❌ Error en updateUser:', error)
      return {
        success: false,
        error: error.message || 'Error al actualizar usuario'
      }
    }
  }

  // PATCH - Actualizar campo específico (usando el mismo endpoint PUT)
  static async patchUser(id, partialData) {
    try {
      console.log(`📝 Actualizando campo(s) de usuario ID: ${id}`, partialData)
      
      // Tu backend no tiene PATCH, usamos PUT con los datos parciales
      const endpoint = API_CONFIG.ENDPOINTS.USER_PATCH.replace(':id', id)
      
      console.log('📦 Enviando PUT (como PATCH) a:', endpoint)
      console.log('📦 Con datos:', partialData)
      
      const response = await httpService.put(endpoint, partialData, true)
      
      console.log('✅ Respuesta del servidor:', response)
      
      let patchedUser = null
      if (response && response.data) {
        patchedUser = response.data
      } else {
        patchedUser = response
      }
      
      return {
        success: true,
        data: patchedUser,
        message: 'Campo actualizado correctamente'
      }
    } catch (error) {
      console.error('❌ Error en patchUser:', error)
      return {
        success: false,
        error: error.message || 'Error al actualizar campo'
      }
    }
  }

  // DELETE - Eliminar usuario
  static async deleteUser(id) {
    try {
      console.log(`🗑️ Eliminando usuario ID: ${id}`)
      
      const endpoint = API_CONFIG.ENDPOINTS.USER_DELETE.replace(':id', id)
      const response = await httpService.delete(endpoint, true)
      
      return {
        success: true,
        message: 'Usuario eliminado exitosamente',
        data: response
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      return {
        success: false,
        error: error.message || 'Error al eliminar usuario'
      }
    }
  }
}

export default UserModel