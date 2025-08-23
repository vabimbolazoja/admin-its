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
  CLabel,
  CFormGroup,
  CButton,
  CSelect,
  CPagination,
} from "@coreui/react";
import config from "../../config";
import axios from "axios";
import { ExportCSV } from "../../containers/Exportcsv";
import moment from "moment";
import CIcon from "@coreui/icons-react";
import { Pagination, Button, Modal, DatePicker } from "antd";
const { RangePicker } = DatePicker;

const Users = () => {
  const history = useHistory();

  const [settlementsData, setSettlementsData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [settlementsDataAll, setSettlementsDataAll] = useState([]);
  const [filter, setFilter] = useState(false);
  const [load, setLoad] = useState(false);
  const [provider, setProvider] = useState("");
  const [reference, setReference] = useState("");
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

  const pagination = (page, pageSize) => {
    console.log(page);
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}&transactionStatus=${
      transactionStatus === "Select" ? "" : transactionStatus
    }&provider=${provider === "Select" ? "" : provider}&reference=${reference}`;
    getPaged(queryString);
  };

  const searchSettlmentsFilter = (e) => {
    e.preventDefault();
    setLoad(true);
    const queryString = `pageNumber=${page}&pageSize=100&startDate=${startDate}&endDate=${endDate}&transactionStatus=${
      transactionStatus === "Select" ? "" : transactionStatus
    }&provider=${provider === "Select" ? "" : provider}&reference=${reference}`;
    getPaged(queryString);
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
        `${config.baseUrl}/api/v1/admin/transactions/settlement?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setFilter(false);
        setLoad(false)
        if (res.status === 200) 
        {

          setTotalItems(res.data.totalPages * 10);
          setSettlementsData(
            res.data.records.map((data) => ({
              transactionReference: data.transactionReference,
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              feeAmount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.feeAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.feeAmount),
              provider: data.provider.replace("_", " "),
              transactionStatus: data.transactionStatus,
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
    setProvider("");
    setReference("");
    setStartDate("");
    setEndDate("");
    setTransactionStatus("");
    setFilter(false);
  };

  useEffect(() => {
    getSettlemts();
    getSettlemtsAll();
    getTransactionStatus();
  }, []);

  const getSettlemts = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/settlement?pageNumber=1&pageSize=100`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setSettlementsData(
            res.data.records.map((data) => ({
              transactionReference: data.transactionReference,
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              feeAmount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.feeAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.feeAmount),
              provider: data.provider.replace("_", " "),
              transactionStatus: data.transactionStatus,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getSettlemtsAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/settlement?pageNumber=1&pageSize=999999999`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setSettlementsDataAll(
            res.data.records.map((data) => ({
              transactionReference: data.transactionReference,
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              feeAmount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.feeAmount)
                  : "$" + Intl.NumberFormat("en-US").format(data.feeAmount),
              provider: data.provider.replace("_", " "),
              transactionStatus: data.transactionStatus,
            }))
          );
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
              {" "}
              <p>Settlements Transactions </p>{" "}
              <div>
                <Button
                  type="primary"
                  onClick={() => setFilter(true)}
                  style={{ backgroundColor: "blue", color: "white" }}
                  className="mr-2"
                >
                  Filter Settlemts
                </Button>
                <ExportCSV
                  csvData={settlementsDataAll}
                  fileName={"Settlement Transactions Data"}
                />
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={settlementsData}
              fields={[
                { key: "transactionReference", name: "Transaction Ref" },
                { key: "date", name: "Satrt Date" },
                { key: "feeAmount", name: "Fee Amount" },
                { key: "provider", name: "Provider" },
                { key: "transactionStatus", name: "Transaction Status" },
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
              title={"Filter Settlements"}
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
                    onClick={searchSettlmentsFilter}
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
