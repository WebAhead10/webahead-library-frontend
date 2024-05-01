import { MoreOutlined } from '@ant-design/icons'
import { Button, Tooltip, message } from 'antd'

export const historyTableColumns = ({ showModal, getDocumentIdAndRedirect }) => [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: 'Data ID',
    dataIndex: 'entity_id',
    render: (_, data) => (
      <Tooltip title={data.document_name}>
        <Button type="link" onClick={() => getDocumentIdAndRedirect(data)}>
          {data.entity_id}
        </Button>
      </Tooltip>
    )
  },
  {
    title: 'Operation',
    dataIndex: 'entity_change_operation'
  },
  {
    title: 'Type',
    dataIndex: 'entity_type'
  },
  {
    title: 'User',
    dataIndex: 'name'
  },
  {
    title: 'User Role',
    dataIndex: 'user_role'
  },
  {
    title: 'Date',
    render: (_, data) => (
      <span>{new Date(data.created_at).toDateString() + ' ' + new Date(data.created_at).toLocaleTimeString()}</span>
    )
  },
  {
    title: '',
    render: (_, data) => (
      <Button
        icon={<MoreOutlined />}
        shape="circle"
        onClick={() => {
          showModal(data.id)
        }}
      />
    )
  }
]
