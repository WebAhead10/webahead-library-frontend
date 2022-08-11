import React, { useState, useEffect } from 'react'
import axios from 'utils/axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { Button, Modal } from 'antd'

const History = () => {
  const [typeOfNotesState, setTypeOfNotesState] = useState('note')
  const [historyData, setHistoryData] = useState<any>([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    axios
      .get(`/history/${typeOfNotesState}`)
      .then((res) => {
        setHistoryData(res.data.data)
      })
      .catch(console.log)
    //in this part should select the right username/email by user kind  admin/user/advanced
  }, [typeOfNotesState])

  const showModal = () => {
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
      <Tabs
        defaultIndex={0}
        onSelect={(index) => {
          if (index === 0) {
            setTypeOfNotesState('note')
          } else if (index === 1) {
            setTypeOfNotesState('tag')
          } else if (index === 2) {
            setTypeOfNotesState('overlay_text')
          } else if (index === 3) {
            setTypeOfNotesState('overlay_devide')
          } else {
            setTypeOfNotesState('all')
          }
        }}
      >
        <TabList>
          <Tab>Notes</Tab>
          <Tab>Tags</Tab>
          <Tab>Overlay Text</Tab>
          <Tab>Overlay Devide</Tab>
          <Tab>All</Tab>
        </TabList>
        <table style={{ width: '90%', margin: 'auto' }}>
          <thead>
            <th>ID</th>
            <th>Data ID</th>
            <th>Operation</th>
            <th>User</th>
            <th>User Role</th>
            <th>New Data</th>
            <th>Date of Change</th>
          </thead>
          <tbody>
            {historyData.length ? (
              historyData.map((historyRow: any) => (
                <tr>
                  <td>{historyRow.id}</td>
                  <td>{historyRow.entity_id}</td>
                  {/*in this part should select the right username/email by user kind  admin/user/advanced*/}
                  <td>{historyRow.entity_change_operation}</td>
                  <td>{historyRow.user_id}</td>
                  <td>{historyRow.user_role}</td>
                  <td>
                    <Button type="link" onClick={showModal}>
                      Click to show
                    </Button>
                  </td>
                  <td>{new Date(historyRow.created_at).toDateString()}</td>
                </tr>
              ))
            ) : (
              <h1>No Records</h1>
            )}
          </tbody>
        </table>

        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          {historyData[0] && <span>{JSON.parse(historyData[0].req_body).text}</span>}
        </Modal>
      </Tabs>
    </div>
  )
}

export default History
