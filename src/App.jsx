import React, { useState } from "react";
import NewspaperCalendar from "./pages/NewspaperCalendar";
import { UserContext } from "./UserContext";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EditEntity from "./pages/EditEntity";
import UploadPDF from "./pages/UploadPDF";
import Home from "./pages/Home";
import HeaderSearch from "./components/HeaderSearch";
import HeaderInfo from "./components/HeaderInfo";
import NavBar from "./components/navBar";
import ArticleData from "./components/ArticleData/ArticleData";
import Signin from "./pages/Signin";
import AddAdmin from "./pages/AddAdmin";

function App() {
  const [value, setValue] = useState([]);
  return (
    <div className="App">
      <UserContext.Provider value={{ value, setValue }}>
        <Router>
          <HeaderInfo />
          <HeaderSearch />
          <NavBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/hassan" component={ArticleData} />
            <Route exact path="/uploadPdf" component={UploadPDF} />
            <Route path="/newspaper/edit/:id" component={EditEntity} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/addadmin" component={AddAdmin} />
            <Route exact path="/calander" component={NewspaperCalendar} />
          </Switch>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
