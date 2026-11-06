// src/hooks/useUsers.js
import { useState, useEffect } from 'react'
import UserController from '../controllers/UserController'

const useUsers = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar todos los usuarios
  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    
    UserController.getAllUsers(
      (data) => {
        setUsers(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
  }

  // Obtener usuario por ID
  const getUserById = async (id) => {
    setLoading(true)
    
    UserController.getUserById(
      id,
      (data) => {
        setSelectedUser(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
  }

  // Crear usuario
  const createUser = async (userData) => {
    return new Promise((resolve, reject) => {
      UserController.createUser(
        userData,
        (data) => {
          loadUsers() // Recargar lista
          resolve({ success: true, data })
        },
        (err) => {
          reject({ success: false, error: err })
        }
      )
    })
  }

  // Actualizar usuario completo (PUT)
  const updateUser = async (id, userData) => {
    return new Promise((resolve, reject) => {
      UserController.updateUser(
        id,
        userData,
        (data) => {
          loadUsers()
          resolve({ success: true, data })
        },
        (err) => {
          reject({ success: false, error: err })
        }
      )
    })
  }

  // Actualizar campo específico (PATCH)
  const patchUser = async (id, partialData) => {
    return new Promise((resolve, reject) => {
      UserController.patchUser(
        id,
        partialData,
        (data) => {
          loadUsers()
          resolve({ success: true, data })
        },
        (err) => {
          reject({ success: false, error: err })
        }
      )
    })
  }

  // Eliminar usuario
  const deleteUser = async (id) => {
    return new Promise((resolve, reject) => {
      UserController.deleteUser(
        id,
        () => {
          loadUsers()
          resolve({ success: true })
        },
        (err) => {
          reject({ success: false, error: err })
        }
      )
    })
  }

  // Cargar usuarios al montar el hook
  useEffect(() => {
    loadUsers()
  }, [])

  return {
    users,
    selectedUser,
    loading,
    error,
    loadUsers,
    getUserById,
    createUser,
    updateUser,
    patchUser,
    deleteUser
  }
}

export default useUsers