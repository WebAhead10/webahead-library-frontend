import React, { useState } from "react";
import EditEntity from "./pages/EditEntity";
import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import UploadPDF from "./pages/UploadPDF"
import Signin from "./pages/Signin"
import AddAdmin from "./pages/AddAdmin"
import Home from "./pages/Home";
import NewspaperCalendar from "./pages/NewspaperCalendar";
import HeaderSearch from "./components/HeaderSearch";
import HeaderInfo from "./components/HeaderInfo/Index";
import NavBar from "./components/navBar";
import Newspaper from "./pages/Newspaper";
import ArticleData from "./pages/ArticleData";
import { UserContext } from "./UserContext";


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
          <Route path="/newspaper/:name" component={ArticleData} />
          <Route exact path="/uploadPdf" component={UploadPDF} />
          <Route path="/newspaper/edit/:id" component={EditEntity} />
          <Route exact path="/newspaper" >
            <Newspaper />
            </ Route>
            <Route exact path="/calander" component={NewspaperCalendar} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/addadmin" component={AddAdmin} />
        </Switch>
      </Router>
       
      </UserContext.Provider>
    </div>




  );
}

export default App;
