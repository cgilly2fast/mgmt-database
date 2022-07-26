import React, { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import "./Accounting.css";
import { BsPencil, BsArrowRight } from "react-icons/bs";

const accountList = [
  {
    type: "Listing Platform",
    platform: "Airbnb",
    account: "colby@dipseapm.com",
  },
  {
    type: "Listing Platform",
    platform: "Vrbo",
    account: "colby@stinsonpm.com",
  },
  {
    type: "Accounting Platform",
    platform: "Xero",
    account: "Stinson Beach PM",
  },
  {
    type: "Listing Platform",
    platform: "Airbnb",
    account: "colby@dipseapm.com",
  },
  {
    type: "Listing Platform",
    platform: "Vrbo",
    account: "colby@stinsonpm.com",
  },
  {
    type: "Accounting Platform",
    platform: "Xero",
    account: "Stinson Beach PM",
  },
];

const connectionList = [
  {
    platform: "Airbnb",
    listing_account: "colby@dipseapm.com",
    accounting_platform: "Xero",
    accounting_account: "Surfwood Hospitality LLC",
  },
  {
    platform: "Vrbo",
    listing_account: "colby@stinsonpm.com",
    accounting_platform: "Xero",
    accounting_account: "Stinson Beach PM",
  },
  {
    platform: "Airbnb",
    listing_account: "Stinson Beach PM",
    accounting_platform: "Xero",
    accounting_account: "Surfwood Hospitality LLC",
  },
  {
    platform: "Airbnb",
    listing_account: "colby@dipseapm.com",
    accounting_platform: "Xero",
    accounting_account: "Stinson Beach PM - Trust Account",
  },
  {
    platform: "Airbnb",
    listing_account: "colby@stinsonpm.com",
    accounting_platform: "Xero",
    accounting_account: "Stinson Beach PM",
  },
  {
    platform: "Airbnb",
    listing_account: "Stinson Beach PM",
    accounting_platform: "Xero",
    accounting_account: "Stinson Beach PM - Trust Account",
  },
];

const Accounting = () => {
  const [showModel, setShowModel] = useState(false);
  const [step, setStep] = useState(0);
  const [value, setValue] = useState();
  const [model1value, setModel1Value] = useState();
  const [model2value, setModel2Value] = useState();
  return (
    <>
      <div>
        <div className="account-div mb-2">
          <h3 className="account-title">Accounts</h3>
          <button
            type="submit"
            className="account-button"
            onClick={() => setShowModel(true)}
          >
            +Add Account
          </button>
        </div>
        <div>
          <Table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Platform</th>
                <th>Account</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {accountList?.map((item) => {
                return (
                  <tr>
                    <td>{item?.type}</td>
                    <td>{item?.platform}</td>
                    <td>{item?.account}</td>
                    <td>
                      <button type="submit" className="active-button">
                        Active
                      </button>
                    </td>
                    <td>
                      <BsPencil />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="account-div mb-2">
        <h3 className="account-title">Connections</h3>
        <button
          type="submit"
          className="account-button"
          onClick={() => setStep(1)}
        >
          +Create Connection
        </button>
      </div>
      <div>
        <Table className="table">
          <thead>
            <tr>
              <th>LISTING PLATFORM</th>
              <th></th>
              <th>ACCOUNTING PLATFORM</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {connectionList?.map((item) => {
              return (
                <tr>
                  <td>
                    <span>{item?.platform}</span>
                    <br />
                    <span>{item?.listing_account}</span>
                  </td>
                  <td>
                    <BsArrowRight />
                  </td>
                  <td>
                    <span>{item?.accounting_platform}</span>
                    <br />
                    <span>{item?.accounting_account}</span>
                  </td>
                  <td>
                    <button type="submit" className="active-button">
                      COMPLETE
                    </button>
                  </td>
                  <td>
                    <BsPencil />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {showModel && (
        <Modal
          show={showModel}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body style={{ textAlign: "center" }}>
            <h4>Add Account</h4>
            <p>
              Link a listing or accounting software platform to your Bnbtally
              account.
            </p>

            <Form.Select
              placeholder="Select Account Type..."
              variant="light"
              value={value}
            >
              <option disabled>Select Account Type...</option>
              <option
                onClick={(e) => {
                  setValue(e.target.text);
                }}
              >
                Airbnb
              </option>
              <option
                onClick={(e) => {
                  setValue(e.target.text);
                }}
              >
                Vrbo
              </option>
              <option
                onClick={(e) => {
                  setValue(e.target.text);
                }}
              >
                Xero
              </option>
              <option
                onClick={(e) => {
                  setValue(e.target.text);
                }}
              >
                Quickbooks online
              </option>
            </Form.Select>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowModel(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      )}

      {step === 1 && (
        <Modal
          show={step}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{ border: "none" }}></Modal.Header>
          <Modal.Body
            style={{ textAlign: "center", padding: "1em 3em 5em 3em" }}
          >
            <h4>Step 1: Choose Listing Platform</h4>
            <p>Select an existing listing platform:</p>

            <Form.Select
              variant="light"
              placeholder="Select an existing listing platform..."
              className="create-connection-dropdown"
              value={model1value}
            >
              <option disabled>Select an existing listing platform...</option>
              <option
                onClick={(e) => {
                  setModel1Value(e.target.text);
                }}
              >
                Airbnb: colby@dipseapm.com
              </option>
              <option
                onClick={(e) => {
                  setModel1Value(e.target.text);
                }}
              >
                Vrbo: colby@stinsonpm.com
              </option>
              <option
                onClick={(e) => {
                  setModel1Value(e.target.text);
                }}
              >
                Airbnb: Stinson Beach PM
              </option>
            </Form.Select>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "space-between" }}>
            <Button onClick={() => setStep(2)}>Next</Button>
            <Button onClick={() => setStep(0)} variant="light">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {step === 2 && (
        <Modal
          show={step}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{ border: "none" }}></Modal.Header>
          <Modal.Body
            style={{ textAlign: "center", padding: "1em 3em 5em 3em" }}
          >
            <h4>Step 2: Choose Accounting Platform</h4>
            <p>Select an existing accounting platform:</p>

            <Form.Select
              placeholder="Select an existing accounting platform..."
              variant="light"
              className="create-connection-dropdown-2"
              value={model2value}
            >
              <option disabled>
                Select an existing accounting platform...
              </option>
              <option
                onClick={(e) => {
                  setModel2Value(e.target.text);
                }}
              >
                Xero: Surfwood Hospitality LLC
              </option>
              <option
                onClick={(e) => {
                  setModel2Value(e.target.text);
                }}
              >
                Xero: Stinson Beach PM
              </option>
              <option
                onClick={(e) => {
                  setModel2Value(e.target.text);
                }}
              >
                Xero: Stinson Beach PM - Trust Account
              </option>
            </Form.Select>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "space-between" }}>
            <Button onClick={() => setStep(0)}>Save</Button>
            <Button onClick={() => setStep(0)} variant="light">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Accounting;
