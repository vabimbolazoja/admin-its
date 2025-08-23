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
import axios from 'axios'
import {Pagination} from "antd"
import moment from "moment"

const WithdrawalTransactions = (props) => {
  const history = useHistory()
  const [depositDatas, setDepositDatas] = useState([])
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] =  useState("")
  const userEmail = props.userEmail ?  props.userEmail : "";

  

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
    getUsers()
  }, [])

  const getUsers = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/withdrawal?pageNumber=1&pageSize=100&emailAddress=${userEmail}`,
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
              reference: data.reference,
              date:  moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              accName:data.accountName,
              accNum:data.accountNumber,
              bank: data.bankName,
             
              emailAddress: data.traderXUser.emailAddress,
              amount:  data.currency === "NGN" ? "N" + Intl.NumberFormat("en-US").format(data.amount) : "$"  + Intl.NumberFormat("en-US").format(data.amount),
              provider: data.provider.replace('_', ' '),
              transactionStatus: data.transactionStatus,
              country: data.traderXUser.country.replace('_', ' '),

            }))
          )
        }
      })
      .catch(err => {
        if (err) {
        }
      })
  }
  const getPaged = queryString => {
    axios.get(`${config.baseUrl}/api/v1/admin/transactions/withdrawal?${queryString}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 200) {
        setTotalItems(res.data.totalPages * 10)
        setDepositDatas(
          res.data.records.map(data => ({
            reference: data.reference,
            date:  moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
            accName:data.accountName,
            accNum:data.accountNumber,
            bank: data.bankName,
            
            emailAddress: data.traderXUser.emailAddress,
            amount:  data.currency === "NGN" ? "N" + Intl.NumberFormat("en-US").format(data.amount) : "$"  + Intl.NumberFormat("en-US").format(data.amount),
            provider: data.provider.replace('_', ' '),
            transactionStatus: data.transactionStatus,
            country: data.traderXUser.country.replace('_', ' '),
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
  const queryString = `pageNumber=${page}&pageSize=10&emailAddress=${userEmail}`
  getPaged(queryString)
}
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Withdrawal Transactions By {userEmail}</CCardHeader>
          <CCardBody>
            <CDataTable
              items={depositDatas}
              fields={[
                { key: 'reference', name: 'Transaction ID' },
                { key: 'date', name: 'Transaction Date' },
                { key: 'accName', name: 'Account Name' },
                { key: 'accNum', name: 'Account Number' },
                { key: 'bank', name: 'Bank' },
                { key: 'emailAddress', name: 'Email Address' },
                { key: 'amount', name: 'Amount' },
                { key: 'provider', name: 'Provider' },
                { key: 'transactionStatus', name: 'Transaction Status' },
                { key: 'country', name: 'Country' }
              ]}
              
              scopedSlots={{
                transactionStatus: item => (
                  <td>
                    <CBadge color={getBadge(item.transactionStatus)}>
                      {item.transactionStatus}
                    </CBadge>
                  </td>
                )
              }}
              clickableRows
            />
                 <div className='text-center pagination-part'>
        <Pagination
          current={page}
          total={totalItems}
          defaultPageSize={100}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={pagination}
        />
      </div>
        
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default WithdrawalTransactions
