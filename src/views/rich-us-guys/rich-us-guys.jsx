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
import { Pagination, Modal, DatePicker, Button } from "antd";
import { ExportCSV } from "../../containers/Exportcsv";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import moment from "moment";
const { RangePicker } = DatePicker;

const Users = () => {
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [depositDatas, setDepositDatas] = useState([]);
  const [totalItems, setTotalItems] = useState("");
  const [filter, setFilter] = useState(false);
  const [depositDatasAll, setDepositDatasAll] = useState([]);
  const [load, setLoad] = useState(false);
  const [emailAddress, setEmail] = useState("");
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [transactionStatus, setTransactionStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [configsData, setConfigsData] = useState({});

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
          setFilter(false);
          setLoad(false)
          setTotalItems(res.data.totalPages * 10);
          setDepositDatas(
            res.data.records.map((data) => ({
              transactionId: data.transactionId,
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              firstName: data.traderXUser.firstName,
              lastName: data.traderXUser.lastName,
              emailAddress: data.traderXUser.emailAddress,
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              provider: data.provider.replace("_", " "),
              transactionStatus: data.transactionStatus,
              platformFeePaid: data.traderXUser.platformFeePaid ? "YES" : "NO",
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
    }&transactionId=${transactionId}&emailAddress=${emailAddress}&provider=${provider}&amount=${amount}`;
    getPaged(queryString);
  };

  useEffect(() => {
    getDeposits();
    getDepositsAll();
    getTransactionStatus();
  }, []);

  const getDeposits = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/traderx-users/united_states_users_with_funds?pageNumber=1&pageSize=10`,
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
            res.data.map((data) => ({
              firstName: data.firstName,
              lastName: data.lastName,
              emailAddress: data.emailAddress,
              phoneNumber: data.phoneNumber,
              balance: "$" + Intl.NumberFormat("en-US").format(data.balance),
              limitType: data.limitType,
              status: data.status,
            
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

  const closeFilter = () => {
    setTransactionId("");
    setTransactionStatus("");
    setStartDate("");
    setEndDate("");
    setFilter(false);
    setEmail("")
    setAmount("")

  };

  const getDepositsAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/traderx-users/united_states_users_with_funds?pageNumber=1&pageSize=999999999`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setDepositDatasAll(
            res.data.map((data) => ({
                firstName: data.firstName,
                lastName: data.lastName,
                emailAddress: data.emailAddress,
                phoneNumber: data.phoneNumber,
                balance: "$" + Intl.NumberFormat("en-US").format(data.balance),
                limitType: data.limitType,
                status: data.status,
              
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
    const queryString = `pageNumber=${page}&pageSize=10&startDate=${startDate}&endDate=${endDate}&transactionStatus=${
      transactionStatus === "Select" ? "" : transactionStatus
    }&transactionId=${transactionId}&emailAddress=${emailAddress}&provider=${provider}&amount=${amount}`;
    getPaged(queryString);
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              {" "}
              <p>Rich US Guys</p>{" "}
              {/* <div>
                <Button
                  type="primary"
                  onClick={() => setFilter(true)}
                  style={{ backgroundColor: "blue", color: "white" }}
                  className="mr-2"
                >
                  Filter Deposit
                </Button>
                <ExportCSV
                  csvData={depositDatasAll}
                  fileName={"Deposit Transactions Data"}
                />
              </div> */}
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={depositDatas}
              fields={[
                { key: "firstName", name: "First Name" },
                { key: "lastName", name: "Last Name" },
                { key: "emailAddress", name: "Email Address" },
                { key: "phoneNumber", name: "Phone Number" },
                { key: "limitType", name: "Limit Type" },
                { key: "balance", name: "Balance" },
                { key: "status", name: "Status" },

              
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
            {/* <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                defaultPageSize={10}
                onChange={pagination}
              />
            </div> */}
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={"Filter Deposits"}
        visible={filter}
        footer={null}
        maskClosable={false}
        onCancel={closeFilter}
      >
        <div className="container">
          <CFormGroup>
            <CLabel htmlFor="name">Transaction ID</CLabel>
            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setTransactionId(e.target.value)}
              value={transactionId}
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
            <CButton onClick={searchDeposit} type="button" color="success">
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
    </CRow>
  );
};

export default Users;
