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

// const chat = {
//   results: [
//     {
//       sender_name: "Devan",
//       reciever_name: "Colby Gilbert",
//       message:
//         "hello 1fdsffdsfsfdfdsgffdfasfashhdsdsdgdsddi eedjdsjdlkkl dadjkhasdkjshdkdhkdfhf ddkjsadklsjkljd dljkdljdlaj djkfljfdk",
//     },
//     {
//       sender_name: "Colby Gilbert",
//       reciever_name: "Devan",
//       message:
//         "hello 2 hello 1fdsffdsfsfdfdsgffdfasfashhdsdsdgdsddi eedjdsjdlkkl dadjkhasdkjshdkdhkdfhf sdsadasdasdasd dasd wdasd adas dd   dsdsddddsd dad d asddadsadas",
//     },

//     {
//       sender_name: "Colby Gilbert",
//       reciever_name: "Devan",
//       message: "message to Devan",
//     },
//     {
//       sender_name: "Devan",
//       reciever_name: "Colby Gilbert",
//       message: "message to Colby Gilbert",
//     },
//     {
//       sender_name: "Colby Gilbert",
//       reciever_name: "Devan",
//       message: "message to Devan",
//     },
//     {
//       sender_name: "Devan",
//       reciever_name: "Colby Gilbert",
//       message: "hello 1",
//     },
//     {
//       sender_name: "Colby Gilbert",
//       reciever_name: "Devan",
//       message: "hello 2",
//     },

//     {
//       sender_name: "Colby Gilbert",
//       reciever_name: "Devan",
//       message: "message to Devan",
//     },
//     {
//       sender_name: "Devan",
//       reciever_name: "Colby Gilbert",
//       message: "message to Colby Gilbert",
//     },
//     {
//       sender_name: "Colby Gilbert",
//       reciever_name: "Devan",
//       message: "message to Devan",
//     },
//     {
//       sender_name: "Devan",
//       reciever_name: "Colby Gilbert",
//       message: "hello 1",
//     },
//     {
//       sender_name: "Colby Gilbert",
//       reciever_name: "Devan",
//       message: "hello 2",
//     },

//     {
//       sender_name: "Colby Gilbert",
//       reciever_name: "Devan",
//       message: "message to Devan",
//     },
//     {
//       sender_name: "Devan",
//       reciever_name: "Colby Gilbert",
//       message: "message to Colby Gilbert",
//     },
//     {
//       sender_name: "Colby Gilbert",
//       reciever_name: "Devan",
//       message: "message to Devan",
//     },
//   ],
// };

const Chat = (props) => {
  const [threadById, setThreadById] = useState();
  const [threadMessage, setThreadMessage] = useState([]);
  const [loading, setLoading] = useState();
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

  useEffect(() => {
    const getThreadData = async () => {
      await db
        .collection("threads")
        .doc(id)
        .collection("messages")
        .orderBy("created_at")
        .onSnapshot((doc) => {
          let tempData = [];
          doc.forEach((item) => {
            tempData.push(item.data());
          });
          setThreadMessage(tempData);
        });
    };
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
          <Col lg={2} style={{ padding: "0px" }} className="reservation-col">
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

                <div className="chat-message-div">
                  {threadMessage?.map((obj, i) => {
                    return (
                      (obj.user_id === id && (
                        <div className="senderMessage-div" key={i}>
                          <div className="sender-img">
                            {/* <img
                            src="https://a0.muscache.com/im/pictures/user/727a7667-cf00-46ff-a030-a52f04d2961c.jpg?aki_policy=profile_x_medium"
                            alt="owner"
                            style={{
                              maxWidth: "40px",
                              maxHeight: "40px",
                              borderRadius: "50%",
                            }}
                          /> */}
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
                      (obj.user_id === currentUser.uid && (
                        <div className="iMessage-div">
                          <div className="i-img">
                            {/* <img
                            src="https://a0.muscache.com/im/pictures/user/c1569b4e-8b69-4425-9ddf-67a15df6f5c3.jpg?aki_policy=profile_x_medium"
                            alt="owner"
                            style={{
                              maxWidth: "40px",
                              maxHeight: "40px",
                              borderRadius: "50%",
                            }}
                          /> */}
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
