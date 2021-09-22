import React, { useState, useEffect } from "react"
import axios from "axios"
import Tag from "./Tag"
const Tags = ({ articleId }) => {
  const [tags, setTags] = useState([])
  const [acText, setAcText] = useState("")

  // useEffect(() => {
  //   fetchAllTags("")
  // }, [])

  const fetchAllTags = async (ac) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/autocomplete`,
        { tag: ac }
      )
      if (!result.data.success) throw new Error("Failed")
      console.log(result.data)
      // setTags(result.data)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="multipleTags">
      <input
        type="text"
        value={acText}
        onChange={(e) => {
          setAcText(e.target.value)
          fetchAllTags(acText)
        }}
      />
      {tags &&
        tags.map((oneTag) => {
          return (
            <Tag
              key={oneTag.id}
              tagName={oneTag.tag_name}
              tagId={oneTag.id}
              articleId={articleId}
            />
          )
        })}
    </div>
  )
}

export default Tags
