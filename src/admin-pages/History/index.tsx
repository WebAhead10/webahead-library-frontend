import React, { useState } from 'react'
import axios from 'utils/axios'
import { Button, Card, Col, Form, Input, Modal, Row, Space, Table } from 'antd'
import { historyTableColumns } from './config'
import { useQuery } from '@tanstack/react-query'

const History = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [historyItem, setHistoryItem] = useState({} as any)
  const [page, setPage] = useState(0)
  const [form] = Form.useForm()
  const [filters, setFilters] = useState({
    userName: '',
    documentName: ''
  })

  const { data, isLoading, error } = useQuery(
    ['history', page, filters.userName, filters.documentName],
    async () => {
      const res = await axios.get(
        `/history/all?page=${page}&userName=${filters.userName}&documentName=${filters.documentName}`
      )
      return res.data
    },
    {
      keepPreviousData: true
    }
  )

  const showModal = (id: number) => {
    const hIndex = data.history.findIndex((historyRow: any) => historyRow.id === id)

    setHistoryItem(data.history[hIndex])
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const getDocumentIdAndRedirect = async (historyRow: any) => {
    try {
      if (historyRow.entity_type === 'tag' || historyRow.entity_type === 'note') {
        const parsedBody = JSON.parse(historyRow.req_body)
        const overlayId = parsedBody.overlayId

        const res = await axios.get(`/document-get-id/overlay/${overlayId}`)
        const coordsRes = await axios.get(`/coords-get-id/overlay/${overlayId}`)

        const documentId = res.data.documentId
        const coordsId = JSON.parse(coordsRes.data.coords || '[]')
          .map((coord: any) => coord.id.replace('overlay_', ''))
          .join('$')

        window.open(`/view/newspaper/${documentId}?coords=${coordsId}`, '_blank')
      } else if (historyRow.entity_type === 'overlay_text') {
        const overlayId = historyRow.entity_id

        const res = await axios.get(`/coords-get-id/overlay/${overlayId}`)

        const coordsId = JSON.parse(res.data.coords || '[]')
          .map((coord: any) => coord.id.replace('overlay_', ''))
          .join('$')

        window.open(`/view/newspaper/${res.data.documentId}?coords=${coordsId}`, '_blank')
      } else if (historyRow.entity_type === 'overlay_cut') {
        const parsedBody = JSON.parse(historyRow.req_body)
        const overlays = parsedBody.overlays
        const documentId = historyRow.entity_id
        const overlayIds = overlays.map((overlay: any) => overlay.id.replace('overlay_', ''))
        // connect the ids with & between them
        const overlayIdsString = overlayIds.join('$')
        window.open(`/view/newspaper/${documentId}?coords=${overlayIdsString}`, '_blank')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Card>
        <Form layout="vertical" form={form}>
          <Row align="bottom">
            <Col span={6}>
              <Form.Item
                label="User name"
                style={{
                  marginBottom: 0
                }}
              >
                <Input
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      userName: e.target.value
                    })
                  }}
                  value={filters.userName}
                />
              </Form.Item>
            </Col>
            <Col offset={1} span={6}>
              <Form.Item
                label="Document Name"
                style={{
                  marginBottom: 0
                }}
              >
                <Input
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      documentName: e.target.value
                    })
                  }}
                  value={filters.documentName}
                />
              </Form.Item>
            </Col>

            <Col offset={1} span={4}>
              <Space>
                <Button
                  type="ghost"
                  onClick={() => {
                    setFilters({
                      userName: '',
                      documentName: ''
                    })
                  }}
                >
                  Clear
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <br />

      <Table
        loading={isLoading}
        columns={historyTableColumns({ showModal, getDocumentIdAndRedirect })}
        dataSource={data?.history}
        pagination={{
          onChange: (page) => {
            setPage(page - 1)
          },
          pageSize: 10,
          total: data?.total
        }}
      />

      {historyItem && (
        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          {Object.keys(historyItem) && <span>{historyItem.req_body}</span>}
        </Modal>
      )}
    </div>
  )
}

export default History
