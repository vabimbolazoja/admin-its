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
import config from '../../../config'
import { Pagination } from 'antd'
import axios from 'axios'
import moment from 'moment'

const getBadge = status => {
  switch (status) {
    case 'COMPLETED': return 'success'
    case 'ACCEPETED': return 'success'
    case 'PENDING': return 'warning'
    case 'FAILED': return 'danger'
    case 'REJECTED': return 'secondary'
    case 'CANCELLED	': return 'danger'

    default: return 'primary'
  }
}

const BidTransactions = (props) => {
 
  const [bidsData, setBidsData] = useState([])
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] =  useState("")
    const [bidStatusData, setBidStatusData] = useState ({});
    const userEmail = props.userEmail ?  props.userEmail : "";




    const getBidStatus = () => {
    axios
        .get(`${config.baseUrl}/api/v1/bid/statuses`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    })
    .then(res => {
        if (res.data) {
            setBidStatusData(res.data)
        }
    })
    .catch(err => {
        if (err) {}
    })
  }

  useEffect(() => {
    getBids()
    getBidStatus()
  }, [])


  const getPaged = queryString => {
    axios.get(`${config.baseUrl}/api/v1/admin/bids/all?${queryString}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 200) {
        setTotalItems(res.data.totalPages * 10)
        setBidsData(
          res.data.records.map(data => ({
            askReference: data.askReference,
            date:  moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
            reference: data.reference,
            username: data.username,
            bidAmount:data.bidCurrency === 'NGN'
            ? 'N'  + Intl.NumberFormat('en-US').format(data.bidAmount)
            : '$' + Intl.NumberFormat('en-US').format(data.bidAmount),
              
            bidStatus: data.bidStatus,
            paymentStatus: data.paymentStatus
          }))
        )
      }
    })
    .catch(err => {
      if (err) {
      }
    })
}


  const getBids = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/bids/all?pageNumber=1&pageSize=100&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress=${userEmail}&phoneNumber&startDate&endDate`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10)
          setBidsData(
            res.data.records.map(data => ({
              askReference: data.askReference,
              date:  moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              reference: data.reference,
              username: data.username,
              bidAmount:data.bidCurrency === 'NGN'
              ? 'N'  + Intl.NumberFormat('en-US').format(data.bidAmount)
              : '$' + Intl.NumberFormat('en-US').format(data.bidAmount),
                
              bidStatus: data.bidStatus,
              paymentStatus: data.paymentStatus
            }))
          )
        }
      })
      .catch(err => {
        if (err) {
        }
      })
  }


  const pagination = (page, pageSize) => {
    console.log(page)
    setPage(page)
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress=${userEmail}&phoneNumber&startDate&endDate`
    getPaged(queryString)
  }

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Bids By {userEmail}</CCardHeader>
          <CCardBody>
            <CDataTable
              items={bidsData}
              fields={[
                { key: 'askReference', name: 'Ask Ref' },
                { key: 'date', name: 'Date' },

                { key: 'reference', name: 'Bid Ref' },
                { key: 'username', name: 'Username' },
                { key: 'bidAmount', name: 'Bid Amount' },
                { key: 'bidStatus', name: 'Bid Status' },
                { key: 'paymentStatus', name: 'Payment Status' }
              ]}

              scopedSlots = {{
                'bidStatus':
                  (item)=>(
                    <td>
                      <CBadge color={getBadge(item.bidStatus)}>
                        {item.bidStatus}
                      </CBadge>
                    </td>
                  )
  
              },
              {
                'paymentStatus':
                  (item)=>(
                    <td>
                      <CBadge color={getBadge(item.paymentStatus)}>
                        {item.paymentStatus}
                      </CBadge>
                    </td>
                  )
  
              }

            
            }
             
            />
           <div className='text-center pagination-part'>
        <Pagination
          current={page}
          total={totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          defaultPageSize={100}
          onChange={pagination}
        />
      </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BidTransactions
