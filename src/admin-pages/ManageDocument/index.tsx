import BulkImageInput from '../../components/ImageInput'
import { useHistory } from 'react-router-dom'
import './style.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

// TODO: Connect tags to newspaper in the backend.
// TODO: Change the way newspaper is edited.
const UploadPDFDocument = () => {
  const history = useHistory()

  const [error, setError] = useState('')
  const [publishers, setPublishers] = useState([])
  const [newDocument, setNewDocument] = useState<Document_>({
    publisher: '',
    date: '',
    tags: [],
    documentId: null
  })
  const [tagAutocomplete, setTagAutocomplete] = useState('')
  const [tags, setTags] = useState([])

  const onChange =
    (key: string) =>
    ({ target }: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) =>
      setNewDocument((prevDoc) => ({
        ...prevDoc,
        [key]: target.value
      }))

  const onTagClick = (tagId: number, tagName: string) => {
    if (!tagId) return

    const isTagSelected = newDocument.tags.find(({ id }) => id === tagId)

    // if tag exists then remove it
    if (isTagSelected) {
      setNewDocument((prevDoc) => ({
        ...prevDoc,
        tags: newDocument.tags.filter(({ id }) => id !== tagId)
      }))

      return
    }

    // if it doesn't then add it
    setNewDocument((prevDoc) => ({
      ...prevDoc,
      tags: newDocument.tags.concat({ id: tagId, name: tagName })
    }))

    setTagAutocomplete('')
  }

  useEffect(() => {
    axios
      .get(`${API_URL}/publishers`)
      .then((res) => {
        if (!res.data.success) {
          setError('Failed')
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

  const submitDocument = async () => {
    try {
      await axios.post(`${API_URL}/newspaper`, newDocument)

      history.push('/')
    } catch (error) {
      setError('An error has occured while saving')
    }
  }

  return (
    <div className="upload-container">
      <h1>Add a document</h1>
      <br />
      <br />
      <div className="top-form">
        <div className="critical-details-form">
          <label className="document-detail">
            <span>دار النشر</span>
            <select className="dropdown" onChange={onChange('publisher')} value={newDocument.publisher}>
              <option selected disabled></option>
              {publishers.map((publisher: Publisher) => (
                <option value={publisher.id}>{publisher.name}</option>
              ))}
            </select>
          </label>

          <label className="document-detail">
            <span>تاريخ</span>
            <input className="date-input" type="date" value={newDocument.date} onChange={onChange('date')} />
          </label>
        </div>

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
                    const isTagSelected = newDocument.tags.find(({ id: tagId }) => tagId === id)

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
            {newDocument.tags.map(({ name, id }) => (
              <span className="tag-pill" onDoubleClick={() => onTagClick(id, name)}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      <BulkImageInput
        width="300px"
        height="300px"
        onChange={(documentId: number) => {
          setNewDocument({ ...newDocument, documentId })
        }}
        documentId={newDocument.documentId}
        onError={(errorMessage) => setError(errorMessage)}
      />

      <input type="submit" value="Submit" className="button" style={{ marginTop: '20px' }} onClick={submitDocument} />

      {error && <span className="error">{error}</span>}
    </div>
  )
}

export default UploadPDFDocument
