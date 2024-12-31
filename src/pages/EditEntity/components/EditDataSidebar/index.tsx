import { useEffect } from 'react'
import style from './style.module.css'
import axios from 'utils/axios'
import { Form, Input, Row, Col, Select, message, Button, Radio } from 'antd'
import { ITagInput, IUser } from 'types'
import { useMutation, useQuery } from '@tanstack/react-query'
import Editor from 'pages/Editor'
import { useRecoilValue } from 'recoil'
import { userAtom } from 'utils/recoil/atoms'

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

  const formText = Form.useWatch('text', form)
  const user = useRecoilValue<IUser>(userAtom)

  const { data: overlayData, refetch } = useQuery<{
    id: number
    overlay: Overlay
    articleId: number
    tags: ITagInput[]
    mainNote: string
    title: string
    content: string
    status: string
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
      let status = 'open-article'

      if (overlayData.status === 'closed') {
        status = 'close-article'
      } else if (overlayData.status === 'ready-for-review') {
        status = 'ready-for-review'
      }

      form.setFieldsValue({
        tags: overlayData.tags.map((tag) => tag.id),
        title: overlayData.title,
        mainNote: overlayData.mainNote,
        text: overlayData.content,
        status: status
      })
    }
  }, [overlayData, form])

  useEffect(() => {
    if (overlayData) {
      let status = 'open-article'
      if (overlayData.status === 'closed') {
        status = 'close-article'
      } else if (overlayData.status === 'ready-for-review') {
        status = 'ready-for-review'
      }

      form.setFieldsValue({
        tags: overlayData.tags.map((tag) => tag.id),
        title: overlayData.title,
        mainNote: overlayData.mainNote,
        text: overlayData.content,
        status: status
      })
    }
  }, [overlayData, form])

  const onFormFinish = async (values: any) => {
    let status = 'open'

    if (values.status === 'close-article') {
      status = 'closed'
    } else if (values.status === 'ready-for-review') {
      status = 'ready-for-review'
    }
    submitOverlayData(
      {
        id: overlayId,
        title: values.title,
        content: values.text,
        mainNote: values.mainNote,
        status: status
      },
      {
        onSuccess: () => {
          message.success('👍')
          refetch()
          refreshCoords()
        }
      }
    )
  }

  if (!tags) {
    return null
  }

  const isTextEditAllow =
    (user.role === 'contributor' && user.permissions.includes('overlay-text')) || user.role === 'admin'

  const isTagEditAllow =
    (user.role === 'contributor' && user.permissions.includes('overlay-tag')) || user.role === 'admin'

  return (
    <div className={style.articleSidebar}>
      <Form layout="vertical" form={form} onFinish={onFormFinish}>
        <Row wrap gutter={[16, 0]}>
          {isTextEditAllow && (
            <Col span={22} offset={1}>
              <Form.Item label="عنوان" name="title">
                <Input />
              </Form.Item>
            </Col>
          )}
          {isTagEditAllow && (
            <Col offset={1} span={22}>
              <Form.Item label="وسوم" name="tags">
                <Select
                  loading={isAttachingTag || isDetachingTag}
                  mode="tags"
                  showSearch
                  filterOption={(input, option) =>
                    option?.label?.toString().toLowerCase().includes(input.toLowerCase())
                  }
                  options={tags.map((tag: ITagInput) => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                  onSelect={(value: number) => {
                    const tag = tags.find((tag: ITagInput) => tag.id === value);
                    if (tag) {
                      attachTag(value, {
                        onSuccess: () => {
                        message.success('تم اضافة التصنيف بنجاح');
                        // refetch();
                        },
                      });
                    }
                  }}
                  onDeselect={(value) => {
                    const tag = tags.find((tag: ITagInput) => tag.id === value);
                    if (tag) {
                      detachTag(value, {
                        onSuccess: () => {
                          message.success('تم حذف التصنيف بنجاح');
                          // refetch();
                        },
                      });
                    }
                  }}
                />
              </Form.Item>

            </Col>
          )}
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Form.Item label="ملاحظة أساسية" name="mainNote">
              <Input.TextArea cols={120} rows={5} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={24}>
            <Form.Item label="النوع" name="status">
              <Radio.Group
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                <Radio value="close-article">أغلق المقالة للتعديلات</Radio>
                <Radio value="open-article">إبقاء مفتوحة للتعديلات</Radio>
                <Radio value="ready-for-review">جاهزة للمراجعة</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        {isTextEditAllow && (
          <Row>
            <Col offset={1} span={22}>
              <Form.Item label="نص" name="text">
                <div
                  style={{
                    height: '300px',
                    marginBottom: '60px'
                  }}
                >
                  <Editor
                    content={formText}
                    onChange={(html) =>
                      form.setFieldsValue({
                        text: html
                      })
                    }
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
        )}
        <Button type="primary" loading={isSubmittingOverlayData} htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default EditDataSidebar
