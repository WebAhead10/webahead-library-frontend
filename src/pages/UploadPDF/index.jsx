import BulkImageInput from "../../components/ImageInput"
import { useHistory } from "react-router-dom"
import "./style.css"
import { useState } from "react"

const UploadPDF = () => {
  const history = useHistory()
  const [error, setError] = useState("")

  return (
    <div className="upload-container">
      <BulkImageInput
        width="300px"
        height="300px"
        text="NO_TEXT"
        onChange={(newspaperId) => {
          history.push(`/newspaper/edit/${newspaperId}`)
        }}
        onError={(errorMessage) => setError(errorMessage)}
      />

      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  )
}

export default UploadPDF
