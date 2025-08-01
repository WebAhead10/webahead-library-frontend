import React, { useState, useEffect } from 'react'
import axiosOld from 'axios'
import axios from 'utils/axios'
import style from '../style.module.css'
import { CloseCircleFilled } from '@ant-design/icons'

import { Tabs, Button } from 'antd'

import { useMutation } from '@tanstack/react-query'

import { message, Select, Tag } from 'antd'
import { ITagInput } from 'types'
import { useOverlayNotes, useOverlayTags, useOverlayText } from 'api-hooks/overlay.hooks'
import { useTags } from 'api-hooks/general.hook'

interface OverlayDataSiderPropsProps {
  overlayId: number
  close: Function
}

const OverlayDataSiderProps = ({ overlayId, close }: OverlayDataSiderPropsProps) => {
  const [text, setText] = useState('')
  const [note, setNote] = useState('')
  const [initialNote, setInitialNote] = useState(
    'للُّغَة العَرَبِيّة هي أكثر اللغات السامية تحدثًا، وإحدى أكثر اللغات انتشاراً في العالم، يتحدثها أكثر من 467 مليون نسمة،(1) ويتوزع متحدثوها في الوطن العربي، بالإضافة إلى العديد من المناطق الأخرى المجاورة كالأهواز وتركيا وتشاد ومالي والسنغال وإرتيريا وإثيوبيا وجنوب السودان وإيران. وبذلك فهي تحتل المركز الرابع أو الخامس من حيث اللغات الأكثر انتشارًا في العالم، وهي تحتل المركز الثالث تبعًا لعدد الدول التي تعترف بها كلغة رسمية؛ إذ تعترف بها 27 دولة كلغة رسمية، واللغة الرابعة من حيث عدد المستخدمين على الإنترنت. اللغةُ العربيةُ ذات أهمية قصوى لدى المسلمين، فهي عندَهم لغةٌ مقدسة إذ أنها لغة القرآن، وهي لغةُ الصلاة وأساسيةٌ في القيام بالعديد من العبادات والشعائرِ الإسلامية'
  )

  const {
    data: notesData = {
      mainNote: {
        text: ''
      },
      notes: []
    },
    refetch: refetchNotes
  } = useOverlayNotes(overlayId)

  const { data: textData } = useOverlayText(overlayId)

  const { data: tagsData, refetch: refetchTags, isLoading: isFetchingTags } = useOverlayTags(overlayId)

  const { mutate: attachTag, isLoading: isAttachingTag } = useMutation((tagId: number) => {
    return axios.post('/tag/attach/overlay', {
      tagId,
      overlayId
    })
  })

  const { mutate: detachTag, isLoading: isDetachingTag } = useMutation((tagId: number) => {
    return axios.post('/tag/detach/overlay', {
      tagId,
      overlayId
    })
  })

  const { data: tags } = useTags()

  useEffect(() => {
    setText(textData?.content)
  }, [textData])

  useEffect(() => {
    setInitialNote(notesData.mainNote?.text || '')
  }, [notesData])

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
      // message.error('An error has occurred')
    }
  }

  if (!tags || !tagsData) return null

  const isLoading = isFetchingTags || isAttachingTag || isDetachingTag

  return (
    <div className={style.showTextDiv}>
      <div className={style.closeButton}>
        <CloseCircleFilled style={{ fontSize: '35px' }} onClick={() => close()} />
      </div>

      <Tabs defaultActiveKey="2" centered style={{ marginTop: '10px' }}>
        {/* Notes panel */}
        <Tabs.TabPane tab="ملاحظات" key="1">
          <div className={style.tabPanelBody}>
            <div>{initialNote}</div>
            <h2>ملاحظات</h2>
            <div className={style.scroll}>
              {notesData?.notes?.map(({ text }, index) => (
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
              <Button
                type="primary"
                size="large"
                onClick={updateOverlayNote}
                style={{ margin: 'auto', marginTop: '20px' }}
              >
                تعديل
              </Button>
            </div>
          </div>
        </Tabs.TabPane>

        {/* Main panel */}
        <Tabs.TabPane tab="Content" key="2">
          <div className={style.tabPanelBody}>
            <Select
              mode="tags"
              style={{
                width: '50%',
                margin: 'auto'
              }}
              placeholder="تصنيف"
              onSelect={(value) => {
                const tag = tags.find((tag: ITagInput) => tag.id === value)
                if (tag) {
                  attachTag(value, {
                    onSuccess: () => {
                      message.success('تم اضافة التصنيف بنجاح')
                      refetchTags()
                    }
                  })
                }
              }}
              onDeselect={(value) => {
                const tag = tags.find((tag: ITagInput) => tag.id === value)

                if (tag) {
                  detachTag(value, {
                    onSuccess: () => {
                      message.success('تم حذف التصنيف بنجاح')
                      refetchTags()
                    }
                  })
                }
              }}
              loading={isLoading}
              value={tagsData.map((tag) => tag.id)}
              // tagRender={() => <> </>}
            >
              {tags.map((tag: ITagInput) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
            <br />
            <br />
            <div>
              {tagsData.map((tag) => (
                <Tag
                  closable
                  onClose={() => {
                    detachTag(tag.id, {
                      onSuccess: () => {
                        message.success('تم حذف التصنيف بنجاح')
                        refetchTags()
                      }
                    })
                  }}
                  style={{ fontSize: '20px', padding: '5px 10px' }}
                >
                  {tag.name}
                </Tag>
              ))}
            </div>

            <br />

            <span className={style.overlayTitle}>{textData?.title}</span>

            <textarea rows={23} cols={60} value={text} onChange={(e) => setText(e.target.value)} />
            <Button
              type="primary"
              size="large"
              onClick={() => updateArticleText()}
              style={{ margin: 'auto', marginTop: '10px' }}
            >
              تعديل المحتوى
            </Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default OverlayDataSiderProps
