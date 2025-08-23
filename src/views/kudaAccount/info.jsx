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
import config from "../../config";
import axios from "axios";
import { Pagination } from "antd";
import { Tabs } from "antd";
import Transactions from "./Transactions";
import Balance from "./balance";

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

const Users = (props) => {
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>View User</CCardHeader>
          <CCardBody>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="Balance Informations" key="1">
                <Balance />
              </TabPane>

              <TabPane tab="Transactions" key="2">
                <Transactions />
              </TabPane>
            </Tabs>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Users;
