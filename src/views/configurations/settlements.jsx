import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CLabel,
  CFormGroup,
  CDataTable,
  CAlert,
  CRow,
  CSelect,
  CButton,
  CPagination,
} from "@coreui/react";
import config from "../../config";
import { ExportCSV } from "../../containers/Exportcsv";
import axios from "axios";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
const Users = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [setlementsDatas, setSettlementsDatas] = useState([]);
  const [createSettlement, setCreate] = useState(false);
  const [chargeType, setChargeType] = useState("");
  const [settlementType, setSettlementType] = useState("");
  const [flatValue, setFlatValue] = useState("");
  const [configsData, setConfigsData] = useState([]);
  const [askrate, setAskrate] = useState("");

  const [currency, setCurrency] = useState("");
  const [rate, setRate] = useState("");
  const [cap, setCap] = useState("");
  const [lboundary, setLBoundary] = useState("");
  const [uboundary, setUBoundary] = useState("");
  const [base, setBase] = useState("");

  const [updateState, setUpdateState] = useState("");
  const [id, setID] = useState("");

  const [msg, setMsg] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [fill, setFill] = useState(false);
  const [load, setLoad] = useState(false);

  const [deleteErr, setDelErr] = useState(false);
  const [delSuccess, setDelSuccess] = useState(false);

  const closeCreate = () => {
    setCreate(false);
    setCurrency("");
    setLBoundary("");
    setUBoundary("");
    setCap("");
    setRate("");
    setBase("");
    setSettlementType("");
    setFlatValue("");
    setChargeType("");
  };

  const pageChange = (newPage) => {
    currentPage !== newPage &&
      axios
        .get(
          `${config.baseUrl}/api/v1/admin/transactions/transfer?pageNumber=${newPage}&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setSettlementsDatas(
              res.data.records.map((data) => ({
                reference: data.reference,
                firstName: data.traderXUser.firstName,
                lastName: data.traderXUser.lastName,
                emailAddress: data.traderXUser.emailAddress,
                startDate: moment(data.createdOn).format(
                  "MMMM Do YYYY, h:mm:ss a"
                ),

                amount: Intl.NumberFormat("en-US").format(data.amount),
                provider: data.provider.replace("_", " "),
                transactionStatus: data.transactionStatus,

                country: data.traderXUser.country.replace("_", " "),
              }))
            );
          }
        })
        .catch((err) => {
          if (err) {
          }
        });
  };

  const getConfigData = () => {
    axios
      .get(`${config.baseUrl}/api/v1/configurations`)
      .then((res) => {
        setConfigsData(res.data);
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const addSettlement = () => {
    if (currency && lboundary && uboundary && rate && cap) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/admin/settlement-configuration/fund-wallet-config
        `,
          {
            currency,
            lowerBoundary: lboundary,
            upperBoundary: uboundary,
            rate,
            cap,
            base,
            settlementType: settlementType,
            chargeType: chargeType,
            flatValue: flatValue,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 201) {
            getCOnfigsSettlemts();
            setLoad(false);
            setMsg("Settlement Created Successfully");
            setSuccess(true);
            setError(false);
            getCOnfigsSettlemts();

            setTimeout(() => {
              setSuccess(false);
              setCreate(false);
              closeCreate();
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
              setError(false);
            }, 2500);
          } else {
            setMsg("Connection Error");
            setError(true);
            setSuccess(false);
            setTimeout(() => {
              setError(false);
            }, 2500);
          }
        });
    } else {
      setFill(true);
      setTimeout(() => {
        setFill(false);
      }, 2500);
    }
  };

  const update = () => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/settlement-configuration/fund-wallet-config/${id}`,
        {
          currency,
          lowerBoundary: Number(lboundary),
          upperBoundary: Number(uboundary),
          rate: Number(rate),
          cap: Number(cap),
          base: Number(base),
          settlementType: settlementType,
          chargeType: chargeType,
          flatValue: Number(flatValue),
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
          getCOnfigsSettlemts();
          setMsg("Settlement Updated Successfully");
          setSuccess(true);
          setError(false);
          getCOnfigsSettlemts();
          setTimeout(() => {
            setSuccess(false);
            closeCreate();
            setCreate(false);
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
            setError(false);
          }, 2500);
        } else {
          setMsg("Connection Error");
          setError(true);
          setSuccess(false);
          setTimeout(() => {
            setError(false);
          }, 2500);
        }
      });
  };

  useEffect(() => {
    getCOnfigsSettlemts();
    getConfigData();
    getAskRate();
  }, []);

  const getCOnfigsSettlemts = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/settlement-configuration/fund-wallet-configs
      `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setSettlementsDatas(
            res.data.map((data) => ({
              id: data.id,
              lowerBoundry:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.lowerBoundary)
                  : "$" + Intl.NumberFormat("en-US").format(data.lowerBoundary),
              upperBoundry:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.upperBoundary)
                  : "$" + Intl.NumberFormat("en-US").format(data.upperBoundary),
              rate: data.rate,
              chargeType: data.chargeType,
              settlementType: data.settlementType,
              flatValue: data.flatValue,

              cap: data.cap,
              base: data.base,
              lower:
                data.currency === "NGN"
                  ? data.lowerBoundary
                  : data.lowerBoundary,
              currency: data.currency,
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              upper:
                data.currency === "NGN"
                  ? data.upperBoundary
                  : data.upperBoundary,
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
      title: `Are you sure you want to delete this settlement?`,
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

  const deleteFunc = (id) => {
    axios
      .delete(
        `${config.baseUrl}/api/v1/admin/settlement-configuration/fund-wallet-config/${id.id}
      `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          getCOnfigsSettlemts();
          setMsg("Settlement Deleted Successfully");
          setDelErr(true);
          setDelSuccess(false);
        }
      })
      .catch((err) => {
        if (err.response !== undefined) {
          setMsg(err.response.data.message);
          setDelErr(true);
          setTimeout(() => {
            setDelErr(false);
          }, 2500);
        } else {
          setMsg("Connection Error");
          setDelErr(true);
          setTimeout(() => {
            setDelErr(false);
          }, 2500);
          setDelSuccess(false);
        }
      });
  };

  const createSettlementFunc = () => {
    setUpdateState(false);
    setCreate(true);
  };

  const updateFunc = (id) => {
    console.log(id);
    setID(id.id);
    setCurrency(id.currency);
    setLBoundary(id.lower);
    setUBoundary(id.upper);
    setCap(id.cap);
    setRate(id.rate);
    setBase(id.base);
    setUpdateState(true);
    setCreate(true);
  };

  console.log(base);

  const getAskRate = () => {
    axios
      .get(`${config.baseUrl}/api/v1/admin/ask-rate`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoad(false);
        if (res.data) {
          setLoad(false);
          setAskrate(res.data[0].upperRate);
        }
      })
      .catch((err) => {
        setLoad(false);

        if (err) {
        }
      });
  };

  return (
    <CRow>
      <CCol>
        {deleteErr && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <div className="text-center pt-3 pb-3">
            <h4>
              Current Ask Rate:{" "}
              <span class="badge bg-success text-white">{askrate}</span>
            </h4>
          </div>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>Exchange settlement</div>
              <ExportCSV
                csvData={setlementsDatas}
                fileName={"Settlements Data"}
              />
              {/* <button
                type="button"
                class="btn btn-warning mr-2"
                onClick={createSettlementFunc}
              >
                Pool Business Route Amount
              </button>
              <button
                type="button"
                class="btn btn-info mr-2"
                onClick={createSettlementFunc}
              >
                Pool Personal Addon
              </button>
              <button
                type="button"
                class="btn btn-danger mr-2"
                onClick={createSettlementFunc}
              >
                Pool Business Add on
              </button> */}
              <button
                type="button"
                class="btn btn-primary mr-2"
                onClick={createSettlementFunc}
              >
                Create Settlement
              </button>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={setlementsDatas}
              fields={[
                { key: "startDate", name: "Date" },
                { key: "currency", name: "Currency" },
                { key: "lowerBoundry", name: "Lower Boundry" },
                { key: "upperBoundry", name: "Upper Boundry" },
                { key: "rate", name: "Rate " },
                { key: "cap", name: "Cap" },
                { key: "base", name: "Base" },
                { key: "settlementType", name: "Settlement Type" },
                { key: "chargeType", name: "Charge Type" },
                { key: "flatValue", name: "Flat Value" },

                { key: "lower", name: "Exact Lower" },
                { key: "upper", name: "Exact Upper" },

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
                      onClick={updateFunc.bind(this, item)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={changeStatusConfirm.bind(this, item)}
                    >
                      Delete
                    </button>
                  </td>
                ),
              }}
              clickableRows
            />
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={!updateState ? "Create Settlement" : "Update  Settlement"}
        visible={createSettlement}
        footer={null}
        maskClosable={false}
        onCancel={closeCreate}
        width={900}
      >
        <div className="container">
          {success && <CAlert color="success">{msg}</CAlert>}
          {error && <CAlert color="danger">{msg}</CAlert>}
          {fill && (
            <p className="text-danger text-center">Fields are all required</p>
          )}

          <form>
            {!updateState ? (
              <>
                <div className="row">
                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Currency</CLabel>
                      <CSelect
                        custom
                        name="ccmonth"
                        id="ccmonth"
                        onChange={(e) => setCurrency(e.target.value)}
                        value={currency}
                      >
                        <option selected>Select</option>
                        {configsData?.supportedCurrency?.map((currency) => {
                          return <option>{currency}</option>;
                        })}
                      </CSelect>{" "}
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Lower Boundary</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setLBoundary(e.target.value)}
                        value={lboundary}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Upper Boundary</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setUBoundary(e.target.value)}
                        value={uboundary}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Rate</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setRate(e.target.value)}
                        value={rate}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Cap</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setCap(e.target.value)}
                        value={cap}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Base</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setBase(e.target.value)}
                        value={base}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Settlement Type</CLabel>
                      <CSelect
                        custom
                        name="ccmonth"
                        id="ccmonth"
                        onChange={(e) => setSettlementType(e.target.value)}
                        value={settlementType}
                      >
                        <option selected>Select</option>
                        {configsData?.settlementTypes?.map((settlement) => {
                          return (
                            <option value={settlement}>
                              {settlement?.replace("_", " ")}
                            </option>
                          );
                        })}
                      </CSelect>
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Charge Type</CLabel>
                      <CSelect
                        custom
                        name="ccmonth"
                        id="ccmonth"
                        onChange={(e) => setChargeType(e.target.value)}
                        value={chargeType}
                      >
                        <option selected>Select</option>
                        {configsData?.chargeTypes?.map((charge) => {
                          return (
                            <option value={charge}>
                              {charge?.replace("_", " ")}
                            </option>
                          );
                        })}
                      </CSelect>{" "}
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Flat Value</CLabel>
                      <CInput
                        id="name"
                        type="number"
                        required
                        onChange={(e) => setFlatValue(e.target.value)}
                        value={flatValue}
                      />
                    </CFormGroup>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Currency</CLabel>
                      <CSelect
                        custom
                        name="ccmonth"
                        id="ccmonth"
                        onChange={(e) => setCurrency(e.target.value)}
                        value={currency}
                      >
                        <option selected>Select</option>
                        {configsData?.supportedCurrency?.map((currency) => {
                          return <option>{currency}</option>;
                        })}
                      </CSelect>{" "}
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Lower Boundary</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setLBoundary(e.target.value)}
                        value={lboundary}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Upper Boundary</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setUBoundary(e.target.value)}
                        value={uboundary}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Rate</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setRate(e.target.value)}
                        value={rate}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Cap</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setCap(e.target.value)}
                        value={cap}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Base</CLabel>
                      <CInput
                        id="name"
                        type="text"
                        required
                        onChange={(e) => setBase(e.target.value)}
                        value={base}
                      />
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Settlement Type</CLabel>
                      <CSelect
                        custom
                        name="ccmonth"
                        id="ccmonth"
                        onChange={(e) => setSettlementType(e.target.value)}
                        value={settlementType}
                      >
                        <option selected>Select</option>
                        {configsData?.settlementTypes?.map((settlement) => {
                          return (
                            <option value={settlement}>
                              {settlement?.replace("_", " ")}
                            </option>
                          );
                        })}
                      </CSelect>
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Charge Type</CLabel>
                      <CSelect
                        custom
                        name="ccmonth"
                        id="ccmonth"
                        onChange={(e) => setChargeType(e.target.value)}
                        value={chargeType}
                      >
                        <option selected>Select</option>
                        {configsData?.chargeTypes?.map((charge) => {
                          return (
                            <option value={charge}>
                              {charge?.replace("_", " ")}
                            </option>
                          );
                        })}
                      </CSelect>{" "}
                    </CFormGroup>
                  </div>

                  <div className="col-md-6">
                    <CFormGroup>
                      <CLabel htmlFor="name">Flat Value</CLabel>
                      <CInput
                        id="name"
                        type="number"
                        required
                        onChange={(e) => setFlatValue(e.target.value)}
                        value={flatValue}
                      />
                    </CFormGroup>
                  </div>
                </div>
              </>
            )}
            <br />
            <div className="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-primary mr-2"
                onClick={!updateState ? addSettlement : update}
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
  );
};

export default Users;
