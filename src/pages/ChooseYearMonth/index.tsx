import { useContext, useState } from 'react'
import style from './style.module.css'
import { UserContext } from '../../UserContext'
import { useHistory, useParams } from 'react-router-dom'

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

interface Params {
  name: string
}

const years = ['2000', '2001', '2002', '2003', '2004', '2005']

function ChooseYearMonth() {
  const history = useHistory()
  const params = useParams<Params>()
  const { setValue } = useContext(UserContext)
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')

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
            <option value="" selected></option>
            {years.map((currentYear) => (
              <option value={currentYear}>{currentYear}</option>
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
            <option value="" selected></option>
            {months.map((currentMonth) => (
              <option value={currentMonth} disabled={currentMonth === 'أكتوبر' || currentMonth === 'فبراير'}>
                {currentMonth}
              </option>
            ))}
          </select>
        </label>

        <button
          className="button"
          style={{ margin: '0px 10px' }}
          onClick={() => {
            setValue({ newspaper: params.name, month, year })
            history.push('/calendar')
          }}
        >
          اذهب
        </button>
      </div>
      <div>
        {years.map((currentYear, index) => (
          <div key={index} className={style['date-container']}>
            <h2>{currentYear}</h2>
            <div className={style['names_of_monthes']}>
              <ul className={style['nav__monthes']}>
                {months.map((currentMonth, index) => (
                  <li
                    key={index}
                    className={
                      currentMonth === 'أكتوبر' || currentMonth === 'فبراير' ? 'disabled__nav__item' : 'nav__item'
                    }
                    onClick={() => {
                      if (currentMonth !== 'أكتوبر') {
                        setValue({
                          newspaper: params.name,
                          month: currentMonth,
                          year: currentYear
                        })
                        history.push('/calendar')
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
