// src/services/jwtService.js
class JWTService {
  generateToken(payload) {
    try {
      console.log('🔐 Generando token para:', payload)
      
      const header = { alg: 'HS256', typ: 'JWT' }
      const encodedHeader = btoa(JSON.stringify(header))
      const encodedPayload = btoa(JSON.stringify(payload))
      const signature = btoa('fake_signature_' + Date.now())
      const token = `${encodedHeader}.${encodedPayload}.${signature}`
      
      console.log('✅ Token generado:', token.substring(0, 50) + '...')
      return token
    } catch (error) {
      console.error('Error al generar token:', error)
      return null
    }
  }
  
  verifyToken(token) {
    try {
      if (!token) return false
      
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      const payload = JSON.parse(atob(parts[1]))
      
      // 🔥 CORREGIDO: Verificación con tolerancia de 5 minutos
      if (payload.exp) {
        const now = Date.now()
        const expTime = payload.exp * 1000  // Convertir a milisegundos
        const tolerance = 5 * 60 * 1000    // 5 minutos de tolerancia
        
        if (expTime + tolerance < now) {
          console.warn('Token expirado (exp:', new Date(expTime), 'now:', new Date(now))
          return false
        }
      }
      
      console.log('✅ Token verificado correctamente')
      return true
    } catch (error) {
      console.error('Error al verificar token:', error)
      return false
    }
  }
  
  decodeToken(token) {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      const payload = JSON.parse(atob(parts[1]))
      return payload
    } catch (error) {
      console.error('Error al decodificar token:', error)
      return null
    }
  }
  
  getTokenRemainingTime(token) {
    try {
      const payload = this.decodeToken(token)
      if (!payload || !payload.exp) return 0
      const remainingTime = (payload.exp * 1000) - Date.now()
      return remainingTime > 0 ? remainingTime : 0
    } catch (error) {
      return 0
    }
  }
}

export default new JWTService()