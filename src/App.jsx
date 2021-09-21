import React, { useState } from "react"
import EditEntity from "./pages/EditEntity"
import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./pages/Home"
import HeaderSearch from "./components/HeaderSearch"
import TileContent from "./components/TileContent"
import HeaderInfo from "./components/HeaderInfo/index"
import NavBar from "./components/NavBar"
import AdminApp from "./admin-pages/AdminApp"
import Newspaper from "./pages/Newspaper"
import ChooseYearMonth from "./pages/ChooseYearMonth"
import { UserContext } from "./UserContext"
import ViewNewsPaper from "./pages/ViewNewsPaper"
import Calendar from "./pages/Calendar"

function App() {
  const [value, setValue] = useState({})

  if (window.location.pathname.indexOf("/a/admin") === 0) {
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
          <HeaderInfo />
          {/* <HeaderSearch /> */}
          <NavBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              path="/choose/year-month/:name"
              component={ChooseYearMonth}
            />
            <Route path="/edit/newspaper/:id" component={EditEntity} />
            <Route path="/view/newspaper/:id" component={ViewNewsPaper} />
            <Route path="/newspaper" component={Newspaper} />
            <Route path="/calendar" component={Calendar} />
            {/* <Route path="/aa" component={TileContent} /> */}
            {/* A not found component needed here */}
            {/* <Route  component={NotFound} /> */}
          </Switch>
        </Router>
      </UserContext.Provider>
    </div>
  )
}

export default App
