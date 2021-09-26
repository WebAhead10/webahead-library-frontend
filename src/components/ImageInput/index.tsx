/* eslint-disable no-undef */
import React from 'react'
import axios from 'axios'
import Dropzone from './Dropzone'
import { v4 as uuidv4 } from 'uuid'

let pdfjs = require('pdfjs-dist')
pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry.js')

interface ImageInputProps {
  height: string
  width: string
  onError: Function
  onChange: Function
  setDocumentId: Function
  documentId: number
}

interface pdfPage {
  getViewport(data: Object): { height: number; width: number }
  render(data: Object): { _internalRenderTask: { callback: Function } }
}

interface PageResult {
  data: { documentId: number }
}

const ImageInput = ({ height, width, onError, onChange, setDocumentId, documentId }: ImageInputProps) => {
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const documentName = `${Date.now()}-${uuidv4()}`

  const upload = async (files: string[]) => {
    try {
      // save the first page to prepare the db for the rest of the pages
      const result = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, {
        file: files[0],
        index: 0,
        isNewspaper: true,
        documentName
      })

      if (!result.data.success) {
        onError(result.data.message)
        setLoading(false)
      }

      const pagesResult: PageResult[] = await Promise.all(
        files.slice(1).map((file, i: number) =>
          axios.post(`${process.env.REACT_APP_API_URL}/upload`, {
            file,
            // add 1 to the index just so the page numbers would be correct
            index: i + 1,
            documentName: documentName,
            id: result.data.documentId,
            isNewspaper: true,
            isNewPage: true
          })
        )
      )

      if (pagesResult.every(({ data }: any) => data.success)) {
        console.log(pagesResult[0])
        onChange(pagesResult[0].data.documentId)
        setDocumentId(pagesResult[0].data.documentId)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const prepareUpload = (file: Blob) => {
    if (file.size > 50000000) {
      return setError('File should be below 5mb')
    }

    setLoading(true)

    pdfjs.disableWorker = false

    var reader = new FileReader() || {}

    reader.onload = async function (e) {
      try {
        const pdfData = atob((reader.result as string).split(',')[1])

        const pdf = await pdfjs.getDocument({
          data: pdfData
        }).promise
        console.log(1)

        var pagesImage = new Array(pdf.numPages).fill('')

        //   render the pdf onto a canvas so we can convert them into png images
        const renderPage = (pageNumber: number, canvas: HTMLCanvasElement) => {
          // read the pdf page
          pdf.getPage(pageNumber).then(function (page: pdfPage) {
            let viewport = page.getViewport({ scale: 2.5 })
            canvas.height = viewport.height
            canvas.width = viewport.width

            // render in onto a canvas
            var pageRendering = page.render({
              canvasContext: canvas.getContext('2d'),
              viewport: viewport
            })

            var completeCallback = pageRendering._internalRenderTask.callback
            pageRendering._internalRenderTask.callback = async function (error: any) {
              completeCallback.call(this, error)
              // turn the canvas to an image
              let image = await canvas.toDataURL('image/png', 1.0)
              pagesImage[pageNumber - 1] = image
              canvas.remove()

              if (pagesImage.every((x) => x)) {
                upload(pagesImage)
              }
            }
          })
        }

        // loop over the pdf pages
        for (let page = 1; page <= pdf.numPages; page++) {
          let canvas = document.createElement('canvas')
          renderPage(page, canvas)
        }
      } catch (error) {
        console.log(error)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div>
      <Dropzone
        value={documentId}
        width={width}
        height={height}
        prepareUpload={prepareUpload}
        loading={loading}
        error={!!error}
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  )
}

export default ImageInput
