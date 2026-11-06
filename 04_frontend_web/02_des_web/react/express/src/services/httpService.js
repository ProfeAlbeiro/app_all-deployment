// src/services/httpService.js
import API_CONFIG from '../config/api'

class HttpService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  getToken() {
    return localStorage.getItem('auth_token')
  }

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

  async handleResponse(response) {
    console.log('📡 Response status:', response.status)
    
    let data = {}
    try {
      data = await response.json()
    } catch (e) {
      console.error('Error al parsear JSON:', e)
    }
    
    console.log('📡 Response data completa:', data)
    
    if (!response.ok) {
      const errorMessage = data.message || data.error || `Error HTTP: ${response.status}`
      throw new Error(errorMessage)
    }
    
    return data
  }

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

  async put(endpoint, data, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`📡 PUT a: ${url}`)
      console.log('📡 Datos enviados:', data)
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

  // NUEVO: Método PATCH
  async patch(endpoint, data, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`📡 PATCH a: ${url}`)
      console.log('📡 Datos enviados:', data)
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data)
      })
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`PATCH ${endpoint} error:`, error)
      throw error
    }
  }

  async delete(endpoint, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`📡 DELETE a: ${url}`)
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