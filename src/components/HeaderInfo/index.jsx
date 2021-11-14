import React from 'react'
import './style.css'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
function HeaderInfo() {
  return (
    <div className="headerInfo">
      <div className="headerInfo__nav">
        <AccountCircleIcon style={{ fontSize: '50px' }} />
      </div>

      <div className="headerInfo__buttons">
        <button className="authButton">الدخول</button>
        <button className="authButton">تسجيل دخول</button>
      </div>
    </div>
  )
}

export default HeaderInfo
