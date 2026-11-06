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
      
      // Intentar login con la API real
      const result = await AuthModel.login(credentials)
      
      console.log('📊 Resultado del login:', result)
      
      if (result.success) {
        // result.user ahora incluye: id, email, name, lastname, role, phone, image
        // result.token es el JWT real firmado por el backend
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
      if (!userData.email || !userData.password || !userData.name || !userData.lastname) {
        onError('Por favor complete todos los campos obligatorios (nombre, apellido, email, contraseña)')
        return
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        onError('Por favor ingrese un email válido')
        return
      }
      
      if (userData.password.length < 5) {
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
  
  // Verificar autenticación (útil para rutas protegidas)
  static async checkAuth() {
    const isValid = AuthModel.isAuthenticated()
    if (!isValid) {
      await AuthModel.logout()
    }
    return isValid
  }
  
  // NUEVO: Obtener el rol del usuario actual
  static getUserRole() {
    const user = AuthModel.getCurrentUser()
    return user?.role || null
  }
  
  // NUEVO: Verificar si el usuario tiene un rol específico
  static hasRole(requiredRole) {
    const userRole = this.getUserRole()
    return userRole === requiredRole
  }
  
  // NUEVO: Verificar si el usuario tiene alguno de los roles permitidos
  static hasAnyRole(allowedRoles) {
    const userRole = this.getUserRole()
    return allowedRoles.includes(userRole)
  }
}

export default AuthController