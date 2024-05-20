import style from './style.module.css'
import React, { useState } from 'react'
import axios from 'utils/axios'
import { useHistory } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userAtom } from 'utils/recoil/atoms'

const Signin = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  })
  const setUser = useSetRecoilState(userAtom)

  const [error, setError] = useState('')

  const history = useHistory()

  const onChange =
    (stateKey: string) =>
    ({ target }: { target: HTMLInputElement }) =>
      setUserData({ ...userData, [stateKey]: target.value })

  const onClick = async () => {
    try {
      const res = await axios.post('/admin/signin', userData)
      if (!res.data.success) {
        setError('Something went wrong')
        return
      }

      const userRes = await axios.get('/user')

      setUser(userRes.data)
      history.push('/users')

      window.location.reload()
      // window.location.href = '/a/admin/'
    } catch (error) {
      setError('Something went wrong')
    }
  }

  return (
    <div className={style.signin}>
      <br />
      <br />
      <br />
      <label htmlFor="email" className="label-input-combo">
        Email
        <input name="email" type="email" onChange={onChange('email')} value={userData.email} />
      </label>
      <br />

      <label htmlFor="password" className="label-input-combo">
        Password
        <input name="password" type="password" onChange={onChange('password')} value={userData.password} />
      </label>
      <br />
      <input type="button" className="button" value="Submit" onClick={onClick} />
      <span className="error">{error}</span>
    </div>
  )
}

export default Signin
