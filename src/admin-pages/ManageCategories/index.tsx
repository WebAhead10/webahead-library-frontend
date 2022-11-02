import { useQuery } from '@tanstack/react-query'
import MainCategorySquare from 'components/MainCategorySquare'
import { IMainCategory, IViewTypeRadio } from 'types'
import { viewTypes } from 'consts'
import { Button, Modal, Form, Input, Radio, message } from 'antd'

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
      const { name, logo, viewType, id } = values

      try {
        const res = await axios.post('/categories/add', { name, logo, viewType, id })
        if (res.data.success) {
          setIsModalVisible(false)
          form.resetFields()
          refetch()
          setLoading(false)
        }
      } catch (error: any) {
        message.error(error.response.data.message)
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
          form.setFieldsValue({ name: '', logo: '', viewType: viewTypes[0].value, id: '' })
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
            style={{
              objectFit: (index + 1) % 4 === 0 ? 'cover' : 'fill',
              background: (index + 1) % 5 === 0 ? 'white' : ''
            }}
            logo={category.logo}
            onClick={() => {
              form.setFieldsValue({
                name: category.name,
                logo: category.logo,
                id: category.id,
                viewType: category.viewType
              })

              showModal()
            }}
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

          <Form.Item hidden name="id">
            <Input />
          </Form.Item>

          <Form.Item label="View type" name="viewType">
            <Radio.Group>
              {viewTypes.map((viewType: IViewTypeRadio) => (
                <Radio value={viewType.value}>{viewType.label}</Radio>
              ))}
            </Radio.Group>
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
