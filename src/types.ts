export interface IUser {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
}

export interface IMainCategory {
  id: number
  name: string
  logo: string
  viewType: string
}

export interface ITagInput {
  id: number
  name: string
}

export interface IDocument {
  category: string
  date: string
  tags: ITagInput[]
  id: number | null
  name: string
  publishedDate?: string
  categoryId?: number
}

export interface IpdfPage {
  getViewport(data: Object): { height: number; width: number }
  render(data: Object): { _internalRenderTask: { callback: Function } }
}

export interface INewspaperParams {
  categoryId: string
  year: string
  month: string
}

export interface IRandomKeys {
  [key: string]: string
}

export interface IViewTypeRadio {
  value: string
  label: string
}
