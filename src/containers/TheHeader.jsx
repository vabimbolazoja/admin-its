import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import IdleTimer from "react-idle-timer";
import TimeoutModal from "./timoutModal";

// routes config
import routes from "../routes";

import 
  TheHeaderDropdown
from "./TheHeaderDropdown";

const TheHeader = (props) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  if (!sessionStorage.getItem("token")) {
    window.location.href = "/";
  }
  let inputRef = useRef();
  const elementRef = useRef();
  const history = useHistory();

  let logoutTimer;

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  logoutTimer = () => {
    setTimeout(() => {
      logout();
    }, 1000 * 5 * 1); // 5 seconds
  };

  const logout = () => {
    sessionStorage.setItem("token", "");
    history.push("/");
  };

  const onIdle = () => {
    togglePopup();
    logoutTimer();
  };

  const togglePopup = () => {
    setShowModal(!showModal);
  };

  const handleStayLoggedIn = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      logoutTimer = null;
    }
    inputRef.current.reset();
    togglePopup();
  };

  return (
    <>
      <CHeader
        withSubheader
        className="d-flex justify-content-between alfgn-items-center"
      >
        <CToggler
          inHeader
          className="ml-md-3 d-lg-none"
          onClick={toggleSidebarMobile}
        />{" "}
        <CToggler
          inHeader
          className="ml-3 d-md-down-none"
          onClick={toggleSidebar}
        />
          <h4 class="text-sucess pt-4">Today's Date is {new Date().toLocaleString() + ""}
</h4>
        <CHeaderNav className="px-3">
          <TheHeaderDropdown />
        </CHeaderNav>
      </CHeader>
      <IdleTimer
        ref={inputRef}
        element={document}
        stopOnIdle={true}
        onIdle={onIdle}
        timeout={1000 * 3000 * 1} // 10 seconds
      />

      <TimeoutModal
        showModal={showModal}
        togglePopup={togglePopup}
        handleStayLoggedIn={handleStayLoggedIn}
      />
    </>
  );
};

export default TheHeader;
