import { message, Table, Modal, Button, Space, Form, Select, Card, Input, DatePicker, Row, Col } from 'antd'
import { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
// import MainCategorySquare from '../../components/MainCategorySquare'
import axios from 'utils/axios'
import style from './style.module.css'
import { IDocument, IMainCategory } from 'types'
import { useQuery } from '@tanstack/react-query'
import { removeNullCharacters } from 'pdfjs-dist'

const fetchDocuments = async () => {
  const res = await axios.get('/all/documents')

  return res.data.data
}

const ManageDocuments = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const { data: documents, refetch } = useQuery(['documents'], fetchDocuments)
  const [editModalVisible, setEditModalVisible] = useState(false)
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
      .post(`/documents/meta/${values.id}`, {
        ...values,
        publishedDate: values.publishedDate.lang('en').format('YYYY-MM-DD')
      })
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed')
          return
        }

        message.success('Success')
        message.destroy('Loading')
        setEditModalVisible(false)
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
            <Col span={8}>
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
                  {data.map((category: IMainCategory) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col offset={1} span={8}>
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
              <Button
                type="ghost"
                onClick={() => {
                  setFilter({
                    categoryId: 0,
                    documentName: ''
                  })
                }}
              >
                Clear
              </Button>
            </Col>
            <Col offset={1} span={3}>
              <Button type="primary">
                <Link to="/manage/document">Add document</Link>
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <br />
      <Table
        dataSource={documents.filter((document: IDocument) => {
          console.log(filter)
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
            key: 'name'
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
            render: (text: string) => text?.split('T')[0]
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
                    setEditModalVisible(true)
                    form.setFieldsValue({
                      id: record.id,
                      documentName: record.name,
                      category: record.categoryId,
                      publishedDate: record.publishedDate
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
        visible={editModalVisible}
        onOk={() => {
          form.submit()
        }}
        okText="Save"
        onCancel={() => {
          setEditModalVisible(false)
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
