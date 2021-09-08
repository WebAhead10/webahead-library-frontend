import style from "./style.module.css"
import React, { FunctionComponent, useState } from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"

interface AddAdminInfo {
  email: string
  password: string
  confirmPassword: string
}

const AddAdmin: FunctionComponent = () => {
  const [newAdmin, setNewAdmin] = useState<AddAdminInfo>({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")

  const history = useHistory()

  const onChange =
    (stateKey: string) =>
    ({ target }: { target: HTMLInputElement }) => {
      setNewAdmin({ ...newAdmin, [stateKey]: target.value })
    }

  const matchedPassword = () => newAdmin.password === newAdmin.confirmPassword

  const onClick = () => {
    setError("")

    if (!matchedPassword()) {
      setError("passwords dont match, check and start again")
      return
    }
    axios
      .post(process.env.REACT_APP_API_URL + "/addadmin", newAdmin)
      .then((res) => {
        if (!res.data.success) {
          setError("Something went wrong")
        } else {
          history.push("/a/admin")
        }
      })
      .catch((err) => {
        setError("Failed: " + err.message)
      })
  }

  return (
    <div className={style.addAdmin}>
      <h1>Add Admin</h1>
      <br />
      <label htmlFor="email" className="label-input-combo">
        Email :
        <input
          name="email"
          type="email"
          onChange={onChange("email")}
          value={newAdmin.email}
          required
        />
      </label>
      <br />

      <label htmlFor="password" className="label-input-combo">
        Password :
        <input
          name="password"
          type="password"
          onChange={onChange("password")}
          value={newAdmin.password}
          required
        />
      </label>
      <br />

      <label htmlFor="confirmPassword" className="label-input-combo">
        Confirm password :
        <input
          name="confirmPassword"
          type="password"
          onChange={onChange("confirmPassword")}
          value={newAdmin.confirmPassword}
          required
        />
      </label>
      <br />
      <input type="button" value="Add" className="button" onClick={onClick} />
      <span className={style.errorMsg}>{error}</span>
    </div>
  )
}

export default AddAdmin
