// src/services/jwtService.js
class JWTService {
  // Generar token JWT simulado
  generateToken(payload) {
    try {
      console.log('🔐 Generando token para:', payload)
      
      // Header del JWT
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      }
      
      // Codificar header y payload a Base64
      const encodedHeader = btoa(JSON.stringify(header))
      const encodedPayload = btoa(JSON.stringify(payload))
      
      // Firma simulada (en un caso real sería una firma criptográfica)
      const signature = btoa('fake_signature_' + Date.now())
      
      // Crear token
      const token = `${encodedHeader}.${encodedPayload}.${signature}`
      
      console.log('✅ Token generado:', token.substring(0, 50) + '...')
      return token
    } catch (error) {
      console.error('Error al generar token:', error)
      return null
    }
  }
  
  // Verificar token
  verifyToken(token) {
    try {
      if (!token) return false
      
      // Separar partes del token
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      // Decodificar payload
      const payload = JSON.parse(atob(parts[1]))
      
      // Verificar expiración
      if (payload.exp && payload.exp < Date.now()) {
        console.warn('Token expirado')
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error al verificar token:', error)
      return false
    }
  }
  
  // Decodificar token (sin verificar)
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
  
  // Obtener tiempo restante del token
  getTokenRemainingTime(token) {
    try {
      const payload = this.decodeToken(token)
      if (!payload || !payload.exp) return 0
      
      const remainingTime = payload.exp - Date.now()
      return remainingTime > 0 ? remainingTime : 0
    } catch (error) {
      return 0
    }
  }
}

export default new JWTService()