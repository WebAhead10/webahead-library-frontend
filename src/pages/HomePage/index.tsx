import { useEffect, useState } from 'react'
import MainCategorySquare from '../../components/MainCategorySquare'
import axios from 'utils/axios'
import style from './style.module.css'
import { IMainCategory, ITagInput } from 'types'
import { useRecoilState } from 'recoil'
import { documentSearchAtom } from 'utils/recoil/atoms'
import { IDocumentSearch } from 'utils/recoil/types'
import { useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Row, Col, Select, Form, Input, Divider, Button, Card, Typography, message } from 'antd'

const { Text } = Typography

function HomePage() {
  const [documentSearch, setDocumentSearch] = useRecoilState<IDocumentSearch>(documentSearchAtom)
  const [filteredArticles, setFilteredArticles] = useState([])
  const history = useHistory()
  const [form] = Form.useForm()

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
    const res = await axios.post(`/overlays/all/search`, filters)
    return res.data
  })

  useEffect(() => {
    // get the filters from the url
    const urlParams = new URLSearchParams(window.location.search)
    const filters = Object.fromEntries(urlParams.entries()) as any

    filters.tags = filters.tags ? filters.tags.split(',').map((tag: string) => parseInt(tag)) : []

    if (filters.title || filters.tags.length) {
      form.setFieldsValue(filters)
      mutate(filters, {
        onSuccess: ({ data }) => {
          setFilteredArticles(data)
        }
      })
    }
  }, [mutate, form])

  if (!categories || !tags) {
    return <span>Loading</span>
  }

  return (
    <Row wrap>
      <Col span={24} style={{ marginTop: '20px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            values.title = values.title || ''
            values.tags = values.tags || []

            // add the filters to the url
            window.history.pushState({}, '', `?${new URLSearchParams(values).toString()}`)

            if (Object.values(values).filter((x) => x).length) {
              mutate(values, {
                onSuccess: ({ data }) => {
                  setFilteredArticles(data)

                  if (!data.length) {
                    message.warning('لا توجد نتائج')
                  }
                }
              })
            }
          }}
        >
          <Row justify="center" align="bottom" wrap style={{ margin: '0 120px' }}>
            <Col span={6}>
              <Form.Item label="وسوم" name="tags">
                <Select mode="tags" loading={isLoading} optionFilterProp="children">
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

      {filteredArticles.length ? (
        <Col span={24}>
          <Row
            wrap
            justify="start"
            style={{
              padding: '0 40px'
            }}
          >
            {filteredArticles.map((article: any, index) => (
              <Col span={4} key={index}>
                <Card
                  style={{
                    borderColor: 'black',
                    cursor: 'pointer',
                    margin: '4px'
                  }}
                  onClick={() => {
                    try {
                      const coords = JSON.parse(article.coords)

                      const coordsIds = coords.map((coord: any) => coord.id.replace('overlay_', '')).join('$')
                      history.push(`/view/newspaper/${article.documentid}?coords=${coordsIds}`)
                    } catch (error) {
                      message.error('لا يمكن فتح هذا المقال')
                    }
                  }}
                >
                  <Text strong>{article.title || 'بدون عنوان'}</Text>
                </Card>
              </Col>
            ))}
          </Row>
          <Col span={24}>
            <Divider />
          </Col>
        </Col>
      ) : (
        ''
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
