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
              {[
                "يونيو",
                "مايو",
                "ابريل",
                "مارس",
                "فبراير",
                "يناير",
                "ديسامبر",
                "نوفمبر",
                "أكتوبر",
                "سبتمبر",
                "أغسطس",
                "يوليو",
              ].map((m) => (
                <li id="يناير" class="nav__item">
                  <a class="nav-link" href="/">
                    {m}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArticleData;
