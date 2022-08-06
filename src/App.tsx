import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HeaderInfo from './components/HeaderInfo/index'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminApp from './admin-pages/AdminApp'
import Publishers from './pages/Publishers'
import ChooseYearMonth from './pages/ChooseYearMonth'
import ViewNewsPaper from './pages/ViewNewsPaper'
import Calendar from './pages/Calendar'
import About from './pages/About'
import ContactUs from './pages/ContactUs'
import EditEntity from './pages/EditEntity'
import UserSignin from './user-pages/Signin'
import AddUser from './user-pages/AddUser'
import { useQuery } from '@tanstack/react-query'
import axios from './utils/axios'

import { useSetRecoilState } from 'recoil'
import { userAtom } from 'utils/recoil/atoms'

function App() {
  const setUser = useSetRecoilState(userAtom)

  const { data } = useQuery(
    ['user'],
    async () => {
      const res = await axios.get('/user')
      return res.data
    },
    {
      onSuccess: (data) => {
        if (data?.success) {
          setUser(data.user)
        } else {
          setUser({})
        }
      }
    }
  )

  if (window.location.pathname.indexOf('/a/admin') === 0) {
    return (
      <div className="App">
        <Router basename="/a/admin">
          <AdminApp />
        </Router>
      </div>
    )
  }

  return (
    <div className="App">
      <Router>
        <HeaderInfo />
        <NavBar />
        <Switch>
          <Route exact path="/" component={Publishers} />
          <Route path="/choose/year-month/:publisherId" component={ChooseYearMonth} />
          <Route path="/view/newspaper/:id" component={ViewNewsPaper} />
          <ProtectedRoute path="/edit/newspaper/:id" component={EditEntity} />
          <Route path="/newspaper" component={Publishers} />
          <Route path="/calendar/:publisherId/:year/:month" component={Calendar} />
          <Route path="/about" component={About} />
          <Route path="/contact-us" component={ContactUs} />
          <Route path="/user-signin">
            <UserSignin />
          </Route>
          <Route path="/user-add" component={AddUser} />
          {/* A not found component needed here */}
          {/* <Route  component={NotFound} /> */}
        </Switch>
      </Router>
    </div>
  )
}

export default App
