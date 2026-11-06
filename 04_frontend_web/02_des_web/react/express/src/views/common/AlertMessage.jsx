// src/views/common/AlertMessage.jsx
import { useEffect, useState } from 'react'

const AlertMessage = ({ type, message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) setTimeout(onClose, 300)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}>
          ×
        </button>
      )}
    </div>
  )
}

export default AlertMessage