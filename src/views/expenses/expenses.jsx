import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExportCSV } from "../../containers/Exportcsv";
import { ExclamationCircleOutlined } from '@ant-design/icons'
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
import { Pagination, Modal,DatePicker, Button } from "antd";
import moment from "moment";

const getBadge = (status) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "FAILED":
      return "danger";
    case "Pending":
      return "warning";
    case "FAILED":
      return "danger";
    default:
      return "primary";
  }
};
const { RangePicker } = DatePicker;
const ProxyTransfer = (props) => {
  const userEmail = props.history.location.state;
  const [TransferDatas, setTransferDatas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [expenseModal, setAddExpense] = useState(false);
  const [switchUpdate, setSwitchUpdate] = useState(false);
  const [updateID, setUpdateID] = useState("");

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const  [paidBy, setPaidBy] = useState("");
  const [TransferDatasAll, setSearchExpenseAll] = useState([])
  const [reason, setReason] = useState("");
  const [load, setLoad] = useState(false);
  const [msg, setMsg] = useState("");
  const [searchExpense, setSearchExpense] = useState(false);
  const [fill, setFill] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const [updatable, setUpdatable] = useState(false);
  const [updateExpenseModal, setUpdateExpense] = useState(false);

  const closeAddExpense = () => {
    setAddExpense(false);
    setCurrency("");
    setAmount("");
    setReason("");
    setUpdatable(false);
  };

  function onChange(date, dateString) {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }


  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/expense/all??${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setTransferDatas(
            res.data.records.map((data) => ({
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              paidBy: data.paidBy,
              updatable: data.updateAble,
              id:data.id,
              currency: data.currency,
              reason: data.reason,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };
  const shouldDeleteConfirm = (id, e) => {
    e.preventDefault()
    Modal.confirm({
      title: `Are you sure you want to delete this expense?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        deleteExpense(id)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  const deleteExpense = (id) => {
    axios
    .delete(
      `${config.baseUrl}/api/v1/admin/expense/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
    .then((res) => {
      if (res.status === 200) {
        setSuccess(true);
       
        setMsg("Expense Deleted Successfully");
        setTimeout(() => {
          setMsg("");
          setSuccess(false);
        }, 2500);
        getExpenses();
      }
    })
    .catch((err) => {
      if (err) {
      }
    });
  }

  const pagination = (page, pageSize) => {
    setPage(page);
    const queryString = `currency=${currency}&amount=${amount}&reason=${reason}&paidBy=${paidBy}&startDate=${startDate}&endDate=${endDate}&pageNumber=${page}&pageSize=${pageSize}`;
    getPaged(queryString);
  };

  const addExpenseFunc = () => {
    if (amount && reason && currency) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/admin/expense
  `,
          {
            reason,
            amount,
            currency,
            updateAble: updatable,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setLoad(false);
          if (res.status === 201) {
            setSuccess(true);
            setCurrency("");
            setAmount("");
            setAddExpense(false);
            setReason("");
            setMsg("Expense Added Successfully");
            setTimeout(() => {
              setMsg("");
              setSuccess(false);
              getExpenses();

            }, 2500);
          }
        })
        .catch((err) => {
          setLoad(false);
          if (err.response !== undefined) {
            setMsg(err.response.data.message);
            setError(true);
            setSuccess(false);
            setTimeout(() => {
              setMsg("");
              setError(false);
            }, 2500);
          } else {
            setMsg("Connection Error");
            setError(true);
            setSuccess(false);
          }
        });
    } else {
      // setError(true)
      // setMsg("All fie")
      setFill(true);
      setTimeout(() => {
        setFill(false);
      }, 2500);
    }
  };


  const updateExpenseFunc = () => {
      setLoad(true);
      axios
        .put(
          `${config.baseUrl}/api/v1/admin/expense/${updateID}
  `,
          {
            reason,
            amount,
            currency,
            updateAble: updatable,
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
            setCurrency("");
            setAmount("");
            setAddExpense(false);
            setReason("");
            setMsg("Expense Updated Successfully");
            setTimeout(() => {
              setMsg("");
              setSuccess(false);
              getExpenses();

            }, 2500);
          }
        })
        .catch((err) => {
          setLoad(false);
          if (err.response !== undefined) {
            setMsg(err.response.data.message);
            setError(true);
            setSuccess(false);
            setTimeout(() => {
              setMsg("");
              setError(false);
            }, 2500);
          } else {
            setMsg("Connection Error");
            setError(true);
            setSuccess(false);
          }
        });
   
  };


 

  useEffect(() => {
    getExpenses();
    getExpensesAll()
  }, []);

  const getExpenses = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/expense/all?currency=&amount=&reason=&paidBy=&startDate=&endDate=&pageNumber=1&pageSize=100`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          
          setTotalItems(res.data.totalPages * 10);
          setSearchExpense(false)
          setTransferDatas(
            res.data.records.map((data) => ({
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              paidBy: data.paidBy,
              updatable: data.updateAble,
              reason: data.reason,
              currency: data.currency,
              id:data.id,
              amt: data.amount
            }))
          );
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  };

  const getExpensesAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/expense/all?currency=&amount=&reason=&paidBy=&startDate=&endDate=&pageNumber=1&pageSize=999999999`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          
          setSearchExpenseAll(false)
          setTransferDatas(
            res.data.records.map((data) => ({
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              paidBy: data.paidBy,
              updatable: data.updateAble,
              reason: data.reason,
              currency: data.currency,
              id:data.id,
              amt: data.amount
            }))
          );
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  };

  const searchExpenseFunc = () => {
    setLoad(true)
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/expense/all?currency=${currency}&amount=${amount}&reason=${reason}&paidBy=${paidBy}&startDate=${startDate}&endDate=${endDate}&pageNumber=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          
          setTotalItems(res.data.totalPages * 10);
          setSearchExpense(false)
          setTransferDatas(
            res.data.records.map((data) => ({
              startDate: moment(data.createdOn).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              amount:
                data.currency === "NGN"
                  ? "N" + Intl.NumberFormat("en-US").format(data.amount)
                  : "$" + Intl.NumberFormat("en-US").format(data.amount),
              paidBy: data.paidBy,
              updatable: data.updateAble,
              reason: data.reason,
              currency: data.currency,
              id:data.id,
              amt: data.amount
            }))
          );
        }
      })
      .catch((err) => {
        setLoad(false);
        if (err) {
        }
      });
  }


  const closeSearchExpense = () => {
    setSearchExpense(false)
  }

  const addNewExpense = () => {
    setAddExpense(true);
    setUpdatable(false)
    setSwitchUpdate(false)
  };

  const updateExpense = (id) => {
    console.log(id)
    setUpdateID(id.id)
    setAddExpense(true);
    setSwitchUpdate(true)
    setAmount(id.amt)
    setUpdatable(id.updatable)
    setReason(id.reason)
    setCurrency(id.currency)
  };

  return (
    <CRow>
      <CCol>
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <div className="d-flex justify-content-end align-items-center">
        <ExportCSV
                csvData={TransferDatasAll}
                fileName={"Company Expenses Data"}
              />
          
          <button type="button" class="btn btn-info mr-2" onClick={addNewExpense}>
            Add Expense
          </button>{" "}
          <button type="button" class="btn btn-primary" onClick={() => setSearchExpense(true)}>
          Search Expense
          </button>
        </div>
        <br />
        <CCard>
          <CCardHeader>Company Expenses</CCardHeader>{" "}
          <CCardBody>
            <CDataTable
              items={TransferDatas}
              fields={[
                { key: "startDate", name: " Date" },
                { key: "amount", name: "Amount" },
                { key: "paidBy", name: "Paid By" },
                { key: "reason", name: "Reason" },
                { key: "actions", name: "Actions" },
              ]}
              striped
              scopedSlots={{
                transactionStatus: (item) => (
                  <td>
                    <CBadge color={getBadge(item.transactionStatus)}>
                      {item.transactionStatus}
                    </CBadge>
                  </td>
                ),
                actions: (item) => (
                  <td>
                    <div className="d-flex justify-content align-items-center">
                      {item.updatable &&
                      <button type="button" class="btn btn-success mr-2" onClick={updateExpense.bind(this,item)}>
                        Update
                      </button>}
                      {item.updatable &&
                      <button type="button" class="btn btn-danger" onClick={shouldDeleteConfirm.bind(this,item.id)}>
                        Delete
                      </button>}
                    </div>
                  </td>
                ),
              }}
            />
            <div className="text-center pagination-part">
              <Pagination
                current={page}
                total={totalItems}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                defaultPageSize={100}
                onChange={pagination}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        title={switchUpdate ? "Update Expense" : "Add New Expense"}
        visible={expenseModal}
        footer={null}
        maskClosable={false}
        onCancel={closeAddExpense}
      >
        {!switchUpdate ?
        <div>
          <CFormGroup>
            <CLabel htmlFor="name">Currency</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setCurrency(e.target.value)}
              value={currency}
            >
              <option selected>Select</option>
              <option selected>NGN</option>
              <option selected>USD</option>
            </CSelect>{" "}
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="name">Amount</CLabel>
            <CInput
              id="name"
              type="number"
              required
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Reason</CLabel>
            <CTextarea
              id="name"
              type="text"
              required
              onChange={(e) => setReason(e.target.value)}
              value={reason}
            />
          </CFormGroup>

          <CFormGroup>
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
                onChange={(e) => setUpdatable(e.target.checked)}
                checked={updatable}
              />
              <label class="form-check-label" for="exampleCheck1">
                {" "}
                Set Expense To Be Updatable
              </label>
            </div>
          </CFormGroup>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary mr-2"
              onClick={addExpenseFunc}
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
                "Submit"
              )}
            </button>
          </div>
        </div>:

        <div>
          <CFormGroup>
            <CLabel htmlFor="name">Currency</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setCurrency(e.target.value)}
              value={currency}
            >
              <option selected>Select</option>
              <option selected>NGN</option>
              <option selected>USD</option>
            </CSelect>{" "}
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="name">Amount</CLabel>
            <CInput
              id="name"
              type="number"
              required
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </CFormGroup>
          
          <CFormGroup>
            <CLabel htmlFor="name">Reason</CLabel>
            <CTextarea
              id="name"
              type="text"
              required
              onChange={(e) => setReason(e.target.value)}
              value={reason}
            />
          </CFormGroup>

          <CFormGroup>
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
                onChange={(e) => setUpdatable(e.target.checked)}
                checked={updatable}
              />
              <label class="form-check-label" for="exampleCheck1">
                {" "}
                Set Expense To Be Updatable
              </label>
            </div>
          </CFormGroup>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary mr-2"
              onClick={updateExpenseFunc}
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
                "Submit"
              )}
            </button>
          </div>
        </div>}
      </Modal>

      <Modal
        title={"Search Expense"}
        visible={searchExpense}
        footer={null}
        maskClosable={false}
        onCancel={closeSearchExpense}
      >
         <CFormGroup>
            <CLabel htmlFor="name">Currency</CLabel>
            <CSelect
              custom
              name="ccmonth"
              id="ccmonth"
              onChange={(e) => setCurrency(e.target.value)}
              value={currency}
            >
              <option selected>Select</option>
              <option >NGN</option>
              <option >USD</option>
            </CSelect>{" "}
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Amount</CLabel>
            <CInput
              id="name"
              type="number"
              required
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </CFormGroup>
          
          <CFormGroup>
            <CLabel htmlFor="name">Reason</CLabel>
            <CTextarea
              id="name"
              type="text"
              required
              onChange={(e) => setReason(e.target.value)}
              value={reason}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Paid By</CLabel>
            <CInput
              id="name"
              type="text"
              required
              onChange={(e) => setPaidBy(e.target.value)}
              value={setPaidBy}
            />
          </CFormGroup>
          <br />
          <RangePicker style={{ width: "100%" }} onChange={onChange} />
          <br />
          <div className="d-flex justify-content-end mt-3">
            <button
              type="button"
              class="btn btn-primary mr-2"
              onClick={searchExpenseFunc}
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
                "Search"
              )}
            </button>
          </div>

          
         


        </Modal>


    </CRow>
  );
};

export default ProxyTransfer;
