import React from "react";
import "./style.css";
function ArticleData() {
  return (
    <div className="rightSide">
      {[2000, 2001, 2002, 2003, 2004, 2005].map((e) => (
        <div className="year">
          <h2>{e}</h2>
          <div className="names_of_monthes">
            <ul class="nav__monthes">
              <li id="يناير" class="nav__item">
                <a class="nav-link" href="/">
                  يناير
                </a>
              </li>
              <li id="فبراير" class="nav__item">
                <a class="nav-link" href="/">
                  فبراير
                </a>
              </li>
              <li id="مارس" class="nav__item">
                <a class="nav-link" href="/">
                  مارس
                </a>
              </li>
              <li id="ابريل" class="nav__item">
                <a class="nav-link" href="/">
                  ابريل
                </a>
              </li>
              <li id="مايو" class="nav__item">
                <a class="nav-link" href="/">
                  مايو
                </a>
              </li>
              <li id="يونيو" class="nav__item">
                <a class="nav-link" href="/">
                  يونيو
                </a>
              </li>
              <li id="يوليو" class="nav__item">
                <a class="nav-link" href="/">
                  يوليو
                </a>
              </li>
              <li id="أغسطس" class="nav__item">
                <a class="nav-link" href="/">
                  أغسطس
                </a>
              </li>
              <li id="سبتمبر" class="nav__item">
                <a class="nav-link" href="/">
                  سبتمبر
                </a>
              </li>
              <li id="أكتوبر" class="nav__item">
                <a class="nav-link" href="/">
                  أكتوبر
                </a>
              </li>
              <li id="نوفمبر" class="nav__item">
                <a class="nav-link" href="/">
                  نوفمبر
                </a>
              </li>
              <li id="ديسمبر" class="nav__item">
                <a class="nav-link" href="/">
                  ديسمبر
                </a>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArticleData;
