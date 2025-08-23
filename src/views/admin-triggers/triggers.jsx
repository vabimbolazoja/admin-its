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

const AdminTrigger = (props) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [adminTrigger, setAdminTrigger] = useState({});
  const [changeRateModal, setChangeRateModal] = useState(false);
  const [historyChanges, setHistoryChanges] = useState([]);
  const [lower, setLower] = useState("");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [upper, setUpper] = useState("");
  const [changeHistoryModal, setchangeHistoryModal] = useState(false);
  const [reason, setReason] = useState("");

  const getAdminTrigger = () => {
    axios
      .get(`${config.baseUrl}/api/v1/admin/trigger`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoad(false);
        if (res.data) {
          setAdminTrigger(res.data);
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

  const enableGlobalWithdraw = (currency) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/trigger/enable/global-withdrawal/${currency}`,
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
          setMsg(`Global ${currency} Withdrawal Enabled Successfully`);
          setReason("");
          setError(false);
          setTimeout(() => {
            setMsg("");
            setChangeRateModal(false);
            setSuccess(false);
          }, 2500);
          getAdminTrigger();
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
          setError(true);
          setMsg(err.response.data.message);
          setTimeout(() => {
            setMsg("");
            setChangeRateModal(false);
            setError(false);
          }, 2500);
        }
      });
  };

  const disableGlobalWithdrawal = (currency) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/trigger/disable/global-withdrawal/${currency}`,
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
          setMsg(`Global ${currency} Withdrawal Disabled Successfully`);
          setReason("");
          setError(false);
          setTimeout(() => {
            setMsg("");
            setChangeRateModal(false);
            setSuccess(false);
          }, 2500);
          getAdminTrigger();
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
          setError(true);
          setMsg(err.response.data.message);
          setTimeout(() => {
            setMsg("");
            setChangeRateModal(false);
            setError(false);
          }, 2500);
        }
      });
  };

  const enableGlobalDeposit = (currency) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/trigger/enable/global-deposit/${currency}`,
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
          setMsg(`Global ${currency} Deposit Enabled Successfully`);
          setReason("");
          setError(false);
          setTimeout(() => {
            setMsg("");
            setChangeRateModal(false);
            setSuccess(false);
          }, 2500);
          getAdminTrigger();
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
          setError(true);
          setMsg(err.response.data.message);
          setTimeout(() => {
            setMsg("");
            setChangeRateModal(false);
            setError(false);
          }, 2500);
        }
      });
  };

  const disableGlobalDeposit = (currency) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/trigger/disable/global-deposit/${currency}`,
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
          setMsg(`Global ${currency} Deposit Disabled Successfully`);
          setReason("");
          setError(false);
          setTimeout(() => {
            setMsg("");
            setChangeRateModal(false);
            setSuccess(false);
          }, 2500);
          getAdminTrigger();
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
          setError(true);
          setMsg(err.response.data.message);
          setTimeout(() => {
            setMsg("");
            setChangeRateModal(false);
            setError(false);
          }, 2500);
        }
      });
  };

  useEffect(() => {
    getAdminTrigger();
  }, []);

  return (
    <CRow>
      <CCol className="col-md-8 offset-2">
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>Admin Trigger</div>
            </div>
          </CCardHeader>

          <CCardBody>
            {load && (
              <div className="text-center">
                <Spin />
              </div>
            )}
            <br />
            {adminTrigger.createdOn ? (
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <p>Date Created</p>
                  <p>
                    {moment(adminTrigger.createdOn).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </p>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Date Updated</p>
                  <p>
                    {moment(adminTrigger.lastModifiedOn).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </p>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Global Withdrawal Is Set</p>
                  <span
                    class={`${
                      adminTrigger.globalWithdrawalEnabled
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }`}
                  >
                    {adminTrigger.globalWithdrawalEnabled ? "YES" : "NO"}
                  </span>
                  <Button
                    type="primary"
                    onClick={
                      !adminTrigger.globalWithdrawalEnabled
                        ? enableGlobalWithdraw.bind(this,'')
                        : disableGlobalWithdrawal.bind(this,'')
                    }
                  >
                    {adminTrigger.globalWithdrawalEnabled
                      ? "Disable Global Withdrawal"
                      : "Enable Global Withdrawal"}
                  </Button>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Global Withdrawal NGN</p>
                  <span
                    class={`${
                      adminTrigger.globalNgnWithdrawalEnabled
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }`}
                  >
                    {adminTrigger.globalNgnWithdrawalEnabled ? "YES" : "NO"}
                  </span>
                  <Button
                    type="primary"
                    onClick={
                      !adminTrigger.globalNgnWithdrawalEnabled
                        ? enableGlobalWithdraw.bind(this,'NGN')
                        : disableGlobalWithdrawal.bind(this, 'NGN')
                    }
                  >
                    {adminTrigger.globalNgnWithdrawalEnabled
                      ? "Disable NGN Global Withdrawal"
                      : "Enable USD Global Withdrawal"}
                  </Button>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Global Withdrawal USD</p>
                  <span
                    class={`${
                      adminTrigger.globalUsdWithdrawalEnabled
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }`}
                  >
                    {adminTrigger.globalUsdWithdrawalEnabled ? "YES" : "NO"}
                  </span>
                  <Button
                    type="primary"
                    onClick={
                      !adminTrigger.globalUsdWithdrawalEnabled
                        ? enableGlobalWithdraw.bind(this, 'USD')
                        : disableGlobalWithdrawal.bind(this, 'USD')
                    }
                  >
                    {adminTrigger.globalUsdWithdrawalEnabled
                      ? "Disable USD Global Withdrawal"
                      : "Enable USD Global Withdrawal"}
                  </Button>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Global Deposit Is Set</p>
                  <span
                    class={`${
                      adminTrigger.globalDepositEnabled
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }`}
                  >
                    {adminTrigger.globalDepositEnabled ? "YES" : "NO"}
                  </span>
                  <Button
                    type="primary"
                    onClick={
                      !adminTrigger.globalDepositEnabled
                        ? enableGlobalDeposit.bind(this, '')
                        : disableGlobalDeposit.bind(this, '')
                    }
                  >
                    {adminTrigger.globalDepositEnabled
                      ? "Disable Global Deposit"
                      : "Enable Global Deposit"}
                  </Button>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Global Deposit NGN</p>
                  <span
                    class={`${
                      adminTrigger.globalNgnDepositEnabled
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }`}
                  >
                    {adminTrigger.globalNgnDepositEnabled ? "YES" : "NO"}
                  </span>
                  <Button
                    type="primary"
                    onClick={
                      !adminTrigger.globalNgnDepositEnabled
                        ? enableGlobalDeposit.bind(this, 'NGN')
                        : disableGlobalDeposit.bind(this, 'NGN')
                    }
                  >
                    {adminTrigger.globalNgnDepositEnabled
                      ? "Disable NGN Global Deposit"
                      : "Enable NGN Global Deposit"}
                  </Button>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <p>Global Deposit USD</p>
                  <span
                    class={`${
                      adminTrigger.globalUsdDepositEnabled
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }`}
                  >
                    {adminTrigger.globalUsdDepositEnabled ? "YES" : "NO"}
                  </span>
                  <Button
                    type="primary"
                    onClick={
                      !adminTrigger.globalUsdDepositEnabled
                        ? enableGlobalDeposit.bind(this, 'USD')
                        : disableGlobalDeposit.bind(this, 'USD')
                    }
                  >
                    {adminTrigger.globalUsdDepositEnabled
                      ? "Disable USD Global Deposit"
                      : "Enable USD Global Deposit"}
                  </Button>
                </div>

                <br />
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 pt-5 pb-5">
                Fetching Informations...
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AdminTrigger;
