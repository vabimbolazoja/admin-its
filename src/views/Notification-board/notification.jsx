import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CLabel,
  CFormGroup,
  CDataTable,
  CRow,
  CSelect,
  CButton,
  CAlert,
  CPagination
} from '@coreui/react'
import config from '../../config'
import axios from 'axios'
import { Modal } from 'antd'
const Users = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [limitData, setLimitData] = useState([])
  const [createSettlement, setCreate] = useState(false)

  const [success, setSuccess] = useState(false)
  const [deleteSuccess, setDelSuccess] = useState(false)
  const [deleteErr, setDelErr] = useState(false)

  const [error, setError] = useState(false)
  const [msg, setMsg] = useState('')
  const [load, setLoad] = useState(false)
  const [limitType, setLimit] = useState('')
  const [scalingThreshold, setThreshold] = useState('')
  const [singleTransactionLimit, setSingleTransaction] = useState('')
  const [dailyCumulativeTransactionLimit, setDailyCumulative] = useState('')
  const [globalLimit, setGlobalLimit] = useState('')

  const [updateState, setUpdateState] = useState('')
  const [id, setID] = useState('')
  const [configDatas, setConfigsData] = useState({})

  const closeCreate = () => {
    setCreate(false)
    setSingleTransaction('')
    setDailyCumulative('')
    setLimit('')
    setGlobalLimit('')
    setThreshold('')
  }

  const pageChange = newPage => {
    currentPage !== newPage &&
      axios
        .get(
          `${config.baseUrl}/api/v1/admin/transactions/transfer?pageNumber=${newPage}&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
          }
        )
        .then(res => {
          if (res.status === 200) {
            setLimitData(
              res.data.records.map(data => ({
                reference: data.reference,
                firstName: data.traderXUser.firstName,
                id: data.id,
                lastName: data.traderXUser.lastName,
                emailAddress: data.traderXUser.emailAddress,
                amount: Intl.NumberFormat('en-US').format(data.amount),
                provider: data.provider.replace('_', ' '),
                transactionStatus: data.transactionStatus,

                country: data.traderXUser.country.replace('_', ' ')
              }))
            )
          }
        })
        .catch(err => {
          if (err) {
          }
        })
  }

  const addLimit = () => {
    if (
      limitType &&
      scalingThreshold &&
      singleTransactionLimit &&
      dailyCumulativeTransactionLimit &&
      globalLimit
    ) {
      setLoad(true)
      axios
        .post(
          `${config.baseUrl}/api/v1/admin/limit-profile
      `,
          {
            limitType: limitType,
            scalingThreshold: scalingThreshold,
            singleTransactionLimit: singleTransactionLimit,
            dailyCumulativeTransactionLimit: dailyCumulativeTransactionLimit,
            globalLimit: globalLimit
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
          }
        )
        .then(res => {
          setLoad(false)
          if (res.status === 201) {
            setSuccess(true)
            setSingleTransaction('')
            getLimitProfileSettlemts()
            setDailyCumulative('')
            setLimit('')
            setGlobalLimit('')
            setThreshold('')
            setMsg('Limit Profile Created Successfully')
            setTimeout(() => {
              setMsg('')
              setCreate(false)
              setSuccess(false)
            }, 2500)
            getLimitProfile()
          }
        })
        .catch(err => {
          setLoad(false)
          if (err.response !== undefined) {
            setMsg(err.response.data.message)
            setError(true)
            setSuccess(false)
            setTimeout(() => {
              setMsg('')
              setError(false)
            }, 2500)
          } else {
            setMsg('Connection Error')
            setError(true)
            setSuccess(false)
          }
        })
    } else {
      // setError(true)
      // setMsg("All fie")
    }
  }

  const getLimitProfile = () => {
    axios
      .get(`${config.baseUrl}/api/v1/configurations`)
      .then(res => {
        if (res.status === 200) {
          setConfigsData(res.data)
        }
      })
      .catch(err => {
        if (err) {
        }
      })
  }

  const update = () => {
    setLoad(true)
    console.log(id)
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/limit-profile/${id}`,
        {
          scalingThreshold: scalingThreshold,
          singleTransactionLimit: singleTransactionLimit,
          dailyCumulativeTransactionLimit: dailyCumulativeTransactionLimit,
          globalLimit: globalLimit
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        setLoad(false)
        if (res.status === 200) {
          setSuccess(true)
          setSingleTransaction('')
          getLimitProfileSettlemts()
          setDailyCumulative('')
          setLimit('')
          setGlobalLimit('')
          setThreshold('')
          setMsg('Limit Profile Updated Successfully')
          setTimeout(() => {
            setMsg('')
            setSuccess(false)
            setCreate(false)

          }, 2500)
          getLimitProfile()
        }
      })
      .catch(err => {
        setLoad(false)
        if (err.response !== undefined) {
          setMsg(err.response.data.message)
          setError(true)
          setSuccess(false)
          setTimeout(() => {
            setMsg('')
            setCreate(false)
            setError(false)
          }, 2500)
        } else {
          setMsg('Connection Error')
          setError(true)
          setSuccess(false)
        }
      })
  }

  useEffect(() => {
    getLimitProfileSettlemts()
    getLimitProfile()
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  const getLimitProfileSettlemts = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/limit-profile/all
        `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        if (res.data) {
          console.log(limitData)
          setLimitData(
            res.data.map(data => ({
              createdOn: data.createdOn ? data.createdOn.slice(0, 10) : '',
              limitType: data.limitType,
              scalingThreshold: data.scalingThreshold,
              id: data.id,
              singleTransactionLimit: data.singleTransactionLimit,
              dailyCumulativeTransactionLimit:
                data.dailyCumulativeTransactionLimit,
              globalLimit: data.globalLimit
            }))
          )
        }
      })
      .catch(err => {
        if (err) {
        }
      })
  }

  const deleteFunc = id => {
    console.log(id)
    setLoad(true)
    axios
      .delete(
        `${config.baseUrl}/api/v1/admin/limit-profile/${id.id}
      `,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        setLoad(false)
        if (res.status === 200) {
          setDelSuccess(true)
          setMsg('Limit Profile Deleted Successfully')
          getLimitProfileSettlemts()
          setTimeout(() => {
            setMsg('')
            setDelSuccess(false)
          }, 2500)
          getLimitProfile()
        }
      })
      .catch(err => {
        setLoad(false)
        if (err.response !== undefined) {
          setMsg(err.response.data.message)
          setDelErr(true)
          setTimeout(() => {
            setMsg('')
            setDelErr(false)
          }, 2500)
        } else {
          setMsg('Connection Error')
          setDelErr(false)
        }
      })
  }

  const confirmDelete = (id, e) => {
    e.preventDefault()
    Modal.confirm({
      title: `Are you sure you want to delete this limi profile?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        deleteFunc(id)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }
  const createSettlementFunc = () => {
    setUpdateState(false)
    setCreate(true)
  }

  const updateFunc = id => {
    console.log(id)
    setID(id.id)
    setLimit(id.limitType)
    setSingleTransaction(id.singleTransactionLimit)
    setDailyCumulative(id.dailyCumulativeTransactionLimit)
    setThreshold(id.scalingThreshold)
    setGlobalLimit(id.globalLimit)
    setUpdateState(true)
    setCreate(true)
  }

  return (
    <>
      {configDatas.limitTypes && (
        <CRow>
          <CCol>
            {deleteSuccess && <CAlert color='success'>{msg}</CAlert>}

            {deleteErr && <CAlert color='danger'>{msg}</CAlert>}
            <CCard>
              <CCardHeader>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>Notification Board </div>
                  <button
                    type='button'
                    class='btn btn-primary mr-2'
                    onClick={createSettlementFunc}
                  >
                    Create Notification
                  </button>
                </div>
              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={limitData}
                  fields={[
                    { key: 'createdOn', name: 'Created On' },
                    { key: 'limitType', name: 'Limit Type' },
                    {
                      key: 'dailyCumulativeTransactionLimit',
                      name: 'Daily Cummulative Transaction Limit'
                    },
                    { key: 'scalingThreshold', name: 'Scaling Thresold' },
                    {
                      key: 'singleTransactionLimit',
                      name: 'Single Transaction Limit'
                    },

                    {
                      key: 'Actions',
                      name: 'Actions'
                    }
                  ]}
                  hover
                  striped
                  itemsPerPage={5}
                  activePage={page}
                  scopedSlots={{
                    Actions: item => (
                      <td className='d-flex'>
                        <button
                          type='button'
                          class='btn btn-success mr-2'
                          onClick={updateFunc.bind(this, item)}
                        >
                          Update
                        </button>
                        <button
                          type='button'
                          class='btn btn-danger'
                          onClick={confirmDelete.bind(this, item)}
                        >
                          Delete
                        </button>
                      </td>
                    )
                  }}
                  clickableRows
                />
                {/* <CPagination
                  activePage={page}
                  onActivePageChange={pageChange}
                  pages={5}
                  doubleArrows={false}
                  align='center'
                /> */}
              </CCardBody>
            </CCard>
          </CCol>

          <Modal
            title={
              updateState ? 'Update Limit Profile' : 'Create Limit Profile'
            }
            visible={createSettlement}
            footer={null}
            maskClosable={false}
            onCancel={closeCreate}
          >
            <div className='container'>
              <form>
                {success && <CAlert color='success'>{msg}</CAlert>}

                {error && <CAlert color='danger'>{msg}</CAlert>}
                {!updateState ? (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Limit Type</CLabel>
                      <CSelect
                        custom
                        name='ccmonth'
                        id='ccmonth'
                        onChange={e => setLimit(e.target.value)}
                        value={limitType}
                      >
                        <option selected>Select</option>
                        {configDatas.limitTypes.map(data => {
                          return <option value={data}>{data}</option>
                        })}
                      </CSelect>{' '}
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Scaling Threshold</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setThreshold(e.target.value)}
                        value={scalingThreshold}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Single Transaction Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setSingleTransaction(e.target.value)}
                        value={singleTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>
                        Daily Cummulative Transaction Limit
                      </CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setDailyCumulative(e.target.value)}
                        value={dailyCumulativeTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Global Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setGlobalLimit(e.target.value)}
                        value={globalLimit}
                      />
                    </CFormGroup>
                  </>
                ) : (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Scaling Threshold</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setThreshold(e.target.value)}
                        value={scalingThreshold}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Single Transaction Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setSingleTransaction(e.target.value)}
                        value={singleTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>
                        Daily Cummulative Transaction Limit
                      </CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setDailyCumulative(e.target.value)}
                        value={dailyCumulativeTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Global Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setGlobalLimit(e.target.value)}
                        value={globalLimit}
                      />
                    </CFormGroup>
                  </>
                )}
                <br />
                <div className='d-flex justify-content-end'>
                  <button
                    type='button'
                    class='btn btn-primary mr-2'
                    onClick={!updateState ? addLimit : update}
                  >
                     {load ? (
                            <div
                              class='spinner-border'
                              role='status'
                              style={{ width: '1rem', height: '1rem' }}
                            >
                              <span class='sr-only'>Loading...</span>
                            </div>
                          ) : (
                            'Submit'
                          )}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
            <Modal
            title={
              updateState ? 'Update Limit Profile' : 'Create Limit Profile'
            }
            visible={createSettlement}
            footer={null}
            maskClosable={false}
            onCancel={closeCreate}
          >
            <div className='container'>
              <form>
                {success && <CAlert color='success'>{msg}</CAlert>}

                {error && <CAlert color='danger'>{msg}</CAlert>}
                {!updateState ? (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Limit Type</CLabel>
                      <CSelect
                        custom
                        name='ccmonth'
                        id='ccmonth'
                        onChange={e => setLimit(e.target.value)}
                        value={limitType}
                      >
                        <option selected>Select</option>
                        {configDatas.limitTypes.map(data => {
                          return <option value={data}>{data}</option>
                        })}
                      </CSelect>{' '}
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Scaling Threshold</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setThreshold(e.target.value)}
                        value={scalingThreshold}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Single Transaction Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setSingleTransaction(e.target.value)}
                        value={singleTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>
                        Daily Cummulative Transaction Limit
                      </CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setDailyCumulative(e.target.value)}
                        value={dailyCumulativeTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Global Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setGlobalLimit(e.target.value)}
                        value={globalLimit}
                      />
                    </CFormGroup>
                  </>
                ) : (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Scaling Threshold</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setThreshold(e.target.value)}
                        value={scalingThreshold}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Single Transaction Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setSingleTransaction(e.target.value)}
                        value={singleTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>
                        Daily Cummulative Transaction Limit
                      </CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setDailyCumulative(e.target.value)}
                        value={dailyCumulativeTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Global Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setGlobalLimit(e.target.value)}
                        value={globalLimit}
                      />
                    </CFormGroup>
                  </>
                )}
                <br />
                <div className='d-flex justify-content-end'>
                  <button
                    type='button'
                    class='btn btn-primary mr-2'
                    onClick={!updateState ? addLimit : update}
                  >
                     {load ? (
                            <div
                              class='spinner-border'
                              role='status'
                              style={{ width: '1rem', height: '1rem' }}
                            >
                              <span class='sr-only'>Loading...</span>
                            </div>
                          ) : (
                            'Submit'
                          )}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
            <Modal
            title={
              updateState ? 'Update Limit Profile' : 'Create Limit Profile'
            }
            visible={createSettlement}
            footer={null}
            maskClosable={false}
            onCancel={closeCreate}
          >
            <div className='container'>
              <form>
                {success && <CAlert color='success'>{msg}</CAlert>}

                {error && <CAlert color='danger'>{msg}</CAlert>}
                {!updateState ? (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Limit Type</CLabel>
                      <CSelect
                        custom
                        name='ccmonth'
                        id='ccmonth'
                        onChange={e => setLimit(e.target.value)}
                        value={limitType}
                      >
                        <option selected>Select</option>
                        {configDatas.limitTypes.map(data => {
                          return <option value={data}>{data}</option>
                        })}
                      </CSelect>{' '}
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Scaling Threshold</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setThreshold(e.target.value)}
                        value={scalingThreshold}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Single Transaction Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setSingleTransaction(e.target.value)}
                        value={singleTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>
                        Daily Cummulative Transaction Limit
                      </CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setDailyCumulative(e.target.value)}
                        value={dailyCumulativeTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Global Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setGlobalLimit(e.target.value)}
                        value={globalLimit}
                      />
                    </CFormGroup>
                  </>
                ) : (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Scaling Threshold</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setThreshold(e.target.value)}
                        value={scalingThreshold}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Single Transaction Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setSingleTransaction(e.target.value)}
                        value={singleTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>
                        Daily Cummulative Transaction Limit
                      </CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setDailyCumulative(e.target.value)}
                        value={dailyCumulativeTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Global Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setGlobalLimit(e.target.value)}
                        value={globalLimit}
                      />
                    </CFormGroup>
                  </>
                )}
                <br />
                <div className='d-flex justify-content-end'>
                  <button
                    type='button'
                    class='btn btn-primary mr-2'
                    onClick={!updateState ? addLimit : update}
                  >
                     {load ? (
                            <div
                              class='spinner-border'
                              role='status'
                              style={{ width: '1rem', height: '1rem' }}
                            >
                              <span class='sr-only'>Loading...</span>
                            </div>
                          ) : (
                            'Submit'
                          )}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
            <Modal
            title={
              updateState ? 'Update Limit Profile' : 'Create Limit Profile'
            }
            visible={createSettlement}
            footer={null}
            maskClosable={false}
            onCancel={closeCreate}
          >
            <div className='container'>
              <form>
                {success && <CAlert color='success'>{msg}</CAlert>}

                {error && <CAlert color='danger'>{msg}</CAlert>}
                {!updateState ? (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Limit Type</CLabel>
                      <CSelect
                        custom
                        name='ccmonth'
                        id='ccmonth'
                        onChange={e => setLimit(e.target.value)}
                        value={limitType}
                      >
                        <option selected>Select</option>
                        {configDatas.limitTypes.map(data => {
                          return <option value={data}>{data}</option>
                        })}
                      </CSelect>{' '}
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Scaling Threshold</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setThreshold(e.target.value)}
                        value={scalingThreshold}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Single Transaction Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setSingleTransaction(e.target.value)}
                        value={singleTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>
                        Daily Cummulative Transaction Limit
                      </CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setDailyCumulative(e.target.value)}
                        value={dailyCumulativeTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Global Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setGlobalLimit(e.target.value)}
                        value={globalLimit}
                      />
                    </CFormGroup>
                  </>
                ) : (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Scaling Threshold</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setThreshold(e.target.value)}
                        value={scalingThreshold}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Single Transaction Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setSingleTransaction(e.target.value)}
                        value={singleTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>
                        Daily Cummulative Transaction Limit
                      </CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setDailyCumulative(e.target.value)}
                        value={dailyCumulativeTransactionLimit}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor='name'>Global Limit</CLabel>
                      <CInput
                        id='name'
                        type='number'
                        required
                        onChange={e => setGlobalLimit(e.target.value)}
                        value={globalLimit}
                      />
                    </CFormGroup>
                  </>
                )}
                <br />
                <div className='d-flex justify-content-end'>
                  <button
                    type='button'
                    class='btn btn-primary mr-2'
                    onClick={!updateState ? addLimit : update}
                  >
                     {load ? (
                            <div
                              class='spinner-border'
                              role='status'
                              style={{ width: '1rem', height: '1rem' }}
                            >
                              <span class='sr-only'>Loading...</span>
                            </div>
                          ) : (
                            'Submit'
                          )}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </CRow>
      )}
    </>
  )
}

export default Users
