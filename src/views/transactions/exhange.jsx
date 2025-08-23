import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification, Pagination, DatePicker, Button } from "antd";
import { ExportCSV } from "../../containers/Exportcsv";
import moment from "moment";
import CIcon from "@coreui/icons-react";
import {
  CForm,
  CFormText,
  CCardFooter,
  CInputFile,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CSelect,
  CBadge,
  CFormGroup,
  CLabel,
  CRow,
  CInput,
  CTextarea,
  CButton,
  CPagination,
} from "@coreui/react";
import config from "../../config";
import axios from "axios";

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

const { RangePicker } = DatePicker;

const Users = () => {
  const history = useHistory();
  const [exchangeData, setExchangeData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [filter, setFilter] = useState(false);
  const [error, setError] = useState(false);
  const [viewAskModal, setViewAskModal] = useState(false);
  const [viewBidModal, setViewBidModal] = useState(false);
  const [exchangeDataAll, setExchangeDataAll] = useState([]);
  const [exchangeStatus, setExchangeStatus] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [configsData, setConfigsData] = useState({});
  const [reference, setReference] = useState("");

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");

  const [askInfo, setAskInfo] = useState({});
  const [bidInfo, setBidInfo] = useState({});
  const [load, setLoad] = useState(false);
  const [reason, setReason] = useState("");
  const [userId, setUserId] = useState("");
  const [loadView, setLoadView] = useState(false);

  const closeViewAsk = () => {
    setViewAskModal(false);
  };

  const closeFilter = () => {
    setExchangeStatus("");
    setTransactionStatus("");
    setStartDate("");
    setEndDate("");
    setReference("");
    setFilter(false);
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

  const closeViewBid = () => {
    setViewBidModal(false);
  };

  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/exchange?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        setFilter(false);
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setExchangeData(
            res.data.records.map((data) => ({
              transactionStatus: data.transactionStatus,
              reference: data.reference,
              askCreator: data.ask.traderXUser
                ? data.ask.traderXUser.emailAddress
                : "",
              askCreatorName: data.ask.traderXUser
                ? data.ask.traderXUser.firstName +
                  " " +
                  data.ask.traderXUser.lastName
                : "",
              bidCreatorName: data.bid.traderXUser
                ? data.bid.traderXUser.firstName +
                  " " +
                  data.bid.traderXUser.lastName
                : "",
              exchangeStatus: data.exchangeStatus,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              ask: data.ask,
              bid: data.bid,
            }))
          );
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  };

  const pagination = (page, pageSize) => {
    console.log(page);
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}&transactionStatus=${
      transactionStatus === "Select" ? "" : transactionStatus
    }&exchangeStatus=${
      exchangeStatus === "Select" ? "" : exchangeStatus
    }&reference=${reference}`;
    getPaged(queryString);
  };

  useEffect(() => {
    getExchange();
    getExchangeAll();
    getTransactionStatus();
  }, []);

  const getExchange = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/exchange?pageNumber=1&pageSize=100&startDate&endDate&exhangeStatus&transactionStatus&reference`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setExchangeData(
            res.data.records.map((data) => ({
              transactionStatus: data.transactionStatus,
              reference: data.reference,
              askCreator: data.ask.traderXUser
                ? data.ask.traderXUser.emailAddress
                : "",
              askCreatorName: data.ask.traderXUser
                ? data.ask.traderXUser.firstName +
                  " " +
                  data.ask.traderXUser.lastName
                : "",
              bidCreatorName: data.bid.traderXUser
                ? data.bid.traderXUser.firstName +
                  " " +
                  data.bid.traderXUser.lastName
                : "",
              exchangeStatus: data.exchangeStatus,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              ask: data.ask,
              bid: data.bid,
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

  const getExchangeAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/exchange?pageNumber=1&pageSize=999999999&startDate&endDate&exhangeStatus&transactionStatus&reference`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setExchangeDataAll(
            res.data.records.map((data) => ({
              transactionStatus: data.transactionStatus,
              reference: data.reference,
              askCreator: data.ask.traderXUser
                ? data.ask.traderXUser.emailAddress
                : "",
              askCreatorName: data.ask.traderXUser
                ? data.ask.traderXUser.firstName +
                  " " +
                  data.ask.traderXUser.lastName
                : "",
              bidCreatorName: data.bid.traderXUser
                ? data.bid.traderXUser.firstName +
                  " " +
                  data.bid.traderXUser.lastName
                : "",
              exchangeStatus: data.exchangeStatus,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              ask: data.ask,
              bid: data.bid,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const searchExchangeFilter = (e) => {
    e.preventDefault();
    setLoad(true);
    const queryString = `pageNumber=${page}&pageSize=100&startDate=${startDate}&endDate=${endDate}&transactionStatus=${
      transactionStatus === "Select" ? "" : transactionStatus
    }&exchangeStatus=${
      exchangeStatus === "Select" ? "" : exchangeStatus
    }&reference=${reference}`;
    getPaged(queryString);
  };

  const viewAskFunc = (id, e) => {
    console.log(
      id.ask.traderXUser.firstName + " " + id.ask.traderXUser.lastName
    );
    setAskInfo(id.ask);
    setViewAskModal(true);
  };

  const viewBidFunc = (id, e) => {
    console.log(id.ask.traderXUser);
    setBidInfo(id.bid);
    setViewBidModal(true);
  };

  const Notification = (type, msgType, msg) => {
    notification[type]({
      message: msgType,
      description: msg,
    });
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              {" "}
              <p>Exchange</p>{" "}
              <div>
                <Button
                  type="primary"
                  onClick={() => setFilter(true)}
                  style={{ backgroundColor: "blue", color: "white" }}
                  className="mr-2"
                >
                  Filter Exchange
                </Button>
                <ExportCSV
                  csvData={exchangeDataAll}
                  fileName={"Exchange Transactions Data"}
                />
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={exchangeData}
              fields={[
                {
                  key: "reference",
                  name: "Reference",
                },
                {
                  key: "createdOn",
                  name: "Created On",
                },
                {
                  key: "askCreator",
                  name: "Ask Creator ",
                },
                {
                  key: "askCreatorName",
                  name: "Name ",
                },

                {
                  key: "exchangeStatus",
                  name: "Exchange Status",
                },
                {
                  key: "transactionStatus",
                  name: "Transaction Status",
                },

                {
                  key: "Actions",
                  name: "Actions",
                },
              ]}
              scopedSlots={{
                Actions: (item) => (
                  <td className="d-flex">
                    <button
                      type="button"
                      class="btn btn-info mr-2"
                      onClick={viewAskFunc.bind(this, item)}
                    >
                      View Ask
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={viewBidFunc.bind(this, item)}
                    >
                      View Bid
                    </button>
                  </td>
                ),
                transactionStatus: (item) => (
                  <td>
                    <CBadge color={getBadge(item.transactionStatus)}>
                      {item.transactionStatus}
                    </CBadge>
                  </td>
                ),
                exchangeStatus: (item) => (
                  <td>
                    <CBadge color={getBadge(item.exchangeStatus)}>
                      {item.exchangeStatus}
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
        title={"View Ask"}
        visible={viewAskModal}
        footer={null}
        maskClosable={false}
        onCancel={closeViewAsk}
        width={500}
      >
        <div className="container">
          <CRow>
            <CCol xs="12" md="12">
              <CCard>
                <CCardHeader>Ask Exchange Information</CCardHeader>
                <CCardBody>
                  <CForm
                    action=""
                    method="post"
                    encType="multipart/form-data"
                    className="form-horizontal"
                  >
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel>Reference</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {askInfo.reference ? askInfo.reference : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel>Email Address</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {askInfo.traderXUser
                            ? askInfo.traderXUser.emailAddress
                            : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel>Ask Creator Name</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {askInfo.traderXUser
                            ? askInfo.traderXUser.firstName +
                              " " +
                              askInfo.traderXUser.lastName
                            : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel htmlFor="text-input">Have Amount</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {askInfo.haveCurrency
                            ? askInfo.haveCurrency === "NGN"
                              ? "N"
                              : "$"
                            : ""}
                          {askInfo.haveAmount
                            ? Intl.NumberFormat("en-US").format(
                                askInfo.haveAmount
                              )
                            : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel>Ask Fee</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {askInfo.haveCurrency
                            ? askInfo.haveCurrency === "NGN"
                              ? "N"
                              : "$"
                            : ""}
                          {askInfo.askFee
                            ? Intl.NumberFormat("en-US").format(askInfo.askFee)
                            : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel htmlFor="email-input">Need Amount</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {askInfo.needCurrency
                            ? askInfo.needCurrency === "NGN"
                              ? "N"
                              : "$"
                            : ""}
                          {askInfo.needAmount
                            ? Intl.NumberFormat("en-US").format(
                                askInfo.needAmount
                              )
                            : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel htmlFor="password-input">Rate</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {askInfo.rate ? askInfo.rate : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel htmlFor="date-input">Fraction </CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {askInfo.fraction ? "YES" : "No"}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel htmlFor="date-input">Payment Status </CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {askInfo.askStatus ? (
                            <CBadge color={getBadge(askInfo.askStatus)}>
                              {askInfo.askStatus}
                            </CBadge>
                          ) : (
                            ""
                          )}
                        </p>
                      </CCol>
                    </CFormGroup>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </Modal>

      <Modal
        title={"View Bid"}
        visible={viewBidModal}
        footer={null}
        maskClosable={false}
        onCancel={closeViewBid}
        width={500}
      >
        <div className="container">
          <CRow>
            <CCol xs="12" md="12">
              <CCard>
                <CCardHeader>BId Exchange Information</CCardHeader>
                <CCardBody>
                  <CForm
                    action=""
                    method="post"
                    encType="multipart/form-data"
                    className="form-horizontal"
                  >
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel>Email</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {bidInfo.traderXUser
                            ? bidInfo.traderXUser.emailAddress
                            : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel>Bidder Name</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {bidInfo.traderXUser
                            ? bidInfo.traderXUser.firstName +
                              " " +
                              bidInfo.traderXUser.lastName
                            : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel>Reference</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {bidInfo.reference ? bidInfo.reference : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel htmlFor="text-input">Bid Amount</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {bidInfo.bidCurrency
                            ? bidInfo.bidCurrency === "NGN"
                              ? "N"
                              : "$"
                            : ""}
                          {bidInfo.bidAmount
                            ? Intl.NumberFormat("en-US").format(
                                bidInfo.bidAmount
                              )
                            : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel>Bid Fee</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {bidInfo.bidCurrency
                            ? bidInfo.bidCurrency === "NGN"
                              ? "N"
                              : "$"
                            : ""}
                          {bidInfo.bidFee
                            ? Intl.NumberFormat("en-US").format(bidInfo.bidFee)
                            : ""}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel htmlFor="email-input">Bid Status</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {bidInfo.bidStatus ? (
                            <CBadge color={getBadge(bidInfo.bidStatus)}>
                              {bidInfo.bidStatus}
                            </CBadge>
                          ) : (
                            ""
                          )}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel htmlFor="password-input">Rate</CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {bidInfo.rate ? bidInfo.rate : ""}
                        </p>
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md="5">
                        <CLabel htmlFor="date-input">Payment Status </CLabel>
                      </CCol>
                      <CCol xs="12" md="7">
                        <p className="form-control-static">
                          {bidInfo.paymentStatus ? (
                            <CBadge color={getBadge(bidInfo.paymentStatus)}>
                              {bidInfo.paymentStatus}
                            </CBadge>
                          ) : (
                            ""
                          )}
                        </p>
                      </CCol>
                    </CFormGroup>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </Modal>

      <Modal
        title={"Filter Exchange"}
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
          {configsData.exchangeStatuses && (
            <CFormGroup>
              <CLabel htmlFor="name">Exchange Status</CLabel>
              <CSelect
                custom
                name="ccmonth"
                id="ccmonth"
                onChange={(e) => setExchangeStatus(e.target.value)}
                value={exchangeStatus}
              >
                <option selected>Select</option>
                {configsData.exchangeStatuses.map((status) => {
                  return <option>{status}</option>;
                })}
              </CSelect>{" "}
            </CFormGroup>
          )}

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
              onClick={searchExchangeFilter}
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
    </CRow>
  );
};

export default Users;
