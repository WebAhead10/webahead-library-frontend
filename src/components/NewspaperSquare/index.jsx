import React from 'react'
import "./style.css"

function NewspaperSquare(props) {
    return (
        <div>
            <div className="news" >
                <img className="pic" src={props.imgUrl} alt="" style={props.style} />
            <b>{props.name}</b>
            </div>
        </div>
    )
}

export default NewspaperSquare
