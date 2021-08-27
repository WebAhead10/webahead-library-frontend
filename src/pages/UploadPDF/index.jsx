import BulkImageInput from "../../components/ImageInput"
import { useHistory } from "react-router-dom"
import "./style.css"

const UploadPDF = () => {
  const history = useHistory()

  return (
    <div className="upload-container">
      <BulkImageInput
        width="300px"
        height="300px"
        text="NO_TEXT"
        onChange={({ newspaperId }) => {
          history.push(`/newspaper/edit/${newspaperId}`)
        }}
      />
    </div>
  )
}

export default UploadPDF
