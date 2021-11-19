import React, { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HeaderInfo from './components/HeaderInfo/index'
import NavBar from './components/NavBar'
import AdminApp from './admin-pages/AdminApp'
import Publishers from './pages/Publishers'
import ChooseYearMonth from './pages/ChooseYearMonth'
import { UserContext } from './UserContext.ts'
import ViewNewsPaper from './pages/ViewNewsPaper'
import Calendar from './pages/Calendar'
import About from './pages/About'
import ContactUs from './pages/ContactUs'
import EditEntity from './pages/EditEntity'
import UserSignin from './user-pages/Signin'
import AddUser from './user-pages/AddUser'

function App() {
  const [value, setValue] = useState({})

  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    /** the whole App relaods when user logs in/out */
  }, [token])

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
      <UserContext.Provider value={{ value, setValue }}>
        <Router>
          <HeaderInfo token={token} setToken={setToken} />
          <NavBar />
          <Switch>
            <Route exact path="/" component={Publishers} />
            <Route path="/choose/year-month/:publisherId" component={ChooseYearMonth} />
            <Route path="/view/newspaper/:id" component={ViewNewsPaper} />
            <Route path="/edit/newspaper/:id" component={EditEntity} />
            <Route path="/newspaper" component={Publishers} />
            <Route path="/calendar/:publisherId/:year/:month" component={Calendar} />
            <Route path="/about" component={About} />
            <Route path="/contact-us" component={ContactUs} />
            <Route path="/user-signin">
              <UserSignin setToken={setToken} />
            </Route>
            <Route path="/user-add" component={AddUser} />
            {/* A not found component needed here */}
            {/* <Route  component={NotFound} /> */}
          </Switch>
        </Router>
      </UserContext.Provider>
    </div>
  )
}

export default App
