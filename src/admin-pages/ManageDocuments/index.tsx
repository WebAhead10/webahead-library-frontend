import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PublisherSquare from '../../components/PublisherSquare'
import axios from 'axios'
import style from './style.module.css'
const API_URL = process.env.REACT_APP_API_URL

interface Publisher {
  name: string
  logo: string
  id: number
}

const ManageDocuments = () => {
  const history = useHistory()
  const [publisherArr, setPublisherArr] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get(`${API_URL}/publishers`)
      .then((res) => {
        if (!res.data.success) {
          setError('Failed')
          return
        }

        setPublisherArr(res.data.publisher)
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
      {/* <div className={style.newsContainer}>
        {publisherArr.map((publisher: Publisher, index) => (
          <PublisherSquare
            name={publisher.name}
            id={publisher.id}
            style={{
              objectFit: (index + 1) % 4 === 0 ? 'cover' : 'fill',
              background: (index + 1) % 5 === 0 ? 'white' : ''
            }}
            logo={publisher.logo}
            key={publisher.id}
          />
        ))}
      </div> */}
    </div>
  )
}

export default ManageDocuments
