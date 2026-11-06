// src/models/AuthModel.js
import httpService from '../services/httpService'
import storageService from '../services/storageService'
import jwtService from '../services/jwtService'
import API_CONFIG from '../config/api'

class AuthModel {
  static async login(credentials) {
    try {
      console.log('🔐 Enviando login a API real:', credentials.email)
      console.log('🔐 URL completa:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`)
      
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.LOGIN,
        {
          email: credentials.email,
          password: credentials.password
        },
        false
      )
      
      console.log('📦 Respuesta COMPLETA del login:', JSON.stringify(response, null, 2))
      
      // Verificar si la respuesta es exitosa
      if (!response.success) {
        console.error('❌ La API respondió con success=false:', response.message)
        return {
          success: false,
          error: response.message || 'Error en el servidor'
        }
      }
      
      // Los datos del usuario están en response.data
      const userDataFromApi = response.data
      
      if (!userDataFromApi) {
        console.error('❌ No se encontró response.data')
        return {
          success: false,
          error: 'Error en la respuesta del servidor: no hay datos'
        }
      }
      
      console.log('👤 userDataFromApi:', userDataFromApi)
      
      const sessionToken = userDataFromApi.session_token
      
      if (!sessionToken) {
        console.error('❌ No se encontró session_token')
        return {
          success: false,
          error: 'Error al obtener token de autenticación'
        }
      }
      
      let token = sessionToken
      if (sessionToken && sessionToken.startsWith('JWT ')) {
        token = sessionToken.substring(4)
      }
      
      console.log('✅ Token extraído correctamente')
      
      storageService.setToken(token)
      
      const userData = {
        id: userDataFromApi.id,
        email: userDataFromApi.email,
        name: userDataFromApi.name || userDataFromApi.email.split('@')[0],
        lastname: userDataFromApi.lastname || '',
        role: userDataFromApi.role || 'user',
        phone: userDataFromApi.phone || '',
        image: userDataFromApi.image || ''
      }
      
      storageService.setUser(userData)
      
      if (userData.role) {
        storageService.setUserRole(userData.role)
      }
      
      console.log('✅ Login exitoso, usuario guardado:', userData.email)
      
      return {
        success: true,
        token: token,
        user: userData
      }
      
    } catch (error) {
      console.error('❌ Error en login:', error)
      return {
        success: false,
        error: error.message || 'Error de conexión con el servidor'
      }
    }
  }

  static async register(userData) {
    try {
      console.log('📝 Registrando usuario:', userData.email)
      
      const userToCreate = {
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
        userToCreate,
        false
      )
      
      console.log('✅ Respuesta registro:', response)
      
      if (!response.success) {
        return {
          success: false,
          error: response.message || 'Error al registrar usuario'
        }
      }
      
      const createdUser = response.data || response
      
      return {
        success: true,
        user: createdUser,
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

  static async logout() {
    try {
      storageService.clearSession()
      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: error.message }
    }
  }

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

  static getCurrentUser() {
    return storageService.getUser()
  }

  static getCurrentToken() {
    return storageService.getToken()
  }
}

export default AuthModel