import React, { useState, useEffect } from 'react'
import axios from 'utils/axios'
import style from '../style.module.css'
import { Tabs, Button } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'

import { useMutation } from '@tanstack/react-query'

import { message, Select, Tag, Input } from 'antd'
import { ITagInput } from 'types'
import { useOverlayNotes, useOverlayTags, useOverlayText } from 'api-hooks/overlay.hooks'
import { useTags } from 'api-hooks/general.hook'

interface OverlayDataSiderProps {
  overlayId: number
  documentId: number
  close: Function
}

const OverlayDataSiderProps = ({ overlayId, close, documentId }: OverlayDataSiderProps) => {
  const [text, setText] = useState('')
  const [note, setNote] = useState('')
  const [initialNote, setInitialNote] = useState('')
  const [edit, setEdit] = useState(false)

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
      const res = await axios.post('/overlay/content/' + overlayId, {
        text: text,
        overlayId: overlayId,
        documentId
      })

      if (!res.data.success) {
        message.error('error in updating content for the article')
        return
      }

      message.success('Upload done, Thank you for your efforts.')
      setEdit(false)
    } catch (err) {
      // message.error('An error has occurred')
    }
  }

  const updateOverlayNote = async () => {
    try {
      const res = await axios.post(`/overlay/note`, {
        text: note,
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

  if (!tags || !tagsData) return null

  const isLoading = isFetchingTags || isAttachingTag || isDetachingTag

  return (
    <div className={style.showTextDiv}>
      <div className={style.closeButton} onClick={() => close()} style={{ cursor: 'pointer', zIndex: 2 }}>
        <CloseCircleFilled style={{ fontSize: '35px' }} />
      </div>

      <Tabs defaultActiveKey="2" centered>
        {/* Notes panel */}
        <Tabs.TabPane tab="Notes" key="1">
          <div className={style.tabPanelBody}>
            <h2>Notes</h2>
            <div>{initialNote}</div>
            <div className={style.scroll}>
              {notesData?.notes?.map(({ text }, index) => (
                <div key={index} className={style.commentDiv}>
                  {String(text)}
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
                  placeholder={`هل لديك ملاحظه؟
هل لديك تصنيفات جديدة لاقتراحها؟`}
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
                Update
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
              value={tagsData?.map((tag) => tag.id)}
              tagRender={() => <> </>}
              optionFilterProp="children"
            >
              {tags?.map((tag: ITagInput) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
            <br />
            <br />
            <div>
              {tagsData?.map((tag) => (
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

            {edit ? (
              <Input.TextArea
                autoSize
                style={{
                  width: '95%',
                  fontSize: '20px'
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            ) : (
              <p
                style={{
                  width: '95%',
                  textAlign: 'justify',
                  fontSize: '20px'
                }}
              >
                {text}
              </p>
            )}
            {edit ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Button type="primary" size="large" onClick={() => updateArticleText()} style={{ marginTop: '10px' }}>
                  Update text
                </Button>
                <Button size="large" onClick={() => setEdit(false)} style={{ marginTop: '10px' }}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={() => setEdit(true)}
                style={{ margin: 'auto', marginTop: '10px' }}
              >
                Edit text
              </Button>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default OverlayDataSiderProps
