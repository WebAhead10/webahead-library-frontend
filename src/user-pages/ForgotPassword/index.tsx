import { Button, Form, Input, message, Typography, Row, Col } from 'antd'
import axios from 'utils/axios'
import { useHistory } from 'react-router-dom'

const { Title } = Typography

const ForgotPassword = () => {
  const history = useHistory()

  const onFinish = async (userData: { email: string }) => {
    try {
      await axios.post('/user/forgot-password', userData)

      message.success(
        'إذا كان البريد الإلكتروني موجودًا في قاعدة البيانات الخاصة بنا ، فستتلقى بريدًا إلكترونيًا قريبًا'
      )

      setTimeout(() => {
        history.push('/user-signin')
      }, 2000)
    } catch (error) {
      message.error('Something went wrong')
    }
  }

  return (
    <Row wrap={true} align="middle" justify="center" gutter={[0, 30]} style={{ marginTop: '20px' }}>
      <Col span={24}>
        <Title level={2}>نسيت كلمة المرور؟</Title>
      </Col>
      <Col>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="البريد الالكتروني"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
            style={{ width: '400px' }}
          >
            <Input size="large" style={{ direction: 'ltr' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              ارسال
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default ForgotPassword
