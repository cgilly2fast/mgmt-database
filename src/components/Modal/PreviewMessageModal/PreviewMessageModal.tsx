import React from "react";
import { Modal } from "react-bootstrap";
import "./PreviewMessageModal.css";

interface PreviewMessageModalProps {
  showModel: boolean;
  value: any;
  setShowModel: (value: boolean) => void;
}

const PreviewMessageModal: React.FC<PreviewMessageModalProps> = ({
  showModel,
  value,
  setShowModel,
}: PreviewMessageModalProps) => {
  return (
    <Modal
      show={showModel}
      onHide={() => {
        setShowModel(false);
      }}
      dialogClassName="preview-modal"
    >
      <Modal.Body className="magical-body-modal">
        <div style={{ padding: "40px 32px" }}>
          <h5>Preview Message</h5>
          <span>
            See how this message will look in a real-life conversation
          </span>
          <div className="preview-wrapper">{value ? value : "preview... "}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PreviewMessageModal;
