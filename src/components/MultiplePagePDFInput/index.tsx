/* eslint-disable no-undef */
import React from 'react'
import axios from 'utils/axios'
import Dropzone from '../ImageDropzone'
import { v4 as uuidv4 } from 'uuid'
import { IpdfPage } from 'types'

// This needs to be require and not as an import for typescript to work on
// the package's methods and properties
let pdfjs = require('pdfjs-dist')
pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry.js')

interface ImageInputProps {
  height: string
  width: string
  onError(msg: string): void
  onChange(id: number): void
  setPageCount(): void
  documentId: number | null
  pageCount: number
}

interface PageResult {
  data: { documentId: number }
}

const ImageInput = ({ height, width, onError, onChange, documentId, setPageCount, pageCount }: ImageInputProps) => {
  const [error, setError] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const documentName = `${Date.now()}-${uuidv4()}`

  const sendPage = async (file: string, index: number, isNewPage: boolean, documentId: number) => {
    try {
      const res = await axios.post(`/upload`, {
        file,
        // add 1 to the index just so the page numbers would be correct
        index: index + 1,
        documentName: documentName,
        id: documentId,
        isNewspaper: true,
        isNewPage: true
      })

      return res.data.success
    } catch (err) {
      console.log(err)
    }
  }

  const upload = async (files: string[]) => {
    try {
      // save the first page to prepare the db for the rest of the pages
      const result = await axios.post(`/upload`, {
        file: files[0],
        index: 0,
        isNewspaper: true,
        documentName
      })

      if (!result.data.success) {
        onError(result.data.message)
        setLoading(false)
      }

      // remove the first page
      let restOfFiles = files.slice(1)

      // send the rest of the pages but wait for each one to finish before sending the next one
      // this is to prevent the server from getting overloaded
      // also check if all the pages were uploaded successfully
      // and if they were then update the document id
      for (let i = 0; i < restOfFiles.length; i++) {
        const success = await sendPage(restOfFiles[i], i, true, result.data.documentId)

        if (!success) {
          onError('Failed to upload page')
          setLoading(false)
          return
        }

        setPageCount()
      }

      onChange(result.data.documentId)
      setLoading(false)

      // for (let i = 0; i < dataFile.length; i++) {
      //   await sendPage(() => {
      //     console.log('done')

      //   },dataFile[i],i,true,result.data.documentId)
      // }

      // const pagesResult: PageResult[] = await Promise.all(
      //   files.slice(1).map((file, i: number) =>
      //     axios.post(`/upload`, {
      //       file,
      //       // add 1 to the index just so the page numbers would be correct
      //       index: i + 1,
      //       documentName: documentName,
      //       id: result.data.documentId,
      //       isNewspaper: true,
      //       isNewPage: true
      //     })
      //   )
      // )

      // if (pagesResult.every(({ data }: any) => data.success)) {
      //   onChange(pagesResult[0].data.documentId)
      //   setLoading(false)
      // }
    } catch (err) {
      console.log(err)
    }
  }

  const prepareUpload = (file: Blob) => {
    if (file.size > 50000000) {
      return setError('File should be below 50mb')
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

        var pagesImage = new Array(pdf.numPages).fill('')

        //   render the pdf onto a canvas so we can convert them into png images
        const renderPage = (pageNumber: number, canvas: HTMLCanvasElement) => {
          // read the pdf page
          pdf.getPage(pageNumber).then(function (page: IpdfPage) {
            let viewport = page.getViewport({ scale: 2.5 })
            canvas.height = viewport.height
            canvas.width = viewport.width

            // render in onto a canvas
            var pageRendering = page.render({
              canvasContext: canvas.getContext('2d'),
              viewport: viewport
            })

            const completeCallback = pageRendering._internalRenderTask.callback
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
      {pageCount > 0 && (
        <span style={{ color: 'green', fontSize: '20px', fontWeight: 'bold' }}>{pageCount} pages uploaded</span>
      )}
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  )
}

export default ImageInput
