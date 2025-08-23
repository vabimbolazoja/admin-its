import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification, Pagination, Select, Spin } from "antd";
import ReactJson from "react-json-view";
import moment from "moment";
import { useParams } from "react-router";
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
import config from "../../config";
import axios from "axios";
var userRoles = sessionStorage.getItem("roleUser");

const Balance = (props) => {
  const [usersData, setUserData] = useState([]);
  const [customerBalance, setCustomerBalance] = useState([]);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [load, setLoad] = useState(false);
  const params = useParams();
  console.log(params);
  const checkCustomerBalance = () => {
    setLoad(true);
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/proxy-transfer/${params?.id}/balance`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.data) {
          setCustomerBalance(res.data);
        }
      })
      .catch((err) => {
        setLoad(false);

        if (err) {
          setError(true);
          setMsg(err.response.data.message);
        }
      });
  };
  useEffect(() => {
    checkCustomerBalance();
  }, []);

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            {load && (
              <div className="text-center pt-5">
                <Spin />
              </div>
            )}

            <>
              {!load && (
                <div
                  class="card text-white bg-success mb-5"
                  style={{ width: "100%" }}
                >
                  <div class="card-header">Kuda Bank Account</div>
                  <div class="card-body">
                    <br />
                    <div className="d-flex justify-content-between align-items-center">
                      <p>Available Balance</p>

                      {customerBalance ? (
                        <p>
                          ₦
                          {Intl.NumberFormat("en-US").format(
                            customerBalance?.availableBalance / 100
                          )}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <br />
                    <div className="d-flex justify-content-between align-items-center">
                      <p>Ledger Balance</p>
                      {customerBalance ? (
                        <p>
                          ₦
                          {Intl.NumberFormat("en-US").format(
                            customerBalance?.ledgerBalance / 100
                          )}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <br />
                    <div className="d-flex justify-content-between align-items-center">
                      <p>Withdrawable Balance</p>
                      {customerBalance ? (
                        <p>
                          ₦
                          {Intl.NumberFormat("en-US").format(
                            customerBalance?.withdrawableBalance / 100
                          )}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Balance;
