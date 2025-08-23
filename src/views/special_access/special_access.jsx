import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  CBadge,
  CCard,
  CCardBody,
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
import axios from "axios";
import { Pagination, Modal, Button } from "antd";
import moment from "moment";
const SpecialAccess = (props) => {
  const loggedInAdmin = sessionStorage.getItem("loggedInAdmin");
  const userEmail = props.history.location.state;
  const history = useHistory();
  const [checkBalanceModal, setCheckBalance] = useState(false);
  const [loadDebit, setLoadDebit] = useState(false);
  const [emailToCheck, setEmailToCheck] = useState("");
  const [TransferDatas, setTransferDatas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [InitiateProxyModal, setInitiateProxy] = useState(
    userEmail ? true : false
  );
  const [email, setUserEmail] = useState(userEmail);
  const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [reason, setReason] = useState("");
  const [load, setLoad] = useState(false);
  const [msg, setMsg] = useState("");
  const [fill, setFill] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [feeModal, setFeeModal] = useState(false);
  const [feeActualAmt, setFeeActualAmt] = useState("");
  const [fee, setFee] = useState("");
  const [totalAmt, setTotalAmt] = useState("");
  const [balanceInfoModal, setBalanceInfoModal] = useState(false);
  const [selfFee, setSelfFee] = useState(false);
  const [instantProxy, setInstantProxy] = useState(true);
  const [customFee, setCutomFee] = useState("");
  const [delayMins, setDelayMins] = useState(0);
  const [customerBalance, setCustomerBalance] = useState("");
  const [isExpense, setIsExpense] = useState(false);

  const closeCheckBalance = () => {
    setCheckBalance(false);
    setEmailToCheck("");
  };

  console.log(userEmail);

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

  const getFee = () => {
    if (email && beneficiaryEmail && amount && reason && currency) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/admin/proxy-transfer/fee`,
          {
            amount: amount,
            currency: currency,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setFeeActualAmt(amount);
            setFee(res.data.fee);
            setLoad(false);
            setFeeModal(true);
            setInitiateProxy(false);
            setTotalAmt(res.data.fee + parseInt(amount));
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
    } else {
    }
  };

  const checkBalance = (e) => {
    e.preventDefault();
    setCheckBalance(true);
  };

  const closeCustomerBalance = () => {
    setBalanceInfoModal(false);
  };

  const closeInitiateTransfer = () => {
    setInitiateProxy(false);
    setCurrency("");
    setAmount("");
    setReason("");
    setCutomFee("");
    setBeneficiaryEmail("");
    setUserEmail("");
  };

  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/proxy-transfer?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setTransferDatas(
            res.data.records.map((data) => ({
              reference: data.reference,
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              transactionStatus: data.transactionStatus,
              email: data.sender.emailAddress,
              proxyInitiator: data.proxyInitiator,
              reason: data.proxyTransferReason,
              id: data.id,
              beneficiaryEmail: data.beneficiary.emailAddress,
              senderFee:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.senderFee)
                  : "$" + Intl.NumberFormat("en-US").format(data.senderFee),
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const cancelStatusConfirm = (proxyID, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to cancel this proxy transfer ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        cancelProxy(proxyID);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const checkCustomerBalance = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/proxy-transfer/${emailToCheck}/balance/`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setCustomerBalance(res.data);
          setLoad(false);
          setCheckBalance(false);
          setBalanceInfoModal(true);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const cancelProxy = (proxyID) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/proxy-transfer/pending/cancel/${proxyID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          setMsg("Proxy Transfer Cancelled Successfully");
          setTimeout(() => {
            setMsg("");
            setInitiateProxy(false);
            setSuccess(false);
          }, 2500);
          getProxyTransfers();
        }
      })
      .catch((err) => {
        setError(true);
        setMsg("Error");
        setLoad(false);
        if (err) {
        }
      });
  };

  const pagination = (page, pageSize) => {
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=10`;
    getPaged(queryString);
  };

  const initiateProxy = () => {
    setInitiateProxy(true);
  };

  const initiateWalletTransferDebit = () => {
    if (email && amount && reason && currency) {
      setLoadDebit(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/adj/flw-debit-user
    `,
          {
            reason,
            amount,
            emailAddress: email,
            currency,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setLoadDebit(false);
          if (res.status === 200) {
            setSuccess(true);
            setCurrency("");
            setAmount("");
            setReason("");
            setUserEmail("");
            setCutomFee("");
            setFeeModal(false);
            setMsg("Debit Wallet Transfer Initiated Successfully");
            setTimeout(() => {
              setMsg("");
              setSuccess(false);
              setInitiateProxy(false);
            }, 3500);
            getProxyTransfers();
          }
        })
        .catch((err) => {
          setLoadDebit(false);
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
    } else {
      // setError(true)
      // setMsg("All fie")
      setFill(true);
      setTimeout(() => {
        setFill(false);
      }, 2500);
    }
  };
  const initiateWalletTransferCredit = () => {
    if (email && amount && reason && currency) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/adj/flw-credit-user
  `,
          {
            reason,
            amount,
            emailAddress: email,
            currency,
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
            setCurrency("");
            setAmount("");
            setReason("");
            setUserEmail("");
            setCutomFee("");
            setFeeModal(false);
            setMsg("Credit Wallet Transfer Initiated Successfully");
            setTimeout(() => {
              setMsg("");
              setSuccess(false);
                setInitiateProxy(false);
            }, 3500);
            getProxyTransfers();
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
            }, 3500);
          } else {
            setMsg("Connection Error");
            setError(true);
            setSuccess(false);
          }
        });
    } else {
      // setError(true)
      // setMsg("All fie")
      setFill(true);
      setTimeout(() => {
        setFill(false);
      }, 2500);
    }
  };

  const closeFeeModal = () => {
    setFeeModal(false);
  };

  useEffect(() => {
    getProxyTransfers();
  }, []);

  const getProxyTransfers = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/proxy-transfer?pageNumber=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setTransferDatas(
            res.data.records.map((data) => ({
              reference: data.reference,
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              transactionStatus: data.transactionStatus,
              email: data.sender.emailAddress,
              proxyInitiator: data.proxyInitiator,
              reason: data.proxyTransferReason,
              id: data.id,
              beneficiaryEmail: data.beneficiary.emailAddress,
              senderFee:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.senderFee)
                  : "$" + Intl.NumberFormat("en-US").format(data.senderFee),
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
      <CCol className="col-md-6 offset-3">
        <CCard>
          <CCardHeader></CCardHeader>

          <CCardBody>
            <div>
              <br />
              <div className="">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <p>Special Access Transaction</p>
                  <Button type="primary" onClick={initiateProxy}>
                    Initiate Wallet Transfer
                  </Button>
                </div>
              </div>

              <br />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={"Initiate Transfer"}
        visible={InitiateProxyModal}
        footer={null}
        maskClosable={false}
        onCancel={closeInitiateTransfer}
      >
        <>
          <div>
            {success && <CAlert color="success">{msg}</CAlert>}

            {error && <CAlert color="danger">{msg}</CAlert>}
          </div>
          <CFormGroup>
            <CLabel htmlFor="name">Currency</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setCurrency(e.target.value)}
              value={currency}
            >
              <option selected>Select</option>
              <option selected>NGN</option>
              <option selected>USD</option>
            </CSelect>{" "}
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name"> Email</CLabel>

            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setUserEmail(e.target.value)}
              value={email}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="name">Amount</CLabel>
            <CInput
              id="name"
              type="number"
              required
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Reason</CLabel>
            <CTextarea
              id="name"
              type="number"
              required
              onChange={(e) => setReason(e.target.value)}
              value={reason}
            />
          </CFormGroup>

          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              class="btn btn-success mr-2"
              onClick={initiateWalletTransferCredit}
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
                "Credit Wallet"
              )}
            </button>
            <button
              type="button"
              class="btn btn-danger mr-2"
              onClick={initiateWalletTransferDebit}
            >
              {loadDebit ? (
                <div
                  class="spinner-border"
                  role="status"
                  style={{ width: "1rem", height: "1rem" }}
                >
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                "Debit Wallet"
              )}
            </button>
          </div>
        </>
      </Modal>
    </CRow>
  );
};

export default SpecialAccess;
