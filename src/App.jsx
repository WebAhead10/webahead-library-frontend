import React, { useState } from "react";
import { UserContext } from "./UserContext";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EditEntity from "./pages/EditEntity";
import UploadPDF from "./pages/UploadPDF";
import Home from "./pages/Home";
import HeaderSearch from "./components/HeaderSearch";
import HeaderInfo from "./components/HeaderInfo";
import NavBar from "./components/navBar";
import ArticleData from "./pages/ArticleData";
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
            <Route exact path="/uploadPdf" component={UploadPDF} />
            <Route path="/newspaper/edit/:id" component={EditEntity} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/addadmin" component={AddAdmin} />
          </Switch>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
