import style from './style.module.css'
import { FunctionComponent, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { message, Form, Input, Button } from 'antd'
import { useIntl, FormattedMessage } from 'react-intl'


const AddUser: FunctionComponent = () => {
  const intl = useIntl();
  const [error, setError] = useState('')

  const history = useHistory()

  const onFinish = async (values: { email: string; password: string; confirmPassword: string; name: string }) => {
    setError('')
    if (values.password !== values.confirmPassword) {
      setError(intl.formatMessage({ id: 'user_sign_up-passwords-not-match' }))
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
        setError(intl.formatMessage({ id: 'general_text_error-something-went-wrong' }))
      } else {
        message.success(intl.formatMessage({ id: 'user_sign_up-successfully-registered' }))
        history.push('/user-signin')
      }
    } catch (error: any) {
      setError('Failed: ' + error?.message)
    }
  }

  return (
    <div className={style.addUser}>
      <h1><FormattedMessage id="user_sign_up-title" /></h1>
      <br />
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label={intl.formatMessage({ id: 'general_text-email' })}
          name="email"
          rules={[{ required: true, message: intl.formatMessage({ id: 'user_sign_up-please-enter-your-email-address' }) }]}
          style={{ width: '400px' }}
        >
          <Input size="large" style={{ direction: 'ltr' }} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'general_text-password' })}
          name="password"
          rules={[{ required: true, message: intl.formatMessage({ id: 'user_sign_up-please-enter-your-password' }) }]}
          style={{ width: '400px' }}
        >
          <Input.Password size="large" style={{ direction: 'ltr' }} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'user_sign_up-confirm-password' })}
          name="confirmPassword"
          rules={[{ required: true, message: intl.formatMessage({ id: 'user_sign_up-please-enter-your-password-again' }) }]}
          style={{ width: '400px' }}
        >
          <Input.Password size="large" style={{ direction: 'ltr' }} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'general_text-name' })}
          name="name"
          rules={[{ required: true, message: intl.formatMessage({ id: 'user_sign_up-please-enter-your-name' }) }]}
          style={{ width: '400px' }}
        >
          <Input size="large" style={{ direction: 'ltr' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            <FormattedMessage id="user_sign_up-sign-up" />
          </Button>
        </Form.Item>
      </Form>
      <span className={style.errorMsg}>{error}</span>
    </div>
  )
}

export default AddUser
