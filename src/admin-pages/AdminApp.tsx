import React, { useState } from 'react'
import { Layout, Menu, Breadcrumb, Card, Row, Col } from 'antd'
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Route, Switch, useLocation, useHistory } from 'react-router-dom'
import Signin from './Signin'
import AddAdmin from './AddAdmin'
import Dashboard from './Dashboard'
import ManageDocument from './ManageDocument'
import ManageDocuments from './ManageDocuments'
import TagsAdmin from './TagsAdmin'
import './style.css'
import EditEntity from './EditEntity'
import AdminViewNewsPaper from './AdminViewNewsPaper'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

function AdminApp() {
  const location = useLocation()
  const history = useHistory()
  const [collapse, setCollapse] = useState(false)

  //   const [value, setValue] = useState([])

  React.useEffect(() => {
    console.log('Location changed')
    // When location changes we need to check if the token
    // is stil valid
  }, [location])

  return (
    <Layout dir="ltr">
      <Header className="header">
        <div>
          <h2 style={{ color: 'white', margin: '0 10px 0 -30px' }}>Webahead library</h2>
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">Tab 1</Menu.Item>
          <Menu.Item key="2">Tab 2</Menu.Item>
          <Menu.Item key="3">Tab 3</Menu.Item>
        </Menu>
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
            <Menu.Item key="3" onClick={() => history.push('/manage/document')} icon={<FileOutlined />}>
              Add newspaper
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              Files
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ margin: '0 16px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="site-layout-background admin-app" style={{ padding: 24, minHeight: 360 }}>
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
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminApp
