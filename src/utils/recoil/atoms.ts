import { atom } from 'recoil'
import { IUser } from 'types'
import { IDocumentSearch } from './types'

export const userAtom = atom({
  key: 'user',
  default: {} as IUser
})

export const documentSearchAtom = atom({
  key: 'documentSearch',
  default: {} as IDocumentSearch
})
