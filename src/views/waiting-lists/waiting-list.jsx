import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'
import config from "../../config"
import axios from 'axios'
import moment from 'moment'
import { Pagination } from 'antd'
const Users = () => {
  const history = useHistory()
  const [usersData, setUserData] =  useState([])
  const [totalItems, setTotalItems] =  useState("")
  const [page, setPage] = useState(1)



  const pagination = (page, pageSize) => {
    console.log(page)
    setPage(page)
    const queryString = `pageNumber=1&pageSize=10&fullName&emailAddress&phoneNumber&startDate&endDate`
    getPaged(queryString)
  }


  useEffect(() => {
    getUsers()
  }, [])
  const getPaged = queryString => {
    axios.get(`${config.baseUrl}/api/v1/admin/wait-list/all?${queryString}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 200) {
        setTotalItems(res.data.totalPages * 10)
        setUserData(res.data.records)

      }
    })
    .catch(err => {
      if (err) {
      }
    })
}
  const getUsers = () => {
    axios.get(`${config.baseUrl}/api/v1/admin/wait-list/all?pageNumber=1&pageSize=10&fullName&emailAddress&phoneNumber&startDate&endDate`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 200) {
        setUserData(res.data.records)
        
      }
    })
    .catch(err => {
      if (err) {
      }
    })
  }

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            Waiting Lists
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={usersData}
            fields={[
              { key: 'fullName',name: "Full Name",   },
              { key: 'emailAddress',name: "Email Address",  },
              { key: 'phoneNumber',name: "Phone Number",  },
              { key: 'hasBeenContacted',name: "Contacted",  },
            ]}
        
          
          />
            <div className='text-center pagination-part'>
        <Pagination
          current={page}
          total={totalItems}
          defaultPageSize={10}
          onChange={pagination}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}

        />
      </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
