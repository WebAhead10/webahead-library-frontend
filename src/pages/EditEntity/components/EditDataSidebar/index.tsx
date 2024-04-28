import { useEffect, useState } from 'react'
import style from './style.module.css'
import { DeleteFilled, PlusCircleOutlined, FileAddOutlined } from '@ant-design/icons'
import axios from 'utils/axios'
import { Modal, Form, Input, Row, Col, Select, Collapse, message, Button } from 'antd'
import { ITagInput } from 'types'
import { useMutation, useQuery } from '@tanstack/react-query'

const { Panel } = Collapse

interface EditDataSidebarProps {
  editStatus: string
  editOverlayId: number
  refreshCoords: () => void
}

interface Overlay {
  x: number
  y: number
}

const EditDataSidebar = ({ editOverlayId: overlayId, editStatus, refreshCoords }: EditDataSidebarProps) => {
  const [form] = Form.useForm()

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

  const { data: tags } = useQuery(['tags'], async () => {
    const res = await axios.get(`/tag/all`)
    return res.data.data
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

  useEffect(() => {
    if (overlayData) {
      form.setFieldsValue({
        tags: overlayData.tags.map((tag) => tag.id),
        title: overlayData.title,
        mainNote: overlayData.mainNote,
        text: overlayData.content
      })
    }
  }, [overlayData, form])

  useEffect(() => {
    if (overlayData) {
      form.setFieldsValue({
        tags: overlayData.tags.map((tag) => tag.id),
        title: overlayData.title,
        mainNote: overlayData.mainNote,
        text: overlayData.content
      })
    }
  }, [overlayData, form])

  const onFormFinish = async (values: any) => {
    console.log(values)
    // submitOverlayData(
    //   {
    //     id: overlayId,
    //     title: values.title,
    //     content: values.text,
    //     mainNote: values.mainNote
    //   },
    //   {
    //     onSuccess: () => {
    //       message.success('👍')
    //       refetch()
    //       refreshCoords()
    //     }
    //   }
    // )
  }

  if (!tags) {
    return null
  }

  return (
    <div className={style.articleSidebar}>
      <Form layout="vertical" form={form} onFinish={onFormFinish}>
        <Row wrap gutter={[16, 0]}>
          <Col span={22} offset={1}>
            <Form.Item label="عنوان" name="title">
              <Input />
            </Form.Item>
          </Col>
          <Col offset={1} span={22}>
            <Form.Item label="وسوم" name="tags">
              <Select
                loading={isAttachingTag || isDetachingTag}
                mode="tags"
                onSelect={(value: number) => {
                  const tag = tags.find((tag: ITagInput) => tag.id === value)
                  if (tag) {
                    attachTag(value, {
                      onSuccess: () => {
                        message.success('تم اضافة التصنيف بنجاح')
                        // refetch()
                      }
                    })
                  }
                }}
                onDeselect={(value) => {
                  const tag = tags.find((tag: ITagInput) => tag.id === value)

                  if (tag) {
                    detachTag(value, {
                      onSuccess: () => {
                        message.success('تم حذف التصنيف بنجاح')
                        // refetch()
                      }
                    })
                  }
                }}
              >
                {tags.map((tag: ITagInput) => (
                  <Select.Option key={tag.id} value={tag.id}>
                    {tag.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Form.Item label="ملاحظه اساسية" name="mainNote">
              <Input.TextArea cols={120} rows={5} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Form.Item label="نص" name="text">
              <Input.TextArea cols={120} rows={5} />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" loading={isSubmittingOverlayData} htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default EditDataSidebar
