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
  CPagination,
} from "@coreui/react";
import config from "../../../config";
import axios from "axios";
import { Pagination } from "antd";
import { Tabs } from "antd";
import AskTransactions from "./askTransactions";
import BidTransactions from "./bidTransactions";
import DepositTransactions from "./fundTransactions";
import WithdrawalTransactions from "./withdrawTransactions";
import PersonalInformation from "./PersonalInformation";
import TimeoutModal from "./test";
import Reconciliation from "./Reconciliation";
import Wallet from "./walletBalance";
import AllTransactions from "./allTransactions";
import FeatureAccess from "./FeatureAccessControls";
import ProxyTransfer from "./ProxyTransfer";
import UserActions from "./userActions";

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

const role = sessionStorage.getItem("roleUser");
console.log(role);

const Users = (props) => {
  const userEmail = props.history.location.state.code
    ? props.history.location.state.code
    : "";
  const page = props.history.location.state.page
    ? props.history.location.state.page
    : "";
  const code = props.history.location.state.code
    ? props.history.location.state.code
    : "";
  const status = props.history.location.state.status
    ? props.history.location.state.status
    : "";

  const reachedOut = props.history.location.state.hasBeenReachedOutTo
    ? props.history.location.state.hasBeenReachedOutTo
    : "";

  const featureAccessControls = props.history.location.state
    .featureAccessControls
    ? props.history.location.state.featureAccessControls
    : "";
  const history = useHistory();
  const [depositDatas, setDepositDatas] = useState([]);
  const [totalItems, setTotalItems] = useState("");

  console.log(featureAccessControls);

  const getBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "secondary";
      case "Pending":
        return "warning";
      case "FAILED":
        return "danger";
      default:
        return "primary";
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/withdrawal?pageNumber=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setDepositDatas(
            res.data.records.map((data) => ({
              reference: data.reference,
              date: data.createdOn ? data.createdOn.slice(0, 10) : null,
              accName: data.accountName,
              accNum: data.accountNumber,
              bank: data.bankName,

              emailAddress: data.traderXUser.emailAddress,
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
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
  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/withdrawal?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setDepositDatas(
            res.data.records.map((data) => ({
              reference: data.reference,
              date: data.createdOn ? data.createdOn.slice(0, 10) : null,
              accName: data.accountName,
              accNum: data.accountNumber,
              bank: data.bankName,

              emailAddress: data.traderXUser.emailAddress,
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
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

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>View User</CCardHeader>
          <CCardBody>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="Personal information" key="1">
                <PersonalInformation
                  userEmail={userEmail}
                  page={page}
                  code={code}
                  status={status}
                  reachedOut={reachedOut}
                />
              </TabPane>
              <TabPane tab="Bookings Requests" key="2">
              </TabPane>
              <TabPane tab="Subscription Payments" key="3">
              </TabPane>
              
            </Tabs>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Users;
