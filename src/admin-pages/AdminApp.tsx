import React, { useState, Suspense } from 'react'
import { Layout, Menu } from 'antd'
import { DesktopOutlined, FileOutlined, FolderOpenOutlined, TeamOutlined } from '@ant-design/icons'
import { Route, Switch, useLocation, useHistory } from 'react-router-dom'
import './style.css'
import ProtectedRoute from '../components/ProtectedRoute'
import { useRecoilValue } from 'recoil'
import { IUser } from 'types'
import { userAtom } from 'utils/recoil/atoms'

const { Header, Content, Sider } = Layout

const Signin = React.lazy(() => import('./Signin'))
const Dashboard = React.lazy(() => import('./Dashboard'))
const ManageDocument = React.lazy(() => import('./ManageDocument'))
const ManageDocuments = React.lazy(() => import('./ManageDocuments'))
const TagsAdmin = React.lazy(() => import('./TagsAdmin'))
const ManageCategories = React.lazy(() => import('./ManageCategories'))
const History = React.lazy(() => import('./History'))
const AdminViewNewsPaper = React.lazy(() => import('./AdminViewNewsPaper'))
const Users = React.lazy(() => import('./Users'))

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
          <h2 style={{ color: 'white', margin: '0 10px 0 -30px' }}>Nabesh Project</h2>
        </div>
      </Header>
      <Layout className="site-layout" style={{ minHeight: '90vh' }}>
        <Sider collapsible collapsed={collapse} onCollapse={setCollapse}>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="2" onClick={() => history.push('/tags')} icon={<DesktopOutlined />}>
              Tags
            </Menu.Item>
            <Menu.Item key="3" onClick={() => history.push('/users')} icon={<TeamOutlined />}>
              Users
            </Menu.Item>
            <Menu.Item key="4" onClick={() => history.push('/documents')} icon={<FileOutlined />}>
              Documents
            </Menu.Item>
            <Menu.Item key="5" onClick={() => history.push('/manage/categories')} icon={<FileOutlined />}>
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
              <ProtectedRoute path="/users" component={Users} />
              <Route path="/signin" component={Signin} />
              <ProtectedRoute path="/history" component={History} />
              <ProtectedRoute path="/manage/document" component={ManageDocument} />
              <ProtectedRoute path="/manage/documents" component={ManageDocument} />
              <ProtectedRoute path="/view/document/:id" component={AdminViewNewsPaper} />
              <ProtectedRoute path="/documents" component={ManageDocuments} />
              <ProtectedRoute path="/tags" component={TagsAdmin} />
              <ProtectedRoute path="/manage/categories" component={ManageCategories} />
              <ProtectedRoute path="/users" component={Users} />

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
