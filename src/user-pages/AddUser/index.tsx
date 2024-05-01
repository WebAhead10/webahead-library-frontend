import style from './style.module.css'
import React, { FunctionComponent, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { message, Form, Input, Button } from 'antd'

interface AddUserInfo {
  email: string
  password: string
  confirmPassword: string
  name: string
}

const AddUser: FunctionComponent = () => {
  const [error, setError] = useState('')

  const history = useHistory()

  const onFinish = async (values: { email: string; password: string; confirmPassword: string; name: string }) => {
    setError('')

    if (values.password !== values.confirmPassword) {
      setError('كلمة المرور غير متطابقة')
      return
    }

    try {
      const res = await axios.post(process.env.REACT_APP_API_URL + '/user/add', {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        name: values.name
      })
      if (!res.data.success) {
        setError('Something went wrong')
      } else {
        message.success('Successfully registered')
        history.push('/user-signin')
      }
    } catch (error: any) {
      setError('Failed: ' + error?.message)
    }
  }

  return (
    <div className={style.addUser}>
      <h1>تسجيل مستخدم جديد</h1>
      <br />
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="البريد الالكتروني"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
          style={{ width: '400px' }}
        >
          <Input size="large" style={{ direction: 'ltr' }} />
        </Form.Item>

        <Form.Item
          label="كلمة المرور"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          style={{ width: '400px' }}
        >
          <Input.Password size="large" style={{ direction: 'ltr' }} />
        </Form.Item>

        <Form.Item
          label="تاكيد كلمة المرور"
          name="confirmPassword"
          rules={[{ required: true, message: 'Please input your password!' }]}
          style={{ width: '400px' }}
        >
          <Input.Password size="large" style={{ direction: 'ltr' }} />
        </Form.Item>

        <Form.Item
          label="اسم"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
          style={{ width: '400px' }}
        >
          <Input size="large" style={{ direction: 'ltr' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            تسجيل
          </Button>
        </Form.Item>
      </Form>
      {/* <label htmlFor="email" className="label-input-combo">
        بريد الكتروني
        <input name="email" type="email" onChange={onChange('email')} value={newUser.email} required />
      </label>
      <br />
      <label htmlFor="email" className="label-input-combo">
        اسم
        <input name="name" type="text" onChange={onChange('name')} value={newUser.name} required />
      </label>
      <br />

      <label htmlFor="password" className="label-input-combo">
        كلمة المرور
        <input name="password" type="password" onChange={onChange('password')} value={newUser.password} required />
      </label>
      <br />

      <label htmlFor="confirmPassword" className="label-input-combo">
        تاكيد كلمة المرور
        <input
          name="confirmPassword"
          type="password"
          onChange={onChange('confirmPassword')}
          value={newUser.confirmPassword}
          required
        />
      </label>
      <br />
      <input type="button" value="تسجيل" className="button" onClick={onClick} /> */}
      <span className={style.errorMsg}>{error}</span>
    </div>
  )
}

export default AddUser
