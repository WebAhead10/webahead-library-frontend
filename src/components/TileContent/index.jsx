import React, { useEffect, useState } from "react"
import "./style.css"
import axios from "axios"
function TileContent() {
  const [value, setValue] = useState(null)
  const fetchPublisher = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/publishers`
      )
      console.log(result.data)
      setValue(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchPublisher()
  }, [])
  
  if (!value) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="tileContent_container">
      <div id="marwan">{value.publisher[1].name}</div>
    </div>
  )
}

export default TileContent
