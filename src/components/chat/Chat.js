import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import "./Chat.css";
import BackButton from "../../img/BackButton.svg";
import {
  BsBoxArrowInLeft,
  BsBoxArrowInRight,
  BsCalendar,
  BsFillFileEarmarkMedicalFill,
  BsPerson,
  BsPersonCircle,
  BsPiggyBank,
} from "react-icons/bs";
import { FcAbout } from "react-icons/fc";
import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import { addMessages, getThreadById } from "../../API";
import { useAuth } from "../../context/AuthContext";
import Loader from "../loader/Loader";
import db from "../../admin";
import { Formik } from "formik";
import InfiniteScroll from "react-infinite-scroll-component";

const Chat = (props) => {
  const [threadById, setThreadById] = useState();
  const [threadMessage, setThreadMessage] = useState([]);
  const [loading, setLoading] = useState();
  const [length, setLength] = useState({
    items: Array.from({ length: 10 }),
  });
  const { id } = useParams();

  useEffect(() => {
    const getThreadDataById = async () => {
      setLoading(true);
      const threadRef = await getThreadById(id);
      setThreadById(threadRef);
      setLoading(false);
    };
    getThreadDataById();
  }, []);

  const { currentUser } = useAuth();

  const getThreadData = async () => {
    await db
      .collection("threads")
      .doc(id)
      .collection("messages")
      .orderBy("created_at", "desc")
      .limit(length.items.length)
      .onSnapshot((doc) => {
        let tempData = [];
        doc.forEach((item) => {
          tempData.push(item.data());
        });
        setThreadMessage(tempData);
        setLength({
          items: length.items.concat(
            Array.from({
              length: 10,
            })
          ),
        });
      });
    if (
      !threadById?.last_message?.isRead &&
      threadById?.last_message?.user_id !== currentUser?.uid
    ) {
      await db
        .collection("threads")
        .doc(id)
        .set(
          {
            last_message: {
              isRead: true,
            },
          },
          { merge: true }
        );
    }
  };

  const fetchMoreData = async () => {
    console.log("SDFsdf");
    await setTimeout(() => {
      getThreadData();
    }, 1500);
  };

  useEffect(() => {
    getThreadData();
  }, []);

  const messageRef = useRef();

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [threadMessage]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Row>
          <Col
            lg={2}
            style={{ padding: "0px", height: "100vh", overflow: "auto" }}
            className="reservation-col"
          >
            <div className="reservation-detail-main-div">
              <div
                className="back-button"
                onClick={() => props.history.goBack()}
              >
                <img
                  src={BackButton}
                  alt="back"
                  style={{
                    height: "15px",
                    marginRight: "10px",
                  }}
                />
                <span>Back</span>
              </div>
              <div className="reservation-detail-div">
                <strong>Reservation</strong>
                <Card style={{ border: "none", background: "#f8f7f9" }}>
                  <div className="reservation-detail-image">
                    <div className="image-inner-div" />
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-disabled">Agua Verde</Tooltip>
                      }
                    >
                      <span className="unitname-span">Agua Verde</span>
                    </OverlayTrigger>
                    <span className="status-span">Accepted</span>
                  </div>

                  <div className="d-flex mt-2">
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-disabled">Check-in date</Tooltip>
                      }
                    >
                      <span>
                        <BsBoxArrowInLeft
                          style={{ fontSize: "20px", color: "#5c576a" }}
                        />
                      </span>
                    </OverlayTrigger>
                    <p className="mx-3 p-0 my-0">
                      {moment("2022-07-29").format("ddd, MMMM-DD-YYYY")}
                    </p>
                  </div>

                  <div className="d-flex mt-2">
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>Check-out date</Tooltip>}
                    >
                      <span>
                        <BsBoxArrowInRight
                          style={{ fontSize: "20px", color: "#5c576a" }}
                        />
                      </span>
                    </OverlayTrigger>
                    <p className="mx-3 my-0">
                      {moment("2022-07-29").format("ddd, MMMM-DD-YYYY")}
                    </p>
                  </div>

                  <div
                    className="d-flex mt-2"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div className="d-flex">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Number of nights</Tooltip>}
                      >
                        <span>
                          <BsCalendar
                            style={{ fontSize: "20px", color: "#5c576a" }}
                          />
                        </span>
                      </OverlayTrigger>
                      <p className="mx-3 my-0">0</p>
                    </div>
                    <div className="d-flex">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Subtotal</Tooltip>}
                      >
                        <span>
                          <BsFillFileEarmarkMedicalFill
                            style={{ fontSize: "20px", color: "#5c576a" }}
                          />
                        </span>
                      </OverlayTrigger>
                      <p className="mx-3 my-0">$1234</p>
                    </div>
                  </div>

                  <div
                    className="d-flex my-2"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div className="d-flex">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Adults</Tooltip>}
                      >
                        <span>
                          <BsPerson
                            style={{ fontSize: "20px", color: "#5c576a" }}
                          />
                        </span>
                      </OverlayTrigger>
                      <p className="mx-3 my-0">0</p>
                    </div>
                    <div className="d-flex">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Children</Tooltip>}
                      >
                        <span>
                          <BsPerson
                            style={{ fontSize: "15px", color: "#5c576a" }}
                          />
                        </span>
                      </OverlayTrigger>
                      <p className="mx-3 my-0">0</p>
                    </div>
                    <div className="d-flex">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Infants</Tooltip>}
                      >
                        <span>
                          <BsPiggyBank
                            style={{ fontSize: "15px", color: "#5c576a" }}
                          />
                        </span>
                      </OverlayTrigger>
                      <p className="mx-3 my-0">0</p>
                    </div>
                  </div>

                  <Button>Details</Button>
                </Card>
              </div>

              <div className="note-div">
                <strong>Notes</strong>
                <textarea
                  rows={3}
                  placeholder="Add a note for this conversation"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="note-div">
                <Button
                  style={{
                    background: "#fff",
                    border: "none",
                    color: "black",
                    width: "100%",
                  }}
                >
                  <FcAbout />
                  &nbsp;&nbsp; Report a problem
                </Button>
              </div>
            </div>
          </Col>

          <Col lg={10} className="chat-col">
            <div className="chat-detail-message-div">
              <div className="chat-main-div">
                <div>
                  <Row>
                    <div className="d-flex">
                      {/* <img
                      src="https://a0.muscache.com/im/pictures/user/727a7667-cf00-46ff-a030-a52f04d2961c.jpg?aki_policy=profile_x_medium"
                      alt="owner"
                      className="owner-image"
                    /> */}
                      <BsPersonCircle
                        style={{
                          fontSize: "35px",
                          marginRight: "20px",
                        }}
                      />
                      <h2>
                        {threadById?.guest?.first_name}{" "}
                        {threadById?.guest?.last_name}
                      </h2>
                    </div>
                  </Row>
                </div>

                <div
                  className="chat-message-div"
                  id="scrollableDiv"
                  style={{
                    height: "calc(100vh - 215px)",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                  onScroll={(e) => {
                    console.log("SDfsdf");
                    if (
                      e.target.scrollHeight ===
                      Math.abs(e.target.scrollTop) + e.target.clientHeight
                    ) {
                      fetchMoreData();
                    }
                  }}
                >
                  <div 
                    // dataLength={length?.items?.length}
                    // next={fetchMoreData}
                    style={{ display: "flex", flexDirection: "column-reverse" }}
                    // inverse={false}
                   
                    // hasMore={true}
                    // loader={<h4>Loading...</h4>}
                    // scrollableTarget="scrollableDiv"
                  >
                    {threadMessage?.map((obj, i) => {
                      return (
                        (obj?.user_id === id && (
                          <div className="senderMessage-div" key={i}>
                            <div className="sender-img">
                              <BsPersonCircle
                                style={{
                                  fontSize: "25px",
                                }}
                              />
                            </div>
                            <li className="senderMessage-li" key={i}>
                              {obj.content}
                            </li>
                          </div>
                        )) ||
                        (obj?.user_id === currentUser?.uid && (
                          <div className="iMessage-div">
                            <div className="i-img">
                              <BsPersonCircle
                                style={{
                                  fontSize: "25px",
                                }}
                              />
                            </div>
                            <li key={i} className="iMessage-li">
                              {obj.content}
                            </li>
                          </div>
                        ))
                      );
                    })}
                  </div>
                </div>
                <div ref={messageRef} />
              </div>

              <div>
                <Row className="text-message-input">
                  <div className="text-message-input-inner">
                    <Formik
                      initialValues={{ message: "" }}
                      onSubmit={async (values, { resetForm }) => {
                        const currentUserId = currentUser.uid;
                        const message = values?.message;
                        const data = { id, message, currentUserId };
                        await addMessages(data);
                        resetForm({
                          values: {
                            message: "",
                          },
                        });
                      }}
                    >
                      {({
                        values,
                        isSubmitting,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                      }) => (
                        <Form onSubmit={handleSubmit} className="d-flex w-100">
                          <FormControl
                            type="input"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="message"
                            value={values.message}
                            placeholder="Write a message or select a canned response"
                            style={{ border: "none", width: "100%" }}
                            className="message-input"
                            autoComplete="off"
                          />
                          <button
                            type="submit"
                            className="send-button"
                            disabled={isSubmitting}
                          >
                            Send
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Chat;
