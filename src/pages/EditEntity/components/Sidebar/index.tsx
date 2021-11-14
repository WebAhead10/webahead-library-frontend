import { useState } from 'react'
import style from './style.module.css'
import { DeleteFilled, PlusCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

interface Overlay {
  x: number
  y: number
}

interface Coord {
  id: string
  overlay: Overlay
}

interface Article {
  id: number
  coords: Coord[]
}

interface SidebarProps {
  articles: Article[]
  mouseEnterListener: Function
  mouseOutListener: Function
  moveToOverlay: Function
  refreshCoords: Function
  editStatus: string
  updateOverlayCoords: Function
}

const Sidebar = ({
  articles,
  mouseEnterListener,
  mouseOutListener,
  moveToOverlay,
  refreshCoords,
  editStatus,
  updateOverlayCoords
}: SidebarProps) => {
  const [toggled, setToggled] = useState<{ [key: number]: boolean }>({})

  const deleteOverlay = async (coordId: string, overlayId: number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/overlay/${overlayId}/${coordId}`)

      refreshCoords()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={style.articleSidebar}>
      <h1>Add article</h1>
      <div className={style.articleWrapper}>
        {articles
          .sort(({ id: aId }, { id: bId }) => aId - bId)
          .map(({ id, coords }, index) => (
            <>
              <div
                className={style.articleName}
                onMouseEnter={() => mouseEnterListener(id)}
                onMouseLeave={() => mouseOutListener(id)}
                onClick={() => {
                  setToggled({ ...toggled, [id]: !toggled[id] })
                }}
              >
                <div>
                  Article id: {id} <span className={style.articleOpenArrow}> ^ </span>
                </div>
                {editStatus === 'drawing' && (
                  <span className={style.addOverlays}>
                    <PlusCircleOutlined
                      style={{ fontSize: '20px' }}
                      onClick={() => {
                        updateOverlayCoords(id)
                      }}
                    />
                  </span>
                )}
              </div>
              <div className={style.overlayWrapper} style={{ height: toggled[id] ? 'auto' : '0' }}>
                {coords.map(({ id: coordId, overlay }, index) => (
                  <div
                    className={style.overlay}
                    onMouseEnter={() => mouseEnterListener(id, index)}
                    onMouseLeave={() => mouseOutListener(id, index)}
                    onClick={() => moveToOverlay(overlay.x, overlay.y)}
                  >
                    Overlay {index + 1}
                    <span
                      className={style.deleteOverlay}
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteOverlay(coordId, id)
                      }}
                    >
                      <DeleteFilled />
                    </span>
                  </div>
                ))}
              </div>
            </>
          ))}
      </div>
    </div>
  )
}

export default Sidebar
