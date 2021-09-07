/* eslint-disable no-undef */
import { useState, useEffect } from "react"
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
  const [result, setResult] = useState([])
  const [counter, setCounter] = useState(0)
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
  const drawOverly = () => {
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
        overlayElement.setAttribute("id", `shape_${counter}`)
        overlayElement.onclick = () => {
          removeOverlay(overlayElement.id)
        }
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
        selectionMode = false
        viewer.setMouseNavEnabled(true)
        setResult([...result, viewer.currentOverlays[counter].bounds])
        setCounter(counter + 1)
      },
    })
  }

  const onSubmit = () => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "/newspaper/coords/" + params.id,
        result
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
    while (viewer.currentOverlays.length > 0) {
      viewer.currentOverlays.pop().destroy()
    }

    raiseEvent("clear-overlay", {})
    console.log(viewer.currentOverlays)
    return viewer
  }
  const showmeresult = () => {
    // //! TODO: Hassan, ask mario about the undefined situation that we talked about earlier
    console.log(viewer.currentOverlays)
  }

  const getHandler = (eventName) => {
    var events = viewer.events[eventName]
    if (!events || !events.length) {
      return null
    }
    events = events.length === 1 ? [events[0]] : Array.apply(null, events)
    return function (source, args) {
      var i,
        length = events.length
      for (i = 0; i < length; i++) {
        if (events[i]) {
          args.eventSource = source
          args.userData = events[i].userData
          events[i].handler(args)
        }
      }
    }
  }

  const raiseEvent = (eventName, eventArgs) => {
    var handler = getHandler(eventName)

    if (handler) {
      if (!eventArgs) {
        eventArgs = {}
      }

      handler(this, eventArgs)
    }
  }

  const removeOverlay = (i) => {
    var elem = document.getElementById(i)
    elem.parentElement.removeChild(elem)
    viewer.currentOverlays.splice(0, 1)

    raiseEvent("remove-overlay", {
      element: elem,
    })

    return viewer
  }
  return (
    <div>
      <div
        id="openSeaDragon"
        style={{
          border: "1px solid black",
          height: "75vh",
          width: "85vw",
          margin: "auto",
        }}
      />
      <button onClick={onSubmit} style={{ marginTop: "30px" }}>
        submit
      </button>
      <button onClick={reset} style={{ marginTop: "30px" }}>
        reset
      </button>
      <button onClick={drawOverly} style={{ marginTop: "30px" }}>
        draw
      </button>

      <button onClick={showmeresult} style={{ marginTop: "30px" }}>
        show
      </button>
    </div>
  )
}

export default EditEntity
