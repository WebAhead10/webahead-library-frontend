import style from './style.module.css'
import { Layout, Menu, Breadcrumb, Card, Row, Col } from 'antd'

const Dashboard = () => {
  return (
    <div className={style.dashboardContainer}>
      <Row gutter={[20, 20]}>
        <Col className={style.column}>
          <Card className={style.topCard}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
        <Col className={style.column}>
          <Card style={{ width: '90%' }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
        <Col className={style.column}>
          <Card className={style.topCard}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
        <Col className={style.column}>
          <Card style={{ width: '90%' }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
