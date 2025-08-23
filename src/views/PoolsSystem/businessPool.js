import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CInput,
  CButton,
  CAlert,
  CFormGroup,
  CSelect,
  CLabel,
  CPagination,
} from "@coreui/react";
import config from "../../config";
import { ExportCSV } from "../../containers/Exportcsv";
import { Pagination, Button, Modal, Skeleton, DatePicker } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const getBadge = (status) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "ACCEPETED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "danger";
    case "REJECTED":
      return "secondary";
    case "CANCELLED	":
      return "danger";

    default:
      return "primary";
  }
};

const Users = () => {
  const [PoolsData, setPoolsData] = useState([]);
  const [addMember, setAddnewMember] = useState(false);
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const closeNewPool = () => {
    setAddnewMember(false);
  };

  useEffect(() => {
    getPools();
  }, []);

  const formatDec = (num, decimals) =>
    num?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getPools = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/pool/business/all?pageNumber=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setPoolsData(
            res.data.map((data) => ({
              firstName: data.traderXUser.firstName,
              id: data.id,
              cutOffAmount: formatDec(data?.cutOffAmount),
              lastName: data.traderXUser.lastName,
              status: data.status,
              emailAddress: data.traderXUser.userHandle,
              createdOn: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              currency: data.currency,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };
  const addNewPoolMember = () => {
    setLoad(true);
    axios
      .post(
        `${config.baseUrl}/api/v1/admin/pool/add`,
        {
          emailAddress: email,
          status: "ACTIVE",
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
          setAddnewMember(false);
          setError(false);
          setMsg("Member successfully added to pool");
          getPools();
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        }
      })
      .catch((err) => {
        setLoad(false);

        if (err) {
          setSuccess(false);
          setError(true);
          setMsg(err?.response?.data?.message);
          setTimeout(() => {
            setError(false);
          }, 3000);
        }
      });
  };


  const showAccConfirm = (id) => {
    confirm({
      title: "Are you sure you want to accept this business user request?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log(id)
        acceptMember(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this member?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        removeMember(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const removeMember = (id) => {
    axios
      .delete(`${config.baseUrl}/api/v1/admin/pool/business/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          setError(false);
          getPools();
          setMsg("Member successfully removed from pool");
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        }
      })
      .catch((err) => {
        if (err) {
          setSuccess(false);
          setError(true);
          setMsg(err?.response?.data?.message);
          setTimeout(() => {
            setError(false);
          }, 3000);
        }
      });
  };

  const acceptMember = (id) => {
    const data = {
      cutOffAmount : formatDec(id.cutOffAmount),
      status : 'ACTIVE',
      emailAddress: id.emailAddress
    }
    axios
      .put(`${config.baseUrl}/api/v1/admin/pool/business/update`,data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          setError(false);
          getPools();
          setMsg("User successfully accepted to pool");
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        }
      })
      .catch((err) => {
        if (err) {
          setSuccess(false);
          setError(true);
          setMsg(err?.response?.data?.message);
          setTimeout(() => {
            setError(false);
          }, 3000);
        }
      });
  };

  return (
    <CRow>
      <CCol>
        <div>
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
        </div>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              Pool lists
              {/* <div>
                <Button
                  type="button"
                  class="btn btn-primary mr-2"
                  style={{ backgroundColor: "blue", color: "white" }}
                  onClick={() => setAddnewMember(true)}
                >
                  Add New member
                </Button>
              </div> */}
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={PoolsData}
              fields={[
                { key: "createdOn", name: "Date" },
                { key: "emailAddress", name: "Email" },
                { key: "firstName", name: "First Name" },

                { key: "lastName", name: "Last Name" },
                { key: "cutOffAmount", name: "Cut of Amount" },

                { key: "currency", name: "Currency" },
                { key: "status", name: "Status" },


                { key: "action", name: "Action" },
              ]}
              scopedSlots={{
                action: (item) => (
                  <td>
                    <div className="d-flex justify-content align-items-between">
                      {item?.status !== 'ACTIVE' &&
                      <button
                        type="button"
                        class="btn btn-success mr-2"
                        onClick={showAccConfirm.bind(this, item)}
                      >
                        Accept Request
                      </button>}
                      <button
                        type="button"
                        class="btn btn-danger mr-2"
                        onClick={showDeleteConfirm.bind(this, item.id)}
                      >
                        Remove Member
                      </button>
                    </div>
                  </td>
                ),
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <Modal
        title={"Add New Pool Member"}
        visible={addMember}
        footer={null}
        maskClosable={false}
        onCancel={closeNewPool}
      >
        <div>
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
        </div>
        <CFormGroup>
          <CLabel htmlFor="name">Email</CLabel>
          <CInput
            id="name"
            type="text"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </CFormGroup>

        <br />
        <div className="d-flex justify-content-end mt-3">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={addNewPoolMember}
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
    </CRow>
  );
};

export default Users;
