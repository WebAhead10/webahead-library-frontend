import React from 'react'
import { Nav, NavLink, NavMenu } from './NavbarElements'
import { FormattedMessage } from 'react-intl'

function NavBar() {
  return (
    <div>
      <Nav>
        <NavMenu>
          <img
            src="https://user-images.githubusercontent.com/24195641/236838136-a7d0dd66-3077-4e1e-b39c-dc2af1bebae9.jpeg"
            alt="logo"
            style={{
              height: '60px',
              objectFit: 'contain'
            }}
          />
          <NavLink to="/"><FormattedMessage id="home_page-home"></FormattedMessage></NavLink>
          <NavLink to="/about"><FormattedMessage id="home_page-about" /></NavLink>
          <NavLink to="/contact-us"><FormattedMessage id="home_page-contact-us" /></NavLink>
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
