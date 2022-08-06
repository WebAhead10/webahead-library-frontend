import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

const History = () => {
  const [typeOfNotesState, setTypeOfNotesState] = useState('note')
  const [historyData, setHistoryData] = useState<any>([])

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/history/${typeOfNotesState}`)
      .then((res) => {
        setHistoryData(res.data.data)
      })
      .catch(console.log)
    //in this part should select the right username/email by user kind  admin/user/advanced
  }, [typeOfNotesState])

  return (
    <div>
      <Tabs
        defaultIndex={0}
        onSelect={(index) => {
          //   console.log(typeOfNotesState)
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
        <table>
          <thead>
            <th>ID</th>
            <th>Data ID</th>
            <th>Operation</th>
            <th>User</th>
            <th>User Roll</th>
            <th>New Data</th>
            <th>Date of Change</th>
          </thead>
          <tbody>
            {historyData.length ? (
              historyData.map((historyRow: any) => (
                <tr>
                  <td>{historyRow.id}</td>
                  <td>{historyRow.data_id}</td>
                  {/*in this part should select the right username/email by user kind  admin/user/advanced*/}
                  <td>{historyRow.operation}</td>
                  <td>{historyRow.entityId}</td>
                  <td>{historyRow.user_roll}</td>
                  <td>{historyRow.change_data}</td>
                  <td>{new Date(historyRow.created_at).toDateString()}</td>
                </tr>
              ))
            ) : (
              <h1>No Records</h1>
            )}
          </tbody>
        </table>
      </Tabs>
    </div>
  )
}

export default History
