import React from "react";
import { Modal } from "react-bootstrap";
import { BsX } from "react-icons/bs";
import "./PropertiesListModal.css";
import { propertiesListtype } from "../../../API/Types";

interface PropertiesListModalProps {
  showPropertiesModel: boolean;
  setShowPropertiesModel: (value: boolean) => void;
  propertiesList: propertiesListtype;
}

const PropertiesListModal: React.FC<PropertiesListModalProps> = ({
  showPropertiesModel,
  setShowPropertiesModel,
  propertiesList,
}: PropertiesListModalProps) => {
  return (
    <Modal
      show={showPropertiesModel}
      onHide={() => {
        setShowPropertiesModel(false);
      }}
    >
      <Modal.Body className="properties-modal">
        <div>
          <div
            className="d-flex justify-content-between"
            style={{ marginBottom: "20px" }}
          >
            <h5 style={{ fontSize: "1.25em" }}>
              Properties for {propertiesList?.name}
            </h5>
            <BsX
              style={{ width: "1.5em", height: "1.5em", cursor: "pointer" }}
              onClick={() => {
                setShowPropertiesModel(false);
              }}
            />
          </div>
          <div>
            {propertiesList?.units?.map((item, i) => {
              return (
                <div key={i} className="properties-list-wrapper-modal">
                  <img
                    src={item?.unit_picture}
                    className="properties-list-img"
                  />
                  <span>{item?.unit_name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PropertiesListModal;
