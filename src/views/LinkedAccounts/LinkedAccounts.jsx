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
  CForm,
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

const InstantSettlement = (props) => {
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fee, setFee] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmailAddress] = useState("");
  const [country, setCountry] = useState("");
  const [accType, setAccType] = useState("");
  const [accId, setDetails] = useState("");
  const [directPullModal, setDirectPullModal] = useState(false);
  const [status, setStatus] = useState("");
  const [identity, setIdentity] = useState("");

  const [page, setPage] = useState(1);
  const [settlementData, setSettlementData] = useState([]);
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
    setAmount("");
    setFee("")
  };

  const closeLinkAccModal = () => {
    setLinkModal(false);
  };

  const oNDirectPull = () => {
    if (amount) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/adj/blue-gate/direct-pull-from-link-account`,
          {
            silaLinkedAccountId: accId,
            amoount: amount,
            fee: fee,
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
            setDirectPullModal(false)
            setMsg("Direct Pull Successfully Made");
            setLinkModal(false);
            setError(false);
            setSuccess(true);
            setFee("");
            setAmount("")
            setTimeout(() => {
              setMsg("");
              setSuccess(false);
              window.location.reload();
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

  const getBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "secondary";
      case "PND":
        return "warning";
      case "LOCKED":
        return "danger";
      default:
        return "primary";
    }
  };

  const changeStatusConfirmActivate = (id, e) => {
    setIdLoad(id);
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

  const changeStatusConfirmDeActivate = (id, e) => {
    setIdLoad(id);
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to deactivate instant settlement ?`,

      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deActivateAcc(id);
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
              code: data.code,
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              country: data.country,
              firstName: data.firstName,
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

  const searchSettlement = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/traderx-users/united_states?pageNumber=1&pageSize=10&country=${country}&startDate=${startDate}&endDate=${endDate}&email=${email}&firstName=${firstName}&lastName=${lastName}&phoneNumber=${phone}`,
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
          setReconciliationSearchModal(false);
          setSettlementData(
            res.data.records.map((data) => ({
              code: data.code,
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              country: data.country,
              firstName: data.firstName,
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
          setLoad(false);
        }
      });
  };

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  const pagination = (page, pageSize) => {
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&country=${country}&startDate=${startDate}&endDate=${endDate}&email=${email}&firstName=${firstName}&lastName=${lastName}&phoneNumber=${phone}`;
    getPaged(queryString);
  };

  useEffect(() => {
    getSettlements();
    getTransactionStatus();
    getSettlementsAll();
  }, []);

  const getSettlements = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/traderx-users/united_states?pageNumber=1&pageSize=100&startDate=&endDate=`,
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
              code: data.code,
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              country: data.country,
              firstName: data.firstName,
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

  const getSettlementsAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/traderx-users/united_states?pageNumber=1&pageSize=999999999&startDate=&endDate=`,
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
              code: data.code,
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              country: data.country,
              firstName: data.firstName,
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
  };

  const linkAccount = (id) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/linked-accounts/united_states/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setLinkBankAccts(res.data);
          setLinkModal(true);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const deActivateAcc = (id) => {
    setLoad(true)
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/linked-accounts/deactivate-instant-settlement/${id}`,
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
          setMsg("Instant Settlement Deacitvated Successfully");
          setError(false);
          setSuccess(true);
          getSettlements();
          setLinkModal(false);
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
  };

  const directPull = (acc) => {
    setDetails(acc);
    setDirectPullModal(true);
  };

  const activateAcct = (id) => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/linked-accounts/activate-instant-settlement/${id}`,
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
          setMsg("Instant Settlement Acitvated Successfully");
          setError(false);
          setSuccess(true);
          getSettlements()
          setLinkModal(false);
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
          }, 3000);
        } else {
          setMsg("Connection Error");
          setError(true);
          setSuccess(false);
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
                { key: "code", name: "Reference" },
                { key: "startDate", name: " Date" },
                { key: "country", name: "Country" },
                { key: "firstName", name: "First Name" },
                { key: "lastName", name: "Last Name" },
                { key: "emailAddress", name: "Email Address" },
                { key: "country", name: "Country" },
                { key: "phoneNumber", name: "phoneNumber" },
                { key: "accountType", name: "accountType" },
                {
                  key: "identityVerificationStatus",
                  name: "Identification Status",
                },
                { key: "status", name: "Status" },
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
                    <Button
                      type="primary"
                      onClick={linkAccount.bind(this, item.code)}
                    >
                      Linked Accounts
                    </Button>
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
        title={"Linked Bank Accounts"}
        visible={linkModal}
        footer={null}
        maskClosable={false}
        onCancel={closeLinkAccModal}
      >
        <div>
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
        </div>
        <div class="">
          {linkBankAccnts.length > 0 ? (
            <div>
              {linkBankAccnts.map((acc) => {
                return (
                  <div>
                    <ul>
                      <li>
                        <div class="">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div>Account Name : {acc.name}</div>
                              <div>Bank Name : {acc.bankName}</div>
                            </div>
                            {acc.instantSettlementStatus === "ACTIVATED" && (
                              <button
                                type="button"
                                class="btn btn-danger mr-2"
                                onClick={changeStatusConfirmDeActivate.bind(
                                  this,
                                  acc.id
                                )}
                              >
                                {load && acc.id === idLoad ? (
                                  <div
                                    class="spinner-border"
                                    role="status"
                                    style={{ width: "1rem", height: "1rem" }}
                                  >
                                    <span class="sr-only">Loading...</span>
                                  </div>
                                ) : (
                                  "Deactivate Instant settlement"
                                )}
                              </button>
                            )}

                            {
                              {
                                NOT_REQUESTED: (
                                  <button
                                    type="button"
                                    class="btn btn-success mr-2"
                                    onClick={changeStatusConfirmActivate.bind(
                                      this,
                                      acc.id
                                    )}
                                  >
                                    {load && acc.id === idLoad ? (
                                      <div
                                        class="spinner-border"
                                        role="status"
                                        style={{
                                          width: "1rem",
                                          height: "1rem",
                                        }}
                                      >
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    ) : (
                                      "Activate Instant settlement"
                                    )}
                                  </button>
                                ),
                                BARRED: (
                                  <button
                                    type="button"
                                    class="btn btn-success mr-2"
                                    onClick={changeStatusConfirmActivate.bind(
                                      this,
                                      acc.id
                                    )}
                                  >
                                    {load && acc.id === idLoad ? (
                                      <div
                                        class="spinner-border"
                                        role="status"
                                        style={{
                                          width: "1rem",
                                          height: "1rem",
                                        }}
                                      >
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    ) : (
                                      "Activate Instant settlement"
                                    )}
                                  </button>
                                ),
                                DEACTIVATED: (
                                  <button
                                    type="button"
                                    class="btn btn-success mr-2"
                                    onClick={changeStatusConfirmActivate.bind(
                                      this,
                                      acc.id
                                    )}
                                  >
                                    {load && acc.id === idLoad ? (
                                      <div
                                        class="spinner-border"
                                        role="status"
                                        style={{
                                          width: "1rem",
                                          height: "1rem",
                                        }}
                                      >
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    ) : (
                                      "Activate Instant settlement"
                                    )}
                                  </button>
                                ),
                                DECLINED: (
                                  <button
                                    type="button"
                                    class="btn btn-success mr-2"
                                    onClick={changeStatusConfirmActivate.bind(
                                      this,
                                      acc.id
                                    )}
                                  >
                                    {load && acc.id === idLoad ? (
                                      <div
                                        class="spinner-border"
                                        role="status"
                                        style={{
                                          width: "1rem",
                                          height: "1rem",
                                        }}
                                      >
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    ) : (
                                      "Activate Instant settlement"
                                    )}
                                  </button>
                                ),
                              }[acc.instantSettlementStatus]
                            }
                          </div>
                          <br />
                          <button
                            type="button"
                            class="btn btn-warning mr-2"
                            onClick={directPull.bind(this, acc.id)}
                          >
                            Direct Pull
                          </button>
                        </div>
                      </li>
                      <hr />
                    </ul>
                    <br />
                    <div className="d-flex justify-content-end align-items-center"></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center">No Linked Account</p>
          )}
        </div>
      </Modal>

      <Modal
        title={"Search Instant Settlement"}
        visible={settlementModal}
        footer={null}
        maskClosable={false}
        onCancel={closeSearchModal}
      >
        <CFormGroup>
          <CLabel htmlFor="name">Country</CLabel>
          <CSelect
            custom
            name="ccmonth"
            id="ccmonth"
            onChange={(e) => setCountry(e.target.value)}
            value={country}
          >
            <option selected>Select</option>
            <option>NIGERIA</option>
            <option>UNITED_STATES</option>
          </CSelect>{" "}
        </CFormGroup>

        {/* <CFormGroup>
            <CLabel htmlFor="name">Account Type</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setAccType(e.target.value)}
              value={accType}
            >
              <option selected>Select</option>
              <option >NIGERIA</option>
              <option >UNITED_STATES</option>
            </CSelect>{" "}
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Status</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setStatus(e.target.value)}
              value={status}
            >
              <option selected>Select</option>
              <option >Active</option>
              <option >Inactive</option>
            </CSelect>{" "}
          </CFormGroup> */}

        <CFormGroup>
          <CLabel htmlFor="name">First Name</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Last Name</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="name">Email</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setEmailAddress(e.target.value)}
            value={email}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="name">Phone Number</CLabel>
          <CInput
            id="name"
            type="number"
            required
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />
        </CFormGroup>

        <br />
        <RangePicker style={{ width: "100%" }} onChange={onChange} />
        <br />
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
        title={"Initiate Direct Pull"}
        visible={directPullModal}
        footer={null}
        maskClosable={false}
        width={400}
        onCancel={closePullModal}
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
            <CLabel htmlFor="name">Amount</CLabel>
            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Fee</CLabel>
            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setFee(e.target.value)}
              value={fee}
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
    </CRow>
  );
};

export default InstantSettlement;
