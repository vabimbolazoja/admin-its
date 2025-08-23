import React, {useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CFormGroup,
  CSelect,
  CLabel,
  CPagination,
} from '@coreui/react';
import config from '../../../config';
import axios from 'axios';
import moment from 'moment';
import {Pagination} from 'antd';

const getBadge = status => {
  switch (status) {
    case 'FULFILLED':
      return 'success';
    case 'PARTLY_FULFILLED':
      return 'secondary';
    case 'CANCELLED':
      return 'danger';
    default:
      return 'primary';
  }
};


const AskTransactions = (props) => {
  const [usersData, setUserData] = useState ([]);
  const [page, setPage] = useState (1);
  const [totalItems, setTotalItems] = useState ('');
  const [askStatusData, setAskStatusData] = useState ({});
  const userEmail = props.userEmail ?  props.userEmail : "";







  const getPaged = queryString => {
    axios
      .get (`${config.baseUrl}/api/v1/admin/asks/all?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem ('token')}`,
        },
      })
      .then (res => {
        if (res.status === 200) {
          setTotalItems (res.data.totalPages * 10);
          setUserData (
            res.data.records.map (data => ({
              reference: data.reference,

              haveAmount: data.haveCurrency === 'NGN'
                ? 'N' + Intl.NumberFormat ('en-US').format (data.haveAmount)
                : '$' + Intl.NumberFormat ('en-US').format (data.haveAmount),

              needAmount: data.needCurrency === 'NGN'
                ? 'N' + Intl.NumberFormat ('en-US').format (data.needAmount)
                : '$' + Intl.NumberFormat ('en-US').format (data.needAmount),

              rate: data.rate,
              username:data.username,
              fraction: data.fraction ? "YES" : "NO",
              date:  moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              acceptedBidAmount: data.acceptedBidAmount,
              percentageFulfilled: data.percentageFulfilled,
              fractionToggle: data.fractionToggle ? "YES" : "NO",
              askStatus: data.askStatus,
            }))
          );
        }
      })
      .catch (err => {
        if (err) {
        }
      });
  };

  const getAskStatus = () => {
    axios
    .get(`${config.baseUrl}/api/v1/ask/statuses`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    })
    .then(res => {
        if (res.data) {
            setAskStatusData(res.data)
        }
    })
    .catch(err => {
        if (err) {}
    })
  }

  useEffect (() => {
    getAsks ();
    getAskStatus()
  }, []);

  const pagination = (page, pageSize) => {
    console.log (page);
    setPage (page);
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress=${userEmail}&phoneNumber&startDate&endDate`;
    getPaged (queryString);
  };

  const getAsks = () => {
    axios
      .get (
        `${config.baseUrl}/api/v1/admin/asks/all?pageNumber=1&pageSize=100&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress=${userEmail}&phoneNumber&startDate&endDate`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem ('token')}`,
          },
        }
      )
      .then (res => {
        if (res.status === 200) {
          setTotalItems (res.data.totalPages * 10);
          setUserData (
            res.data.records.map (data => ({
              reference: data.reference,

              haveAmount: data.haveCurrency === 'NGN'
                ? 'N' + Intl.NumberFormat ('en-US').format (data.haveAmount)
                : '$' + Intl.NumberFormat ('en-US').format (data.haveAmount),

              needAmount: data.needCurrency === 'NGN'
                ? 'N' + Intl.NumberFormat ('en-US').format (data.needAmount)
                : '$' + Intl.NumberFormat ('en-US').format (data.needAmount),

              rate: data.rate,
              username:data.username,
              fraction: data.fraction ? "YES" : "NO",
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              acceptedBidAmount: data.acceptedBidAmount,
              percentageFulfilled: data.percentageFulfilled,
              fractionToggle: data.fractionToggle ? "YES" : "NO",
              askStatus: data.askStatus,
            }))
          );
        }
      })
      .catch (err => {
        if (err) {
        }
      });
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              Asks By {userEmail}
              <CFormGroup>
                <CSelect custom name="ccmonth" id="ccmonth">
                  <option value="1" selected>Select</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>

                </CSelect>
              </CFormGroup>
            </div>

          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={usersData}
              fields={[
                {key: 'reference', name: 'Ask Ref'},
                {key:'date', name: "Date"},
                {key:'username', name: "User Name"},
                {key: 'haveAmount', name: 'Have Amount'},
                {key: 'needAmount', name: 'Need Amount'},
                {key: 'rate', name: 'Email Address'},
                {key: 'fraction', name: 'Country'},
                {key: 'acceptedBidAmount', name: 'Account Type'},
                {
                  key: 'percentageFulfilled',
                  name: 'Identity Verification Status',
                },
                {key: 'fractionToggle', name: 'Fraction Toggle'},
                {key: 'askStatus', name: 'Ask Status'},
              ]}
              scopedSlots={{
                askStatus: item => (
                  <td>
                    <CBadge color={getBadge (item.askStatus)}>
                      {item.askStatus}
                    </CBadge>
                  </td>
                ),
              }}
            />
            <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                defaultPageSize={100}
                onChange={pagination}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AskTransactions;
