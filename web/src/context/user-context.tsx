'use client'

import {
  type ReactNode,
  createContext,
  useEffect,
  useState,
  useContext,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

interface UserValue {
  userId: string
  userName: string
  setUserName: (userName: string) => void
}

export const UserContext = createContext<UserValue>({
  userId: '',
  userName: '',
  setUserName: () => {},
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId] = useState(localStorage.getItem('userId') || uuidv4())
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || '',
  )

  useEffect(() => {
    localStorage.setItem('userName', userName)
  }, [userName])

  useEffect(() => {
    localStorage.setItem('userId', userId)
  }, [userId])

  return (
    <UserContext.Provider value={{ userId, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
