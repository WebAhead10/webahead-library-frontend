import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import "./style.css";
function Index() {
  return (
    <div className="header">
      <div className="header__search">
        <input type="text" className="header__searchInput" />
        <SearchIcon className="header__searchIcon" />
      </div>
      <div className="header__nav">
        <div className="header__option">
          <span className="header__optionLineOne">
          أصابك عشق أم رميت بأسهم
          </span>
        </div>
      </div>
    </div>
  );
}

export default Index;
