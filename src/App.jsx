import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import EditEntity from "./pages/EditEntity"
import UploadPDF from "./pages/UploadPDF"
import Signin from "./pages/Signin"
import AddAdmin from "./pages/AddAdmin"


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={UploadPDF} />
          <Route path="/newspaper/edit/:id" component={EditEntity} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/addadmin" component={AddAdmin} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
