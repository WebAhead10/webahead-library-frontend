import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useRecoilValue, RecoilValue } from 'recoil'
import { IUser } from 'types'
import { userAtom } from 'utils/recoil/atoms'

interface IProtectedRouteProps {
  component: React.ComponentType<any>
  path: string
  admin?: boolean
  exact?: boolean
  strict?: boolean
}

function ProtectedRoute({ component: Component, admin = true, ...restOfProps }: IProtectedRouteProps) {
  const user = useRecoilValue<IUser>(userAtom)
  const isAuthenticated = !!user.id

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to={admin ? '/signin' : '/user-signin'} />
      }
    />
  )
}

export default ProtectedRoute
