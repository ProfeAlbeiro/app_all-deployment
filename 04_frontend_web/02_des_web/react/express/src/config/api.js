// src/config/api.js
const API_CONFIG = {
  BASE_URL: 'http://172.24.16.1:3000/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    LOGIN: '/users/login',
    REGISTER: '/users/create',
    USERS: '/users',
    USER_BY_ID: '/users/:id',
    USER_UPDATE: '/users/:id',        // ← CAMBIADO: tu backend usa PUT /:id
    USER_PATCH: '/users/:id',          // ← CAMBIADO: usaremos el mismo para PATCH
    USER_DELETE: '/users/delete/:id'
  }
}

export default API_CONFIG