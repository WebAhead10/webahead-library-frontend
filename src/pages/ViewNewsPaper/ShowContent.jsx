import React,{useState , useEffect} from 'react'
import axios from "axios"
import "./style.css"
const ShowContent = ({textArticle, articleId ,setViewText}) => {
    const [text,setText] = useState()

    useEffect(() => {
        setText(textArticle)
      }, [])

    const updateArticleText = async (id)=> {
        try {
            const res = await axios.put(process.env.REACT_APP_API_URL + "/update/article/" + id, text)
            
            if (!res.data.success) {
              console.log("error big dumdum");
              return
            }
            // ! something blah blah todo

        }catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="ShowTextDiv">
            <button onClick={setViewText(false)} >X</button>
            <textarea rows="10" cols="70" onChange={setText}>{text}</textarea>
            <button onClick={updateArticleText(articleId)} >update text</button>
        </div>
    )
}

export default ShowContent
