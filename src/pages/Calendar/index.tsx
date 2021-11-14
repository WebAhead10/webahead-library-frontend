import Calendar from 'react-calendar'
import { useContext, useCallback, useEffect, useState } from 'react'
import { UserContext } from '../../UserContext'
import { useHistory, useParams } from 'react-router-dom'
import style from './style.module.css'
import axios from 'axios'

const monthNameToNumber: IRandomKeys = {
  يناير: '01',
  فبراير: '02',
  مارس: '03',
  ابريل: '04',
  مايو: '05',
  يونيو: '06',
  يوليو: '07',
  أغسطس: '08',
  سبتمبر: '09',
  أكتوبر: '10',
  نوفمبر: '11',
  ديسامبر: '12'
}

interface INewspaperDay {
  id: number
  day: string
}

function Calendar_() {
  const context = useContext(UserContext)
  const history = useHistory()
  const { publisherId, year, month } = useParams<NewspaperParams>()
  const [publishedDays, setPublishedDays] = useState([])

  const fetchPublishDates = useCallback(async () => {
    if (!publisherId || !year || !month) {
      window.location.href = '/'
    }

    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/publish/dates/${publisherId}/${year}/${month}`)

      setPublishedDays(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [publisherId, year, month])

  useEffect(() => {
    fetchPublishDates()
  }, [fetchPublishDates])

  return (
    <div>
      <div className={style['year-month']}>
        <span>{context.value.newspaper}</span>
        <span>{context.value.year}</span>
        <span>{context.value.month}</span>
      </div>
      <Calendar
        locale="ar"
        activeStartDate={new Date(+year, +monthNameToNumber[month] - 1, 1)}
        calendarType="Arabic"
        showNavigation={false}
        tileClassName="day-tile"
        tileContent={({ date }) => {
          const newspaperDay: INewspaperDay | any = publishedDays.find(({ day }) => +day === date.getDate())

          if (newspaperDay && +monthNameToNumber[month] - 1 === date.getMonth()) {
            // if (newspaperDay) {
            return (
              <div className="calendar-tileContent">
                <span onClick={() => history.push(`/view/newspaper/${newspaperDay.id}`)}>Here</span>
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
