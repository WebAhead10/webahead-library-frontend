import React, { useState, useEffect } from 'react'
import axios from 'utils/axios'
import { Button, Modal } from 'antd'

const History = () => {
  const [typeOfNotesState, setTypeOfNotesState] = useState('all')
  const [historyData, setHistoryData] = useState<any>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [historyIndex, setHistoryIndex] = useState(0)

  useEffect(() => {
    axios
      .get(`/history/${typeOfNotesState}`)
      .then((res) => {
        setHistoryData(res.data.data)
      })
      .catch(console.log)
    //in this part should select the right username/email by user kind  admin/user/advanced
  }, [typeOfNotesState])

  const showModal = (index: number) => {
    setHistoryIndex(index)

    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const getDocumentIdAndRedirect = async (historyRow: any, hIndex: number) => {
    try {
      if (historyRow.entity_type === 'tag' || historyRow.entity_type === 'note') {
        const parsedBody = JSON.parse(historyData[hIndex].req_body)
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
        const parsedBody = JSON.parse(historyData[hIndex].req_body)
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
      {/* if (index === 0) {
            setTypeOfNotesState('note')
          } else if (index === 1) {
            setTypeOfNotesState('tag')
          } else if (index === 2) {
            setTypeOfNotesState('overlay_text')
          } else if (index === 3) {
            setTypeOfNotesState('overlay_devide')
          } else {
            setTypeOfNotesState('all')
          } */}
      <table style={{ width: '95%', margin: 'auto' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data ID</th>
            <th>Operation</th>
            <th>Type</th>
            <th>User</th>
            <th>User Role</th>
            <th>New Data</th>
            <th>Date of Change</th>
          </tr>
        </thead>
        <tbody>
          {historyData.length ? (
            historyData.map((historyRow: any, index: number) => (
              <tr key={index}>
                <td>{historyRow.id}</td>
                <td>
                  <a
                    onClick={() => {
                      getDocumentIdAndRedirect(historyRow, index)
                    }}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {historyRow.entity_id}
                  </a>
                </td>
                {/*in this part should select the right username/email by user kind  admin/user/advanced*/}
                <td>{historyRow.entity_change_operation}</td>
                <td>{historyRow.entity_type}</td>
                <td>{historyRow.name}</td>
                <td>{historyRow.user_role}</td>
                <td>
                  <Button type="link" onClick={() => showModal(index)}>
                    Click to show
                  </Button>
                </td>
                <td>
                  {new Date(historyRow.created_at).toDateString() +
                    ' ' +
                    new Date(historyRow.created_at).toLocaleTimeString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td> No Records</td>
            </tr>
          )}
        </tbody>
      </table>

      {Number.isInteger(historyIndex) && (
        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          {historyData[historyIndex] && <span>{historyData[historyIndex].req_body}</span>}
        </Modal>
      )}
    </div>
  )
}

export default History
