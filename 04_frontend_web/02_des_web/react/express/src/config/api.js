// src/config/api.js

// 👇 Detecta si estamos en producción (Azure) o desarrollo local
const isProduction = import.meta.env.PROD;

// Reemplace [SU-NOMBRE-DE-APP-SERVICE-BACKEND] por el nombre de su backend en Azure
// Ejemplo: 'https://api-profe-albeiro-d0e5adcjb8adg7fu.chilecentral-01.azurewebsites.net/api'
const PROD_URL = 'https://api-project-deployment-b8hca8gdh7fvakfn.chilecentral-01.azurewebsites.net/api';
const DEV_URL = 'http://localhost:3000/api';

const API_CONFIG = {
  BASE_URL: isProduction ? PROD_URL : DEV_URL,
  TIMEOUT: 10000,
  ENDPOINTS: {
    LOGIN: '/users/login',
    REGISTER: '/users/create',
    USERS: '/users',
    USER_BY_ID: '/users/:id',
    USER_UPDATE: '/users/:id',
    USER_PATCH: '/users/:id',
    USER_DELETE: '/users/delete/:id'
  }
}

export default API_CONFIG