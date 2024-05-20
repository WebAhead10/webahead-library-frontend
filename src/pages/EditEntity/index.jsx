/* eslint-disable no-undef */
import { message, Button, Space } from 'antd'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'utils/axios'
import { v4 as uuidv4 } from 'uuid'
import Sidebar from './components/Sidebar'
import EditDataSidebar from './components/EditDataSidebar'
import style from './style.module.css'
import { useOverlayCoords } from '../../api-hooks/overlay.hooks'

const STATUS_NAVIGATING = 'nagivating'
const STATUS_DRAWING = 'drawing'
const STATUS_DRAWING_NAV = 'drawing-navigation'

const EditEntity = () => {
  const [viewer, setViewer] = useState(null)
  const [overlays, setOverlays] = useState([])
  const [currentlyHovered, setCurrentlyHovered] = useState(null)
  const params = useParams()
  const [mouseTracker, setMouseTracker] = useState(null)
  const [editStatus, setEditStatus] = useState(STATUS_NAVIGATING)
  const [editOverlayId, setEditOverlayId] = useState(null)

  const { data: articles = {}, refetch } = useOverlayCoords(params.id)

  var drag

  const fetchNewspaper = useCallback(
    async (id) => {
      try {
        const result = await axios.get(`/document/single/${id}`)

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
    },
    [viewer]
  )

  const mouseEnterListener = useCallback(
    (id, overlayIndex) => {
      if (editOverlayId && editOverlayId === id) {
        const elements = document.getElementsByClassName(id)
        for (var j = 0; j < elements.length; j++) {
          elements[j].style.backgroundColor = 'rgba(0,0,0,0)'
        }

        return
      }

      setCurrentlyHovered(id)

      const elements = document.getElementsByClassName(id)
      for (var i = 0; i < elements.length; i++) {
        if (overlayIndex === i) {
          elements[i].style.backgroundColor = 'rgba(0,0,255,0.45)'
          break
        }

        elements[i].style.backgroundColor = 'rgba(0,0,255,0.45)'
      }
    },
    [editOverlayId]
  )

  const mouseOutListener = useCallback(
    (id, overlayIndex) => {
      if (editOverlayId && editOverlayId === id) {
        const elements = document.getElementsByClassName(id)
        for (var j = 0; j < elements.length; j++) {
          elements[j].style.backgroundColor = 'rgba(0,0,0,0)'
        }

        return
      }

      const elements = document.getElementsByClassName(id)

      setCurrentlyHovered(null)

      for (var i = 0; i < elements.length; i++) {
        if (overlayIndex === i) {
          elements[i].style.backgroundColor = 'rgba(0,0,255,0.15)'
          break
        }

        elements[i].style.backgroundColor = 'rgba(0,0,255,0.15)'
      }
    },
    [editOverlayId]
  )

  const moveToOverlay = useCallback(
    (overlayData, overlayId) => {
      if (editOverlayId && overlayId !== editOverlayId) {
        const prevElements = document.getElementsByClassName(editOverlayId)

        for (var i = 0; i < prevElements.length; i++) {
          prevElements[i].style.backgroundColor = 'rgba(0,0,255,0.15)'
          prevElements[i].style.border = 'none'
        }
      }

      const { x, y, width, height } = overlayData

      const rect = new OpenSeadragon.Rect(x, y, width, height)

      viewer.viewport.fitBounds(rect)

      const elements = document.getElementsByClassName(overlayId)

      for (var j = 0; j < elements.length; j++) {
        elements[j].style.backgroundColor = 'rgba(0,0,0,0)'
        elements[j].style.border = '1px solid red'
      }

      setCurrentlyHovered(null)
      setEditOverlayId(overlayId)
    },
    [viewer, editOverlayId]
  )

  useEffect(() => {
    try {
      if (!articles.pages) return

      const addCoords = (coords, id) => {
        coords.forEach(({ overlay }) => {
          const overlayElement = document.createElement('div')
          overlayElement.style.cursor = 'pointer'
          overlayElement.setAttribute('class', `overlay ${id}`)

          overlayElement.addEventListener('mouseenter', () => {
            mouseEnterListener(id)
          })

          overlayElement.addEventListener('mouseout', () => {
            mouseOutListener(id)
          })

          overlayElement.addEventListener('click', () => {
            moveToOverlay(overlay, id)
          })

          viewer.addOverlay(overlayElement, new OpenSeadragon.Rect(overlay.x, overlay.y, overlay.width, overlay.height))
        })
      }

      const updateListener = (id) => {
        const elements = document.getElementsByClassName(id)

        const currentOverlaysData = articles.pages.find((article) => article.id === id).coords

        for (var i = 0; i < elements.length; i++) {
          elements[i].removeEventListener('mouseenter', mouseEnterListener)
          elements[i].removeEventListener('mouseout', mouseOutListener)
          elements[i].removeEventListener('click', moveToOverlay)

          elements[i].addEventListener('mouseenter', () => {
            mouseEnterListener(id)
          })

          elements[i].addEventListener('mouseout', () => {
            mouseOutListener(id)
          })

          const overlay = currentOverlaysData[i].overlay

          elements[i].addEventListener('click', () => {
            moveToOverlay(overlay, id)
          })
        }
      }

      const coordsArr = articles.pages

      coordsArr.forEach(({ coords, id }) => {
        const elements = document.getElementsByClassName(id)

        if (elements.length) {
          updateListener(id)
          return
        }

        addCoords(coords, id)
      })
    } catch (error) {
      console.log(error)
    }
  }, [viewer, articles.pages, mouseEnterListener, mouseOutListener, moveToOverlay])

  // fetch the newspaper/document
  useEffect(() => {
    const newspaperId = params.id
    fetchNewspaper(newspaperId)

    return () => {
      viewer && viewer.destroy()
    }
  }, [])

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

      // fetchCoords(params.id)
      refetch()
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
        <Space direction="vertical" size={1}>
          <br />
          <Space>
            <Button
              onClick={() => updateDrawingStatus(STATUS_DRAWING_NAV, true)}
              disabled={editStatus === STATUS_DRAWING_NAV}
              type="primary"
              size="large"
            >
              Enable mouse
            </Button>
            <Button
              onClick={() => updateDrawingStatus(STATUS_DRAWING, false)}
              disabled={editStatus === STATUS_DRAWING}
              type="primary"
              size="large"
            >
              Enable Draw
            </Button>
          </Space>
          <br />
        </Space>
      )}
      <div className={style.editWrapper}>
        <Sidebar
          articles={articles.pages}
          mouseEnterListener={mouseEnterListener}
          mouseOutListener={mouseOutListener}
          moveToOverlay={moveToOverlay}
          editStatus={editStatus}
          updateOverlayCoords={(articleId) => {
            onSubmit(overlays, params.id, articleId)
          }}
          currentlyHovered={currentlyHovered}
          setEditOverlayId={setEditOverlayId}
          editOverlayId={editOverlayId}
          refreshCoords={() => refetch()}
        />
        <div id="openSeaDragon" className={style['edit-entity-viewer']} />
        {editOverlayId && (
          <EditDataSidebar editOverlayId={editOverlayId} editStatus={editStatus} refreshCoords={() => refetch()} />
        )}
      </div>
      <br />
      <Space>
        <Button type="primary" size="large" onClick={() => onSubmit(overlays, params.id)}>
          Submit
        </Button>
        <Button type="primary" size="large" onClick={drawOverly}>
          Draw
        </Button>
        {/* <Button type="primary" size="large" onClick={() => history.push(`/view/document/${params.id}`)}>
          Manage texts
        </Button> */}
      </Space>
    </div>
  )
}

export default EditEntity
