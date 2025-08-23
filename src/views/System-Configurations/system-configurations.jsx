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

const SystemConfig = (props) => {
  const history = useHistory();
  const [addConfig, setAddConfig] = useState(false);
  const [key, setKey] = useState("");
  const [configID, setconfigID] = useState("");
  const [value, setValue] = useState("");
  const [group, setGroup] = useState("");
  const [desc, setDesc] = useState("");
  const [switchUpdate, setSwitchUpdate] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fee, setFee] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmailAddress] = useState("");
  const [country, setCountry] = useState("");
  
  const [groupData, setGroupData] = useState([]);

  const [page, setPage] = useState(1);
  const [settlementData, setConfigurationsData] = useState([]);
  const [linkModal, setLinkModal] = useState(false);
  const [settlementModal, setSearchSettlement] = useState(false);
  const [idLoad, setIdLoad] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const [fill, setFill] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [load, setLoad] = useState(false);
  const [settlementDataAll, setConfigurationsDataAll] = useState([]);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [searchConfig, setSearchConfigModal] = useState(false)

  const [configsData, setConfigsData] = useState({});
  const [reconciliatonModal, setReconciliationSearchModal] = useState(false);


  const createConfig = () => {
    if (value && key && desc && group) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/vGated/admin/system-configuration`,
          {
            key: key,
            value: value,
            group: group,
            description: desc,
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
            setMsg("Configuration Added Successfully");
            setAddConfig(false);
            setError(false);
            setSuccess(true);
            setValue("");
            setKey("");
            setDesc("");
            setGroup("");
            getConfigurations();
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

  const updateSystemConfig = () => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/vGated/admin/system-configuration/${configID}`,
        {
          key: key,
          value: value,
          group: group,
          description: desc,
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
          setMsg("Configuration Updated Successfully");
          setAddConfig(false);
          setError(false);
          setSuccess(true);
          setValue("");
          setKey("");
          setDesc("");
          setGroup("");
          getConfigurations();
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
    setSwitchUpdate(true);
    setconfigID(id.id);
    setValue(id.value);
    setKey(id.key);
    setGroup(id.group);
    setDesc(id.description);
    setAddConfig(true);
  };

  const addConfigModal = () => {
    setSwitchUpdate(false);
    setAddConfig(true);
  };

  const getPaged = (queryString) => {
    if(value || key || group){
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/vGated/admin/system-configuration/paged?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
            setLoad(false);
            setSearchConfigModal(false)
          setTotalItems(res.data.totalPages * 10);
          setConfigurationsData(
            res.data.records.map((data) => ({
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              group: data.group,
              key: data.key,
              description: data.description,
              id: data.id,
              value: data.value,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
    }
  };



  const closeSearchConfig = () => {
      setSearchConfigModal(false)
  }

  const searchConfigSystem = (e) => {
    e.preventDefault();
    const queryString = `key=${key}&group=${group}&pageNumber=${page}&pageSize=100&value=${value}`;
    getPaged(queryString);
  }

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  const pagination = (page, pageSize) => {
    setPage(page);
    const queryString = `key=${key}&group=${group}&pageNumber=${page}&pageSize=${pageSize}&value=${value}`;
    getPaged(queryString);
  };

  useEffect(() => {
    getConfigurations();
    getGroups();
  }, []);

  const getGroups = () => {
    axios
      .get(
        `${config.baseUrl}/api/vGated/admin/system-configuration/groups
      `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setGroupData(res.data);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const reloadConfigs = () => {
    axios
    .get(
      `${config.baseUrl}/api/vGated/admin/system-configuration/reload`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
    .then((res) => {
      if (res.status === 200) {
        setTotalItems(res.data.totalPages * 10);
        setConfigurationsData(
          res.data.records.map((data) => ({
            startDate: moment(data.createdOn).format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
            group: data.group,
            id: data.id,
            key: data.key,
            description: data.description,
            value: data.value,
          }))
        );
      }
    })
    .catch((err) => {
      if (err) {
      }
    });
  }

  const getConfigurations = () => {
    axios
      .get(
        `${config.baseUrl}/api/vGated/admin/system-configuration/paged?key&group=APPLICATION&pageNumber=1&pageSize=100`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setConfigurationsData(
            res.data.records.map((data) => ({
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              group: data.group,
              id: data.id,
              key: data.key,
              description: data.description,
              value: data.value,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getConfigurationsAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/vGated/admin/traderx-users/united_states?pageNumber=1&pageSize=999999999&startDate=&endDate=`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setConfigurationsDataAll(
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

  const closeConfig = () => {
    setAddConfig(false);
    setGroup("");
    setKey("");
    setValue("");
    setDesc("");
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
              <div>
                <button
                  type="button"
                  class="btn btn-primary mr-2"
                  onClick={addConfigModal}
                >
                  Create System Config
                </button>{" "}
                <button
                  type="button"
                  class="btn btn-success mr-2"
                  onClick={() => setSearchConfigModal(true)}
                >
                  Search
                </button>
                <button
                  type="button"
                  class="btn btn-danger mr-2"
                  onClick={reloadConfigs}
                >
                  Reload Configs
                </button>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              id="emp"
              items={settlementData}
              fields={[
                { key: "startDate", name: " Date" },
                { key: "group", name: "Group " },
                { key: "key", name: "Key" },
                { key: "value", name: "Value" },
                { key: "description", name: "Description" },
                { key: "action", name: "Action" },
              ]}
              scopedSlots={{
                action: (item) => (
                  <td>
                    <Button
                      type="primary"
                      onClick={updateConfig.bind(this, item)}
                    >
                      Update Config
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
        title={"Create System Configuration"}
        visible={addConfig}
        footer={null}
        maskClosable={false}
        onCancel={closeConfig}
      >
        <div>
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
          {fill && <CAlert color="danger">All fields are required</CAlert>}
        </div>

        {!switchUpdate ? (
          <div>
            <CFormGroup>
              <CLabel htmlFor="name">Key</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setKey(e.target.value)}
                value={key}
              />
            </CFormGroup>

            <CFormGroup>
              <CLabel htmlFor="name">Value</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
            </CFormGroup>

            <CFormGroup>
              <CLabel htmlFor="name">Group</CLabel>
              <CSelect
                custom
                name="ccmonth"
                id="ccmonth"
                onChange={(e) => setGroup(e.target.value)}
                value={group}
              >
                <option selected>Select</option>
                {groupData.map((group) => {
                  return <option>{group}</option>;
                })}
              </CSelect>{" "}
            </CFormGroup>

            <CFormGroup>
              <CLabel htmlFor="name">Description</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
              />
            </CFormGroup>
          </div>
        ) : (
          <div>
            <CFormGroup>
              <CLabel htmlFor="name">Key</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setKey(e.target.value)}
                value={key}
              />
            </CFormGroup>

            <CFormGroup>
              <CLabel htmlFor="name">Value</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
            </CFormGroup>

            <CFormGroup>
              <CLabel htmlFor="name">Group</CLabel>
              <CSelect
                custom
                name="ccmonth"
                id="ccmonth"
                onChange={(e) => setGroup(e.target.value)}
                value={group}
              >
                <option selected>Select</option>
                {groupData.map((group) => {
                  return <option>{group}</option>;
                })}
              </CSelect>{" "}
            </CFormGroup>

            <CFormGroup>
              <CLabel htmlFor="name">Description</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
              />
            </CFormGroup>
          </div>
        )}

        <div className="d-flex justify-content-end align-items-center">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={switchUpdate ? updateSystemConfig : createConfig}
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
        title={"Search System Configuration"}
        visible={searchConfig}
        footer={null}
        maskClosable={false}
        onCancel={closeSearchConfig}
      >
        <div>
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
        </div>

            <CFormGroup>
              <CLabel htmlFor="name">Key</CLabel>
              <CInput
                id="name"
                type="text"
                required
                onChange={(e) => setKey(e.target.value)}
                value={key}
              />
            </CFormGroup>

            <CFormGroup>
              <CLabel htmlFor="name">Value</CLabel>
             

<CInput
                id="name"
                type="text"
                required
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
            </CFormGroup>

            <CFormGroup>
              <CLabel htmlFor="name">Group</CLabel>
              <CSelect
                custom
                name="ccmonth"
                id="ccmonth"
                onChange={(e) => setGroup(e.target.value)}
                value={group}
              >
                <option selected>Select</option>
                {groupData.map((group) => {
                  return <option>{group}</option>;
                })}
              </CSelect>{" "}
            </CFormGroup>

         
          

        <div className="d-flex justify-content-end align-items-center">
          <button
            type="button"
            class="btn btn-primary mr-2"
            onClick={searchConfigSystem}
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

export default SystemConfig;
