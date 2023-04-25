import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import RoomFeaturesList from "../roomFeaturesList/RoomFeaturesList";
import "./Addroom.css";
import addRoomFeatures from "../StaticData/addRoomFeatures.json";
import { setRoom } from "../../../API";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../loader/Loader";
import CoverImage from "../coverImage/CoverImage";
import BackWithTitle from "../backWithTitle/BackWithTitle";
import db from "../../../admin";

const Addroom: React.FC = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentValue, setCurrentValue] = useState<any>([]);
  const [roomLengthValue, setRoomLengthValue] = useState<any>([]);
  const [data, setData] = useState(addRoomFeatures);
  const [dataCount, setDataCount] = useState<any>([]);
  const [newChange, setNewChange] = useState<any>([]);
  const { unitId } = useParams();
  const navigate = useNavigate();

  console.log("currentValue",currentValue);

  useEffect(() => {
    getRoomData();
  }, []);

  const getRoomData = async () => {
    console.log("124");
    setLoading(true);
    const unitsRef = await db.collection("units").doc(unitId).get();
    if (unitsRef?.data()) {
      db.collection("photos")
        .doc(unitId)
        .onSnapshot(async (snapshot: any) => {
          if (snapshot?.data()) {
            const withOutCoverImage = Object.entries(snapshot.data()).filter(
              (item: any) => item[1]?.list_name !== "cover_image"
            );
            if (withOutCoverImage) {
              const changeData = addRoomFeatures.map((e) => {
                return {
                  ...e,
                  count: withOutCoverImage?.filter(
                    (a: any) => a[1]?.list_name === e.name
                  ).length,
                };
              });
              setData(changeData);
              setDataCount(changeData);
              console.log("changeData", changeData);
              const map = withOutCoverImage?.reduce((obj: any, b: any) => {
                obj[b[1]?.list_name] = ++obj[b[1]?.list_name] || 1;
                return obj;
              }, {});
              if (Object.keys(map)[0] !== String(undefined)) {
                const sortValue = Object.entries(map)?.sort((a, b) => {
                  return a[0]?.localeCompare(b[0]);
                });
                setRoomLengthValue(sortValue);
                const sortValueWithOutCoverImage = withOutCoverImage?.sort(
                  (a: any, b: any) => {
                    return a[1]?.title?.localeCompare(b[1]?.title);
                  }
                );
                setCurrentValue(sortValueWithOutCoverImage);
              }
            }
          }
        });
    } else {
      navigate("/units");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShow(false);
    setData(dataCount);
  };
  const handleShow = () => {
    setShow(true);
    setNewChange([]);
  };

  const handleSubmit = async () => {
    await setRoom(unitId, newChange);
    setShow(false);
    getRoomData();
  };

  const updateFieldChanged = (ele: {
    id?: number;
    title: string;
    name?: string;
    count: any;
    isbedroom?: boolean;
    type?: string;
  }) => {
    if (ele?.count === 0) {
      setNewChange((list: any) => {
        return [...list, ele];
      });
    } else {
      setNewChange((list: any) => {
        return [
          ...list,
          {
            ...ele,
            title: ele?.title + " " + (ele?.count + 1),
            count: ele?.count + 1,
          },
        ];
      });
    }
  };

  const updateFieldValue = async (element: {
    id?: number;
    title?: string;
    name: any;
    count: any;
    isbedroom?: boolean;
    type?: string;
  }) => {
    await dataCount.filter(async (item: { name: any; count: any }) => {
      if (element?.name === item.name && element?.count !== item.count) {
        setData((list) =>
          list.map((obj) => {
            return {
              ...obj,
              ...(obj.name === element?.name && {
                count: obj.count - 1,
              }),
            };
          })
        );
      }
    });
    const filterData = await newChange?.filter((ele: { count: any }) => {
      return ele.count !== (element.count === 1 ? 0 : element.count);
    });
    setNewChange(filterData);
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <BackWithTitle />
          <CoverImage />
          {currentValue.length ? (
            <div className="addroom-wrapper">
              <div className="listing-div">
                {roomLengthValue?.map(
                  (item: any[], i: React.Key | null | undefined) => {
                    return (
                      <li style={{ padding: "0px 20px" }} key={i}>
                        {item[0].charAt(0).toUpperCase() + item[0]?.slice(1)}
                        {item[1] !== 1 ? ` (${item[1]})` : ""}
                      </li>
                    );
                  }
                )}
              </div>
              <div
                className="addroom-button"
                onClick={() => {
                  handleShow();
                }}
              >
                Add rooms
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-center">
                <div className="no-room-inner-wrapper">
                  <div
                    className="addroom-button"
                    onClick={() => {
                      handleShow();
                    }}
                  >
                    Add rooms
                  </div>
                  <h2>No Room</h2>
                </div>
              </div>
            </>
          )}
          <RoomFeaturesList />

          <Modal
            show={show}
            onHide={handleClose}
            style={{ top: "100px" }}
            dialogClassName="add-room-modal-dialog"
          >
            <Modal.Body className="add-room-modal-body">
              <div className="indoor-div">
                <h5 className="room-type-title">Indoor</h5>
                {data?.map((element, i) => {
                  return (
                    <div key={`1${i}`}>
                      {element?.type === "Indoor" && (
                        <div className="room-list-wrapper">
                          <p>{element?.title}</p>
                          <div>
                            <button
                              className="plus-minus"
                              name={element.name}
                              value={element.count}
                              onClick={(e) => {
                                if (element?.count > 0) {
                                  updateFieldValue(element);
                                }
                              }}
                            >
                              -
                            </button>
                            {element?.count}
                            <button
                              name={element?.name}
                              className="plus-minus"
                              onClick={(e: any) => {
                                setData((list) =>
                                  list.map((obj) => {
                                    return {
                                      ...obj,
                                      ...(obj.name === e.target.name && {
                                        count: obj.count + 1,
                                      }),
                                    };
                                  })
                                );
                                updateFieldChanged(element);
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="outer-div">
                <h5 className="room-type-title">Outdoor</h5>
                {data?.map((element, i) => {
                  return (
                    <div key={`2${i}`}>
                      {element?.type === "Outdoor" && (
                        <div className="room-list-wrapper">
                          <p>{element?.title}</p>
                          <div>
                            <button
                              className="plus-minus"
                              name={element.name}
                              onClick={(e) => {
                                if (element?.count > 0) {
                                  updateFieldValue(element);
                                }
                              }}
                            >
                              -
                            </button>
                            {element?.count}
                            <button
                              name={element?.name}
                              className="plus-minus"
                              onClick={(e: any) => {
                                setData((list) =>
                                  list.map((obj) => {
                                    return {
                                      ...obj,
                                      ...(obj.name === e.target.name && {
                                        count: obj.count + 1,
                                      }),
                                    };
                                  })
                                );
                                updateFieldChanged(element);
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "flex-start" }}>
              <Button variant="primary" onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Addroom;
