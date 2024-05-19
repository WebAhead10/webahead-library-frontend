import {
  message,
  Table,
  Modal,
  Button,
  Space,
  Form,
  Select,
  Card,
  Input,
  Typography,
  Row,
  Col,
  Popconfirm,
  Checkbox
} from 'antd'
import { useEffect, useState } from 'react'
import axios from 'utils/axios'
import { useQuery } from '@tanstack/react-query'

const { Text } = Typography

const fetchUsers = async () => {
  const res = await axios.get('/all/users')

  return res.data.users
}

const Users = () => {
  const [form] = Form.useForm()
  const [formUser] = Form.useForm()
  const [formAdmin] = Form.useForm()
  const { data: users, refetch } = useQuery(['users'], fetchUsers)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addUserModalOpen, setAddUserModalOpen] = useState(false)
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [filter, setFilter] = useState({
    name: '',
    email: '',
    role: ''
  })
  const userFormRoleWatch = Form.useWatch('role', formUser)
  const editUserFormRoleWatch = Form.useWatch('role', form)

  useEffect(() => {
    if (userFormRoleWatch === 'contributor') {
      formUser.setFieldsValue({
        permissions: ['overlay-text', 'overlay-cut', 'overlay-tag', 'overlay-notes']
      })
    } else {
      formUser.setFieldsValue({
        permissions: []
      })
    }
  }, [userFormRoleWatch, formUser])

  const onFormFinish = (values: any) => {
    axios
      .post(`/user/update/${values.id}`, {
        ...values
        // settings hours
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

  const onAddUserFormFinish = (values: any) => {
    axios
      .post(`/user/add`, {
        ...values
      })
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed')
          return
        }

        message.success('Success')
        setAddUserModalOpen(false)
        formUser.resetFields()
        refetch()
      })
      .catch((error) => {
        message.error(error.message)
      })
  }

  const onAddAdminFormFinish = (values: any) => {
    axios
      .post(`/admin/add`, {
        ...values
      })
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed')
          return
        }

        message.success('Success')
        setAddAdminModalOpen(false)
        formAdmin.resetFields()
        // refetch() refetch admin list
      })
      .catch((error) => {
        message.error(error.message)
      })
  }

  const toggleActive = (id: number) => {
    setTableLoading(true)
    axios
      .post(`/user/toggle-approve/${id}`)
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed')
          return
        }

        message.success('Success')
        setTableLoading(false)
        refetch()
      })
      .catch((error) => {
        message.error(error.message)
      })
  }

  const hideUser = (id: number, role: string) => {
    setTableLoading(true)
    axios
      .post(`/user/hide/${id}`, {
        role
      })
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed')
          return
        }

        message.success('Success')
        setTableLoading(false)
        refetch()
      })
      .catch((error) => {
        message.error(error.message)
      })
  }

  const unHideUser = (id: number, role: string) => {
    setTableLoading(true)
    axios
      .post(`/user/unhide/${id}`, {
        role
      })
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed')
          return
        }

        message.success('Success')
        setTableLoading(false)
        refetch()
      })
      .catch((error) => {
        message.error(error.message)
      })
  }

  if (!users) {
    return null
  }

  return (
    <div>
      <Card>
        <Form layout="vertical">
          <Row align="bottom" gutter={16}>
            <Col span={5}>
              <Form.Item
                label="User Name"
                style={{
                  marginBottom: 0
                }}
              >
                <Input
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      name: e.target.value
                    })
                  }}
                  value={filter.name}
                />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item
                label="User Email"
                style={{
                  marginBottom: 0
                }}
              >
                <Input
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      email: e.target.value
                    })
                  }}
                  value={filter.email}
                />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item
                label="User Role"
                style={{
                  marginBottom: 0,
                  textAlign: 'left'
                }}
              >
                <Select
                  onChange={(value) => {
                    setFilter({
                      ...filter,
                      role: value
                    })
                  }}
                  value={filter.role}
                >
                  <Select.Option value="">All</Select.Option>
                  <Select.Option value="normal">Normal</Select.Option>
                  <Select.Option value="contributor">Contributor</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Space>
                <Button
                  onClick={() => {
                    // setFilter({
                    // })
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setAddUserModalOpen(true)
                  }}
                >
                  Add user
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setAddAdminModalOpen(true)
                  }}
                >
                  Add admin
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <br />
      <Table
        loading={tableLoading}
        dataSource={users.filter((user: any) => {
          if (filter.name && !user.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false
          }

          if (filter.email && !user.email.toLowerCase().includes(filter.email.toLowerCase())) {
            return false
          }

          if (filter.role && user.role !== filter.role) {
            return false
          }

          return true
        })}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id'
          },
          {
            title: "User's name",
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
          },
          {
            title: 'Email',
            dataIndex: 'email'
          },
          {
            title: 'Role',
            dataIndex: 'role'
          },
          {
            title: 'Added',
            dataIndex: 'created_at',
            key: 'publishedDate',
            render: (text: string) => text?.split('T')[0],
            sorter: (a: any = {}, b: any = {}) => a?.publishedDate.localeCompare(b.publishedDate)
          },
          {
            title: 'Status',
            render: (text, record) =>
              !record.hidden ? (
                <Text type={record.approved ? 'success' : 'danger'}>{record.approved ? 'Active' : 'Inactive'}</Text>
              ) : (
                <Text type="secondary">Hidden</Text>
              )
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) =>
              !record.hidden ? (
                <Space>
                  <Popconfirm
                    title={`Are you sure to ${record.approved ? 'deactivate' : 'activate'} this user?`}
                    onConfirm={() => {
                      toggleActive(record.id)
                    }}
                  >
                    {!record.hidden && record.role !== 'admin' && (
                      <Button
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: record.approved ? '#ff4d4f' : '#52c41a',
                          borderColor: record.approved ? '#ff4d4f' : '#52c41a'
                        }}
                      >
                        {record.approved ? 'Deactivate' : 'Activate'}
                      </Button>
                    )}
                  </Popconfirm>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      setEditModalOpen(true)
                      form.setFieldsValue({
                        id: record.id,
                        name: record.name,
                        email: record.email,
                        role: record.role,
                        permissions: record.permissions
                      })
                    }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title={`Are you sure to ${record.approved ? 'deactivate' : 'activate'} this user?`}
                    onConfirm={() => {
                      hideUser(record.id, record.role)
                    }}
                  >
                    <Button
                      type="primary"
                      size="small"
                      style={{
                        backgroundColor: '#ff4d4f',
                        borderColor: '#ff4d4f'
                      }}
                    >
                      Hide
                    </Button>
                  </Popconfirm>
                </Space>
              ) : (
                <Space>
                  <Popconfirm
                    title={`Are you sure to unHide this user?`}
                    onConfirm={() => {
                      unHideUser(record.id, record.role)
                    }}
                  >
                    <Button type="primary" size="small" style={{}}>
                      un-hide
                    </Button>
                  </Popconfirm>
                </Space>
              )
          }
        ]}
      />

      <Modal
        title="Edit User"
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
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          {form.getFieldValue('role') !== 'admin' && (
            <Form.Item name="role" label="Role">
              <Select>
                <Select.Option value="normal">Normal</Select.Option>
                <Select.Option value="contributor">Contributor</Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item name="permissions" label="Permissions" hidden={editUserFormRoleWatch !== 'contributor'}>
            <Checkbox.Group>
              <Checkbox value="overlay-text">Update text</Checkbox>
              <Checkbox value="overlay-cut">Cut articles</Checkbox>
              <Checkbox value="overlay-tag">Update tags</Checkbox>
              <Checkbox value="overlay-notes">Update notes</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add User"
        open={addUserModalOpen}
        onOk={() => {
          formUser.submit()
        }}
        okText="Save"
        onCancel={() => {
          setAddUserModalOpen(false)
        }}
      >
        <Form form={formUser} layout="vertical" onFinish={onAddUserFormFinish}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password">
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Select>
              <Select.Option value="normal">Normal</Select.Option>
              <Select.Option value="contributor">Contributor</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="permissions" label="Permissions" hidden={userFormRoleWatch !== 'contributor'}>
            <Checkbox.Group>
              <Checkbox value="overlay-text">Update text</Checkbox>
              <Checkbox value="overlay-cut">Cut articles</Checkbox>
              <Checkbox value="overlay-tag">Update tags</Checkbox>
              <Checkbox value="overlay-notes">Update notes</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Admin"
        open={addAdminModalOpen}
        onOk={() => {
          formAdmin.submit()
        }}
        okText="Save"
        onCancel={() => {
          setAddAdminModalOpen(false)
        }}
      >
        <Form form={formAdmin} layout="vertical" onFinish={onAddAdminFormFinish}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Users
