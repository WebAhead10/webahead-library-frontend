export interface IUser {
  id: number
  name: string
  email: string
  role: string
}

export interface IPublisher {
  id: number
  name: string
  logo: string
}

export interface ITagInput {
  id: number
  name: string
}

export interface IDocument {
  publisher: string
  date: string
  tags: ITagInput[]
  documentId: number | null
}

export interface IpdfPage {
  getViewport(data: Object): { height: number; width: number }
  render(data: Object): { _internalRenderTask: { callback: Function } }
}

export interface INewspaperParams {
  publisherId: string
  year: string
  month: string
}

export interface IRandomKeys {
  [key: string]: string
}
