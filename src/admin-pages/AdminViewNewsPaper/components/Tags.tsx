import React, { useState, useEffect } from 'react'
import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

interface TagsProps {
  articleId: number
}

interface SelectedTags {
  id: number
  name: string
}

const Tags = ({ articleId }: TagsProps) => {
  const [tags, setTags] = useState([])
  const [tagAutocomplete, setTagAutocomplete] = useState('')
  const [error, setError] = useState('')
  const [selectedTags, setSelectedTags] = useState<SelectedTags[]>([])

  const onTagClick = (tagId: number, tagName: string) => {
    if (!tagId) return

    const isTagSelected = selectedTags.find(({ id }) => id === tagId)

    // if tag exists then remove it
    if (isTagSelected) {
      setSelectedTags(selectedTags.filter(({ id }) => id !== tagId))

      return
    }

    // if it doesn't then add it
    setSelectedTags((prevDoc) => selectedTags.concat({ id: tagId, name: tagName }))

    setTagAutocomplete('')
  }

  useEffect(() => {
    if (!tagAutocomplete) return

    axios
      .get(`${API_URL}/tag/autocomplete/${tagAutocomplete}`)
      .then((res) => {
        if (!res.data.success) {
          setError('Failed')
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
                marginLeft: 'auto',
                display: 'flex',
                fontSize: '20px'
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
                  const isTagSelected = selectedTags.find(({ id: tagId }) => tagId === id)

                  return (
                    <span
                      onClick={() => !isTagSelected && onTagClick(id, name)}
                      className={isTagSelected && 'disabled-option'}
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
            <span className="tag-pill" onDoubleClick={() => onTagClick(id, name)}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tags
