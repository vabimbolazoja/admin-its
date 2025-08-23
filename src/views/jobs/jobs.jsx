import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CAlert,
  CRow,
  CButton,
  CPagination
} from '@coreui/react'
import config from '../../config'
import {Modal} from "antd"
import axios from 'axios'

const Users = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [load, setLoad] =useState(false)
  const [JobDatas, setJobDatas] = useState([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [msg,setMsg] = useState("")


  const getBadge = status => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'FAILED':
        return 'secondary'
      case 'Pending':
        return 'warning'
      case 'FAILED':
        return 'danger'
      default:
        return 'primary'
    }
  }

  

  useEffect(() => {
    getJobs()
  }, [])

  const getJobs = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/jobs`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        if (res.data) {
          console.log(JobDatas)
          setJobDatas(
            res.data.map(data => ({
              name: data.name,
              group: data.group,
              nextFireFrame: data.nextFireTime,
              previousFireFrame: data.previousFireTime,
              startTime: data.startTime,
              mayFireAgain: data.mayFireAgain ? "YES": "NO",
              triggerState: data.triggerState,
              
            }))
          )

        }
      })
      .catch(err => {
        if (err) {
        }
      })
  }

  const changeStatusConfirmPause = (id, e) => {
    e.preventDefault()
    Modal.confirm({
      title: `Are you sure you want to pause this job ?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        pause(id)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  const changeStatusConfirmResume = (id, e) => {
    e.preventDefault()
    Modal.confirm({
      title: `Are you sure you want to resume this job ?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        resume(id)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  const pause = (id, e) => {
    console.log(id)
    setLoad(true)
    axios
      .post(`${config.baseUrl}/api/v1/admin/jobs/${id.group}/pause?keyName=${id.name}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      .then(res => {
        setLoad(false)
        if (res.status === 200) {
          setSuccess(true)
          setMsg("Job Paused Successfully")
          setError(false)
          getJobs()
        }
      })
      .catch(err => {
        setLoad(false)
        if (err.response !== undefined) {
          setMsg(err.response.data.message)
          setError(true)
          setSuccess(false)
        } else {
          setMsg('Connection Error')
          setError(true)
          setSuccess(false)
        }
      })
  }

  const resume = (id, e) => {
    console.log(id)
    setLoad(true)
    axios
      .post(`${config.baseUrl}/api/v1/admin/jobs/${id.group}/resume?keyName=${id.name}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      .then(res => {
        setLoad(false)
        if (res.status === 200) {
          setSuccess(true)
          setMsg("JOb Resumed Successfully")
          setError(false)
          getJobs()
        }
      })
      .catch(err => {
        setLoad(false)
        if (err.response !== undefined) {
          setMsg(err.response.data.message)
          setError(true)
          setSuccess(false)
        } else {
          setMsg('Connection Error')
          setError(true)
          setSuccess(false)
        }
      })
  }



  return (
    <CRow>
      <CCol>
        {success &&
      <CAlert color="success">
                {msg}
              </CAlert>}
              {error &&
      <CAlert color="danger">
                {msg}
              </CAlert>}
        <CCard>
          <CCardHeader>Jobs</CCardHeader>
          <CCardBody>
            <CDataTable
              items={JobDatas}
              fields={[
                { key: 'name', name: 'Name' },
                { key: 'group', name: 'Group' },
                { key: 'nextFireFrame', name: 'Next Fire Time' },
                { key: 'previousFireFrame', name: 'Previous Fire Time ' },
                { key: 'startTime', name: 'Start Time'},
                { key: 'mayFireAgain', name: 'May Fire Again' },
                { key: 'triggerState', name: 'Trigger State' },
                {
                  key: 'Actions',
                  name: 'Actions',
                 
                }
              ]}
              
              scopedSlots={{
                Actions: item => (
                  <td className='d-flex justify-content-between align-items-center'>
                    <button type="button" class="btn btn-danger" onClick={changeStatusConfirmPause.bind(this, item)}>Pause</button>
                    <button type="button" class="btn btn-success" onClick={changeStatusConfirmResume.bind(this, item)}>Resume</button>

                  
                  </td>
                )
              }}
           
              clickableRows
            />
           
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
