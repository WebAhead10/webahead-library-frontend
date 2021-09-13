import React from "react"
import "./style.css"

function NewspaperSquare(props) {
  return (
    <div className="newspaper-square">
      <div className="news">
        <a className="click" href={`/choose/year-month/${props.name}`}>
          <img className="pic" src={props.logo} alt="" style={props.style} />
          <b className="publisherName">{props.name}</b>
        </a>
      </div>
    </div>
  )
}

export default NewspaperSquare
