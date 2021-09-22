import { useHistory } from "react-router-dom"
import style from "./style.module.css"

const Dashboard = () => {
  const history = useHistory()

  return (
    <div className={style.dashboardContainer}>
      <h1>Webahead library management</h1>
      <br />
      <button className="button" onClick={() => history.push("/addadmin")}>
        Add admin
      </button>
      <button className="button" onClick={() => history.push("/tags")}>
        Manage tags
      </button>
      <button className="button" onClick={() => history.push("/documents")}>
        Manage documents/newspaper
      </button>
      <br />
      <br />
    </div>
  )
}

export default Dashboard
