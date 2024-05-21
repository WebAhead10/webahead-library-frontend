import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { useRecoilState } from 'recoil'
import { userAtom } from 'utils/recoil/atoms'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'utils/axios'
import { useHistory } from 'react-router-dom'

function HeaderInfo(props) {
  const { refetch } = useQuery(['logout'], () => axios.get('/user/logout'), { enabled: false })
  // const queryClient = useQueryClient()
  // const history = useHistory()
  const [user, setUser] = useRecoilState(userAtom)

  const signout = () => {
    refetch()

    setTimeout(() => {
      // queryClient.invalidateQueries('user')
      setUser({})
    }, 100)
  }

  return (
    <div className="headerInfo">
      <div className="headerInfo__nav">
        {/* <UserOutlined
          style={{
            fontSize: '30px',
            border: '2px solid #000',
            borderRadius: '50%',
            padding: '5px'
          }}
        /> */}
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
