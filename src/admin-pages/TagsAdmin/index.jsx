import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DeleteIcon from '@material-ui/icons/Delete'
import './style.css'

function AddTag() {
  const [tags, setTags] = useState([])

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + '/allTags')
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
    if (event.key === 'Enter' && event.target.value !== '') {
      axios
        .post(process.env.REACT_APP_API_URL + '/addTag', {
          tag: event.target.value
        })
        .then((res) => {
          if (!res.data.success) {
            // setError("Something went wrong")
            event.target.value = ''
          } else {
            setTags([...tags, { name: event.target.value, id: res.data.tagId }])
            event.target.value = ''
            // history.push("/a/admin")
          }
        })
        .catch((err) => {
          event.target.value = ''
          // setError("Failed: " + err.message)
          console.log('error', err.message)
        })
    }
  }

  const removeTags = (indexToRemove) => {
    setTags(tags.filter((tag, index) => index !== indexToRemove))
    console.log(tags[indexToRemove])
    axios
      .post(process.env.REACT_APP_API_URL + '/deleteTag', tags[indexToRemove])
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
        console.log('error', err.message)
      })
  }
  return (
    <div
      className="container"
      style={{
        padding: '20px 0px'
      }}
    >
      <h1>Manage Tags</h1>
      <input className="tag-input" type="text" placeholder="" onKeyUp={addTags}></input>
      <div className="tags">
        <ul className="tag-ul">
          {tags.map((tag, index) => (
            <li key={index} className="tag-li">
              <DeleteIcon onClick={() => removeTags(index)} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} />
              <span className="tag-span">{tag.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AddTag
