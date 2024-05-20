import React, { useState } from 'react'
import style from './style.module.css'
import { DeleteFilled, PlusCircleOutlined, FileAddOutlined } from '@ant-design/icons'
import axios from 'utils/axios'
import { Button, Collapse } from 'antd'
import { useHistory } from 'react-router-dom'

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
  title: string
}

interface SidebarProps {
  articles: Article[]
  mouseEnterListener: Function
  mouseOutListener: Function
  moveToOverlay: Function
  refreshCoords: Function
  editStatus: string
  updateOverlayCoords: Function
  setEditOverlayId: Function
  editOverlayId: number
  currentlyHovered: number
}

const Sidebar = ({
  articles,
  mouseEnterListener,
  mouseOutListener,
  moveToOverlay,
  refreshCoords,
  editStatus,
  updateOverlayCoords,
  setEditOverlayId,
  editOverlayId,
  currentlyHovered
}: SidebarProps) => {
  const [toggled, setToggled] = useState<{ [key: number]: boolean }>({})
  const history = useHistory()

  const deleteOverlay = async (coordId: string, overlayId: number) => {
    try {
      await axios.delete(`/overlay/${overlayId}/${coordId}`)

      refreshCoords()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={style.articleSidebar}>
      <Button
        style={{
          width: '100%',
          marginBottom: '10px'
        }}
        onClick={() => {
          history.goBack()
        }}
      >
        Back to view mode
      </Button>
      <h1>قائمة المقالات</h1>
      <div className={style.articleWrapper}>
        {(articles || [])
          .sort(({ id: aId }, { id: bId }) => aId - bId)
          .map(({ id, coords, title }, index) => (
            <Collapse
              key={index}
              style={{
                direction: 'rtl',
                borderRadius: '0px',
                backgroundColor: currentlyHovered === id ? 'yellow' : 'white',
                padding: '0px'
              }}
              items={[
                {
                  key: '1',
                  // showArrow: false,
                  label: (
                    <>
                      <div
                        className={style.articleContainer}
                        onMouseEnter={() => mouseEnterListener(id)}
                        onMouseLeave={() => mouseOutListener(id)}
                        onClick={() => {
                          setToggled({ ...toggled, [id]: !toggled[id] })
                        }}
                        style={{
                          backgroundColor: currentlyHovered === id ? 'yellow' : 'white'
                        }}
                      >
                        <div>
                          <span
                            className={style.articleTitle}
                            style={{
                              paddingRight: '10px'
                            }}
                          >
                            {title || 'بدون عنوان'}
                          </span>
                        </div>
                        {editStatus === 'drawing' && (
                          <span>
                            <PlusCircleOutlined
                              style={{ fontSize: '20px' }}
                              onClick={() => {
                                updateOverlayCoords(id)
                              }}
                            />
                          </span>
                        )}
                      </div>
                    </>
                  ),
                  children: (
                    <>
                      <Button
                        onClick={() => {
                          setEditOverlayId(id)
                        }}
                        type="primary"
                        style={{
                          width: '100%',
                          marginBottom: '10px',
                          borderRadius: '0'
                        }}
                      >
                        حتلن البيانات
                      </Button>
                      {coords.map(({ id: coordId, overlay }, index) => (
                        <div
                          className={style.overlay}
                          onMouseEnter={() => {
                            if (editOverlayId === id) return

                            mouseEnterListener(id, index)
                          }}
                          onMouseLeave={() => {
                            if (editOverlayId === id) return

                            mouseOutListener(id, index)
                          }}
                          onClick={() => moveToOverlay(overlay, id)}
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
                    </>
                  )
                }
              ]}
            />
          ))}
      </div>
      {/* {overlayData?.tags && (
        <Modal
          width={1000}
          onOk={() => {
            form.submit()
          }}
          confirmLoading={isSubmittingOverlayData}
          onCancel={() => setIsModalOpen(false)}
          visible={isModalOpen}
          title={modalTitle}
        >
          <br />
          <br />
        </Modal>
      )} */}
    </div>
  )
}

export default Sidebar
