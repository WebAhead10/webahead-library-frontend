/* eslint-disable no-undef */
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import style from './style.module.css'
import OverlayDataSider from './components/OverlayDataSider'

const ViewNewsPaper = () => {
  const [viewer, setViewer] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const params = useParams()

  const fetchNewspaper = async (id) => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/document/${id}`)

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

  const fetchCoords = useCallback(
    async (id) => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/overlay/coords/${id}`)
        if (!result.data.success) throw new Error('Failed')

        const coordsArr = result.data.pages
        coordsArr.forEach(({ coords, id }) => {
          coords.forEach(({ overlay }) => {
            const overlayElement = document.createElement('div')
            overlayElement.style.cursor = 'pointer'
            overlayElement.setAttribute('class', `overlay ${id}`)

            const mouseEnterListener = () => {
              const elements = document.getElementsByClassName(id)
              for (var i = 0; i < elements.length; i++) {
                elements[i].style.backgroundColor = 'rgba(0,0,255,0.3)'
              }
            }

            overlayElement.addEventListener('mouseenter', mouseEnterListener)

            const mouseOutListener = () => {
              const elements = document.getElementsByClassName(id)

              for (var i = 0; i < elements.length; i++) {
                elements[i].style.backgroundColor = 'rgba(0,0,255,0.0)'
              }
            }

            overlayElement.addEventListener('mouseout', mouseOutListener)

            overlayElement.addEventListener('click', () => {
              const elements = document.getElementsByClassName(id)

              for (var i = 0; i < elements.length; i++) {
                elements[i].removeEventListener('mouseenter', mouseEnterListener)
                elements[i].removeEventListener('mouseout', mouseOutListener)
                elements[i].style.backgroundColor = 'rgba(0,0,0,0)'
              }

              setSelectedId(id)
            })

            viewer.addOverlay(
              overlayElement,
              new OpenSeadragon.Rect(overlay.x, overlay.y, overlay.width, overlay.height)
            )
          })
        })
      } catch (error) {
        console.log(error)
      }
    },
    [viewer]
  )

  useEffect(() => {
    const newspaperId = params.id
    if (viewer) {
      fetchCoords(newspaperId)
    }
  }, [viewer, params.id, fetchCoords])

  return (
    <div className={style['main-container']}>
      <div
        id="openSeaDragon"
        style={{
          border: selectedId ? '2px solid blue' : '1px solid black',
          height: '75vh',
          width: '85vw',
          margin: 'auto'
        }}
      />
      {/* Todo add button here to return the edit docuemnt page */}
      {selectedId && <OverlayDataSider overlayId={selectedId} close={setSelectedId} documentId={params.id} />}
    </div>
  )
}

export default ViewNewsPaper
