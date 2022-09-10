import { useState, useEffect } from 'react'
import MainCategorySquare from '../../components/MainCategorySquare'
import axios from 'utils/axios'
import style from './style.module.css'
import { IMainCategory } from 'types'
import { useRecoilState } from 'recoil'
import { documentSearchAtom } from 'utils/recoil/atoms'
import { IDocumentSearch } from 'utils/recoil/types'
import { useHistory } from 'react-router-dom'
import { message } from 'antd'



function Newspaper() {
  const [categories, setCategories] = useState([])
  const [documentSearch, setDocumentSearch] = useRecoilState<IDocumentSearch>(documentSearchAtom)
  const history = useHistory()

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
    </div>
  )
}

export default Newspaper
