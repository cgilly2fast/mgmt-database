import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { getAmenities, UpdateAmenities } from "../../API";
import { useParams } from "react-router-dom";
import { updateamenitiestype } from "../../API/Types";

interface UpdateAmenitiesModalProps {
  show: boolean;
  close: Function;
}

const UpdateAmenitiesModal: React.FC<UpdateAmenitiesModalProps> = ({
  show,
  close,
}: UpdateAmenitiesModalProps) => {
  const params = useParams();
  const { unitId } = params;
  const [amenities, setAmenities] = useState<updateamenitiestype[]>([]);

  useEffect(() => {
    const getAmenitiesData = async () => {
      if (unitId) {
        const amenitiesData = (await getAmenities(
          unitId
        )) as updateamenitiestype;
        setAmenities(Object.values(amenitiesData?.amenities));
      }
    };
    getAmenitiesData();
  }, []);

  const handleSubmit = async () => {
    await UpdateAmenities(unitId, amenities);
    console.log("update");
    close();
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        close();
      }}
      contentClassName="content-modal"
      dialogClassName="dialog-modal"
    >
      <Modal.Header closeButton>Update Amenities</Modal.Header>
      <Modal.Body style={{ display: "flex", flexWrap: "wrap" }}>
        {amenities?.map((item) => {
          return (
            <div className="d-flex" style={{ width: "33%" }} key={item?.name}>
              {item?.url ? (
                <img
                  src={item?.url}
                  style={{
                    background: "#f9f9f9",
                    width: "50px",
                    height: "50px",
                    padding: "0px 10px",
                    margin: "10px",
                  }}
                />
              ) : (
                <div
                  style={{
                    background: "#f9f9f9",
                    width: "50px",
                    height: "50px",
                    padding: "0px 10px",
                    margin: "10px",
                  }}
                ></div>
              )}
              <p
                style={{
                  alignSelf: "center",
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                {item?.name}
                <Form.Check
                  type="checkbox"
                  name={item?.name}
                  checked={item?.available}
                  onChange={(e) => {
                    e.target.checked
                      ? setAmenities((listOfAmenities) =>
                          listOfAmenities.map((obj) => {
                            return {
                              ...obj,
                              ...(obj?.name === e.target.name && {
                                available: true,
                              }),
                            };
                          })
                        )
                      : setAmenities((listOfAmenities) =>
                          listOfAmenities.map((obj) => {
                            return {
                              ...obj,
                              ...(obj?.name === e.target.name && {
                                available: false,
                              }),
                            };
                          })
                        );
                  }}
                />
              </p>
            </div>
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <button
          type="submit"
          className="btn btn-secondary"
          onClick={() => {
            close();
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => {
            handleSubmit();
          }}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateAmenitiesModal;
