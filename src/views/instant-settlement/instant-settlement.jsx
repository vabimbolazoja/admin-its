import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  CBadge,
  CCard,
  CCardBody,
  CForm,
  CCardHeader,
  CCol,
  CInput,
  CLabel,
  CTextarea,
  CFormGroup,
  CDataTable,
  CRow,
  CSelect,
  CButton,
  CAlert,
  CPagination,
} from "@coreui/react";
import config from "../../config";
import { Pagination, Modal, Button, DatePicker } from "antd";
import axios from "axios";
import { ExportCSV } from "../../containers/Exportcsv";
import moment from "moment";
const { RangePicker } = DatePicker;

const getBadge = (status) => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "DECLINED":
      return "danger";
    case "ACTIVATED":
      return "success";
    case "DEACTIVATED":
      return "danger";
    case "BARRED":
      return "danger";
    case "NOT_REQUESTED":
      return "primary";
    case "MICRO_DEBIT_INITIATED":
      return "primary";
    default:
      return "primary";
  }
};

const InstantSettlement = (props) => {
  const history = useHistory();

  const [verificationDetails, setVerificationDetails] = useState({});
  const [settlementStatus, setSettlementStatus] = useState("");
  const [viewAccModal, setViewAcctModal] = useState(false);
  const [accInfo, setAccInfo] = useState({});
  const [userDetails, setDetails] = useState({});
  const [openDecline, setOpenDecline] = useState(false);
  const [page, setPage] = useState(1);
  const [settlementData, setSettlementData] = useState([]);
  const [directPullModal, setDirectPullModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [settlementModal, setSearchSettlement] = useState(false);
  const [idLoad, setIdLoad] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const [fill, setFill] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [reason, setReason] = useState("");
  const [load, setLoad] = useState(false);
  const [settlementDataAll, setSettlementDataAll] = useState([]);
  const [linkBankAccnts, setLinkBankAccts] = useState([]);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [provider, setProvider] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [configsData, setConfigsData] = useState({});
  const [emailAddress, setEmail] = useState("");
  const [reconciliatonModal, setReconciliationSearchModal] = useState(false);
  const userEmail = props.userEmail ? props.userEmail : "";

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

  const closePullModal = () => {
    setDirectPullModal(false);
    setAmount("")
  };

  const closeViewAccModal = () => {
    setViewAcctModal(false);
  };

  const oNDirectPull = () => {
    if(amount){
      setLoad(true);
    axios
      .post(
        `${config.baseUrl}/api/v1/adj/blue-gate/direct-pull-from-link-account`,
        {
          silaLinkedAccountId: userDetails.id,
          amoount: amount,
          fee: 1.25,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setLoad(false)
          
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
    }
  };

  const closeLinkAccModal = () => {
    setLinkModal(false);
  };

  const changeStatusConfirmActivate = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to activate instant settlemt ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        activateAcct(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/traderx-users/united_states?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setSettlementData(
            res.data.records.map((data) => ({
              accountId: data.accountId,
              bankName: data.bankName,
              accountName: data.name,
              id: data.id,
              userName:
                data.userDetails.firstName + "  " + data.userDetails.lastName,
              userDetails: data.userDetails,
              instantSettlementStatus: data.instantSettlementStatus,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const searchSettlement = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/linked-accounts?pageNumber=1&pageSize=10&instantSettlementStatus=${settlementStatus}&emailAddress=${emailAddress}`,
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
          setSearchSettlement(false);
          setSettlementData(
            res.data.records.map((data) => ({
              accountId: data.accountId,
              bankName: data.bankName,
              userName:
                data.userDetails.firstName + "  " + data.userDetails.lastName,
              accountName: data.name,
              id: data.id,
              userDetails: data.userDetails,
              instantSettlementStatus: data.instantSettlementStatus,
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



  const pagination = (page, pageSize) => {
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&instantSettlementStatus=${settlementStatus}&emailAddress=${emailAddress}`;
    getPaged(queryString);
  };

  useEffect(() => {
    getSettlements();
    getTransactionStatus();
    getSettlementsAll();
  }, []);

  const getVerifyDetails = (id) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/linked-accounts/instant-settlement-verification-details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setVerificationDetails(res.data);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getSettlements = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/linked-accounts?pageNumber=1&pageSize=100&instantSettlementStatus=`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data)
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          console.log(res.data.records)
          setSettlementData(
            res.data.records.map((data) => ({
              accountId: data.accountId,
              bankName: data.bankName,
              accountName: data.name,
              userName:data.userDetails.firstName + " " + data.userDetails.lastName,
              id: data.id,
              userDetails: data.userDetails,
              instantSettlementStatus: data.instantSettlementStatus,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getSettlementsAll = () => {
    axios
      .get(`${config.baseUrl}/api/v1/admin/linked-accounts?pageNumber=1&pageSize=999999999`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setSettlementDataAll(
            res.data.records.map((data) => ({
              code: data.code,
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              country: data.country,
              firstName: data.firstName,
              userName:
                data.userDetails.firstName + "  " + data.userDetails.lastName,
              lastName: data.lastName,
              emailAddress: data.emailAddress,
              phoneNumber: data.phoneNumber,
              accountType: data.accountType,
              identityVerificationStatus: data.identityVerificationStatus,
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

  const closeSearchModal = () => {
    setSearchSettlement(false);
    setEmail("");
    setSettlementStatus("");
  };

  const deActivateAcc = (e) => {
    e.preventDefault();
    if (reason) {
      console.log(userDetails);
      setLoad(true);
      axios
        .put(
          `${config.baseUrl}/api/v1/admin/linked-accounts/decline-linked-account-instant-settlement-micro-debit`,
          {
            id: userDetails.id,
            comment: reason,
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
            getSettlements();
            setLinkModal(true);
            setMsg("Instant Settlement Deacitvated Successfully");
            setError(false);
            setSuccess(true);
            setTimeout(() => {
              setMsg("");
              setSuccess(false);
            }, 3000);
          }
        })
        .catch((err) => {
          setLoad(false);
          if (err.response !== undefined) {
            setMsg(err.response.data.message);
            setError(true);
            setSuccess(false);
            setTimeout(() => {
              setMsg("");
              setError(false);
            }, 2500);
          } else {
            setMsg("Connection Error");
            setError(true);
            setSuccess(false);
          }
        });
    }
  };

  const openDeclineModal = (user) => {
    setDetails(user);
    setOpenDecline(true);
  };

  const activateAcct = (id) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/linked-accounts/approve-linked-account-instant-settlement-micro-debit/${id}`,
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
          getSettlements();
          setMsg("Instant Settlement Approved Successfully");
          setError(false);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setError(false);
          }, 3000);
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err.response !== undefined) {
          setMsg(err.response.data.message);
          setError(true);
          setSuccess(false);
          setTimeout(() => {
            setMsg("");
            setError(false);
          }, 3000);
        } else {
          setMsg("Connection Error");
          setError(true);
          setSuccess(false);
        }
      });
  };

  const closeDecline = () => {
    setOpenDecline(false);
    setReason(false);
  };

  const changeStatusConfirmApprove = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to arpprove this account for instant settlement ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        activateAcct(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // const changeStatusConfirmDecline = (id, e) => {
  //   e.preventDefault();
  //   Modal.confirm({
  //     title: `Are you sure you want to d?`,
  //     icon: <ExclamationCircleOutlined />,
  //     okText: "Yes",
  //     okType: "danger",
  //     cancelText: "No",
  //     onOk() {
  //       close(id);
  //     },
  //     onCancel() {
  //       console.log("Cancel");
  //     },
  //   });
  // };

  const directPull = (user) => {
    setDetails(user);
    setDirectPullModal(true);
  };

  const viewAccDetails = (user) => {
    console.log(user);
    setAccInfo(user.userDetails);
    setDetails(user);
    getVerifyDetails(user.id);
    setViewAcctModal(true);
  };

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <p>Intsant Settlement</p>
              <button
                type="button"
                class="btn btn-primary mr-2"
                onClick={() => setSearchSettlement(true)}
              >
                Search
              </button>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              id="emp"
              items={settlementData}
              fields={[
                { key: "accountId", name: "Account ID" },
                { key: "accountName", name: "Account Name" },
                { key: "bankName", name: "Bank Name" },
                { key: "userName", name: "Name" },

                {
                  key: "instantSettlementStatus",
                  name: "Instant Settlement Status",
                },
                { key: "action", name: "Action" },
              ]}
              scopedSlots={{
                status: (item) => (
                  <td>
                    <CBadge color={getBadge(item.transactionStatus)}>
                      {item.status}
                    </CBadge>
                  </td>
                ),
                action: (item) => (
                  <td>
                    <button
                      type="button"
                      class="btn btn-primary mr-2"
                      onClick={viewAccDetails.bind(this, item)}
                    >
                      View Details
                    </button>
                   
                    {item.instantSettlementStatus === "PENDING" && (
                      <>
                        <button
                          type="button"
                          class="btn btn-success mr-2"
                          onClick={changeStatusConfirmApprove.bind(
                            this,
                            item.id
                          )}
                        >
                          Approve Instant Funding
                        </button>

                        <button
                          type="button"
                          class="btn btn-danger mr-2"
                          onClick={openDeclineModal.bind(this, item)}
                        >
                          Decline Instant Funding
                        </button>
                      </>
                    )}
                  </td>
                ),
                instantSettlementStatus: (item) => (
                  <td>
                    <CBadge color={getBadge(item.instantSettlementStatus)}>
                      {item.instantSettlementStatus}
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
        title={"Search Instant Settlement"}
        visible={settlementModal}
        footer={null}
        maskClosable={false}
        onCancel={closeSearchModal}
      >
        <CFormGroup>
          <CLabel htmlFor="name">Instant Settlement Status</CLabel>
          <CSelect
            custom
            name="ccmonth"
            id="ccmonth"
            onChange={(e) => setSettlementStatus(e.target.value)}
            value={settlementStatus}
          >
            <option selected>Select</option>
            <option>PENDING</option>
            <option>DECLINED</option>
            <option>ACTIVATED</option>
            <option>DEACTIVATED</option>
            <option>BARRED</option>
            <option>NOT_REQUESTED</option>
            <option>MICRO_DEBIT_INITIATED</option>
          </CSelect>{" "}
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="name">Email Address</CLabel>
          <CInput
            id="name"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={emailAddress}
          />
        </CFormGroup>

        <div className="d-flex justify-content-end mt-3">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={searchSettlement}
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

      <Modal
        title={"Decline Instant Settlement"}
        visible={openDecline}
        footer={null}
        maskClosable={false}
        onCancel={closeDecline}
      >
        <div className="container">
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
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
          <br />
          <div className="d-flex justify-content-end align-items-center">
            <button
              type="button"
              class="btn btn-danger "
              onClick={deActivateAcc}
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
                "Decline"
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        title={"Initiate Direct Pull"}
        visible={directPullModal}
        footer={null}
        maskClosable={false}
        width={400}
        onCancel={closePullModal}
      >
        <CForm
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          <CFormGroup>
            <CLabel htmlFor="name">Amount</CLabel>
            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </CFormGroup>
          <div className="d-flex justify-content-end align-items-center">
            <button
              type="button"
              class="btn btn-danger "
              onClick={oNDirectPull}
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
        </CForm>
      </Modal>

      <Modal
        title={"View Account Details"}
        visible={viewAccModal}
        footer={null}
        width={800}
        maskClosable={false}
        onCancel={closeViewAccModal}
      >
        <CForm
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          <CFormGroup row>
            <CCol md="3">
              <CLabel>Email</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <p className="form-control-static">
                {accInfo.emailAddress ? accInfo.emailAddress : "N/A"}
              </p>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="3">
              <CLabel htmlFor="text-input">First Name</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <p className="form-control-static">
                {accInfo.firstName ? accInfo.firstName : "N/A"}
              </p>
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="3">
              <CLabel htmlFor="email-input">Last Name</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <p className="form-control-static">
                {accInfo.lastName ? accInfo.lastName : "N/A"}
              </p>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="3">
              <CLabel htmlFor="email-input">Phone Number</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <p className="form-control-static">
                {accInfo.phoneNumber ? accInfo.phoneNumber : "N/A"}
              </p>
            </CCol>
          </CFormGroup>
          {verificationDetails.driversLicence && (
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="disabled-input">User Driver License </CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <div
                  style={{
                    border: "1px solid dotted",
                    color: "#000000",
                  }}
                >
                  <img
                    width="100%"
                    height="500"
                    src={`data:image/png;base64,${
                      verificationDetails.driversLicence
                        ? verificationDetails.driversLicence
                        : "N/A"
                    }`}
                  />
                </div>{" "}
              </CCol>
            </CFormGroup>
          )}

          {verificationDetails.selfie && (
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="disabled-input">User Selfie </CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <div
                  style={{
                    border: "1px solid dotted",
                    color: "#000000",
                  }}
                >
                  <img
                    width="100%"
                    height="500"
                    src={`data:image/png;base64,${
                      verificationDetails.selfie
                        ? verificationDetails.selfie
                        : "N/A"
                    }`}
                  />
                </div>{" "}
              </CCol>
            </CFormGroup>
          )}
        </CForm>
      </Modal>
    </CRow>
  );
};

export default InstantSettlement;
