import React, { useState, useEffect, useRef } from 'react'
import { Modal, Select, message, Input, Row, Col } from 'antd'
import axios from 'utils/axios'
import { DeleteFilled, SwapOutlined, EditOutlined } from '@ant-design/icons'
import './style.css'
import dragula from 'dragula'

function AddTag() {
  const [tags, setTags] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const containerRef = useRef(null)

  // Both these states are for the replace tag
  const [oldTag, setOldTag] = useState({})
  const [newTag, setNewTag] = useState({})

  useEffect(() => {
    const container = containerRef.current

    // Initialize Dragula instance
    // const drake = dragula([container])
    const drake = dragula([container], {
      moves: (el, container, handle) => {
        // Return true to allow dragging
        return !handle.classList.contains('no-drag')
      }
    })

    // Handle drag events
    drake.on('drag', (el, source) => {
      // Handle drag start event
      // Update element position to follow the mouse
      el.style.left = `${el.getBoundingClientRect().left}px`
      el.style.top = `${el.getBoundingClientRect().top}px`

      // Add custom class to show dragging effect
      el.classList.add('dragging')
    })

    drake.on('drop', (el, target, source, sibling) => {
      // Handle drop event
      const updatedOrder = Array.from(container.children).map((el) => el.id)
      // reorder tags in state using updatedOrder

      axios
        .post('tags/order/update', {
          order: updatedOrder
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
          console.log('error', err.message)
        })
    })

    drake.on('dragend', (el) => {
      // Reset element position and remove custom class
      el.style.left = ''
      el.style.top = ''
      el.classList.remove('dragging')
    })

    drake.on('over', (el, container) => {
      // Handle drag over event
    })

    // Clean up Dragula instance
    return () => {
      drake.destroy()
    }
  }, [])

  useEffect(() => {
    axios
      .get('/tag/all')
      .then((res) => {
        if (!res.data.success) {
          //   setError("Failed")
          return
        }
        setTags(res.data.data)
      })
      .catch((error) => {
        // setError(error.message)
      })
  }, [])

  const addTags = (event) => {
    if (event.key === 'Enter' && event.target.value !== '') {
      axios
        .post('/tag/add', {
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
    axios
      .get(`/tag/delete/${tags[indexToRemove].id}`)
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed to delete tag')
          // setError("Something went wrong")
        } else {
          message.success('Tag deleted successfully')
          setTags(tags.filter((tag, index) => index !== indexToRemove))

          // history.push("/a/admin")
        }
      })
      .catch((err) => {
        // setError("Failed: " + err.message)
        console.log('error', err.message)
      })
  }

  const replaceTag = () => {
    axios
      .post('/tag/replace', {
        oldTagId: oldTag.id,
        newTagId: newTag.id
      })
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed to replace tag')
          setIsModalOpen(false)
          setNewTag({})
          setOldTag({})
          // setError("Something went wrong")
        } else {
          setIsModalOpen(false)
          setNewTag({})
          setOldTag({})
          message.success('Tag replaced successfully')
          // history.push("/a/admin")
        }
      })
      .catch((err) => {
        // setError("Failed: " + err.message)
        message.error('Failed to replace tag')
        console.log('error', err.message)
      })
  }

  const updateTag = () => {
    axios
      .post('/tag/update', {
        tagId: oldTag.id,
        newTagName: newTag.name
      })
      .then((res) => {
        if (!res.data.success) {
          message.error('Failed to update tag')
          setIsUpdateModalOpen(false)
          setNewTag({})
          setOldTag({})
          // setError("Something went wrong")
        } else {
          setTags(tags.map((tag) => (tag.id === oldTag.id ? { ...tag, name: newTag.name } : tag)))
          setIsUpdateModalOpen(false)
          setNewTag({})
          setOldTag({})
          message.success('Tag updated successfully')
          // history.push("/a/admin")
        }
      })
      .catch((err) => {
        // setError("Failed: " + err.message)
        message.error('Failed to update tag')
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
        <ul className="tag-ul" ref={containerRef}>
          {tags.map((tag, index) => (
            <li key={index} className="tag-li no-drag" id={tag.id}>
              <DeleteFilled
                onClick={() => {
                  removeTags(index)
                }}
                style={{ transform: 'scale(1.2)', cursor: 'pointer', margin: '0px 5px' }}
              />
              <SwapOutlined
                onClick={() => {
                  // replace()
                  setOldTag(tag)
                  setIsModalOpen(true)
                }}
                style={{ transform: 'scale(1.2)', cursor: 'pointer', margin: '0px 5px' }}
              />

              <EditOutlined
                onClick={() => {
                  setOldTag(tag)
                  setIsUpdateModalOpen(true)
                }}
                style={{ transform: 'scale(1.2)', cursor: 'pointer', margin: '0px 5px' }}
              />
              <span className="tag-span">{tag.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        title="Replace Tag"
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
        }}
        onOk={() => {
          replaceTag()
          setIsModalOpen(false)
        }}
        okText="Replace"
      >
        <div>
          <span>Replace</span> &nbsp;
          <span>
            <b>{oldTag.name}</b>
          </span>{' '}
          &nbsp;
          <span>with</span>&nbsp;
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a tag"
            optionFilterProp="children"
            onChange={(value) => {
              const tagChosen = tags.find((tag) => tag.id === value)

              setNewTag(tagChosen)
            }}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {tags.map((tag, index) => (
              <Select.Option key={index} value={tag.id}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
      <Modal
        title="Update tag"
        visible={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false)
        }}
        onOk={() => {
          updateTag()
          setIsUpdateModalOpen(false)
        }}
        okText="Replace"
      >
        <Row align="middle">
          <Col>Update</Col> &nbsp;
          <Col>
            <b>{oldTag.name}</b>
          </Col>{' '}
          &nbsp;
          <Col>with</Col>&nbsp;
          <Col>
            <Input
              placeholder="Enter new tag name"
              value={newTag.name}
              onChange={(e) => {
                setNewTag({ name: e.target.value })
              }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default AddTag
