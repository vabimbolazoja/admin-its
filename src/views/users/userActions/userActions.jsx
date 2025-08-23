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

const UserActions = (props) => {
  const [usersData, setUserData] = useState([]);
  const userEmail = props.userEmail ? props.userEmail : "";
  const page = props.page ? props.page : 1;
  const status = props.status ? props.status : "";
  const code = props.code ? props.code : "";
  const [load, setLoad] = useState(false);
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const [reasonBox, setReasonBox] = useState(false);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [customerBalance, setCustomerBalance] = useState([]);
  const [kycInfo, setKycInfo] = useState({});

 

  const getUsers = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/traderx-users/all?pageNumber=${page}&pageSize=10&identityVerificationStatus=&accountType=&country&email=`,
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
              createdOn: data.createdOn ? data.createdOn.slice(0, 10) : "",
              firstName: data.firstName,
              lastName: data.lastName,
              emailAddress: data.emailAddress,
              phoneNumber: data.phoneNumber,
              country: data.country,
              accountType: data.accountType,
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
        `${config.baseUrl}/api/v1/admin/traderx-users/lock-user-account/${id}`,
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
          setMsg("User Account Locked Successfully");
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

  const accountUnlocked = (id) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/traderx-users/unlock-user-account/${id}`,
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
          accountLock(code);
        }
      },
      onCancel() {},
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


  console.log(kycInfo);

  return (
    <CRow>
      <CCol>
        <CCard>
          {load && (
            <div className="text-center pt-5">
              <Spin />
            </div>
          )}
          <CCardBody>
            {error && <CAlert color="danger">{msg}</CAlert>}
            {success && <CAlert color="success">{msg}</CAlert>}
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
              <button
                type="button"
                class="btn btn-warning"
                onClick={changeStatusConfirmPid}
              >
                {status === "ACTIVE" ? "Place PND" : "Remove PND"}
              </button>{" "}
              <button
                type="button"
                class="btn btn-success"
                onClick={changeStatusConfirmEmail}
              >
                Trigger Welcome Email
              </button>{" "}
              <Link
                to={{
                  pathname: "/proxy_transfer",
                  state: userEmail,
                }}
              >
                <button type="button" class="btn btn-primary">
                  Initiate Transfer
                </button>
              </Link>
            </div>
          </CCardBody>
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
    </CRow>
  );
};

export default UserActions;
