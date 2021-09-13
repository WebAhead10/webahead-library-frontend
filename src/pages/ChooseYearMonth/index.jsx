import React, { useContext } from "react";
import "./style.css";
import { UserContext } from "../../UserContext";
import { useHistory } from "react-router-dom";

const data = [{ date: "01/09/2002" }, { date: "18/08/2002" }];

function ChooseYearMonth() {
  const history = useHistory();
  const { setValue } = useContext(UserContext);

  return (
    <div className="rightSide">
      {[2000, 2001, 2002, 2003, 2004, 2005].map((e, index) => (
        <div key={index} className="year">
          <h2>{e}</h2>
          <div className="names_of_monthes">
            <ul className="nav__monthes">
              {[
                "يناير",
                "فبراير",
                "مارس",
                "ابريل",
                "مايو",
                "يونيو",
                "يوليو",
                "أغسطس",
                "سبتمبر",
                "أكتوبر",
                "نوفمبر",
                "ديسامبر",
              ].map((m, index) => (
                <li
                  key={index}
                  className={`${
                    m === "أكتوبر" ? "disabled__nav__item" : "nav__item"
                  }`}
                  onClick={() => {
                    if (m !== "أكتوبر") {
                        setValue({ m, e })
                      history.push('/')
                    }
                    
                  }}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChooseYearMonth;
