// import style from './style.module.css'
import axios from 'utils/axios'
import { useHistory, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Input, Button, message, Typography, Row, Col } from 'antd'

const { Title } = Typography

const Signin = () => {
  const queryClient = useQueryClient()

  const history = useHistory()

  const onFinish = async (userData: { email: string; password: string }) => {
    try {
      const res = await axios.post('/user/signin', userData)
      if (!res.data.success) {
        message.error('Something went wrong')
        return
      }

      history.push('/')
      queryClient.invalidateQueries(['user'])
    } catch (error) {
      message.error('Something went wrong')
    }
  }

  return (
    <Row wrap={true} align="middle" justify="center" gutter={[0, 30]} style={{ marginTop: '20px' }}>
      <Col span={24}>
        <Title level={2}>تسجيل دخول المستخدم</Title>
      </Col>
      <Col>
        <Form
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}

          layout="vertical"
        >
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

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              دخول
            </Button>
          </Form.Item>
        </Form>
        <Link to="/forget-password">نسيت كلمة المرور؟</Link>
      </Col>
    </Row>
  )
}

export default Signin
