import React, { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { useContext } from "react"
import { UserContext } from "../../UserContext"
function Calendar_() {
  const context = useContext(UserContext)
  console.log(context.value)
  const [value, setValue] = useState(
    new Date(context.value.e, context.value.index, 1)
  )
  console.log(value)
  return (
    <div className="calendar_container">
      <Calendar
        onChange={setValue}
        value={value}
        locale="ar"
        calendarType="ISO 8601"
      />
    </div>
  )
}

export default Calendar_
