// src/services/httpService.js
import API_CONFIG from '../config/api'

class HttpService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('auth_token')
  }

  // Configurar headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return headers
  }

  // Manejar errores de respuesta
  async handleResponse(response) {
    console.log('📡 Response status:', response.status)
    
    if (!response.ok) {
      let errorMessage = `Error HTTP: ${response.status}`
      try {
        const error = await response.json()
        errorMessage = error.message || error.error || errorMessage
      } catch (e) {
        errorMessage = await response.text() || errorMessage
      }
      throw new Error(errorMessage)
    }
    
    if (response.status === 204) {
      return null
    }
    
    const data = await response.json()
    console.log('📡 Response data:', data)
    return data
  }

  // POST request (más importante para login)
  async post(endpoint, data, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`📡 POST a: ${url}`)
      console.log('📡 Datos enviados:', data)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data)
      })
      
      console.log('📡 Status:', response.status)
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`❌ POST ${endpoint} error:`, error)
      throw error
    }
  }

  // GET request
  async get(endpoint, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`📡 GET: ${url}`)
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(includeAuth)
      })
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error)
      throw error
    }
  }

  // PUT request
  async put(endpoint, data, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data)
      })
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error)
      throw error
    }
  }

  // DELETE request
  async delete(endpoint, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(includeAuth)
      })
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error)
      throw error
    }
  }
}

export default new HttpService()