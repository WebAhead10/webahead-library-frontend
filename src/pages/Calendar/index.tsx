import Calendar from 'react-calendar'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'utils/axios'
import { INewspaperParams, IRandomKeys } from 'types'
import { Breadcrumb } from 'antd'

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
  const history = useHistory()
  const { categoryId, year, month } = useParams<INewspaperParams>()
  const [publishedDays, setPublishedDays] = useState([])
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const fetchPublishDates = useCallback(async () => {
    if (!categoryId || !year || !month) {
      window.location.href = '/'
    }

    try {
      const result = await axios.get(`/document/publish/dates/${categoryId}/${year}/${month}`)

      setPublishedDays(result.data.data)
      setBreadcrumbs(result.data.breadcrumbs || [])
    } catch (error) {
      console.log(error)
    }
  }, [categoryId, year, month])

  useEffect(() => {
    fetchPublishDates()
  }, [fetchPublishDates])

  return (
    <div>
      <Breadcrumb
        style={{
          margin: '20px',
          fontSize: '18px'
        }}
      >
        <Breadcrumb.Item>
          <a href="/">الرئيسية</a>
        </Breadcrumb.Item>
        {breadcrumbs.map(({ path, name }: { path: string; name: string }, index: number) => (
          <Breadcrumb.Item key={index}>
            <a href={path}>{name}</a>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>

      {/* TODO: Fix using recoil */}
      {/* <div className={style['year-month']}>
        <span>{context.value.newspaper}</span>
        <span>{context.value.year}</span>
        <span>{context.value.month}</span>
      </div> */}
      <Calendar
        locale="ar"
        activeStartDate={new Date(+year, +monthNameToNumber[month] - 1, 1)}
        calendarType="Arabic"
        showNavigation={false}
        onClickDay={(value) => {
          const newspaperDay: INewspaperDay | any = publishedDays.find(({ day }) => +day === value.getDate())

          if (newspaperDay) {
            history.push(`/view/newspaper/${newspaperDay.id}`)
          }
        }}
        tileClassName="day-tile"
        tileDisabled={({ date }) => {
          const newspaperDay: INewspaperDay | any = publishedDays.find(({ day }) => +day === date.getDate())

          if (newspaperDay && +monthNameToNumber[month] - 1 === date.getMonth()) {
            return false
          }
          return true
        }}
        // tileContent={({ date }) => {
        //   const newspaperDay: INewspaperDay | any = publishedDays.find(({ day }) => +day === date.getDate())

        //   if (newspaperDay && +monthNameToNumber[month] - 1 === date.getMonth()) {
        //     // if (newspaperDay) {
        //     return (
        //       <div className="calendar-tileContent">
        //         {/* <span onClick={() => history.push(`/view/newspaper/${newspaperDay.id}`)}>Here</span> */}
        //       </div>
        //     )
        //   }
        //   return null
        // }}
      />
    </div>
  )
}

export default Calendar_
