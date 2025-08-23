import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification, Pagination, Select, Spin } from "antd";
import ReactJson from "react-json-view";
import moment from "moment";

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

const Wallet = (props) => {
    const [usersData, setUserData] = useState ([])
    const userEmail = props.userEmail ?  props.userEmail : "";
    const [customerBalance, setCustomerBalance] = useState ([])
    const [error, setError] = useState (false)
    const [msg, setMsg] = useState ("")
    const [load, setLoad] = useState(false)

    console.log(userEmail)


    const checkCustomerBalance = () => {
      setLoad(true)
        axios
          .get(
            `${config.baseUrl}/api/v1/admin/proxy-transfer/balance/user/${userEmail}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            setLoad(false)
            if (res.data) {
              setCustomerBalance(res.data);
            }
          })
          .catch((err) => {
            setLoad(false)

            if (err) {
              setError(true);
              setMsg(err.response.data.message);
            }
          });
      };
      useEffect(() => {
        checkCustomerBalance()
      }, []);


  
   
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            {load && <div className="text-center pt-5"><Spin /></div> }
            {customerBalance.length > 0 ?
         
              <>
                <div
                  class="card text-white bg-success mb-5"
                  style={{ width: "100%" }}
                >
                  <div class="card-header">Primary Wallet</div>
                  <div class="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <p>Wallet Ref</p>
                      <p>
                        {customerBalance ? customerBalance[0]?.walletRef : ""}
                      </p>
                    </div>
                    <br />
                    <div className="d-flex justify-content-between align-items-center">
                      <p>Available Balance</p>

                      {customerBalance ? (
                        <p>
                          {customerBalance[0]?.currency === "USD" ? "$" : "₦"}
                          {Intl.NumberFormat("en-US").format(
                            customerBalance[0]?.balance
                          )}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <br />
                    <div className="d-flex justify-content-between align-items-center">
                      <p>Spending Power</p>
                      {customerBalance ? (
                        <p>
                          {customerBalance[0]?.currency === "USD" ? "$" : "₦"}
                          {Intl.NumberFormat("en-US").format(
                            customerBalance[0]?.spendingPower
                          )}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div
                  class="card text-white bg-warning mb-3"
                  style={{ width: "100%" }}
                >
                  <div class="card-header">Secondary Wallet</div>
                  <div class="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <p>Wallet Ref</p>
                      <p>
                        {customerBalance ? customerBalance[1].walletRef : ""}
                      </p>
                    </div>
                    <br />
                    <div className="d-flex justify-content-between align-items-center">
                      <p>Available Balance</p>

                      {customerBalance ? (
                        <p>
                          {customerBalance[1].currency === "USD" ? "$" : "₦"}
                          {Intl.NumberFormat("en-US").format(
                            customerBalance[1].balance
                          )}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <br />
                    <div className="d-flex justify-content-between align-items-center">
                      <p>Spending Power</p>
                      {customerBalance ? (
                        <p>
                          {customerBalance[1].currency === "USD" ? "$" : "₦"}
                          {Intl.NumberFormat("en-US").format(
                            customerBalance[1].spendingPower
                          )}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <br />
                {customerBalance.length > 2 && (
                  <div
                    class="card text-white bg-info pt-3 mb-3"
                    style={{ width: "100%" }}
                  >
                    <div class="card-header">Tetriary Wallet</div>
                    <div class="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <p>Wallet Ref</p>
                        <p>
                          {customerBalance ? customerBalance[2].walletRef : ""}
                        </p>
                      </div>
                      <br />
                      <div className="d-flex justify-content-between align-items-center">
                        <p>Available Balance</p>

                        {customerBalance ? (
                          <p>
                            {customerBalance[2].currency === "USD" ? "$" : "₦"}
                            {Intl.NumberFormat("en-US").format(
                              customerBalance[2].balance
                            )}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <br />
                      <div className="d-flex justify-content-between align-items-center">
                        <p>Spending Power</p>
                        {customerBalance ? (
                          <p>
                            {customerBalance[2].currency === "USD" ? "$" : "₦"}
                            {Intl.NumberFormat("en-US").format(
                              customerBalance[2].spendingPower
                            )}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>:
              <div className="text-center pt-5 mt-5" style={{ height: "30vh" }}>
                {msg}
                </div>}
          

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Wallet;
