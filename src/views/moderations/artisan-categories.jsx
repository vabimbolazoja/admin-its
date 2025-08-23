import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
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
    const [addConfig, setAddAdmin] = useState(false);
    const [key, setKey] = useState("");
    const [configID, setconfigID] = useState("");
    const [value, setValue] = useState("");
    const [icon, setIcon] = useState("")
    const [image, setImage] = useState("")
    const [color, setColor] = useState("")
    const [group, setGroup] = useState("");
    const [catId, setCatId] = useState("")
    const [id, setId] = useState("");
    const [desc, setDesc] = useState("");
    const [configsData, setConfigData] = useState([]);
    const [switchUpdate, setSwitchUpdate] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [addressFile, setAddressFile] = useState("")
    const [viewAddress, setViewAddress] = useState(false)
    const [lastName, setLastName] = useState("");
    const [email, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [adminRoles, setRoles] = useState("");
    const [controlData, setAccessControlData] = useState([]);
    const [groupData, setGroupData] = useState([]);
    const featureAccessControls = [];

    const [reasonModal, setReasonModal] = useState(false)
    const [reason, setReason] = useState("")
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


    const createCategory = () => {
        if (name && icon && color && image) {
            setLoad(true);
            axios
                .post(
                    `${config.baseUrl}/api/vGated/admin/category-moderation/categories`,
                    {
                        "name": name,
                        "icon": icon,
                        "color": color,
                        "image": image


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
                        setMsg("Category Added Successfully");
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

    const updateCategory = () => {
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
                    getAddresses();
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
                    Notification('success', 'Success', err?.response?.data?.message)

                }
            });
    };

    const categoryEnable = () => {
        axios
            .post(
                `${config.baseUrl}/api/vGated/admin/moderation/artisan-categories/${catId}/approve`,
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
                    getAddresses()
                    Notification('success', 'Success', 'Address Approved Successfully')
                }
            })
            .catch((err) => {
                Notification('success', 'Success', err?.response?.data?.message)

            });

    }

    const Notification = (type, msgType, msg) => {
        notification[type]({
            message: msgType,
            description: msg,
        });
    };

    const categoryDisable = () => {
        setLoad(true)
        axios
            .post(
                `${config.baseUrl}/api/vGated/admin/moderation/artisan-categories/${catId}/reject/${reason}`,
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
                    getAddresses()
                    Notification('success', 'Success', 'Address Rejected Successfully')

                }
            })
            .catch((err) => {
                setLoad(false)
                Notification('success', 'Success', err?.response?.data?.message)

            });


    }

    const categoryConfirm = (item) => {
        Modal.confirm({
            title: `Are you sure you want to approve this address?`,
            icon: <ExclamationCircleOutlined />,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {

                categoryEnable();

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
        getAddresses();
    }, []);

    const getAddresses = () => {
        axios
            .get(`${config.baseUrl}/api/vGated/admin/moderation/artisan-categories?pageNumber=1&pageSize=100`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    setTotalItems(res.data.totalPages * 10);
                    setAdminRecordData(
                        res.data.records.map((data) => ({
                            createdOn: moment(data.createdOn).format(
                                "MMMM Do YYYY, h:mm:ss a"
                            ),
                            rateAmount: data?.rateCurrency + " " + data.rateAmount,
                            bio: data.address?.bio,
                            serviceModes: data.serviceModes,
                            yearsOfExperience: data.yearsOfExperience,
                            approvalStatus: data.approvalStatus,
                            proofDoc: data.proofDoc,

                           
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
                            <p>Artisan Categories Moderation</p>

                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            id="emp"
                            items={adminRecordsData}
                            fields={[
                                { key: "createdOn", name: "Date Created" },
                                { key: "yearsOfExperience", name: "Years of Exp" },
                                { key: "serviceModes", name: "Service Modes " },
                                { key: "latitude", name: "Latitude" },
                                { key: "rateAmount", name: "Rate Amount" },
                                { key: "bio", name: "Bio" },
                                { key: "approvalStatus", name: "Approval Status" },
                                { key: "proofDoc", name: "Proof Doc" },
                                { key: "action", name: "Action" },
                            ]}
                            scopedSlots={{
                                action: (item) => (
                                    <td>
                                        <Button
                                            type="success"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setCatId(item?.id)
                                                categoryEnable()
                                            }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            type="danger"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setCatId(item?.id)
                                                setReasonModal(true)
                                            }}
                                        >
                                            Reject
                                        </Button>
                                    </td>
                                ),
                                file: (item) => (
                                    <td>
                                        <Button
                                            type="danger"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setViewAddress(true)
                                                setAddressFile(item?.proofDocument)
                                            }}
                                        >
                                            View Proof Doc
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
                title={switchUpdate ? "Update Category" : "Create Category"}
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
                            <CLabel htmlFor="name">Icon URl</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setIcon(e.target.value)}
                                value={icon}
                            />
                        </CFormGroup>

                        <CFormGroup>
                            <CLabel htmlFor="name">Color</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setColor(e.target.value)}
                                value={color}
                            />
                        </CFormGroup>

                        <CFormGroup>
                            <CLabel htmlFor="name">Image URL</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setImage(e.target.value)}
                                value={image}
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
                            <CLabel htmlFor="name">Icon URl</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setIcon(e.target.value)}
                                value={icon}
                            />
                        </CFormGroup>

                        <CFormGroup>
                            <CLabel htmlFor="name">Color</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setColor(e.target.value)}
                                value={color}
                            />
                        </CFormGroup>

                        <CFormGroup>
                            <CLabel htmlFor="name">Image URL</CLabel>
                            <CInput
                                id="name"
                                type="text"
                                required
                                onChange={(e) => setImage(e.target.value)}
                                value={image}
                            />
                        </CFormGroup>
                    </div>
                )}

                <div className="d-flex justify-content-end align-items-center">
                    <button
                        type="button"
                        class="btn btn-primary mr-2"
                        onClick={switchUpdate ? updateCategory : createCategory}
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
                title="View  Address File"
                visible={viewAddress}
                footer={false}
                width={500}
                onCancel={() => setViewAddress(false)}
            >
                <div>
                    <img src={addressFile} />
                </div>
            </Modal>

            <Modal
                title="Reason For rejection"
                visible={reasonModal}
                footer={false}
                onCancel={() => setReasonModal(false)}
            >
                <CFormGroup row>
                    <CCol md="3">
                        <CLabel htmlFor="textarea-input">Reason</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                        <CTextarea
                            name="textarea-input"
                            id="textarea-input"
                            onChange={(e) => setReason(e.target.value)}
                            value={reason}
                            rows="9"
                            placeholder="Content..."
                        />
                    </CCol>
                </CFormGroup>

                <CButton onClick={categoryDisable} type="button" color="success">
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
        </CRow>
    );
};

export default Admins;
