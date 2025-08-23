import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification, Pagination, Select, DatePicker } from "antd";
import ReactJson from "react-json-view";

import {
  CForm,
  CFormText,
  CCardFooter,
  CAlert,
  CInputFile,
  CCard,
  CCardBody,
  CSelect,
  CCardHeader,
  CCol,
  CDataTable,
  CFormGroup,
  CLabel,
  CBadge,
  CRow,
  CInput,
  CTextarea,
  CButton,
} from "@coreui/react";
import config from "../../config";
import moment from "moment";
import axios from "axios";
var userRoles = sessionStorage.getItem("roleUser");
const { RangePicker } = DatePicker;

const getBadgeLevel = (status) => {
  switch (status) {
    case "HIGH":
      return "success";
    case "MEDIUM":
      return "warning";
    case "LOW":
      return "primary";
    default:
      return "primary";
  }
};

const getBadgeState = (status) => {
  switch (status) {
    case "OPEN":
      return "success";
    case "CLOSE":
      return "danger";
   
    default:
      return "primary";
  }
};


const Users = () => {
  const history = useHistory();

  const [usersKycData, setUserData] = useState([]);
  const [alertLevel, setAlertLevel] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [systemAlertModal, setSystemAlertModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [kycInfo, setKycInfo] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [amount, setAmount] = useState("");
  const [load, setLoad] = useState(false);
  const [verificationReasonsDatas, setVerificationReasonsData] = useState([]);
  const [declineModal, setDecline] = useState(false);
  const [reason, setReason] = useState("");
  const [userId, setUserId] = useState("");
  const [loadView, setLoadView] = useState(false);
  const [providerDetails, setProviderDetails] = useState({});
  const [msg, setMsg] = useState("");
  const [fill, setFill] = useState(false);
  const [reasonsMulti, setReasonsMutli] = useState("");
  const [viewProviderModal, setViewProviderModal] = useState(false);

  const closeViewProvider = () => {
    setViewProviderModal(false);
  };

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");

  const { Option } = Select;

  const verificationReasonSelect = [];
  verificationReasonsDatas.map((reason) => {
    verificationReasonSelect.push(
      <Option key={reason}>{reason.replace("_", " ")}</Option>
    );
  });

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  function handleChange(value) {
    setReasonsMutli(value);
  }

  const getKycPaged = (queryString) => {
    axios
      .get(`${config.baseUrl}/api/v1/admin/traderx-users/all?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUserData(
            res.data.records.map((data) => ({
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              lastModifiedOn:  moment(data.lastModifiedOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              message: data.message,
              systemAlertLevel: data.systemAlertLevel,
              systemAlertState: data.systemAlertState,
              id:data.id,

             
            }))
          );
          setTotalItems(res.data.totalPages * 10);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const verificationReasons = () => {
    axios
      .get(`${config.baseUrl}/api/v1/configurations`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setVerificationReasonsData(res.data.verificationFailureReasonTypes);
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
    const queryString = `systemAlertLevel=${alertLevel}&systemAlertState=${alertStatus}&pageSize=10&pageNumber=${page}&startDate=${startDate}&endDate=${endDate}`;
    getKycPaged(queryString);
  };

  const closeDecline = () => {
    setDecline(false);
    setReason("");
    setReasonsMutli("");
  };

  const openDecline = (id) => {
    setUserId(id);
    setDecline(true);
    setReason("");
  };

  const closeView = () => {
    setViewModal(false);
  };

  useEffect(() => {
    getSystemAlerts();
  }, []);

  const viewProviderFunc = () => {
    setViewProviderModal(true);
  };

  const getSystemAlerts = () => {
    axios
      .get(
        `${config.baseUrl}/api/vGated/admin/system-alerts/paged?pageNumber=1&pageSize=0`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setUserData(
            res.data.records.map((data) => ({
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              lastModifiedOn:  moment(data.lastModifiedOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              message: data.message,
              systemAlertLevel: data.systemAlertLevel,
              systemAlertState: data.systemAlertState,
              id:data.id,

             
            }))
          );
          setTotalItems(res.data.totalPages * 10);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };
  const changeStatusConfirm = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to close this alert?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        close(id);
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
        `${config.baseUrl}/api/v1/admin/verification/approve/${id}`,
        {},
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
          setMsg("User Kyc Approved Successfully");
          getSystemAlerts();
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

  const close = (id, e) => {
      setLoad(true);
      axios
        .put(
          `${config.baseUrl}/api/vGated/admin/system-alerts/close/${id}`,
          {
            reason: reason,
            verificationTypeReasons: reasonsMulti,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setLoad(true);
          setReason("");
          if (res.status === 201) {
            setSuccess(true);
            setLoad(false);
            setTimeout(() => {
              setSuccess(false);
            }, 3000);
            setReasonsMutli("");
            setMsg("System Alert Closed Successfully");
            getSystemAlerts();
            setError(false);
            setDecline(false);
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
          }
        });
    
  };

  const searchAlertSystem = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/system-alerts?systemAlertLevel=${alertLevel}&systemAlertState=${alertStatus}&pageSize=10&pageNumber=1&startDate=${startDate}&endDate=${endDate}`,
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
          setSystemAlertModal(false);
          setUserData(
            res.data.records.map((data) => ({
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              lastModifiedOn:  moment(data.lastModifiedOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              message: data.message,
              systemAlertLevel: data.systemAlertLevel,
              id:data.id,
              systemAlertState: data.systemAlertState,
             
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
          setLoad(false);
        }
      });
  };

  const closeSearchAlerts = () => {
    systemAlertModal(false);
    setAlertLevel("")
    setAlertStatus("")
  };

  const view = (id, e) => {
    console.log(id);
    setLoadView(true);
    axios
      .get(`${config.baseUrl}/api/v1/admin/verification/details/${id.code}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          console.log(res.data.providerKycResponseData);
          const infoProvider = res.data.providerKycResponseData
            ? JSON.parse(res.data.providerKycResponseData)
            : false;
          console.log(infoProvider);
          setViewModal(true);
          setProviderDetails(infoProvider);
          setKycInfo(res.data);
        }
      })
      .catch((err) => {
        setLoad(false);
        Notification("error", "Error", "Connection Error");
        if (err) {
        }
      });
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
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <p>System Alerts</p>
              <button
                type="button"
                class="btn btn-primary mr-2"
                onClick={() => setSystemAlertModal(true)}
              >
                Search
              </button>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={usersKycData}
              fields={[
               
                { key: "createdOn", name: "Created On" },
                { key: "lastModifiedOn", name: "Updated On" },


                {
                  key: "message",
                  name: "Message",
                },
                {
                  key: "systemAlertLevel",
                  name: "System Alert Level",
                },
                {
                  key: "systemAlertState",
                  name: "System Alert State",
                },

             
                {
                  key: "Actions",
                  name: "Actions",
                },
              ]}
              scopedSlots={{
                Actions: (item) => (
                  <td className="d-flex">
                    {item.systemAlertState === "OPEN" && (
                      <button
                        type="button"
                        class="btn btn-primary"
                        onClick={changeStatusConfirm.bind(this, item.id)}
                      >
                        Close
                      </button>
                    )}
                  </td>
                ),
                systemAlertLevel: (item) => (
                  <td>
                    <CBadge color={getBadgeLevel(item.systemAlertLevel)}>
                      {item.systemAlertLevel}
                    </CBadge>
                  </td>
                ),
                systemAlertState: (item) => (
                  <td>
                    <CBadge color={getBadgeState(item.systemAlertState)}>
                      {item.systemAlertState}
                    </CBadge>
                  </td>
                ),
              }}
            />
            <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                defaultPageSize={10}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                onChange={pagination}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={"Decline User"}
        visible={declineModal}
        footer={null}
        maskClosable={false}
        onCancel={closeDecline}
      >
        <div className="container">
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
          {fill && (
            <p className="text-danger text-center">Reason is required </p>
          )}
          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="name">Reason for Declining</CLabel>
                <CTextarea
                  name="textarea-input"
                  id="textarea-input"
                  rows="6"
                  onChange={(e) => setReason(e.target.value)}
                  value={reason}
                />{" "}
              </CFormGroup>
            </CCol>
          </CRow>
          <br />
          <label>Verification Type Reason</label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            value={reasonsMulti}
            defaultValue={[]}
            onChange={handleChange}
          >
            {verificationReasonSelect}
          </Select>
          <br />
          <br />

          <CButton block color="danger" >
            {load ? (
              <div
                class="spinner-border"
                role="status"
                style={{ width: "1rem", height: "1rem" }}
              >
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              "Decline"
            )}
          </CButton>
        </div>
      </Modal>

      <Modal
        title={"Search System Alerts"}
        visible={systemAlertModal}
        footer={null}
        maskClosable={false}
        onCancel={closeSearchAlerts}
      >
        <CFormGroup>
          <CLabel htmlFor="name">System Alert Level</CLabel>
          <CSelect
            custom
            name="ccmonth"
            id="ccmonth"
            onChange={(e) => setAlertLevel(e.target.value)}
            value={alertLevel}
          >
            <option selected>Select</option>
            <option>HIGH</option>
            <option>MEDIUM</option>
            <option>LOW</option>
          </CSelect>{" "}
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="name">System Alert States</CLabel>
          <CSelect
            custom
            name="ccmonth"
            id="ccmonth"
            onChange={(e) => setAlertStatus(e.target.value)}
            value={alertStatus}
          >
            <option selected>Select</option>
            <option>OPEN</option>
            <option>CLOSE</option>
          </CSelect>{" "}
        </CFormGroup>
        <br />
          <RangePicker style={{ width: "100%" }} onChange={onChange} />
          <br />

        <div className="d-flex justify-content-end mt-3">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={searchAlertSystem}
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
