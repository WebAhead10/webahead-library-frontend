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
                <td>{historyRow.entity_id}</td>
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
