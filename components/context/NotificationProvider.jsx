'use client'

import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext(null)

export const useNotification = () => useContext(NotificationContext)

export default function NotificationProvider ({ children }) {
  const [notifications, setNotifications] = useState([])

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}
