import React, { useState, useEffect } from 'react'
import axios from 'axios'
import style from '../style.module.css'
import Tags from './Tags'

interface ShowContentProps {
  articleId: number
  close: Function
}

const ShowContent = ({ articleId, close }: ShowContentProps) => {
  const [text, setText] = useState('')

  const fetchContent = async (coordsId: number) => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/newspaper/content/${coordsId}`)

      if (!result.data.success) throw new Error('Failed')

      setText(result.data.content)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchContent(articleId)
  }, [articleId])

  const updateArticleText = async () => {
    try {
      const res = await axios.put(process.env.REACT_APP_API_URL + '/update/article/' + articleId, {
        text
      })

      if (!res.data.success) {
        console.log('error in updating content for the article')
        return
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={style['ShowTextDiv']}>
      <button
        className="button view-newspaper-button"
        style={{ margin: '10px', marginRight: 'auto' }}
        onClick={() => close()}
      >
        Close
      </button>
      <Tags articleId={articleId} />
      <textarea
        rows={23}
        cols={30}
        value={text}
        style={{ margin: '0px 10px' }}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button
        className="button view-newspaper-button"
        onClick={() => updateArticleText()}
        style={{ margin: 'auto', marginTop: '10px' }}
      >
        Update text
      </button>
    </div>
  )
}

export default ShowContent
