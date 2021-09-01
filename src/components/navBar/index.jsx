import React from "react";
import "./style.css";
function index() {
  return (
    <div className="navbar_container">
      <ul>
        <li>
          <a class="active" href="/">
            الصفحة الرئيسية
          </a>
        </li>
        <li>
          <a href="article">مقالات</a>
        </li>
        <li className='lastNav'>
          <a href="newspaper">الصحف</a>
        </li>
        <li className='lastNav'>
          <a href="aboutUs">من نحن</a>
        </li>
      </ul>
      <hr></hr>
    </div>
  );
}

export default index;
