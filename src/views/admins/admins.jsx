import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined, SwitcherTwoTone } from "@ant-design/icons";
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
import { Pagination, Modal, Button, DatePicker, Select } from "antd";
import axios from "axios";
import { ExportCSV } from "../../containers/Exportcsv";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Option } = Select;

const Admins = (props) => {
  const history = useHistory();
  const [addConfig, setAddAdmin] = useState(false);
  const [key, setKey] = useState("");
  const [configID, setconfigID] = useState("");
  const [value, setValue] = useState("");
  const [group, setGroup] = useState("");
  const [id, setId] = useState("");
  const [desc, setDesc] = useState("");
  const [configsData, setConfigData] = useState([]);
  const [switchUpdate, setSwitchUpdate] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [adminRoles, setRoles] = useState("");
  const [controlData, setAccessControlData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const featureAccessControls = [];

  const [page, setPage] = useState(1);
  const [adminRecordsData, setAdminRecordData] = useState([]);
  const [totalItems, setTotalItems] = useState("");
  const [fill, setFill] = useState(false);
  const [load, setLoad] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [searchConfig, setSearchConfigModal] = useState(false);

  const featureSelect = [];
  controlData.map((feature) => {
    ["ADMIN", "SUPER_ADMIN", "LEADER_ADMIN"].push(
      <Option key={feature}>{feature?.replace("_", " ")}</Option>
    );
  });

  const featureLISTS = [];
  featureAccessControls.map((feature) => {
    featureLISTS.push(feature);
  });

  const handleChangeFeature = (value) => {
    setRoles(value);
  };

  const getConfigurations = () => {
    axios
      .get(`${config.baseUrl}/api/v1/configurations`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setAccessControlData(res.data.adminRoles);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const createAdmin = () => {
    if (firstName && lastName && password && adminRoles.length > 0 && email) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/vGated/admin/administrators/on-board-admin`,
          {
            emailAddress: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            adminRole: adminRoles


          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 201) {
            setLoad(false);
            setMsg("Admin User Added Successfully");
            setAddAdmin(false);
            setError(false);
            setSuccess(true);
            setEmailAddress("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setTimeout(() => {
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
    } else {
      setFill(true);
      setTimeout(() => {
        setFill(false);
      }, 3000);
    }
  };

  const updateAmin = () => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/update-amin/${id}`,
        {
          emailAddress: email,
          firstName: firstName,
          lastName: lastName,
          adminRole: "REGULAR_USER",
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
          setMsg("Admin User Updated Successfully");
          setAddAdmin(false);
          setError(false);
          setSuccess(true);
          setEmailAddress("");
          setFirstName("");
          setLastName("");
          setPassword("");
          getAdmins();
          setTimeout(() => {
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

  const updateConfig = (id) => {
    console.log(id);
    setSwitchUpdate(true);
    setFirstName(id.firstName);
    setLastName(id.lastName);
    setEmailAddress(id.emailAddress);
    setRoles(id.adminRole);
    setAddAdmin(true);
    setId(id.id);
  };

  const addAdmin = () => {
    setSwitchUpdate(false);
    setAddAdmin(true);
  };

  const getPaged = (queryString) => {
    setLoad(true);
    axios
      .get(`${config.baseUrl}/api/v1/admin/auth?${queryString}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setLoad(false);
          setSearchConfigModal(false);
          setTotalItems(res.data.totalPages * 10);
          setAdminRecordData(
            res.data.records.map((data) => ({
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              emailAddress: data.emailAddress,
              id: data.id,
              adminRole: data.adminRoles,
              firstName: data.firstName,
              lastName: data.lastName,
              roles: data.adminRole,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const closeSearchConfig = () => {
    setSearchConfigModal(false);
  };

  const searchConfigSystem = (e) => {
    e.preventDefault();
    const queryString = `key=${key}&group=${group}&pageNumber=${page}&pageSize=100&value=${value}`;
    getPaged(queryString);
  };

  const pagination = (page, pageSize) => {
    setPage(page);
    const queryString = `key=${key}&group=${group}&pageNumber=${page}&pageSize=${pageSize}&value=${value}`;
    getPaged(queryString);
  };

  useEffect(() => {
    getAdmins();
  }, []);

  const getAdmins = () => {
    axios
      .get(`${config.baseUrl}/api/vGated/admin/administrators/paged?pageNumber=1&pageSize=100`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setAdminRecordData(
            res.data.content.map((data) => ({
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              id: data.id,
              firstName: data.firstName,
              lastName: data.lastName,
              adminRole: data.adminRoles,
              code: data.code,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const closeAddAdmin = () => {
    setAddAdmin(false);
    setFirstName("");
    setEmailAddress("");
    setEmailAddress("");
    setPassword("");
  };

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <p>Admins User</p>
              <div>
                <button
                  type="button"
                  class="btn btn-primary mr-2"
                  onClick={addAdmin}
                >
                  Create Admin
                </button>{" "}
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              id="emp"
              items={adminRecordsData}
              fields={[
                { key: "firstName", name: " First Name" },
                { key: "lastName", name: "Last Name " },
                { key: "emailAddress", name: "Email Address" },
                { key: "adminRole", name: "Role" },
                { key: "action", name: "Action" },
              ]}
              scopedSlots={{
                action: (item) => (
                  <td>
                    <Button
                      type="primary"
                      onClick={updateConfig.bind(this, item)}
                    >
                      View Admin
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
        title={switchUpdate ? "Update Admin" : "Create Admin"}
        visible={addConfig}
        footer={null}
        maskClosable={false}
        onCancel={closeAddAdmin}
      >
        <div>
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
          {fill && <CAlert color="danger">All fields are required</CAlert>}
        </div>

        {!switchUpdate ? (
          <div>
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
              <CLabel htmlFor="name">Email Address</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setEmailAddress(e.target.value)}
                value={email}
              />
            </CFormGroup>

            <CFormGroup>
              <CLabel htmlFor="name">Password</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </CFormGroup>
            <CFormGroup>

              <CFormGroup>
                <label> Admin Roles</label>
                <Select
                  mode="single"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onChange={handleChangeFeature}
                >
                  <Option value={'select'}>Select</Option>
                  <Option value='ADMIN'>ADMIN</Option>
                  <Option value='SUPER_ADMIN'>SUPER_ADMIN</Option>
                  <Option value='LEADER_DMIN'>LEADER_DMIN</Option>


                </Select>
              </CFormGroup>
            </CFormGroup>
          </div>
        ) : (
          <div>
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
              <CLabel htmlFor="name">Email Address</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setEmailAddress(e.target.value)}
                value={email}
              />
            </CFormGroup>


            <p>Current Roles</p>
            <ul>
              {adminRoles.map((role) => {
                return <li>{role}</li>;
              })}
            </ul>

            <CFormGroup>
              <label> Admin Roles</label>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleChangeFeature}
              >
               <Option value={'select'}>Select</Option>
                  <Option value='ADMIN'>ADMIN</Option>
                  <Option value='SUPER_ADMIN'>SUPER_ADMIN</Option>
                  <Option value='LEADER_DMIN'>LEADER_DMIN</Option>

              </Select>
            </CFormGroup>
          </div>
        )}

        <div className="d-flex justify-content-end align-items-center">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={switchUpdate ? updateAmin : createAdmin}
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

export default Admins;
