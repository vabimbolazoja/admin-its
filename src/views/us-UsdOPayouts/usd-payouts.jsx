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
    case "AWAITING_APPROVAL":
      return "warning";
    case "NOT_TREATED":
      return "warning";
    case "COMPLETED":
      return "success";
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
  const [addPayout, setAddPayout] = useState(false);
  const [userDetails, setDetails] = useState({});
  const [openDecline, setOpenDecline] = useState(false);
  const [page, setPage] = useState(1);
  const [payoutID, setPayOutID] = useState("");
  const [settlementData, setSettlementData] = useState([]);
  const [directPullModal, setDirectPullModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [searchPayoutModal, setSearchPAYOUT] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState("");
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
  const [approval, setApproval] = useState("");
  const [comment, setComment] = useState("");
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
    setAmount("");
  };

  const closeViewAccModal = () => {
    setViewAcctModal(false);
  };

  const oNDirectPull = () => {
    if (amount) {
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
            setLoad(false);
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
      onOk() {},
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
              accountId: data?.silaLinkedAccount?.accountId,
              bankName: data?.silaLinkedAccount?.bankName,
              merchantName: data.merchantName,
              accountName: data?.silaLinkedAccount?.name,
              id: data.id,
              userName:
                data?.silaCustomer?.traderXUser.firstName +
                " " +
                data?.silaCustomer?.traderXUser.lastName,
              userDetails: data?.silaCustomer?.traderXUser,
              instantSettlementStatus: data.transactionStatus,
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
          setSearchPAYOUT(false);
          setSettlementData(
            res.data.records.map((data) => ({
              accountId: data?.silaLinkedAccount?.accountId,
              bankName: data?.silaLinkedAccount?.bankName,
              accountName: data?.silaLinkedAccount?.name,
              merchantName: data.merchantName,

              id: data.id,
              userDetails: data?.silaCustomer?.traderXUser,
              userName:
                data?.silaCustomer?.traderXUser.firstName +
                " " +
                data?.silaCustomer?.traderXUser.lastName,
              instantSettlementStatus: data.transactionStatus,
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
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&approvalDecision=${approvalDecision}`;
    getPaged(queryString);
  };

  useEffect(() => {
    getUsdPayouts();
    getTransactionStatus();
    getUsdPayoutsAll();
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

  const getUsdPayouts = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/us-payout/all?pageNumber=1&pageSize=10&status=NOT_TREATED&approvalDecision=`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          console.log(res.data.records);
          setSettlementData(
            res.data.map((data) => ({
              accountName: data.accountName,
              accountNumber: data.accountNumber,
              accountType: data.accountType,
              amount: data.amount,
              approvalDecision: data.approvalDecision,
              bankName: data.bankName,
              comment: data.comment,
              fullName: data.fullName,
              amount: "$" + Intl.NumberFormat("en-US").format(data.amount),
              feeStatus: data.feeStatus,
              routingNumber: data.routingNumber,
              email: data.email,
              id: data.id,
              transactionStatus: data.status,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getUsdPayoutsAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/linked-accounts?pageNumber=1&pageSize=999999999`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setSettlementDataAll(
            res.data.records.map((data) => ({
              firstName: data.withdrawalTransaction.traderXUser.firstName,
              lastName: data.withdrawalTransaction.traderXUser.lastName,
              merchantName: data.merchantName,
              id: data.id,
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              emailAddress: data.withdrawalTransaction.traderXUser.emailAddress,
              amount:
                "$" +
                Intl.NumberFormat("en-US").format(
                  data.withdrawalTransaction.amount
                ),
              fee: "$" + data.withdrawalTransaction.fee,
              provider: data.withdrawalTransaction.provider,

              transactionStatus: data.withdrawalTransaction.transactionStatus,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const treatUsd = () => {
    if (approval && comment) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/admin/transactions/treat/us-usd-payouts`,
          {
            id: payoutID,
            approvalDecision: approval,
            comment: comment,
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
            setAddPayout(false);
            setApproval("");
            setComment("");
            getUsdPayouts();
            setMsg("USD Payout Addressed Successfully");
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
            }, 2500);
          } else {
            setMsg("Connection Error");
            setError(true);
            setSuccess(false);
          }
        });
    }
  };

  const closeCreatePayout = () => {
    setAddPayout(false);
    setAddPayout(false);
    setApproval("");
    setComment("");
  };

  const closeSearchModal = () => {
    setSearchPAYOUT(false);
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
            getUsdPayouts();
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

  const changeStatusConfirm = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to confrim treat for this request?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        confirmTreat(id.id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const confirmTreat = (id) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/us-payout/transfer/${id}`,
        {
          approvalDecision : 'APPROVED',
          status: 'TREATED'
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
          getUsdPayouts();
          setMsg("Request Confirmed Treated Successfully");
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
      onOk() {},
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

  const viewDetails = (info) => {
    console.log(info);
    setPayOutID(info.id);
    setAddPayout(true);
  };

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <p>USD PAYOUTS</p>
              <button
                type="button"
                class="btn btn-primary mr-2"
                onClick={() => setSearchPAYOUT(true)}
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
                { key: "email", name: "User Email" },
                { key: "accountName", name: "Account Name" },
                { key: "accountNumber", name: "Account Number" },
                { key: "amount", name: "Amount" },
                { key: "bankName", name: "Bank Name" },
                { key: "routingNumber", name: "Routing Number" },
                { key: "accountType", name: "Account Type" },
                { key: "comment", name: "Comment" },
                { key: "feeStatus", name: "Fee Status" },

                {
                  key: "transactionStatus",
                  name: "Transaction Status",
                },
                {
                  key: "approvalDecision",
                  name: "ApprovalDecision",
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
                      class="btn btn-success mr-2"
                      onClick={changeStatusConfirm.bind(this, item)}
                    >
                      Confirm Treat
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
                feeStatus: (item) => (
                  <td>
                    <CBadge color={getBadge(item.feeStatus)}>
                      {item.feeStatus}
                    </CBadge>
                  </td>
                ),
                approvalDecision: (item) => (
                  <td>
                    <CBadge color={getBadge(item.approvalDecision)}>
                      {item.approvalDecision}
                    </CBadge>
                  </td>
                ),
              }}
            />
            {/* <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                defaultPageSize={100}
                onChange={pagination}
              />
            </div> */}
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={"Treat USD Payout"}
        visible={addPayout}
        footer={null}
        maskClosable={false}
        width={400}
        onCancel={closeCreatePayout}
      >
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CForm
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          <CFormGroup>
            <CLabel htmlFor="name">Approval Decision</CLabel>
            <CSelect
              id="ccmonth"
              onChange={(e) => setApproval(e.target.value)}
              value={approval}
            >
              <option selected>Select</option>
              <option>APPROVED</option>
              <option>DECLINED</option>
            </CSelect>{" "}
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Comment</CLabel>
            <CTextarea
              id="name"
              type="textarea"
              required
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
          </CFormGroup>
          <div className="d-flex justify-content-end align-items-center">
            <button type="button" class="btn btn-success " onClick={treatUsd}>
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
        title={"Search Payout"}
        visible={searchPayoutModal}
        footer={null}
        maskClosable={false}
        width={400}
        onCancel={closeCreatePayout}
      >
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CForm
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          <CFormGroup>
            <CLabel htmlFor="name">Approval Decision</CLabel>
            <CSelect
              id="ccmonth"
              onChange={(e) => setApproval(e.target.value)}
              value={approval}
            >
              <option selected>Select</option>
              <option>APPROVED</option>
              <option>DECLINED</option>
            </CSelect>{" "}
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Comment</CLabel>
            <CTextarea
              id="name"
              type="textarea"
              required
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
          </CFormGroup>
          <div className="d-flex justify-content-end align-items-center">
            <button type="button" class="btn btn-success " onClick={treatUsd}>
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
    </CRow>
  );
};

export default InstantSettlement;
