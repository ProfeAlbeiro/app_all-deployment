// src/config/api.js
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000', // Tu JSON Server en puerto 3000
  TIMEOUT: 10000,
  ENDPOINTS: {
    LOGIN: '/login',     // Este endpoint puede no existir en JSON Server
    REGISTER: '/users',  // JSON Server usa /users para CRUD
    POSTS: '/posts',
    COMMENTS: '/comments',
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    ORDERS: '/orders',
    USERS: '/users'      // Este es el endpoint correcto para usuarios
  }
}

export default API_CONFIG