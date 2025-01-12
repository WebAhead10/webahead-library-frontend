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
import OpenSeadragon from 'openseadragon'

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

      setCurrentlyHovered(+id)

      const elements = document.getElementsByClassName(id)
      for (var i = 0; i < elements.length; i++) {
        if (overlayIndex === i) {
          elements[i].style.backgroundColor = 'rgba(0,0,255,0.45)'
          break
        }

        // if overlayIndex is not provided, go to next element
        if (overlayIndex !== undefined) {
          continue
        }

        elements[i].style.backgroundColor = 'rgba(0,0,255,0.45)'
      }
    },
    [editOverlayId]
  )

  const mouseEnterWrapper = useCallback((e) => {
    if (e.target.getAttribute('selected')) return

    const id = e.target.className.split(' ')[1]
    mouseEnterListener(id)
  }, [])

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

  const mouseOutWrapper = useCallback((e) => {
    // if the target element has the selected attribute, then do not change the background color
    if (e.target.getAttribute('selected')) return

    const id = e.target.className.split(' ')[1]
    mouseOutListener(id)
  }, [])

  const moveToOverlay = useCallback(
    (overlayData, overlayId) => {
      if (editOverlayId === overlayId) return
      if (!viewer) return
      const elements = document.getElementsByClassName(overlayId)

      if (!elements.length) return
      if (elements[0].getAttribute('selected')) return

      // from the main wrapper get the selected overlay id
      // and undo the changes
      const mainWrapper = document.getElementById('main-wrapper')
      const previousSelectedOverlayId = mainWrapper.getAttribute('selected')

      if (overlayId && previousSelectedOverlayId && +previousSelectedOverlayId !== +overlayId) {
        const prevElements = document.getElementsByClassName(previousSelectedOverlayId)

        for (var i = 0; i < prevElements.length; i++) {
          prevElements[i].style.backgroundColor = 'rgba(0,0,255,0.15)'
          prevElements[i].style.border = 'none'
          prevElements[i].removeAttribute('selected')
        }
      }

      const { x, y, width, height } = overlayData

      const rect = new OpenSeadragon.Rect(x, y, width, height)

      viewer.viewport.fitBounds(rect)

      for (var j = 0; j < elements.length; j++) {
        // add attribute to indicate that the overlay is selected
        elements[j].setAttribute('selected', 'true')

        elements[j].style.backgroundColor = 'rgba(0,0,0,0)'
        elements[j].style.border = '1px solid red'
      }

      setCurrentlyHovered(null)
      setEditOverlayId(+overlayId)
      // to main wrapper add attribute to indicate of the selected overlayid
      document.getElementById('main-wrapper').setAttribute('selected', overlayId)
    },
    [viewer, editOverlayId]
  )

  const moveToOverlayWrapper = useCallback(
    (e) => {
      const id = e.target.className.split(' ')[1]
      const overlay = JSON.parse(e.target.getAttribute('overlay'))
      if (overlay.status === 'closed') return
      moveToOverlay(overlay, id)
    },
    [viewer]
  )

  useEffect(() => {
    try {
      if (!articles.pages) return
      if (!viewer) return

      const addCoords = (coords, articleId, status) => {
        coords.forEach(({ overlay, id: overlayId }) => {
          const overlayElement = document.createElement('div')
          overlayElement.style.cursor = 'pointer'
          overlay.status = status
          overlayElement.setAttribute('class', `overlay ${articleId}`)
          overlayElement.setAttribute('id', overlayId)
          overlayElement.setAttribute('overlay', JSON.stringify(overlay))
          overlayElement.style.backgroundColor = 'rgba(0,0,255,0.15)'

          overlayElement.addEventListener('mouseenter', mouseEnterWrapper)

          overlayElement.addEventListener('mouseout', mouseOutWrapper)

          new OpenSeadragon.MouseTracker({
            element: overlayElement,
            clickHandler: function (event) {
              if (status === 'closed') return
              moveToOverlay(overlay, articleId)
            }
          }).setTracking(true)

          viewer.addOverlay(overlayElement, new OpenSeadragon.Rect(overlay.x, overlay.y, overlay.width, overlay.height))
        })
      }

      const updateListener = (articleId) => {
        const elements = document.getElementsByClassName(articleId)

        for (var i = 0; i < elements.length; i++) {
          elements[i].removeEventListener('mouseenter', mouseEnterWrapper)
          elements[i].removeEventListener('mouseout', mouseOutWrapper)
          elements[i].removeEventListener('click', moveToOverlayWrapper)

          elements[i].addEventListener('mouseenter', mouseEnterWrapper)
          elements[i].addEventListener('mouseout', mouseOutWrapper)
          elements[i].addEventListener('click', moveToOverlayWrapper)
        }
      }

      const coordsArr = articles.pages

      coordsArr.forEach(({ coords, id: articleId, status }) => {
        const elements = document.getElementsByClassName(articleId)

        if (elements.length && elements.length === coords.length) {
          updateListener(articleId)
          return
        }

        if (elements.length && elements.length !== coords.length) {
          for (var i = 0; i < elements.length; i++) {
            setTimeout(() => {
              viewer.removeOverlay(elements[i].id)
            }, 10 * i)
            // elements[i]?.remove()
          }

          // setOverlays((prevOverlays) => prevOverlays.filter(({ id }) => id !== articleId))
        }

        addCoords(coords, articleId, status)
      })
    } catch (error) {
      console.log(error)
    }
  }, [
    viewer,
    articles.pages,
    mouseEnterListener,
    mouseOutListener,
    moveToOverlay,
    mouseEnterWrapper,
    mouseOutWrapper,
    moveToOverlayWrapper
  ])

  // fetch the newspaper/document
  useEffect(() => {
    const newspaperId = params.id
    fetchNewspaper(newspaperId)

    // scroll all way down smoothly after half second
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 500)

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
        overlayElement.classList.add('overlay')

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

        // add class unsaved to the overlay
        element.classList.add('unsaved')

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

      // remove all elements with class unsaved
      const unsavedElements = document.getElementsByClassName('unsaved')

      for (var i = 0; i < unsavedElements.length; i++) {
        viewer.removeOverlay(unsavedElements[i])
      }
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

  const updateOverlaySizing = (id, x, y, width, height) => {
    const overlayElement = document.getElementById(id)
    const overlay = JSON.parse(overlayElement.getAttribute('overlay'))
    overlay.x = x
    overlay.y = y
    overlay.width = width
    overlay.height = height
    overlayElement.setAttribute('overlay', JSON.stringify(overlay))

    viewer.updateOverlay(overlayElement, new OpenSeadragon.Rect(x, y, width, height))
  }

  return (
    <div className={style['edit-entity-container']} id="main-wrapper">
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
              وضع التنقل
            </Button>
            <Button
              onClick={() => updateDrawingStatus(STATUS_DRAWING, false)}
              disabled={editStatus === STATUS_DRAWING}
              type="primary"
              size="large"
            >
              وضع الرسم
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
          updateOverlaySizing={updateOverlaySizing}
          currentlyHovered={currentlyHovered}
          setEditOverlayId={setEditOverlayId}
          editOverlayId={editOverlayId}
          refetch={refetch}
          removeOverlay={removeOverlay}
        />
        <div id="openSeaDragon" className={style['edit-entity-viewer']} />
        {editOverlayId && (
          <EditDataSidebar editOverlayId={editOverlayId} editStatus={editStatus} refreshCoords={() => refetch()} />
        )}
      </div>
      <br />
      <Space>
        <Button type="primary" size="large" onClick={() => onSubmit(overlays, params.id)}>
          إدخـال
        </Button>
        <Button type="primary" size="large" onClick={drawOverly}>
          إرسـم
        </Button>
      </Space>
    </div>
  )
}

export default EditEntity
