import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification, Pagination, Select } from "antd";
import ReactJson from "react-json-view";
import moment from "moment";
import { DatePicker, Button } from "antd";
import {
  CForm,
  CFormText,
  CCardFooter,
  CAlert,
  CInputFile,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CFormGroup,
  CLabel,
  CRow,
  CInput,
  CTextarea,
  CButton,
} from "@coreui/react";
import config from "../../../config";
import axios from "axios";
var userRoles = sessionStorage.getItem("roleUser");
const { RangePicker } = DatePicker;

const PersonalInformation = (props) => {
  const [usersData, setUserData] = useState([]);
  const userEmail = props.userEmail ? props.userEmail : "";
  const [customerBalance, setCustomerBalance] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [load, setLoad] = useState(false);
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const getTransactions = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/statistics/user-transaction/${userEmail}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTransaction(res.data);
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactionsUser = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/statistics/user-transaction/${userEmail}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setTransaction(res.data);
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  };

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }

  const userInfo = {};

  return (
    <CRow>
      <CCol>
        <div className="d-flex justify-content-end align-items-center mb-2">
          <RangePicker onChange={onChange} />
          {"  "}

          <Button
            type="primary"
            style={{ marginLeft: "2rem" }}
            onClick={getTransactionsUser}
          >
            {load ? (
              <div
                class="spinner-border"
                role="status"
                style={{ width: "1rem", height: "1rem" }}
              >
                <span class="sr-only"> Loading... </span>{" "}
              </div>
            ) : (
              "Search Transactions Range"
            )}
          </Button>
        </div>
        <CCard>
          <CCardBody>
            <div className="container-fluid">
              <CForm
                action=""
                method="post"
                encType="multipart/form-data"
                className="form-horizontal"
              >
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel>Total USD Transactions</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      {transaction.dollarCount ? transaction.dollarCount : "0"}
                    </p>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Total USD Fee</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      $
                      {transaction.dollarFee
                        ? Intl.NumberFormat("en-US").format(
                            transaction.dollarFee
                          )
                        : "0"}
                    </p>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Total USD Transaction</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      $
                      {transaction.dollarVolume
                        ? Intl.NumberFormat("en-US").format(
                            transaction.dollarVolume
                          )
                        : "0"}
                    </p>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">
                      Total Naira Transactions
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      {transaction.nairaCount ? transaction.nairaCount : "0"}
                    </p>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="password-input">Total Naira Fee</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      ₦
                      {transaction.nairaFee
                        ? Intl.NumberFormat("en-US").format(
                            transaction.nairaFee
                          )
                        : "0"}
                    </p>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="date-input">
                      Total Naira Transaction
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      ₦
                      {transaction.nairaVolume
                        ? Intl.NumberFormat("en-US").format(
                            transaction.nairaVolume
                          )
                        : "0"}
                    </p>
                  </CCol>
                </CFormGroup>
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default PersonalInformation;
