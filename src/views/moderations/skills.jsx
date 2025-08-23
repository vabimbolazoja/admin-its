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
import { Pagination, Modal, Button, DatePicker, Select, notification } from "antd";
import axios from "axios";
import { ExportCSV } from "../../containers/Exportcsv";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Option } = Select;

const Admins = (props) => {
    const history = useHistory();
    const categoryId =  props?.history?.location?.state?.id
    ? props?.history?.location?.state?.id
    : "";
    const [addConfig, setAddAdmin] = useState(false);
    const [key, setKey] = useState("");
    const [configID, setconfigID] = useState("");
    const [value, setValue] = useState("");
    const [icon, setIcon] = useState("")
    const [image, setImage] = useState("")
    const [color, setColor] = useState("")
    const [group, setGroup] = useState("");
    const [skillId, setSkillId] = useState("")
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
    const [name, setName] = useState("")
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


    const createskill = () => {
        if (name && icon && color && image) {
            setLoad(true);
            axios
                .post(
                    `${config.baseUrl}/api/vGated/admin/category-moderation/categories/${categoryId}/skill`,
                    {
                        "name": name,
                        "chipColor": color,
                

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
                        setMsg("Skill Added Successfully");
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

    const updateskill = () => {
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
                    getSkills();
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
                    Notification('success','Success', err?.response?.data?.message)

                }
            });
    };

    const skillEnable = () => {
        axios
            .post(
                `${config.baseUrl}/api/vGated/admin/category-moderation/skills/${skillId}/enable`,
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
                    getSkills()
                    Notification('success','Success', 'Skill Enable Successfully')
                }
            })
            .catch((err) => {
                Notification('success','Success', err?.response?.data?.message)

            });

    }

    const Notification = (type, msgType, msg) => {
        notification[type]({
          message: msgType,
          description: msg,
        });
      };

    const skillDisable = () => {
        axios
            .post(
                `${config.baseUrl}/api/vGated/admin/category-moderation/skills/${skillId}/disable`,
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
                    getSkills()
                    Notification('success','Success', 'Skill Disabled Successfully')

                }
            })
            .catch((err) => {
                Notification('success','Success', err?.response?.data?.message)

            });


    }

    const skillconfirm = (item) => {
        Modal.confirm({
            title: `Are you sure you want to ${item === "INACTIVE" ? "Enable" : "Disable"
                } this category?`,
            icon: <ExclamationCircleOutlined />,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                if (item?.status === "INACTIVE") {
                    skillEnable();
                } else {
                    skillDisable();
                }
            },
            onCancel() { },
        });

    }

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
        getSkills();
    }, [categoryId]);

    const getSkills = () => {
        axios
            .get(`${config.baseUrl}/api/vGated/admin/category-moderation/categories/${categoryId}/skills`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    setTotalItems(res.data.totalPages * 10);
                    setAdminRecordData(
                        res.data
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
                            <p>Skill Moderation</p>
                            <div>
                                <button
                                    type="button"
                                    class="btn btn-primary mr-2"
                                    onClick={addAdmin}
                                >
                                    Create Skill
                                </button>{" "}
                            </div>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            id="emp"
                            items={adminRecordsData}
                            fields={[
                                { key: "name", name: "  Name" },
                                { key: "chipColor", name: "Color " },
                                { key: "status", name: "Status" },
                                { key: "action", name: "Action" },
                            ]}
                            scopedSlots={{
                                action: (item) => (
                                    <td>
                                      
                                      <Button
                                            type="primary"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setSkillId(item?.id)
                                                skillconfirm(item?.status)
                                            }}
                                        >
                                            {item?.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                                        </Button>
                                    </td>
                                ),
                              
                             
                            }}
                        />
                        <div className="text-center pagination-part">
                            {/* <Pagination
                                current={page}
                                total={totalItems}
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`
                                }
                                defaultPageSize={100}
                                onChange={pagination}
                            /> */}
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>

            <Modal
                title={switchUpdate ? "Update Category" : "Create Skill"}
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
                            <CLabel htmlFor="name"> Name</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </CFormGroup>

                        <CFormGroup>
                            <CLabel htmlFor="name">Chip  Color</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setColor(e.target.value)}
                                value={color}
                            />
                        </CFormGroup>

                    

                    </div>
                ) : (
                    <div>
                        <CFormGroup>
                            <CLabel htmlFor="name"> Name</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </CFormGroup>

                        <CFormGroup>
                            <CLabel htmlFor="name">Chip Color</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setColor(e.target.value)}
                                value={color}
                            />
                        </CFormGroup>

                   
                    </div>
                )}

                <div className="d-flex justify-content-end align-items-center">
                    <button
                        type="button"
                        class="btn btn-primary mr-2"
                        onClick={switchUpdate ? updateskill : createskill}
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
