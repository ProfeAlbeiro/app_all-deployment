// src/models/DashboardModel.js
class DashboardModel {
  // Obtener estadísticas del dashboard
  static async getStats() {
    try {
      // Simular delay de red
      await this._simulateNetworkDelay()
      
      // Datos simulados
      return {
        activeUsers: Math.floor(Math.random() * 1000) + 500,
        todayVisits: Math.floor(Math.random() * 200) + 50,
        activeSessions: Math.floor(Math.random() * 100) + 20,
        successRate: Math.floor(Math.random() * 30) + 70,
        lastUpdate: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      return null
    }
  }
  
  // Obtener actividades recientes
  static async getRecentActivities() {
    try {
      await this._simulateNetworkDelay()
      
      return [
        { id: 1, action: 'Usuario inició sesión', time: 'Hace 5 minutos', type: 'login' },
        { id: 2, action: 'Dashboard actualizado', time: 'Hace 10 minutos', type: 'update' },
        { id: 3, action: 'Nuevo usuario registrado', time: 'Hace 30 minutos', type: 'register' },
        { id: 4, action: 'Reporte generado', time: 'Hace 1 hora', type: 'report' }
      ]
    } catch (error) {
      console.error('Error al obtener actividades:', error)
      return []
    }
  }
  
  // Simular delay de red
  static _simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, 500))
  }
}

export default DashboardModel