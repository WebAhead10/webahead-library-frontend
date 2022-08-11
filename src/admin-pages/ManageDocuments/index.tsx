import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import MainCategorySquare from '../../components/MainCategorySquare'
import axios from 'utils/axios'
import style from './style.module.css'

interface Category {
  name: string
  logo: string
  id: number
}

const ManageDocuments = () => {
  const history = useHistory()
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get(`/categories`)
      .then((res) => {
        if (!res.data.success) {
          setError('Failed')
          return
        }

        setCategories(res.data.categories)
      })
      .catch((error) => {
        setError(error.message)
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
