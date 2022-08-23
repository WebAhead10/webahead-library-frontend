import style from './style.module.css'
import { CSSProperties } from 'react'

interface MainCategorySquareProps {
  name: string
  logo: string
  style?: CSSProperties
  onClick?: () => void
}

const defaultProps = {
  name: '',
  logo: ''
}

function MainCategorySquare(props: MainCategorySquareProps = defaultProps) {
  return (
    <div className={style['newspaper-square']}>
      <div
        className={style['news']}
        onClick={() => {
          if (props.onClick) {
            props.onClick()
          }
        }}
      >
        <img className={style['pic']} src={props.logo} alt="" style={props.style} />
        <b className={style['categoryName']}>{props.name}</b>
      </div>
    </div>
  )
}

export default MainCategorySquare
