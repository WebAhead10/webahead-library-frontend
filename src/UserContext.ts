import { createContext } from "react"

export interface UserContextType {
  month: string
  year: string
  newspaper: string
}

interface ContextArg {
  setValue: Function
  value: UserContextType
}

export const UserContext = createContext<ContextArg>({
  setValue: (obj: UserContextType) => null,
  value: {
    month: "",
    year: "",
    newspaper: "",
  },
})
