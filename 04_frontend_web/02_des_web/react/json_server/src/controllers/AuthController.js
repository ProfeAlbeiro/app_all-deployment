// src/controllers/AuthController.js
import AuthModel from '../models/AuthModel'

class AuthController {
  // Manejar login
  static async handleLogin(credentials, onSuccess, onError) {
    try {
      console.log('🔧 AuthController: Procesando login para:', credentials.email)
      
      // Validar que los campos no estén vacíos
      if (!credentials.email || !credentials.password) {
        onError('Por favor complete todos los campos')
        return
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(credentials.email)) {
        onError('Por favor ingrese un email válido')
        return
      }
      
      // Intentar login con el backend
      const result = await AuthModel.login(credentials)
      
      console.log('📊 Resultado del login:', result)
      
      if (result.success) {
        onSuccess(result.user, result.token)
      } else {
        onError(result.error || 'Credenciales incorrectas')
      }
    } catch (error) {
      console.error('❌ Error en handleLogin:', error)
      onError('Error al conectar con el servidor')
    }
  }
  
  // Manejar registro de usuario
  static async handleRegister(userData, onSuccess, onError) {
    try {
      console.log('🔧 AuthController: Procesando registro para:', userData.email)
      
      // Validaciones
      if (!userData.email || !userData.password || !userData.name) {
        onError('Por favor complete todos los campos')
        return
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        onError('Por favor ingrese un email válido')
        return
      }
      
      if (userData.password.length < 6) {
        onError('La contraseña debe tener al menos 6 caracteres')
        return
      }
      
      const result = await AuthModel.register(userData)
      
      console.log('📊 Resultado del registro:', result)
      
      if (result.success) {
        onSuccess(result.user)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error('❌ Error en handleRegister:', error)
      onError('Error al registrar usuario')
    }
  }
  
  // Manejar logout
  static async handleLogout(onSuccess, onError) {
    try {
      const result = await AuthModel.logout()
      if (result.success) {
        onSuccess()
      } else {
        onError(result.error || 'Error al cerrar sesión')
      }
    } catch (error) {
      onError('Error al cerrar sesión')
    }
  }
  
  // Obtener estado de autenticación
  static getAuthState() {
    return {
      isAuthenticated: AuthModel.isAuthenticated(),
      currentUser: AuthModel.getCurrentUser(),
      currentToken: AuthModel.getCurrentToken()
    }
  }
  
  // Verificar autenticación
  static async checkAuth() {
    const isValid = AuthModel.isAuthenticated()
    if (!isValid) {
      await AuthModel.logout()
    }
    return isValid
  }
}

export default AuthController