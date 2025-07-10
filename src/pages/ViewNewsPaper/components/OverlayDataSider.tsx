import React, { useState, useEffect } from 'react'
import axios from 'utils/axios'
import style from '../style.module.css'
import { Tabs, Button, Flex, Space } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'

import { message, Tag } from 'antd'
import { IUser } from 'types'
import { useOverlayNotes, useOverlayTags, useOverlayText } from 'api-hooks/overlay.hooks'
import { useTags } from 'api-hooks/general.hook'
import { useRecoilValue } from 'recoil'
import { userAtom } from 'utils/recoil/atoms'
import { FormattedMessage, useIntl } from 'react-intl'

interface OverlayDataSiderProps {
  overlayId: number
  documentId: number
  close: Function
}

const OverlayDataSider = ({ overlayId, close, documentId }: OverlayDataSiderProps) => {
  const [text, setText] = useState('')
  const [note, setNote] = useState('')
  const [initialNote, setInitialNote] = useState('')
  const user = useRecoilValue<IUser>(userAtom)
  const intl = useIntl();

  const {
    data: notesData = {
      mainNote: {
        text: ''
      },
      notes: []
    },
    refetch: refetchNotes
  } = useOverlayNotes(overlayId)

  const { data: textData, refetch: refetchText } = useOverlayText(overlayId)

  const { data: tagsData } = useOverlayTags(overlayId)

  const { data: tags } = useTags()

  useEffect(() => {
    setText(textData?.content)
  }, [textData])

  useEffect(() => {
    setInitialNote(notesData.mainNote?.text || '')
  }, [notesData])

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

  const removeArticleOwnership = async () => {
    try {
      const res = await axios.delete(`/overlay/user/ownership/${overlayId}`)

      if (!res.data.success) {
        console.log('error in adding note')
        return
      }

      message.success('Ownership removed successfully')

      refetchText()
    } catch (err) {
      message.error('An error has occurred')
    }
  }

  if (!tags || !tagsData) return null

  const isNoteEditAllow =
    (user.role === 'contributor' && user.permissions.includes('overlay-notes')) || user.role === 'admin'

  return (
    <div className={style.showTextDiv}>
      <div className={style.closeButton} onClick={() => close()} style={{ cursor: 'pointer', zIndex: 2 }}>
        <CloseCircleFilled style={{ fontSize: '35px' }} />
      </div>

      <Tabs defaultActiveKey="2" centered>
        {/* Notes panel */}
        <Tabs.TabPane tab={intl.formatMessage({ id: 'edit_article_page-comments' })} key="1">
          <div
            className={style.tabPanelBody}
            style={{
              height: user.role === 'admin' ? 'calc(100vh - 300px)' : 'calc(100vh - 170px)'
            }}
          >
            <h2><FormattedMessage id="edit_article_page-comments" /></h2>
            <div>{initialNote}</div>
            <div className={style.scroll}>
              {notesData?.notes?.map(({ text }, index) => (
                <div key={index} className={style.commentDiv}>
                  {String(text)}
                </div>
              ))}
            </div>
            {isNoteEditAllow ? (
              <div className="autocomplete-container" style={{ width: '100%' }}>
                <label>
                  <span className={style.addNote}><FormattedMessage id="edit_article_page-comments-adding-comment-title" /></span>
                  <textarea
                    rows={5}
                    cols={40}
                    value={note}
                    placeholder={intl.formatMessage({ id: 'edit_article_page-comments-hint' })}
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
                  <FormattedMessage id="general_text-submit" />
                </Button>
              </div>
            ) : (
              ''
            )}
          </div>
        </Tabs.TabPane>

        {/* Main panel */}
        <Tabs.TabPane tab={intl.formatMessage({ id: 'edit_article_page-content' })} key="2">
          {user.role === 'admin' ? (
            <Flex style={{ direction: 'ltr', padding: '20px 10px' }}>
              <Space style={{ direction: 'ltr', fontSize: '20px' }}>
                {/* <b style={{ direction: 'ltr' }}>Owner:</b> */}
                <span>{textData?.userName}</span>
              </Space>

              {textData?.userName ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    removeArticleOwnership()
                  }}
                  style={{ margin: 'auto', marginTop: '10px' }}
                >
                  Remove ownership
                </Button>
              ) : (
                ''
              )}
            </Flex>
          ) : (
            ''
          )}
          <div
            className={style.tabPanelBody}
            style={{
              height: user.role === 'admin' ? 'calc(100vh - 300px)' : 'calc(100vh - 220px)'
            }}
          >
            <div>
              {tagsData?.map((tag) => (
                <Tag style={{ fontSize: '20px', padding: '5px 10px' }}>{tag.name}</Tag>
              ))}
            </div>
            <br />

            <span className={style.overlayTitle}>{textData?.title}</span>

            <p className={style.text}>
              <div dangerouslySetInnerHTML={{ __html: text }} />
            </p>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default OverlayDataSider
