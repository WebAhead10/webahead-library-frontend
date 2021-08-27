import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import EditEntity from "./pages/EditEntity"
import UploadPDF from "./pages/UploadPDF"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={UploadPDF} />
          <Route path="/newspaper/edit/:id" component={EditEntity} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
