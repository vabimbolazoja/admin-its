import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CAlert,
  CDataTable,
  CRow,
  CPagination,
} from "@coreui/react";
import config from "../../../config";
import { Pagination, Modal, Select } from "antd";
import axios from "axios";
import moment from "moment";
const { Option } = Select;

const getBadge = (status) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "ACCEPETED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "danger";
    case "REJECTED":
      return "secondary";
    case "CANCELLED	":
      return "danger";

    default:
      return "primary";
  }
};

const FeatureAccess = (props) => {
  const [controlData, setAccessControlData] = useState([]);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const userEmail = props.userEmail ? props.userEmail : "";
  const code = props.code ? props.code : "";
  const [load, setLoad] = useState(false);
  const featureAccessControls = props.featureAccessControls
    ? props.featureAccessControls
    : [];
  const [controlDataAccess, setControlData] = useState([]);
  const [modalControl, setModalControl] = useState(true);
  const [featureOptions, setFeatureOptions] = useState([]);

  useEffect(() => {
    getAccess();
  }, []);

  const featureLISTS = [];
  featureAccessControls.map((feature) => {
    featureLISTS.push(feature);
  });

  const featureSelect = [];
  controlData.map((feature) => {
    featureSelect.push(<Option key={feature.control}>{feature.name}</Option>);
  });

  const handleChangeFeature = (value) => {
    setFeatureOptions(value);
  };

  const openControls = (id) => {
    setControlData(id);
    setModalControl(true);
  };

  const closeModalControl = () => {
    setModalControl(false);
  };
  const getAccess = () => {
    axios
      .get(`${config.baseUrl}/api/v1/admin/traderx-users/access-controls`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setAccessControlData(
            res.data.map((data) => ({
              date: moment(data.createdOn).format("MMMM Do YYYY, h:mm:ss a"),
              control: data.control,
              name: data.name,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const updateAccess = () => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/traderx-users/apply-access-controls`,
        {
          accessControlRequests: [
            {
              code: code,
              accessControls:featureOptions
            },
          ],
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
          setMsg("Access Controls Modified Successfully");
          setError(false);
          setTimeout(() => {
            setSuccess(false);
          }, 2000);
        }
      })
      .catch((err) => {
        setLoad(false);
        setSuccess(false);
        if (err.response !== undefined) {
          setMsg(err.response.data.message);
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2500);
        } else {
          setMsg("Connection Error");
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2500);
        }
      });
  };

  return (
    <CRow>
      <CCol>
        <div className="col-md-6 offset-3 pt-5 pb-5 mt-2 mb-5">
          {success && <CAlert color="success">{msg}</CAlert>}
          {error && <CAlert color="danger">{msg}</CAlert>}
          <label>{userEmail} Access Controls</label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={handleChangeFeature}
            defaultValue={featureLISTS}
          >
            {featureSelect}
          </Select>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary mt-4 mr-2"
              onClick={updateAccess}
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
                "Update Access Controls"
              )}
            </button>
          </div>
        </div>
      </CCol>
    </CRow>
  );
};

export default FeatureAccess;
