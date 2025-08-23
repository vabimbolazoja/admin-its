import React, { useState, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetDropdown,
  CAlert,
  CRow,
  CButton,
  CFormGroup,
  CInput,
  CLabel,
  CPagination,
} from "@coreui/react";
import config from "../../config";
import axios from "axios";
import { Pagination, Button, Modal, Skeleton, DatePicker } from "antd";

const KudaAccount = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [AccOp, setOpenAccount] = useState(false);
  const [JobDatas, setData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [accInfo, setAccInfo] = useState({});
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");


  const getBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "secondary";
      case "Pending":
        return "warning";
      case "DEACTIVATED":
        return "danger";
      default:
        return "primary";
    }
  };

  useEffect(() => {
    getKudaUsers();
  }, []);



  const pagination = (page, pageSize) => {
    console.log(page);
    setPage(page);
    const queryString = `page=${page - 1}&size=${pageSize}`;
    getPaged(queryString);
  };

  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/global-account/fetch-customers-with-kuda-account?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalItems);
          setData(
            res?.data?.content?.map((data) => ({
              accountId: data.accountId,
              accountLabel: data.accountLabel,
              accountNumber: data.accountNumber,
              accountStatus: data.accountStatus,
              email: data.email,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getKudaUsers = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/global-account/fetch-customers-with-kuda-account?page=0&size=100
      `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data) {
          console.log(res.data)
          setTotalItems(res.data.totalItems)
          setData(
            res?.data?.content?.map((data) => ({
              accountId: data.accountId,
              accountLabel: data.accountLabel,
              accountNumber: data.accountNumber,
              accountStatus: data.accountStatus,
              email: data.email,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const changeStatusConfirmPause = (item, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to ${
        item?.accountStatus === "ACTIVE" ? "Deactivate" : "Activate"
      } this account ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        alterStatus(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const fundTransfer = () => {
    if (type === "fund") {
      fundAccount();
    } else {
      withdrawAccount();
    }
  };

  const fundAccount = (id) => {
    console.log(sessionStorage.getItem("token"));
    console.log(id);
    setLoad(true);
    axios
      .post(
        `${config.baseUrl}/api/v1/admin/proxy-transfer/initiate-for-kuda`,
        {
          amount: amount,
          narration: narration,
          accountId: accInfo?.accountId,
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
          setMsg("Account funded Successfully");
          setError(false);
          closeOpenAcc();
          getKudaUsers();
          setTimeout(() => {
            setMsg("");
            setSuccess(false);
          }, 2500);
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
          setTimeout(() => {
            setMsg("");
            setError(false);
          }, 2500);
        }
      });
  };

  const withdrawAccount = (id) => {
    console.log(sessionStorage.getItem("token"));
    setLoad(true);
    axios
      .post(
        `${config.baseUrl}/api/v1/admin/migrate/withdraw?accountId=${accInfo?.accountId}&amount=${amount}&narration=${narration}`,
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
          setMsg("Account debited Successfully");
          setError(false);
          closeOpenAcc();
          getKudaUsers();
          setTimeout(() => {
            setMsg("");
            setSuccess(false);
          }, 2500);
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
          setTimeout(() => {
            setMsg("");
            setError(false);
          }, 2500);
        }
      });
  };

  const alterStatus = (id, e) => {
    console.log(id);
    setLoad(true);
    axios
      .get(
        `${
          config.baseUrl
        }/api/v1/global-account/toggle-account-status?accountId=${
          id.accountId
        }&activate=${false}`,
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
          setMsg("Account Status altered Successfully");
          setError(false);
          closeOpenAcc();
          getKudaUsers();
          setTimeout(() => {
            setMsg("");
            setSuccess(false);
          }, 2500);
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
          setTimeout(() => {
            setMsg("");
            setError(false);
          }, 2500);
        }
      });
  };

  const closeOpenAcc = () => {
    setOpenAccount(false);
    setAmount("");
    setNarration("");
  };

  return (
    <div>
      <CRow>
        <CCol>
          {success && <CAlert color="success">{msg}</CAlert>}
          {error && <CAlert color="danger">{msg}</CAlert>}
          <CCard>
            <CCardHeader>Customer Kuda Bank Accounts</CCardHeader>
            <CCardBody>
              <CDataTable
                items={JobDatas}
                fields={[
                  { key: "email", name: "Email" },
                  { key: "accountId", name: "Account ID" },
                  { key: "accountNumber", name: "Account Number" },
                  { key: "accountLabel", name: "Account Name" },
                  { key: "accountStatus", name: "Account Status" },
                  {
                    key: "Actions",
                    name: "Actions",
                  },
                ]}
                scopedSlots={{
                  accountStatus: (item) => (
                    <td>
                      <CBadge color={getBadge(item.accountStatus)}>
                        {item.accountStatus}
                      </CBadge>
                    </td>
                  ),
                  Actions: (item) => (
                    <td className="d-flex justify-content-between align-items-center">
                      <button
                        type="button"
                        class="btn btn-success"
                        onClick={() => {
                          setOpenAccount(true);
                          setType("fund");
                          setAccInfo(item);
                        }}
                      >
                        Fund
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger ml-2"
                        onClick={() => {
                          setOpenAccount(true);
                          setType("withdraw");
                          setAccInfo(item);
                        }}
                      >
                        Debit
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary ml-2"
                        onClick={changeStatusConfirmPause.bind(this, item)}
                      >
                        {item.accountStatus === "ACTIVE"
                          ? "DEACTIVATE"
                          : "ACTIVATE"}
                      </button>
                      <Link to={`/kuda-bank-info/${item.accountId}`}>
                        <button type="button" class="btn btn-success ml-2">
                          More
                        </button>
                      </Link>
                    </td>
                  ),
                }}
                clickableRows
              />
            </CCardBody>
            <div className="text-center pagination-part pb-5">
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
          </CCard>
        </CCol>
      </CRow>

      <Modal
        title={
          type === "fund" ? "Fund User Account" : "Withdraw From User Account"
        }
        visible={AccOp}
        footer={false}
        onCancel={closeOpenAcc}
        style={{ marginTop: "8rem" }}
      >
        <div className="text-center">
          {error && <CAlert color="danger">{msg}</CAlert>}
          {success && <CAlert color="success">{msg}</CAlert>}
        </div>
        <div>
          <CFormGroup>
            <CLabel htmlFor="name">Amount </CLabel>
            <CInput
              id="name"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              required
              value={amount}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="name">Narration</CLabel>
            <CInput
              id="name"
              type="tet"
              required
              onChange={(e) => setNarration(e.target.value)}
              value={narration}
            />
          </CFormGroup>
        </div>

        <br />

        <CButton onClick={fundTransfer} type="button" color="success">
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
    </div>
  );
};

export default KudaAccount;
