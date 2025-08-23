import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification, Pagination } from "antd";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import "./index.css";
import JoditEditor from "jodit-react";

import {
  CForm,
  CFormText,
  CCardFooter,
  CInputFile,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CCol,
  CDataTable,
  CBadge,
  CFormGroup,
  CLabel,
  CRow,
  CInput,
  CTextarea,
  CButton,
  CPagination,
} from "@coreui/react";
import config from "../../config";
import axios from "axios";

const getBadge = (status) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "FAILED":
      return "secondary";
    case "Pending":
      return "warning";
    case "FAILED":
      return "danger";
    default:
      return "info";
  }
};

const Blog = () => {
  const history = useHistory();
  const [exchangeData, setExchangeData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [viewContentModal, setViewContentModal] = useState(false);
  const [viewBidModal, setViewBidModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [readTime, setReadTime] = useState("");
  const [createBlogModal, setCreateBlogModal] = useState(false);
  const [fill, setFill] = useState(false);
  const [switchBlogUpdate, setSwitchBlogUpdate] = useState(false);
  const [msg, setMsg] = useState("");
  const [blogEditorContent, setBlogEditorContent] = useState(
    "blog contents goes here..."
  );
  const [imageUrlA, setImageUrlA] = useState("");
  const [imageUrlB, setImageUrlB] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImages, setBlogImages] = useState([]);
  const [blogId, setBlogId] = useState("");

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState("");
  const [exchangeDataAll, setExchangeDataAll] = useState([]);

  const [askInfo, setAskInfo] = useState({});
  const [bidInfo, setBidInfo] = useState({});
  const [load, setLoad] = useState(false);
  const [reason, setReason] = useState("");
  const [userId, setUserId] = useState("");
  const [loadView, setLoadView] = useState(false);

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const configEditor = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    uploader: {
      insertImageAsBase64URI: true,
    },
    toolbarStickyOffset: 1,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    toolbarSticky: true,
    disablePlugins: "preview",
  };

  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const handleChange = (content) => {
    console.log(content); //Get Content Inside Editor
    setBlogEditorContent(content);
  };

  const onEditorStateChange = (editorState) => {
    console.log(editorState);
    // setEditorState(editorState)
  };

  const closeContentModal = () => {
    setViewContentModal(false);
  };

  const closeViewAsk = () => {
    setViewContentModal(false);
  };

  const closeViewBid = () => {
    setViewBidModal(false);
  };

  const getPaged = (queryString) => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/transactions/exchange?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setExchangeData(
            res.data.records.map((data) => ({
              transactionStatus: data.transactionStatus,
              reference: data.reference,
              exchangeStatus: data.exchangeStatus,
              createdOn: data.createdOn ? data.createdOn.slice(0, 10) : "",
              ask: data.ask,
              bid: data.bid,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const pagination = (page, pageSize) => {
    console.log(page);
    setPage(page);
    const queryString = `pageNumber=${page}&pageSize=10&startDate&endDate&exhangeStatus&transactionStatus&reference`;
    getPaged(queryString);
  };

  useEffect(() => {
    getBlogs();
    getBlogsAll();
  }, []);

  const getBlogs = () => {
    console.log("data");
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/blogs?pageSize=10&pageNumber=1&blogStatus=&title=&startDate=&endDate=`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const result = res.data.content;
        console.log(result);

        setTotalItems(res.data.totalPages * 10);
        console.log(res.data);
        setExchangeData(
          result.map((data) => ({
            title: data.title,
            id: data.id,
            subTitle: data.subTitle,
            readTime: data.readTime,
            createdOn: data.createdOn ? data.createdOn.slice(0, 10) : "",
            status: data.blogStatus,
            content: data.content,
            imagesBlog: data.imageUrls,
          }))
        );
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const getBlogsAll = () => {
    axios
      .get(
        `${config.baseUrl}/api/v1/admin/blogs?pageSize=999999999&pageNumber=1&blogStatus=&title=&startDate=&endDate=`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalItems(res.data.totalPages * 10);
          setExchangeDataAll(
            res.data.content.map((data) => ({
              title: data.title,
              id: data.id,
              subTitle: data.subTitle,
              readTime: data.readTime,
              createdOn: data.createdOn ? data.createdOn.slice(0, 10) : "",
              status: data.blogStatus,
              content: data.content,
              imagesBlog: data.imageUrls,
            }))
          );
        }
      })
      .catch((err) => {
        if (err) {
        }
      });
  };

  const editBlogPost = () => {
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/blogs/${blogId}
      `,
        {
          title: title,
          subTitle: subtitle,
          readTime: readTime,
          content: content,
          imageUrls: [imageUrlA, imageUrlB],
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
          setCreateBlogModal(false);
          setTitle("");
          setSubtitle("");
          setImageUrlA("");
          setImageUrlB("");
          setMsg("Blog Post Updated Successfully");
          setTimeout(() => {
            setMsg("");
            setCreateBlogModal(false);
            setSuccess(false);
          }, 3000);
          getBlogs();
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

  const postBlog = () => {
    if (title && subtitle && readTime && imageUrlA) {
      setLoad(true);
      axios
        .post(
          `${config.baseUrl}/api/v1/admin/blogs
      `,
          {
            title: title,
            subTitle: subtitle,
            readTime: readTime,
            content: content,
            imageUrls: [imageUrlA, imageUrlB],
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
            setCreateBlogModal(false);
            setTitle("");
            setReadTime("");
            setSubtitle("");
            setContent("");
            setImageUrlA("");
            setImageUrlB("");
            setMsg("Blog Post Created Successfully");
            setTimeout(() => {
              setMsg("");
              setCreateBlogModal(false);
              setSuccess(false);
            }, 3000);
            getBlogs();
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

  const closeCreateBlog = () => {
    setCreateBlogModal(false);
    setTitle("");
    setContent("");
    setReadTime("");
    setSubtitle("");
    setBlogEditorContent("");
    setImageUrlA("");
    setImageUrlB("");
  };

  const viewContentFunc = (id, e) => {
    console.log(id.content);
    setBlogContent(id.content);
    setBlogImages(id.imagesBlog);
    if (id.content) {
      setViewContentModal(true);
    }
  };

  const viewBidFunc = (id, e) => {
    setBidInfo(id.bid);
    setViewBidModal(true);
  };

  const Notification = (type, msgType, msg) => {
    notification[type]({
      message: msgType,
      description: msg,
    });
  };

  const createBlog = () => {
    setCreateBlogModal(true);
    setSwitchBlogUpdate(false);
    setBlogEditorContent("");
  };

  const editBlog = (id) => {
    console.log(id);
    setTitle(id.title);
    setSubtitle(id.subTitle);
    setBlogId(id.id);
    setImageUrlA(id.imagesBlog[0]);
    setReadTime(id.readTime);
    setCreateBlogModal(true);
    setSwitchBlogUpdate(true);
    var strippedHtml = id.content.replace(/<[^>]+>/g, "");
    console.log(strippedHtml);
    setContent(id.content);
  };

  const changeStatusConfirmActivate = (id) => {
    console.log(id);
    Modal.confirm({
      title: `Are you sure you want to ${
        id.status === "INACTIVE" ? "Activate" : "Deactivate"
      }?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (id.status === "INACTIVE") {
          activate(id.id);
        } else {
          deActivate(id.id);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const changeStatusConfirmDelete = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: `Are you sure you want to delete this blog?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteBlog(id.id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const activate = (id) => {
    console.log(id);
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/blogs/${id}/activate`,
        {},
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
          setMsg("Blog Activated Successfully");
          getBlogs();
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

  const deleteBlog = (id, e) => {
    console.log(id);
    setLoad(true);
    axios
      .delete(`${config.baseUrl}/api/v1/admin/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoad(false);
        if (res.status === 200) {
          setSuccess(true);
          setMsg("Blog Deleted Successfully");
          getBlogs();
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

  const deActivate = (id) => {
    console.log(id);
    setLoad(true);
    axios
      .put(
        `${config.baseUrl}/api/v1/admin/blogs/${id}/de-activate`,
        {},
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
          setMsg("Blog Deactivated Successfully");
          getBlogs();
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
        {success && <CAlert color="success">{msg}</CAlert>}

        {error && <CAlert color="danger">{msg}</CAlert>}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>Blog Posts </div>
              <button
                type="button"
                class="btn btn-primary mr-2"
                onClick={createBlog}
              >
                Create BlogPost
              </button>
            </div>
          </CCardHeader>{" "}
          <CCardBody>
            <CDataTable
              items={exchangeData}
              fields={[
                {
                  key: "title",
                  name: "Title",
                },
                {
                  key: "subTitle",
                  name: "Subtitle",
                },

                {
                  key: "readTime",
                  name: "Read Time",
                },
                {
                  key: "Content",
                  name: "Content & Images",
                },

                {
                  key: "status",
                  name: "Status",
                },

                {
                  key: "Actions",
                  name: "Actions",
                },
              ]}
              scopedSlots={{
                Actions: (item) => (
                  <td className="d-flex">
                    <button
                      type="button"
                      class="btn btn-info mr-2"
                      onClick={changeStatusConfirmActivate.bind(this, item)}
                    >
                      {item.status === "INACTIVE" ? "ACTIVATE" : "DEACTIVATE"}
                    </button>
                    <button
                      type="button"
                      class="btn btn-success mr-2"
                      onClick={editBlog.bind(this, item)}
                    >
                      Edit Blog
                    </button>
                    <button
                      type="button"
                      onClick={changeStatusConfirmDelete.bind(this, item)}
                      class="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                ),

                Content: (item) => (
                  <td className="d-flex">
                    <button
                      type="button"
                      class="btn btn-info mr-2"
                      onClick={viewContentFunc.bind(this, item)}
                    >
                      View Content
                    </button>
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
                defaultPageSize={10}
                onChange={pagination}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        // title={
        //   updateState ? 'Update Limit Profile' : 'Create Limit Profile'
        // }
        width={1100}
        visible={createBlogModal}
        footer={null}
        maskClosable={false}
        onCancel={closeCreateBlog}
      >
        <div className="container">
          {fill && (
            <p className="text-danger text-center">All fields are required </p>
          )}

          <form>
            {success && <CAlert color="success">{msg}</CAlert>}

            {error && <CAlert color="danger">{msg}</CAlert>}
            {!switchBlogUpdate ? (
              <>
                <CFormGroup>
                  <CLabel htmlFor="name">Blog Title</CLabel>
                  <CInput
                    id="name"
                    type="text"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Blog Subtitle</CLabel>
                  <CInput
                    id="name"
                    type="text"
                    required
                    onChange={(e) => setSubtitle(e.target.value)}
                    value={subtitle}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Read Time</CLabel>
                  <CInput
                    id="text"
                    type="number"
                    required
                    onChange={(e) => setReadTime(e.target.value)}
                    value={readTime}
                  />
                </CFormGroup>
                <br />
                <div>
                  <CLabel htmlFor="name">Blog Content</CLabel>
                  <JoditEditor
                    ref={editor}
                    value={content}
                    config={configEditor}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={(newContent) => {}}
                  />
                </div>

                <br />
                <br />

                <CFormGroup>
                  <CLabel htmlFor="name">Blog Fore Image URL </CLabel>
                  <CInput
                    id="name"
                    type="text"
                    onChange={(e) => setImageUrlA(e.target.value)}
                    value={imageUrlA}
                  />
                </CFormGroup>
              </>
            ) : (
              <div>
                <>
                  <CFormGroup>
                    <CLabel htmlFor="name">Blog Title</CLabel>
                    <CInput
                      id="name"
                      type="text"
                      required
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="name">Blog Subtitle</CLabel>
                    <CInput
                      id="name"
                      type="text"
                      required
                      onChange={(e) => setSubtitle(e.target.value)}
                      value={subtitle}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="name">Read Time</CLabel>
                    <CInput
                      id="text"
                      type="number"
                      required
                      onChange={(e) => setReadTime(e.target.value)}
                      value={readTime}
                    />
                  </CFormGroup>
                  <br />
                  <CLabel htmlFor="name">Blog Content</CLabel>
                  <JoditEditor
                    ref={editor}
                    value={content}
                    config={configEditor}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={(newContent) => {}}
                  />

                  <br />
                  <br />

                  <CFormGroup>
                    <CLabel htmlFor="name">Blog Fore Image URL </CLabel>
                    <CInput
                      id="name"
                      type="text"
                      onChange={(e) => setImageUrlA(e.target.value)}
                      value={imageUrlA}
                    />
                  </CFormGroup>

                  {/*
                   */}
                </>
              </div>
            )}

            <br />
            <div className="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-primary mr-2"
                onClick={switchBlogUpdate ? editBlogPost : postBlog}
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
                  <div>{switchBlogUpdate ? "Update Blog" : "Post Blog"}</div>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        title={"View Content"}
        visible={viewContentModal}
        footer={null}
        maskClosable={false}
        onCancel={closeContentModal}
        width={1000}
      >
        <div className="container">
          <CRow>
            <CCol xs="12" md="12" lg="12">
              <CCard style={{ padding: "30px" }}>
                <div
                  className="blog-view-content"
                  dangerouslySetInnerHTML={{ __html: blogContent }}
                />
              </CCard>
              {blogImages.length > 0 && (
                <CCard style={{ padding: "30px" }}>
                  {blogImages &&
                    blogImages.map((img) => {
                      return (
                        <img
                          src={img}
                          alt=""
                          style={{ width: "100%", height: "400px" }}
                          className="mb-5"
                        />
                      );
                    })}
                </CCard>
              )}
            </CCol>
          </CRow>
        </div>
      </Modal>
    </CRow>
  );
};

export default Blog;
