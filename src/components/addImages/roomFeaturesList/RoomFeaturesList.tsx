import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Form, Modal, Spinner } from "react-bootstrap";
import "./RoomFeaturesList.css";
import bedTypes from "../StaticData/bedType.json";
import roomFeatures from "../StaticData/roomFeature.json";
import { useParams } from "react-router-dom";
import {
  removePhoto,
  removePhotos,
  removeRoom,
  removeRoomBedFetures,
  removeRoomFetures,
  setRoomBedFetures,
  setRoomFetures,
  uploadImages,
} from "../../../API";
import { BsTrash } from "react-icons/bs";
import { db } from "../../../config/firebase";

const RoomFeaturesList: React.FC = () => {
  const hiddenFileInputAllPhotos = useRef<any>();
  const [multiImages, setMultiImages] = useState<any>([]);
  const [show, setShow] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadloading, setUploadLoading] = useState<boolean>(false);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(false);
  const [roomValues, setRoomValues] = useState<any>([]);
  const [roomid, setRoomid] = useState("");
  const [deleteRoomId, setDeleteRoomId] = useState("");
  const [deleteRoomDetail, setDeleteRoomDetail] = useState("");
  const [optionBed] = useState(bedTypes);
  const [optionRoom] = useState(roomFeatures);
  const { unitId } = useParams();

  const handleClose = () => {
    setShow(false);
    setMultiImages([]);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    getRoomFeaturesBySanpshot();
  }, []);

  const getRoomFeaturesBySanpshot = async () => {
    await db
      .collection("photos")
      .doc(unitId)
      .onSnapshot(async (data: any) => {
        if (data.data() && Object.entries(data.data())) {
          const withOutCoverImage = Object.entries(data.data()).filter(
            (item: any) => item[1]?.list_name !== "cover_image"
          );
          if (withOutCoverImage) {
            const sortValue = withOutCoverImage
              .filter((item: any) => item[1]?.list_name)
              .sort((a: any, b: any) => {
                return a[1]?.list_name?.localeCompare(b[1].list_name);
              });
            await setRoomValues(sortValue);
          }
        }
      });
  };

  const handleClickAllPhotos = (e: {
    target: { id: React.SetStateAction<string> };
  }) => {
    setRoomid(e.target.id);
    hiddenFileInputAllPhotos.current.click();
  };

  const handleMultiSelectImage = async (e: any) => {
    setMultiImages(Object.entries(e.target.files));
    handleShow();
  };

  const handleRemove = async (e: { target: { id: string } }) => {
    setLoading(true);
    let tempdata: any = [];
    multiImages.map((item: any) => {
      if (item[0] !== e.target.id) {
        tempdata.push(item[1]);
      }
    });
    if (tempdata) {
      setMultiImages(Object.entries(tempdata));
    } else {
      setMultiImages(null);
    }

    setLoading(false);
  };

  const reloadPage = async () => {
    await getRoomFeaturesBySanpshot();
  };

  const handleRemoveBed = async (
    id: string | undefined,
    roomId: string,
    value: string
  ) => {
    await removeRoomBedFetures(id, roomId, value);
  };

  const handleRemoveRoom = async (
    id: string | undefined,
    roomId: string,
    value: string
  ) => {
    setLoadingRoom(true);
    await removeRoomFetures(id, roomId, value);
    setLoadingRoom(false);
  };

  const handleSubmit = async () => {
    setUploadLoading(true);
    const response = await uploadImages(
      unitId,
      multiImages,
      roomid,
      reloadPage
    );
    if (response) {
      await handleClose();
      setUploadLoading(false);
    }
  };

  const handleDelete = async () => {
    if (unitId && deleteRoomId) {
      const response = await removeRoom(
        unitId,
        deleteRoomId,
        reloadPage,
        deleteRoomDetail
      );
      if (response) {
        setShowDelete(false);
      }
    }
  };

  const selectOption = async (e: { target: { id: string; value: string } }) => {
    if (unitId && e.target.id && JSON.parse(e.target.value)) {
      await setRoomFetures(unitId, e.target.id, JSON.parse(e.target.value));
    }
  };

  const selectOptionBed = async (e: { target: { id: string; value: string } }) => {
    if (unitId && e.target.id && JSON.parse(e.target.value)) {
      await setRoomBedFetures(unitId, e.target.id, JSON.parse(e.target.value));
    }
  };

  const handleRemovePhotos = async (ele: string, roomId: string) => {
    if (window.confirm("Are you sure delete this Image")) {
      await removePhoto(unitId, roomId, reloadPage, ele);
    }
  };

  return (
    <div className="main-list-wrapper">
      <Accordion flush>
        {roomValues?.map((item: object, i: any) => {
          return (
            <Accordion.Item
              eventKey={i}
              className="accordian-item-wrapper"
              key={i}
            >
              <Accordion.Header
                className={`${
                  !item[1]?.photos?.length
                    ? "accordian-header-wrapper"
                    : "accordian-header-wrapper2"
                }`}
              >
                <div>
                  <h5 style={{ fontWeight: "600" }}>{item[1]?.title}</h5>
                  {!item[1]?.photos?.length ? (
                    <div>
                      <h6 className="incomplete">INCOMPLETE</h6>
                      <span className="incomplete-span">
                        Please add at least one photos to this room.
                      </span>
                    </div>
                  ) : (
                    <h6 className="complete">COMPLETE</h6>
                  )}
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordian-body-wrapper">
                {item[1]?.have_bed && (
                  <div style={{ marginBottom: "10px" }}>
                    <h6 style={{ fontWeight: "600" }}>Bed Types</h6>
                    <div className="d-flex">
                      <Form.Select
                        className="room-features-select"
                        defaultValue="Add bed"
                        id={item[0]}
                        onChange={selectOptionBed}
                      >
                        <option disabled selected>
                          Add bed
                        </option>
                        {optionBed?.map((element, i) => {
                          return (
                            <option
                              value={JSON.stringify(element)}
                              key={`12${i}`}
                            >
                              {element?.text}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {roomValues?.map((obj: object , i: any) => {
                          return (
                            <div key={`23${i}`}>
                              {obj[1]?.bed_type?.map(
                                (itemList: any, index: any) => {
                                  return obj[0] === item[0] ? (
                                    <div
                                      key={`20${index}`}
                                      className="room-feature-wrapper "
                                    >
                                      {itemList?.text}
                                      <p
                                        className="cross-mark"
                                        id={obj[0]}
                                        // value={itemList}
                                        onClick={() => {
                                          handleRemoveBed(
                                            unitId,
                                            obj[0],
                                            itemList
                                          );
                                        }}
                                      >
                                        X
                                      </p>
                                    </div>
                                  ) : null;
                                }
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                <h6 style={{ fontWeight: "600" }}>Room features</h6>
                <div className="d-flex">
                  <Form.Select
                    className="room-features-select"
                    id={item[0]}
                    onChange={selectOption}
                  >
                    <option disabled selected>
                      Add highlight
                    </option>
                    {optionRoom?.map((ele, i) => {
                      return (
                        <option
                          value={JSON.stringify(ele)}
                          key={`30${ele?.id}`}
                        >
                          {ele?.text}
                        </option>
                      );
                    })}
                  </Form.Select>
                  {loadingRoom && (
                    <Spinner animation="border" size="sm" variant="primary" />
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {roomValues?.map((obj: object, i: any) => {
                      return (
                        <div key={`90${i}`}>
                          {obj[1]?.room_feature?.map(
                            (itemList: any, index: any) => {
                              return obj[0] === item[0] ? (
                                <div
                                  key={`50${index}`}
                                  className="room-feature-wrapper "
                                >
                                  {itemList?.text}
                                  <p
                                    className="cross-mark"
                                    id={obj[0]}
                                    // value={itemList}
                                    onClick={() => {
                                      handleRemoveRoom(
                                        unitId,
                                        obj[0],
                                        itemList
                                      );
                                    }}
                                  >
                                    X
                                  </p>
                                </div>
                              ) : null;
                            }
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="selected-photos-wrapper">
                  <h6 style={{ fontWeight: "600" }}>Photos</h6>
                  <>
                    <button
                      type="button"
                      id={item[0]}
                      onClick={(e: any) => {
                        handleClickAllPhotos(e);
                      }}
                      style={{
                        padding: "5px 10px",
                      }}
                      className="add-photos-button"
                    >
                      Add Photos
                    </button>
                    <input
                      type="file"
                      multiple={true}
                      name="image"
                      onChange={(e) => {
                        handleMultiSelectImage(e);
                      }}
                      accept="image/png, image/gif, image/jpeg, image/webp, image/jpg"
                      ref={hiddenFileInputAllPhotos}
                      style={{
                        visibility: "hidden",
                        display: "none",
                      }}
                    />
                  </>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {!item[1]?.photos?.length ? (
                    <h4>No Photos</h4>
                  ) : (
                    item[1]?.photos?.map((ele: any, i: any) => {
                      return (
                        <div
                          key={i}
                          style={{
                            position: "relative",
                            display: "flex",
                          }}
                        >
                          <img
                            src={ele?.original}
                            alt="room-images"
                            width={250}
                            height={200}
                            style={{ padding: "10px", borderRadius: "15px" }}
                          />
                          <div
                            className="cross-button"
                            onClick={() => {
                              handleRemovePhotos(ele, item[0]);
                            }}
                          >
                            X
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div style={{ borderTop: "1px solid lightgray" }}>
                  <div
                    className="accordian-footer-wrappper"
                    id={item[0]}
                    onClick={() => {
                      setShowDelete(true);
                      setDeleteRoomId(item[0]);
                      setDeleteRoomDetail(item[1]);
                    }}
                  >
                    Remove {item[1]?.title}
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      {multiImages.length && show ? (
        <Modal
          show={show}
          onHide={handleClose}
          style={{ top: "200px" }}
          dialogClassName="images-modal"
        >
          <Modal.Body>
            {!loading ? (
              <div
                style={{
                  flexDirection: "row",
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {multiImages?.map((item: (Blob | MediaSource)[], i: any) => {
                  return (
                    <>
                      <div key={i}>
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <img
                            src={URL.createObjectURL(item[1])}
                            style={{
                              width: "240px",
                              height: "180px",
                              margin: "0px 0px 10px 10px",
                              borderRadius: "10px",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              right: "15px",
                              top: "5px",
                              color: "#fff",
                              cursor: "pointer",
                            }}
                            id={i}
                            // name={i}
                            onClick={(e: any) => {
                              handleRemove(e);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            ) : (
              <Spinner animation="border" size="sm" />
            )}
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "flex-start" }}>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={uploadloading}
            >
              Save{" "}
              {uploadloading ? (
                <Spinner animation="border" size="sm" variant="light" />
              ) : (
                ""
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}

      <Modal
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
        }}
      >
        <Modal.Header className="delete-modal-header">
          <Modal.Title>
            <div style={{ textAlign: "center" }}>
              <BsTrash />
              <p>Delete Room</p>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ alignSelf: "center" }}>
          <p>Delete room will permanently remove it from your library.</p>
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={() => {
                setShowDelete(false);
              }}
              className="m-1"
              style={{
                background: "#fff",
                border: "1px solid lightgray",
                color: "black",
              }}
            >
              No, Keep Room
            </Button>
            <Button
              onClick={handleDelete}
              className="m-1"
              style={{ background: "#ff0036", border: "none" }}
            >
              Yes, Delete Room
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RoomFeaturesList;
