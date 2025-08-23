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
  CTextarea,
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
import { Pagination, Modal, Button } from "antd";
import moment from "moment";
const PoolConfig = (props) => {
  const [poolConfig, setPoolConfig] = useState({});
  const [cutoffAmount, setCutoffAmount] = useState("");
  const [minimumAmount, setMinimumAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(false);
  const [load, setLoad] = useState(false);
  const [loadCreate, setLoadCreate] = useState(false);
  const [initiatePoolConfig, setInitiatePoolConfig] = useState(false);

  const getPoolconfig = () => {
    setLoad(true);
    axios
      .get(`${config.baseUrl}/api/v1/admin/pool/config/settings`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoad(false);

        if (res.data) {
          setPoolConfig(res.data);
        }
      })
      .catch((err) => {
        setLoad(false);

        if (err) {
        }
      });
  };

  const configPoolSettings = () => {
    setLoadCreate(true);
    axios
      .post(
        `${config.baseUrl}/api/v1/admin/pool/config`,
        {
          cutoffAmount: cutoffAmount,
          minimumAmount: minimumAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoadCreate(false);

        if (res.status === 200) {
          setSuccess(true);
          setMsg("Pool Configured Successfully");
          setTimeout(() => {
            setMsg("");
            setInitiatePoolConfig(false);
            setSuccess(false);
          }, 2500);
          getPoolconfig();
        }
      })
      .catch((err) => {
        setLoadCreate(false);

        setError(true);
        setMsg("Error");
        if (err) {
        }
      });
  };

  useEffect(() => {
    getPoolconfig();
  }, []);

  const closeInitiatePoolConfig = () => {
    setInitiatePoolConfig(false);
  };

  return (
    <CRow>
      <CCol className="col-md-6 offset-3">
        <CCard>
          <CCardHeader></CCardHeader>

          <CCardBody>
            <div>
              <br />
              <div className="">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <p>Ask Pool Configuration </p>
                  <Button
                    type="primary"
                    onClick={() => {
                      setInitiatePoolConfig(true);
                    }}
                  >
                    Create Pool Config
                  </Button>
                </div>
                <div className="pt-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>Created On</div>
                    <div>
                      {moment(poolConfig.createdOn).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </div>
                  </div>
                  <br />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>Cut Off Amount</div>

                    {load ? (
                      <div
                        class="spinner-border"
                        role="status"
                        style={{ width: "1rem", height: "1rem" }}
                      >
                        <span class="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <div>{poolConfig?.cutOffAmount}</div>
                    )}
                  </div>
                  <br />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>Minimum Amount</div>
                    {load ? (
                      <div
                        class="spinner-border"
                        role="status"
                        style={{ width: "1rem", height: "1rem" }}
                      >
                        <span class="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <div>{poolConfig?.minimumAmount}</div>
                    )}
                  </div>
                </div>
              </div>

              <br />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={"Create Pool Config"}
        visible={initiatePoolConfig}
        footer={null}
        maskClosable={false}
        onCancel={closeInitiatePoolConfig}
      >
        <>
          <div>
            {success && <CAlert color="success">{msg}</CAlert>}

            {error && <CAlert color="danger">{msg}</CAlert>}
          </div>

          <CFormGroup>
            <CLabel htmlFor="name"> Cut off Amount</CLabel>

            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setCutoffAmount(e.target.value)}
              value={cutoffAmount}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="name">Minimum Amount</CLabel>
            <CInput
              id="name"
              type="number"
              required
              onChange={(e) => setMinimumAmount(e.target.value)}
              value={minimumAmount}
            />
          </CFormGroup>

          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              class="btn btn-success mr-2"
              onClick={configPoolSettings}
            >
              {loadCreate ? (
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
        </>
      </Modal>
    </CRow>
  );
};

export default PoolConfig;
