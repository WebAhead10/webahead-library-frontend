import style from './style.module.css'
import React, { FunctionComponent, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

interface AddUserInfo {
  email: string
  password: string
  confirmPassword: string
  name: string
}

const AddUser: FunctionComponent = () => {
  const [newUser, setNewUser] = useState<AddUserInfo>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  const [error, setError] = useState('')

  const history = useHistory()

  const onChange =
    (stateKey: string) =>
    ({ target }: { target: HTMLInputElement }) => {
      setNewUser({ ...newUser, [stateKey]: target.value })
    }

  const matchedPassword = () => newUser.password === newUser.confirmPassword

  const onClick = () => {
    setError('')

    if (!matchedPassword()) {
      setError('passwords dont match, check and start again')
      return
    }
    axios
      .post(process.env.REACT_APP_API_URL + '/user/add', newUser)
      .then((res) => {
        if (!res.data.success) {
          setError('Something went wrong')
        } else {
          history.push('/')
        }
      })
      .catch((err) => {
        setError('Failed: ' + err.message)
      })
  }

  return (
    <div className={style.addUser}>
      <h1>Add User</h1>
      <br />
      <label htmlFor="email" className="label-input-combo">
        Email :
        <input name="email" type="email" onChange={onChange('email')} value={newUser.email} required />
      </label>
      <br />
      <br />
      <label htmlFor="email" className="label-input-combo">
        Name :
        <input name="name" type="text" onChange={onChange('name')} value={newUser.name} required />
      </label>
      <br />

      <label htmlFor="password" className="label-input-combo">
        Password :
        <input name="password" type="password" onChange={onChange('password')} value={newUser.password} required />
      </label>
      <br />

      <label htmlFor="confirmPassword" className="label-input-combo">
        Confirm password :
        <input
          name="confirmPassword"
          type="password"
          onChange={onChange('confirmPassword')}
          value={newUser.confirmPassword}
          required
        />
      </label>
      <br />
      <input type="button" value="Add" className="button" onClick={onClick} />
      <span className={style.errorMsg}>{error}</span>
    </div>
  )
}

export default AddUser