import { useEffect, useState } from 'react'
import style from './style.module.css'
import { DeleteFilled, PlusCircleOutlined, FileAddOutlined } from '@ant-design/icons'
import axios from 'utils/axios'
import { Modal, Form, Input, Row, Col, Select, Collapse, message } from 'antd'
import { ITagInput } from 'types'
import { useMutation, useQuery } from '@tanstack/react-query'

const { Panel } = Collapse

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('بدون عنوان')
  const [overlayId, setOverlayId] = useState(0)
  const [form] = Form.useForm()

  const { data: tags } = useQuery(['tags'], async () => {
    const res = await axios.get(`/tag/all`)
    return res.data
  })

  const { data: overlayData, refetch } = useQuery<{
    id: number
    overlay: Overlay
    articleId: number
    tags: ITagInput[]
    mainNote: string
    title: string
    content: string
  }>(
    ['overlay-data', overlayId],
    async () => {
      const res = await axios.get(`/overlay/data/${overlayId}`)
      return res.data
    },
    {
      enabled: false
    }
  )

  const { mutate: attachTag, isLoading: isAttachingTag } = useMutation((tagId: number) => {
    return axios.post('/tag/attach/overlay', {
      tagId,
      overlayId
    })
  })

  const { mutate: detachTag, isLoading: isDetachingTag } = useMutation((tagId: number) => {
    return axios.post('/tag/detach/overlay', {
      tagId,
      overlayId
    })
  })

  const { mutate: submitOverlayData, isLoading: isSubmittingOverlayData } = useMutation((data: any) => {
    return axios.post(`/overlay/update/${overlayId}`, data)
  })

  useEffect(() => {
    if (overlayId) {
      refetch()
    }

    if (editStatus === 'edit') {
      form.setFieldsValue({
        title: ''
      })
    }
  }, [overlayId, editStatus, form, refetch])

  useEffect(() => {
    if (overlayData) {
      form.setFieldsValue({
        tags: overlayData.tags.map((tag) => tag.id),
        title: overlayData.title,
        mainNote: overlayData.mainNote,
        text: overlayData.content
      })

      if (overlayData.title) {
        setModalTitle(overlayData.title)
      }
    }
  }, [overlayData, form])

  const deleteOverlay = async (coordId: string, overlayId: number) => {
    try {
      await axios.delete(`/overlay/${overlayId}/${coordId}`)

      refreshCoords()
    } catch (error) {
      console.log(error)
    }
  }

  const onFormFinish = async (values: any) => {
    submitOverlayData(
      {
        id: overlayId,
        title: values.title,
        content: values.text,
        mainNote: values.mainNote
      },
      {
        onSuccess: () => {
          message.success('با موفقیت ذخیره شد')
          refetch()
          setIsModalOpen(false)
        }
      }
    )
  }

  if (!tags) {
    return null
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
                <span
                  className={style.showDataModal}
                  style={{ fontSize: '20px' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOverlayId(id)
                    setIsModalOpen(true)
                  }}
                >
                  <FileAddOutlined />
                </span>
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
      {overlayData?.tags && (
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
          <Form
            layout="vertical"
            form={form}
            onValuesChange={(changedValues, allValues) => {
              setModalTitle(allValues.title)
            }}
            onFinish={onFormFinish}
          >
            <Row>
              <Col span={7}>
                <Form.Item label="عنوان" name="title">
                  <Input />
                </Form.Item>
              </Col>
              <Col offset={1} span={7}>
                <Form.Item label="تاغس" name="tags">
                  <Select
                    loading={isAttachingTag || isDetachingTag}
                    mode="tags"
                    onSelect={(value: number) => {
                      const tag = tags.data.find((tag: ITagInput) => tag.id === value)
                      if (tag) {
                        attachTag(value, {
                          onSuccess: () => {
                            message.success('تم اضافة التصنيف بنجاح')
                            refetch()
                          }
                        })
                      }
                    }}
                    onDeselect={(value) => {
                      const tag = tags.data.find((tag: ITagInput) => tag.id === value)

                      if (tag) {
                        detachTag(value, {
                          onSuccess: () => {
                            message.success('تم حذف التصنيف بنجاح')
                            refetch()
                          }
                        })
                      }
                    }}
                  >
                    {tags.data.map((tag: ITagInput) => (
                      <Select.Option key={tag.id} value={tag.id}>
                        {tag.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item label="ملاحظه اساسية" name="mainNote">
                  <Input.TextArea cols={120} rows={5} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Collapse ghost>
                  <Panel header="اختياري" key="1">
                    <Form.Item label="نص" name="text">
                      <Input.TextArea cols={120} rows={5} />
                    </Form.Item>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default Sidebar
