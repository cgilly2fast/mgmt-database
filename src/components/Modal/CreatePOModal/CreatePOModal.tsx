import { ErrorMessage, Formik } from "formik";
import React, { useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { updatePONumber } from "../../../API";
import { FaCopy } from "react-icons/fa";
import "./CreatePOModal.css";

interface CreatePOModalProps {
  setShowPOModel: (value: boolean) => void;
  showPOModel: boolean;
  currentPONumber: any;
  getPONumber: object;
}

const CreatePOModal: React.FC<CreatePOModalProps> = ({
  setShowPOModel,
  showPOModel,
  currentPONumber,
  getPONumber,
}: CreatePOModalProps) => {
  const [loading, setLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);

  const poModalValidationSchema = Yup.object().shape({
    po_number: Yup.string().required("PO number is required"),
    did_you_are_this_no: Yup.string().required(
      "Select one of the above button"
    ),
  });

  function copy(text) {
    setCopyLoading(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setCopyLoading(false);
    }, 1000);
  }

  return (
    <Modal
      show={showPOModel}
      onHide={() => {
        setShowPOModel(false);
      }}
    >
      <Modal.Header>
        <h3>Create PO</h3>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Formik
            initialValues={{
              po_number: currentPONumber,
              did_you_are_this_no: "",
            }}
            enableReinitialize
            validationSchema={poModalValidationSchema}
            onSubmit={async (values) => {
              setLoading(true);
              if (values?.did_you_are_this_no === "yes") {
                await updatePONumber(values?.po_number, getPONumber);
              }
              setLoading(false);
              setShowPOModel(false);
            }}
          >
            {({
              touched,
              errors,
              handleSubmit,
              handleChange,
              setFieldValue,
              handleBlur,
              values,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                  <Form.Label>New PO number</Form.Label>
                  <div className="po_input_wrapper">
                    <div className="copy-icon">
                      {copyLoading ? (
                        <Spinner size="sm" animation="border" variant="dark" />
                      ) : (
                        <FaCopy
                          onClick={() => {
                            copy(values?.po_number);
                          }}
                        />
                      )}
                    </div>

                    <Form.Control
                      placeholder="0000"
                      name="po_number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled
                      value={values?.po_number}
                      className={`${
                        touched?.po_number && errors?.po_number
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    component="div"
                    name="po_number"
                    className="invalid-feedback"
                  />
                </div>
                <div>
                  <Form.Label>Did you are this number?</Form.Label>
                  <div className="d-flex">
                    <Form.Check
                      type="radio"
                      id="yes"
                      label="Yes"
                      name="did_you_are_this_no"
                      checked={values?.did_you_are_this_no === "yes"}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFieldValue("did_you_are_this_no", e.target.id);
                        }
                      }}
                      onBlur={handleBlur}
                      value={values?.did_you_are_this_no}
                      className={`${
                        touched?.did_you_are_this_no &&
                        errors?.did_you_are_this_no
                          ? "is-invalid"
                          : ""
                      }`}
                    />

                    <Form.Check
                      type="radio"
                      id="no"
                      label="No"
                      name="did_you_are_this_no"
                      checked={values?.did_you_are_this_no === "no"}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFieldValue("did_you_are_this_no", e.target.id);
                        }
                      }}
                      onBlur={handleBlur}
                      value={values?.did_you_are_this_no}
                      className={`ml-3 ${
                        touched?.did_you_are_this_no &&
                        errors?.did_you_are_this_no
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="did_you_are_this_no"
                      className="invalid-feedback ml-5"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    margin: "20px 0px",
                  }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="save-button"
                  >
                    Done{" "}
                    {loading && (
                      <Spinner animation="border" size="sm" variant="light" />
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePOModal;
