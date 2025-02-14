import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userAtom } from 'utils/recoil/atoms'
import { useQuery } from '@tanstack/react-query'
import axios from 'utils/axios'
import LanguageSelect from 'components/LanguageSelect'
import { FormattedMessage } from 'react-intl'
import { Space, Dropdown, Avatar } from 'antd'

function HeaderInfo(props) {
  const { refetch } = useQuery(['logout'], () => axios.get('/user/logout'), { enabled: false })
  const [user, setUser] = useRecoilState(userAtom)

  const signout = () => {
    refetch()
    setTimeout(() => {
      setUser({})
    }, 100)
  }

  const menuItems = [
    // {
    //   key: '1',
    //   label: <Link to="/user-profile"><FormattedMessage id="user_profile-personal_info" /></Link>,
    // },
    // {
    //   key: '2',
    //   label: <Link to="/user-data"><FormattedMessage id="user_profile-my_data" /></Link>,
    // },
    {
      key: '3',
      label: <span onClick={signout}><FormattedMessage id="home_page-log-out" /></span>,
    }
  ]

  return (
    <div className="headerInfo">
      <LanguageSelect bordered />
      <Space />
      <div className="headerInfo__nav" />
      <div className="headerInfo__buttons">
        {user.email ? (
          <div className="userProfile" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'end' }}>
            <span className="welcomeText" style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
              <FormattedMessage id="header_component-welcome" /> {user.name}
            </span>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Avatar style={{ cursor: 'pointer' }} src={user.photoURL || '/images/default-avatar.png'} />
            </Dropdown>
          </div>
        ) : (
          <div>
            <Link to="/user-signin">
              <button className="authButton"><FormattedMessage id="home_page-login"/></button>
            </Link>
            <Link to="/user-add">
              <button className="authButton"><FormattedMessage id="home_page-register"/></button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderInfo
