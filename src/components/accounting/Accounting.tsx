import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import "./Accounting.css";
import { BsPencil } from "react-icons/bs";
import db from "../../admin";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
import { accountListtype } from "../../API/Types";
import CreatePOModal from "../Modal/CreatePOModal/CreatePOModal";
import AccountingRules from "./accountingRules/AccountingRules";

// const rulesList = [
//   // {
//   //   platform: "Airbnb",
//   //   listing_account: "colby@dipseapm.com",
//   //   accounting_platform: "Xero",
//   //   accounting_account: "Surfwood Hospitality LLC",
//   // },
//   // {
//   //   platform: "Vrbo",
//   //   listing_account: "colby@stinsonpm.com",
//   //   accounting_platform: "Xero",
//   //   accounting_account: "Stinson Beach PM",
//   // },
//   // {
//   //   platform: "Airbnb",
//   //   listing_account: "Stinson Beach PM",
//   //   accounting_platform: "Xero",
//   //   accounting_account: "Surfwood Hospitality LLC",
//   // },
//   // {
//   //   platform: "Airbnb",
//   //   listing_account: "colby@dipseapm.com",
//   //   accounting_platform: "Xero",
//   //   accounting_account: "Stinson Beach PM - Trust Account",
//   // },
//   // {
//   //   platform: "Airbnb",
//   //   listing_account: "colby@stinsonpm.com",
//   //   accounting_platform: "Xero",
//   //   accounting_account: "Stinson Beach PM",
//   // },
//   // {
//   //   platform: "Airbnb",
//   //   listing_account: "Stinson Beach PM",
//   //   accounting_platform: "Xero",
//   //   accounting_account: "Stinson Beach PM - Trust Account",
//   // },
// ];

const Accounting: React.FC = () => {
  const [showModel, setShowModel] = useState(false);
  const [showPOModel, setShowPOModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<any>(0);
  const [value, setValue] = useState();
  const [model1value, setModel1Value] = useState();
  const [model2value, setModel2Value] = useState();
  const [accountList, setAccountList] = useState<accountListtype[]>([]);
  const [rulesList, setRulesList] = useState([]);
  const [currentPONumber, setCurrentPONumber] = useState(null);

  useEffect(() => {
    setLoading(true);
    const getAccountDataOnSnapShot = async () => {
      db.collection("accounts").onSnapshot((doc) => {
        let tempData: any = [];
        doc.forEach((item) => {
          tempData.push({ ...item.data(), id: item?.id });
        });
        setAccountList(tempData);
      });
    };
    const getRulesDataOnSnapShot = async () => {
      await db.collection("accounting-rules").onSnapshot((doc) => {
        let tempData: any = [];
        doc.forEach((item) => {
          tempData.push({ ...item.data(), id: item?.id });
        });
        setRulesList(tempData);
        setLoading(false);
      });
    };
    getRulesDataOnSnapShot();
    getAccountDataOnSnapShot();
  }, []);

  const getPONumber = async () => {
    const variableRef = await db.collection("variables").doc("po_number").get();
    setCurrentPONumber(variableRef?.data()?.current + 1);
  };

  useEffect(() => {
    getPONumber();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="po-wrapper">
            <h3 className="account-title">PO Numbers</h3>
            <button
              type="submit"
              className="account-button"
              onClick={() => setShowPOModel(true)}
            >
              Generate
            </button>
          </div>
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
                  {accountList?.map((item: accountListtype, index: any) => {
                    return (
                      <tr key={index + item.id}>
                        <td>{item?.type}</td>
                        <td>{item?.platform}</td>
                        <td>{item?.account}</td>
                        <td>
                          <button type="submit" className="active-button">
                            {item?.status}
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
            <h3 className="account-title">Accounting Rules</h3>
            <button type="submit" className="account-button">
              <Link to="/create-rule" style={{ color: "#fff" }}>
                +Add Rules
              </Link>
            </button>
          </div>
          <div>
            <Table className="table">
              <thead>
                <tr>
                  <th>STARTING PLATFORM</th>
                  <th>TYPE</th>
                  <th></th>
                  <th>END PLATFORM</th>
                  <th>HISTORY</th>
                  <th></th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {rulesList?.map((item, index) => {
                  return <AccountingRules item={item} key={index} />;
                })}
              </tbody>
            </Table>
          </div>
        </>
      )}

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
              // variant="light"
              value={value}
            >
              <option disabled>Select Account Type...</option>
              <option
                onClick={(e: any) => {
                  setValue(e.target.text);
                }}
              >
                Airbnb
              </option>
              <option
                onClick={(e: any) => {
                  setValue(e.target.text);
                }}
              >
                Vrbo
              </option>
              <option
                onClick={(e: any) => {
                  setValue(e.target.text);
                }}
              >
                Xero
              </option>
              <option
                onClick={(e: any) => {
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
              // variant="light"
              placeholder="Select an existing listing platform..."
              className="create-connection-dropdown"
              value={model1value}
            >
              <option disabled>Select an existing listing platform...</option>
              <option
                onClick={(e: any) => {
                  setModel1Value(e.target.text);
                }}
              >
                Airbnb: colby@dipseapm.com
              </option>
              <option
                onClick={(e: any) => {
                  setModel1Value(e.target.text);
                }}
              >
                Vrbo: colby@stinsonpm.com
              </option>
              <option
                onClick={(e: any) => {
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
              // variant="light"
              className="create-connection-dropdown-2"
              value={model2value}
            >
              <option disabled>
                Select an existing accounting platform...
              </option>
              <option
                onClick={(e: any) => {
                  setModel2Value(e.target.text);
                }}
              >
                Xero: Surfwood Hospitality LLC
              </option>
              <option
                onClick={(e: any) => {
                  setModel2Value(e.target.text);
                }}
              >
                Xero: Stinson Beach PM
              </option>
              <option
                onClick={(e: any) => {
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
      <CreatePOModal
        setShowPOModel={setShowPOModel}
        showPOModel={showPOModel}
        currentPONumber={currentPONumber}
        getPONumber={getPONumber}
      />
    </>
  );
};

export default Accounting;
