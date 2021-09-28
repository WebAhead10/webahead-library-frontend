interface Publisher {
  id: number
  name: string
}

interface TagInput {
  id: number
  name: string
}

interface Document_ {
  publisher: string
  date: string
  tags: TagInput[]
  documentId: number | null
}

interface pdfPage {
  getViewport(data: Object): { height: number; width: number }
  render(data: Object): { _internalRenderTask: { callback: Function } }
}
