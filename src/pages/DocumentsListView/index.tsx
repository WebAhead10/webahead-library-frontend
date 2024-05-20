import style from './style.module.css'
import { Select, Typography, Row, Col, Card, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axios from 'utils/axios'
import { useHistory, useParams } from 'react-router-dom'
import { IDocument, ITagInput } from 'types'
import { useState } from 'react'
const { Text } = Typography

const DocumentsListView = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const history = useHistory()
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  const { data: documents } = useQuery(['documents'], async () => {
    const res = await axios.get(`/document/list-view/${categoryId}`)
    return res.data
  })

  const { data: tags } = useQuery(['tags'], async () => {
    const res = await axios.get(`/tag/all`)
    return res.data.data
  })

  const handleTagsChange = (value: number[]) => {
    setSelectedTags(value)
  }

  if (!tags || !documents) {
    return <span>Loading</span>
  }

  return (
    <div
      style={{
        minHeight: '100vh'
      }}
    >
      <div className={style.topForm}>
        <div className={style.inputContainer}>
          <Text className={style.inputLabel}>وسوم:</Text>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            className={style.tagsSelect}
            size="large"
            dropdownStyle={{
              borderRadius: '8px'
            }}
            onChange={handleTagsChange}
          >
            {tags?.map((tag: ITagInput) => (
              <Select.Option key={tag.id} value={tag.id}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      <br />
      <br />
      <Row justify="end" style={{ width: '98%' }}>
        {documents?.data
          .filter((document: IDocument) => {
            if (selectedTags.length === 0) {
              return true
            }

            return document.tags.some((tag) => selectedTags.includes(tag.id))
          })
          .map((document: IDocument) => (
            <Col span={4} offset={1}>
              <Card
                style={{
                  borderColor: 'black',
                  cursor: 'pointer'
                  //   boxShadow: '0 8px 16px 0 rgb(0 0 0 / 40%)'
                }}
                onClick={() => {
                  history.push(`/view/newspaper/${document.id}`)
                }}
                title={document.tags.length ? document.name || 'بدون عنوان' : undefined}
              >
                {/* use the document.tags to show the tags */}
                {document.tags.length ? (
                  <div>
                    {document.tags.map((tag: ITagInput) => (
                      <Tag>{tag.name}</Tag>
                    ))}
                  </div>
                ) : (
                  <Text strong>{document.name || 'بدون عنوان'}</Text>
                )}
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  )
}

export default DocumentsListView
