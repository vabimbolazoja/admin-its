import React, { useState } from "react";
import {
  CWidgetDropdown,
  CRow,
  CCol,
  CDropdown,
  CCard,
  CCardHeader,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import ChartLineSimple from "../charts/ChartLineSimple";
import ChartBarSimple from "../charts/ChartBarSimple";

const WidgetsDropdown = ({
  exchangeStats,
  stats,
  withdrawStats,
  bidStats,
  depositStats,
  askStats,
  fundStats,
}) => {
  const [typeUsd, setTypeUsd] = useState("0");
  const [typeNgn, setTypeNgn] = useState("0");
  const [typeFundUSD, setTypeFundUsd] = useState("0");
  const [typeFundNGN, setTypeFundNgn] = useState("0");

  const totalNigeriaUsd = (type) => {
    console.log(type);
    setTypeNgn(type);
  };

  const totalFundUsd = (type) => {
    setTypeFundUsd(type);
  };

  const totalFundNgn = (type) => {
    setTypeFundNgn(type);
  };

  const totalUsaUsd = (type) => {
    setTypeUsd(type);
  };
  return (
    <>
      <CCard>
        <CCardHeader>System Stats</CCardHeader>
        <CRow>
          <CCol sm="6" lg="3">
            <CWidgetDropdown
              color="gradient-primary"
              header={stats.totalUsers}
              text="TOTAL ACTIVE USERS"
              footerSlot={
                <ChartLineSimple
                  pointed
                  className="c-chart-wrapper mt-3 mx-3"
                  style={{ height: "70px" }}
                  dataPoints={[65, 59, 84, 84, 51, 55, 40]}
                  pointHoverBackgroundColor="primary"
                  label="Members"
                  labels="months"
                />
              }
            >
              <CDropdown>
                <CDropdownToggle color="transparent">
                  <CIcon name="cil-settings" />
                </CDropdownToggle>
                <CDropdownMenu className="pt-0" placement="bottom-end">
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CWidgetDropdown>
          </CCol>

          <CCol sm="6" lg="3">
            <CWidgetDropdown
              color="gradient-info"
              header={stats.totalApprovedUsers}
              text="TOTAL APPROVED USERS"
              footerSlot={
                <ChartLineSimple
                  pointed
                  className="mt-3 mx-3"
                  style={{ height: "70px" }}
                  dataPoints={[1, 18, 9, 17, 34, 22, 11]}
                  pointHoverBackgroundColor="info"
                  options={{ elements: { line: { tension: 0.00001 } } }}
                  label="Members"
                  labels="months"
                />
              }
            >
              <CDropdown>
                <CDropdownToggle caret={false} color="transparent">
                  <CIcon name="cil-location-pin" />
                </CDropdownToggle>
                <CDropdownMenu className="pt-0" placement="bottom-end">
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CWidgetDropdown>
          </CCol>

          <CCol sm="6" lg="3">
            <CWidgetDropdown
              color="gradient-success"
              header={stats.totalNigeriaUsers}
              text="TOTAL NIGERIA USERS"
              footerSlot={
                <ChartLineSimple
                  className="mt-3"
                  style={{ height: "70px" }}
                  backgroundColor="rgba(255,255,255,.2)"
                  dataPoints={[78, 81, 80, 45, 34, 12, 40]}
                  options={{ elements: { line: { borderWidth: 2.5 } } }}
                  pointHoverBackgroundColor="warning"
                  label="Members"
                  labels="months"
                />
              }
            >
              <CDropdown>
                <CDropdownToggle color="transparent">
                  <CIcon name="cil-settings" />
                </CDropdownToggle>
                <CDropdownMenu className="pt-0" placement="bottom-end">
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CWidgetDropdown>
          </CCol>

          <CCol sm="6" lg="3">
            <CWidgetDropdown
              color="gradient-warning"
              header={stats.totalUsUsers}
              text="TOTAL USA USERS"
              footerSlot={
                <ChartBarSimple
                  className="mt-3 mx-3"
                  style={{ height: "70px" }}
                  backgroundColor="rgba(255,255,255,.2)"
                  label="Members"
                  labels="months"
                />
              }
            >
              <CDropdown>
                <CDropdownToggle
                  caret
                  className="text-white"
                  color="transparent"
                >
                  <CIcon name="cil-settings" />
                </CDropdownToggle>
                <CDropdownMenu className="pt-0" placement="bottom-end">
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CWidgetDropdown>
          </CCol>
        </CRow>
      </CCard>

      <CCard>
        <CCardHeader>Customer Fund Store</CCardHeader>
        <CRow>
          <CCol sm="4" lg="4">
            <CWidgetDropdown
              color="gradient-primary"
              header={false}
              text="TOTAL NGN"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ₦
                    {fundStats.totalNgn
                      ? Intl.NumberFormat("en-US").format(
                          fundStats.totalNgn
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>

          <CCol sm="4" lg="4">
            <CWidgetDropdown
              color="gradient-info"
              header={false}
              text="TOTAL NIGERIA USD"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - $
                    {fundStats.totalNigeriaUsd
                      ? Intl.NumberFormat("en-US").format(
                          fundStats.totalNigeriaUsd
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>
          <CCol sm="4" lg="4">
            <CWidgetDropdown
              color="gradient-info"
              header={false}
              text="TOTAL USA USD"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - $
                    {fundStats.totalUsUsd
                      ? Intl.NumberFormat("en-US").format(
                          fundStats.totalUsUsd
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>
        </CRow>
      </CCard>
      <CCard>
        <CCardHeader>Exchange Transactions</CCardHeader>
        <CRow>
          <CCol sm="12" lg="6">
            <CWidgetDropdown
              color="gradient-info"
              header={
                {
                  0: exchangeStats.totalDollarTransaction
                    ? exchangeStats.totalDollarTransaction.count
                    : 0,
                  1: exchangeStats.totalNigeriaUsersDollarTransaction
                    ? exchangeStats.totalNigeriaUsersDollarTransaction.count
                    : 0,
                  2: exchangeStats.totalUsUsersDollarTransaction
                    ? exchangeStats.totalUsUsersDollarTransaction.count
                    : 0,
                }[typeUsd]
              }
              text={
                {
                  0: "TOTAL USD TRANSACTIONS",
                  1: "TOTAL NIGERIA USERS USD",
                  2: "TOTAL USA USERS USD",
                }[typeUsd]
              }
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ${" "}
                    {
                      {
                        0: exchangeStats.totalDollarTransaction
                          ? Intl.NumberFormat("en-US").format(
                              exchangeStats.totalDollarTransaction.volume
                            )
                          : 0,
                        1: exchangeStats.totalNigeriaUsersDollarTransaction
                          ? Intl.NumberFormat("en-US").format(
                              exchangeStats.totalNigeriaUsersDollarTransaction
                                .volume
                            )
                          : 0,
                        2: exchangeStats.totalUsUsersDollarTransaction
                          ? Intl.NumberFormat("en-US").format(
                              exchangeStats.totalUsUsersDollarTransaction.volume
                            )
                          : 0,
                      }[typeUsd]
                    }
                  </h5>
                </div>
              }
            >
              <CDropdown>
                <CDropdownToggle color="transparent">
                  <CIcon name="cil-settings" />
                </CDropdownToggle>
                <CDropdownMenu className="pt-0" placement="bottom-end">
                  <CDropdownItem onClick={totalUsaUsd.bind(this, "0")}>
                    Total Dollar Transactions
                  </CDropdownItem>
                  <CDropdownItem onClick={totalUsaUsd.bind(this, "1")}>
                    Total Nigeria Users Dollar Transactions
                  </CDropdownItem>
                  <CDropdownItem onClick={totalUsaUsd.bind(this, "2")}>
                    Total Usa Users Dollar Transactions
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CWidgetDropdown>
          </CCol>

          <CCol sm="12" lg="6">
            <CWidgetDropdown
              color="gradient-success"
              header={
                {
                  0: exchangeStats.totalNairaTransaction
                    ? exchangeStats.totalNairaTransaction.count
                    : 0,
                  1: exchangeStats.totalNigeriaUsersNairaTransaction
                    ? exchangeStats.totalNigeriaUsersNairaTransaction.count
                    : 0,
                  2: exchangeStats.totalUsUsersNairaTransaction
                    ? exchangeStats.totalUsUsersNairaTransaction.count
                    : 0,
                }[typeNgn]
              }
              text={
                {
                  0: "TOTAL NAIRA TRANSACTIONS",
                  1: "TOTAL NIGERIA USERS NGN",
                  2: "TOTAL USA USERS NGN",
                }[typeNgn]
              }
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ₦
                    {
                      {
                        0: exchangeStats.totalNairaTransaction
                          ? Intl.NumberFormat("en-US").format(
                              exchangeStats.totalNairaTransaction.volume
                            )
                          : 0,
                        1: exchangeStats.totalNigeriaUsersNairaTransaction
                          ? Intl.NumberFormat("en-US").format(
                              exchangeStats.totalNigeriaUsersNairaTransaction
                                .volume
                            )
                          : 0,
                        2: exchangeStats.totalUsUsersNairaTransaction
                          ? Intl.NumberFormat("en-US").format(
                              exchangeStats.totalUsUsersNairaTransaction.volume
                            )
                          : 0,
                      }[typeNgn]
                    }
                  </h5>
                </div>
              }
            >
              <CDropdown>
                <CDropdownToggle color="transparent">
                  <CIcon name="cil-settings" />
                </CDropdownToggle>
                <CDropdownMenu className="pt-0" placement="bottom-end">
                  <CDropdownItem onClick={totalNigeriaUsd.bind(this, "0")}>
                    Total Naira Transactions
                  </CDropdownItem>
                  <CDropdownItem onClick={totalNigeriaUsd.bind(this, "1")}>
                    Total Nigeria Users Naira Transactions
                  </CDropdownItem>
                  <CDropdownItem onClick={totalNigeriaUsd.bind(this, "2")}>
                    Total Usa Users Naira Transactions
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CWidgetDropdown>
          </CCol>
        </CRow>
      </CCard>

      <CCard>
        <CCardHeader>Withdrawal Transactions</CCardHeader>
        <CRow>
          <CCol sm="6" lg="6">
            <CWidgetDropdown
              color="gradient-primary"
              header={
                withdrawStats.totalDollarTransaction
                  ? withdrawStats.totalDollarTransaction.count
                  : 0
              }
              text="TOTAL DOLLAR TRANSACTIONS"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ₦
                    {withdrawStats.totalDollarTransaction
                      ? Intl.NumberFormat("en-US").format(
                          withdrawStats.totalDollarTransaction.volume
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>

          <CCol sm="6" lg="6">
            <CWidgetDropdown
              color="gradient-info"
              header={
                withdrawStats.totalNairaTransaction
                  ? withdrawStats.totalNairaTransaction.count
                  : 0
              }
              text="TOTAL NAIRA TRANSACTIONS"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ₦
                    {withdrawStats.totalNairaTransaction
                      ? Intl.NumberFormat("en-US").format(
                          withdrawStats.totalNairaTransaction.volume
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>
        </CRow>
      </CCard>

      <CCard>
        <CCardHeader>Deposit Transactions</CCardHeader>
        <CRow>
          <CCol sm="6" lg="6">
            <CWidgetDropdown
              color="gradient-primary"
              header={
                depositStats.totalDollarTransaction
                  ? depositStats.totalDollarTransaction.count
                  : 0
              }
              text="TOTAL DOLLAR TRANSACTIONS"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - $
                    {depositStats.totalDollarTransaction
                      ? Intl.NumberFormat("en-US").format(
                          depositStats.totalDollarTransaction.volume
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>

          <CCol sm="6" lg="6">
            <CWidgetDropdown
              color="gradient-info"
              header={
                depositStats.totalNairaTransaction
                  ? depositStats.totalNairaTransaction.count
                  : 0
              }
              text="TOTAL NAIRA TRANSACTIONS"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ₦
                    {depositStats.totalNairaTransaction
                      ? Intl.NumberFormat("en-US").format(
                          depositStats.totalNairaTransaction.volume
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>
        </CRow>
      </CCard>

      <CCard>
        <CCardHeader>Ask Transactions</CCardHeader>
        <CRow>
          <CCol sm="6" lg="6">
            <CWidgetDropdown
              color="gradient-primary"
              header={
                askStats.totalDollarTransaction
                  ? askStats.totalDollarTransaction.count
                  : 0
              }
              text="TOTAL DOLLAR TRANSACTIONS"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ₦
                    {askStats.totalDollarTransaction
                      ? Intl.NumberFormat("en-US").format(
                          askStats.totalDollarTransaction.volume
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>

          <CCol sm="6" lg="6">
            <CWidgetDropdown
              color="gradient-info"
              header={
                askStats.totalNairaTransaction
                  ? askStats.totalNairaTransaction.count
                  : 0
              }
              text="TOTAL NAIRA TRANSACTIONS"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ₦
                    {askStats.totalNairaTransaction
                      ? Intl.NumberFormat("en-US").format(
                          askStats.totalNairaTransaction.volume
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>
        </CRow>
      </CCard>
      <CCard>
        <CCardHeader> Bid Transactions</CCardHeader>
        <CRow>
          <CCol sm="6" lg="6">
            <CWidgetDropdown
              color="gradient-primary"
              header={
                bidStats.totalDollarTransaction
                  ? bidStats.totalDollarTransaction.count
                  : 0
              }
              text="TOTAL DOLLAR TRANSACTIONS"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ₦
                    {bidStats.totalDollarTransaction
                      ? Intl.NumberFormat("en-US").format(
                          bidStats.totalDollarTransaction.volume
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>

          <CCol sm="6" lg="6">
            <CWidgetDropdown
              color="gradient-info"
              header={
                bidStats.totalNairaTransaction
                  ? bidStats.totalNairaTransaction.count
                  : 0
              }
              text="TOTAL NAIRA TRANSACTIONS"
              footerSlot={
                <div className="container py-4">
                  <h5 className="text-white pl-2">
                    VOLUME - ₦
                    {bidStats.totalNairaTransaction
                      ? Intl.NumberFormat("en-US").format(
                          bidStats.totalNairaTransaction.volume
                        )
                      : 0}
                  </h5>
                </div>
              }
            ></CWidgetDropdown>
          </CCol>
        </CRow>
      </CCard>
    </>
  );
};

export default WidgetsDropdown;
