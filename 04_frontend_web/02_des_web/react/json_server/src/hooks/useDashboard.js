// src/hooks/useDashboard.js
import { useState } from 'react'
import DashboardController from '../controllers/DashboardController'

const useDashboard = () => {
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    
    DashboardController.getDashboardStats(
      (data) => {
        setStats(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
  }

  const loadActivities = async () => {
    DashboardController.getRecentActivities(
      (data) => {
        setActivities(data)
      },
      (err) => {
        console.error(err)
      }
    )
  }

  const refreshStats = async () => {
    DashboardController.refreshStats(
      (data) => {
        setStats(data)
      },
      (err) => {
        setError(err)
      }
    )
  }

  return {
    stats,
    activities,
    loading,
    error,
    loadStats,
    loadActivities,
    refreshStats
  }
}

export default useDashboard