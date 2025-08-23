import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Modal,
  notification,
  Pagination,
  DatePicker,
  Select,
  Spin,
  Skeleton,
} from "antd";
import ReactJson from "react-json-view";
import moment from "moment";

import {
  CForm,
  CFormText,
  CCardFooter,
  CSelect,
  CAlert,
  CInputFile,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CFormGroup,
  CLabel,
  CRow,
  CInput,
  CTextarea,
  CButton,
} from "@coreui/react";
import { Button } from "antd";
import config from "../../config";
import axios from "axios";
var userRoles = sessionStorage.getItem("roleUser");
const { RangePicker } = DatePicker;

const AskRate = (props) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [virtuaalCardmodal, setChangeRateModalVirtual] = useState(false);
  const [dominated, setDominated] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const [askRate, setAskRate] = useState([]);
  const [changeRateModal, setChangeRateModal] = useState(false);
  const [historyChanges, setHistoryChanges] = useState([]);
  const [fill, setFill] = useState(false);
  const [lower, setLower] = useState("");
  const [cardrate, setCardRate] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [upper, setUpper] = useState("");
  const [changeHistoryModal, setchangeHistoryModal] = useState(false);
  const [reason, setReason] = useState("");
  const [id, setId] = useState("");
  const [configsData, setConfigsData] = useState([]);

  const closeHistory = () => {
    setchangeHistoryModal(false);
  };

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  const getPaged = (queryString) => {
    axios
      .get(`${config.baseUrl}/api/v1/admin/ask-rate/changelog?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoad(false);
        if (res.data) {
          setTotalItems(res.data.totalPages * 10);
          setHistoryChanges(
            res.data.records.map((data) => ({
              dateCreated: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              dateUpdated: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              updatedBy: data.changedBy,
              lower: data.lowerRate,
              upper: data.upperRate,
              updatedLower: data.updatedLowerRate,
              id: data.id,
              updatedUpper: data.updatedUpperRate,
              reason: data.reason,
            }))
          );
        }
      })
      .catch((err) => {
        setLoad(false);

        if (err) {
          setError(true);
          setMsg(err.response.data.message);
        }
      });
  };

  const getChangesHistory = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/ask-rate/changelog?startDate&endDate&pageNumber=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.data) {
          setchangeHistoryModal(true);
          setTotalItems(res.data.totalPages * 10);
          setHistoryChanges(
            res.data.records.map((data) => ({
              dateCreated: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              dateUpdated: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              updatedBy: data.changedBy,
              lower: data.lowerRate,
              upper: data.upperRate,
              updatedLower: data.updatedLowerRate,
              id: data.id,
              updatedUpper: data.updatedUpperRate,
              reason: data.reason,
            }))
          );
        }
      })
      .catch((err) => {
        setLoad(false);

        if (err) {
          setError(true);
          setMsg(err.response.data.message);
        }
      });
  };

  const searchDate = () => {
    const queryString = `startDate=${startDate}&endDate=${endDate}&pageNumber=${page}&pageSize=10`;
    getPaged(queryString);
  };

  const getConfigs = () => {
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

  const getAskRate = () => {
    axios
      .get(`${config.baseUrl}/api/v1/admin/ask-rate`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoad(false);
        if (res.data) {
          setLoad(false);
          setTotalItems(res.data.totalPages * 10);
          setAskRate(
            res.data.map((data) => ({
              dominatedCurrency: data.dominatedCurrency,
              lowerRate: data.lowerRate,
              id: data.id,
              upperRate: data.upperRate,
              lastModifiedOn: moment(data.lastModifiedOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              rateParticipant: data.rateParticipant,
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
          setError(true);
          setMsg(err.response.data.message);
        }
      });
  };

  const changeRate = () => {
    const data = {
      lowerRate: lower,
      upperRate: upper,
      reason,
      id: id,
    };
    if (data.reason) {
      setLoad(true);
      axios
        .put(
          `${config.baseUrl}/api/v1/admin/ask-rate/change`,
          {
            lowerRate: lower,
            upperRate: upper,
            reason,
            id: id,
            dominatedCurrency: dominated,
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
            setMsg("Ask Rate Changed Successfully");
            setReason("");
            setError(false);
            setTimeout(() => {
              setMsg("");
              setChangeRateModal(false);
              setSuccess(false);
            }, 2500);
            getAskRate();
          }
        })
        .catch((err) => {
          setLoad(false);
          if (err) {
            setError(true);
            setMsg(err.response.data.message);
          }
        });
    } else {
      setFill(true);
      setTimeout(() => {
        setFill(false);
      }, 2000);
    }
  };

  useEffect(() => {
    getAskRate();
    getConfigs();
  }, []);

  const closeChangeRate = () => {
    setChangeRateModal(false);
  };

  const pagination = (page, pageSize) => {
    setPage(page);
    const queryString = `startDate=${startDate}&endDate=${endDate}&pageNumber=${page}&pageSize=10`;
    getPaged(queryString);
  };

  const closeRatecHANGE = () => {
    setChangeRateModalVirtual(false)
    setCardRate("")
  }

  const openChangeRate = (item) => {
    console.log(item);
    setChangeRateModal(true);
    setLower(item.lowerRate);
    setUpper(item.upperRate);
    setId(item.id);
    setDominated(item.dominatedCurrency);
  };
  const seeChangeLog = () => {
    getChangesHistory();
  };

  const configureNgnRate = () => {
    const data = {
      exchangeCurrency: "USD_TO_NGN",
      amount: cardrate,
    };
    if (data.amount) {
      setLoad(true);
      axios
        .post(`${config.baseUrl}/api/v1/admin/exchange-rate`, data, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setLoad(false);
          if (res.status === 200) {
            setSuccess(true);
            setMsg("NGN_USD Virtual Card Rate Changed Successfully.");
            setReason("");
            setCardRate(false);
            setError(false);
            setTimeout(() => {
              setMsg("");
              setChangeRateModalVirtual(false);
              setSuccess(false);
            }, 2500);
          }
        })
        .catch((err) => {
          setLoad(false);
          if (err) {
            setError(true);
            setMsg(err.response.data.message);
          }
        });
    } else {
      setFill(true);
      setTimeout(() => {
        setFill(false);
      }, 2000);
    }
  };
  return (
    <CRow>
      <CCol className="">
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>Ask Rate</div>
              <Button type="primary" onClick={seeChangeLog}>
                See Ask Changes Log
              </Button>
              <Button
                type="primary"
                onClick={() => setChangeRateModalVirtual(true)}
              >
                Configure Virutal Card Rate (NGN_TO_USD)
              </Button>
            </div>
          </CCardHeader>

          <CCardBody>
            {/* {askRate.lowerRate ? (
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <p>Date Created</p>
                  <p>
                    {moment(askRate.dateCreated).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </p>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Date Updated</p>
                  <p>
                    {moment(askRate.lastModifiedOn).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </p>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Lower Limit</p>
                  <p>{askRate.lowerRate}</p>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Date Upper Limit</p>
                  <p>{askRate.upperRate}</p>
                </div>

                <br />
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 pt-5 pb-5">
                Fetching Rates No Ask Rate Yet
              </div>
            )}

            {askRate.lowerRate && (
              <div className="d-flex justify-content-end align-items-center mb-2">
                <Button type="primary" onClick={openChangeRate}>
                  Change Ask Rate
                </Button>
              </div>
            )} */}

            <CDataTable
              items={askRate}
              fields={[
                { key: "createdOn", name: "Created On" },
                { key: "dominatedCurrency", name: "Dominated Currency" },
                { key: "lowerRate", name: "Lower Rate" },
                { key: "upperRate", name: "Upper Rate" },
                { key: "rateParticipant", name: "Rate Participant" },
                { key: "lastModifiedOn", name: "Last Modified" },

                { key: "action", name: "Action" },
              ]}
              scopedSlots={{
                action: (item) => (
                  <td>
                    <Button
                      type="primary"
                      onClick={openChangeRate.bind(this, item)}
                    >
                      Change Ask Rate{" "}
                    </Button>
                  </td>
                ),
              }}
            />
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
        title={"Change Ask Rate"}
        visible={changeRateModal}
        footer={null}
        maskClosable={false}
        onCancel={closeChangeRate}
      >
        <div className="text-center">
          {fill && (
            <div className="text-center text-danger">Reason is required </div>
          )}
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
        </div>
        <CFormGroup>
          <CLabel htmlFor="name">Lower Limit</CLabel>
          <CInput
            id="number"
            type="text"
            required
            onChange={(e) => setLower(e.target.value)}
            value={lower}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Upper Limit</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setUpper(e.target.value)}
            value={upper}
          />
        </CFormGroup>
        {configsData.supportedCurrency && (
          <CFormGroup>
            <CLabel htmlFor="name">Dominated Currency</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setDominated(e.target.value)}
              value={dominated}
            >
              <option selected>Select</option>
              {configsData.supportedCurrency.map((currency) => {
                return <option>{currency}</option>;
              })}
            </CSelect>{" "}
          </CFormGroup>
        )}
        <CFormGroup>
          <CLabel htmlFor="name">Reason</CLabel>
          <CTextarea
            id="name"
            type="text"
            required
            onChange={(e) => setReason(e.target.value)}
            value={reason}
          />
        </CFormGroup>

        <div className="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={changeRate}
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
              "Submit"
            )}
          </button>
        </div>
      </Modal>

      <Modal
        title={`Configure Virtual Card Rate`}
        visible={virtuaalCardmodal}
        footer={null}
        maskClosable={false}
        onCancel={closeRatecHANGE}
        width={400}
        style={{ marginTop: "1rem" }}
      >
        <CFormGroup>
          <CLabel htmlFor="name">NGN_TO_USD Rate (Virtual Card)</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setCardRate(e.target.value)}
            value={cardrate}
          />
        </CFormGroup>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={configureNgnRate}
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
              "Submit"
            )}
          </button>
        </div>
      </Modal>

      <Modal
        title={`Ask Changes History`}
        visible={changeHistoryModal}
        footer={null}
        maskClosable={false}
        onCancel={closeHistory}
        width={"80%"}
        style={{ marginTop: "1rem" }}
      >
        <div className="d-flex justify-content-end align-items-center ">
          <RangePicker onChange={onChange} />
          <Button type="primary" onClick={searchDate}>
            Search
          </Button>
        </div>
        {load ? (
          <Skeleton active={true} block={true} />
        ) : (
          <div className="pt-3 pb-5">
            <CDataTable
              items={historyChanges}
              fields={[
                { key: "dateCreated", name: "Date Created" },
                { key: "dateUpdated", name: "Date Updated" },
                { key: "updatedBy", name: "Changed By" },
                { key: "lower", name: "lowerRate" },
                { key: "upper", name: "upperRate" },
                { key: "updatedLower", name: "Updated Lower Rate" },
                { key: "updatedUpper", name: "Updated Upper Rate" },
                { key: "reason", name: "Reason" },
              ]}
            />
            <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                defaultPageSize={10}
                onChange={pagination}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </CRow>
  );
};

export default AskRate;
