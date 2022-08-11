import { useQuery } from '@tanstack/react-query'
import MainCategorySquare from 'components/MainCategorySquare'
import { IMainCategory } from 'types'
import { Button, Modal, Form, Input } from 'antd'

import style from './style.module.css'

import axios from 'utils/axios'
import { useState } from 'react'
import ImageInput from 'components/ImageInput'

const ManageCategories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const { data, refetch } = useQuery(['categories'], async () => {
    const res = await axios.get('/categories')
    return res.data.categories
  })

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setLoading(true)
    // setIsModalVisible(false)
    form.validateFields().then(async (values) => {
      const { name, logo } = values

      console.log({ values })

      const res = await axios.post('/categories/add', { name, logo })
      if (res.data.success) {
        setIsModalVisible(false)
        form.resetFields()
        refetch()
        setLoading(false)
      }
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  if (!data) {
    return null
  }

  return (
    <div>
      <h1>Manage Categories</h1>
      <Button
        type="primary"
        shape="round"
        size="large"
        onClick={() => {
          showModal()
        }}
      >
        Add new
      </Button>

      <div className={style['categoriesContainer']}>
        {data.map((category: IMainCategory, index: number) => (
          <MainCategorySquare
            key={category.id}
            name={category.name}
            id={category.id}
            style={{
              objectFit: (index + 1) % 4 === 0 ? 'cover' : 'fill',
              background: (index + 1) % 5 === 0 ? 'white' : ''
            }}
            logo={category.logo}
          />
        ))}
      </div>
      <Modal
        confirmLoading={loading}
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>

          <Form.Item label="Logo" name="logo">
            <ImageInput
              height="200px"
              width="200px"
              onError={(error) => {
                console.log(error)
              }}
              onChange={(imageLink) => {
                console.log({ imageLink })
                form.setFieldsValue({
                  logo: imageLink
                })

                form.validateFields()
              }}
              value={form.getFieldValue('logo')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ManageCategories
