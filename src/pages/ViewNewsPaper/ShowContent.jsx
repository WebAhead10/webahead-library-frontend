import React,{useState , useEffect} from 'react'
import axios from "axios"
import "./style.css"
const ShowContent = ({textArticle, articleId ,setViewText}) => {
    const [text,setText] = useState("")

    const fetchContent = async (coordsId) => {
        try {
          const result = await axios.get(
            `${process.env.REACT_APP_API_URL}/newspaper/content/${coordsId}`
          )
          if (!result.data.success) throw new Error("Failed")
          setText(result.data.content)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchContent(articleId)
      }, [])

    const updateArticleText = async ()=> {
        try {
            const res = await axios.put(process.env.REACT_APP_API_URL + "/update/article/" + articleId, {text})
            
            if (!res.data.success) {
              console.log("error in updating content for the article");
              return
            }

        }catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="ShowTextDiv">
            <button onClick={() => setViewText(false)} >X</button>
            <textarea rows="28" cols="40" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <button onClick={()=> updateArticleText()} >update text</button>
        </div>
    )
}

export default ShowContent
