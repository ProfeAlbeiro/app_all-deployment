// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import AuthController from '../controllers/AuthController'
import storageService from '../services/storageService'

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    checkAuth()
    
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const checkAuth = async () => {
    setLoading(true)
    const authState = AuthController.getAuthState()
    setIsAuthenticated(authState.isAuthenticated)
    setCurrentUser(authState.currentUser)
    setToken(authState.currentToken)
    setLoading(false)
  }

  const login = async (credentials) => {
    return new Promise((resolve, reject) => {
      AuthController.handleLogin(
        credentials,
        (user, authToken) => {
          setIsAuthenticated(true)
          setCurrentUser(user)
          setToken(authToken)
          resolve({ success: true, user, token: authToken })
        },
        (error) => {
          reject({ success: false, error })
        }
      )
    })
  }

  const register = async (userData) => {
    return new Promise((resolve, reject) => {
      AuthController.handleRegister(
        userData,
        (user) => {
          resolve({ success: true, user })
        },
        (error) => {
          reject({ success: false, error })
        }
      )
    })
  }

  const logout = async () => {
    return new Promise((resolve, reject) => {
      AuthController.handleLogout(
        () => {
          setIsAuthenticated(false)
          setCurrentUser(null)
          setToken(null)
          resolve({ success: true })
        },
        (error) => {
          reject({ success: false, error })
        }
      )
    })
  }

  return {
    isAuthenticated,
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    checkAuth
  }
}

export default useAuth