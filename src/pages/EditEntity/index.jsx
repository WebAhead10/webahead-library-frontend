/* eslint-disable no-undef */
import { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import GestureIcon from "@material-ui/icons/Gesture"
import DeleteIcon from "@material-ui/icons/Delete"
import SendIcon from "@material-ui/icons/Send"
import { useParams } from "react-router-dom"
import "./style.css"
import axios from "axios"

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
}))
const EditEntity = () => {
  const classes = useStyles()
  const [viewer, setViewer] = useState(null)
  const [result, setResult] = useState([])
  const [counter, setCounter] = useState(0)
  const params = useParams()
  const [dragon, setDragon] = useState(null)

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
  console.log(viewer)

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

    const dragonRef = new OpenSeadragon.MouseTracker({
      element: viewer.element,
      pressHandler: function (event) {
        if (!selectionMode) {
          return
        }
        var overlayElement = document.createElement("div")
        overlayElement.style.background = "rgba(255, 0, 0, 0.3)"
        overlayElement.setAttribute("id", `shape_${counter}`)
        overlayElement.style.cursor = "pointer"
        overlayElement.ondblclick = () => {
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
      },
      releaseHandler: function (event) {
        drag = null
        selectionMode = false
        viewer.setMouseNavEnabled(true)

        setResult([...result, viewer.currentOverlays[counter].bounds])
        setCounter(counter + 1)
      },
    })

    setDragon(dragonRef)
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
    alert("added successfully")
  }

  const reset = () => {
    while (viewer.currentOverlays.length > 0) {
      viewer.currentOverlays.pop().destroy()
    }
    raiseEvent("clear-overlay", {})
    dragon.destroy()
    setCounter(0)
    return viewer
  }

  const getHandler = (eventName) => {
    var events = viewer.events[eventName]
    if (!events || !events.length) {
      return null
    }
    events = events.length === 1 ? [events[0]] : Array.apply(null, events)
    return function (args) {
      var i,
        length = events.length
      for (i = 0; i < length; i++) {
        if (events[i]) {
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

      handler(eventArgs)
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
          height: "50vh",
          width: "100vw",
          margin: "auto",
        }}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={onSubmit}
        endIcon={<SendIcon />}
      >
        <span style={{ marginLeft: "10px" }}>Submit</span>
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={reset}
        startIcon={<DeleteIcon />}
      >
        <span style={{ marginRight: "10px" }}>Reset All</span>
      </Button>

      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<GestureIcon />}
        onClick={drawOverly}
      >
        <span style={{ marginRight: "10px" }}>Draw</span>
      </Button>
    </div>
  )
}

export default EditEntity
