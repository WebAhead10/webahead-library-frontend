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

  const [error, setError] = useState("");

  const history = useHistory();

  const onChange =
    (stateKey) =>
    ({ target }) => {
      setNewAdmin({ ...newAdmin, [stateKey]: target.value });
    };

  const matchedPassword = () => 
    newAdmin.password === newAdmin.confirmPassword;
  

  const sendData = () => {
    setError("");
    if (!matchedPassword()) {
      setError("passwords dont match, check and start again");
      return;
    }
      axios
        .post(process.env.REACT_APP_API_URL + "/addadmin", newAdmin)
        .then((res) => {
          if (!res.data.success) {
            setError("something went wrong");
          } else {
            history.push("/");
          }
        })
        .catch((err) => {
          setError("axios problem: " + err.message);
        });
    
  };

  return (
    <div className="addAdmin">
      <form className="form">
        <h1>Add Admin</h1>
        <label htmlFor="email">
          Email :
          <input
            name="email"
            placeholder="  Type admin Email"
            type="email"
            onChange={onChange("email")}
            value={newAdmin.email}
            required
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
            required
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
            required
          />
        </label>

        <input type="button" value="Add" onClick={sendData} />
        <span className="errorMsg">{error}</span>
      </form>
    </div>
  );
};

export default AddAdmin;
