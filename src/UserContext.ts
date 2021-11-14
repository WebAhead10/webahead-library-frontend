import { createContext } from 'react'

export interface UserContextType {
  month: string
  year: string
  newspaper: string
  publisherId: number | null
}

interface ContextArg {
  setValue: Function
  value: UserContextType
}

export const UserContext = createContext<ContextArg>({
  setValue: (obj: UserContextType) => null,
  value: {
    month: '',
    year: '',
    newspaper: '',
    publisherId: null
  }
})
