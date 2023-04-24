import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Modal, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  makeIsCurrent,
  removeCoverPhoto,
  uploadCoverImages,
} from "../../../API";
import "./CoverImage.css";
import { db } from "../../../config/firebase";

const CoverImage = () => {
  const hiddenFileInputAllPhotos = useRef<any>();
  const [multipalImage, setMultipalImage] = useState<any>([]);
  const [coverIamge, setCoverImage] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { unitId } = useParams();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getPhtotsData();
  }, []);

  const getPhtotsData = async () => {
    await db
      .collection("units")
      .doc(unitId)
      .onSnapshot(async (data) => {
        if (data?.data()?.picture?.length) {
          await setCoverImage(data?.data()?.picture);
        }
      });
  };

  const handleClickAllPhotos = async () => {
    hiddenFileInputAllPhotos.current.click();
  };

  const handleMultiSelectImage = async (e: any) => {
    const MAX_LENGTH = 4;
    if (
      Array.isArray(coverIamge) &&
      coverIamge?.length + Array.from(e.target.files).length > MAX_LENGTH
    ) {
      e.preventDefault();
      alert(`Cannot upload files more than ${MAX_LENGTH}`);
      return;
    } else {
      setMultipalImage(Object.entries(e.target.files));
      if (e.target.files) {
        handleShow();
      }
    }
  };

  const handleRemove = async (e: any) => {
    setLoading(true);
    let tempdata: any = [];
    multipalImage?.map((item: any[]) => {
      if (item[0] !== e.target.id) {
        tempdata.push(item[1]);
      }
    });
    if (tempdata.length) {
      setMultipalImage(Object.entries(tempdata));
    } else {
      setMultipalImage(null);
      handleClose();
    }
    setLoading(false);
  };

  const reloadPhoto = async () => {
    await getPhtotsData();
  };

  const handleSubmit = async () => {
    setUploadLoading(true);
    await uploadCoverImages(
      unitId,
      multipalImage,
      reloadPhoto,
      handleClose,
      setUploadLoading
    );
  };

  const handleRemovePhotos = async (ele: any) => {
    if (coverIamge?.length === 1) {
      window.alert("Maximum 1 image required");
    } else if (ele?.isCurrent === true) {
      window.alert(
        "The current image does not delete then change the current image after remove"
      );
    } else {
      if (window.confirm("Are you sure delete this Image")) {
        await removeCoverPhoto(unitId, reloadPhoto, ele);
      }
    }
  };

  const makeCurrent = async (data: any[], imageId: number) => {
    await makeIsCurrent(unitId, data, imageId, reloadPhoto);
  };

  return (
    <div className="main-cover-wrapper">
      <div>
        {/* {!coverIamge.length ? ( */}
        {/* <div className="d-flex justify-content-center">
            <button
              className="add-cover-images-button"
              onClick={handleAddCover}
            >
              Add Cover
            </button>
          </div> */}
        {/* ) : ( */}
        <Accordion flush>
          <Accordion.Item
            eventKey={`${0}`}
            className="accordian-item-wrapper"
            key={0}
          >
            <Accordion.Header
              className={`${
                !Array.isArray(coverIamge)
                  ? "accordian-header-wrapper"
                  : "accordian-header-wrapper2"
              }`}
            >
              <div>
                <h5 style={{ fontWeight: "600" }}>Cover Image</h5>
                {!Array.isArray(coverIamge) ? (
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
              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {!Array.isArray(coverIamge) ? (
                    <h4>No photos</h4>
                  ) : (
                    Array.isArray(coverIamge) &&
                    coverIamge?.map((item: any, i) => {
                      return (
                        <div key={i} className="container-wrapper">
                          <img
                            src={item?.original}
                            alt="room-images"
                            width={250}
                            height={200}
                            style={{
                              padding: "10px",
                              borderRadius: "15px",
                            }}
                            className={`!${item?.isCurrent && "image-covers"}`}
                          />
                          <div
                            className="cross-button"
                            onClick={() => {
                              handleRemovePhotos(item);
                            }}
                          >
                            X
                          </div>
                          {!item?.isCurrent ? (
                            <div className="middle">
                              <div
                                className="text"
                                onClick={() => {
                                  makeCurrent(coverIamge, i);
                                }}
                              >
                                Current
                              </div>
                            </div>
                          ) : (
                            <div className="middle-without-hover">
                              <div className="current-text">Current</div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <div>
                  <button
                    id={coverIamge}
                    className="add-cover-images-button"
                    onClick={handleClickAllPhotos}
                  >
                    Add Cover Images
                  </button>
                  <input
                    type="file"
                    style={{ visibility: "hidden", display: "none" }}
                    ref={hiddenFileInputAllPhotos}
                    onChange={handleMultiSelectImage}
                    accept="image/png, image/gif, image/jpeg, image/webp, image/jpg"
                    multiple={true}
                    max={4}
                    maxLength={4}
                  />
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {/* )} */}
      </div>

      <Modal show={show} onHide={handleClose} dialogClassName="images-modal">
        <Modal.Body>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <div
              style={{
                flexDirection: "row",
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {multipalImage?.map((item: (Blob | MediaSource)[], i: any) => {
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
                            cursor: "pointer",
                            background: "#fff",
                            width: "20px",
                            height: "20px",
                            textAlign: "center",
                            borderRadius: "50%",
                          }}
                          id={i}
                          // name={i}
                          onClick={handleRemove}
                        >
                          X
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={uploadLoading}
          >
            Save{" "}
            {uploadLoading ? (
              <Spinner animation="border" size="sm" variant="light" />
            ) : null}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoverImage;
