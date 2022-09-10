import { message } from 'antd'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
// import MainCategorySquare from '../../components/MainCategorySquare'
import axios from 'utils/axios'
import style from './style.module.css'


const ManageDocuments = () => {
  const history = useHistory()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios
      .get(`/categories`)
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed')
          return
        }

        setCategories(res.data.categories)
      })
      .catch((error) => {
        message.error(error.message)
      })
  }, [])

  return (
    <div>
      <div style={{ padding: '30px 0px' }}>
        <button className="button" onClick={() => history.push('/manage/document')}>
          Add
        </button>
      </div>
    </div>
  )
}

export default ManageDocuments
