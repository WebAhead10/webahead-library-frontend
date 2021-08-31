import "./style.css";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const AddAdmin = () => {
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const history = useHistory();

  const onChange =
    (stateKey) =>
    ({ target }) =>
    setNewAdmin({ ...newAdmin, [stateKey]: target.value });

  const onSubmit = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/addadmin", newAdmin)
      .then((res) => {
        if (!res.data.success) {
            // res.send();
            console.log("something went wrong");
        } else {
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="addAdmin">
      <form action="/" method="POST" className="form">
          <h1>Add Admin</h1>
        <label htmlFor="email">
          Email :
          <input
            name="email"
            placeholder="  Type admin Email"
            type="email"
            onChange={onChange("email")}
            value={newAdmin.email}
          />
        </label>


        <label htmlFor="password">
          Password :
          <input
            name="password"
            className="password"
            type="password"
            placeholder="  Type admin password"
            onChange={onChange("password")}
            value={newAdmin.password}
          />
        </label> 

        <label htmlFor="confirmPassword">
          confirm Password :
          <input
            name="confirmPassword"
            className="password"
            type="password"
            placeholder=" Re-Type admin password"
            onChange={onChange("confirmPassword")}
            value={newAdmin.confirmPassword}
          />
        </label>

        <input type="button" value="Add" onClick={onSubmit} />
      </form>
    </div>
  );
};

export default AddAdmin;
