import style from './style.module.css'
import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

interface signInProps {
  setToken : Function
}

const Signin = (props: signInProps) => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const history = useHistory()

  const onChange =
    (stateKey: string) =>
    ({ target }: { target: HTMLInputElement }) =>
      setUserData({ ...userData, [stateKey]: target.value })

  const onClick = () => {
    axios
      .post(process.env.REACT_APP_API_URL + '/user/signin', userData)
      .then((res) => {
        if (!res.data.success) {
          setError('Something went wrong')
        } else {
          localStorage.setItem('token', res.data.token)
          props.setToken(res.data.token) 
          history.push('/')
        }
      })
      .catch((err) => {
        setError('Something went wrong')
      })
  }

  return (
    <div className={style.signin}>
      <h1>تسجيل دخول المستخدم</h1>
      <label htmlFor="email" className="label-input-combo">
        بريد الكتروني
        <input name="email" type="email" onChange={onChange('email')} value={userData.email} />
      </label>
      <br />

      <label htmlFor="password" className="label-input-combo">
        كلمة المرور
        <input name="password" type="password" onChange={onChange('password')} value={userData.password} />
      </label>
      <br />
      <input type="button" className="button" value="دخول" onClick={onClick} />
      <span className="error">{error}</span>
    </div>
  )
}

export default Signin
