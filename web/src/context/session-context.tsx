'use client'

import { useRouter } from 'next/navigation'
import {
  useState,
  useEffect,
  useContext,
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import api from '@/lib/api'

type User = {
  id: string
  name: string
  email: string
}

type SessionContextProps = {
  user: User
  setUser: Dispatch<SetStateAction<User>>
}

const SessionContext = createContext<SessionContextProps>({
  user: {
    id: '',
    name: '',
    email: '',
  },
  setUser: () => null,
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const { push } = useRouter()

  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
  })

  const contextValue = {
    user,
    setUser,
  }

  const fetchUserByToken = async () => {
    try {
      const { data } = await api.get('/auth/validate-token')

      setUser(data)
      localStorage.setItem('session', JSON.stringify(data))
    } catch (error) {
      push('/login')
    }
  }

  useEffect(() => {
    const userSession = localStorage.getItem('session')

    if (!userSession) {
      fetchUserByToken()
    }

    setUser(JSON.parse(userSession as string))

    // eslint-disable-next-line
  }, [])

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession deve estar dentro do SessionProvider')
  }

  return context
}
