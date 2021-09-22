import React, { useState, useEffect } from "react"
import axios from "axios"
import Tag from "./Tag"
const API_URL = process.env.REACT_APP_API_URL

const Tags = ({ articleId }) => {
  const [tags, setTags] = useState([])
  const [acText, setAcText] = useState("")
  const [tagAutocomplete, setTagAutocomplete] = useState("")
  const [error, setError] = useState("")
  const [selectedTags, setSelectedTags] = useState([])

  // useEffect(() => {
  //   fetchAllTags("")
  // }, [])

  const fetchAllTags = async (ac) => {
    console.log(ac)
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/autocomplete`,
        { tag: ac }
      )
      if (!result.data.success) throw new Error("Failed")
      console.log(result.data)
      setTags(result.data)
    } catch (err) {
      console.log(err)
    }
  }

  const onTagClick = (tagId, tagName) => {
    console.log(1, tagId)
    if (!tagId) return

    const isTagSelected = selectedTags.find(({ id }) => id === tagId)

    // if tag exists then remove it
    if (isTagSelected) {
      setSelectedTags(selectedTags.filter(({ id }) => id !== tagId))

      return
    }

    console.log("tagId", tagId)
    // if it doesn't then add it
    setSelectedTags((prevDoc) =>
      selectedTags.concat({ id: tagId, name: tagName })
    )

    setTagAutocomplete("")
  }

  useEffect(() => {
    if (!tagAutocomplete) return

    axios
      .post(`${API_URL}/autocomplete`, { tag: tagAutocomplete })
      .then((res) => {
        if (!res.data.success) {
          setError("Failed")
          return
        }

        setTags(res.data.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [tagAutocomplete])

  return (
    <div className="multipleTags">
      <div className="newspaper-tags-container">
        <div className="autocomplete-container">
          <label>
            <span
              style={{
                marginLeft: "auto",
                display: "flex",
                fontSize: "20px",
              }}
            >
              تصنيف
            </span>
            <input
              type="text"
              onChange={({ target }) => setTagAutocomplete(target.value)}
              value={tagAutocomplete}
              placeholder="ابحث"
            />
          </label>

          {tagAutocomplete && (
            <div className="autocomplete-options-container">
              {tags.length ? (
                tags.slice(0, 5).map(({ name, id }) => {
                  const isTagSelected = selectedTags.find(
                    ({ id: tagId }) => tagId === id
                  )

                  return (
                    <span
                      onClick={() => !isTagSelected && onTagClick(id, name)}
                      className={isTagSelected && "disabled-option"}
                    >
                      {name}
                    </span>
                  )
                })
              ) : (
                <span className="disabled-option">No option</span>
              )}
            </div>
          )}
        </div>
        <div className="tag-pill-container">
          {selectedTags.map(({ name, id }) => (
            <span
              className="tag-pill"
              onDoubleClick={() => onTagClick(id, name)}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      {/* <input
        type="text"
        value={acText}
        onChange={(e) => {
          setAcText(e.target.value)
          fetchAllTags(e.target.value)
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
        })} */}
    </div>
  )
}

export default Tags
