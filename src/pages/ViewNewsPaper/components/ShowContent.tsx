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
  const [note, setNote] = useState('')
  const [UpdateResultMsg, setUpdateResultMsg] = useState('')
  const [updateNoteMsg, setUpdateNoteMsg] = useState('')
  const [initialNote, setInitialNote] = useState(
    'للُّغَة العَرَبِيّة هي أكثر اللغات السامية تحدثًا، وإحدى أكثر اللغات انتشاراً في العالم، يتحدثها أكثر من 467 مليون نسمة،(1) ويتوزع متحدثوها في الوطن العربي، بالإضافة إلى العديد من المناطق الأخرى المجاورة كالأهواز وتركيا وتشاد ومالي والسنغال وإرتيريا وإثيوبيا وجنوب السودان وإيران. وبذلك فهي تحتل المركز الرابع أو الخامس من حيث اللغات الأكثر انتشارًا في العالم، وهي تحتل المركز الثالث تبعًا لعدد الدول التي تعترف بها كلغة رسمية؛ إذ تعترف بها 27 دولة كلغة رسمية، واللغة الرابعة من حيث عدد المستخدمين على الإنترنت. اللغةُ العربيةُ ذات أهمية قصوى لدى المسلمين، فهي عندَهم لغةٌ مقدسة إذ أنها لغة القرآن، وهي لغةُ الصلاة وأساسيةٌ في القيام بالعديد من العبادات والشعائرِ الإسلامية'
  )
  //write now it is hard coded for notes
  const [NotesArr, setNotesArr] = useState([
    { text: 'first Note' },
    { text: 'second Note' },
    { text: 'third Note' },
    { text: 'first Note' },
    { text: 'first Note' },
    { text: 'second Note' },
    { text: 'third Note' },
    { text: 'first Note' },
    { text: 'first Note' },
    { text: 'first Note' },
    { text: 'first Note' },
    { text: 'second Note' },
    { text: 'third Note' },
    { text: 'first Note' },
    { text: 'first Note' },
    { text: 'second Note' },
    { text: 'third Note' },
    { text: 'first Note' }
  ])

  // fetch the text for the overlay
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
        text: text,
        user_id: 1,
        document_id: articleId
      })

      if (!res.data.success) {
        console.log('error in updating content for the article')
        return
      } else {
        setUpdateResultMsg('Upload done, Thank you for your efforts.')
      }
    } catch (err) {
      setUpdateResultMsg('An error has occurred')
      // console.log(err)
    }
  }

  const updateArticleNote = async () => {
    try {
      const res = await axios.post(process.env.REACT_APP_API_URL + '/note/', {
        text: note,
        user_id: 1,
        document_id: articleId
      })

      if (!res.data.success) {
        console.log('error in adding note')
        return
      } else {
        setUpdateNoteMsg('Thank you for your note.')
      }
    } catch (err) {
      setUpdateNoteMsg('An error has occurred')
      // console.log(err)
    }
  }

  return (
    <div className={style.showTextDiv}>
      <div className={style.closeButton}>
        <FaWindowClose style={{ fontSize: '35px' }} onClick={() => close()} />
      </div>

      <Tabs defaultIndex={1} onSelect={(index) => console.log(index)} style={{ marginTop: '10px' }}>
        <TabList>
          <Tab>Notes</Tab>
          <Tab>Content</Tab>
        </TabList>
        <TabPanel>
          <div className={style.tabPanelBody}>
            <div className={style.commentDev}>{initialNote}</div>
            <h2>Notes</h2>
            <div className={style['scroll']}>
              {NotesArr.map(({ text }) => (
                <div className={style.commentDev}>{text}</div>
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
                ></textarea>
              </label>
              <div>{updateNoteMsg}</div>
              <button
                className="button view-newspaper-button"
                onClick={updateArticleNote}
                style={{ margin: 'auto', marginTop: '20px' }}
              >
                Update
              </button>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={style.tabPanelBody}>
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
          </div>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ShowContent
