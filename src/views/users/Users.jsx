import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "./index.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { ExportCSV } from "../../containers/Exportcsv";

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CFormGroup,
  CLabel,
  CInputGroupPrepend,
  CInputGroup,
  CButton,
  CInput,
  CSelect,
  CCol,
  CTextarea,
  CDataTable,
  CAlert,
  CRow,
} from "@coreui/react";
import { Pagination, Button } from "antd";
import config from "../../config";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { Modal, Drawer, Input, Space, Select } from "antd";
var userRoles = sessionStorage.getItem("roleUser");
const { Search } = Input;
const { Option } = Select;


const Users = () => {
  const history = useHistory();
  const [controlData, setAccessControlData] = useState([]);
  const [page, setPage] = useState(1);
  const [featureOptions, setFeatureOptions] = useState([]);
  const [usersData, setUserData] = useState([]);
  const [usersDataAll, setUserDataAll] = useState([]);
  const [totalItems, setTotalItems] = useState("");
  const [filter, setFilter] = useState(false);
  const [reason, setReason] = useState("");
  const [country, setCountry] = useState("");
  const [account, setAccount] = useState("");
  const [checkBalanceModal, setChceckBalanceModal] = useState(false);
  const [balanceInfoModal, setBalanceInfoModal] = useState(false);
  const [emailToCheck, setEmailToCheck] = useState("");
  const [bulkAccessModal, setBulkAccessModal] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [tableInfo, setTableInfo] = useState("");
  const [lockModal, setLockModal] = useState(false);
  const [identityStatus, setIdentityStatus] = useState("");
  const [reasonBox, setReasonBox] = useState(false);
  const [load, setLoad] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [userNameSearch, setSearchUsername] = useState("");
  const [error, setError] = useState(false);
  const [filterBoard, setFilterBoard] = useState(false);
  const [userId, setUserId] = useState("");
  const [customerBalance, setCustomerBalance] = useState("");
  const [name, setName] = useState("");
  const [selectCheckModal, setSelectCheckModal] = useState(false);
  const [selectedUsersInfo, setSelectedUsersInfoCodes] = useState([]);

  const cancelReason = () => {
    setReasonBox(false);
  };

  const [visible, setVisible] = useState(false);
  const showDrawer = (item) => {
    setVisible(true);
    setTableInfo(item);
  };
  const onCloseDrawer = () => {
    setVisible(false);
  };

  const closeCheckBalance = () => {
    setChceckBalanceModal(false);
    setEmailToCheck("");
  };

  const selectUserChange = (item, e) => {
    var updatedList = [...selectedUsersInfo];
    if (e.target.checked) {
      updatedList = [...selectedUsersInfo, item.code];
    } else {
      updatedList.splice(selectedUsersInfo.indexOf(item.code), 1);
    }
    setSelectedUsersInfoCodes(updatedList);
  };

  const getPaged = (queryString) => {
    axios
      .get(`${config.baseUrl}/api/vGated/admin/app-users/paged?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setLoad(false);
          // setUserData(
          //   res.data.records.map((data) => ({
          //     code: data.code,
          //     createdOn: moment(data.createdOn).format(
          //       "MMMM Do YYYY, h:mm:ss a"
          //     ),
          //     firstName: data.firstName,
          //     lastName: data.lastName,
          //     emailAddress: data.emailAddress,
          //     hasBeenReachedOutTo: data.hasBeenReachedOutTo ? "YES" : "NO",
          //     phoneNumber: data.phoneNumber,
          //     country: data.country,
          //     featureAccessControls: data.featureAccessControls,
          //     accountType: data.accountType,
          //     identityVerificationStatus: data.identityVerificationStatus,
          //     status: data.status,
          //   }))
          // );
          setTotalItems(res.data.totalPages * 10);
          setFilter(false);
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
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&identityVerificationStatus=&accountType=&country`;
    const queryStringSearch = `pageNumber=${page}&pageSize=${pageSize}&identityVerificationStatus=${
      identityStatus === "Select" ? "" : identityStatus
    }&accountType=${account === "Select" ? "" : account}&country=${
      country === "Select" ? "" : country
    }`;
    getPaged(filterBoard ? queryStringSearch : queryString);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
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
        if (res.status === 200) {
          setSearchUsername("");
          setName("");
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
          setLoad(false);
          setFilterBoard(false);
          setTotalItems(res.data.totalPages * 10);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getUsersTotal = () => {
    axios
      .get(
        `${config.baseUrl}/api/vGated/admin/app-users/paged?pageNumber=0&pageSize=99999999&startDate=string&endDate=string&identityVerificationStatus=PENDING_PHONE_VERIFICATION&countryCode=string&phoneNumber=string&name=string&status=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setSearchUsername("");
          setName("");
          setUserDataAll(
            res.data.records.map((data) => ({
              code: data.code,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              firstName: data.firstName,
              lastName: data.lastName,
              emailAddress: data.emailAddress,
              phoneNumber: data.phoneNumber,
              featureAccessControls: data.featureAccessControls,
              country: data.country,
              accountType: data.accountType,
              hasBeenReachedOutTo: data.hasBeenReachedOutTo ? "YES" : "NO",
              identityVerificationStatus: data.identityVerificationStatus,
              status: data.status,
            }))
          );
          setLoad(false);
          setFilterBoard(false);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const closeFilter = () => {
    setFilter(false);
    setCountry("");
    setAccount("");
    setIdentityStatus("");
  };

  const filterUsers = (e) => {
    e.preventDefault();
    setFilter(true);
  };

  const closeCustomerBalance = () => {
    setBalanceInfoModal(false);
  };

  const searchUsersFilter = (e) => {
    e.preventDefault();
    setLoad(true);
    setFilterBoard(true);
    const queryString = `pageNumber=${page}&pageSize=100&identityVerificationStatus=${
      identityStatus === "Select" ? "" : identityStatus
    }&accountType=${account === "Select" ? "" : account}&country=${
      country === "Select" ? "" : country
    }`;
    getPaged(queryString);
  };

  const accountLock = (id, e) => {
    console.log(id);
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/vGated/admin/app-users/lock-user-account/${lockReason}`,
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

  const accountUnlocked = (id, e) => {
    console.log(id);
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/vGated/admin/app-users/unlock-user-account/${id}`,
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
    onCloseDrawer();
    Modal.confirm({
      title: `Are you sure you want to ${
        tableInfo.status === "LOCKED" ? "Unlock" : "Lock"
      } this user?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (tableInfo.status === "LOCKED") {
          accountUnlocked(tableInfo.code);
        } else {
          accountLock(tableInfo.code);
        }
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
        `${config.baseUrl}/api/v1/admin/proxy-transfer/${tableInfo.emailAddress}/balance/`,
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
          setBalanceInfoModal(true);
        }
      })
      .catch((err) => {
        if (err) {
          setError(true);
          setMsg(err.response.data.message);
          onCloseDrawer();
        }
      });
  };

  const updateAccess = () => {
    setLoad(true);

    axios
      .put(
        `${config.baseUrl}/api/v1/admin/traderx-users/apply-access-controls`,
        {
          accessControlRequests: selectedUsersInfo.map((acess) => ({
            code: acess,
            accessControls: featureOptions,
          })),
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
          setMsg("Access Controls Modified Successfully");
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

  const closeBulkAccess = () => {
    setBulkAccessModal(false);
  };

  const changeStatusConfirmPid = (e) => {
    e.preventDefault();
    onCloseDrawer();
    Modal.confirm({
      title: `Are you sure you want to ${
        tableInfo.status === "ACTIVE" ? "put" : "remove"
      } this user on PID?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (tableInfo.status === "ACTIVE") {
          setReasonBox(true);
          setUserId(tableInfo.code);
          // placeAccountPid(id.code)
        } else {
          removeAccountPid(tableInfo.code);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
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

  const featureSelect = [];
  controlData.map((feature) => {
    featureSelect.push(<Option key={feature.control}>{feature.name}</Option>);
  });

  const getAccess = () => {
    axios
      .get(`${config.baseUrl}/api/v1/admin/traderx-users/access-controls`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setAccessControlData(
            res.data.map((data) => ({
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              control: data.control,
              name: data.name,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const handleChangeFeature = (value) => {
    setFeatureOptions(value);
  };

  const removeAccountPid = (id, e) => {
    console.log(id);
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

  const checkBalance = (e) => {
    e.preventDefault();
    setChceckBalanceModal(true);
  };

  const changeStatusConfirmEmail = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to triger welcome email ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        triggerEmail(id.code);
      },
      onCancel() {
        console.log("Cancel");
      },
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
          onCloseDrawer();
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

  const onSearch = (e) => {
    e.preventDefault();
    getUsers();
  };

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <CCol md="6">
                <div className="form-group">
                  <label className="form-label">Filter By Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userNameSearch}
                    placeholder="Filter User By Phone Number"
                    onChange={(e) => setSearchUsername(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-success"
                  onClick={onSearch}
                >
                  Search
                </button>
              </CCol>

            
            </div>
            <div className="pt-3 d-flex justify-content-end align-items-center">
              <Button
                type="primary"
                onClick={() => setFilter(true)}
                style={{ backgroundColor: "blue", color: "white" }}
                className="mr-2"
              >
                Filter Users
              </Button>
              
              <ExportCSV csvData={usersDataAll} fileName={"Users Data"} />
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={usersData}
              fields={[
                { key: "code", name: "Traderx Code" },
                { key: "createdOn", name: "Registered Date" },
                { key: "firstName", name: "First Name" },
                { key: "lastName", name: "Last Name" },
                { key: "phoneNumber", name: "Phone Number" },
                { key: "accountType", name: "Account Type" },
                { key: "country", name: "Country" },

                {
                  key: "identityVerificationStatus",
                  name: "Identitification Statius",
                },
              

                {
                  key: "status",
                  name: "Status",
                },
               
                {
                  key: "Actions",
                  name: "Actions",
                },
              ]}
              scopedSlots={{
              
               
                Actions: (item) => (
                  <div>
                    <Link
                      to={{
                        pathname: "/view_user",
                        state: {
                          page: page,
                          code: item.code,
                          status: item.status,
                          phoneNumber:item?.phoneNumber
                        },
                      }}
                    >
                      <button type="button" class="btn btn-primary mt-2">
                        More
                      </button>
                    </Link>
                  </div>
                ),
              }}
            />
            <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                defaultPageSize={10}
                onChange={pagination}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={"Filter Users"}
        visible={filter}
        footer={null}
        maskClosable={false}
        onCancel={closeFilter}
      >
        <div className="container">
          <CFormGroup>
            <CLabel htmlFor="name">Country</CLabel>
            <CSelect
              id="ccmonth"
              onChange={(e) => setCountry(e.target.value)}
              value={country}
            >
              <option selected>Select</option>
              <option>UNITED_STATES</option>
              <option>NIGERIA</option>
            </CSelect>{" "}
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Account Type</CLabel>
            <CSelect
              id="ccmonth"
              onChange={(e) => setAccount(e.target.value)}
              value={account}
            >
              <option selected>Select</option>
              <option>PERSONAL</option>
              <option>BUSINESS</option>
              <option>PAYEE</option>
            </CSelect>{" "}
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Identity Verification Status</CLabel>
            <CSelect
              id="ccmonth"
              onChange={(e) => setIdentityStatus(e.target.value)}
              value={identityStatus}
            >
              <option selected>Select</option>

              <option>APPROVED</option>
              <option>ACCEPTED</option>
              <option>NOT DONE</option>
            </CSelect>{" "}
          </CFormGroup>

          <div className="text-right">
            <CButton onClick={searchUsersFilter} type="button" color="success">
              {load ? (
                <div
                  class="spinner-border"
                  role="status"
                  style={{ width: "1rem", height: "1rem" }}
                >
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                <>
                  <CIcon name="cil-magnifying-glass" /> Search{" "}
                </>
              )}
            </CButton>
          </div>
        </div>
      </Modal>

      <Modal
        title={" Bulk Access Control"}
        visible={bulkAccessModal}
        footer={null}
        maskClosable={false}
        width={400}
        onCancel={closeBulkAccess}
      >
        <div className="">
          {success && <CAlert color="success">{msg}</CAlert>}
          {error && <CAlert color="danger">{msg}</CAlert>}
          <label> Access Controls</label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={handleChangeFeature}
            defaultValue={[]}
          >
            {featureSelect}
          </Select>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary mt-4 mr-2"
              onClick={updateAccess}
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
                "Submit Bulk Access Controls"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </CRow>
  );
};

export default Users;
