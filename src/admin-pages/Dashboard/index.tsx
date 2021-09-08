import { useHistory } from "react-router-dom"

const Dashboard = () => {
  const history = useHistory()

  return (
    <div>
      <button className="button" onClick={() => history.push("/addadmin")}>
        Add admin
      </button>
      <button className="button" onClick={() => history.push("/tags")}>
        Manage tags
      </button>
      <button className="button" onClick={() => history.push("/documents")}>
        Manage documents/newspaper
      </button>
    </div>
  )
}

export default Dashboard
