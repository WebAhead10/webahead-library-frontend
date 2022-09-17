import React from 'react'
import { Nav, NavLink, NavMenu } from './NavbarElements'
import SearchIcon from '@material-ui/icons/Search'
function NavBar() {
  return (
    <div>
      <Nav>
        <NavMenu>
          <NavLink to="/">الصفحة الرئيسية</NavLink>
          <NavLink to="/about">من نحن</NavLink>
          <NavLink to="/contact-us">تواصل معنا</NavLink>
        </NavMenu>
        {/* <div className="header__search">
          <SearchIcon className="header__searchIcon" />
          <input type="text" className="header__searchInput" />
        </div> */}
        <NavLink to="/">
          <img
            src="https://i.imagesup.co/images2/e4a3432b6e4a13fcfd7ece0be9b28495e46a3b8a.png"
            width="200px"
            alt="logo"
          />
        </NavLink>
      </Nav>
    </div>
  )
}

export default NavBar
