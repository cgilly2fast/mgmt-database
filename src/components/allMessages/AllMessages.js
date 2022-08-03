import React, { useEffect, useState } from "react";
import { Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import "./AllMessages.css";
import { BsPersonCircle, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getThread } from "../../API";
import Loader from "../loader/Loader";

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

const AllMessages = () => {
  const [thread, setThread] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const getThreadsData = async () => {
      setLoading(true);
      const threadRef = await getThread();
      setThread(threadRef);
      setLoading(false);
    };
    getThreadsData();
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
            {thread?.map((item) => {
              return (
                <Row className="inbox-list-row">
                  <div className="inbox-list-inner-div">
                    <Form.Check
                      style={{ margin: "0px 10px", padding: "11px 0px" }}
                    />
                    <Link
                      to={`/inbox/thread/${item.id}`}
                      style={{
                        color: "black",
                        textDecoration: "none",
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      {/* <div className="d-flex" style={{width:"100%"}}> */}
                      <div className="d-flex image-div">
                        {/* <img
                          src="https://a0.muscache.com/im/pictures/user/727a7667-cf00-46ff-a030-a52f04d2961c.jpg?aki_policy=profile_x_medium"
                          alt="owner"
                          className="guest-image"
                        /> */}
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
                        {/* <br /> */}
                        <span className="descripation">
                          {item?.descripation
                            ? item?.descripation
                            : "Hi Addison! I hope that you have settled, and begun to unwind. Let me know if there is anything you need"}
                        </span>
                      </div>
                      <div className="d-flex image-div">
                        <img
                          src="https://a0.muscache.com/im/pictures/miso/Hosting-608638625001646805/original/665a5bc7-bd4e-4a8d-92f9-def45af46d03.jpeg?aki_policy=small"
                          alt="owner"
                          className="property-image"
                        />
                      </div>
                      <div className="guest-name-div">
                        <span>
                          {item?.filter_data
                            ? item?.filter_data
                            : "Check-in today"}
                        </span>
                        <br />
                        <span className="descripation">
                          {item?.unit_name ? item?.unit_name : "KV905A"}
                        </span>
                      </div>
                      <div>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-disabled">
                              July 29 2022
                            </Tooltip>
                          }
                        >
                          <p style={{ margin: "11px 0px" }}>an hour ago</p>
                        </OverlayTrigger>
                      </div>
                      {/* </div> */}
                    </Link>
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
