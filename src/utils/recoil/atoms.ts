import { atom } from 'recoil'
import { IDocumentSearch } from './types'

export const userAtom = atom({
  key: 'user',
  default: {}
})

export const documentSearchAtom = atom({
  key: 'documentSearch',
  default: {} as IDocumentSearch
})
