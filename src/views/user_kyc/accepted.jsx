import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification, Pagination, Select, Button } from "antd";
import ReactJson from "react-json-view";
import moment from "moment";
import { ExportCSV } from "../../containers/Exportcsv";

import {
  CForm,
  CFormText,
  CCardFooter,
  CAlert,
  CSelect,
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
import config from "../../config";
import CIcon from "@coreui/icons-react";
import axios from "axios";
var userRoles = sessionStorage.getItem("roleUser");

const Users = () => {
  const history = useHistory();

  const [usersKycData, setUserData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [filterModal, setFilter] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [kycInfo, setKycInfo] = useState({});
  const [load, setLoad] = useState(false);
  const [verificationReasonsDatas, setVerificationReasonsData] = useState([]);
  const [declineModal, setDecline] = useState(false);
  const [reason, setReason] = useState("");
  const [usersKycDataAll, setUserDataAll] = useState([]);
  const [country, setCountry] = useState("");
  const [account, setAccount] = useState("");
  const [identityStatus, setIdentityStatus] = useState("");
  const [filterBoard, setFilterBoard] = useState(false);
  const [userId, setUserId] = useState("");
  const [loadView, setLoadView] = useState(false);
  const [providerDetails, setProviderDetails] = useState({});
  const [msg, setMsg] = useState("");
  const [fill, setFill] = useState(false);
  const [reasonsMulti, setReasonsMutli] = useState(false);
  const [viewProviderModal, setViewProviderModal] = useState(false);

  const closeViewProvider = () => {
    setViewProviderModal(false);
  };

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");

  const { Option } = Select;

  const verificationReasonSelect = [];
  verificationReasonsDatas.map((reason) => {
    verificationReasonSelect.push(
      <Option key={reason}>{reason.replace("_", " ")}</Option>
    );
  });

  function handleChange(value) {
    setReasonsMutli(value);
  }

  const getKycPaged = (queryString) => {
    axios
      .get(`${config.baseUrl}/api/vGated/admin/customer-kyc/all?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setFilter(false);
          setLoad(false)
          setUserData(
            res.data.records.map((data) => ({
              code: data.code,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              emailAddress: data.emailAddress,
              country: data.country,
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              accountType: data.accountType,
              identityVerificationStatus: data.identityVerificationStatus,
            }))
          );
          setTotalItems(res.data.totalPages * 10);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const verificationReasons = () => {
    axios
      .get(`${config.baseUrl}/api/v1/configurations`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setVerificationReasonsData(res.data.verificationFailureReasonTypes);
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
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&identityVerificationStatus=ACCEPTED&accountType=&country`;
    const queryStringSearch = `pageNumber=${page}&pageSize=10&identityVerificationStatus=${identityStatus === "Select" ? "" : identityStatus
      }&accountType=${account === "Select" ? "" : account}&country=${country === "Select" ? "" : country
      }`;
    getKycPaged(filterBoard ? queryStringSearch : queryString);

  };

  const closeDecline = () => {
    setDecline(false);
    setReason("");
    setReasonsMutli("");
  };

  const openDecline = (id) => {
    setUserId(id);
    setDecline(true);
    setReason("");
  };

  const closeView = () => {
    setViewModal(false);
  };

  useEffect(() => {
    getUsersKyc();

  }, []);

  const viewProviderFunc = () => {
    setViewProviderModal(true);
  };

  const getUsersKyc = () => {
    axios
      .get(
        `${config.baseUrl}/api/vGated/admin/customer-kyc?pageNumber=1&pageSize=100&accountType=&country=&kycApprovalStatus=PENDING`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setUserData(
            res.data.records.map((data) => ({
              code: data.code,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              firstName: data.firstName,
              lastName: data.lastName,
              emailAddress: data.emailAddress,
              country: data.countryCode,
              identificationType: data?.identificationType,
              phoneNumber: data.phoneNumber,
              status: data.status,
              id:data?.id,
              identification:data?.identification,
              profilePicture:data?.profilePicture
            }))
          );
          setTotalItems(res.data.totalPages * 10);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getUsersKycAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/vGated/admin/customer-kyc?pageNumber=1&pageSize=999999999&accountType=&country=&identityVerificationStatus=ACCEPTED`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setUserDataAll(
            res.data.records.map((data) => ({
              code: data.code,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              firstName: data.firstName,
              lastName: data.lastName,
              emailAddress: data.emailAddress,
              country: data.country,
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

  const changeStatusConfirm = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to approve this user?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        approve(id.id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const approve = (id, e) => {
    console.log(id);
    setLoad(true);
    axios
      .post(
        `${config.baseUrl}/api/vGated/admin/customer-kyc/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 204) {
          setSuccess(true);
          setMsg("User Kyc Approved Successfully");
          getUsersKyc();
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

  const searchUsersFilter = (e) => {
    e.preventDefault();
    setLoad(true);
    setFilterBoard(true);
    const queryString = `pageNumber=${page}&pageSize=100&identityVerificationStatus=${identityStatus === "Select" ? "" : identityStatus
      }&accountType=${account === "Select" ? "" : account}&country=${country === "Select" ? "" : country
      }`;
    getKycPaged(queryString);
  };

  const decline = (id, e) => {
    if (reason) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/vGated/admin/customer-kyc/${userId.id}/reject/${reason}`,
          {
          
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setLoad(true);
          setReason("");
          if (res.status === 204) {
            setSuccess(true);
            setLoad(false);
            setTimeout(() => {
              setSuccess(false);
            }, 3000);
            setReasonsMutli("");
            setMsg("User Kyc Declined Successfully");
            getUsersKyc();
            setError(false);
            setDecline(false);
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
          }
        });
    } else {
      setFill(true);
      setTimeout(() => {
        setFill(false);
      }, 2500);
    }
  };

  const closeFilter = () => {
    setFilter(false);
    setCountry("");
    setAccount("");
    setIdentityStatus("");
  };

  const view = (id, e) => {
    console.log(id);
    setViewModal(true);
    setKycInfo(id);

  };

  const Notification = (type, msgType, msg) => {
    notification[type]({
      message: msgType,
      description: msg,
    });
  };

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="pt-3 d-flex justify-content-between align-items-center">
              <p>Accepted KYC</p>
              <div>
                <Button
                  type="primary"
                  onClick={() => setFilter(true)}
                  style={{ backgroundColor: "blue", color: "white" }}
                  className="mr-2"
                >
                  Filter Users Kyc
                </Button>
                <ExportCSV
                  csvData={usersKycDataAll}
                  fileName={"Accepted Data"}
                />
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={usersKycData}
              fields={[
                {
                  key: "code",
                  name: "Traderx Code",
                },
                { key: "createdOn", name: "Registered Date" },

                {
                  key: "firstName",
                  name: "First Name",
                },
                {
                  key: "lastName",
                  name: "Last Name",
                },
                {
                  key: "emailAddress",
                  name: "Email Address",
                },
                {
                  key: "country",
                  name: "Country",
                },
                {
                  key: "phoneNumber",
                  name: "phone Number",
                },
                {
                  key: "identificationType",
                  name: "Identity Type",
                },

                {
                  key: "Actions",
                  name: "Actions",
                },
              ]}
              scopedSlots={{
                Actions: (item) => (
                  <td className="d-flex">
                    <button
                      type="button"
                      class="btn btn-success mr-2"
                      onClick={changeStatusConfirm.bind(this, item)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger mr-2"
                      onClick={openDecline.bind(this, item)}
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={view.bind(this, item)}
                    >
                      VIew Details
                    </button>

                  </td>
                ),
              }}
            />
            <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                defaultPageSize={100}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                onChange={pagination}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={"Decline User"}
        visible={declineModal}
        footer={null}
        maskClosable={false}
        onCancel={closeDecline}
      >
        <div className="container">
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
          {fill && (
            <p className="text-danger text-center">Reason is required </p>
          )}
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
        
          <CButton block color="danger" onClick={decline}>
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
          </CButton>
        </div>
      </Modal>

      <Modal
        title={"Provider Details"}
        visible={viewProviderModal}
        footer={null}
        maskClosable={false}
        onCancel={closeViewProvider}
        width={600}
      >
        <ReactJson src={providerDetails} />
      </Modal>

      <Modal
        title={"View Kyc Details"}
        visible={viewModal}
        footer={null}
        maskClosable={false}
        onCancel={closeView}
        width={800}
      >
        <div className="container">
          <CRow>
            <CCol xs="12" md="12">
              <CCard>
                <CCardHeader>Kyc Information</CCardHeader>
                <CCardBody>
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
                          {kycInfo.emailAddress ? kycInfo.emailAddress : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="text-input">Street Address</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {kycInfo.streetAddress
                            ? kycInfo.streetAddress
                            : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="email-input">City</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {kycInfo.city ? kycInfo.city : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="email-input">Postal Code</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {kycInfo.postalCode ? kycInfo.postalCode : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="password-input">State</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {kycInfo.state ? kycInfo.state : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="date-input">Date of Birth</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {kycInfo.dateOfBirthFormattedString
                            ? kycInfo.dateOfBirthFormattedString
                            : "N/A"}{" "}
                        </p>
                      </CCol>
                    </CFormGroup>
                   
               
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="disabled-input">
                          Provider Approval Status{" "}
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {kycInfo.providerKycApprovalStatus
                            ? kycInfo.providerKycApprovalStatus
                            : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="disabled-input">
                          Provider Message
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {providerDetails.message
                            ? providerDetails.message
                            : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>

                   
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="disabled-input">Identity Type</CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <p className="form-control-static">
                          {kycInfo.identificationType
                            ? kycInfo.identificationType
                            : "N/A"}
                        </p>
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md='3'>
                        <CLabel htmlFor='disabled-input'>
                          Profile Picture {' '}
                        </CLabel>
                      </CCol>
                      <CCol xs='12' md='9'>
                        <div
                          style={{
                            border: '1px solid dotted',
                            color: '#000000'
                          }}
                        >
                          <img
                            width='100%'
                            height='500'
                            src={
                              kycInfo.profilePicture
                                ? kycInfo.profilePicture
                                : 'N/A'
                            }
                          />
                        </div>{' '}
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md='3'>
                        <CLabel htmlFor='disabled-input'>
                          Identification Document{' '}
                        </CLabel>
                      </CCol>
                      <CCol xs='12' md='9'>
                        <div
                          style={{
                            border: '1px solid dotted',
                            color: '#000000'
                          }}
                        >
                          <img
                            width='100%'
                            height='500'
                            src={
                              kycInfo.identification
                                ? kycInfo.identification
                                : 'N/A'
                           }
                          />
                        </div>{' '}
                      </CCol>
                    </CFormGroup>
                
                    {providerDetails && (
                      <button
                        type="button"
                        class="btn btn-primary"
                        onClick={viewProviderFunc}
                      >
                        VIew Provider Details
                      </button>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </Modal>

      <Modal
        title={"Filter Users"}
        visible={filterModal}
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
    </CRow>
  );
};

export default Users;
