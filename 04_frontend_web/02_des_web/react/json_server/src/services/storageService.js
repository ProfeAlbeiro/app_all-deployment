// src/services/storageService.js
class StorageService {
  constructor(storageType = 'localStorage') {
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage
    this.tokenKey = 'auth_token'
    this.userKey = 'user_data'
  }

  // Guardar token
  setToken(token) {
    console.log('💾 Guardando token en storage')
    return this.setItem(this.tokenKey, token)
  }

  // Obtener token
  getToken() {
    const token = this.getItem(this.tokenKey)
    console.log('🔑 Token obtenido:', token ? 'Sí existe' : 'No existe')
    return token
  }

  // Eliminar token
  removeToken() {
    console.log('🗑️ Eliminando token')
    return this.removeItem(this.tokenKey)
  }

  // Guardar usuario
  setUser(user) {
    console.log('💾 Guardando usuario en storage:', user)
    return this.setItem(this.userKey, JSON.stringify(user))
  }

  // Obtener usuario
  getUser() {
    const user = this.getItem(this.userKey)
    return user ? JSON.parse(user) : null
  }

  // Eliminar usuario
  removeUser() {
    return this.removeItem(this.userKey)
  }

  // Limpiar toda la sesión
  clearSession() {
    this.removeToken()
    this.removeUser()
  }

  // Guardar item
  setItem(key, value) {
    try {
      this.storage.setItem(key, value)
      return true
    } catch (error) {
      console.error('Error al guardar en storage:', error)
      return false
    }
  }

  // Obtener item
  getItem(key) {
    try {
      return this.storage.getItem(key)
    } catch (error) {
      console.error('Error al obtener del storage:', error)
      return null
    }
  }

  // Eliminar item
  removeItem(key) {
    try {
      this.storage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error al eliminar del storage:', error)
      return false
    }
  }

  // Limpiar todo
  clear() {
    try {
      this.storage.clear()
      return true
    } catch (error) {
      console.error('Error al limpiar storage:', error)
      return false
    }
  }

  // Verificar si existe
  hasItem(key) {
    return this.getItem(key) !== null
  }
}

export default new StorageService('localStorage')