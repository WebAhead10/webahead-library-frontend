import { useState, useEffect, useCallback } from 'react'
import style from './style.module.css'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import { INewspaperParams } from 'types'

const months = [
  'يناير',
  'فبراير',
  'مارس',
  'ابريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسامبر'
]

function ChooseYearMonth() {
  const history = useHistory()
  const params = useParams<INewspaperParams>()
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [publishedDocs, setPublishedDocs] = useState<{ [key: string]: string[] }>({})

  const fetchPublishDates = useCallback(async () => {
    if (!params.publisherId) {
      window.location.href = '/'
    }

    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/publish/dates/${params.publisherId}`)

      setPublishedDocs(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [params.publisherId])

  useEffect(() => {
    fetchPublishDates()
  }, [fetchPublishDates])

  return (
    <div>
      <div className={style['choose-year-top']}>
        <label className={style['date-dropdown-container']} htmlFor="dropdown-year">
          <span>سنة: </span>
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
          <span>شهر: </span>
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
            history.push(`/calendar/${params.publisherId}/${year}/${month}`)
          }}
        >
          اذهب
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
                      if (currentMonth !== 'أكتوبر') {
                        history.push(`/calendar/${params.publisherId}/${currentYear}/${currentMonth}`)
                      }
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
