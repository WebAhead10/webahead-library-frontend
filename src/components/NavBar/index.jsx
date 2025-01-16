import React from 'react'
import { Nav, NavLink, NavMenu } from './NavbarElements'
import { FormattedMessage } from 'react-intl'

function NavBar() {
  return (
    <div>
      <Nav>
        <NavMenu>
          <img
            src="/images/nabesh_with_english_below_adjusted.jpeg"
            alt="logo"
            style={{
              height: '60px',
              objectFit: 'contain'
            }}
          />
          <NavLink to="/" 
            isActive={(match, location) => match && location.pathname === "/"} 
            style={({ isActive }) => ({ backgroundColor: isActive ? "blue" : "transparent" })}><FormattedMessage id="home_page-home"/></NavLink>
          <NavLink to="/about" 
            style={({ isActive }) => ({ backgroundColor: isActive ? "blue" : "transparent" })}
            ><FormattedMessage id="home_page-about" /></NavLink>
          <NavLink to="/contact-us" 
            style={({ isActive }) => ({ backgroundColor: isActive ? "blue" : "transparent" })}><FormattedMessage id="home_page-contact-us" /></NavLink>
        </NavMenu>

        {/* <div className="header__search">
          <SearchIcon className="header__searchIcon" />
          <input type="text" className="header__searchInput" />
        </div> */}
      </Nav>
    </div>
  )
}

export default NavBar
