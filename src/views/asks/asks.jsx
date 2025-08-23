import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CInput,
  CButton,
  CFormGroup,
  CSelect,
  CLabel,
  CAlert,
  CPagination,
} from "@coreui/react";
import config from "../../config";
import axios from "axios";
import { Pagination, Button, Modal, Skeleton, DatePicker } from "antd";
import moment from "moment";
import { ExportCSV } from "../../containers/Exportcsv";
const { RangePicker } = DatePicker;

const getBadge = (status) => {
  switch (status) {
    case "FULFILLED":
      return "success";
    case "PARTLY_FULFILLED":
      return "secondary";
    case "CANCELLED":
      return "danger";
    case "ACCEPTED":
      return "success";
    default:
      return "primary";
  }
};

const Users = () => {
  const [usersData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [load, setLoad] = useState(false);
  const [usersDataAll, setUserDataAll] = useState([]);
  const [totalItems, setTotalItems] = useState("");
  const [msg, setMsg] = useState("");
  const [configsData, setConfigsData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [askStatusData, setAskStatusData] = useState({});
  const [viewBidModal, setViewBidModal] = useState(false);
  const [biddings, setBiddings] = useState([]);
  const [bidTotalItems, setBidTotalItems] = useState("");
  const [pageBid, setPageBid] = useState(1);
  const [askReference, setAskReference] = useState("");
  const [email, setEmail] = useState("");
  const [needCurrency, setNeedCurrency] = useState("");
  const [phone, setPhone] = useState("");

  const [searchAskModal, setSearchAskModal] = useState(false);
  const [askStatus, setAskStatus] = useState("");

  const [haveAmount, setHaveAmount] = useState("");
  const [needAmount, setNeedAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [ref, setRef] = useState("");
  const [rate, setRate] = useState("");
  const [fraction, setFraction] = useState("");
  const [currency, setCurrency] = useState("");

  const closeViewBid = () => {
    setViewBidModal(false);
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
      .get(`${config.baseUrl}/api/v1/admin/asks/all?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setLoad(false);
          setSearchAskModal(false);
          setTotalItems(res.data.totalPages * 10);
          setUserData(
            res.data.records.map((data) => ({
              reference: data.reference,
              userName: data.username,
              maski:data.masked,
              masked: data.masked ? "MASKED" : "UNMASKED",
              haveAmount:
                data.haveCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.haveAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.haveAmount),

              needAmount:
                data.needCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.needAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.needAmount),
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              rate: data.rate,
              fraction: data.fraction ? "YES" : "NO",
              acceptedBidAmount: data.acceptedBidAmount,
              percentageFulfilled: data.percentageFulfilled,
              fractionToggle: data.fractionToggle ? "YES" : "NO",
              askStatus: data.askStatus,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const closeSearchAsk = () => {
    setSearchAskModal(false);
  };

  const getPagedBids = (queryString) => {
    setLoad(true);
    axios
      .get(`${config.baseUrl}/api/v1/admin/bids/all?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setViewBidModal(true);
          setBidTotalItems(res.data.totalPages * 10);
          setBiddings(
            res.data.records.map((data) => ({
              reference: data.reference,

              bidAmt:
                data.bidCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.bidAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.bidAmount),
              askAmt:
                data.bidCurrency === "NGN"
                  ? "$" + Intl.NumberFormat("en-US").format(data.askAmount)
                  : "N" + Intl.NumberFormat("en-US").format(data.askAmount),

              rate: data.rate,
              askReference: data.askReference,
              asker: data.asker,
              bidder: data.userHandle,
              bidStatus: data.bidStatus,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
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

  const viewBiddings = (id) => {
    setLoad(true);
    setAskReference(id.reference);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/bids/all?pageNumber=1&pageSize=100&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress&phoneNumber&startDate&endDate&askReference=${id.reference}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setLoad(false);

          setViewBidModal(true);
          setBidTotalItems(res.data.totalPages * 10);
          setBiddings(
            res.data.records.map((data) => ({
              reference: data.reference,

              bidAmt:
                data.bidCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.bidAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.bidAmount),
              askAmt:
                data.bidCurrency === "NGN"
                  ? "$" + Intl.NumberFormat("en-US").format(data.askAmount)
                  : "N" + Intl.NumberFormat("en-US").format(data.askAmount),
              askReference: data.askReference,

              rate: data.rate,
              asker: data.asker,
              bidder: data.userHandle,
              bidStatus: data.bidStatus,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
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
  const getAskStatus = () => {
    axios
      .get(`${config.baseUrl}/api/v1/ask/statuses`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data) {
          setAskStatusData(res.data);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const searchAskFunc = (e) => {
    e.preventDefault();
    setLoad(true);
    const queryString = `pageNumber=1&pageSize=10&haveCurrency=${currency}&haveAmount=${haveAmount}&needCurrency=${needCurrency}&needAmount=${needAmount}&rate=${rate}&askStatus=${askStatus}&emailAddress=${email}&phoneNumber=${phone}&startDate=${startDate}&endDate=${endDate}`;
    getPaged(queryString);
  };

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  useEffect(() => {
    getAsks();
    getAskStatus();
    getAsksAll();
    getTransactionStatus();
  }, []);

  const pagination = (page, pageSize) => {
    console.log(page);
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&haveCurrency=${currency}&haveAmount=${haveAmount}&needCurrency=${needCurrency}&needAmount=${needAmount}&rate=${rate}&askStatus=${askStatus}&emailAddress=${email}&phoneNumber=${phone}&startDate=${startDate}&endDate=${endDate}`;
    getPaged(queryString);
  };

  const paginationBid = (page, pageSize) => {
    console.log(page);
    setPageBid(page);
    const queryString = `pageNumber=${pageBid}&pageSize=${pageSize}&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress&phoneNumber&startDate&endDate&asKReference=${askReference}`;
    getPagedBids(queryString);
  };

  const getAsksAll = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/asks/all?pageNumber=1&pageSize=999999999&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress&phoneNumber&startDate&endDate`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setLoad(false);
          setUserDataAll(
            res.data.records.map((data) => ({
              reference: data.reference,
              userName: data.username,
              haveAmount:
                data.haveCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.haveAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.haveAmount),

              needAmount:
                data.needCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.needAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.needAmount),

              rate: data.rate,
              fraction: data.fraction ? "YES" : "NO",
              acceptedBidAmount: data.acceptedBidAmount,
              percentageFulfilled: data.percentageFulfilled,
              fractionToggle: data.fractionToggle ? "YES" : "NO",
              askStatus: data.askStatus,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
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

  const getAsks = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/asks/all?pageNumber=1&pageSize=100&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress&phoneNumber&startDate&endDate`,
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
          setUserData(
            res.data.records.map((data) => ({
              reference: data.reference,
              masked: data.masked ? "MASKED" : "UNMASKED",
              maski:data.masked,
              haveAmount:
                data.haveCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.haveAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.haveAmount),

              needAmount:
                data.needCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.needAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.needAmount),

              rate: data.rate,
              userName: data.username,
              fraction: data.fraction ? "YES" : "NO",
              acceptedBidAmount: data.acceptedBidAmount,
              percentageFulfilled: data.percentageFulfilled,
              fractionToggle: data.fractionToggle ? "YES" : "NO",
              askStatus: data.askStatus,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
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

  const changeStatusConfirm = (id, e) => {
    e.preventDefault();
    console.log(id)
    Modal.confirm({
      title: `Are you sure you want to ${
        id.maski
          ? "Unmask this ask and make visible to currency exchange"
          : "Mask this ask and make it available through Company email"
      }?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        approve(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const approve = (id, e) => {
    console.log(id);
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/asks/treat`,
        {
          askReference: id.reference,
          mask: id.maski ? false : true,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setSuccess(true);
          setMsg("Success", "Ask Modified already");
          getAsks();
          setError(false);
          setTimeout(() => {
            setSuccess(false);
          }, 2000);
        }
      })
      .catch((err) => {
        setLoad(false);
        setSuccess(false);
        if (err.response !== undefined) {
          setMsg(err.response.data.message);
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2500);
        } else {
          setMsg("Connection Error");
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2500);
        }
      });
  };

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              Asks
              <div>
                <Button
                  type="button"
                  class="btn btn-primary mr-2"
                  style={{ backgroundColor: "blue", color: "white" }}
                  onClick={() => setSearchAskModal(true)}
                >
                  Filter Ask
                </Button>
                <ExportCSV csvData={usersDataAll} fileName={"Asks Data"} />
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            {load ? (
              <Skeleton active={true} block={true} />
            ) : (
              <CDataTable
                items={usersData}
                fields={[
                  { key: "reference", name: "Ask Ref" },
                  { key: "createdOn", name: "Created On" },
                  { key: "userName", name: "Username" },

                  { key: "haveAmount", name: "Have Amount" },
                  { key: "needAmount", name: "Need Amount" },
                  { key: "rate", name: "Email Address" },
                  { key: "masked", name: "Mask Status" },
                  { key: "fraction", name: "Country" },
                  { key: "acceptedBidAmount", name: "Account Type" },
                  {
                    key: "percentageFulfilled",
                    name: "Identity Verification Status",
                  },
                  { key: "fractionToggle", name: "Fraction Toggle" },
                  { key: "askStatus", name: "Ask Status" },
                  { key: "action", name: "Action" },
                ]}
                scopedSlots={{
                  askStatus: (item) => (
                    <td>
                      <CBadge color={getBadge(item.askStatus)}>
                        {item.askStatus}
                      </CBadge>
                    </td>
                  ),
                  action: (item) => (
                    
                    <td className="d-flex justify-content-between align-items-center">
                      <Button
                        type="primary"
                        onClick={viewBiddings.bind(this, item)}
                      >
                        View Bids
                      </Button>
                      <Button
                        type="danger"
                        className="ml-3"
                        onClick={changeStatusConfirm.bind(this, item)}
                      >
                        {item.maski? "Unmask Ask" : "Mask Ask"}
                      </Button>
                    </td>
                  ),
                }}
              />
            )}
            <div className="text-center pagination-part pt-5">
              <Pagination
                current={page}
                total={totalItems}
                defaultPageSize={100}
                onChange={pagination}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={`View Biddings on ${askReference}`}
        visible={viewBidModal}
        footer={null}
        maskClosable={false}
        onCancel={closeViewBid}
        width={"80%"}
        style={{ marginTop: "1rem" }}
      >
        {load ? (
          <Skeleton active={true} block={true} />
        ) : (
          <div className="pt-3 pb-5">
            <CDataTable
              items={biddings}
              fields={[
                { key: "reference", name: "Bid Ref" },
                { key: "askReference", name: "Ask Ref" },
                { key: "createdOn", name: "Created On" },
                { key: "asker", name: "Asker" },
                { key: "bidder", name: "Bidder" },
                { key: "askAmt", name: "Ask Amount" },
                { key: "bidAmt", name: "Bid Amount" },
                { key: "rate", name: "Rate" },
                { key: "bidStatus", name: "Bid Status" },
              ]}
              scopedSlots={{
                bidStatus: (item) => (
                  <td>
                    <CBadge color={getBadge(item.bidStatus)}>
                      {item.bidStatus}
                    </CBadge>
                  </td>
                ),
              }}
            />
            <div className="text-center pagination-part">
              <Pagination
                current={pageBid}
                total={bidTotalItems}
                defaultPageSize={100}
                onChange={paginationBid}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={"Search Asks"}
        visible={searchAskModal}
        footer={null}
        maskClosable={false}
        onCancel={closeSearchAsk}
      >
        {/* {fill &&
        <div className="text-center text-danger pb-3">Currency is required to search reconciliaton records</div>} */}
        <CFormGroup>
          <CLabel htmlFor="name">Ask Reference</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setRef(e.target.value)}
            value={ref}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Have Currency</CLabel>
          <CSelect
            custom
            name="ccmonth"
            id="ccmonth"
            onChange={(e) => setCurrency(e.target.value)}
            value={currency}
          >
            <option selected>Select</option>
            <option>NGN</option>
            <option>USD</option>
          </CSelect>{" "}
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Need Currency</CLabel>
          <CSelect
            custom
            name="ccmonth"
            id="ccmonth"
            onChange={(e) => setNeedCurrency(e.target.value)}
            value={needCurrency}
          >
            <option selected>Select</option>
            <option>NGN</option>
            <option>USD</option>
          </CSelect>{" "}
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Ask Fraction</CLabel>
          <CSelect
            custom
            name="ccmonth"
            id="ccmonth"
            onChange={(e) => setFraction(e.target.value)}
            value={fraction}
          >
            <option selected>Select</option>
            <option value="YES">FRACTION ON</option>
            <option value="NO">FRACTION OFF</option>
          </CSelect>{" "}
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Have Amount</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setHaveAmount(e.target.value)}
            value={haveAmount}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Need Amount</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setNeedAmount(e.target.value)}
            value={needAmount}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Rate</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setRate(e.target.value)}
            value={rate}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Email</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Phone Number</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />
        </CFormGroup>
        {configsData.askStatuses && (
          <CFormGroup>
            <CLabel htmlFor="name">Ask Status</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setAskStatus(e.target.value)}
              value={askStatus}
            >
              <option selected>Select</option>
              {configsData.askStatuses.map((status) => {
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
        <div className="d-flex justify-content-end mt-3">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={searchAskFunc}
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

export default Users;
