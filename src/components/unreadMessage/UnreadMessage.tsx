import React, { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import { BsPersonCircle, BsSearch } from "react-icons/bs";
import moment from "moment-timezone";
import "./UnreadMessage.css";
import db from "../../admin";
import { unreadmessgetype } from "../../API/Types";

const UnreadMessage: React.FC = () => {
  const [unreadMessages, setUnreadMessages] = useState([]);
  useEffect(() => {
    const getUnreadThreadDataOnSnapShot = async () => {
      db.collection("threads")
        .orderBy("last_message.created_at", "desc")
        .onSnapshot((doc) => {
          let tempData: any = [];
          doc.forEach((item) => {
            tempData.push({ ...item.data(), id: item?.id });
          });
          setUnreadMessages(tempData);
        });
    };
    getUnreadThreadDataOnSnapShot();
  }, []);

  return (
    <>
      <div className="main-div">
        <h4 className="all-message">Unread Messages</h4>
        <div className="search-bar">
          <Form.Control
            placeholder="Search for reservation code or guest name..."
            className="px-4 search-bar-input"
          />
          <BsSearch style={{ position: "absolute", margin: "0px 5px" }} />
        </div>
      </div>
      {unreadMessages?.map((item: unreadmessgetype) => {
        return (
          !item?.last_message?.isRead && (
            <div>
              <Row className="inbox-list-row">
                <div className="inbox-list-inner-div">
                  <Form.Check style={{ padding: "11px 0px" }} />
                  <div className="d-flex image-div">
                    <BsPersonCircle
                      style={{
                        fontSize: "30px",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                  <div className="guest-name-div">
                    <Row className="guest-name-row">
                      <span>{item?.guest?.first_name}</span>
                    </Row>
                    <span className="descripation">
                      {item?.last_message?.content}
                    </span>
                  </div>
                  <div>
                    <p style={{ margin: "11px 0px" }}>
                      {item?.last_message?.created_at &&
                        moment(
                          new Date(
                            item?.last_message?.created_at?.seconds * 1000
                          )
                        ).fromNow()}
                    </p>
                  </div>
                </div>
              </Row>
            </div>
          )
        );
      })}
    </>
  );
};

export default UnreadMessage;
