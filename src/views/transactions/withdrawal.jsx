import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CFormGroup,
  CLabel,
  CInput,
  CSelect,
  CButton,
  CRow,
} from "@coreui/react";
import config from "../../config";
import { ExportCSV } from "../../containers/Exportcsv";
import axios from "axios";
import { Pagination, Modal, DatePicker, Button } from "antd";
import moment from "moment";
import CIcon from "@coreui/icons-react";
const { RangePicker } = DatePicker;



const Users = () => {
  const history = useHistory();
  const [depositDatas, setDepositDatas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [depositDatasAll, setDepositDatasAll] = useState([]);

  const [load, setLoad] = useState(false);
  const [emailAddress, setEmail] = useState("");
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [filter, setFilter] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")

  const [transactionStatus, setTransactionStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [configsData, setConfigsData] = useState({});

  
  const getTransactionStatus = () => {
    axios
      .get(`${config.baseUrl}/api/v1/configurations`)
      .then((res) => {
        setConfigsData(res.data);
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const closeFilter = () => {
    setReference("");
    setTransactionStatus("");
    setStartDate("");
    setEndDate("");
    setFilter(false);
    setEmail("")
    setAccountName("");
    setBankName("")
    setAccountNumber("")
    setAmount("")

  };



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

  useEffect(() => {
    getUsers();
    getTransactionStatus()
  }, []);

  const getUsersAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/withdrawal?pageNumber=1&pageSize=999999999`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);

          setDepositDatasAll(
            res.data.records.map((data) => ({
              reference: data.reference,
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              accName: data.accountName,
              accNum: data.accountNumber,
              bank: data.bankName,

              emailAddress: data.traderXUser.emailAddress,
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              provider: data.provider.replace("_", " "),
              transactionStatus: data.transactionStatus,
              country: data.traderXUser.country.replace("_", " "),
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const searchDeposit = (e) => {
    e.preventDefault();
    setLoad(true);
    const queryString = `pageNumber=${page}&pageSize=100&startDate=${startDate}&endDate=${endDate}&transactionStatus=${
      transactionStatus === "Select" ? "" : transactionStatus
    }&reference=${reference}&emailAddress=${emailAddress}&provider=${provider}&amount=${amount}&bankName=${bankName}&accountNumber=${accountNumber}&accountName=${accountName}`;
    getPaged(queryString);
  };

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }


  const getUsers = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/withdrawal?pageNumber=1&pageSize=100`,
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
            res.data.records.map((data) => ({
              reference: data.reference,
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              accName: data.accountName,
              accNum: data.accountNumber,
              bank: data.bankName,

              emailAddress: data.traderXUser.emailAddress,
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              provider: data.provider.replace("_", " "),
              transactionStatus: data.transactionStatus,
              country: data.traderXUser.country.replace("_", " "),
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };
  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/withdrawal?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setFilter(false);
          setLoad(false)
          setTotalItems(res.data.totalPages * 10);
          setDepositDatas(
            res.data.records.map((data) => ({
              reference: data.reference,
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              accName: data.accountName,
              accNum: data.accountNumber,
              bank: data.bankName,

              emailAddress: data.traderXUser.emailAddress,
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              provider: data.provider.replace("_", " "),
              transactionStatus: data.transactionStatus,
              country: data.traderXUser.country.replace("_", " "),
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
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}&transactionStatus=${
      transactionStatus === "Select" ? "" : transactionStatus
    }&reference=${reference}&emailAddress=${emailAddress}&provider=${provider}&amount=${amount}&bankName=${bankName}&accountNumber=${accountNumber}&accountName=${accountName}`;    getPaged(queryString);
  };
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              {" "}
              <p>WithdrawalTransactions</p>{" "}
              <div>
              <Button
                  type="primary"
                  onClick={() => setFilter(true)}
                  style={{ backgroundColor: "blue", color: "white" }}
                  className="mr-2"
                >
                  Filter Withdrawal
                </Button>
                <ExportCSV
                csvData={depositDatasAll}
                fileName={"Withdrawal TransactionsData"}
              />
              </div>
            
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={depositDatas}
              fields={[
                { key: "reference", name: "Transaction ID" },
                { key: "date", name: "Transaction Date" },
                { key: "accName", name: "Account Name" },
                { key: "accNum", name: "Account Number" },
                { key: "bank", name: "Bank" },
                { key: "emailAddress", name: "Email Address" },
                { key: "amount", name: "Amount" },
                { key: "provider", name: "Provider" },
                { key: "transactionStatus", name: "Transaction Status" },
                { key: "country", name: "Country" },
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
              clickableRows
            />
            <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                defaultPageSize={100}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                onChange={pagination}
              />
            </div>

            <Modal
              title={"Filter Withdrawal"}
              visible={filter}
              footer={null}
              maskClosable={false}
              onCancel={closeFilter}
            >
              <div className="container">
                <CFormGroup>
                  <CLabel htmlFor="name">Reference</CLabel>
                  <CInput
                    id="name"
                    type="text"
                    required
                    onChange={(e) => setReference(e.target.value)}
                    value={reference}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Email Address </CLabel>
                  <CInput
                    id="name"
                    type="text"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={emailAddress}
                  />
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
                  <CLabel htmlFor="name">Account Name</CLabel>
                  <CInput
                    id="name"
                    type="text"
                    required
                    onChange={(e) => setAccountName(e.target.value)}
                    value={accountName}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Account Number</CLabel>
                  <CInput
                    id="name"
                    type="text"
                    required
                    onChange={(e) => setAccountNumber(e.target.value)}
                    value={accountNumber}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Bank Name</CLabel>
                  <CSelect
                    custom
                    name="ccmonth"
                    id="ccmonth"
                    onChange={(e) => setBankName(e.target.value)}
                    value={bankName}
                  >
                    <option selected>Select</option>
                   
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
                    <option>FLUTTER_WAVE</option>
                    <option>SILA_MONEY</option>
                  </CSelect>{" "}
                </CFormGroup>

                {configsData.transactionStatuses && (
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
                        return <option>{status}</option>;
                      })}
                    </CSelect>{" "}
                  </CFormGroup>
                )}
                <br />
                <RangePicker style={{ width: "100%" }} onChange={onChange} />
                <br />
                <br />

                <div className="text-right">
                  <CButton
                    onClick={searchDeposit}
                    type="button"
                    color="success"
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
                      <>
                        <CIcon name="cil-magnifying-glass" /> Search{" "}
                      </>
                    )}
                  </CButton>
                </div>
              </div>
            </Modal>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Users;
