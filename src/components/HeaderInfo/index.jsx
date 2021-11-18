import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
function HeaderInfo() {
  return (
    <div className="headerInfo">
      <div className="headerInfo__nav">
        <AccountCircleIcon style={{ fontSize: '50px' }} />
      </div>

      <div className="headerInfo__buttons">
        <Link to="/user-signin">
        <button className="authButton">تسجيل دخول</button>
        </Link>
        <Link to="/user-add">
        <button className="authButton">انشاء حساب</button>
        </Link>
      </div>
    </div>
  )
}

export default HeaderInfo
