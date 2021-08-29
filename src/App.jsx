import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EditEntity from "./pages/EditEntity";
import UploadPDF from "./pages/UploadPDF";
import HeaderSearch from "./components/HeaderSearch/Index";
import HeaderInfo from "./components/HeaderInfo/Index";
function App() {
  return (
    <div className="App">
      <Router>
        <HeaderInfo />
        <HeaderSearch />
        <Switch>
          <Route exact path="/" component={UploadPDF} />
          <Route path="/newspaper/edit/:id" component={EditEntity} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
