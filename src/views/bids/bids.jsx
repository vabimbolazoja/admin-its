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
  CInput,
  CButton,
  CFormGroup,
  CSelect,
  CLabel,
  CPagination,
} from "@coreui/react"
import config from "../../config";
import { ExportCSV } from "../../containers/Exportcsv";
import { Pagination, Button, Modal,Skeleton, DatePicker,  } from "antd";
import axios from "axios";
import moment from "moment";
const { RangePicker } = DatePicker;


const getBadge = (status) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "ACCEPETED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "danger";
    case "REJECTED":
      return "secondary";
    case "CANCELLED	":
      return "danger";

    default:
      return "primary";
  }
};

const Users = () => {
  const [bidsData, setBidsData] = useState([]);
  const [bidsDataAll, setBidsDataAll] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [bidStatusData, setBidStatusData] = useState({});
  const [searchBidModal, setSearchBidModal] = useState(false)

  const [configsData, setConfigsData] = useState([])

  const [haveAmount, setHaveAmount] = useState("");
  const [needAmount, setNeedAmount] = useState("");
  const [transactionType, setTransactionType] = useState("")
  const [transactionStatus, setTransactionStatus] = useState("");
  const [ref, setRef] = useState("")
  const [rate, setRate] = useState("")
  const [fraction, setFraction] = useState("")
  const [currency, setCurrency] = useState("")
  const [askReference, setAskReference] = useState("");
  const [email, setEmail] = useState("");
  const [needCurrency, setNeedCurrency] = useState("")
  const [phone, setPhone] = useState("")
  const [load, setLoad] = useState(false)
  const [searchAskModal, setSearchAskModal] = useState(false)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [askStatus, setAskStatus] = useState("")
  const getBidStatus = () => {
    axios
      .get(`${config.baseUrl}/api/v1/bid/statuses`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data) {
          setBidStatusData(res.data);
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
    

  }


  
  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  const closeSearchAsk = () => {
    setSearchAskModal(false)
  }

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

  useEffect(() => {
    getBids();
    getBidsAll();
    getTransactionStatus();
  }, []);

  const getPaged = (queryString) => {
    axios
      .get(`${config.baseUrl}/api/v1/admin/bids/all?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setBidsData(
            res.data.records.map((data) => ({
              askReference: data.askReference,
              reference: data.reference,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              username: data.username,
              bidAmount:
                data.bidCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.bidAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.bidAmount),

              bidStatus: data.bidStatus,
              paymentStatus: data.paymentStatus,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getBids = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/bids/all?pageNumber=1&pageSize=100&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress&phoneNumber&startDate&endDate`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setBidsData(
            res.data.records.map((data) => ({
              askReference: data.askReference,
              reference: data.reference,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              username: data.username,
              bidAmount:
                data.bidCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.bidAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.bidAmount),

              bidStatus: data.bidStatus,
              paymentStatus: data.paymentStatus,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getBidsAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/bids/all?pageNumber=1&pageSize=999999999&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress&phoneNumber&startDate&endDate`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setBidsDataAll(
            res.data.records.map((data) => ({
              askReference: data.askReference,
              reference: data.reference,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              username: data.username,
              bidAmount:
                data.bidCurrency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.bidAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.bidAmount),

              bidStatus: data.bidStatus,
              paymentStatus: data.paymentStatus,
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
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress&phoneNumber&startDate&endDate`;
    getPaged(queryString);
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
              Bids
              <div>
              <Button
              type="button"
              class="btn btn-primary mr-2"
              style={{backgroundColor:'blue', color:'white'}}
              onClick={() => setSearchBidModal(true)}
            >
              Filter Bid
            </Button>
              <ExportCSV
                csvData={bidsDataAll}
                fileName={"Bid Data"}
              />
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={bidsData}
              fields={[
                { key: "askReference", name: "Ask Ref" },
                { key: "createdOn", name: "Date" },
                { key: "reference", name: "Bid Ref" },
                { key: "username", name: "Username" },
                { key: "bidAmount", name: "Bid Amount" },
                { key: "bidStatus", name: "Bid Status" },
                { key: "paymentStatus", name: "Payment Status" },
              ]}
              scopedSlots={
                ({
                  bidStatus: (item) => (
                    <td>
                      <CBadge color={getBadge(item.bidStatus)}>
                        {item.bidStatus}
                      </CBadge>
                    </td>
                  ),
                },
                {
                  paymentStatus: (item) => (
                    <td>
                      <CBadge color={getBadge(item.paymentStatus)}>
                        {item.paymentStatus}
                      </CBadge>
                    </td>
                  ),
                })
              }
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
        title={"Search Bids"}
        visible={searchBidModal}
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
