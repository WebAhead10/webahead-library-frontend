import React, { useState, useEffect } from 'react'
import axiosOld from 'axios'
import axios from 'utils/axios'
import style from '../style.module.css'
import Tags from './Tags'
import { FaWindowClose } from 'react-icons/fa'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { useQuery } from '@tanstack/react-query'

import 'react-tabs/style/react-tabs.css'
import { message } from 'antd'

interface ShowContentProps {
  overlayId: number
  close: Function
}

const ShowContent = ({ overlayId, close }: ShowContentProps) => {
  const [text, setText] = useState('')
  const [note, setNote] = useState('')
  const [initialNote, setInitialNote] = useState(
    'للُّغَة العَرَبِيّة هي أكثر اللغات السامية تحدثًا، وإحدى أكثر اللغات انتشاراً في العالم، يتحدثها أكثر من 467 مليون نسمة،(1) ويتوزع متحدثوها في الوطن العربي، بالإضافة إلى العديد من المناطق الأخرى المجاورة كالأهواز وتركيا وتشاد ومالي والسنغال وإرتيريا وإثيوبيا وجنوب السودان وإيران. وبذلك فهي تحتل المركز الرابع أو الخامس من حيث اللغات الأكثر انتشارًا في العالم، وهي تحتل المركز الثالث تبعًا لعدد الدول التي تعترف بها كلغة رسمية؛ إذ تعترف بها 27 دولة كلغة رسمية، واللغة الرابعة من حيث عدد المستخدمين على الإنترنت. اللغةُ العربيةُ ذات أهمية قصوى لدى المسلمين، فهي عندَهم لغةٌ مقدسة إذ أنها لغة القرآن، وهي لغةُ الصلاة وأساسيةٌ في القيام بالعديد من العبادات والشعائرِ الإسلامية'
  )

  const { data: notesData = [], refetch: refetchNotes } = useQuery<[]>(
    ['overlay-notes', overlayId],
    async () => {
      const res = await axios.get(`/overlay/notes/${overlayId}`)
      return res.data.notes
    },
    {
      enabled: false
    }
  )

  const { data: textData, refetch: refetchText } = useQuery(
    ['overlay-text', overlayId],
    async () => {
      const res = await axios.get(`/overlay/content/${overlayId}`)
      return res.data.content
    },
    {
      enabled: false
    }
  )

  useEffect(() => {
    if (overlayId) {
      refetchNotes()
      refetchText()
    }
  }, [overlayId, refetchNotes, refetchText])

  useEffect(() => {
    setText(textData)
  }, [textData])

  const updateArticleText = async () => {
    try {
      const res = await axiosOld.post(process.env.REACT_APP_API_URL + '/overlay/content/' + overlayId, {
        text: text,
        userId: 1,
        document_id: overlayId
      })

      if (!res.data.success) {
        message.error('error in updating content for the article')
        return
      }

      message.success('Upload done, Thank you for your efforts.')
    } catch (err) {
      message.error('An error has occurred')
    }
  }

  const updateOverlayNote = async () => {
    try {
      const res = await axios.post(`/overlay/note`, {
        text: note,
        userId: 1,
        overlayId
      })

      if (!res.data.success) {
        console.log('error in adding note')
        return
      }

      message.success('Thank you for your note.')

      setNote('')
      refetchNotes()
    } catch (err) {
      message.error('An error has occurred')
    }
  }

  console.log({ notesData })
  return (
    <div className={style.showTextDiv}>
      <div className={style.closeButton}>
        <FaWindowClose style={{ fontSize: '35px' }} onClick={() => close()} />
      </div>

      <Tabs defaultIndex={1} onSelect={(index) => console.log(index)} style={{ marginTop: '10px' }}>
        <TabList>
          <Tab key={1}>Notes</Tab>
          <Tab key={2}>Content</Tab>
        </TabList>
        <TabPanel>
          <div className={style.tabPanelBody}>
            <div className={style.commentDev}>{initialNote}</div>
            <h2>Notes</h2>
            <div className={style['scroll']}>
              {notesData?.map(({ text }, index) => (
                <div key={index} className={style.commentDiv}>
                  {text}
                </div>
              ))}
            </div>
            <div className="autocomplete-container" style={{ width: '100%' }}>
              <label>
                <span className={style.addNote}>اضافة ملاحظه</span>
                <textarea
                  rows={5}
                  cols={40}
                  value={note}
                  placeholder="هل لديك ملاحظه؟"
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <br />
              <button
                className="button view-newspaper-button"
                onClick={updateOverlayNote}
                style={{ margin: 'auto', marginTop: '20px' }}
              >
                Update
              </button>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={style.tabPanelBody}>
            <Tags overlayId={overlayId} />
            <textarea
              rows={23}
              cols={60}
              value={text}
              style={{ margin: '0px 10px' }}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="button view-newspaper-button"
              onClick={() => updateArticleText()}
              style={{ margin: 'auto', marginTop: '10px' }}
            >
              Update text
            </button>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ShowContent
