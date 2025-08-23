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
} from '@coreui/react'
import config from '../../../config'
import { Pagination } from 'antd'
import axios from 'axios'
import moment from 'moment'

const DepositTransactions = (props) => {
  const history = useHistory()
 
  const [page, setPage] = useState(1)
  const [depositDatas, setDepositDatas] = useState([])
  const [totalItems, setTotalItems] =  useState("")
  const userEmail = props.userEmail ?  props.userEmail : "";



  const getBadge = status => {
    switch (status) {
      case 'COMPLETED': return 'success'
      case 'FAILED': return 'secondary'
      case 'Pending': return 'warning'
      case 'FAILED': return 'danger'
      default: return 'primary'
    }
  }


  const getPaged = queryString => {
    axios.get(`${config.baseUrl}/api/v1/admin/transactions/fund-wallet?${queryString}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 200) {
        setTotalItems(res.data.totalPages * 10)
        setDepositDatas(
          res.data.records.map(data => ({
              transactionId: data.transactionId,
              date:  moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              firstName: data.traderXUser.firstName,
            lastName: data.traderXUser.lastName,
            emailAddress: data.traderXUser.emailAddress,
            amount:  data.currency === "NGN" ? "N" + Intl.NumberFormat("en-US").format(data.amount) : "$"  + Intl.NumberFormat("en-US").format(data.amount),
            provider: data.provider.replace('_', ' '),
            transactionStatus: data.transactionStatus,
            platformFeePaid: data.traderXUser.platformFeePaid ? "YES" : "NO",
            country: data.traderXUser.country.replace("_", " ")

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
  const queryString = `pageNumber=${page}&pageSize=${pageSize}&emailAddress=${userEmail}`
  getPaged(queryString)
}

  
 

  useEffect(() => {
    getDeposits()
  }, [])

  const getDeposits = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/fund-wallet?pageNumber=1&pageSize=100&emailAddress=${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10)
          setDepositDatas(
            res.data.records.map(data => ({
                transactionId: data.transactionId,
                date:  moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
                firstName: data.traderXUser.firstName,
              lastName: data.traderXUser.lastName,
              emailAddress: data.traderXUser.emailAddress,
              amount:  data.currency === "NGN" ? "N" + Intl.NumberFormat("en-US").format(data.amount) : "$"  + Intl.NumberFormat("en-US").format(data.amount),
              provider: data.provider.replace('_', ' '),
              transactionStatus: data.transactionStatus,
              platformFeePaid: data.traderXUser.platformFeePaid ? "YES" : "NO",
              country: data.traderXUser.country.replace("_", " ")

            }))
          )
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
          <CCardHeader>Deposit Transactions By {userEmail}</CCardHeader>
          <CCardBody>
            <CDataTable
              items={depositDatas}
              fields={[
                { key: 'transactionId', name: 'Transaction ID' },
                { key: 'date', name: 'Transaction Date' },
                { key: 'firstName', name: 'First Name' },
                { key: 'lastName', name: 'Last Name' },
                { key: 'emailAddress', name: 'Email Address' },
                { key: 'amount', name: 'Amount' },
                { key: 'provider', name: 'Provider' },
                { key: 'transactionStatus', name: 'Transaction Status' },
                { key: 'platformFeePaid', name: 'Platform Fee Paid' },
                { key: 'country', name: 'Country' }

                
              ]}
           
              scopedSlots = {{
                'transactionStatus':
                  (item)=>(
                    <td>
                      <CBadge color={getBadge(item.transactionStatus)}>
                        {item.transactionStatus}
                      </CBadge>
                    </td>
                  )

              }}
            />
               <div className='text-center pagination-part'>
        <Pagination
          current={page}
          total={totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          defaultPageSize={10}
          onChange={pagination}
        />
      </div>
            
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DepositTransactions
