import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { useRecoilValue } from 'recoil'
import { userAtom } from 'utils/recoil/atoms'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'utils/axios'


function HeaderInfo(props) {
  const { refetch } = useQuery(['logout'], () => axios.get('/user/logout'), { enabled: false })
  const queryClient = useQueryClient()

  const signout = () => {
    refetch()
    queryClient.invalidateQueries('user')
  }

  const user = useRecoilValue(userAtom)


  return (
    <div className="headerInfo">
      <div className="headerInfo__nav">
        <AccountCircleIcon style={{ fontSize: '50px' }} />
      </div>

      <div className="headerInfo__buttons">
        {user.email ? (
          <button className="authButton" onClick={signout}>
            تسجيل خروج
          </button>
        ) : (
          <div>
            <Link to="/user-signin">
              <button className="authButton">تسجيل دخول</button>
            </Link>
            <Link to="/user-add">
              <button className="authButton">انشاء حساب</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderInfo
