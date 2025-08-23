import React, { lazy, useState, useEffect } from "react";
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import { DatePicker, Space, Button, Modal } from "antd";
import config from "../../config";
import MainChartExample from "../charts/MainChartExample.js";
import moment from "moment";
const { RangePicker } = DatePicker;

const WidgetsDropdown = lazy(() => import("../widgets/WidgetsDropdown.js"));

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [exchangeStats, setExchangeStats] = useState({});
  const [rangeModal, setRangeModal] = useState(false);
  const [withdrawStats, setWithdrawStats] = useState({});
  const [askStats, setAsKStats] = useState({});
  const [bidStats, setBidStats] = useState({});
  const [depositStats, setDepositStats] = useState({});
  const [fundStats, setFunds] = useState({})
  const [transactionType, setTransactionType] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [load, setLoad] = useState(false);
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const searchTransactions = () => {
    if (dateRange.length > 0 && transactionType) {
      switch (transactionType) {
        case "0":
          getExchange();
          break;
        case "1":
          getWithdrawal();
          break;
        case "2":
          getAsks();
          break;
        case "3":
          getBids();
          break;
          case "4":
            getDeposits();
            break;
        default:
          return null;
      }
    } else {
      setSearchError(true);
      setTimeout(() => {
        setSearchError(false);
      }, 2500);
    }
  };

  const closeRangePicker = () => {
    setTransactionType("");
    setRangeModal(false);
  };

  function onChange(date, dateString) {
    console.log(dateString);
    setDateRange(dateString);
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  useEffect(() => {
    getStats()
    getWallletFund()
   
  }, [])


  const getStats = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/statistics/users
        `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getWallletFund = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/statistics/funds-store
        `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setFunds(res.data);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getExchange = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/statistics/exchange-transaction?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setExchangeStats(res.data);
          setRangeModal(false)
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  };

  const getDeposits = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/statistics/fund-wallet-transaction?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setDepositStats(res.data);
          setRangeModal(false)
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  };

  const getAsks = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/statistics/ask-transaction?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setAsKStats(res.data);
          setRangeModal(false)

        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  };

  const getWithdrawal = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/statistics/withdrawal-transaction?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setWithdrawStats(res.data);
          setRangeModal(false)

        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  };

  const getBids = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/statistics/bid-transaction?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setLoad(false);
          setBidStats(res.data);
          setRangeModal(false)

        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  };

  



  const rangeModalFunc = () => {
    setRangeModal(true);
  };

  const currentTransactions = () => {
    getStats();
    getBids();
    getAsks();
    getExchange();
    getWithdrawal();

  };

  return (
    <>
      {/* <div className="d-flex justify-content-end align-items-center mb-2">
     
        <Button type="primary" onClick={rangeModalFunc}>
          Search Transactions Range
        </Button>
      </div> */}

      {/* <WidgetsDropdown
        stats={stats}
        exchangeStats={exchangeStats}
        withdrawStats={withdrawStats}
        askStats={askStats}
        bidStats={bidStats}
        depositStats={depositStats}
        fundStats={fundStats}
      />
 */}

      <Modal
        title="Pick Range "
        visible={rangeModal}
        footer={null}
        onCancel={closeRangePicker}
      >
        <div>
          {searchError && (
            <div className="alert alert-danger text-center">
              Transaction Type and Date Range is Required!
            </div>
          )}
      
        </div>
         <div className="form-group">
            <label for="" className="form-label">
              Transaction Type
            </label>
            <select
              name=""
              onChange={(e) => setTransactionType(e.target.value)}
              value={transactionType}
              className="form-control"
            >
              <option  selected>
                Select
              </option>
              <option value="0">Exhange Transactions</option>
              <option value="1">Withdrawal Transactions</option>
              <option value="2">Ask Transactions</option>
              <option value="3">Bids Transactions</option>
              <option value="4">Deposit Transactions</option>

            </select>
          </div>

        <br />
        <RangePicker style={{ width: "100%" }} onChange={onChange} />
        <div className="d-flex justify-content-end align-items-center mt-4">
          <Button type="primary" onClick={searchTransactions}>
            {load ? (
              <div
                class="spinner-border"
                role="status"
                style={{ width: "1rem", height: "1rem" }}
              >
                <span class="sr-only"> Loading... </span>{" "}
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Dashboard;
