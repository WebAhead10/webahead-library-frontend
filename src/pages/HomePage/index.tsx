import { useState, useEffect } from 'react'
import MainCategorySquare from '../../components/MainCategorySquare'
import axios from 'utils/axios'
import style from './style.module.css'
import { IMainCategory, ITagInput } from 'types'
import { useRecoilState } from 'recoil'
import { documentSearchAtom } from 'utils/recoil/atoms'
import { IDocumentSearch } from 'utils/recoil/types'
import { useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Row, Col, Select, Form, Input, Divider, Carousel, Button, Card, Typography } from 'antd'

const { Text } = Typography

function HomePage() {
  const [documentSearch, setDocumentSearch] = useRecoilState<IDocumentSearch>(documentSearchAtom)
  const [filteredDocuments, setFilteredDocuments] = useState([])
  const history = useHistory()

  const { data: categories } = useQuery(['categories'], async () => {
    const res = await axios.get('/categories')
    return res.data.categories
  })

  const { data: tags, isLoading } = useQuery(['tags'], async () => {
    const res = await axios.get(`/tag/all`)
    return res.data.data
  })

  // by default is not enabled and takes the filters from the form below
  const { mutate } = useMutation(['all-documents'], async (filters: IDocumentSearch) => {
    const res = await axios.post(`/documents/all/search`, filters)
    return res.data
  })

  if (!categories || !tags) {
    return <span>Loading</span>
  }

  return (
    <Row wrap>
      <Col span={24} style={{ marginTop: '20px' }}>
        <Form
          layout="vertical"
          onFinish={(values) => {
            console.log(Object.values(values).filter((x) => x))
            if (Object.values(values).filter((x) => x).length) {
              mutate(values, {
                onSuccess: ({ data }) => {
                  setFilteredDocuments(data)
                }
              })
            }
          }}
        >
          <Row justify="center" align="bottom" wrap style={{ margin: '0 120px' }}>
            <Col span={6}>
              <Form.Item label="تاغس" name="tags">
                <Select mode="tags" loading={isLoading}>
                  {tags.map((tag: ITagInput) => (
                    <Select.Option key={tag.id} value={tag.id}>
                      {tag.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <Form.Item label="عنوان" name="title">
                <Input />
              </Form.Item>
            </Col>

            {/* make a category dropdown list for the filter */}
            <Col span={6} offset={1}>
              <Form.Item label="تصنيف" name="categoryId">
                <Select>
                  {categories.map((category: IMainCategory) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col offset={1}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  بحث
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Col span={24}>
          <Divider />
        </Col>
      </Col>

      {filteredDocuments.length && (
        <Col span={24}>
          <Row wrap justify="space-around">
            {filteredDocuments.map((document: any) => (
              <Col span={4} key={document.id}>
                <Card
                  style={{
                    borderColor: 'black',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    history.push(`/view/newspaper/${document.id}`)
                  }}
                >
                  <Text strong>{document.name || 'بدون عنوان'}</Text>
                </Card>
              </Col>
            ))}
          </Row>
          <Col span={24}>
            <Divider />
          </Col>
        </Col>
      )}

      <Col span={24}>
        <div className={style['news-container']}>
          {categories.map((category: IMainCategory, index: number) => (
            <MainCategorySquare
              name={category.name}
              style={{
                objectFit: (index + 1) % 4 === 0 ? 'cover' : 'fill',
                background: (index + 1) % 5 === 0 ? 'white' : ''
              }}
              logo={category.logo}
              key={category.id}
              onClick={() => {
                if (category.viewType === 'calendar') {
                  history.push(`/choose/year-month/${category.id}`)
                } else if (category.viewType === 'list') {
                  history.push(`/list/${category.id}`)
                }

                setDocumentSearch({ ...documentSearch, categoryId: category.id })
              }}
            />
          ))}
        </div>
      </Col>
    </Row>
  )
}

export default HomePage
