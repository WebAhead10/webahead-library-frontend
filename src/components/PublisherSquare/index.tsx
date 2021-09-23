import style from "./style.module.css"
import { CSSProperties } from "react"

interface PublisherSquareProps {
  name: string
  logo: string
  style: CSSProperties
}

function PublisherSquare(props: PublisherSquareProps) {
  return (
    <div className={style["newspaper-square"]}>
      <div className={style["news"]}>
        <a className={style["click"]} href={`/choose/year-month/${props.name}`}>
          <img
            className={style["pic"]}
            src={props.logo}
            alt=""
            style={props.style}
          />
          <b className={style["publisherName"]}>{props.name}</b>
        </a>
      </div>
    </div>
  )
}

export default PublisherSquare
