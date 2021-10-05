import React, { useState } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import Signin from './Signin'
import AddAdmin from './AddAdmin'
import Dashboard from './Dashboard'
import ManageDocument from './ManageDocument'
import ManageDocuments from './ManageDocuments'
import TagsAdmin from './TagsAdmin'
import './style.css'
import EditEntity from './EditEntity'
import AdminViewNewsPaper from './AdminViewNewsPaper'

function AdminApp() {
  const location = useLocation()

  //   const [value, setValue] = useState([])

  React.useEffect(() => {
    console.log('Location changed')
    // When location changes we need to check if the token
    // is stil valid
  }, [location])

  return (
    <div className="admin-app">
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/signin" component={Signin} />
        <Route path="/addadmin" component={AddAdmin} />
        <Route path="/manage/document" component={ManageDocument} />
        <Route path="/edit/document/:id" component={EditEntity} />
        <Route path="/view/document/:id" component={AdminViewNewsPaper} />
        <Route path="/documents" component={ManageDocuments} />
        <Route path="/tags" component={TagsAdmin} />
        {/* A not found component needed here */}
        {/* <Route  component={NotFound} /> */}
      </Switch>
    </div>
  )
}

export default AdminApp
