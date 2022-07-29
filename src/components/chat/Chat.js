import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
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
  BsPiggyBank,
} from "react-icons/bs";
import { FcAbout } from "react-icons/fc";
import moment from "moment-timezone";

const Chat = (props) => {
  return (
    <>
      <Row>
        <Col lg={2} style={{ padding: "0px" }}>
          <div className="reservation-detail-main-div">
            <div className="back-button" onClick={() => props.history.goBack()}>
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
                <FcAbout />&nbsp;&nbsp;
                Report a problem
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={10}>
          <div className="chat-main-div">
            <div>
              <Row>
                <div className="d-flex">
                  <img
                    src="https://a0.muscache.com/im/pictures/user/727a7667-cf00-46ff-a030-a52f04d2961c.jpg?aki_policy=profile_x_medium"
                    className="owner-image"
                  />
                  <h2>Devan</h2>
                </div>
              </Row>
            </div>
            <div>
              <Row className="text-message-input">
                <div className="text-message-input-inner">
                  <Form.Control
                    placeholder="Write a message or select a canned response"
                    style={{ border: "none", width: "70%" }}
                    className="send-message-input"
                  />
                  <Button className="send-button">Send</Button>
                </div>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Chat;
