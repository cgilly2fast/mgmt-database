import React, { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import "./AllMessages.css";
import { BsPersonCircle, BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import moment from "moment-timezone";
import db from "../../admin";
import { Allmessagestype } from "../../API/Types";

// const mailList = [
//   {
//     id: "1",
//     guest_img:
//       "https://a0.muscache.com/im/pictures/user/727a7667-cf00-46ff-a030-a52f04d2961c.jpg?aki_policy=profile_x_medium",
//     guest_name: "Devan",
//     descripation:
//       "Hi Addison! I hope that you have settled, and begun to unwind. Let me know if there is anything you need or if I can assist you in any way. Please note there is a switch under the counter as you wa...",
//     property_image:
//       "https://a0.muscache.com/im/pictures/miso/Hosting-608638625001646805/original/665a5bc7-bd4e-4a8d-92f9-def45af46d03.jpeg?aki_policy=small",
//     filter_data: "Check-in today",
//     unit_name: "KV905A",
//   },
//   {
//     id: "2",
//     guest_img:
//       "https://a0.muscache.com/im/pictures/user/727a7667-cf00-46ff-a030-a52f04d2961c.jpg?aki_policy=profile_x_medium",
//     guest_name: "Devan",
//     descripation:
//       "Hi Addison! I hope that you have settled, and begun to unwind.Let me know if there is anything you need or if I can assist you in any way.",
//     property_image:
//       "https://a0.muscache.com/im/pictures/miso/Hosting-608638625001646805/original/665a5bc7-bd4e-4a8d-92f9-def45af46d03.jpeg?aki_policy=small",
//     filter_data: "Check-in today",
//     unit_name: "KV905A",
//   },
// ];

const AllMessages: React.FC = () => {
  const navigate = useNavigate();
  const [thread, setThread] = useState<Allmessagestype[]>([]);
  const [loading, setLoading] = useState();

  // useEffect(() => {
  //   const getThreadsData = async () => {
  //     setLoading(true);
  //     const threadRef = await getThread();
  //     setThread(threadRef);
  //     setLoading(false);
  //   };
  //   getThreadsData();
  // }, []);

  useEffect(() => {
    const getThreadDataOnSnapShot = async () => {
      db.collection("threads")
        .orderBy("last_message.created_at", "desc")
        .onSnapshot((doc) => {
          let tempData: Allmessagestype[] = [];
          doc.forEach((item: any) => {
            tempData.push({ ...item.data(), id: item?.id });
          });
          setThread(tempData);
        });
    };
    getThreadDataOnSnapShot();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="main-div">
            <h4 className="all-message">All Messages</h4>
            <div className="search-bar">
              <Form.Control
                placeholder="Search for reservation code or guest name..."
                className="px-4 search-bar-input"
              />
              <BsSearch style={{ position: "absolute", margin: "0px 5px" }} />
            </div>
          </div>
          <div>
            {thread?.map((item: Allmessagestype) => {
              return (
                <Row
                  className="inbox-list-row"
                  onClick={() => {
                    navigate(`/inbox/thread/${item?.id}`, {
                      // id: item?.id,
                      // content: item?.last_message?.content,
                      // created_at: moment(
                      //   new Date(item?.last_message?.created_at._seconds * 1000)
                      // ).fromNow(),
                    });
                  }}
                  style={{
                    background: !item?.last_message?.isRead
                      ? "#eaf4ff"
                      : "#fff",
                  }}
                >
                  <div className="inbox-list-inner-div">
                    <Form.Check
                      style={{ margin: "0px 10px", padding: "11px 0px" }}
                    />
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
                        {!item?.last_message?.isRead ? (
                          <span>
                            <b> {item?.guest?.first_name}</b>
                          </span>
                        ) : (
                          <span>{item?.guest?.first_name}</span>
                        )}
                      </Row>
                      <span className="descripation">
                        {!item?.last_message?.isRead ? (
                          <span>
                            <b>
                              {item?.last_message?.content &&
                                item?.last_message?.content}
                            </b>
                          </span>
                        ) : (
                          <span>
                            {item?.last_message?.content &&
                              item?.last_message?.content}
                          </span>
                        )}
                      </span>
                    </div>
                    <div>
                      <p style={{ margin: "11px 0px" }}>
                        {item?.last_message?.created_at &&
                          moment(
                            new Date(
                              item?.last_message?.created_at.seconds * 1000
                            )
                          ).fromNow()}
                      </p>
                    </div>
                  </div>
                </Row>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default AllMessages;
