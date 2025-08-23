import React from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import CIcon from "@coreui/icons-react";

const TheHeaderDropdown = (props) => {
  const history = useHistory();
  const logout = (e) => {
    e.preventDefault();
    sessionStorage.setItem("token", "");
    history.push("/");
  };
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <p className="text-danger pt-3"> {sessionStorage.getItem('loggedInAdmin')} </p>{" "}
      </CDropdownToggle>{" "}
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={logout}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Log Out{" "}
        </CDropdownItem>{" "}
      </CDropdownMenu>{" "}
    </CDropdown>
  );
};

export default TheHeaderDropdown;
