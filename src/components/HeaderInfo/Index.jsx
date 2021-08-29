import React from "react";
import "./style.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
function Index() {
  return (
    <div className="headerInfo">
      <div className="headerInfo__nav">
        <div className="headerInfo__option">
          <span className="headerInfo__optionLineOne">
            <AccountCircleIcon style={{ fontSize: "50px" }} />
          </span>
          <div className="headerInfo__buttons">
            <button className="signupButton">Login</button>
            <button className="loginButton">Signup</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
