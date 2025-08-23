import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification, Pagination, Select, Button } from "antd";
import ReactJson from "react-json-view";
import moment from "moment";
import { ExportCSV } from "../../containers/Exportcsv";
import CIcon from "@coreui/icons-react";

import {
  CForm,
  CFormText,
  CCardFooter,
  CAlert,
  CInputFile,
  CCard,
  CBadge,
  CSelect,
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
import axios from "axios";
var userRoles = sessionStorage.getItem("roleUser");

const getBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "danger";
      
      default:
        return "primary";
    }
  };

const Users = () => {
  const history = useHistory();

  const [usersKycData, setUserData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [identity, setIdentity] = useState("");
  const [kycInfo, setKycInfo] = useState([]);
  const [filter, setFilter] = useState(false);
  const [load, setLoad] = useState(false);
  const [verificationReasonsDatas, setVerificationReasonsData] = useState([]);
  const [declineModal, setDecline] = useState(false);
  const [reason, setReason] = useState("");
  const [userId, setUserId] = useState("");
  const [usersKycDataAll, setUserDataAll] = useState([]);
  const [country, setCountry] = useState("");
  const [account, setAccount] = useState("");
  const [identityStatus, setIdentityStatus] = useState("");
  const [filterBoard, setFilterBoard] = useState(false);
  const [loadView, setLoadView] = useState(false);
  const [providerDetails, setProviderDetails] = useState({});
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [fill, setFill] = useState(false);
  const [reasonsMulti, setReasonsMutli] = useState("");
  const [viewProviderModal, setViewProviderModal] = useState(false);

  const closeViewProvider = () => {
    setViewProviderModal(false);
  };

  const closeFilter = () => {
    setFilter(false);
    setCountry("");
    setAccount("");
    setIdentityStatus("");
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
      .get(`${config.baseUrl}/api/v1/admin/companies?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setFilter(false);
          setLoad(false);
          const result = res.data.content;
          setUserData(
            result.map((data) => ({
              code: data.companyCode,
              id: data.id,
              name: data.companyName,
              lastName: data.lastName,
              firstName: data?.administrator?.firstName,
              lastName: data?.administrator?.lastName,
              email: data?.administrator?.emailAddress,
              phoneNumber: data?.administrator?.phoneNumber,

              identificationDocument: data.identificationDocument,
              identificationNumber: data.identificationNumber,
              identificationType: data.identificationType,
              status: data.status,
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

  const getUsersKycAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/traderx-users/kyc?pageNumber=1&pageSize=999999999&accountType=&country=&identityVerificationStatus=APPROVED`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          const result = res.data.content;
          setUserDataAll(
            result.map((data) => ({
              code: data.companyCode,
              name: data.companyName,
              firstName: data?.administrator?.firstName,
              lastName: data?.administrator?.lastName,
              email: data?.administrator?.emailAddress,
              phoneNumber: data?.administrator?.phoneNumber,

              id: data.id,
              lastName: data.lastName,
              identificationNumber: data.identificationNumber,
              identificationType: data.identificationType,
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

  const searchUsersFilter = (e) => {
    e.preventDefault();
    setLoad(true);
    const queryString = `pageNumber=${page}&pageSize=10&name=${name}&status=INACTIVE`;
    getKycPaged(queryString);
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

  const pagination = (page, pageSize) => {
    console.log(page);
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=${pageSize}&name&status=INACTIVE`;
    getKycPaged(queryString);
  };

  const closeView = () => {
    setViewModal(false);
  };

  useEffect(() => {
    getUsersKyc();
    verificationReasons();
    getUsersKycAll();
  }, []);

  const viewProviderFunc = () => {
    setViewProviderModal(true);
  };

  const getUsersKyc = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/companies?pageNumber=1&pageSize=100&name&status=INACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          const result = res.data.content;
          setUserData(
            result.map((data) => ({
              code: data.companyCode,
              id: data.id,
              identificationDocument: data.identificationDocument,
              name: data.companyName,
              firstName: data?.administrator?.firstName,
              lastName: data?.administrator?.lastName,
              email: data?.administrator?.emailAddress,
              phoneNumber: data?.administrator?.phoneNumber,

              identificationNumber: data.identificationNumber,
              identificationType: data.identificationType,
              status: data.status,
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
  const changeStatusConfirm = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to activate this company?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        approve(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const changeStatusDecline = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to decline this comapany ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        decline(id);
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
      .put(
        `${config.baseUrl}/api/v1/admin/companies/${id}/activate`,
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
          setMsg("Company Activated Successfully");
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

  const decline = (id, e) => {
      setLoad(true);
      axios
        .put(
          `${config.baseUrl}/api/v1/admin/companies/${id}/deactivate`,
         {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setLoad(true);
          setReason("");
          if (res.status === 200) {
            setSuccess(true);
            setLoad(false);
            setTimeout(() => {
              setSuccess(false);
            }, 3000);
            setReasonsMutli("");
            setMsg("Company Declined Successfully");
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
    
  };



  const view = (id, e) => {
    console.log(id);
    setLoadView(true);
    axios
      .get(`${config.baseUrl}/api/v1/admin/verification/details/${id.code}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          const infoProvider = res.data.providerKycResponseData
            ? JSON.parse(res.data.providerKycResponseData)
            : false;
          console.log(infoProvider);
          setViewModal(true);
          setProviderDetails(infoProvider);
          setKycInfo(res.data);
        }
      })
      .catch((err) => {
        setLoad(false);
        Notification("error", "Error", "Connection Error");
        if (err) {
        }
      });
  };

  const Notification = (type, msgType, msg) => {
    notification[type]({
      message: msgType,
      description: msg,
    });
  };

  const viewDoc = (doc) => {
    setIdentity(doc);
    console.log(doc)
    setViewModal(true);
  };


  var myDate = new Date(570776400 * 1000).toLocaleString();

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="pt-3 d-flex justify-content-between align-items-center">
              <p>Inactive Companies</p>
              <div>
                <Button
                  type="primary"
                  onClick={() => setFilter(true)}
                  style={{ backgroundColor: "blue", color: "white" }}
                  className="mr-2"
                >
                  Filter Company
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
                  name: "Company Code",
                },

                {
                  key: "name",
                  name: "Company Name",
                },
                {
                  key: "firstName",
                  name: "First Name",
                },
                {
                  key: "lastName",
                  name: "Last Name",
                },
                {
                  key: "email",
                  name: " Email Address",
                },
                {
                  key: "phoneNumber",
                  name: "Phone Number",
                },
               
               
                {
                  key: "identificationNumber",
                  name: "Identification Number",
                },
                {
                  key: "identificationType",
                  name: "Identitification Type",
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
                  <td className="d-flex">
                      <button
                        type="button"
                        class="btn btn-success"
                        onClick={changeStatusConfirm.bind(this, item.id)}
                      >
                        Acitvate
                      </button>
                      <button
                      type="button"
                      class="btn btn-info ml-2"
                      onClick={viewDoc.bind(this, item.identificationDocument)}
                    >
                      View Document
                    </button>
                

                   
                
                  </td>
                ),
                status: (item) => (
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge>
                    </td>
                  ),
              }}
            />
            <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                defaultPageSize={100}
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
          <label>Verification Type Reason</label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            value={reasonsMulti}
            onChange={handleChange}
          >
            {verificationReasonSelect}
          </Select>
          <br />
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
        title={false}
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
                <CCardHeader>Identification Document</CCardHeader>
                <CCardBody>
                  <CForm
                    action=""
                    method="post"
                    encType="multipart/form-data"
                    className="form-horizontal"
                  >
                    {identity && (
                      <CFormGroup row>
                       
                        <CCol xs="12" md="12">
                          <div
                            style={{
                              border: "1px solid dotted",
                              color: "#000000",
                            }}
                          >
                            <img
                              width="100%"
                              height="500"
                              alt="No Identitification"
                              src={`data:image/png;base64,${
                                identity ? identity : "N/A"
                              }`}
                            />
                          </div>{" "}
                        </CCol>
                      </CFormGroup>
                    )}
                    <br />
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </Modal>

      <Modal
        title={"Filter Users"}
        visible={filter}
        footer={null}
        maskClosable={false}
        onCancel={closeFilter}
      >
        <div className="container">
          <CFormGroup>
            <CLabel htmlFor="name">Company Name</CLabel>
            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
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
