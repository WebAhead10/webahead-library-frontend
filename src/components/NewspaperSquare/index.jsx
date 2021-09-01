import React from 'react'
import "./style.css"

function NewspaperSquare(props) {
    return (
        <div>
            <div className="news" >
                <div className="click">
                <img className="pic" src={props.imgUrl} alt="" style={props.style} />
            <b className="publisherName" >{props.name}</b>
                </div>
            </div>
        </div>
    )
}

export default NewspaperSquare
