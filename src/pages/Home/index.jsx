import React from "react"
import { useContext } from "react"
import { UserContext } from "../../UserContext"
import SearchIcon from "@material-ui/icons/Search"
import HappyIcon from "@material-ui/icons/SentimentVerySatisfied"
import SettingsIcon from "@material-ui/icons/Settings"
import ShareIcon from "@material-ui/icons/Share"

import "./style.css"
function Home() {
  const context = useContext(UserContext)

  console.log(context)

  return (
    <div className="home_container">
      <div className="rightSide">
        <div className="home-row">
          <div className="item">
            <div className="circle">
              <SearchIcon style={{ transform: "scale(2.8)" }} />
            </div>
            <span>1</span>
          </div>
          <div className="item">
            <div className="circle">
              <HappyIcon style={{ transform: "scale(2.8)" }} />
            </div>
            <span>2</span>
          </div>
          <div className="item">
            <div className="circle">
              <ShareIcon style={{ transform: "scale(2.8)" }} />
            </div>
            <span>3</span>
          </div>
          <div className="item">
            <div className="circle">
              <SettingsIcon style={{ transform: "scale(2.8)" }} />
            </div>
            <span>4</span>
          </div>
        </div>
        <div className="home-row">
          <div className="item">
            <div className="circle"></div>
          </div>
          <div className="item">
            <div className="circle"></div>
          </div>
          <div className="item">
            <div className="circle"></div>
          </div>
          <div className="item">
            <div className="circle"></div>
          </div>
        </div>
      </div>
      <div className="leftSide">
        <form className="form">
          <label for="title">ساعدونا في تحسين مقالتنا</label>
          <div className="box">
            <textarea
              id="text"
              name="text"
              rows="4"
              cols="50"
              placeholder="العب يلا"
            ></textarea>
            <input className="submit" type="submit" value="Submit" />
            <div className="articleOfTheDayContainer">
              <span className="articleOfTheDay">جريدة اليوم</span>
              <img
                className="articleOfTheDayImage"
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
