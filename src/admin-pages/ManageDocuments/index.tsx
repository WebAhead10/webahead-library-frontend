import { message, Table, Card, Button } from 'antd'
import { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
// import MainCategorySquare from '../../components/MainCategorySquare'
import axios from 'utils/axios'
import style from './style.module.css'

const ManageDocuments = () => {
  const history = useHistory()
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    axios
      .get(`/all/documents`)
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed')
          return
        }

        setDocuments(res.data.data)
      })
      .catch((error) => {
        message.error(error.message)
      })
  }, [])

  return (
    <div>
      <Button type="primary" size="large">
        <Link to="/manage/document">Add</Link>
      </Button>

      <br />
      <br />
      <Table
        dataSource={documents}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'name'
          },
          {
            title: 'Document name',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'category'
          },
          {
            title: 'published Date',
            dataIndex: 'publishedDate',
            key: 'publishedDate'
          }
        ]}
      />
    </div>
  )
}

export default ManageDocuments
