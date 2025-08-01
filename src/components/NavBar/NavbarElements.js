import { NavLink as Link } from 'react-router-dom'
import styled from 'styled-components'

export const Nav = styled.nav`
  background: #000;
  height: 60px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0vw 0.5rem 0vw;
  z-index: 10;
`

export const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 16px;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #15cdfc;
  }
  &:hover {
    transition: all 0.2s ease-in-out;
    color: #cd9042;
  }
`

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
`

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;
`

export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: #256ce1;
  padding: 10px 22px;
  color: #fff;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: 24px;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`
