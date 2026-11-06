// src/models/AuthModel.js
import httpService from '../services/httpService'
import storageService from '../services/storageService'
import jwtService from '../services/jwtService'
import API_CONFIG from '../config/api'

class AuthModel {
  // Iniciar sesión con tu JSON Server
  static async login(credentials) {
    try {
      console.log('🔐 Intentando login con:', credentials.email)
      
      // Obtener todos los usuarios y buscar por email
      const users = await httpService.get(API_CONFIG.ENDPOINTS.USERS, false)
      console.log('📋 Usuarios disponibles:', users)
      
      // Buscar usuario por email
      const user = users.find(u => u.email === credentials.email)
      
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        }
      }
      
      console.log('✅ Usuario encontrado:', user)
      
      // Para pruebas, aceptamos cualquier contraseña no vacía
      // NOTA: En producción, debes verificar con bcrypt
      if (!credentials.password || credentials.password.length < 1) {
        return {
          success: false,
          error: 'Contraseña incorrecta'
        }
      }
      
      // Generar token JWT usando el método correcto
      const token = jwtService.generateToken({
        id: user.id,
        email: user.email,
        name: user.email.split('@')[0],
        exp: Date.now() + 3600000 // 1 hora
      })
      
      if (!token) {
        return {
          success: false,
          error: 'Error al generar token de autenticación'
        }
      }
      
      // Guardar token y usuario
      storageService.setToken(token)
      storageService.setUser({
        id: user.id,
        email: user.email,
        name: user.email.split('@')[0]
      })
      
      return {
        success: true,
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.email.split('@')[0]
        }
      }
    } catch (error) {
      console.error('❌ Error en login:', error)
      return {
        success: false,
        error: error.message || 'Error de conexión con el servidor'
      }
    }
  }

  // Registrar nuevo usuario
  static async register(userData) {
    try {
      console.log('📝 Intentando registrar usuario:', userData.email)
      
      // Verificar si el usuario ya existe
      const users = await httpService.get(API_CONFIG.ENDPOINTS.USERS, false)
      
      const existingUser = users.find(u => u.email === userData.email)
      
      if (existingUser) {
        return {
          success: false,
          error: 'El correo electrónico ya está registrado'
        }
      }
      
      // Obtener el último ID para generar el siguiente
      const lastId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0
      const newId = lastId + 1
      
      // Crear nuevo usuario
      const newUser = {
        id: newId,
        email: userData.email,
        password: userData.password // En producción, deberías hashear
      }
      
      console.log('➕ Creando usuario:', newUser)
      
      // Enviar POST a JSON Server
      const response = await httpService.post(API_CONFIG.ENDPOINTS.USERS, newUser, false)
      
      console.log('✅ Usuario creado:', response)
      
      return {
        success: true,
        user: response,
        message: 'Usuario registrado exitosamente'
      }
    } catch (error) {
      console.error('❌ Error en registro:', error)
      return {
        success: false,
        error: error.message || 'Error al registrar usuario'
      }
    }
  }

  // Cerrar sesión
  static async logout() {
    try {
      storageService.clearSession()
      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: error.message }
    }
  }

  // Verificar si está autenticado
  static isAuthenticated() {
    const token = storageService.getToken()
    if (!token) return false
    
    const isValid = jwtService.verifyToken(token)
    
    if (!isValid) {
      storageService.clearSession()
      return false
    }
    
    return true
  }

  // Obtener usuario actual
  static getCurrentUser() {
    return storageService.getUser()
  }

  // Obtener token actual
  static getCurrentToken() {
    return storageService.getToken()
  }
}

export default AuthModel