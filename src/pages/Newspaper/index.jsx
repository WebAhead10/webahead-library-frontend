import React, { useState, useEffect } from 'react';
import NewspaperSquare from '../../components/NewspaperSquare/index';
import axios from 'axios';
import "./style.css"
const PORT = process.env.REACT_APP_API_URL;

function Newspaper() {

    const [publisherArr, setPublisherArr] = useState([])
    const [error, setError] = useState("")

    useEffect(() => { 
        axios.get(`${PORT}/publishers`)
        .then((res) => {
            setPublisherArr(res.data.publisher)
            console.log(res.data.publisher)
        })
        .catch((error) => {
            setError(error.message);
        })
    }, [])

    return (
            <div className="news-container">
                {publisherArr.map((publisher, index) => <NewspaperSquare name={publisher.name}
                    style={{ objectFit: (index + 1) % 4 === 0 ? 'cover' : '',
                    background: (index + 1) % 5 === 0 ? 'white' : '',
                }}
                    logo={publisher.logo}
                    key={publisher.id}
                />)}
                

                <span>{error}</span>

            </div>


    )


}



export default Newspaper
