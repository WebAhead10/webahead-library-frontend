import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Quill = ReactQuill.Quill
var Block = Quill.import('blots/block') as any
Block.tagName = 'div'
Quill.register(Block)

const QuillEditor = ({ content, onChange }) => {
  const [editorHtml, setEditorHtml] = useState(content)

  const handleEditorChange = (html) => {
    setEditorHtml(html)
    onChange(html)
  }

  useEffect(() => {
    setEditorHtml(content)
  }, [content])

  return (
    <ReactQuill
      theme="snow"
      value={editorHtml}
      onChange={handleEditorChange}
      style={{
        direction: 'rtl',
        height: '100%',
        margin: '0 auto'
      }}
      modules={{
        toolbar: [
          // [{ header: '1' }, { header: '2' }],
          [{ size: [] }],
          ['bold', 'italic', 'underline'],
          // [{ list: 'ordered' }, { list: 'bullet' },   { indent: '-1' }, { indent: '+1' }],
          ['clean']
        ],
        clipboard: {
          matchVisual: false
        }
      }}
    />
  )
}

export default QuillEditor
