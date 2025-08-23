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
import { Modal } from "antd";
const Users = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [limitData, setLimitData] = useState([]);
  const [currency, setCurrency] = useState("");
  const [createSettlement, setCreate] = useState(false);

  const [success, setSuccess] = useState(false);
  const [deleteSuccess, setDelSuccess] = useState(false);
  const [deleteErr, setDelErr] = useState(false);

  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [load, setLoad] = useState(false);
  const [limitType, setLimit] = useState("");
  const [scalingThreshold, setThreshold] = useState("");
  const [singleTransactionLimit, setSingleTransaction] = useState("");
  const [dailyCumulativeTransactionLimit, setDailyCumulative] = useState("");
  const [globalLimit, setGlobalLimit] = useState("");

  const [usdscalingThreshold, setUsdThreshold] = useState("");
  const [usdsingleTransactionLimit, setUsdSingleTransaction] = useState("");
  const [usddailyCumulativeTransactionLimit, setUsdDailyCumulative] =
    useState("");
  const [usdglobalLimit, setUsdGlobalLimit] = useState("");

  const [updateState, setUpdateState] = useState("");
  const [id, setID] = useState("");
  const [configDatas, setConfigsData] = useState({});
  const [fill, setFill] = useState(false);

  const [askScalingThreshold, setAskScalingThreshold] = useState("");
  const [askSingleTransactionLimit, setAskSingleTransactionLimit] =
    useState("");
  const [
    askDailyCumulativeTransactionLimit,
    setAskDailyCumulativeTransactionLimit,
  ] = useState("");
  const [askWeeklyCumulativeTransactionLimit, setAskWeeklyCumulative] =
    useState("");
  const [askMonthlyCumulativeTransactionLimit, setAskMonthlyCumulative] =
    useState("");

  const [bidScalingThreshold, setBidScalingThreshold] = useState("");
  const [bidSingleTransactionLimit, setBidSingleTransactionLimit] =
    useState("");
  const [
    bidDailyCumulativeTransactionLimit,
    setBidDailyCumulativeTransactionLimit,
  ] = useState("");
  const [
    bidWeeklyCumulativeTransactionLimit,
    setBidWeeklyCumulativeTransactionLimit,
  ] = useState("");
  const [
    bidMonthlyCumulativeTransactionLimit,
    setBidMonthlyCumulativeTransactionLimit,
  ] = useState("");

  const [depositScalingThreshold, setDepositScalingThreshold] = useState("");
  const [depositSingleTransactionLimit, setDepositSingleTransactionLimit] =
    useState("");
  const [
    depositDailyCumulativeTransactionLimit,
    setDepositDailyCumulativeTransactionLimit,
  ] = useState("");
  const [
    depositWeeklyCumulativeTransactionLimit,
    setDepositWeeklyCumulativeTransactionLimit,
  ] = useState("");
  const [
    depositMonthlyCumulativeTransactionLimit,
    setDepositMonthlyCumulativeTransactionLimit,
  ] = useState("");

  const [withdrawalScalingThreshold, setWithdrawalScalingThreshold] =
    useState("");
  const [
    withdrawalSingleTransactionLimit,
    setWithdrawalSingleTransactionLimit,
  ] = useState("");
  const [
    withdrawalDailyCumulativeTransactionLimit,
    setWithdrawalDailyCumulativeTransactionLimit,
  ] = useState("");
  const [
    withdrawalWeeklyCumulativeTransactionLimit,
    setWithdrawalWeeklyCumulativeTransactionLimit,
  ] = useState("");
  const [
    withdrawalMonthlyCumulativeTransactionLimit,
    setWithdrawalMonthlyCumulativeTransactionLimit,
  ] = useState("");

  const [defAsk, setDefAsk] = useState(true);
  const [defBid, setDefBid] = useState(false);
  const [defDeposit, setDefDeposit] = useState(false);
  const [defWithdrawal, setDefWithdrawal] = useState(false);
  const [
    askWeeklyCumulativeTransactionCount,
    setAskWeeklyCumulativeTransactionCount,
  ] = useState("");
  const [
    askDailyCumulativeTransactionCount,
    setAskDailyCumulativeTransactionCount,
  ] = useState("");
  const [
    askMonthlyCumulativeTransactionCount,
    setAskMonthlyCumulativeTransactionCount,
  ] = useState("");

  const [
    bidWeeklyCumulativeTransactionCount,
    setBidWeeklyCumulativeTransactionCount,
  ] = useState("");
  const [
    bidDailyCumulativeTransactionCount,
    setBidDailyCumulativeTransactionCount,
  ] = useState("");
  const [
    bidMonthlyCumulativeTransactionCount,
    setBidMonthlyCumulativeTransactionCount,
  ] = useState("");

  const [
    withdrawalWeeklyCumulativeTransactionCount,
    setWithdrawalWeeklyCumulativeTransactionCount,
  ] = useState("");
  const [
    withdrawalDailyCumulativeTransactionCount,
    setWithdrawalDailyCumulativeTransactionCount,
  ] = useState("");
  const [
    withdrawalMonthlyCumulativeTransactionCount,
    setWithdrawalMonthlyCumulativeTransactionCount,
  ] = useState("");

  const [
    depositWeeklyCumulativeTransactionCount,
    setDepositWeeklyCumulativeTransactionCount,
  ] = useState("");
  const [
    depositDailyCumulativeTransactionCount,
    setDepositDailyCumulativeTransactionCount,
  ] = useState("");
  const [
    depositMonthlyCumulativeTransactionCount,
    setDepositMonthlyCumulativeTransactionCount,
  ] = useState("");

  const chnageToBid = () => {
    setDefAsk(false);
    setDefBid(true);
    setDefDeposit(false);
    setDefWithdrawal(false);
  };

  const chnageToAsk = () => {
    setDefAsk(true);
    setDefBid(false);
    setDefDeposit(false);
    setDefWithdrawal(false);
  };

  const chnageToWithdrawal = () => {
    setDefAsk(false);
    setDefBid(false);
    setDefDeposit(false);
    setDefWithdrawal(true);
  };

  const chnageToDeposit = () => {
    setDefAsk(false);
    setDefBid(false);
    setDefDeposit(true);
    setDefWithdrawal(false);
  };

  const closeCreate = () => {
    setCreate(false);
    setSingleTransaction("");
    setDailyCumulative("");
    setLimit("");
    setGlobalLimit("");
    setThreshold("");

    setLimit(id.limitType);
    setAskDailyCumulativeTransactionLimit("");
    setAskDailyCumulativeTransactionCount("");
    setAskWeeklyCumulativeTransactionCount("");
    setAskMonthlyCumulativeTransactionCount("");
    setBidDailyCumulativeTransactionCount("");
    setBidWeeklyCumulativeTransactionCount("");
    setBidMonthlyCumulativeTransactionCount("");
    setDepositDailyCumulativeTransactionCount("");
    setDepositWeeklyCumulativeTransactionCount("");
    setDepositMonthlyCumulativeTransactionCount("");
    setWithdrawalDailyCumulativeTransactionCount("");
    setWithdrawalWeeklyCumulativeTransactionCount("");
    setWithdrawalMonthlyCumulativeTransactionCount("");
    setAskMonthlyCumulative("");
    setAskScalingThreshold("");
    setAskWeeklyCumulative("");
    setAskSingleTransactionLimit("");

    setBidScalingThreshold("");
    setBidSingleTransactionLimit("");
    setBidDailyCumulativeTransactionLimit("");
    setBidWeeklyCumulativeTransactionLimit("");
    setBidMonthlyCumulativeTransactionLimit("");

    setDepositMonthlyCumulativeTransactionLimit("");
    setDepositWeeklyCumulativeTransactionLimit("");
    setDepositDailyCumulativeTransactionLimit("");
    setDepositScalingThreshold("");
    setDepositSingleTransactionLimit("");

    setWithdrawalDailyCumulativeTransactionLimit("");
    setWithdrawalMonthlyCumulativeTransactionLimit("");
    setWithdrawalWeeklyCumulativeTransactionLimit("");
    setWithdrawalScalingThreshold("");
    setWithdrawalSingleTransactionLimit("");
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
            setLimitData(
              res.data.records.map((data) => ({
                reference: data.reference,
                firstName: data.traderXUser.firstName,
                id: data.id,
                lastName: data.traderXUser.lastName,
                emailAddress: data.traderXUser.emailAddress,
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

  const addLimit = () => {
    if (
      limitType &&
      scalingThreshold &&
      askSingleTransactionLimit &&
      askDailyCumulativeTransactionLimit &&
      askWeeklyCumulativeTransactionLimit &&
      askMonthlyCumulativeTransactionLimit &&
      bidSingleTransactionLimit &&
      bidDailyCumulativeTransactionLimit &&
      bidWeeklyCumulativeTransactionLimit &&
      bidMonthlyCumulativeTransactionLimit &&
      depositSingleTransactionLimit &&
      depositDailyCumulativeTransactionLimit &&
      depositWeeklyCumulativeTransactionLimit &&
      depositMonthlyCumulativeTransactionLimit &&
      withdrawalSingleTransactionLimit &&
      withdrawalDailyCumulativeTransactionLimit &&
      withdrawalWeeklyCumulativeTransactionLimit &&
      withdrawalMonthlyCumulativeTransactionLimit &&
      askMonthlyCumulativeTransactionCount &&
      askDailyCumulativeTransactionCount &&
      askWeeklyCumulativeTransactionCount &&
      bidDailyCumulativeTransactionCount &&
      bidWeeklyCumulativeTransactionCount &&
      bidMonthlyCumulativeTransactionCount &&
      withdrawalMonthlyCumulativeTransactionCount &&
      withdrawalWeeklyCumulativeTransactionCount &&
      withdrawalDailyCumulativeTransactionCount &&
      depositDailyCumulativeTransactionCount &&
      depositWeeklyCumulativeTransactionCount &&
      depositMonthlyCumulativeTransactionCount
    ) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/admin/limit-profile
      `,
          {
            limitType: limitType,
            scalingThreshold: Number(scalingThreshold),
            askWeeklyCumulativeTransactionCount: Number(
              askWeeklyCumulativeTransactionCount
            ),
            askDailyCumulativeTransactionCount: Number(
              askDailyCumulativeTransactionCount
            ),
            askMonthlyCumulativeTransactionCount: Number(
              askMonthlyCumulativeTransactionCount
            ),
            bidDailyCumulativeTransactionCount: Number(
              bidDailyCumulativeTransactionCount
            ),
            bidWeeklyCumulativeTransactionCount: Number(
              bidWeeklyCumulativeTransactionCount
            ),
            bidMonthlyCumulativeTransactionCount: Number(
              bidMonthlyCumulativeTransactionCount
            ),
            withdrawalDailyCumulativeTransactionCount: Number(
              withdrawalDailyCumulativeTransactionCount
            ),
            withdrawalWeeklyCumulativeTransactionCount: Number(
              withdrawalWeeklyCumulativeTransactionCount
            ),
            withdrawalMonthlyCumulativeTransactionCount: Number(
              withdrawalMonthlyCumulativeTransactionCount
            ),
            depositDailyCumulativeTransactionCount: Number(
              depositDailyCumulativeTransactionCount
            ),
            depositWeeklyCumulativeTransactionCount: Number(
              depositWeeklyCumulativeTransactionCount
            ),
            depositMonthlyCumulativeTransactionCount: Number(
              depositMonthlyCumulativeTransactionCount
            ),
            askSingleTransactionLimit: Number(askSingleTransactionLimit),
            askDailyCumulativeTransactionLimit: Number(
              askDailyCumulativeTransactionLimit
            ),
            askWeeklyCumulativeTransactionLimit: Number(
              askWeeklyCumulativeTransactionLimit
            ),
            askMonthlyCumulativeTransactionLimit: Number(
              askMonthlyCumulativeTransactionLimit
            ),
            bidSingleTransactionLimit: Number(bidSingleTransactionLimit),
            bidDailyCumulativeTransactionLimit: Number(
              bidDailyCumulativeTransactionLimit
            ),
            bidWeeklyCumulativeTransactionLimit: Number(
              bidWeeklyCumulativeTransactionLimit
            ),
            bidMonthlyCumulativeTransactionLimit: Number(
              bidMonthlyCumulativeTransactionLimit
            ),
            withdrawalSingleTransactionLimit: Number(
              withdrawalSingleTransactionLimit
            ),
            withdrawalDailyCumulativeTransactionLimit: Number(
              withdrawalDailyCumulativeTransactionLimit
            ),
            withdrawalWeeklyCumulativeTransactionLimit: Number(
              withdrawalWeeklyCumulativeTransactionLimit
            ),
            withdrawalMonthlyCumulativeTransactionLimit: Number(
              withdrawalMonthlyCumulativeTransactionLimit
            ),
            depositSingleTransactionLimit: Number(depositSingleTransactionLimit),
            depositDailyCumulativeTransactionLimit: Number(
              depositDailyCumulativeTransactionLimit
            ),
            depositWeeklyCumulativeTransactionLimit: Number(
              depositWeeklyCumulativeTransactionLimit
            ),
            depositMonthlyCumulativeTransactionLimit: Number(
              depositMonthlyCumulativeTransactionLimit
            ),
            currency: currency,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setLoad(false);
          if (res.status === 201) {
            setSuccess(true);
            setSingleTransaction("");
            getLimitProfileSettlemts();
            setDailyCumulative("");
            setLimit("");
            setGlobalLimit("");
            setThreshold("");
            setMsg("Limit Profile Created Successfully");
            setTimeout(() => {
              setMsg("");
              setCreate(false);
              setSuccess(false);
            }, 2500);
            getLimitProfile();
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
      // setError(true)
      // setMsg("All fie")
      setFill(true);
      setTimeout(() => {
        setFill(false);
      }, 2500);
    }
  };

  const getLimitProfile = () => {
    axios
      .get(`${config.baseUrl}/api/v1/configurations`)
      .then((res) => {
        if (res.status === 200) {
          setConfigsData(res.data);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const update = () => {
    setLoad(true);
    console.log(id);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/limit-profile/${id}`,
        {
          limitType: limitType,
          scalingThreshold: Number(scalingThreshold),
          askWeeklyCumulativeTransactionCount: Number(
            askWeeklyCumulativeTransactionCount
          ),
          askDailyCumulativeTransactionCount: Number(
            askDailyCumulativeTransactionCount
          ),
          askMonthlyCumulativeTransactionCount: Number(
            askMonthlyCumulativeTransactionCount
          ),
          bidDailyCumulativeTransactionCount: Number(
            bidDailyCumulativeTransactionCount
          ),
          bidWeeklyCumulativeTransactionCount: Number(
            bidWeeklyCumulativeTransactionCount
          ),
          bidMonthlyCumulativeTransactionCount: Number(
            bidMonthlyCumulativeTransactionCount
          ),
          withdrawalDailyCumulativeTransactionCount: Number(
            withdrawalDailyCumulativeTransactionCount
          ),
          withdrawalWeeklyCumulativeTransactionCount: Number(
            withdrawalWeeklyCumulativeTransactionCount
          ),
          withdrawalMonthlyCumulativeTransactionCount: Number(
            withdrawalMonthlyCumulativeTransactionCount
          ),
          depositDailyCumulativeTransactionCount: Number(
            depositDailyCumulativeTransactionCount
          ),
          depositWeeklyCumulativeTransactionCount: Number(
            depositWeeklyCumulativeTransactionCount
          ),
          depositMonthlyCumulativeTransactionCount: Number(
            depositMonthlyCumulativeTransactionCount
          ),
          askSingleTransactionLimit: Number(askSingleTransactionLimit),
          askDailyCumulativeTransactionLimit: Number(
            askDailyCumulativeTransactionLimit
          ),
          askWeeklyCumulativeTransactionLimit: Number(
            askWeeklyCumulativeTransactionLimit
          ),
          askMonthlyCumulativeTransactionLimit: Number(
            askMonthlyCumulativeTransactionLimit
          ),
          bidSingleTransactionLimit: Number(bidSingleTransactionLimit),
          bidDailyCumulativeTransactionLimit: Number(
            bidDailyCumulativeTransactionLimit
          ),
          bidWeeklyCumulativeTransactionLimit: Number(
            bidWeeklyCumulativeTransactionLimit
          ),
          bidMonthlyCumulativeTransactionLimit: Number(
            bidMonthlyCumulativeTransactionLimit
          ),
          withdrawalSingleTransactionLimit: Number(
            withdrawalSingleTransactionLimit
          ),
          withdrawalDailyCumulativeTransactionLimit: Number(
            withdrawalDailyCumulativeTransactionLimit
          ),
          withdrawalWeeklyCumulativeTransactionLimit: Number(
            withdrawalWeeklyCumulativeTransactionLimit
          ),
          withdrawalMonthlyCumulativeTransactionLimit: Number(
            withdrawalMonthlyCumulativeTransactionLimit
          ),
          depositSingleTransactionLimit: Number(depositSingleTransactionLimit),
          depositDailyCumulativeTransactionLimit: Number(
            depositDailyCumulativeTransactionLimit
          ),
          depositWeeklyCumulativeTransactionLimit: Number(
            depositWeeklyCumulativeTransactionLimit
          ),
          depositMonthlyCumulativeTransactionLimit: Number(
            depositMonthlyCumulativeTransactionLimit
          ),
          currency: currency,
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
          setSingleTransaction("");
          getLimitProfileSettlemts();
          setDailyCumulative("");
          setLimit("");
          setGlobalLimit("");
          setThreshold("");
          setMsg("Limit Profile Updated Successfully");
          setTimeout(() => {
            setMsg("");
            setSuccess(false);
            setCreate(false);
          }, 2500);
          getLimitProfile();
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
            setCreate(false);
            setError(false);
          }, 2500);
        } else {
          setMsg("Connection Error");
          setError(true);
          setSuccess(false);
        }
      });
  };

  useEffect(() => {
    getLimitProfileSettlemts();
    getLimitProfile();
    currentPage !== page && setPage(currentPage);
  }, [currentPage, page]);

  const getLimitProfileSettlemts = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/limit-profile/all
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
              limitType: data.limitType,
              scalingThreshold:data.scalingThreshold,
              askDailyCumulativeTransactionCount:
                data.askDailyCumulativeTransactionCount,
              askDailyCumulativeTransactionLimit:
                data.askDailyCumulativeTransactionLimit,
              askMonthlyCumulativeTransactionCount:
                data.askMonthlyCumulativeTransactionCount,
              askMonthlyCumulativeTransactionLimit:
                data.askMonthlyCumulativeTransactionLimit,
              askSingleTransactionLimit: data.askSingleTransactionLimit,
              askWeeklyCumulativeTransactionCount:
                data.askWeeklyCumulativeTransactionCount,
              askWeeklyCumulativeTransactionLimit:
                data.askWeeklyCumulativeTransactionLimit,

              bidDailyCumulativeTransactionCount:
                data.bidDailyCumulativeTransactionCount,
              bidDailyCumulativeTransactionLimit:
                data.bidDailyCumulativeTransactionLimit,
              bidMonthlyCumulativeTransactionCount:
                data.bidMonthlyCumulativeTransactionCount,
              bidMonthlyCumulativeTransactionLimit:
                data.bidMonthlyCumulativeTransactionLimit,
              bidSingleTransactionLimit: data.bidSingleTransactionLimit,
              bidWeeklyCumulativeTransactionCount:
                data.bidWeeklyCumulativeTransactionCount,
              bidWeeklyCumulativeTransactionLimit:
                data.bidWeeklyCumulativeTransactionLimit,

              depositDailyCumulativeTransactionCount:
                data.depositDailyCumulativeTransactionCount,
              depositDailyCumulativeTransactionLimit:
                data.depositDailyCumulativeTransactionLimit,
              depositMonthlyCumulativeTransactionCount:
                data.depositMonthlyCumulativeTransactionCount,
              depositMonthlyCumulativeTransactionLimit:
                data.depositMonthlyCumulativeTransactionLimit,
              depositSingleTransactionLimit: data.depositSingleTransactionLimit,
              depositWeeklyCumulativeTransactionCount:
                data.depositWeeklyCumulativeTransactionCount,
              depositWeeklyCumulativeTransactionLimit:
                data.depositWeeklyCumulativeTransactionLimit,

              withdrawalDailyCumulativeTransactionCount:
                data.withdrawalDailyCumulativeTransactionCount,
              withdrawalDailyCumulativeTransactionLimit:
                data.withdrawalDailyCumulativeTransactionLimit,
              withdrawalMonthlyCumulativeTransactionCount:
                data.withdrawalMonthlyCumulativeTransactionCount,
              withdrawalMonthlyCumulativeTransactionLimit:
                data.withdrawalMonthlyCumulativeTransactionLimit,
              withdrawalSingleTransactionLimit:
                data.withdrawalSingleTransactionLimit,
              withdrawalWeeklyCumulativeTransactionCount:
                data.withdrawalWeeklyCumulativeTransactionCount,
              withdrawalWeeklyCumulativeTransactionLimit:
                data.withdrawalWeeklyCumulativeTransactionLimit,
              currency: data.currency,

              id: data.id,
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
        `${config.baseUrl}/api/v1/admin/limit-profile/${id.id}
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
          setMsg("Limit Profile Deleted Successfully");
          getLimitProfileSettlemts();
          setTimeout(() => {
            setMsg("");
            setDelErr(false);
          }, 2500);
          getLimitProfile();
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
      title: `Are you sure you want to delete this limit profile?`,
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

  const updateFunc = (id) => {
    console.log(id);
    setID(id.id);
    setLimit(id.limitType);
    setCurrency(id.currency);
    setAskDailyCumulativeTransactionLimit(
      id.askDailyCumulativeTransactionLimit
    );
    setAskDailyCumulativeTransactionCount(
      id.askDailyCumulativeTransactionCount
    );
    setAskWeeklyCumulativeTransactionCount(
      id.askWeeklyCumulativeTransactionCount
    );
    setAskMonthlyCumulativeTransactionCount(
      id.askMonthlyCumulativeTransactionCount
    );
    setBidDailyCumulativeTransactionCount(
      id.bidDailyCumulativeTransactionCount
    );
    setBidWeeklyCumulativeTransactionCount(
      id.bidWeeklyCumulativeTransactionCount
    );
    setBidMonthlyCumulativeTransactionCount(
      id.bidMonthlyCumulativeTransactionCount
    );
    setDepositDailyCumulativeTransactionCount(
      id.depositDailyCumulativeTransactionCount
    );
    setDepositWeeklyCumulativeTransactionCount(
      id.depositWeeklyCumulativeTransactionCount
    );
    setDepositMonthlyCumulativeTransactionCount(
      id.depositMonthlyCumulativeTransactionCount
    );
    setWithdrawalDailyCumulativeTransactionCount(
      id.withdrawalDailyCumulativeTransactionCount
    );
    setWithdrawalWeeklyCumulativeTransactionCount(
      id.withdrawalWeeklyCumulativeTransactionCount
    );
    setWithdrawalMonthlyCumulativeTransactionCount(
      id.withdrawalMonthlyCumulativeTransactionCount
    );
    setAskMonthlyCumulative(id.askMonthlyCumulativeTransactionLimit);
    setThreshold(id.scalingThreshold);
    setAskWeeklyCumulative(id.askWeeklyCumulativeTransactionLimit);
    setAskSingleTransactionLimit(id.askSingleTransactionLimit);

    setBidScalingThreshold(id.bidScalingThreshold);
    setBidSingleTransactionLimit(id.bidSingleTransactionLimit);
    setBidDailyCumulativeTransactionLimit(
      id.bidDailyCumulativeTransactionLimit
    );
    setBidWeeklyCumulativeTransactionLimit(
      id.bidWeeklyCumulativeTransactionLimit
    );
    setBidMonthlyCumulativeTransactionLimit(
      id.bidMonthlyCumulativeTransactionLimit
    );

    setDepositMonthlyCumulativeTransactionLimit(
      id.depositMonthlyCumulativeTransactionLimit
    );
    setDepositWeeklyCumulativeTransactionLimit(
      id.depositWeeklyCumulativeTransactionLimit
    );
    setDepositDailyCumulativeTransactionLimit(
      id.depositDailyCumulativeTransactionLimit
    );
    setDepositScalingThreshold(id.depositScalingThreshold);
    setDepositSingleTransactionLimit(id.depositSingleTransactionLimit);

    setWithdrawalDailyCumulativeTransactionLimit(
      id.withdrawalDailyCumulativeTransactionLimit
    );
    setWithdrawalMonthlyCumulativeTransactionLimit(
      id.withdrawalMonthlyCumulativeTransactionLimit
    );
    setWithdrawalWeeklyCumulativeTransactionLimit(
      id.withdrawalWeeklyCumulativeTransactionLimit
    );
    setWithdrawalScalingThreshold(id.withdrawalScalingThreshold);
    setWithdrawalSingleTransactionLimit(id.withdrawalSingleTransactionLimit);
    setUpdateState(true);
    setCreate(true);
  };

  return (
    <>
      {configDatas.limitTypes && (
        <CRow>
          <CCol>
            {deleteSuccess && <CAlert color="success">{msg}</CAlert>}

            {deleteErr && <CAlert color="danger">{msg}</CAlert>}
            <CCard>
              <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <div>Limit Profile </div>
                  <button
                    type="button"
                    class="btn btn-primary mr-2"
                    onClick={createSettlementFunc}
                  >
                    Create Limit
                  </button>
                </div>
              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={limitData}
                  fields={[
                    { key: "limitType", name: "Limit Type" },
                    { key: "currency", name: "Currency" },
                    {
                      key: "scalingThreshold",
                      name: "Scaling Threshold",
                    },

                    {
                      key: "askDailyCumulativeTransactionCount",
                      name: "Ask Daily Cummulative Transaction Count",
                    },
                    {
                      key: "askDailyCumulativeTransactionLimit",
                      name: "Ask Daily Cummulative Transaction Limit",
                    },
                    {
                      key: "askWeeklyCumulativeTransactionCount",
                      name: "Ask Weekly Cummulative Transaction Count",
                    },
                    {
                      key: "askWeeklyCumulativeTransactionLimit",
                      name: "Ask Weekly Cummulative Transaction Limit",
                    },
                    {
                      key: "askMonthlyCumulativeTransactionCount",
                      name: "Ask Monthly Cummulative Transaction Count",
                    },

                    {
                      key: "askMonthlyCumulativeTransactionLimit",
                      name: "Ask Monthly Cummulative Transaction Limit",
                    },
                   
                    {
                      key: "askSingleTransactionLimit",
                      name: "Ask Single Transaction Limit",
                    },

                    {
                      key: "bidDailyCumulativeTransactionCount",
                      name: "Bid Daily Cummulative Transaction Count",
                    },
                    {
                      key: "bidDailyCumulativeTransactionLimit",
                      name: "Bid Daily Cummulative Transaction Limit",
                    },
                    {
                      key: "bidWeeklyCumulativeTransactionCount",
                      name: "Bid Weekly Cummulative Transaction Count",
                    },
                    {
                      key: "bidWeeklyCumulativeTransactionLimit",
                      name: "Bid Weekly Cummulative Transaction Limit",
                    },
                    {
                      key: "bidMonthlyCumulativeTransactionCount",
                      name: "Bid Monthly Cummulative Transaction Count",
                    },

                    {
                      key: "bidMonthlyCumulativeTransactionLimit",
                      name: "Bid Monthly Cummulative Transaction Limit",
                    },
                    
                    {
                      key: "bidSingleTransactionLimit",
                      name: "Bid Single Transaction Limit",
                    },

                    {
                      key: "depositDailyCumulativeTransactionCount",
                      name: "Deposit Daily Cummulative Transaction Count",
                    },
                    {
                      key: "depositDailyCumulativeTransactionLimit",
                      name: "Deposit Daily Cummulative Transaction Limit",
                    },
                    {
                      key: "depositWeeklyCumulativeTransactionCount",
                      name: "Deposit Weekly Cummulative Transaction Count",
                    },
                    {
                      key: "depositWeeklyCumulativeTransactionLimit",
                      name: "Deposit Weekly Cummulative Transaction Limit",
                    },
                    {
                      key: "depositMonthlyCumulativeTransactionCount",
                      name: "Deposit Monthly Cummulative Transaction Count",
                    },

                    {
                      key: "depositMonthlyCumulativeTransactionLimit",
                      name: "Deposit Monthly Cummulative Transaction Limit",
                    },
                   
                    {
                      key: "depositSingleTransactionLimit",
                      name: "Deposit Single Transaction Limit",
                    },

                    {
                      key: "withdrawalDailyCumulativeTransactionCount",
                      name: "Withdrawal Daily Cummulative Transaction Count",
                    },
                    {
                      key: "withdrawalDailyCumulativeTransactionLimit",
                      name: "Withdrawal Daily Cummulative Transaction Limit",
                    },
                    {
                      key: "withdrawalWeeklyCumulativeTransactionCount",
                      name: "Withdrawal Weekly Cummulative Transaction Count",
                    },
                    {
                      key: "withdrawalWeeklyCumulativeTransactionLimit",
                      name: "Withdrawal Weekly Cummulative Transaction Limit",
                    },
                    {
                      key: "withdrawalMonthlyCumulativeTransactionCount",
                      name: "Withdrawal Monthly Cummulative Transaction Count",
                    },

                    {
                      key: "withdrawalMonthlyCumulativeTransactionLimit",
                      name: "Withdrawal Monthly Cummulative Transaction Limit",
                    },
                    
                    {
                      key: "withdrawalSingleTransactionLimit",
                      name: "Withdrawal Single Transaction Limit",
                    },

                    {
                      key: "Actions",
                      name: "Actions",
                    },
                  ]}
                  hover
                  striped
                  activePage={page}
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
            title={
              updateState ? "Update Limit Profile" : "Create Limit Profile"
            }
            width={800}
            visible={createSettlement}
            footer={null}
            maskClosable={false}
            onCancel={closeCreate}
          >
            <div className="container">
              {fill && (
                <p className="text-danger text-center">
                  All fields are required{" "}
                </p>
              )}
              <form>
                {success && <CAlert color="success">{msg}</CAlert>}

                {error && <CAlert color="danger">{msg}</CAlert>}
                {!updateState ? (
                  <>
                    {defAsk && (
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">Limit Type</CLabel>
                              <CSelect
                                custom
                                name="ccmonth"
                                id="ccmonth"
                                onChange={(e) => setLimit(e.target.value)}
                                value={limitType}
                              >
                                <option selected>Select</option>
                                {configDatas.limitTypes.map((data) => {
                                  return <option value={data}>{data}</option>;
                                })}
                              </CSelect>{" "}
                            </CFormGroup>
                          </div>
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
                                <option value="NGN">NGN</option>
                                <option value="USD">USD</option>
                                <option value="GHS">GHS</option>

                              </CSelect>{" "}
                            </CFormGroup>
                          </div>
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                 Scaling Threshold
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setThreshold(e.target.value)
                                }
                                value={scalingThreshold}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Ask Single Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setAskSingleTransactionLimit(e.target.value)
                                }
                                value={askSingleTransactionLimit}
                              />
                            </CFormGroup>
                          </div>
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Ask Daily Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setAskDailyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={askDailyCumulativeTransactionLimit}
                              />
                            </CFormGroup>
                          </div>
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Ask Daily Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setAskDailyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={askDailyCumulativeTransactionCount}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Ask Weekly Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setAskWeeklyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={askWeeklyCumulativeTransactionCount}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Ask Monthly Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setAskMonthlyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={askMonthlyCumulativeTransactionCount}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Ask Weekly Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setAskWeeklyCumulative(e.target.value)
                                }
                                value={askWeeklyCumulativeTransactionLimit}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Ask Monthly Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setAskMonthlyCumulative(e.target.value)
                                }
                                value={askMonthlyCumulativeTransactionLimit}
                              />
                            </CFormGroup>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            class="btn btn-primary mr-2"
                            onClick={chnageToBid}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}

                    {defBid && (
                      <div>
                        <div className="row">
                         

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Bid Single Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setBidSingleTransactionLimit(e.target.value)
                                }
                                value={bidSingleTransactionLimit}
                              />
                            </CFormGroup>
                          </div>
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Bid Daily Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setBidDailyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={bidDailyCumulativeTransactionCount}
                              />
                            </CFormGroup>
                          </div>
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Bid Weekly Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setBidWeeklyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={bidWeeklyCumulativeTransactionCount}
                              />
                            </CFormGroup>
                          </div>
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Bid Monthly CummulativeTransaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setBidMonthlyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={bidMonthlyCumulativeTransactionCount}
                              />
                            </CFormGroup>
                          </div>
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Bid Daily Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setBidDailyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={bidDailyCumulativeTransactionLimit}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Bid Weekly Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setBidWeeklyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={bidWeeklyCumulativeTransactionLimit}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Bid Monthly Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setBidMonthlyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={bidMonthlyCumulativeTransactionLimit}
                              />
                            </CFormGroup>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            type="button"
                            class="btn btn-primary mr-2"
                            onClick={chnageToAsk}
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            class="btn btn-primary mr-2"
                            onClick={chnageToDeposit}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}

                    {defDeposit && (
                      <div>
                        <div className="row">
                         

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Deposit Single Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setDepositSingleTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={depositSingleTransactionLimit}
                              />
                            </CFormGroup>
                          </div>
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Deposit Daily Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setDepositDailyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={depositDailyCumulativeTransactionLimit}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Deposit Daily Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setDepositDailyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={depositDailyCumulativeTransactionCount}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6 ">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Deposit Weekly Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setDepositWeeklyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={depositWeeklyCumulativeTransactionCount}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Deposit Monthly Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setDepositMonthlyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={depositMonthlyCumulativeTransactionCount}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Deposit Weekly Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setDepositWeeklyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={depositWeeklyCumulativeTransactionLimit}
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Deposit Monthly Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setDepositMonthlyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={depositMonthlyCumulativeTransactionLimit}
                              />
                            </CFormGroup>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            type="button"
                            class="btn btn-primary mr-2"
                            onClick={chnageToBid}
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            class="btn btn-primary mr-2"
                            onClick={chnageToWithdrawal}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}

                    {defWithdrawal && (
                      <div>
                        <div className="row">
                         
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Withdrawal Single Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setWithdrawalSingleTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={withdrawalSingleTransactionLimit}
                              />
                            </CFormGroup>
                          </div>
                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Withdrawal Daily Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setWithdrawalDailyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={
                                  withdrawalDailyCumulativeTransactionLimit
                                }
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Withdrawal Daily Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setWithdrawalDailyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={
                                  withdrawalDailyCumulativeTransactionCount
                                }
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Withdrawal Weekly Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setWithdrawalWeeklyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={
                                  withdrawalWeeklyCumulativeTransactionCount
                                }
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Withdrawal Monthly Cummulative Transaction Count
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setWithdrawalMonthlyCumulativeTransactionCount(
                                    e.target.value
                                  )
                                }
                                value={
                                  withdrawalMonthlyCumulativeTransactionCount
                                }
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Withdrawal Weekly Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setWithdrawalWeeklyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={
                                  withdrawalWeeklyCumulativeTransactionLimit
                                }
                              />
                            </CFormGroup>
                          </div>

                          <div className="col-md-6">
                            <CFormGroup>
                              <CLabel htmlFor="name">
                                Withdrawal Monthly Cummulative Transaction Limit
                              </CLabel>
                              <CInput
                                id="name"
                                type="number"
                                required
                                onChange={(e) =>
                                  setWithdrawalMonthlyCumulativeTransactionLimit(
                                    e.target.value
                                  )
                                }
                                value={
                                  withdrawalMonthlyCumulativeTransactionLimit
                                }
                              />
                            </CFormGroup>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            type="button"
                            class="btn btn-primary mr-2"
                            onClick={chnageToDeposit}
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            class="btn btn-primary mr-2"
                            onClick={!updateState ? addLimit : update}
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
                      </div>
                    )}
                  </>
                ) : (
                  <>
                  {defAsk && (
                    <div>
                      <div className="row">
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">Limit Type</CLabel>
                            <CSelect
                              custom
                              name="ccmonth"
                              id="ccmonth"
                              onChange={(e) => setLimit(e.target.value)}
                              value={limitType}
                            >
                              <option selected>Select</option>
                              {configDatas.limitTypes.map((data) => {
                                return <option value={data}>{data}</option>;
                              })}
                            </CSelect>{" "}
                          </CFormGroup>
                        </div>
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
                              <option value="NGN">NGN</option>
                              <option value="USD">USD</option>
                              <option value="GHS">GHS</option>

                            </CSelect>{" "}
                          </CFormGroup>
                        </div>
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                               Scaling Threshold
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setThreshold(e.target.value)
                              }
                              value={scalingThreshold}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Ask Single Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setAskSingleTransactionLimit(e.target.value)
                              }
                              value={askSingleTransactionLimit}
                            />
                          </CFormGroup>
                        </div>
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Ask Daily Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setAskDailyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={askDailyCumulativeTransactionLimit}
                            />
                          </CFormGroup>
                        </div>
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Ask Daily Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setAskDailyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={askDailyCumulativeTransactionCount}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Ask Weekly Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setAskWeeklyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={askWeeklyCumulativeTransactionCount}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Ask Monthly Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setAskMonthlyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={askMonthlyCumulativeTransactionCount}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Ask Weekly Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setAskWeeklyCumulative(e.target.value)
                              }
                              value={askWeeklyCumulativeTransactionLimit}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Ask Monthly Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setAskMonthlyCumulative(e.target.value)
                              }
                              value={askMonthlyCumulativeTransactionLimit}
                            />
                          </CFormGroup>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          class="btn btn-primary mr-2"
                          onClick={chnageToBid}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {defBid && (
                    <div>
                      <div className="row">
                       

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Bid Single Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setBidSingleTransactionLimit(e.target.value)
                              }
                              value={bidSingleTransactionLimit}
                            />
                          </CFormGroup>
                        </div>
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Bid Daily Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setBidDailyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={bidDailyCumulativeTransactionCount}
                            />
                          </CFormGroup>
                        </div>
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Bid Weekly Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setBidWeeklyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={bidWeeklyCumulativeTransactionCount}
                            />
                          </CFormGroup>
                        </div>
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Bid Monthly CummulativeTransaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setBidMonthlyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={bidMonthlyCumulativeTransactionCount}
                            />
                          </CFormGroup>
                        </div>
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Bid Daily Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setBidDailyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={bidDailyCumulativeTransactionLimit}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Bid Weekly Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setBidWeeklyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={bidWeeklyCumulativeTransactionLimit}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Bid Monthly Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setBidMonthlyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={bidMonthlyCumulativeTransactionLimit}
                            />
                          </CFormGroup>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          class="btn btn-primary mr-2"
                          onClick={chnageToAsk}
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          class="btn btn-primary mr-2"
                          onClick={chnageToDeposit}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {defDeposit && (
                    <div>
                      <div className="row">
                       

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Deposit Single Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setDepositSingleTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={depositSingleTransactionLimit}
                            />
                          </CFormGroup>
                        </div>
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Deposit Daily Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setDepositDailyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={depositDailyCumulativeTransactionLimit}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Deposit Daily Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setDepositDailyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={depositDailyCumulativeTransactionCount}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6 ">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Deposit Weekly Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setDepositWeeklyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={depositWeeklyCumulativeTransactionCount}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Deposit Monthly Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setDepositMonthlyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={depositMonthlyCumulativeTransactionCount}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Deposit Weekly Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setDepositWeeklyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={depositWeeklyCumulativeTransactionLimit}
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Deposit Monthly Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setDepositMonthlyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={depositMonthlyCumulativeTransactionLimit}
                            />
                          </CFormGroup>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          class="btn btn-primary mr-2"
                          onClick={chnageToBid}
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          class="btn btn-primary mr-2"
                          onClick={chnageToWithdrawal}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {defWithdrawal && (
                    <div>
                      <div className="row">
                       
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Withdrawal Single Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setWithdrawalSingleTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={withdrawalSingleTransactionLimit}
                            />
                          </CFormGroup>
                        </div>
                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Withdrawal Daily Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setWithdrawalDailyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={
                                withdrawalDailyCumulativeTransactionLimit
                              }
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Withdrawal Daily Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setWithdrawalDailyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={
                                withdrawalDailyCumulativeTransactionCount
                              }
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Withdrawal Weekly Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setWithdrawalWeeklyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={
                                withdrawalWeeklyCumulativeTransactionCount
                              }
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Withdrawal Monthly Cummulative Transaction Count
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setWithdrawalMonthlyCumulativeTransactionCount(
                                  e.target.value
                                )
                              }
                              value={
                                withdrawalMonthlyCumulativeTransactionCount
                              }
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Withdrawal Weekly Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setWithdrawalWeeklyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={
                                withdrawalWeeklyCumulativeTransactionLimit
                              }
                            />
                          </CFormGroup>
                        </div>

                        <div className="col-md-6">
                          <CFormGroup>
                            <CLabel htmlFor="name">
                              Withdrawal Monthly Cummulative Transaction Limit
                            </CLabel>
                            <CInput
                              id="name"
                              type="number"
                              required
                              onChange={(e) =>
                                setWithdrawalMonthlyCumulativeTransactionLimit(
                                  e.target.value
                                )
                              }
                              value={
                                withdrawalMonthlyCumulativeTransactionLimit
                              }
                            />
                          </CFormGroup>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          class="btn btn-primary mr-2"
                          onClick={chnageToDeposit}
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          class="btn btn-primary mr-2"
                          onClick={!updateState ? addLimit : update}
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
                    </div>
                  )}
                </>
                )}
                <br />
              </form>
            </div>
          </Modal>
        </CRow>
      )}
    </>
  );
};

export default Users;
