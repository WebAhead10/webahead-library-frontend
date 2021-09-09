import React from 'react'
import "./style.css"

function NewspaperSquare(props) {
    return (
        <div>
            <div className="news" >
                <a className="click" href={`/newspaper/${props.name}`}>
                <img className="pic" src={props.logo} alt="" style={props.style} />
            <b className="publisherName" >{props.name}</b>
                </a>
            </div>
        </div>
    )
}

export default NewspaperSquare
