import { useContext } from 'react'
import { UserContext } from '../../UserContext'
import SearchIcon from '@material-ui/icons/Search'
import HappyIcon from '@material-ui/icons/SentimentVerySatisfied'
import SettingsIcon from '@material-ui/icons/Settings'
import ShareIcon from '@material-ui/icons/Share'

import style from './style.module.css'

function Home() {
  const context = useContext(UserContext)

  console.log(context)

  return (
    <div className={style['home_container']}>
      <div className={style['rightSide']}>
        <div className={style['home-row']}>
          <div className={style['item']}>
            <div className={style['circle']}>
              <SearchIcon style={{ transform: 'scale(2.8)' }} />
            </div>
            <span>1</span>
          </div>
          <div className={style['item']}>
            <div className={style['circle']}>
              <HappyIcon style={{ transform: 'scale(2.8)' }} />
            </div>
            <span>2</span>
          </div>
          <div className={style['item']}>
            <div className={style['circle']}>
              <ShareIcon style={{ transform: 'scale(2.8)' }} />
            </div>
            <span>3</span>
          </div>
          <div className={style['item']}>
            <div className={style['circle']}>
              <SettingsIcon style={{ transform: 'scale(2.8)' }} />
            </div>
            <span>4</span>
          </div>
        </div>
        <div className={style['home-row']}>
          <div className={style['item']}>
            <div className={style['circle']}></div>
          </div>
          <div className={style['item']}>
            <div className={style['circle']}></div>
          </div>
          <div className={style['item']}>
            <div className={style['circle']}></div>
          </div>
          <div className={style['item']}>
            <div className={style['circle']}></div>
          </div>
        </div>
      </div>
      <div className={style['leftSide']}>
        <form className={style['form']}>
          <label htmlFor="title">ساعدونا في تحسين مقالتنا</label>
          <div className={style['box']}>
            <textarea id="text" name="text" rows={4} cols={50} placeholder=""></textarea>
            <input className={style['submit']} type="submit" value="Submit" />
            <div className={style['articleOfTheDayContainer']}>
              <span className={style['articleOfTheDay']}>جريدة اليوم</span>
              <img
                className={style['articleOfTheDayImage']}
                src="https://www.maan-ctr.org/magazine/files/image/photos/issue117/topics/5/4.jpg"
                alt=""
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home
