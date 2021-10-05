import Calendar from 'react-calendar'
import { useContext } from 'react'
import { UserContext } from '../../UserContext'
import { useHistory } from 'react-router-dom'
import style from './style.module.css'

function Calendar_() {
  const context = useContext(UserContext)
  const history = useHistory()

  return (
    <div>
      <div className={style['year-month']}>
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
          if (date.getDate() === 17 || date.getDate() === 22 || date.getDate() === 4) {
            return (
              <div className="calendar-tileContent">
                <span onClick={() => history.push('/view/newspaper/1')}>Here</span>
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
