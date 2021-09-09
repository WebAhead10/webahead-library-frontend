import React from "react";
import "./style.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
function HeaderInfo() {
  return (
    <div className="headerInfo">
      <div className="headerInfo__nav">
        <AccountCircleIcon style={{ fontSize: "50px" }} />
      </div>
      <div className="headerInfo__buttons">
        <button className="signupButton">الدخول</button>
        <button className="loginButton">تسجيل دخول</button>
      </div>
    </div>
  );
}

export default HeaderInfo;
