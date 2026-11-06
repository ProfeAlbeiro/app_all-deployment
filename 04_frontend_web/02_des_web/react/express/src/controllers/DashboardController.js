// src/controllers/DashboardController.js
import DashboardModel from '../models/DashboardModel'

class DashboardController {
  // Obtener estadísticas del dashboard
  static async getDashboardStats(onSuccess, onError) {
    try {
      const stats = await DashboardModel.getStats()
      if (stats) {
        onSuccess(stats)
      } else {
        onError('No se pudieron cargar las estadísticas')
      }
    } catch (error) {
      onError('Error al cargar las estadísticas')
    }
  }
  
  // Obtener actividades recientes
  static async getRecentActivities(onSuccess, onError) {
    try {
      const activities = await DashboardModel.getRecentActivities()
      onSuccess(activities)
    } catch (error) {
      onError('Error al cargar las actividades')
    }
  }
  
  // Actualizar estadísticas (simular actualización en tiempo real)
  static async refreshStats(onSuccess, onError) {
    try {
      const newStats = await DashboardModel.getStats()
      if (newStats) {
        onSuccess(newStats)
      } else {
        onError('No se pudieron actualizar las estadísticas')
      }
    } catch (error) {
      onError('Error al actualizar las estadísticas')
    }
  }
}

export default DashboardController