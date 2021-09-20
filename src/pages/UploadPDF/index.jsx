import BulkImageInput from "../../components/ImageInput"
import { useHistory } from "react-router-dom"
import "./style.css"
import { useState, useEffect } from "react"
import axios from "axios"
const API_URL = process.env.REACT_APP_API_URL

const UploadPDFDocument = () => {
  const history = useHistory()

  const [error, setError] = useState("")
  const [publishers, setPublishers] = useState([])
  const [newDocument, setNewDocument] = useState({
    publisher: {},
    date: {},
    newspaperId: null,
  })

  const onChange =
    (key) =>
    ({ target }) =>
      setNewDocument((prevDoc) => ({
        ...prevDoc,
        [key]: target.value,
      }))

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

  const submitDocument = () => {
    console.log(newDocument)
  }

  return (
    <div className="upload-container">
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
      <br />
      <br />
      <br />
      <BulkImageInput
        width="300px"
        height="300px"
        text="NO_TEXT"
        onChange={(newspaperId) => {
          // history.push(`/newspaper/edit/${newspaperId}`)
        }}
        onError={(errorMessage) => setError(errorMessage)}
      />

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
