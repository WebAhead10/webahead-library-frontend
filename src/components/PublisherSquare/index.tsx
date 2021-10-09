import { useContext } from 'react'
import style from './style.module.css'
import { CSSProperties } from 'react'
import { UserContext } from '../../UserContext'
import { Link } from 'react-router-dom'

interface PublisherSquareProps {
  name: string
  logo: string
  id: number
  style: CSSProperties
}

function PublisherSquare(props: PublisherSquareProps) {
  const { setValue, value } = useContext(UserContext)

  return (
    <div className={style['newspaper-square']}>
      <div className={style['news']}>
        <Link
          className={style['click']}
          to={`/choose/year-month/${props.id}`}
          onClick={() => setValue({ ...value, publisherId: props.id })}
        >
          <img className={style['pic']} src={props.logo} alt="" style={props.style} />
          <b className={style['publisherName']}>{props.name}</b>
        </Link>
      </div>
    </div>
  )
}

export default PublisherSquare
