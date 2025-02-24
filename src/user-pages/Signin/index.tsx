// import style from './style.module.css'
import axios from 'utils/axios'
import { useHistory, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import { Form, Input, Button, message, Typography, Row, Col } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

const { Title } = Typography

const Signin = () => {
  const intl = useIntl();
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


const StyledPassword = styled(Input.Password)`
  input {
    background-color: transparent;
    border-color: red;
    color: white;
    padding: 10px;
    height: auto;
    border-radius: 3px;
    direction: ltr;
  }
`;

  return (
    <Row wrap={true} align="middle" justify="center" gutter={[0, 30]} style={{ marginTop: '20px' }}>
      <Col span={24}>
        <Title level={2}><FormattedMessage id="user_sign_in-title" /></Title>
      </Col>
      <Col>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label={intl.formatMessage({ id: 'general_text-email' })}
            name="email"
            rules={[{ required: true, message: intl.formatMessage({ id: 'user_sign_in-input-your-email' }) }]}
            style={{ width: '400px' }}
          >
            <Input size="large" style={{ direction: 'ltr' }} />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({ id: 'general_text-password' })}
            name="password"
            rules={[{ required: true, message: intl.formatMessage({ id: 'user_sign_in-input-your-password' }) }]}
            style={{ width: '400px' }}
          >
            <StyledPassword size="large" style={{ direction: 'ltr' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              <FormattedMessage id="user_sign_in-sign-in" />
            </Button>
          </Form.Item>
        </Form>
        <Link to="/forget-password"><FormattedMessage id="user_sign_in-forget-password" /> </Link>
      </Col>
    </Row>
  )
}

export default Signin
