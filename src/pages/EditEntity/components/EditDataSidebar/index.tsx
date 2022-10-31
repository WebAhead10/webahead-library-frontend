import { useEffect, useState } from 'react'
import style from './style.module.css'
import { DeleteFilled, PlusCircleOutlined, FileAddOutlined } from '@ant-design/icons'
import axios from 'utils/axios'
import { Modal, Form, Input, Row, Col, Select, Collapse, message } from 'antd'
import { ITagInput } from 'types'
import { useMutation, useQuery } from '@tanstack/react-query'

const { Panel } = Collapse

interface EditDataSidebarProps {}

const EditDataSidebar = ({}: EditDataSidebarProps) => {
  return <div className={style.articleSidebar}>1</div>
}

export default EditDataSidebar
