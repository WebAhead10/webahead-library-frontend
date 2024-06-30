/* eslint-disable no-undef */
import { useState, useEffect, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import style from './style.module.css'
import OverlayDataSider from './components/OverlayDataSider'
import { EditOutlined } from '@ant-design/icons'
import { userAtom } from 'utils/recoil/atoms'
import { useRecoilValue } from 'recoil'
import { IUser } from 'types'
import { Button } from 'antd'

const ViewNewsPaper = () => {
  const [viewer, setViewer] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const params = useParams<{
    id: string
  }>()
  const history = useHistory()
  const user = useRecoilValue<IUser>(userAtom)

  const fetchNewspaper = async (id) => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/document/single/${id}`)

      if (!result.data.success) throw new Error('Failed')

      const bucketRoot = 'https://library-documents.s3.eu-central-1.amazonaws.com/documents'

      viewer && viewer.destroy()
      setViewer(
        OpenSeadragon({
          id: 'openSeaDragon',
          tileSources: result.data.pages.map(
            ({ name, pagename, newspaperkey }) => `${bucketRoot}/${newspaperkey}/${pagename}/${pagename}.dzi`
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

  const mouseEnterListener = (selectedId) => {
    const elements = document.getElementsByClassName(selectedId) as HTMLCollectionOf<HTMLElement>
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = 'rgba(0,0,255,0.3)'
    }
  }

  const mouseOutListener = (selectedId) => {
    const elements = document.getElementsByClassName(selectedId) as HTMLCollectionOf<HTMLElement>

    for (var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = 'rgba(0, 0, 0, 0.15)'
    }
  }

  const resetOverlaysToOriginal = useCallback((coords, skipId) => {
    coords.forEach(({ coords, id }) => {
      const overlays = document.getElementsByClassName(id) as HTMLCollectionOf<HTMLElement>

      if (id === skipId) return

      for (var i = 0; i < overlays.length; i++) {
        overlays[i].style.border = '1px solid rgba(0,0,0,0)'
        overlays[i].style.backgroundColor = 'rgba(0,0,0,0.15)'
      }

      const mouseEnter = () => mouseEnterListener(id)
      const mouseLeave = () => mouseOutListener(id)

      for (var j = 0; j < overlays.length; j++) {
        overlays[j].addEventListener('mouseenter', mouseEnter)
        overlays[j].addEventListener('mouseout', mouseLeave)

        // eslint-disable-next-line no-loop-func
        overlays[j].addEventListener('click', () => {
          const elements = document.getElementsByClassName(id) as HTMLCollectionOf<HTMLElement>
          for (var i = 0; i < overlays.length; i++) {
            elements[i].removeEventListener('mouseenter', mouseEnter)
            elements[i].removeEventListener('mouseout', mouseLeave)
            elements[i].style.backgroundColor = 'rgba(0,0,0,0)'
            elements[i].style.border = '1px solid rgba(255,0,0,0.6)'
          }
          setSelectedId(id)
        })
      }
    })
  }, [])

  const fetchCoords = useCallback(
    async (id) => {
      // get the coords id from the url
      // const coordsId = para
      const query = new URLSearchParams(history.location.search)
      let coordsIdToHighlight = []

      const rawCoordsId = query.get('coords')
      if (rawCoordsId) {
        coordsIdToHighlight = rawCoordsId.split('$').map((coord) => `overlay_${coord}`)
      }

      try {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/overlay/coords/${id}`)
        if (!result.data.success) throw new Error('Failed')

        // coordsArr are the list of articles
        // each article is split into multiple coords or overlays
        const coordsArr = result.data.pages
        coordsArr.forEach(({ coords, id }) => {
          // for each overlay, create a div element and add it to the viewer
          coords.forEach(({ overlay, id: overlayId }) => {
            const overlayElement = document.createElement('div')
            overlayElement.style.cursor = 'pointer'
            overlayElement.setAttribute('class', `overlay ${id}`)

            if (coordsIdToHighlight.includes(overlayId)) {
              overlayElement.style.border = '1px solid red'
            }

            viewer.addOverlay(
              overlayElement,
              new OpenSeadragon.Rect(overlay.x, overlay.y, overlay.width, overlay.height)
            )
          })

          // after adding all the overlays, add event listeners to each overlay
          const overlays = document.getElementsByClassName(id)
          const mouseEnter = () => mouseEnterListener(id)
          const mouseLeave = () => mouseOutListener(id)

          for (var j = 0; j < overlays.length; j++) {
            // first add the mouse enter that will highlight the overlay
            overlays[j].addEventListener('mouseenter', mouseEnter)

            // then add the mouse leave that will remove the highlight
            overlays[j].addEventListener('mouseout', mouseLeave)

            // then add the click event that will set the selected id (id of the article)
            // and then remove the mouse enter and mouse leave event listeners from all the overlays
            // that belong to the same article
            // eslint-disable-next-line no-loop-func
            overlays[j].addEventListener('click', () => {
              resetOverlaysToOriginal(coordsArr, id)
              const elements = document.getElementsByClassName(id) as HTMLCollectionOf<HTMLElement>
              for (var i = 0; i < overlays.length; i++) {
                elements[i].removeEventListener('mouseenter', mouseEnter)
                elements[i].removeEventListener('mouseout', mouseLeave)
                elements[i].style.backgroundColor = 'rgba(0,0,0,0)'
                elements[i].style.border = '1px solid rgba(255,0,0,0.6)'
              }
              setSelectedId(id)
            })
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    [history.location.search, resetOverlaysToOriginal, viewer]
  )

  useEffect(() => {
    const newspaperId = params.id
    if (viewer) {
      fetchCoords(newspaperId)
    }
  }, [viewer])

  const hasAnyEditPermission =
    (user.role === 'contributor' && user.permissions.includes('overlay-cut')) ||
    user.role === 'admin' ||
    (user.role === 'contributor' && user.permissions.includes('overlay-text')) ||
    (user.role === 'contributor' && user.permissions.includes('overlay-tag'))

  return (
    <div className={style['main-container']}>
      <div
        id="openSeaDragon"
        style={{
          border: selectedId ? '2px solid blue' : '1px solid black',
          height: '100vh',
          width: '85vw',
          margin: 'auto'
        }}
      />
      {hasAnyEditPermission ? (
        <div className={style.editOverlays}>
          <Button
            style={{
              width: '100%',
              marginBottom: '10px'
            }}
            onClick={() => {
              history.push(`/edit/newspaper/${params.id}`)
            }}
            icon={<EditOutlined />}
          >
            Edit mode
          </Button>
        </div>
      ) : (
        ''
      )}
      {selectedId && (
        <OverlayDataSider
          overlayId={selectedId}
          documentId={+params.id}
          close={() => {
            // When the sidebar is closed, I want to reset the article overlays
            const elements = document.getElementsByClassName(selectedId) as HTMLCollectionOf<HTMLElement>
            const mouseEnter = () => mouseEnterListener(selectedId)
            const mouseLeave = () => mouseOutListener(selectedId)

            // first add back the listeners that were removed when the article was selected
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener('mouseenter', mouseEnter)
              elements[i].addEventListener('mouseout', mouseLeave)
              elements[i].style.border = '1px solid rgba(0,0,0,0)'
              elements[i].style.backgroundColor = 'rgba(0,0,0,0.15)'

              // create a click listener that will remove the mouse enter and mouse leave listeners
              // when the article is selected again
              // eslint-disable-next-line no-loop-func
              const onClick = () => {
                const elements = document.getElementsByClassName(selectedId) as HTMLCollectionOf<HTMLElement>

                for (var i = 0; i < elements.length; i++) {
                  elements[i].removeEventListener('mouseenter', mouseEnter)
                  elements[i].removeEventListener('mouseout', mouseLeave)
                  elements[i].style.backgroundColor = 'rgba(0,0,0,0)'
                  elements[i].style.border = '1px solid rgba(255,0,0,0.6)'
                }
                setSelectedId(selectedId)
              }

              // remove click listeners from elements[i] if they exist
              // so that we don't add multiple click listeners to the same element
              elements[i].removeEventListener('click', onClick)

              // add click listeners to elements[i]
              elements[i].addEventListener('click', onClick)
            }

            setSelectedId(null)
          }}
        />
      )}
    </div>
  )
}

export default ViewNewsPaper
