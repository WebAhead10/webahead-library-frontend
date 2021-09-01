import React from "react";
import "./style.css";

function Home() {
  return (
    <div className="home_container">
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
            <input type="submit" value="Submit" />
            <span className="articleOfTheDay">جريدة اليوم</span>
          </div>
        </form>
      </div>
      <div className="rightSide">
        <span className="search_per_day">نتائج اليوم</span>
        <div className="firstRow">
          <div className="item">
            <div className="circle"></div>
            <span>1</span>
          </div>
          <div className="item">
            <div className="circle"></div>
            <span>2</span>
          </div>
          <div className="item">
            <div className="circle"></div>
            <span>3</span>
          </div>
          <div className="item">
            <div className="circle"></div>
            <span>4</span>
          </div>
        </div>
        <div className="secondRow">
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
    </div>
  );
}

export default Home;
