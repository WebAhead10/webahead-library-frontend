/* eslint-disable no-undef */
import { message } from 'antd'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'utils/axios'
import { v4 as uuidv4 } from 'uuid'
import Sidebar from './components/Sidebar'
import style from './style.module.css'

const STATUS_NAVIGATING = 'nagivating'
const STATUS_DRAWING = 'drawing'
const STATUS_DRAWING_NAV = 'drawing-navigation'

const EditEntity = () => {
  const [viewer, setViewer] = useState(null)
  const [overlays, setOverlays] = useState([])
  const [articles, setArticles] = useState([])
  const params = useParams()
  const history = useHistory()
  const [mouseTracker, setMouseTracker] = useState(null)
  const [editStatus, setEditStatus] = useState(STATUS_NAVIGATING)
  var drag

  const fetchNewspaper = useCallback(async (id) => {
    try {
      const result = await axios.get(`/newspaper/${id}`)

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
  }, [viewer])

  const mouseEnterListener = (id, overlayIndex) => {
    const elements = document.getElementsByClassName(id)
    for (var i = 0; i < elements.length; i++) {
      if (overlayIndex === i) {
        elements[i].style.backgroundColor = 'rgba(0,0,255,0.3)'
        break
      }

      if (typeof overlayIndex === 'undefined') {
        elements[i].style.backgroundColor = 'rgba(0,0,255,0.3)'
      }
    }
  }

  const mouseOutListener = (id, overlayIndex) => {
    const elements = document.getElementsByClassName(id)

    for (var i = 0; i < elements.length; i++) {
      if (overlayIndex === i) {
        elements[i].style.backgroundColor = 'rgba(0,0,255,0.15)'
        break
      }

      elements[i].style.backgroundColor = 'rgba(0,0,255,0.15)'
    }
  }

  const moveToOverlay = (x, y) => {
    const point = new OpenSeadragon.Point(x, y)
    viewer.viewport.goHome()
    viewer.viewport.panTo(point)
    viewer.viewport.zoomBy(4)
  }

  const fetchCoords = async (id) => {
    try {
      const result = await axios.get(`/overlay/coords/${id}`)
      setArticles(result.data.pages)

      if (!result.data.success) throw new Error('Failed')

      const coordsArr = result.data.pages

      viewer.clearOverlays()
      coordsArr.forEach(({ coords, id }) => {
        coords.forEach(({ overlay }) => {
          const overlayElement = document.createElement('div')
          overlayElement.style.cursor = 'pointer'
          overlayElement.setAttribute('class', `overlay ${id}`)

          overlayElement.addEventListener('mouseenter', () => mouseEnterListener(id))

          overlayElement.addEventListener('mouseout', () => mouseOutListener(id))

          // overlayElement.addEventListener('click', () => {
          //   const elements = document.getElementsByClassName(id)

          //   for (var i = 0; i < elements.length; i++) {
          //     elements[i].removeEventListener('mouseenter', mouseEnterListener)
          //     elements[i].removeEventListener('mouseout', mouseOutListener)
          //     elements[i].style.backgroundColor = 'rgba(0,0,0,0)'
          //   }

          //   setSelectedId(id)
          // })

          viewer.addOverlay(
            overlayElement,
            new OpenSeadragon.Rect(overlay.x, overlay.y, overlay.width, overlay.height)
          )
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  // fetch the newspaper/document
  useEffect(() => {
    const newspaperId = params.id
    fetchNewspaper(newspaperId)

    return () => {
      viewer && viewer.destroy()
    }
  }, [])

  useEffect(() => {
    const newspaperId = params.id
    if (viewer) {
      fetchCoords(newspaperId)
    }
  }, [viewer, params.id, fetchCoords])


  const drawOverly = () => {
    if (!viewer || editStatus !== STATUS_NAVIGATING) return null

    viewer.setMouseNavEnabled(false)
    setEditStatus(STATUS_DRAWING)

    // event liseners for drawing
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
        // Get the x y relative to the viewer
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
        // in the future, maybe not save but to have more control over a specific overlay

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

  const onSubmit = async (overlays, documentId, articleId) => {
    if (!overlays.length) return
    let url = '/overlay/coords/' + documentId

    try {
      if (articleId) {
        url = '/overlay/coords/update/' + articleId
      }

      const res = await axios.post(url, {
        overlays: overlays.filter(({ saved }) => !saved).map((overlay) => ({ ...overlay, saved: undefined }))
      })

      if (!res.data.success) {
        message.error(res.data.message)
        return
      }

      setOverlays([])
      mouseTracker.destroy()

      drag = null
      viewer.setMouseNavEnabled(true)
      setEditStatus(STATUS_NAVIGATING)

      fetchCoords(params.id)
    } catch (err) {
      message.error('Error has occured')
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
    <div className={style['edit-entity-container']}>
      {editStatus !== STATUS_NAVIGATING && (
        <div>
          <button
            onClick={() => updateDrawingStatus(STATUS_DRAWING_NAV, true)}
            disabled={editStatus === STATUS_DRAWING_NAV}
            className={`button ${style['edit-entity-button']}`}
          >
            Enable mouse
          </button>
          <button
            onClick={() => updateDrawingStatus(STATUS_DRAWING, false)}
            disabled={editStatus === STATUS_DRAWING}
            className={`button ${style['edit-entity-button']}`}
          >
            Enable Draw
          </button>
        </div>
      )}
      <div className={style.editWrapper}>
        <Sidebar
          articles={articles}
          mouseEnterListener={mouseEnterListener}
          mouseOutListener={mouseOutListener}
          moveToOverlay={moveToOverlay}
          refreshCoords={() => fetchCoords(params.id)}
          editStatus={editStatus}
          updateOverlayCoords={(articleId) => {
            onSubmit(overlays, params.id, articleId)
          }}
        />
        <div id="openSeaDragon" className={style['edit-entity-viewer']} />
      </div>
      <button onClick={() => onSubmit(overlays, params.id)} className={`button ${style['edit-entity-button']}`}>
        Submit
      </button>
      <button className={`button ${style['edit-entity-button']}`} onClick={drawOverly}>
        Draw
      </button>
      <button
        className={`button ${style['edit-entity-button']}`}
        onClick={() => history.push(`/view/document/${params.id}`)}
      >
        Manage texts
      </button>
    </div>
  )
}

export default EditEntity
