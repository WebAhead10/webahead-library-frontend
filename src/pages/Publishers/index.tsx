import { useState, useEffect } from 'react'
import PublisherSquare from '../../components/PublisherSquare'
import axios from 'axios'
import style from './style.module.css'
const API_URL = process.env.REACT_APP_API_URL

interface Publisher {
  name: string
  logo: string
  id: number
}
function Newspaper() {
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
    <div className={style['news-container']}>
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

      <span>{error}</span>
    </div>
  )
}

export default Newspaper
