import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EditEntity from "./pages/EditEntity";
import UploadPDF from "./pages/UploadPDF";
import Home from "./pages/Home";
import HeaderSearch from "./components/HeaderSearch";
import HeaderInfo from "./components/HeaderInfo";
import NavBar from "./components/navBar";
import Newspaper from "./pages/Newspaper/index";

function App() {
  return (
    <div className="App">
      <Router>
        <HeaderInfo />
        <HeaderSearch />
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/uploadPdf" component={UploadPDF} />
          <Route path="/newspaper/edit/:id" component={EditEntity} />
          <Route exact path="/newspaper/" >
            <Newspaper />
            </ Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
