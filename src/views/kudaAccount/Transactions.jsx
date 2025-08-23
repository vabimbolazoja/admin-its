import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import config from "../../config";
import { Pagination, DatePicker } from "antd";
import axios from "axios";
import { useParams } from "react-router";
import moment from "moment";

const DepositTransactions = (props) => {
  const history = useHistory();
  const params = useParams();
  const [page, setPage] = useState(1);
  const [depositDatas, setDepositDatas] = useState([]);
  const [totalItems, setTotalItems] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [load, setLoad] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const { RangePicker } = DatePicker;

  const getBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "secondary";
      case "Pending":
        return "warning";
      case "FAILED":
        return "danger";
      default:
        return "primary";
    }
  };

  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/fund-wallet?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setDepositDatas(
            res.data.postingsHistory.map((data) => ({
              referenceNumber: data.referenceNumber,
              date: moment(data.realDate).format("MMMM Do YYYY, h:mm:ss a"),
              accountNumber: data.accountNumber,
              openingBalance: data.openingBalance,
              amount: 'N' + Intl.NumberFormat("en-US").format(data.amount),
              balanceAfter: data.balanceAfter,
              beneficiaryName: data.beneficiaryName,
              instrumentNumber: data.instrumentNumber,
              narration: data.narration,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const pagination = (page, pageSize) => {
    console.log(page);
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=${pageSize}`;
    getPaged(queryString);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/kuda-single?page=0&size=100&accountId=${params?.id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);

          setDepositDatas(
            res.data.postingsHistory.map((data) => ({
              referenceNumber: data.referenceNumber,
              date: moment(data.realDate).format("MMMM Do YYYY, h:mm:ss a"),
              accountNumber: data.accountNumber,
              openingBalance: data.openingBalance,
              amount: 'N' + Intl.NumberFormat("en-US").format(data.amount),
              balanceAfter: data.balanceAfter,
              beneficiaryName: data.beneficiaryName,
              instrumentNumber: data.instrumentNumber,
              narration: data.narration,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  const searchDate = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/kuda-single?page=0&size=100&startDate=${startDate}&endDate=${endDate}&accountId=${params?.id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setDepositDatas(res.data.records);
        }
      })
      .catch((err) => {
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
              <div>Transactions</div>
              <div>
                <div className="d-flex align-items-center">
                  <div>
                    <RangePicker onChange={onChange} />
                  </div>
                  <div>
                    <button
                      type="button"
                      class="btn btn-info ml-2"
                      onClick={() => {
                        searchDate();
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CCardHeader>

          <CCardBody>
            <CDataTable
              items={depositDatas}
              fields={[
                { key: "referenceNumber", name: "Reference Number" },
                { key: "date", name: "Date" },
                { key: "accountNumber", name: "Account Number" },
                { key: "openingBalance", name: "Opening Balance" },
                { key: "amount", name: "Amount" },
                { key: "balanceAfter", name: "Balance After" },
                { key: "beneficiaryName", name: "Beneficiary Name" },
                { key: "instrumentNumber", name: "Instrument Number" },
                { key: "narration", name: "Narration" },
              ]}
              scopedSlots={{
                transactionStatus: (item) => (
                  <td>
                    <CBadge color={getBadge(item.transactionStatus)}>
                      {item.transactionStatus}
                    </CBadge>
                  </td>
                ),
              }}
            />
           
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DepositTransactions;
