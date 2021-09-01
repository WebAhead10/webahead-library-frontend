import React from "react";
import { Nav, NavLink, Bars, NavMenu } from "./NavbarElements";
function NavBar() {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/newspaper" activeStyle>
            الصحف المتاحة
          </NavLink>
          <NavLink to="/about" activeStyle>
            من نحن
          </NavLink>
          <NavLink to="/contact-us" activeStyle>
            تواصل معنا
          </NavLink>
        </NavMenu>
        <Bars />
        <NavLink to="/">
          <img
            src="https://i.imagesup.co/images2/e4a3432b6e4a13fcfd7ece0be9b28495e46a3b8a.png"
            width="200px"
            alt="logo"
          />
        </NavLink>
      </Nav>
    </>
  );
}

export default NavBar;
