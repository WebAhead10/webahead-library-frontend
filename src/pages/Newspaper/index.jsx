import React, { useState, useEffect } from 'react';
import NewspaperSquare from '../../components/NewspaperSquare/index';
import axios from 'axios';
import "./style.css"

function Newspaper() {

    const arr = [
        {
            id: 1,
            name: "הארץ",
            imgUrl: "https://cameraoncampus.org/wp-content/uploads/2017/06/Haaretz.jpg",
        },
        {
            id: 2,
            name: "حيفا نت",
            imgUrl: "https://haifanet.co.il/wp-content/themes/haifanet/inc/images/logo.png",
        },
        {
            id: 3,
            name: "فلسطين",
            imgUrl: "https://www.maan-ctr.org/magazine/files/image/photos/issue117/topics/5/4.jpg",
        },
        {
            id: 4,
            name: "الفجر",
            imgUrl: "https://aqlam-moqawema.org/wp-content/uploads/2021/06/%D8%B5%D8%AD%D8%A7%D9%81%D8%A9.gif",
        },
        {
            id: 5,
            name: "الجزيرة",
            imgUrl: "http://www.wasmenia.com/wp-content/uploads/2017/11/Al-Jazirah-01.svg",
        },

    ]

    const [publisherArr, setPublisherArr] = useState(arr)
    // const [error, setError] = useState("")

    // useEffect(() => { 
    //     axios.get(`${process.env.REACT_APP_API_URL}/publishers`)
    //     .then((res) => {
    //         console.log(res.data)
    //     })
    //     .catch((error) => {
    //         setError(error.message);
    //     })
    // }, [])

    return (
            <div className="news-container">
                {publisherArr.map((publisher, index) => <NewspaperSquare name={publisher.name}
                    style={{ objectFit: (index + 1) % 4 === 0 ? 'cover' : '',
                    background: (index + 1) % 5 === 0 ? 'white' : '',
                }}
                    imgUrl={publisher.imgUrl}
                    key={publisher.id}
                />)}
                

                {/* <span>{error}</span> */}

            </div>


    )


}



export default Newspaper
