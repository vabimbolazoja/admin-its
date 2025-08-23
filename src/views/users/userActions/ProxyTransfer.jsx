import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ExportCSV } from "../../../containers/Exportcsv";
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
import config from "../../../config";
import axios from "axios";
import { Pagination, Modal, Button, DatePicker } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
const ProxyTransfer = (props) => {
  const loggedInAdmin = sessionStorage.getItem("loggedInAdmin");
  const userEmail = props.userEmail ? props.userEmail :"";
  const history = useHistory();
  const [checkBalanceModal, setCheckBalance] = useState(false);
  const [refund, setRefund] = useState(false);
  const [emailToCheck, setEmailToCheck] = useState("");
  const [configsData, setConfigsData] = useState({});
  const [TransferDatas, setTransferDatas] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [proxySearchModal, setProxySearchModal] = useState(false);
  const [InitiateProxyModal, setInitiateProxy] = useState(false);
  const [senderEmail, setSenderEmail] = useState(userEmail);
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
  const [TransferDatasAll, setTransferDatasAll] = useState([]);

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

  const closeProxySearch = () => {
    setProxySearchModal(false);
    setInitiateProxy(false);
    setCurrency("");
    setAmount("");
    setReason("");
    setCutomFee("");
    setBeneficiaryEmail("");
    setSenderEmail("");
    setTransactionStatus("");
  };

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  const getFee = () => {
    if (senderEmail && beneficiaryEmail && amount && reason && currency) {
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
    setSenderEmail("");
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
              senderEmail: data.sender.emailAddress,
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
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&amount=${amount}&proxyInitiator=&startDate=${startDate}&endDate=${endDate}&currency=${currency}&proxyTransferReason=${reason}&transactionStatus=${transactionStatus}&emailAddress=${userEmail}`;
    getPaged(queryString);
  };

  const initiateProxy = () => {
    setInitiateProxy(true);
  };
  const initiateProxyFunc = () => {
    if (senderEmail && beneficiaryEmail && amount && reason && currency) {
      setLoad(true);
      setFeeActualAmt(amount);
      axios
        .post(
          `${config.baseUrl}/api/v1/admin/proxy-transfer/initiate
  `,
          {
            senderEmail: senderEmail,
            beneficiaryEmail: beneficiaryEmail,
            amount: amount,
            fee: selfFee ? customFee : fee,
            currency: currency,
            reason: reason,
            selfAppraisedFee: selfFee ? true : false,
            instantProxy: instantProxy,
            proxyDelayInMinutes: delayMins,
            expense: isExpense,
            refund: refund,
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
            setBeneficiaryEmail("");
            setSenderEmail("");
            setInitiateProxy(false);
            setCutomFee("");
            setFeeModal(false);
            setMsg("Proxy Transfer Initiated Successfully");
            setTimeout(() => {
              setMsg("");
              setSuccess(false);
            }, 2500);
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

  const closeFeeModal = () => {
    setFeeModal(false);
  };

  useEffect(() => {
    getProxyTransfers();
    getProxyTransfersAll();
    getTransactionStatus();
  }, []);

  const getProxyTransfers = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/proxy-transfer?pageNumber=1&pageSize=100&emailAddress=${userEmail}`,
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
              senderEmail: data.sender.emailAddress,
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

  const getProxyTransfersAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/proxy-transfer?pageNumber=1&pageSize=999999999`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTransferDatasAll(
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
              senderEmail: data.sender.emailAddress,
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

  const searchProxyFunc = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/proxy-transfer?pageNumber=1&pageSize=10&amount=${amount}&proxyInitiator=&startDate=${startDate}&endDate=${endDate}&currency=${currency}&proxyTransferReason=${reason}&transactionStatus=${transactionStatus}&beneficiaryEmail=${beneficiaryEmail}&senderEmail=${senderEmail}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setProxySearchModal(false);
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
              senderEmail: data.sender.emailAddress,
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
        setLoad(false);
        if (err) {
        }
      });
  };

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-end align-items-center mb-2">
              <ExportCSV
                csvData={TransferDatasAll}
                fileName={"Proxy Transfer Data"}
              />
              <Button type="primary" onClick={initiateProxy} className="mr-2">
                Initiate Transfer
              </Button>
              <Button type="danger" onClick={() => setProxySearchModal(true)}>
                Search Proxy Transfer
              </Button>
            </div>
          </CCardHeader>{" "}
          <CCardBody>
            <CDataTable
              items={TransferDatas}
              fields={[
                { key: "reference", name: "Reference" },
                { key: "startDate", name: " Date" },
                { key: "senderEmail", name: "Sender Email" },
                { key: "beneficiaryEmail", name: "Beneficiary Email" },
                { key: "amount", name: "Amount" },
                { key: "senderFee", name: "Sender Fee" },
                { key: "proxyInitiator", name: "Proxy Initiator" },
                { key: "reason", name: "Reason" },
                { key: "transactionStatus", name: "Transaction Status" },
                { key: "actions", name: "Action" },
              ]}
              striped
              scopedSlots={{
                transactionStatus: (item) => (
                  <td>
                    <CBadge color={getBadge(item.transactionStatus)}>
                      {item.transactionStatus}
                    </CBadge>
                  </td>
                ),
                actions: (item) => (
                  <td>
                    {item.proxyInitiator === loggedInAdmin &&
                      item.transactionStatus === "PENDING_PROXY" && (
                        <Button
                          type="danger"
                          onClick={cancelStatusConfirm.bind(this, item.id)}
                        >
                          Cancel Transfer
                        </Button>
                      )}
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
        title={"Initiate Transfer"}
        visible={InitiateProxyModal}
        footer={null}
        maskClosable={false}
        onCancel={closeInitiateTransfer}
      >
        <div>
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
        </div>
        <>
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
            <CLabel htmlFor="name">Sender Email</CLabel>

            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setSenderEmail(e.target.value)}
              value={senderEmail}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Beneficiary Email</CLabel>
            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setBeneficiaryEmail(e.target.value)}
              value={beneficiaryEmail}
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

          <CFormGroup>
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
                onChange={(e) => setSelfFee(e.target.checked)}
                value={selfFee}
              />
              <label class="form-check-label" for="exampleCheck1">
                {" "}
                Self Appraised Fee
              </label>
            </div>
          </CFormGroup>

          {selfFee && (
            <CFormGroup>
              <CLabel htmlFor="name">Self Appraised Fee Value</CLabel>
              <CInput
                id="name"
                type="number"
                required
                onChange={(e) => setCutomFee(e.target.value)}
                value={customFee}
              />
            </CFormGroup>
          )}

          <CFormGroup>
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
                onChange={(e) => setInstantProxy(e.target.checked)}
                checked={instantProxy}
              />
              <label class="form-check-label" for="exampleCheck1">
                {" "}
                Instant Proxy
              </label>
            </div>
          </CFormGroup>

          <CFormGroup>
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
                onChange={(e) => setRefund(e.target.checked)}
                checked={refund}
              />
              <label class="form-check-label" for="exampleCheck1">
                {" "}
                Refund
              </label>
            </div>
          </CFormGroup>

          <CFormGroup>
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
                onChange={(e) => setIsExpense(e.target.checked)}
                checked={isExpense}
              />
              <label class="form-check-label" for="exampleCheck1">
                {" "}
                Is Expense
              </label>
            </div>
          </CFormGroup>

          {!instantProxy && (
            <CFormGroup>
              <CLabel htmlFor="name">Proxy Delay In Minutes</CLabel>
              <CInput
                id="name"
                type="number"
                required
                onChange={(e) => setDelayMins(e.target.value)}
                value={delayMins}
              />
            </CFormGroup>
          )}

          <div className="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary mr-2"
              onClick={selfFee ? initiateProxyFunc : getFee}
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
        </>
      </Modal>

      <Modal
        title={"Customer Wallet Balance Information"}
        visible={balanceInfoModal}
        footer={null}
        ß
        maskClosable={false}
        onCancel={closeCustomerBalance}
        width={900}
      >
        <div class="card text-white bg-success mb-5" style={{ width: "100%" }}>
          <div class="card-header">Primary Wallet</div>
          <div class="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <p>Wallet Ref</p>
              <p>{customerBalance ? customerBalance[0].walletRef : ""}</p>
            </div>
            <br />
            <div className="d-flex justify-content-between align-items-center">
              <p>Available Balance</p>

              {customerBalance ? (
                <p>
                  {customerBalance[0].currency === "USD" ? "$" : "₦"}
                  {Intl.NumberFormat("en-US").format(
                    customerBalance[0].balance
                  )}
                </p>
              ) : (
                ""
              )}
            </div>
            <br />
            <div className="d-flex justify-content-between align-items-center">
              <p>Spending Power</p>
              {customerBalance ? (
                <p>
                  {customerBalance[0].currency === "USD" ? "$" : "₦"}
                  {Intl.NumberFormat("en-US").format(
                    customerBalance[0].spendingPower
                  )}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div class="card text-white bg-warning mb-3" style={{ width: "100%" }}>
          <div class="card-header">Secondary Wallet</div>
          <div class="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <p>Wallet Ref</p>
              <p>{customerBalance ? customerBalance[1].walletRef : ""}</p>
            </div>
            <br />
            <div className="d-flex justify-content-between align-items-center">
              <p>Available Balance</p>

              {customerBalance ? (
                <p>
                  {customerBalance[1].currency === "USD" ? "$" : "₦"}
                  {Intl.NumberFormat("en-US").format(
                    customerBalance[1].balance
                  )}
                </p>
              ) : (
                ""
              )}
            </div>
            <br />
            <div className="d-flex justify-content-between align-items-center">
              <p>Spending Power</p>
              {customerBalance ? (
                <p>
                  {customerBalance[1].currency === "USD" ? "$" : "₦"}
                  {Intl.NumberFormat("en-US").format(
                    customerBalance[1].spendingPower
                  )}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <br />
        {customerBalance.length > 2 && (
          <div
            class="card text-white bg-info pt-3 mb-3"
            style={{ width: "100%" }}
          >
            <div class="card-header">Tetriary Wallet</div>
            <div class="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <p>Wallet Ref</p>
                <p>{customerBalance ? customerBalance[2].walletRef : ""}</p>
              </div>
              <br />
              <div className="d-flex justify-content-between align-items-center">
                <p>Available Balance</p>

                {customerBalance ? (
                  <p>
                    {customerBalance[2].currency === "USD" ? "$" : "₦"}
                    {Intl.NumberFormat("en-US").format(
                      customerBalance[2].balance
                    )}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <br />
              <div className="d-flex justify-content-between align-items-center">
                <p>Spending Power</p>
                {customerBalance ? (
                  <p>
                    {customerBalance[2].currency === "USD" ? "$" : "₦"}
                    {Intl.NumberFormat("en-US").format(
                      customerBalance[2].spendingPower
                    )}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={"Check Customer Balance"}
        visible={checkBalanceModal}
        footer={null}
        maskClosable={false}
        onCancel={closeCheckBalance}
      >
        <CFormGroup>
          <CLabel htmlFor="name">Customer Email</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setEmailToCheck(e.target.value)}
            value={emailToCheck}
          />
        </CFormGroup>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={checkCustomerBalance}
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
        title={"Fee Info"}
        visible={feeModal}
        footer={null}
        maskClosable={false}
        onCancel={closeFeeModal}
      >
            {success && <CAlert color="success">{msg}</CAlert>}

{error && <CAlert color="danger">{msg}</CAlert>}
        <h4>Fee Info</h4>
        <div className="d-flex justify-content-between align-items-center">
          <div>Amount</div>
          <div>{feeActualAmt}</div>
        </div>
        <br />
        <div className="d-flex justify-content-between align-items-center">
          <div>Fee</div>
          <div>{fee}</div>
        </div>
        <br />
        <div className="d-flex justify-content-between align-items-center">
          <div>Total</div>
          <div>
            {" "}
            {currency === "USD" ? "$" : "₦"}
            {Intl.NumberFormat("en-US").format(totalAmt)}
          </div>
        </div>
        <br />
        <div className="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={initiateProxyFunc}
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
        title={"Search Proxy Transfer"}
        visible={proxySearchModal}
        footer={null}
        maskClosable={false}
        onCancel={closeProxySearch}
      >
        {fill && (
          <div className="text-center text-danger pb-3">
            Currency is required to search reconciliaton records
          </div>
        )}
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
          <CLabel htmlFor="name">Sender Email</CLabel>

          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setSenderEmail(e.target.value)}
            value={senderEmail}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Beneficiary Email</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setBeneficiaryEmail(e.target.value)}
            value={beneficiaryEmail}
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
            onClick={searchProxyFunc}
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

export default ProxyTransfer;
