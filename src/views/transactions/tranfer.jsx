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
import config from '../../config'
import axios from 'axios'
import { Pagination } from 'antd'
import moment from "moment"
const Users = () => {
  const history = useHistory()
  const [TransferDatas, setTransferDatas] = useState([])
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] =  useState("")

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

  const getPaged = queryString => {
    axios.get(`${config.baseUrl}/api/v1/admin/transactions/transfer?${queryString}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 200) {
        setTotalItems(res.data.totalPages * 10)
        setTransferDatas(
          res.data.records.map(data => ({
            reference: data.reference,
            firstName: data.traderXUser.firstName,
            date:  moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
            lastName: data.traderXUser.lastName,
            emailAddress: data.traderXUser.emailAddress,
            amount:  data.currency === "NGN" ? "N" + Intl.NumberFormat("en-US").format(data.amount) : "$"  + Intl.NumberFormat("en-US").format(data.amount),
            provider: data.provider.replace('_', ' '),
            transactionStatus: data.transactionStatus,
            
            country: data.traderXUser.country.replace('_', ' ')
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
  const queryString = `pageNumber=${page}&pageSize=100`
  getPaged(queryString)
}

  

  useEffect(() => {
    getTransfers()
  }, [])

  const getTransfers = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/transfer?pageNumber=1&pageSize=100`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
        
          setTransferDatas(
            res.data.records.map(data => ({
              reference: data.reference,
              firstName: data.sender.firstName,
              lastName: data.sender.lastName,
              emailAddress: data.sender.emailAddress,
              date:  moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              BeneficiaryfirstName: data.beneficiary.firstName,
              BeneficiarylastName: data.beneficiary.lastName,
              BeneficiaryemailAddress: data.beneficiary.emailAddress,
              amount:  data.currency === "NGN" ? "N" + Intl.NumberFormat("en-US").format(data.amount) : "$"  + Intl.NumberFormat("en-US").format(data.amount),
              transactionStatus: data.transactionStatus,
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
          <CCardHeader>Transfer Transactions</CCardHeader>
          <CCardBody>
            <CDataTable
              items={TransferDatas}
              fields={[
                { key: 'reference', name: 'Transaction ID' },
                { key: 'date', name: 'Date' },
                { key: 'firstName', name: 'First Name' },
                { key: 'lastName', name: 'Last Name' },
                { key: 'emailAddress', name: 'Email Address' },
                { key: 'BeneficiaryfirstName', name: 'Beneficiary First Name'},
                { key: 'BeneficiarylastName', name: 'Beneficiary Last Name' },
                { key: 'BeneficiaryemailAddress', name: 'Beneficiary Email' },
                { key: 'amount', name: 'Amount' },
                { key: 'transactionStatus', name: 'Transaction Status' },
              ]}
              hover
              striped
              itemsPerPage={5}
              activePage={page}
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

export default Users
