import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CLabel,
  CTextarea,
  CFormGroup,
  CDataTable,
  CRow,
  CSelect,
  CButton,
  CAlert,
  CPagination,
} from "@coreui/react";
import config from "../../config";
import {ExportCSV} from "../../containers/Exportcsv"
import axios from "axios";
import { Pagination, Modal, Button, DatePicker } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
const ProxyTransfer = (props) => {
  const userEmail = props.history.location.state;
  const history = useHistory();
  const [TransferDatas, setTransferDatas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [configsData, setConfigsData] = useState({})
  const [fill, setFill] = useState(false)
  const [TransferDatasAll, setTransferDatasAll] = useState([])

  const [startDate, setStartDate] = useState("");
  const [transRef, setTransRef] = useState("")
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [reason, setReason] = useState("");
  const [load, setLoad] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
 
  const [reconciliatonModal, setReconciliationSearchModal] = useState(false)


  const [provider, setProvider] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [transactionType, setTransactionType] = useState("")
const [emailAddress, setEmail] = useState("")



  console.log(userEmail);

  const getBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "danger";
      case "Pending":
        return "warning";
      case "FAILED":
        return "danger";
        case "CREDIT":
          return "success";
          case "DEBIT":
            return "danger";
      default:
        return "primary";
    }
  };

  const closeReconciliation = () =>  {
    setReconciliationSearchModal(false)
    setAmount("")
    setCurrency("")
    setEmail("")
    setTransactionType("")
    setTransactionStatus("")
    setProvider("")
  }



  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/wallet?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setTransferDatas(
            res.data.records.map((data) => ({
              reference: data.reference,
              startDate: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              transactionStatus: data.transactionStatus,
              reason: data.reason,
              emailAddress: data.emailAddress,
              provider: data.provider,
              transactionType: data.transactionType
             
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getTransactionStatus = () => {
    axios
    .get(
      `${config.baseUrl}/api/v1/configurations`
    )
    .then((res) => {
      setConfigsData(res.data)
    })
    .catch((err) => {
      if (err) {
      }
    });
  }


  const pagination = (page, pageSize) => {
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&amount=${amount}&provider=${provider}&transactionType=${transactionType}&startDate=${startDate}&endDate=${endDate}&currency=${currency}&transactionStatus=${transactionStatus}&emailAddress=${emailAddress}`;
    getPaged(queryString);
  };


 
  useEffect(() => {
    getReconciliation();
    getTransactionStatus()
    getReconciliationAll()
  }, []);

  const getReconciliation = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/wallet?pageNumber=1&pageSize=100&amount&provider&transactionType&startDate&endDate&currency&transactionStatus&emailAddress=`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setTransferDatas(
            res.data.records.map((data) => ({
              reference: data.reference,
              startDate: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              transactionStatus: data.transactionStatus,
              reason: data.reason,
              emailAddress: data.emailAddress,
              provider: data.provider,
              transactionType: data.transactionType
             
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getReconciliationAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/wallet?pageNumber=1&pageSize=999999999&amount&provider&transactionType&startDate&endDate&currency&transactionStatus&emailAddress=`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTransferDatasAll(
            res.data.records.map((data) => ({
              reference: data.reference,
              startDate: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              transactionStatus: data.transactionStatus,
              reason: data.reason,
              emailAddress: data.emailAddress,
              provider: data.provider,
              transactionType: data.transactionType
             
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  }

  const searchReconciliationFunc = () => {
    if(currency){
    setLoad(true)
      axios
        .get(
          `${config.baseUrl}/api/v1/admin/transactions/wallet?pageNumber=1&pageSize=100&amount=${amount}&provider=${provider}&transactionType=${transactionType}&startDate=${startDate}&endDate=${endDate}&currency=${currency}&transactionStatus=${transactionStatus}&emailAddress=${emailAddress}&transactionReference=${transRef}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setLoad(false);
            setTotalItems(res.data.totalPages * 10);
            setReconciliationSearchModal(false)
            setTransferDatas(
              res.data.records.map((data) => ({
                reference: data.reference,
                startDate: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
                amount:
                  data.currency === "NGN"
                    ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                    : "$" + Intl.NumberFormat("en-US").format(data.amount),
                transactionStatus: data.transactionStatus,
                reason: data.reason,
                emailAddress: data.emailAddress,
                provider: data.provider,
                transactionType: data.transactionType
               
              }))
            );
          }
        })
        .catch((err) => {
          if (err) {
            setLoad(false);
          }
        });
      }
      else{
        setFill(true)
        setTimeout(() => {
          setFill(false)
        },2000)
      }
    };
  

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
      <div className="d-flex justify-content-end align-items-center">
         
          <button type="button" class="btn btn-primary" onClick={() => setReconciliationSearchModal(true)}>
          Search Reconciliation
          </button>
          <ExportCSV csvData={TransferDatasAll} fileName={'Reconciliation Data'} />

        </div>
            
            </CCardHeader>{" "}
          <CCardBody>
            <CDataTable
              items={TransferDatas}
              fields={[
                { key: "reference", name: "Reference" },
                { key: "startDate", name: " Date" },
                { key: "amount", name: "Amount" },
                { key: "emailAddress", name: "Email Address" },
                { key: "provider", name: "Provider" },
                { key: "reason", name: "Reason" },
                { key: "transactionStatus", name: "Transaction Status" },
                { key: "transactionType", name: "Transaction Type" },







              ]}
              striped
              scopedSlots={{
                transactionStatus: (item) => (
                  <td>
                    <CBadge color={getBadge(item.transactionStatus)}>
                      {item.transactionStatus}
                    </CBadge>
                  </td>
                ),
                transactionType: (item) => (
                  <td>
                    <CBadge color={getBadge(item.transactionType)}>
                      {item.transactionType}
                    </CBadge>
                  </td>
                ),
              }}
            />
            <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                defaultPageSize={100}
                onChange={pagination}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>




      <Modal
        title={"Search Reconciliation"}
        visible={reconciliatonModal}
        footer={null}
        maskClosable={false}
        onCancel={closeReconciliation}
      >
        {fill &&
        <div className="text-center text-danger pb-3">Currency is required to search reconciliaton records</div>}
         <CFormGroup>
          <CLabel htmlFor="name">Transaction Reference</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setTransRef(e.target.value)}
            value={transRef}
          />
        </CFormGroup>
         <CFormGroup>
            <CLabel htmlFor="name">Currency</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setCurrency(e.target.value)}
              value={currency}
            >
              <option selected>Select</option>
              <option >NGN</option>
              <option >USD</option>
            </CSelect>{" "}
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Provider</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setProvider(e.target.value)}
              value={provider}
            >
              <option selected>Select</option>
              <option value="SILA_MONEY">SILA MONEY</option>
              <option value="FLUTTER_WAVE">FLUTTER WAVE</option>
            </CSelect>{" "}
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Amount</CLabel>
            <CInput
              id="name"
              type="number"
              required
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Email Address</CLabel>
            <CInput
              id="name"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={emailAddress}
            />
          </CFormGroup>
          {configsData.transactionStatuses &&
          <CFormGroup>
            <CLabel htmlFor="name">Transaction Status</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setTransactionStatus(e.target.value)}
              value={transactionStatus}
            >
              <option selected>Select</option>
              {configsData.transactionStatuses.map((status) => {
                return(
                  <option>{status}</option>

                )
              })}
            </CSelect>{" "}
          </CFormGroup>}
          
          <CFormGroup>
            <CLabel htmlFor="name">Transaction Type</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setTransactionType(e.target.value)}
              value={transactionType}
            >
              <option selected>Select</option>
              <option >CREDIT</option>
              <option >DEBIT</option>
            </CSelect>{" "}
          </CFormGroup>
         
          <br />
          <RangePicker style={{ width: "100%" }} onChange={onChange} />
          <br />
          <div className="d-flex justify-content-end mt-3">
            <button
              type="button"
              class="btn btn-primary mr-2"
              onClick={searchReconciliationFunc}
            >
              {load ? (
                <div
                  class="spinner-border"
                  role="status"
                  style={{ width: "1rem", height: "1rem" }}
                >
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>

          
         


        </Modal>
    </CRow>
  );
};

export default ProxyTransfer;
