import React, { useContext } from "react"
import "./style.css"
import { UserContext } from "../../UserContext"
import { useHistory } from "react-router-dom"
function ChooseYearMonth() {
  const history = useHistory()
  const { setValue } = useContext(UserContext)
  return (
    <div className="rightSide">
      {[2000, 2001, 2002, 2003, 2004, 2005].map((e, index) => (
        <div key={index} className="year">
          <h2>{e}</h2>
          <div className="names_of_monthes">
            <ul
              className="nav__monthes"
              style={{ display: "flex", flexDirection: "row" }}
            >
              {[
                "يناير",
                "فبراير",
                "مارس",
                "ابريل",
                "مايو",
                "يونيو",
                "يوليو",
                "اغسطس",
                "سبتمبر",
                "اكتوبر",
                "نوفمبر",
                "ديسمبر",
              ].map((m, index) => (
                <li
                  key={index}
                  id={index}
                  onClick={() => {
                    setValue({ m, e, index })
                    history.push("/calender")
                  }}
                  className="nav__item"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChooseYearMonth
