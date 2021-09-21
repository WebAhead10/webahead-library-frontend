import BulkImageInput from "../../components/ImageInput"
import { useHistory } from "react-router-dom"
import "./style.css"
import { useState, useEffect } from "react"
import axios from "axios"
const API_URL = process.env.REACT_APP_API_URL

// TODO: Connect tags to newspaper in the backend.
// TODO: Change the way newspaper is edited.
const UploadPDFDocument = () => {
  const history = useHistory()

  const [error, setError] = useState("")
  const [publishers, setPublishers] = useState([])
  const [newDocument, setNewDocument] = useState({
    publisher: null,
    date: "",
    newspaperId: null,
    tags: [],
  })
  const [tagAutocomplete, setTagAutocomplete] = useState("")
  const [tags, setTags] = useState([])

  const onChange =
    (key) =>
    ({ target }) =>
      setNewDocument((prevDoc) => ({
        ...prevDoc,
        [key]: target.value,
      }))

  const onTagClick = (tagId, tagName) => {
    console.log(1, tagId)
    if (!tagId) return

    const isTagSelected = newDocument.tags.find(({ id }) => id === tagId)

    // if tag exists then remove it
    if (isTagSelected) {
      setNewDocument((prevDoc) => ({
        ...prevDoc,
        tags: newDocument.tags.filter(({ id }) => id !== tagId),
      }))

      return
    }

    console.log("tagId", tagId)
    // if it doesn't then add it
    setNewDocument((prevDoc) => ({
      ...prevDoc,
      tags: newDocument.tags.concat({ id: tagId, name: tagName }),
    }))

    setTagAutocomplete("")
  }

  useEffect(() => {
    axios
      .get(`${API_URL}/publishers`)
      .then((res) => {
        if (!res.data.success) {
          setError("Failed")
          return
        }

        setPublishers(res.data.publisher)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

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

  const submitDocument = () => {
    console.log(newDocument)
  }

  return (
    <div className="upload-container">
      <div className="top-form">
        <div className="critical-details-form">
          <label className="document-detail">
            <span>دار النشر</span>
            <select
              className="dropdown"
              onChange={onChange("publisher")}
              value={newDocument.publisher}
            >
              <option selected disabled></option>
              {publishers.map((publisher) => (
                <option value={publisher.id}>{publisher.name}</option>
              ))}
            </select>
          </label>

          <label className="document-detail">
            <span>تاريخ</span>
            <input
              className="date-input"
              type="date"
              value={newDocument.date}
              onChange={onChange("date")}
            />
          </label>
        </div>

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
                    const isTagSelected = newDocument.tags.find(
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
            {newDocument.tags.map(({ name, id }) => (
              <span
                className="tag-pill"
                onDoubleClick={() => onTagClick(id, name)}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      {/* {newDocument.date && newDocument.publisher && ( */}
      <BulkImageInput
        width="300px"
        height="300px"
        text="NO_TEXT"
        date={newDocument.date}
        publisherId={newDocument.publisher}
        onChange={(newspaperId) => {
          // history.push(`/newspaper/edit/${newspaperId}`)
        }}
        onError={(errorMessage) => setError(errorMessage)}
      />
      {/* )} */}

      <input
        type="submit"
        value="Submit"
        className="button"
        style={{ marginTop: "20px" }}
        onClick={submitDocument}
      />

      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  )
}

export default UploadPDFDocument
