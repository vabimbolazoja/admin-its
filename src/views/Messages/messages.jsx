import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CTextarea,
  CInput,
  CLabel,
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
import { message, Modal, Select } from "antd";
const Users = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [limitData, setLimitData] = useState([]);
  const [createSettlement, setCreate] = useState(false);

  const [success, setSuccess] = useState(false);
  const [deleteSuccess, setDelSuccess] = useState(false);
  const [title, settTitle] = useState("");
  const [deleteErr, setDelErr] = useState(false);
  const [emails, setemails] = useState([]);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [load, setLoad] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [emailerror, setemailerror] = useState(false);
  const [identity, setIdentity] = useState([]);
  const [channel, setChannel] = useState([]);
  const [country, setCountry] = useState([]);
  const [scalingThreshold, setThreshold] = useState("");
  const [singleTransactionLimit, setSingleTransaction] = useState("");
  const [dailyCumulativeTransactionLimit, setDailyCumulative] = useState("");
  const [globalLimit, setGlobalLimit] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [push, setPush] = useState(false);
  const [updateState, setUpdateState] = useState("");
  const [id, setID] = useState("");
  const [configDatas, setConfigsData] = useState({});

  const closeCreate = () => {
    setCreate(false);
    setMessageBody("");
    setCountry([])
    setIdentity([])
    setChannel([])
    settTitle("")
    setemails([])
  };

  const optionsCountries = [
    { value: "NIGERIA", label: "NIGERIA" },
    { value: "UNITED_STATES", label: "UNITED_STATES" },
    { value: "GHANA", label: "GHANA" },
  ];
  const optionsIdentity = [];

  const optionsChannells = [
    {
      value: "PUSH_NOTIFICATION",
      label: "PUSH",
    },
    {
      value: "EMAIL",
      label: "EMAIL",
    },
    {
      value: "IN_APP",
      label: "IN_APP",
    },
    {
      value: "SMS",
      label: "SMS",
    },
  ];
  const handleChangeCountry = (value) => {
    setCountry(value);
  };
  const handleChangeidentity = (value) => {
    setIdentity(value);
  };

  const handleChangeChannel = (value) => {
    setChannel(value);
  };

  const addLimit = () => {
    if (messageBody) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/admin/notification/target-users
      `,
          {
            title: title,
            internal: false,
            custom: true,
            content: messageBody,
            countries: country,
            identityVerificationStatusList: identity,
            channels: channel,
            customAddressList: emails,
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
            setMessageBody("");
            getLimitProfileSettlemts();
            setMsg("Message Sent Successfully");
            setTimeout(() => {
              setMsg("");
              setCreate(false);
              setSuccess(false);
            }, 3500);
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
    }
  };

  const getConfigs = () => {
    axios
      .get(`${config.baseUrl}/api/v1/configurations`)
      .then((res) => {
        if (res.data) {
          setConfigsData(res.data);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  useEffect(() => {
    getConfigs();
    getLimitProfileSettlemts()
  }, []);

  console.log(optionsIdentity);

  const getLimitProfileSettlemts = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/notification/target-users/list?pageNumber=1&pageSize=100
        `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data) {
          console.log(limitData);
          setLimitData(
            res.data.map((data) => ({
              createdOn: data.dateSent ? data.dateSent.slice(0, 10) : "",
              message: data.content,
              title: data.title,
              channels: data.channels,
              identityVerificationStatusList: data.identityVerificationStatusList,
              countries:data.countries
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const deleteFunc = (id) => {
    console.log(id);
    setLoad(true);
    axios
      .delete(
        `${config.baseUrl}/api/v1/admin/notification-preset/${id.id}
      `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setDelErr(true);
          setMsg("Message Deleted Successfully");
          getLimitProfileSettlemts();
          setTimeout(() => {
            setMsg("");
            setDelErr(false);
          }, 2500);
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err.response !== undefined) {
          setMsg(err.response.data.message);
          setDelErr(true);
          setTimeout(() => {
            setMsg("");
            setDelErr(false);
          }, 2500);
        } else {
          setMsg("Connection Error");
          setDelErr(false);
        }
      });
  };

  const confirmDelete = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to delete this notification preset ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteFunc(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const createSettlementFunc = () => {
    setUpdateState(false);
    setCreate(true);
  };

  configDatas?.identityVerificationStatuses?.map((d) => {
    return optionsIdentity?.push({ value: d, label: d });
  });

  console.log(optionsIdentity);

  return (
    <>
      <CRow>
        <CCol>
          {success && <CAlert color="success">{msg}</CAlert>}

          {error && <CAlert color="danger">{msg}</CAlert>}
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div>Notification Presets</div>
                <button
                  type="button"
                  class="btn btn-primary mr-2"
                  onClick={createSettlementFunc}
                >
                  Create Message
                </button>
              </div>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={limitData}
                fields={[
                  { key: "createdOn", name: "Created On" },
                  { key: "message", name: "Message" },
                  { key: "title", name: "Title" },
                  { key: "countries", name: "Countries" },
                  { key: "channels", name: "Channels" },
                  { key: "identityVerificationStatusList", name: "Identifications List Types" },




                  {
                    key: "Actions",
                    name: "Actions",
                  },
                ]}
                hover
                striped
                itemsPerPage={5}
                activePage={page}
                scopedSlots={{
                  Actions: (item) => (
                    <td className="d-flex">
                      {/* <button
                          type='button'
                          class='btn btn-success mr-2'
                          onClick={updateFunc.bind(this, item)}
                        >
                          Update
                        </button> */}
                      <button
                        type="button"
                        class="btn btn-danger"
                        onClick={confirmDelete.bind(this, item)}
                      >
                        Delete
                      </button>
                    </td>
                  ),
                }}
                clickableRows
              />
              {/* <CPagination
                  activePage={page}
                  onActivePageChange={pageChange}
                  pages={5}
                  doubleArrows={false}
                  align='center'
                /> */}
            </CCardBody>
          </CCard>
        </CCol>

        <Modal
          title={updateState ? "Update Limit Profile" : "Create Message"}
          visible={createSettlement}
          footer={null}
          maskClosable={false}
          onCancel={closeCreate}
        >
          <div className="container">
            <form>
              {success && <CAlert color="success">{msg}</CAlert>}

              {error && <CAlert color="danger">{msg}</CAlert>}
              <>
                <CFormGroup>
                  <CLabel htmlFor="name">Country</CLabel>

                  <Select
                    mode="multiple"
                    allowClear
                    style={{
                      width: "100%",
                    }}
                    placeholder="Please select"
                    onChange={handleChangeCountry}
                    options={optionsCountries}
                  />
                </CFormGroup>

                <CFormGroup>
                  <CLabel htmlFor="name">Identification Status</CLabel>
                  <Select
                    mode="multiple"
                    style={{
                      width: "100%",
                    }}
                    placeholder="Please select"
                    onChange={handleChangeidentity}
                    options={optionsIdentity}
                  />
                </CFormGroup>

                <CFormGroup>
                  <CLabel htmlFor="name">Notification channels</CLabel>
                  <Select
                    mode="tags"
                    style={{
                      width: "100%",
                    }}
                    placeholder="Please select"
                    onChange={handleChangeChannel}
                    options={optionsChannells}
                  />
                </CFormGroup>

                <CFormGroup>
                  <CLabel htmlFor="name">Title</CLabel>
                  <CInput
                    id="name"
                    type="text"
                    required
                    onChange={(e) => settTitle(e.target.value)}
                    value={title}
                  />
                </CFormGroup>

                <CFormGroup>
                  <CLabel htmlFor="name">Message</CLabel>
                  <CTextarea
                    id="name"
                    type="text"
                    required
                    onChange={(e) => setMessageBody(e.target.value)}
                    value={messageBody}
                  />
                </CFormGroup>
                <div>
                  <div className="col-lg-12 p-0 ">
                    <div className="">Custom User Email</div>
                    <div
                      className="rounded-lg mt-2"
                      style={{
                        border: emailerror.empty
                          ? "1px solid red"
                          : "1px solid #ddd",
                        height: 100,
                      }}
                    >
                      <Select
                        mode="tags"
                        bordered={false}
                        style={{
                          width: "100%",
                          fontSize: "14px",
                          height: "100%",
                          overflowY: "scroll",
                          overflowX: "none",
                        }}
                        className=""
                        value={emails}
                        //   size="large"
                        onBlur={() => {
                          setemailerror({
                            number: false,
                            empty: false,
                          });
                        }}
                        onChange={(val) => {
                          if (emails.length == 5) {
                            return setemailerror((prev) => {
                              return {
                                ...prev,
                                number: true,
                              };
                            });
                          }
                          setemails((prev) => {
                            let array = [...prev, ...val];
                            return [...new Set(array)];
                          });
                        }}
                        onChange={(val) => {
                          if (emails.length == 5) {
                            return setemailerror((prev) => {
                              return {
                                ...prev,
                                number: true,
                              };
                            });
                          }
                          setemails((prev) => {
                            let array = [...prev, ...val];
                            return [...new Set(array)];
                          });
                        }}
                        tokenSeparators={[","]}
                      ></Select>
                    </div>
                  </div>
                </div>
              </>

              <br />
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-primary mr-2"
                  onClick={addLimit}
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
            </form>
          </div>
        </Modal>
      </CRow>
    </>
  );
};

export default Users;
