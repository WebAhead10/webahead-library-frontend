import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { DesktopOutlined, PieChartOutlined, FileOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { Route, Switch, useLocation, useHistory } from 'react-router-dom'
import Signin from './Signin'
import AddAdmin from './AddAdmin'
import Dashboard from './Dashboard'
import ManageDocument from './ManageDocument'
import ManageDocuments from './ManageDocuments'
import TagsAdmin from './TagsAdmin'
import ManageCategories from './ManageCategories'
import History from '../pages/History'
import './style.css'
import AdminViewNewsPaper from './AdminViewNewsPaper'
import ProtectedRoute from '../components/ProtectedRoute'
import { useRecoilValue } from 'recoil'
import { IUser } from 'types'
import { userAtom } from 'utils/recoil/atoms'

const { Header, Content, Sider } = Layout

function AdminApp() {
  const location = useLocation()
  const history = useHistory()
  const [collapse, setCollapse] = useState(false)
  const user = useRecoilValue<IUser>(userAtom)

  React.useEffect(() => {
    console.log('Location changed')
    // When location changes we need to check if the token
    // is stil valid
  }, [location])

  React.useEffect(() => {
    console.log('AdminApp', user)
  }, [user])

  if (!user.id) {
    return <Signin />
  }

  return (
    <Layout dir="ltr">
      <Header className="header">
        <div>
          <h2 style={{ color: 'white', margin: '0 10px 0 -30px' }}>Webahead library</h2>
        </div>
      </Header>
      <Layout className="site-layout" style={{ minHeight: '90vh' }}>
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
        <Sider collapsible collapsed={collapse} onCollapse={setCollapse}>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" onClick={() => history.push('/addadmin')} icon={<PieChartOutlined />}>
              Add Admin
            </Menu.Item>
            <Menu.Item key="2" onClick={() => history.push('/tags')} icon={<DesktopOutlined />}>
              Manage Tags
            </Menu.Item>
            <Menu.Item key="3" onClick={() => history.push('/documents')} icon={<FileOutlined />}>
              Manage Documents
            </Menu.Item>
            <Menu.Item key="4" onClick={() => history.push('/manage/categories')} icon={<FileOutlined />}>
              Categories
            </Menu.Item>

            <Menu.Item key="10" onClick={() => history.push('/history')} icon={<FolderOpenOutlined />}>
              History
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-background admin-app" style={{ padding: 24, minHeight: 360 }}>
            <Switch>
              <ProtectedRoute exact path="/" component={Dashboard} />
              <Route path="/signin" component={Signin} />
              <ProtectedRoute path="/addadmin" component={AddAdmin} />
              <ProtectedRoute path="/history" component={History} />
              <ProtectedRoute path="/manage/document" component={ManageDocument} />
              <ProtectedRoute path="/manage/documents" component={ManageDocument} />
              <ProtectedRoute path="/view/document/:id" component={AdminViewNewsPaper} />
              <ProtectedRoute path="/documents" component={ManageDocuments} />
              <ProtectedRoute path="/tags" component={TagsAdmin} />
              {/* A not found component needed here */}
              {/* <Route  component={NotFound} /> */}
            </Switch>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminApp
