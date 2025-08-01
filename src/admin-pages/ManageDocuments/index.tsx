import { message, Table, Modal, Button, Space, Form, Select, Card, Input, DatePicker, Row, Col } from 'antd'
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
// import MainCategorySquare from '../../components/MainCategorySquare'
import axios from 'utils/axios'
// import style from './style.module.css'
import { IDocument, IMainCategory } from 'types'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

const fetchDocuments = async () => {
  const res = await axios.get('/document/all')
  return res.data.data
}

const ManageDocuments = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const { data: documents, refetch } = useQuery(['documents'], fetchDocuments)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [filter, setFilter] = useState({
    categoryId: 0,
    documentName: ''
  })

  const { data } = useQuery(['categories'], async () => {
    const res = await axios.get('/categories')
    return res.data.categories
  })

  const onFormFinish = (values: any) => {
    axios
      .post(`/document/meta/${values.id}`, {
        ...values,
        // settings hours
        // publishedDate: values.publishedDate.lang('en').add(1, 'hours').format('YYYY-MM-DD')
        publishedDate: values.publishedDate.add(1, 'hours').format('YYYY-MM-DD')
      })
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed')
          return
        }

        message.success('Success')
        message.destroy('Loading')
        setEditModalOpen(false)
        form.resetFields()
        refetch()
      })
      .catch((error) => {
        message.error(error.message)
      })
  }

  if (!documents || !data) {
    return null
  }

  return (
    <div>
      <Card>
        <Form layout="vertical">
          <Row align="bottom">
            <Col span={6}>
              <Form.Item
                label="Category"
                style={{
                  marginBottom: 0
                }}
              >
                <Select
                  onChange={(value) => {
                    setFilter({
                      ...filter,
                      categoryId: +value
                    })
                  }}
                  value={filter.categoryId || ''}
                >
                  <Select.Option value={0}>All</Select.Option>

                  {data.map((category: IMainCategory) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col offset={1} span={6}>
              <Form.Item
                label="Document Name"
                style={{
                  marginBottom: 0
                }}
              >
                <Input
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      documentName: e.target.value
                    })
                  }}
                  value={filter.documentName}
                />
              </Form.Item>
            </Col>

            <Col offset={1} span={4}>
              <Space>
                <Button
                  onClick={() => {
                    setFilter({
                      categoryId: 0,
                      documentName: ''
                    })
                  }}
                >
                  Clear
                </Button>
                <Button type="primary">
                  <Link to="/manage/document">Add document</Link>
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <br />
      <Table
        dataSource={documents.filter((document: IDocument) => {
          if (filter.categoryId && filter.categoryId !== document.categoryId) {
            return false
          }

          if (filter.documentName && !document.name.includes(filter.documentName)) {
            return false
          }

          return true
        })}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'name'
          },
          {
            title: 'Document name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: IDocument, b: IDocument) => a.name.localeCompare(b.name)
          },
          {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'category'
          },
          {
            title: 'Published Date',
            dataIndex: 'publishedDate',
            key: 'publishedDate',
            render: (text: string) => text?.split('T')[0],
            sorter: (a: any = {}, b: any = {}) => a?.publishedDate.localeCompare(b.publishedDate)
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    history.push(`/view/document/${record.id}`)
                  }}
                >
                  View
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setEditModalOpen(true)
                    form.setFieldsValue({
                      id: record.id,
                      documentName: record.name,
                      category: record.categoryId,
                      publishedDate: dayjs(record?.publishedDate || dayjs())
                    })
                  }}
                >
                  Edit
                </Button>
              </Space>
            )
          }
        ]}
      />

      <Modal
        title="Edit Document"
        open={editModalOpen}
        onOk={() => {
          form.submit()
        }}
        okText="Save"
        onCancel={() => {
          setEditModalOpen(false)
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFormFinish}>
          <Form.Item label="Document name" name="documentName">
            <Input />
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Select>
              {data?.map((category: IMainCategory) => (
                <Select.Option value={category.id}>{category.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="publishedDate" label="Published date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ManageDocuments
