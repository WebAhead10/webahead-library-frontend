import React, { useState, useEffect } from "react"
import axios from "axios"
import DeleteIcon from "@material-ui/icons/Delete"
import "./style.css"

function AddTag() {
  const [tags, setTags] = useState([])

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/allTags")
      .then((res) => {
        if (!res.data.success) {
          //   setError("Failed")
          return
        }
        console.log(res.data.data)
        setTags(res.data.data)
      })
      .catch((error) => {
        // setError(error.message)
      })
  }, [])

  const addTags = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      setTags([...tags, event.target.value])
      axios
        .post(process.env.REACT_APP_API_URL + "/addTag", {
          tag_name: event.target.value,
        })
        .then((res) => {
          if (!res.data.success) {
            // setError("Something went wrong")
          } else {
            console.log(res)
            // history.push("/a/admin")
          }
        })
        .catch((err) => {
          // setError("Failed: " + err.message)
          console.log("error", err.message)
        })

      event.target.value = ""
    }
  }

  const removeTags = (indexToRemove) => {
    setTags(tags.filter((tag, index) => index !== indexToRemove))
    console.log(tags[indexToRemove])
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteTag", {
        tag_name: tags[indexToRemove],
      })
      .then((res) => {
        if (!res.data.success) {
          // setError("Something went wrong")
        } else {
          console.log(res)
          // history.push("/a/admin")
        }
      })
      .catch((err) => {
        // setError("Failed: " + err.message)
        console.log("error", err.message)
      })
  }
  return (
    <div className="container">
      <input
        className="tag-input"
        type="text"
        placeholder="Press enter to add tag"
        onKeyUp={addTags}
      ></input>
      <div className="tags">
        <ul className="tag-ul">
          {tags.map((tag, index) => (
            <li key={index} className="tag-li">
              <DeleteIcon
                onClick={() => removeTags(index)}
                style={{ transform: "scale(1)" }}
              />
              <span className="tag-span">{tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AddTag
