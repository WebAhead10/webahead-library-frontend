import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { languageAtom, userAtom } from 'utils/recoil/atoms'
import { useQuery } from '@tanstack/react-query'
import axios from 'utils/axios'
import LanguageSelect from 'components/LanguageSelect'
import { FormattedMessage } from 'react-intl'
import { Space } from 'antd'

function HeaderInfo(props) {
  const { refetch } = useQuery(['logout'], () => axios.get('/user/logout'), { enabled: false })
  const [user, setUser] = useRecoilState(userAtom)

  const languageObj = useRecoilValue(languageAtom)
  console.log(languageObj)

  const signout = () => {
    refetch()

    setTimeout(() => {
      setUser({})
    }, 100)
  }

  return (
    <div className="headerInfo">
      <LanguageSelect bordered />

      <Space>
      </Space>
      <div className="headerInfo__nav">
      </div>

      <div className="headerInfo__buttons">
        {user.email ? (
          <button className="authButton" onClick={signout}>
            <FormattedMessage id="home_page-log-out"/>
          </button>
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
