import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import ReconciliatonLookOut from "./reconciliaton-lookout"
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CLabel,
  CTextarea,
  CFormGroup, CDropdownItem,
  CWidgetDropdown,CDropdown,CDropdownToggle,CDropdownMenu,
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
import CIcon from "@coreui/icons-react";
import ChartLineSimple from "../charts/ChartLineSimple";
import ChartBarSimple from "../charts/ChartBarSimple";import moment from "moment";
const Finance = (props) => {

  
var depositCharstsNGN =[];
var depositCharstsUSD =[];
var withdrawalChartsUSD = [];
var withdrawalChartsNGN = [];

const [depositsUSD, setDepositDatasUSD] = useState([])
const [depositsNGN, setDepositDatasNGN] = useState([])
const [withdrawalsUSD, setWithdrawalDataUSD] = useState([])
const [withdrawalsNGN, setWithdrawalDataNGN] = useState([])
const [asks, setAsks] = useState([])
const [bids, setBids]= useState([])





  useEffect(() => {
    getDeposits()
    getWithdrawals()
  }, [])

  const getDeposits = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/fund-wallet?pageNumber=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          res.data.records.slice(0,10).map((data) => {
            if(data.currency === "USD"){
              return depositCharstsUSD.push(data.amount)
            }
            else{
              return depositCharstsNGN.push(data.amount)


            }
          })          
          setDepositDatasUSD(depositCharstsUSD)
          setDepositDatasNGN(depositCharstsNGN)
          // setDepositDatas(
          //   res.data.records
          // )
        }
      })
      .catch(err => {
        if (err) {
        }
      })
  }

  const getAsks = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/asks/all?pageNumber=1&pageSize=10&haveCurrency&haveAmount&needCurrency&needAmount&rate&askStatus&emailAddress&phoneNumber&startDate&endDate`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
        
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getWithdrawals = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/withdrawal?pageNumber=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        if (res.status === 200) {

          // setWithdrawalData(
          //   res.data.records.map(data => ({
            
             
          //     amount:  data.currency === "NGN" ? "N" + Intl.NumberFormat("en-US").format(data.amount) : "$"  + Intl.NumberFormat("en-US").format(data.amount),
             
          //   }))
          // )
          res.data.records.slice(0,10).map((data) => {
            if(data.currency === "USD"){
             return withdrawalChartsUSD.push(data.amount)
            }
            else{
              return withdrawalChartsNGN.push(data.amount)
            }
           })
           setWithdrawalDataNGN(withdrawalChartsNGN)
           setWithdrawalDataUSD(withdrawalChartsUSD)


        }
      })
      .catch(err => {
        if (err) {
        }
      })
  }

  console.log(depositsNGN)
  console.log(withdrawalsNGN)
  console.log(depositsUSD)
  console.log(withdrawalsUSD)
  
  return (
    <CRow>
      
      <CCol xs='12' md="12">
        
        <CCard>
          <CCardHeader>Transaction Analytics</CCardHeader>{" "}
          <CCardBody>
           
        <p className="text-left">
            Ask Transactions
        </p>
        <br />
        <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                className: "chartcontainer",
                backgroundColor: "transparent",
                height: 280,
                title: {
                  text: null,
                },
              },
              title: {
                text: "",
              },
              xAxis: {
                categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                text:'Asks Transactions Processed Throught The Week'

              },
              series: [
                {
                  type: "area",
                  name: "<p style='color:#74c6e9;font-weight:400;font-size: 12px;'>Asks</p>",
                  data: [
                    29.9, 71.5, 106.4, 129.2, 144.0
                  ],
                  color: "#74c6e9",
                  fillColor: "#74c6e91a",
                  marker: {
                    enabled: false,
                    symbol: "circle",
                    radius: 2,
                    states: {
                      hover: {
                        enabled: true,
                      },
                    },
                  },
                },
               
              ],
              yAxis: {
                gridLineDashStyle: "solid",
                gridLineColor: "#eee",
                title: {
                  text: "",
                },
              },
              credits: {
                enabled: false,
              },
              noData: {
                style: {
                  fontWeight: "bold",
                  fontSize: "15px",
                  color: "#303030",
                },
              },
            }}
          />

          <br />
          <br />
          <p className="text-left"> Deposits Transactions</p>
          
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                className: "chartcontainer",
                backgroundColor: "transparent",
                height: 280,
                title: {
                  text: null,
                },
              },
              title: {
                text: "",
              },
              yAxis:{
                categories:[],
                lineColor:'#999',
                lineWidth:1,
                tickColor:'#666',
                tickLength:3,
                title:{
                    text:''
                }
            },
              xAxis:{
                categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                lineColor:'#999',
                lineWidth:1,
                tickColor:'#666',
                tickLength:3,
                title:{
                  text:'Deposits Transactions Processed Throught The Week'
                }
            },
       
          
              series: [
                {
                  type: "area",
                  name: "<p style='color:#74c6e9;font-weight:400;font-size: 12px;'>Deposits</p>",
                  data: [                    29.9, 71.5, 106.4, 129.2, 144.0                  ],
                  color: "#74c6e9",
                  fillColor: "#74c6e91a",
                  marker: {
                    enabled: false,
                    symbol: "circle",
                    radius: 2,
                    states: {
                      hover: {
                        enabled: true,
                      },
                    },
                  },
                },
                
              ],
              yAxis: {
                gridLineDashStyle: "solid",
                gridLineColor: "#eee",
                title: {
                },
              },
              credits: {
                enabled: false,
              },
              noData: {
                style: {
                  fontWeight: "bold",
                  fontSize: "15px",
                  color: "#303030",
                },
              },
            }}
          />
         <br />
         <br />
          <p className="text-left"> Withdrawals Transactions</p>
          
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                className: "chartcontainer",
                backgroundColor: "transparent",
                height: 280,
                title: {
                  text: null,
                },
              },
              title: {
                text: "",
              },
              yAxis:{
                categories:[],
                lineColor:'#999',
                lineWidth:1,
                tickColor:'#666',
                tickLength:3,
                title:{
                    text:'USD Deposit'
                }
            },
              xAxis:{
                categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                lineColor:'#999',
                lineWidth:1,
                tickColor:'#666',
                tickLength:3,
                title:{
                    text:'Withdraals Transactions Processed Throught The Week'
                }
            },
       
          
              series: [
                {
                  type: "area",
                  name: "<p style='color:#74c6e9;font-weight:400;font-size: 12px;'>Withdrawals</p>",
                  data: depositsUSD,
                  color: "#74c6e9",
                  fillColor: "#74c6e91a",
                  marker: {
                    enabled: false,
                    symbol: "circle",
                    radius: 2,
                    states: {
                      hover: {
                        enabled: true,
                      },
                    },
                  },
                },
                
              ],
              yAxis: {
                gridLineDashStyle: "solid",
                gridLineColor: "#eee",
                title: {
                  text: "",
                },
              },
              credits: {
                enabled: false,
              },
              noData: {
                style: {
                  fontWeight: "bold",
                  fontSize: "15px",
                  color: "#303030",
                },
              },
            }}
          />
          </CCardBody>
        </CCard>
      </CCol>
      

     
    </CRow>
  );
};

export default Finance;
