import { useContext, useState } from "react"
import "./style.css"
import { UserContext } from "../../UserContext"
import { useHistory, useParams } from "react-router-dom"

const months = [
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
]
const years = [2000, 2001, 2002, 2003, 2004, 2005]

function ChooseYearMonth() {
  const history = useHistory()
  const params = useParams()
  const { setValue, value } = useContext(UserContext)
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")

  return (
    <div>
      <div className="choose-year-top">
        <label className="date-dropdown-container" htmlFor="dropdown-year">
          <span>سنة: </span>
          <select
            className="date-dropdown"
            id="dropdown-year"
            onChange={({ target }) => setYear(target.value)}
            value={year}
          >
            <option value="" selected></option>
            {years.map((currentYear) => (
              <option value={currentYear}>{currentYear}</option>
            ))}
          </select>
        </label>
        <label className="date-dropdown-container" htmlFor="dropdown-month">
          <span>شهر: </span>
          <select
            className="date-dropdown"
            id="dropdown-month"
            onChange={({ target }) => setMonth(target.value)}
            value={month}
          >
            <option value="" selected></option>
            {months.map((currentMonth) => (
              <option
                value={currentMonth}
                disabled={
                  currentMonth === "أكتوبر" || currentMonth === "فبراير"
                }
              >
                {currentMonth}
              </option>
            ))}
          </select>
        </label>

        <button
          className="button"
          style={{ margin: "0px 10px" }}
          onClick={() => {
            setValue({ newspaper: params.name, month, year })
            history.push("/calendar")
          }}
        >
          اذهب
        </button>
      </div>
      <div>
        {years.map((e, index) => (
          <div key={index} className="date-container">
            <h2>{e}</h2>
            <div className="names_of_monthes">
              <ul className="nav__monthes">
                {months.map((m, index) => (
                  <li
                    key={index}
                    className={
                      m === "أكتوبر" || m === "فبراير"
                        ? "disabled__nav__item"
                        : "nav__item"
                    }
                    onClick={() => {
                      if (m !== "أكتوبر") {
                        setValue({ newspaper: params.name, month: m, year: e })
                        history.push("/calendar")
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
    </div>
  )
}

export default ChooseYearMonth
