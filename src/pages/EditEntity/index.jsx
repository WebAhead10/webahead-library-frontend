/* eslint-disable no-undef */
import { useState, useEffect, useCallback } from "react"
import { useParams, useHistory } from "react-router-dom"
import axios from "axios"
import "./style.css"

// const findCenterPoint = function (arr) {
//   var x = arr.map(({ x }) => x)
//   var y = arr.map(({ y }) => y)
//   var cx = (Math.min(...x) + Math.max(...x)) / 2
//   var cy = (Math.min(...y) + Math.max(...y)) / 2
//   return [cx, cy]
// }

const EditEntity = () => {
  const [viewer, setViewer] = useState(null)
  const [cropMode, setCropMode] = useState(false)
  const [coords, setCoords] = useState([])
  const [cropModeDots, setCropModeDots] = useState([])
  const [articleOverlays, setArticleOverlays] = useState([])
  const [final, setFinal] = useState([])

  const params = useParams()
  const history = useHistory()

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
              `${bucketRoot}/${
                pagename.split("_")[0]
              }/${pagename}/${pagename}.dzi`
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

  useEffect(() => {
    const newspaperId = params.id
    fetchNewspaper(newspaperId)

    return () => {
      viewer && viewer.destroy()
    }
  }, [])
  var selectionMode = true

  // reset the choices

  const hassan = () => {
    var drag
    viewer.setMouseNavEnabled(false)

    new OpenSeadragon.MouseTracker({
      element: viewer.element,
      pressHandler: function (event) {
        if (!selectionMode) {
          return
        }

        var overlayElement = document.createElement("div")
        overlayElement.style.background = "rgba(255, 0, 0, 0.3)"
        var viewportPos = viewer.viewport.pointFromPixel(event.position)
        viewer.addOverlay(
          overlayElement,
          new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0)
        )

        drag = {
          overlayElement: overlayElement,
          startPos: viewportPos,
        }
      },

      dragHandler: function (event) {
        if (!drag) {
          return
        }
        var viewportPos = viewer.viewport.pointFromPixel(event.position)
        var diffX = viewportPos.x - drag.startPos.x
        var diffY = viewportPos.y - drag.startPos.y

        var location = new OpenSeadragon.Rect(
          Math.min(drag.startPos.x, drag.startPos.x + diffX),
          Math.min(drag.startPos.y, drag.startPos.y + diffY),
          Math.abs(diffX),
          Math.abs(diffY)
        )

        viewer.updateOverlay(drag.overlayElement, location)

        setArticleOverlays((prevCoords) => [...prevCoords, location])
      },
      releaseHandler: function (event) {
        drag = null
        selectionMode = true
        viewer.setMouseNavEnabled(false)

        setArticleOverlays((prevCoords) => {
          setFinal((pp) => [...pp, prevCoords[prevCoords.length - 1]])
          return []
        })
      },
    })
  }
  const unique = new Set(final)
  const uniqueArray = [...unique]

  const onSubmit = () => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "/newspaper/coords/" + params.id,
        uniqueArray
      )
      .then((res) => {
        if (!res.data.success) throw new Error("Failed")
      })
      .catch((err) => {
        console.log(err.response.data.message)
      })
    alert("added successfully ya habibi")
    history.push("/")
  }

  const reset = () => {
    while (uniqueArray.length > 0) {
      uniqueArray.shift()
    }
    if (selectionMode) {
      document.querySelectorAll("div").forEach(function (a) {
        a.remove()
      })
    }
  }
  const showmeresult = () => {
    console.log(uniqueArray)
  }

  return (
    <div>
      <div
        id="openSeaDragon"
        style={{
          border: cropMode ? "6px solid red" : "1px solid black",
          height: "75vh",
          width: "85vw",
          margin: "auto",
        }}
      />

      <button
        onClick={() => setCropMode(!cropMode)}
        style={{ marginTop: "30px" }}
      >
        Crop mode
      </button>
      <button onClick={onSubmit} style={{ marginTop: "30px" }}>
        submit
      </button>
      <button onClick={reset} style={{ marginTop: "30px" }}>
        reset
      </button>
      <button onClick={hassan} style={{ marginTop: "30px" }}>
        draw
      </button>
      <button onClick={showmeresult} style={{ marginTop: "30px" }}>
        show
      </button>
    </div>
  )
}

export default EditEntity
