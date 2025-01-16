import React, { useEffect, useState } from 'react'
import style from './style.module.css'
import {
  DeleteFilled,
  PlusCircleOutlined,
  LockOutlined,
  CaretUpOutlined,
  CaretLeftOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  ShrinkOutlined,
  ArrowsAltOutlined,
  EditFilled
} from '@ant-design/icons'
import axios from 'utils/axios'
import { Button, Collapse, Flex, Modal } from 'antd'
import { useHistory } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { useRecoilValue } from 'recoil'
import { languageAtom } from 'utils/recoil/atoms'
interface Overlay {
  x: number
  y: number
  width: number
  height: number
}

interface Coord {
  id: string
  overlay: Overlay
}

interface Article {
  id: number
  coords: Coord[]
  title: string
  status: string
}

interface SidebarProps {
  articles: Article[]
  mouseEnterListener: Function
  mouseOutListener: Function
  moveToOverlay: Function
  editStatus: string
  updateOverlayCoords: Function
  setEditOverlayId: Function
  editOverlayId: number
  currentlyHovered: number
  refetch: Function
  removeOverlay: Function
  updateOverlaySizing: (id: string, x: number, y: number, width: number, height: number) => void
}

const { confirm } = Modal;

const Sidebar = ({
  articles,
  mouseEnterListener,
  mouseOutListener,
  moveToOverlay,
  editStatus,
  updateOverlayCoords,
  setEditOverlayId,
  editOverlayId,
  refetch,
  currentlyHovered,
  removeOverlay,
  updateOverlaySizing
}: SidebarProps) => {
  const [toggled, setToggled] = useState<{ [key: number]: boolean }>({})
  const history = useHistory()
  const [openDimensions, setOpenDimensions] = useState('')
  const [overlayDimensions, setOverlayDimensions] = useState<Overlay | null>(null)
  const languageObj = useRecoilValue(languageAtom)
  const lang = languageObj.language || 'en';

  const deleteOverlay = async (overlayId: string, articleId: number) => {
    try {
      await axios.delete(`/overlay/${articleId}/${overlayId}`)

      removeOverlay(overlayId.split('_')[1])
      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  const intl = useIntl();

  // when editOverlayId changes we should scroll to the collpase
  useEffect(() => {
    if (editOverlayId) {
      const el = document.getElementById(`collapse_${editOverlayId}`)

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [editOverlayId])

  useEffect(() => {
    if (openDimensions) {
      const overlayId = openDimensions.split('/')[1]

      const el = document.getElementById(overlayId)

      el.style.borderColor = 'blue'
    }
  }, [openDimensions])

  useEffect(() => {
    if (overlayDimensions) {
      updateOverlaySizing(
        openDimensions.split('/')[1],
        overlayDimensions.x,
        overlayDimensions.y,
        overlayDimensions.width,
        overlayDimensions.height
      )
    }
  }, [overlayDimensions])

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
        <FormattedMessage id="edit_article_page-back-to-view-mode"/>
      </Button>
      <h1><FormattedMessage id="edit_article_page-article-list"/></h1>

      <div className={style.articleWrapper}>
        {(articles || [])
          .sort(({ id: aId }, { id: bId }) => aId - bId)
          .map(({ id, coords, title, status }, index) => (
            <Collapse
              key={index}
              style={{
                direction: lang === 'ar'? 'rtl': 'ltr',
                borderRadius: '0px',
                backgroundColor: currentlyHovered === id || editOverlayId === id ? 'yellow' : 'white',
                padding: '0px'
              }}
              items={[
                {
                  key: '1',
                  showArrow: status === 'closed' ? false : true,
                  label: (
                    <div
                      id={`collapse_${id}`}
                      className={style.articleContainer}
                      onMouseEnter={() => mouseEnterListener(id)}
                      onMouseLeave={() => mouseOutListener(id)}
                      onClick={(e) => {
                        if (status === 'closed') {
                          e.stopPropagation()
                          return
                        }
                        setToggled({ ...toggled, [id]: !toggled[id] })
                      }}
                      style={{
                        backgroundColor: currentlyHovered === id || editOverlayId === id ? 'yellow' : 'white'
                      }}
                    >
                      {status === 'closed' && <LockOutlined style={{ fontSize: '22px', marginRight: 'auto' }} />}
                      <div>
                        <span
                          className={style.articleTitle}
                          style={{
                            paddingRight: '10px'
                          }}
                        >
                          {title || <FormattedMessage id="edit_article_page-untitled-article"/>}
                        </span>
                      </div>
                      {editStatus === 'drawing' && status !== 'closed' && (
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
                  ),
                  children:
                    status === 'closed' ? (
                      ''
                    ) : (
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
                          <FormattedMessage id="edit_article_page-edit-data"/>
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
                            key={index}
                          >
                            <Flex vertical align="center">
                              <Flex justify="space-between">
                                <span><FormattedMessage id="edit_article_page-layout-number"/> {index + 1}</span>
                                <span
                                  className={style.deleteOverlay}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    confirm({
                                      title: (
                                        <div style={{ direction: lang === 'ar'? 'rtl': 'ltr', textAlign: lang === 'ar'? 'right': 'left' }}>
                                          {intl.formatMessage({ id: 'edit_article_page-delete-layout-message-title' })}
                                        </div>
                                      ),
                                      content: (
                                        <div style={{ direction: lang === 'ar'? 'rtl': 'ltr', textAlign: lang === 'ar'? 'right': 'left' }}>
                                           {intl.formatMessage({ id: 'edit_article_page-delete-layout-message-info' })}
                                        </div> 
                                      ),
                                      okText: intl.formatMessage({ id: 'general_text-yes' }),
                                      cancelText: intl.formatMessage({ id: 'general_text-no' }),
                                      onOk() {
                              
                                        deleteOverlay(coordId, id);
                                      },
                                    });
                                  }}
                                  style={{ marginRight: '10px' }}
                                  title='Delete Overlay'
                                >
                                  <DeleteFilled />
                                </span>
                                <span
                                  className={style.resizeOverlay}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenDimensions(id + '/' + coordId)
                                    setOverlayDimensions(overlay)
                                  }}
                                  style={{ marginRight: '10px' }}
                                  title='Edit Overlay Dimensions'
                                >
                                  { < EditFilled />  }
                                </span>
                              </Flex>

                              {openDimensions === id + '/' + coordId ? (
                                <Flex
                                  vertical
                                  style={{
                                    width: '200px'
                                  }}
                                >
                                  <Flex
                                    justify="center"
                                    gap="10px"
                                    style={{
                                      margin: '10px 0px'
                                    }}
                                  >
                                    <CaretLeftOutlined
                                      onClick={() => {
                                        setOverlayDimensions({
                                          ...overlayDimensions,
                                          x: overlayDimensions.x - 1
                                        })
                                      }}
                                      style={{ fontSize: '20px' }}
                                    />
                                    <CaretUpOutlined
                                      onClick={() => {
                                        setOverlayDimensions({
                                          ...overlayDimensions,
                                          y: overlayDimensions.y - 1
                                        })
                                      }}
                                      style={{ fontSize: '20px' }}
                                    />
                                    <CaretDownOutlined
                                      onClick={() => {
                                        setOverlayDimensions({
                                          ...overlayDimensions,
                                          y: overlayDimensions.y + 1
                                        })
                                      }}
                                      style={{ fontSize: '20px' }}
                                    />
                                    <CaretRightOutlined
                                      onClick={() => {
                                        setOverlayDimensions({
                                          ...overlayDimensions,
                                          x: overlayDimensions.x + 1
                                        })
                                      }}
                                      style={{ fontSize: '20px' }}
                                    />
                                  </Flex>

                                  <Flex
                                    justify="center"
                                    align="center"
                                    gap="10px"
                                    style={{
                                      margin: '10px 0px',
                                      userSelect: 'none'
                                    }}
                                  >
                                    <span>W:</span>
                                    <ShrinkOutlined
                                      onClick={() => {
                                        setOverlayDimensions({
                                          ...overlayDimensions,
                                          width: overlayDimensions.width - 1
                                        })
                                      }}
                                      style={{
                                        fontSize: '25px',
                                        transform: 'rotate(45deg)',
                                        border: '1px solid #000',
                                        borderRadius: '50%',
                                        padding: '4px'
                                      }}
                                    />
                                    <ArrowsAltOutlined
                                      onClick={() => {
                                        setOverlayDimensions({
                                          ...overlayDimensions,
                                          width: overlayDimensions.width + 1
                                        })
                                      }}
                                      style={{
                                        fontSize: '25px',
                                        transform: 'rotate(45deg)',
                                        border: '1px solid #000',
                                        borderRadius: '50%',
                                        padding: '4px'
                                      }}
                                    />
                                  </Flex>

                                  <Flex
                                    justify="center"
                                    align="center"
                                    gap="10px"
                                    style={{
                                      margin: '10px 0px',
                                      userSelect: 'none'
                                    }}
                                  >
                                    <span>H:</span>
                                    <ShrinkOutlined
                                      onClick={() => {
                                        setOverlayDimensions({
                                          ...overlayDimensions,
                                          height: overlayDimensions.height - 1
                                        })
                                      }}
                                      style={{
                                        fontSize: '25px',
                                        transform: 'rotate(135deg)',
                                        border: '1px solid #000',
                                        borderRadius: '50%',
                                        padding: '4px'
                                      }}
                                    />
                                    <ArrowsAltOutlined
                                      onClick={() => {
                                        setOverlayDimensions({
                                          ...overlayDimensions,
                                          height: overlayDimensions.height + 1
                                        })
                                      }}
                                      style={{
                                        fontSize: '25px',
                                        transform: 'rotate(135deg)',
                                        border: '1px solid #000',
                                        borderRadius: '50%',
                                        padding: '4px'
                                      }}
                                    />
                                  </Flex>

                                  <Button
                                    onClick={() => {
                                      setOpenDimensions('')

                                      // update the overlay with an api request
                                      // then refetch
                                    }}
                                  >
                                    <FormattedMessage id="general_text-save"/>
                                  </Button>
                                </Flex>
                              ) : (
                                ''
                              )}
                            </Flex>
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
