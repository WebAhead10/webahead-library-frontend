/* eslint-disable no-undef */
import React from "react"
import axios from "axios"
import Dropzone from "./Dropzone"

const ImageInput = ({ height, width, text, fileTypes, onError, onChange }) => {
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const upload = async (files) => {
    try {
      const newspaperName = "Haaretz_5_july_1918_" + Date.now()
      // save the first page to prepare the db for the rest of the pages
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        {
          file: files[0],
          index: 0,
          publisher_id: 2,
          published_date: "2021-09-05",
          newspaperName: "HAREEAT",
        }
      )

      if (!result.data.success) {
        onError(result.data.message)
        setLoading(false)
      }

      const pagesResult = await Promise.all(
        files.slice(1).map((file, i) =>
          axios.post(`${process.env.REACT_APP_API_URL}/upload`, {
            file,
            // add 1 to the index just so the page numbers would be correct
            index: i + 1,
            publisher_id: 2,
            published_date: "2021-09-05",
            newspaperName: "HAREEAT",
            isNewPage: true,
          })
        )
      )

      if (pagesResult.every(({ data }) => data.success)) {
        console.log(pagesResult[0])
        onChange(pagesResult[0].data.newspaperId)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const prepareUpload = (file) => {
    if (file.size > 50000000) {
      return setError("File should be below 5mb")
    }

    setLoading(true)

    pdfjsLib.disableWorker = false

    var reader = new FileReader()

    reader.onload = async function (e) {
      try {
        const pdfData = atob(reader.result.split(",")[1])
        const pdf = await pdfjsLib.getDocument({
          data: pdfData,
        }).promise
        var pagesImage = new Array(pdf.numPages).fill("")

        // loop over the pdf pages
        for (let page = 1; page <= pdf.numPages; page++) {
          let canvas = document.createElement("canvas")
          renderPage(page, canvas)
        }

        //   render the pdf onto a canvas so we can convert them into png images
        function renderPage(pageNumber, canvas) {
          // read the pdf page
          pdf.getPage(pageNumber).then(function (page) {
            let viewport = page.getViewport({ scale: 2.5 })
            canvas.height = viewport.height
            canvas.width = viewport.width

            // render in onto a canvas
            var pageRendering = page.render({
              canvasContext: canvas.getContext("2d"),
              viewport: viewport,
            })

            var completeCallback = pageRendering._internalRenderTask.callback

            pageRendering._internalRenderTask.callback = async function (
              error
            ) {
              completeCallback.call(this, error)
              // turn the canvas to an image
              let image = await canvas.toDataURL("image/png", 1.0)
              pagesImage[pageNumber - 1] = image
              canvas.remove()

              if (pagesImage.every((x) => x)) {
                upload(pagesImage)
              }
            }
          })
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
        width={width}
        height={height}
        prepareUpload={prepareUpload}
        text={text}
        fileTypes={fileTypes}
        loading={loading}
        error={error}
      />
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  )
}

export default ImageInput
