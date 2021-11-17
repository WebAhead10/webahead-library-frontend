import React, { useState, useEffect } from 'react'
import axios from 'axios'
import style from '../style.module.css'
import Tags from './Tags'
import { FaWindowClose } from 'react-icons/fa'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
interface ShowContentProps {
  articleId: number
  close: Function
}

const ShowContent = ({ articleId, close }: ShowContentProps) => {
  const [text, setText] = useState('')
  const [UpdateResultMsg, setUpdateResultMsg] = useState('')
  //write now it is hard coded for notes
  const [NotesArr, setNotesArr] = useState([
    { text: 'first Note' },
    { text: 'second Note' },
    { text: 'third Note' },
    { text: 'first Note' }
  ])

  const fetchContent = async (coordsId: number) => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/overlay/content/${coordsId}`)

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
      const res = await axios.post(process.env.REACT_APP_API_URL + '/overlay/content/' + articleId, {
        text
      })

      if (!res.data.success) {
        console.log('error in updating content for the article')
        return
      } else {
        setUpdateResultMsg('Upload done, Thank you for your efforts.')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={style['ShowTextDiv']}>
      <div style={{ textAlign: 'left', paddingLeft: '0.5vw' }}>
        <FaWindowClose style={{ fontSize: '35px' }} onClick={() => close()} />
      </div>
      <Tabs defaultIndex={1} onSelect={(index) => console.log(index)}>
        <TabList>
          <Tab>Notes</Tab>
          <Tab>Content</Tab>
        </TabList>
        <TabPanel>
          <div>
            <h2>The Content</h2>
          </div>
          <div className={style['CommentDev']}>{text}</div>
          <div>
            <h2>Notes</h2>
          </div>
          <div>
            {NotesArr.map((text) => (
              <div className={style['CommentDev']}>{text['text']}</div>
            ))}
          </div>
          <div className="autocomplete-container">
            <label>
              <span
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  fontSize: '20px'
                }}
              >
                اضافة ملاحظه
              </span>
              <input type="text" placeholder="هل لديك ملاحظه؟" />
            </label>
            <button>UPDATE</button>
          </div>
        </TabPanel>
        <TabPanel>
          <Tags articleId={articleId} />
          <textarea
            rows={23}
            cols={60}
            value={text}
            style={{ margin: '0px 10px' }}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <div>{UpdateResultMsg}</div>
          <button
            className="button view-newspaper-button"
            onClick={() => updateArticleText()}
            style={{ margin: 'auto', marginTop: '10px' }}
          >
            Update text
          </button>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ShowContent
