import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import config from "../../../config";
import axios from "axios";
import Cookie from "js-cookie";
import jwt_decode from "jwt-decode";
import Logo from "../../../assets/Logo.svg"
import { Modal } from "antd";
const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [msg, setMsg] = useState("");
  const [response, setResponse] = useState(false);
  const [load, setLoad] = useState(false);
  const [show, setShowPass] = useState(false);

  const intialValues = { password: "", username: "" };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeResponse = () => setResponse(false);
  const submitForm = () => {
    setLoad(true);
    const data = {
      secret: pass,
      username: email,
      channel: "PORTAL-SYP",
    };
    axios
      .post(`${config.baseUrl}/login`, data, {
        headers: {
          "Content-Type": "application/json",
          userIdentifier: data.username,
        },
      })
      .then((response) => {
        setIsSubmitting(false);
        if (response.status === 200) {
          var token = response.data.token;
          var decoded = jwt_decode(token);
          sessionStorage.setItem("loggedInAdmin", decoded.sub);
          sessionStorage?.setItem('roleUser', 'SUPERIOR_ADMIN')
          sessionStorage?.setItem('token',token)
          setLoad(false);
          window.location.href = '/users'
        } else {
          setLoad(false);
          setMsg("You are not allowed to log into the system");

        }

      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
        if (err.response !== undefined) {
          setMsg(err.response.data.message);
          setIsSubmitting(false);
          setError(true);
          setResponse(true);
        } else {
          setMsg("Connection Error");
          setResponse(true);
          setIsSubmitting(false);
          setServerError(true);
        }
      });
  };
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <div className="d-flex justify-content-center">
                      <img src={Logo} />
                    </div>
                    <p className="text-muted"> Sign In </p>{" "}
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>{" "}
                      </CInputGroupPrepend>{" "}
                      <CInput
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />{" "}
                    </CInputGroup>{" "}
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>{" "}
                      </CInputGroupPrepend>{" "}
                      <CInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPass(e.target.value)}
                        value={pass}
                      />{" "}
                    </CInputGroup>{" "}
                    <CRow>
                      <CCol xs="6">
                        <CButton
                          color="success"
                          className="px-4"
                          onClick={submitForm}
                        >
                          {" "}
                          {load ? (
                            <div
                              class="spinner-border"
                              role="status"
                              style={{ width: "1rem", height: "1rem" }}
                            >
                              <span class="sr-only"> Loading... </span>{" "}
                            </div>
                          ) : (
                            "Login"
                          )}{" "}
                        </CButton>{" "}
                      </CCol>{" "}
                    </CRow>{" "}
                  </CForm>{" "}
                </CCardBody>{" "}
              </CCard>{" "}
            </CCardGroup>{" "}
          </CCol>{" "}
        </CRow>{" "}
      </CContainer>{" "}
      <Modal
        title={false}
        visible={response}
        footer={null}
        maskClosable={false}
        onCancel={closeResponse}
      >
        <div className="d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div>
              <i class="fa fa-5x text-danger fa-info-circle" />
            </div>{" "}
            <div className="pt-4">
              {" "}
              {error && (
                <div className="auth-label text-danger"> {msg} </div>
              )}{" "}
              {serverError && (
                <div className="auth-label text-danger"> {msg} </div>
              )}{" "}
              <br />
            </div>{" "}
            <CButton color="danger" className="px-4" onClick={closeResponse}>
              Close{" "}
            </CButton>{" "}
          </div>{" "}
        </div>{" "}
      </Modal>{" "}
    </div>
  );
};

export default Login;
