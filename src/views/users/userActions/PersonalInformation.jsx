import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification, Pagination, Select, Spin } from "antd";
import ReactJson from "react-json-view";
import { Link } from "react-router-dom";
import moment from "moment";

import {
  CForm,
  CFormText,
  CCardFooter,
  CAlert,
  CInputFile,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CSelect,
  CDataTable,
  CFormGroup,
  CLabel,
  CRow,
  CInput,
  CTextarea,
  CButton,
} from "@coreui/react";
import config from "../../../config";
import axios from "axios";
var userRoles = sessionStorage.getItem("roleUser");
const role = sessionStorage.getItem("roleUser");

const PersonalInformation = (props) => {
  const [usersData, setUserData] = useState([]);
  const [manualLink, setOpenAccountLink] = useState(false);
  const [friendlyName, setFName] = useState("");
  const userEmail = props.userEmail ? props.userEmail : "";
  const [accId, setAccId] = useState("");
  const page = props.page ? props.page : 1;
  const [pushNotificationModal, setPushNotificationModal] = useState(false);
  const [notificationName, setNotificationName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const status = props.status ? props.status : "";
  const code = props.code ? props.code : "";
  const [load, setLoad] = useState(false);
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const [reasonBox, setReasonBox] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [lockModal, setLockModal] = useState(false);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [customerBalance, setCustomerBalance] = useState([]);
  const [kycInfo, setKycInfo] = useState({});
  const [emailAcc, setEmailAcc] = useState("");
  const [routingNumAcc, seRoutingNumAcc] = useState("");
  const [accNum, setAccNum] = useState("");
  const [accName, setAccName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accType, setAccType] = useState("");

  const openNotificationWithIcon = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
    });
  };

  const closeManualLink = () => {
    setOpenAccountLink(false);
    setBankName("");
    setAccName("");
    setAccNum("");
    seRoutingNumAcc("");
    setAccType("");
  };


  const cancelLockReason = () => {
    setLockModal(false);
  };

  const getUsers = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/vGated/admin/app-users/paged?pageNumber=1&pageSize=99999999&startDate=&endDate=&identityVerificationStatus=&countryCode=&phoneNumber=&name=&status=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setUserData(
            res.data.records.map((data) => ({
              code: data.code,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              country: data.countryCode,
              identityVerificationStatus: data.identityVerificationStatus,
              status: data.status,
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

  const accountLock = (id) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/vGated/admin/app-users/lock-user-account/${userEmail}/${lockReason}`,
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
          setLockModal(false);
          setSuccess(true);
          setMsg("User Account Locked Successfully");
          openNotificationWithIcon(
            "success",
            "Success",
            "User Account Locked Successfully"
          );
          getUsers();
          setError(false);
          setTimeout(() => {
            setSuccess(false);
            window.location.href = "/users";
          }, 2500);
        }
      })
      .catch((err) => {
        setLoad(false);
        setSuccess(false);
        if (err.response !== undefined) {
          setMsg(err.response.data.message);
          openNotificationWithIcon(
            "error",
            "Error",
            err?.response?.data?.message
          );
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

  const linkManual = () => {
    if (bankName && accType && routingNumAcc && accName && accNum && friendlyName && accId)
      setLoad(true);
    axios
      .post(
        `${config.baseUrl}/api/v1/adj/blue-gate/direct-link-account`,
        {
          emailAddress: userEmail,
          accountNumber: accNum,
          routingNumber: routingNumAcc,
          accountId: accId,
          accountType: accType,
          friendlyName: friendlyName,
          accountNme: accName,
          bankName: bankName,
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
          setMsg("User Account Linked Successfully");
          openNotificationWithIcon(
            "success",
            "Success",
            "User Account Linked Successfully"
          );
          getUsers();
          setError(false);
          setTimeout(() => {
            setSuccess(false);
            window.location.href = "/users";
          }, 2500);
        }
      })
      .catch((err) => {
        setLoad(false);
        setSuccess(false);
        if (err.response !== undefined) {
          setMsg(err.response.data.message);
          openNotificationWithIcon(
            "error",
            "Error",
            err?.response?.data?.message
          );
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

  const accountUnlocked = (id) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/vGated/admin/app-users/unlock-user-account/${userEmail}`,
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
          setMsg("User Account Unlocked Successfully");
          openNotificationWithIcon(
            "success",
            "Success",
            "User Account Unlocked Successfully"
          );
          getUsers();
          setError(false);
          setTimeout(() => {
            setSuccess(false);
            window.location.href = "/users";
          }, 2500);
        }
      })
      .catch((err) => {
        setLoad(false);
        setSuccess(false);
        if (err.response !== undefined) {
          setMsg(err.response.data.message);
          openNotificationWithIcon(
            "error",
            "Error",
            err?.response?.data?.message
          );
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

  const changeStatusConfirmSecurity = (e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to ${
        status === "LOCKED" ? "Unlock" : "Lock"
      } this user?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (status === "LOCKED") {
          accountUnlocked(code);
        } else {
          setLockModal(true);
        }
      },
      onCancel() {},
    });
  };

  const onReachOut = (e) => {
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/traderx-users/reach-out/${code}/${e.target.checked}`,
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
          setMsg("User Account Marked for Called Successfully");
          openNotificationWithIcon(
            "success",
            "Success",
            "User Account Marked for Called Successfully"
          );
          getUsers();
          setError(false);
          setTimeout(() => {
            setSuccess(false);
            window.location.href = "/users";
          }, 2500);
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

  const changeStatusConfirmPid = (e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to ${
        status === "ACTIVE" ? "put" : "remove"
      } this user on PND?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (status === "ACTIVE") {
          setReasonBox(true);
          setUserId(code);
          // placeAccountPid(id.code)
        } else {
          removeAccountPid(code);
        }
      },
      onCancel() {},
    });
  };
  const placeAccountPid = () => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/traderx-users/place-user-account-on-pnd/${userId}/${reason}`,
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
          setLoad(false);
          setReasonBox(false);
          setMsg("User Account Placed on PID Successfully");
          getUsers();
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

  const cancelReason = () => {
    setReason("");
    setReasonBox(false);
  };

  const removeAccountPid = (id, e) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/traderx-users/remove-pnd-on-account/${id}`,
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
          setMsg("User Account Removed on PID Successfully");
          getUsers();
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

  const changeStatusConfirmEmail = (e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to triger welcome email ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        triggerEmail(code);
      },
      onCancel() {},
    });
  };

  const changeStatusConfirmNotification = (e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to triger push notification for this user ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        triggerEmail(code);
        triggerNotification(code);
      },
      onCancel() {},
    });
  };

  const cancelPushNotification = () => {
    setPushNotificationModal(false);
    setTitle("");
    setContent("");
    setNotificationName("");
  };

  const triggerNotification = () => {
    if (notificationName && title && content) {
      setLoad(true);
      axios
        .put(
          `${config.baseUrl}/api/v1/admin/traderx-users/trigger-push-notification`,
          {
            userCode: code,
            name: notificationName,
            title: title,
            content: content,
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
            setPushNotificationModal(false);
            setMsg("Push Notification Triggered Successfully");
            getUsers();
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
    }
  };

  const triggerEmail = (id, e) => {
    console.log(id);
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/traderx-users/trigger-welcome-email/${id}`,
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
          setMsg("Email Triggered Successfully");
          getUsers();
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

  useEffect(() => {
    getUsers();
  }, []);

  const userInfo = usersData.find((x) => x.code === userEmail);

  return (
    <CRow>
      <CCol>
        <CCard>
          {load && (
            <div className="text-center pt-5">
              <Spin />
            </div>
          )}
          {userInfo ? (
            <CCardBody>
              {error && <CAlert color="danger">{msg}</CAlert>}
              {success && <CAlert color="success">{msg}</CAlert>}
              {usersData.length > 0 ? (
                <div className="">
                  <CForm
                    action=""
                    method="post"
                    encType="multipart/form-data"
                    className="form-horizontal"
                  >
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel>First Name</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {userInfo.firstName
                            ? userInfo.firstName
                            : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel>Last Name</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {userInfo.lastName
                            ? userInfo.lastName
                            : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="text-input">Phone Number </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {userInfo.phoneNumber ? userInfo.phoneNumber : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="email-input">Country</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {userInfo.country
                            ? userInfo.country.replace("_", " ")
                            : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>
             
                    <br />
                  </CForm>
                  <br />
                  <hr />
                    <div>
                      <h4>User Actions</h4>
                      <br />
                      <button
                        type="button"
                        class="btn btn-danger"
                        onClick={changeStatusConfirmSecurity}
                      >
                        {status === "LOCKED" ? "Unlock User" : "Lock User"}
                      </button>{" "}
                    
                  
                    </div>
                
                </div>
              ) : (
                <div className="text-center pt-5">
                  <p>user Informations Not Available Yet</p>
                </div>
              )}
            </CCardBody>
          ) : (
            <CCardBody></CCardBody>
          )}
        </CCard>
      </CCol>

      <Modal
        title="Reason For PND"
        visible={reasonBox}
        footer={false}
        onCancel={cancelReason}
      >
        <CFormGroup row>
          <CCol md="3">
            <CLabel htmlFor="textarea-input">Reason</CLabel>
          </CCol>
          <CCol xs="12" md="9">
            <CTextarea
              name="textarea-input"
              id="textarea-input"
              onChange={(e) => setReason(e.target.value)}
              value={reason}
              rows="9"
              placeholder="Content..."
            />
          </CCol>
        </CFormGroup>

        <CButton onClick={placeAccountPid} type="button" color="success">
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
        </CButton>
      </Modal>

      <Modal
        title="Reason For Lock"
        visible={lockModal}
        footer={false}
        onCancel={cancelLockReason}
      >
        <CFormGroup row>
          <CCol md="3">
            <CLabel htmlFor="textarea-input">Reason</CLabel>
          </CCol>
          <CCol xs="12" md="9">
            <CTextarea
              name="textarea-input"
              id="textarea-input"
              onChange={(e) => setLockReason(e.target.value)}
              value={lockReason}
              rows="9"
              placeholder="Content..."
            />
          </CCol>
        </CFormGroup>

        <CButton onClick={accountLock} type="button" color="success">
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
        </CButton>
      </Modal>

      <Modal
        title="Push Notification"
        visible={pushNotificationModal}
        footer={false}
        onCancel={cancelPushNotification}
      >
        <div className="text-center">
          {error && <CAlert color="danger">{msg}</CAlert>}
          {success && <CAlert color="success">{msg}</CAlert>}
        </div>
        <CFormGroup>
          <CLabel htmlFor="name">Notification Name</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setNotificationName(e.target.value)}
            value={notificationName}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Notification Title</CLabel>
          <CInput
            id="name"
            type="text"
            requirede
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Notification Content</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
        </CFormGroup>
        <br />

        <CButton onClick={triggerNotification} type="button" color="success">
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
        </CButton>
      </Modal>

      <Modal
        title="Link Account Manually"
        visible={manualLink}
        footer={false}
        onCancel={closeManualLink}
      >
        <div className="text-center">
          {error && <CAlert color="danger">{msg}</CAlert>}
          {success && <CAlert color="success">{msg}</CAlert>}
        </div>
        <CFormGroup>
          <CLabel htmlFor="name">Email Address </CLabel>
          <CInput id="name" type="text" disabled required value={userEmail} />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="name">Account Number</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setAccNum(e.target.value)}
            value={accNum}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Account ID</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setAccId(e.target.value)}
            value={accId}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Routing Number</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => seRoutingNumAcc(e.target.value)}
            value={routingNumAcc}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="name">Account Type</CLabel>
          <CSelect
            custom
            name="ccmonth"
            id="ccmonth"
            onChange={(e) => setAccType(e.target.value)}
            value={accType}
          >
            <option selected>Select</option>
            <option>personalChecking</option>
            <option>businessChecking</option>
            <option>personalSavings</option>
            <option>businessSavings</option>
          </CSelect>{" "}
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="name">Account Name</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setAccName(e.target.value)}
            value={accName}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Friendly Name</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setFName(e.target.value)}
            value={friendlyName}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Bank Name</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setBankName(e.target.value)}
            value={bankName}
          />
        </CFormGroup>
        <br />

        <CButton onClick={linkManual} type="button" color="success">
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
        </CButton>
      </Modal>
    </CRow>
  );
};

export default PersonalInformation;
