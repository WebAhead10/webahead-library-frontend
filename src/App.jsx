import React, { useState } from "react"
import EditEntity from "./pages/EditEntity"
import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import UploadPDF from "./pages/UploadPDF"
import Home from "./pages/Home"
import HeaderSearch from "./components/HeaderSearch"
import HeaderInfo from "./components/HeaderInfo/index"
import NavBar from "./components/NavBar"
import Signin from "./pages/Signin"
import AddAdmin from "./pages/AddAdmin"
import Newspaper from "./pages/Newspaper"
import ChooseYearMonth from "./pages/ChooseYearMonth"
import { UserContext } from "./UserContext"
import Calendar_ from "./pages/Calendar"
function App() {
  const [value, setValue] = useState([])

  return (
    <div className="App">
      <UserContext.Provider value={{ value, setValue }}>
        <Router>
          <HeaderInfo />
          <HeaderSearch />
          <NavBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/choose/year-month" component={ChooseYearMonth} />
            <Route path="/uploadPdf" component={UploadPDF} />
            <Route path="/newspaper/edit/:id" component={EditEntity} />
            <Route path="/newspaper" component={Newspaper} />
            <Route path="/signin" component={Signin} />
            <Route path="/addadmin" component={AddAdmin} />
            <Route path="/calender" component={Calendar_} />
          </Switch>
        </Router>
      </UserContext.Provider>
    </div>
  )
}

export default App
