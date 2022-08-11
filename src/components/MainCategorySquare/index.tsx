import style from './style.module.css'
import { CSSProperties } from 'react'
import { useRecoilState } from 'recoil'
import { documentSearchAtom } from 'utils/recoil/atoms'
import { Link } from 'react-router-dom'
import { IDocumentSearch } from 'utils/recoil/types'

interface MainCategorySquareProps {
  name: string
  logo: string
  id: number
  style: CSSProperties
}

function MainCategorySquare(props: MainCategorySquareProps) {
  const [documentSearch, setDocumentSearch] = useRecoilState<IDocumentSearch>(documentSearchAtom)

  return (
    <div className={style['newspaper-square']}>
      <div className={style['news']}>
        <Link
          className={style['click']}
          to={`/choose/year-month/${props.id}`}
          onClick={() => setDocumentSearch({ ...documentSearch, categoryId: props.id })}
        >
          <img className={style['pic']} src={props.logo} alt="" style={props.style} />
          <b className={style['categoryName']}>{props.name}</b>
        </Link>
      </div>
    </div>
  )
}

export default MainCategorySquare
