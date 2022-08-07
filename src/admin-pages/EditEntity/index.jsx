/* eslint-disable no-undef */
import { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import './style.css'

const STATUS_NAVIGATING = 'nagivating'
const STATUS_DRAWING = 'drawing'
const STATUS_DRAWING_NAV = 'drawing-navigation'

const EditEntity = () => {
  const [viewer, setViewer] = useState(null)
  const [overlays, setOverlays] = useState([])
  const params = useParams()
  const history = useHistory()
  const [mouseTracker, setMouseTracker] = useState(null)
  const [error, setError] = useState('')
  const [editStatus, setEditStatus] = useState(STATUS_NAVIGATING)

  const fetchNewspaper = async (id) => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/newspaper/${id}`)

      if (!result.data.success) throw new Error('Failed')

      const bucketRoot = 'https://library-documents.s3.eu-central-1.amazonaws.com/documents'

      viewer && viewer.destroy()
      setViewer(
        OpenSeadragon({
          id: 'openSeaDragon',
          tileSources: result.data.pages.map(
            ({ name, pagename }) => `${bucketRoot}/${pagename.split('_')[0]}/${pagename}/${pagename}.dzi`
          ),
          animationTime: 0.5,
          immediateRender: true,
          wrapHorizontal: false,
          collectionMode: true,
          collectionRows: 1,
          collectionTileMargin: -150,
          collectionLayout: 'horizontal',
          showNavigator: false,
          gestureSettingsMouse: { clickToZoom: false }
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

  var drag

  const drawOverly = () => {
    if (!viewer || editStatus !== STATUS_NAVIGATING) return null

    viewer.setMouseNavEnabled(false)
    setEditStatus(STATUS_DRAWING)

    const mouseTrackerListeners = new OpenSeadragon.MouseTracker({
      element: viewer.element,
      pressHandler: function (event) {
        const overlayElement = document.createElement('div')
        overlayElement.style.background = 'rgba(255, 0, 0, 0.3)'
        overlayElement.setAttribute('id', `overlay_${uuidv4()}`)

        overlayElement.ondblclick = () => {
          removeOverlay(overlayElement.id.split('_')[1])
        }

        const viewportPos = viewer.viewport.pointFromPixel(event.position)

        viewer.addOverlay(overlayElement, new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0))

        drag = {
          overlayElement: overlayElement,
          startPos: viewportPos
        }
      },

      dragHandler: function (event) {
        if (!drag) return

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
        // the bounds property also contains some methods, which might be useful
        // in the future, maybe not save but to have more control over
        // a specific overlay

        const lastIndex = viewer.currentOverlays.length - 1
        const {
          bounds: { x, y, height = 0, width = 0 },
          element
        } = viewer.currentOverlays[lastIndex] || { bounds: {} }

        if (width < 10 || height < 10) {
          removeOverlay(element.id.split('_')[1])
          return
        }

        const newOverlay = { x, y, height, width }

        setOverlays((prevOverlays) => [
          ...prevOverlays,
          {
            overlay: newOverlay,
            id: element.id,
            saved: false
          }
        ])
      }
    })

    setMouseTracker(mouseTrackerListeners)
  }

  const onSubmit = async (overlays, id) => {
    if (!overlays.length) return

    try {
      const res = await axios.post(process.env.REACT_APP_API_URL + '/overlay/coords/' + id, {
        overlays: overlays
          .filter(({ saved }) => !saved)
          .map((overlay) => ({
            ...overlay,
            saved: undefined
          }))
      })

      if (!res.data.success) {
        setError(res.data.message)
        return
      }

      setOverlays((prevOverlays) =>
        prevOverlays.map((overlay) => {
          const overlayElement = document.getElementById(overlay.id)

          overlayElement.style.background = 'rgba(0, 0, 255, 0.3)'
          overlayElement.ondblclick = () => { }

          return { ...overlay, saved: true, rendered: false }
        })
      )
      // alert("added successfully")
      mouseTracker.destroy()

      drag = null
      viewer.setMouseNavEnabled(true)
      setEditStatus(STATUS_NAVIGATING)
      console.log('saved')
    } catch (err) {
      setError('Error has occured')
      console.error(err)
    }
  }

  const removeOverlay = (overlayId) => {
    viewer.removeOverlay(`overlay_${overlayId}`)

    setOverlays((prevOverlays) => prevOverlays.filter(({ id }) => id !== `overlay_${overlayId}`))
  }

  const updateDrawingStatus = (status, enableMouse) => {
    setEditStatus(status)
    viewer.setMouseNavEnabled(enableMouse)
  }

  return (
    <div className="edit-entity-container">
      {editStatus !== STATUS_NAVIGATING && (
        <div>
          <button
            onClick={() => updateDrawingStatus(STATUS_DRAWING_NAV, true)}
            disabled={editStatus === STATUS_DRAWING_NAV}
            className="button edit-entity-button"
          >
            Enable mouse
          </button>
          <button
            onClick={() => updateDrawingStatus(STATUS_DRAWING, false)}
            disabled={editStatus === STATUS_DRAWING}
            className="button edit-entity-button"
          >
            Enable Draw
          </button>
        </div>
      )}
      <div id="openSeaDragon" className="edit-entity-viewer" />
      <button onClick={() => onSubmit(overlays, params.id)} className="button edit-entity-button">
        Submit
      </button>
      <button className="button edit-entity-button" onClick={drawOverly}>
        Draw
      </button>
      <button className="button edit-entity-button" onClick={() => history.push(`/view/document/${params.id}`)}>
        Manage texts
      </button>
    </div>
  )
}

export default EditEntity
