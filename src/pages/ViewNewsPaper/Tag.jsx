import axios from "axios"
import React from "react"

const Tag = ({ tagName, tagId, articleId }) => {
  const attachTagToNewspaper = async (id) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/attachTag/overlay/`,
        {
          tag_id: id,
          overlay_id: articleId,
        }
      )
      if (!result.data.success) throw new Error("Failed")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="singularTag" onClick={() => attachTagToNewspaper(tagId)}>
      <span>{tagName}</span>
    </div>
  )
}

export default Tag
