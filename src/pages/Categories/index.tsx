import { useState, useEffect } from 'react'
import MainCategorySquare from '../../components/MainCategorySquare'
import axios from 'utils/axios'
import style from './style.module.css'
import { IMainCategory } from 'types'
import { useRecoilState } from 'recoil'
import { documentSearchAtom } from 'utils/recoil/atoms'
import { IDocumentSearch } from 'utils/recoil/types'
import { useHistory } from 'react-router-dom'

interface Category {
  name: string
  logo: string
  id: number
}
function Newspaper() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [documentSearch, setDocumentSearch] = useRecoilState<IDocumentSearch>(documentSearchAtom)
  const history = useHistory()

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
    <div className={style['news-container']}>
      {categories.map((category: IMainCategory, index) => (
        <MainCategorySquare
          name={category.name}
          style={{
            objectFit: (index + 1) % 4 === 0 ? 'cover' : 'fill',
            background: (index + 1) % 5 === 0 ? 'white' : ''
          }}
          logo={category.logo}
          key={category.id}
          onClick={() => {
            if (category.viewType === 'calendar') {
              history.push(`/choose/year-month/${category.id}`)
            } else if (category.viewType === 'list') {
              history.push(`/list/${category.id}`)
            }

            setDocumentSearch({ ...documentSearch, categoryId: category.id })
          }}
        />
      ))}

      <span>{error}</span>
    </div>
  )
}

export default Newspaper
