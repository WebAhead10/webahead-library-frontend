import { useState, useEffect, useCallback } from 'react'
import style from './style.module.css'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'utils/axios'
import { FormattedMessage, useIntl } from 'react-intl'
import { INewspaperParams } from 'types'
import { Breadcrumb } from 'antd'
import { useRecoilValue } from 'recoil'
import { languageAtom } from 'utils/recoil/atoms'


function ChooseYearMonth() {
  const intl = useIntl();
  const history = useHistory()
  const params = useParams<INewspaperParams>()
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [publishedDocs, setPublishedDocs] = useState<{ [key: string]: string[] }>({})
  const [breadcrumb, setBreadcrumb] = useState([])
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
  const months = [
    monthsIntl.january,
    monthsIntl.february,
    monthsIntl.march,
    monthsIntl.april,
    monthsIntl.may,
    monthsIntl.june,
    monthsIntl.july,
    monthsIntl.august,
    monthsIntl.september,
    monthsIntl.october,
    monthsIntl.november,
    monthsIntl.december,
  ];
  const languageObj = useRecoilValue(languageAtom)
      const lang = languageObj.language || 'en';

  const fetchPublishDates = useCallback(async () => {
    if (!params.categoryId) {
      window.location.href = '/'
    }

    try {
      const result = await axios.get(`/document/publish/dates/${params.categoryId}`);
      if (lang === 'en') {
      
        const arabicToEnglishMonths: Record<string, string> = {
          'كانون الثاني': 'January',
          'شباط': 'February',
          'آذار': 'March',
          'نيسان': 'April',
          'أيار': 'May',
          'حزيران': 'June',
          'تموز': 'July',
          'آب': 'August',
          'أيلول': 'September',
          'تشرين الأول': 'October',
          'تشرين ثاني': 'November',
          'كانون الأول': 'December',
        };
      
        console.log('result.data.data', result.data.data);  
        // Transform Arabic month names to English for all year keys
        result.data.data = Object.fromEntries(
          Object.entries(result.data.data).map(([year, months]) => {
            // Check if the key is a valid year and the value is an array
            if (/^\d{4}$/.test(year) && Array.isArray(months)) {
              return [
                year,
                months.map((month) => arabicToEnglishMonths[month] || month), // Convert month names
              ];
            }
            return [year, months]; // Keep non-year keys or invalid data as is
          })
        );      
      }
      

      setPublishedDocs(result.data.data)
      setBreadcrumb(result.data.breadcrumbs || [])
    } catch (error) {
      console.log(error)
    }
  }, [params.categoryId])

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
        {breadcrumb.map(
          (
            item: {
              name: string
              path: string
            },
            index
          ) => (
            <Breadcrumb.Item key={index}>
              <a href={item.path}>{item.name}</a>
            </Breadcrumb.Item>
          )
        )}
      </Breadcrumb>

      <div className={style['choose-year-top']}>
        <label className={style['date-dropdown-container']} htmlFor="dropdown-year">
          <span><FormattedMessage id="general_text-year"/>: </span>
          <select
            className={style['date-dropdown']}
            id="dropdown-year"
            onChange={({ target }) => setYear(target.value)}
            value={year}
          >
            <option value=""></option>
            {Object.keys(publishedDocs).map((currentYear, i) => (
              <option key={i} value={currentYear}>
                {currentYear}
              </option>
            ))}
          </select>
        </label>
        <label className={style['date-dropdown-container']} htmlFor="dropdown-month">
          <span><FormattedMessage id="general_text-month"/>: </span>
          <select
            className={style['date-dropdown']}
            id="dropdown-month"
            onChange={({ target }) => setMonth(target.value)}
            value={month}
          >
            <option value=""></option>
            {months.map((currentMonth, i) => (
              <option key={i} value={currentMonth} disabled={!year || !publishedDocs[year].includes(currentMonth)}>
                {currentMonth}
              </option>
            ))}
          </select>
        </label>

        <button
          className="button"
          style={{ margin: '0px 10px' }}
          onClick={() => {
            history.push(`/calendar/${params.categoryId}/${year}/${month}`)
          }}
        >
          <FormattedMessage id="general_text-go"/>
        </button>
      </div>
      <div>
        {Object.keys(publishedDocs).map((currentYear, index) => (
          <div key={index} className={style['date-container']}>
            <h2>{currentYear}</h2>
            <div className={style['names_of_monthes']}>
              <ul className={style['nav__monthes']}>
                {months.map((currentMonth, index) => (
                  <li
                    key={index}
                    className={
                      style[!publishedDocs[currentYear].includes(currentMonth) ? 'disabled__nav__item' : 'nav__item']
                    }
                    onClick={() => {
                      history.push(`/calendar/${params.categoryId}/${currentYear}/${currentMonth}`)
                    }}
                  >
                    {currentMonth}
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
