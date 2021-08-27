/* eslint-disable no-undef */
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./style.css"

const findCenterPoint = function (arr) {
  var x = arr.map(({ x }) => x)
  var y = arr.map(({ y }) => y)
  var cx = (Math.min(...x) + Math.max(...x)) / 2
  var cy = (Math.min(...y) + Math.max(...y)) / 2
  return [cx, cy]
}

const EditEntity = () => {
  const [viewer, setViewer] = useState(null)
  const [cropMode, setCropMode] = useState(false)
  const [coords, setCoords] = useState([])
  const params = useParams()

  const fetchNewspaper = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/newspaper/${id}`
      )

      if (!result.data.success) throw new Error("Failed")

      const bucketRoot =
        "https://feuerstein-form-website-uploads.s3.eu-central-1.amazonaws.com/misc"

      viewer && viewer.destroy()
      setViewer(
        OpenSeadragon({
          id: "openSeaDragon",
          tileSources: result.data.pages.map(
            ({ name, pagename }) =>
              `${bucketRoot}/${name}/${pagename}/${pagename}.dzi`
          ),
          animationTime: 0.5,
          immediateRender: true,
          wrapHorizontal: false,
          collectionMode: true,
          collectionRows: 1,
          collectionTileMargin: -150,
          collectionLayout: "horizontal",
          showNavigator: false,
          gestureSettingsMouse: { clickToZoom: false },
        })
      )
    } catch (error) {
      console.log(error)
    }
  }

  // Setup the viewer and the viewer's options
  useEffect(() => {
    const newspaperId = params.id
    fetchNewspaper(newspaperId)

    return () => {
      viewer && viewer.destroy()
    }
  }, [])

  // Adds a click event for the viewer to get the coords
  useEffect(() => {
    const canvasClickHandler = function (event) {
      if (cropMode) {
        var { x, y } = viewer.viewport.pointFromPixel(event.position)

        setCoords((prevCoords) => [
          ...prevCoords,
          {
            x: Math.round((x + Number.EPSILON) * 100) / 100,
            y: Math.round((y + Number.EPSILON) * 100) / 100,
          },
        ])
      }
    }

    if (viewer) {
      viewer.removeHandler("canvas-click", canvasClickHandler)
      viewer.addHandler("canvas-click", canvasClickHandler)
    }
  }, [viewer, cropMode])

  const onCropModeClip = () => {
    if (cropMode) {
      const overlay = document.createElement("div")
      overlay.classList.add("overlay")

      const minLeft = Math.min(...coords.map(({ x }) => x))
      const minTop = Math.min(...coords.map(({ y }) => y))
      const maxLeft = Math.max(...coords.map(({ x }) => x))
      const maxTop = Math.max(...coords.map(({ y }) => y))

      viewer.addOverlay(
        overlay,
        new OpenSeadragon.Rect(
          minLeft,
          minTop,
          maxLeft - minLeft,
          maxTop - minTop
        )
      )
      setCoords([])
    }
    setCropMode(!cropMode)
  }

  return (
    <div>
      <div
        id="openSeaDragon"
        style={{
          height: "75vh",
          width: "85vw",
          margin: "auto",
        }}
      />

      <button onClick={onCropModeClip}>Crop mode</button>
    </div>
  )
}

export default EditEntity
