import Calendar from 'react-calendar'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'utils/axios'
import { INewspaperParams, IRandomKeys } from 'types'
import { Breadcrumb } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { useRecoilValue } from 'recoil'
import { languageAtom } from 'utils/recoil/atoms'

interface INewspaperDay {
  id: number
  day: string
}

function Calendar_() {
  const intl = useIntl();
  const languageObj = useRecoilValue(languageAtom)
  const lang = languageObj.language || 'en';
  const history = useHistory()
  let { categoryId, year, month } = useParams<INewspaperParams>()
  const [publishedDays, setPublishedDays] = useState([])
  const [breadcrumbs, setBreadcrumbs] = useState([])


  const monthsIntl = {
    january: intl.formatMessage({ id: 'calendar_months-january' }),
    february: intl.formatMessage({ id: 'calendar_months-february' }),
    march: intl.formatMessage({ id: 'calendar_months-march' }),
    april: intl.formatMessage({ id: 'calendar_months-april' }),
    may: intl.formatMessage({ id: 'calendar_months-may' }),
    june: intl.formatMessage({ id: 'calendar_months-june' }),
    july: intl.formatMessage({ id: 'calendar_months-july' }),
    august: intl.formatMessage({ id: 'calendar_months-august' }),
    september: intl.formatMessage({ id: 'calendar_months-september' }),
    october: intl.formatMessage({ id: 'calendar_months-october' }),
    november: intl.formatMessage({ id: 'calendar_months-november' }),
    december: intl.formatMessage({ id: 'calendar_months-december' }),
  };


  const monthNameToNumber: IRandomKeys = {
    [monthsIntl.january]: '01',
    [monthsIntl.february]: '02',
    [monthsIntl.march]: '03',
    [monthsIntl.april]: '04',
    [monthsIntl.may]: '05',
    [monthsIntl.june]: '06',
    [monthsIntl.july]: '07',
    [monthsIntl.august]: '08',
    [monthsIntl.september]: '09',
    [monthsIntl.october]: '10',
    [monthsIntl.november]: '11',
    [monthsIntl.december]: '12',
  };

  const fetchPublishDates = useCallback(async () => {
    if (!categoryId || !year || !month) {
      window.location.href = '/'
    }

    try {
      if (month === 'January') {
        month = 'كانون ثاني';
      } else if (month === 'February') {
        month = 'شباط';
      } else if (month === 'March') {
        month = 'آذار';
      } else if (month === 'April') {
        month = 'نيسان';
      } else if (month === 'May') {
        month = 'أيار';
      } else if (month === 'June') {
        month = 'حزيران';
      } else if (month === 'July') {
        month = 'تموز';
      } else if (month === 'August') {
        month = 'آب';
      } else if (month === 'September') {
        month = 'أيلول';
      } else if (month === 'October') {
        month = 'تشرين أول';
      } else if (month === 'November') {
        month = 'تشرين ثاني';
      } else if (month === 'December') {
        month = 'كانون أول';
      }
      
      const result = await axios.get(`/document/publish/dates/${categoryId}/${year}/${month}`);

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
          fontSize: '18px',
          textAlign: lang === 'ar' ? 'right' : 'left',
          direction: lang === 'ar' ? 'rtl' : 'ltr',
        }}
      >
        <Breadcrumb.Item>
          <a href="/"><FormattedMessage id="bread_crumb-home"/></a>
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
        locale={lang}
        activeStartDate={new Date(+year, +monthNameToNumber[month] - 1, 1)}
        calendarType={lang === 'en' ? 'US' : 'Arabic'}
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
