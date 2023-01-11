import { Button, Form, Input, message, Typography, Row, Col } from 'antd'
import axios from 'utils/axios'
import { useHistory, useParams } from 'react-router-dom'

const { Title } = Typography

const ResetPassword = () => {
  const history = useHistory()
  const { token } = useParams<{ token: string }>()

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('كلمة المرور غير متطابقة')
      return
    }

    try {
      const { data } = await axios.post('/user/reset-password', {
        token,
        password: values.password
      })
      if (!data.success) {
        message.error('Something went wrong')
        return
      }

      message.success('تم تغيير كلمة المرور بنجاح')

      history.push('/user-signin')
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
            label="كلمة المرور الجديدة"
            name="password"
            rules={[{ required: true, message: 'Please input your email!' }]}
            style={{ width: '400px' }}
          >
            <Input size="large" style={{ direction: 'ltr' }} type="password" />
          </Form.Item>

          <Form.Item
            label="تأكيد كلمة المرور"
            name="confirmPassword"
            rules={[{ required: true, message: 'Please input your email!' }]}
            style={{ width: '400px' }}
          >
            <Input size="large" style={{ direction: 'ltr' }} type="password" />
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

export default ResetPassword
