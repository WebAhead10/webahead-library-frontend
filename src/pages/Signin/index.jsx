import "./style.css"
import React, { useState } from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"

const Signin = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  })

  const history = useHistory()

  const onChange =
    (stateKey) =>
    ({ target }) =>
      setUserData({ ...userData, [stateKey]: target.value })

  const onSubmit = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/signin", userData)
      .then((res) => {
        if (!res.data.success) {
          console.log("response success state returne false")
          // TODO what to do here
          // ! ask mario
        } else {
          localStorage.setItem("token", res.data.token)
          history.push("/")
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="signin">
      <h1>LOGIN</h1>
      <form action="/" method="POST" className="form">
        <label htmlFor="email">
          Email
          <input
            name="email"
            placeholder="  Type your Email"
            type="email"
            onChange={onChange("email")}
            value={userData.email}
          />
        </label>
        <br />

        <label htmlFor="password">
          Password
          <input
            name="password"
            className="password"
            type="password"
            placeholder="  Type your password"
            onChange={onChange("password")}
            value={userData.password}
          />
        </label>

        <input type="button" value="Submit" onClick={onSubmit} />
      </form>
    </div>
  )
}

export default Signin
