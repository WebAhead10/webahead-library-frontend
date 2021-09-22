import { useState } from "react"
import Calendar from "react-calendar"
// import "react-calendar/dist/Calendar.css"
import { useContext } from "react"
import { UserContext } from "../../UserContext"
import { useHistory } from "react-router-dom"
import "./style.css"

function Calendar_() {
  const context = useContext(UserContext)
  const history = useHistory()

  console.log(context.value)
  return (
    <div className="calendar_container">
      <div className="year-month">
        <span>{context.value.newspaper}</span>
        <span>{context.value.year}</span>
        <span>{context.value.month}</span>
      </div>
      <Calendar
        // onChange={setValue}
        // value={value}
        locale="ar"
        calendarType="Arabic"
        showNavigation={false}
        tileClassName="day-tile"
        // tileDisabled={() => true}
        tileContent={({ activeStartDate, date, view }) => {
          if (
            date.getDate() === 17 ||
            date.getDate() === 22 ||
            date.getDate() === 4
          ) {
            return (
              <div className="calendar-tileContent">
                <span onClick={() => history.push("/view/newspaper/2")}>
                  Here
                </span>
              </div>
            )
          }
          return null
        }}
      />
    </div>
  )
}

export default Calendar_
