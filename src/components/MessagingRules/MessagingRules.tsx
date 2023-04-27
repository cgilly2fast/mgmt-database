import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import NewtonLoader from "../loader/ NewtonLoader/NewtonLoader";
import "./MessagingRules.css";
import NoRules from "../../img/NoRules.png";
import More from "../../img/more.svg";
import { BsPencilSquare, BsXCircle } from "react-icons/bs";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { rulesListtype } from "../../API/Types";
import CreateMagicalMomentsModal from "../Modal/CreateMagicalMoment/CreateMagicalMomentsModal";
import PropertiesListModal from "../Modal/PropertiesListModal/PropertiesListModal";

const MessagingRules: React.FC = () => {
  const navigate = useNavigate();
  const [showModel, setShowModel] = useState(false);
  const [showPropertiesModel, setShowPropertiesModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rulesList, setRulesList] = useState<rulesListtype[]>([]);
  const [unitsLength, setUnitsLength] = useState(0);
  const [propertiesList, setPropertiesList] = useState({ name: "", units: [] });

  const getMessagingRules = async () => {
    setIsLoading(true);
    const unitsRef = await db
      .collection("units")
      .where("active", "==", true)
      .get();
    setUnitsLength(unitsRef.size);
    const rulesRef = await db.collection("messaging-rules").get();
    const tempRules: any = [];
    await rulesRef.docs.forEach(async (item) => {
      tempRules.push({ ...item?.data(), id: item?.id });
    });
    setRulesList(tempRules);
    setIsLoading(false);
  };

  useEffect(() => {
    getMessagingRules();
  }, []);

  const eventActive = async (e: any, id: string) => {
    setRulesList((prevState) =>
      prevState.map((item) => ({
        ...item,
        active: id === item.id ? e.target.checked : item?.active,
      }))
    );
    await db
      .collection("messaging-rules")
      .doc(id)
      .set({ active: e.target.checked }, { merge: true });
  };

  const nameDisplayFunction = (item: any) => {
    let displayName = "";
    switch (item?.type) {
      case "after_a_new_reservation":
        displayName = "a new reservation is accepted.";
        break;
      case "before_check_in":
        displayName = "Check in.";
        break;
      case "after_check_in":
        displayName = "Check in.";
        break;
      case "before_check_out":
        displayName = "Check out.";
        break;
      case "after_check_out":
        displayName = "Check out.";
        break;
      case "after_a_cancel_reservation":
        displayName = "a reservation is cancel.";
        break;
      default:
        break;
    }
    return displayName;
  };

  return (
    <div className="main-div-messaging-rules">
      <h3 className="messaging-rules">Messaging rules</h3>
      {isLoading ? (
        <NewtonLoader />
      ) : rulesList?.length ? (
        <div>
          <div className="add-new-button-div">
            <button
              className="add-new-button"
              onClick={() => {
                setShowModel(true);
              }}
            >
              <span> + Add new </span>
            </button>
          </div>
          <div>
            <Table className="table">
              <thead>
                <tr className="header-tr">
                  <th className="header-th">Status</th>
                  <th className="header-th">Rule name</th>
                  <th className="header-th">Sending time</th>
                  <th className="header-th">Properties</th>
                  <th className="header-th"></th>
                </tr>
              </thead>
              <tbody>
                {rulesList?.map((item: rulesListtype, index) => {
                  return (
                    <tr
                      key={index + item?.id}
                      className="rules-list-tr"
                      onClick={() => {
                        navigate(`/rules/${item.id}`);
                      }}
                    >
                      <td>
                        <label htmlFor={item.id} className="switch">
                          <input
                            type="checkbox"
                            checked={item?.active}
                            onChange={(e) => {
                              eventActive(e, item.id);
                            }}
                            id={item.id}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td>{item?.name}</td>
                      <td>
                        {(item?.immediately &&
                          `exactly at ${nameDisplayFunction(item)}`) ||
                          (item?.minutes &&
                            `${item?.minutes} minutes ${
                              item?.trigger_on
                            } ${nameDisplayFunction(item)}`) ||
                          (item?.hours &&
                            `${item?.hours} hours ${
                              item?.trigger_on
                            } ${nameDisplayFunction(item)}`) ||
                          (item?.days &&
                            `${item?.days} days ${
                              item?.trigger_on
                            } ${nameDisplayFunction(item)}`)}
                      </td>
                      <td>
                        {unitsLength === item?.units?.length ? (
                          <span
                            className="all-span"
                            onClick={() => {
                              setPropertiesList({
                                name: item?.name,
                                units: item?.units,
                              });
                              setShowPropertiesModel(true);
                            }}
                          >
                            All
                          </span>
                        ) : (
                          <div className="properties-list-wrapper">
                            {item?.units?.map((ele: any, i: any) => {
                              if (i <= 2) {
                                return (
                                  <img
                                    src={ele?.unit_picture}
                                    className="properties-list"
                                    style={{ left: -i * 7 }}
                                    key={ele?.unit_id + i}
                                    onClick={() => {
                                      setPropertiesList({
                                        name: item?.name,
                                        units: item?.units,
                                      });
                                      setShowPropertiesModel(true);
                                    }}
                                  />
                                );
                              }
                            })}
                            {item?.units?.length > 3 ? (
                              <span
                                className="more-properties"
                                onClick={() => {
                                  setPropertiesList({
                                    name: item?.name,
                                    units: item?.units,
                                  });
                                  setShowPropertiesModel(true);
                                }}
                              >
                                +{item?.units?.length - 3}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="text-end">
                          <button
                            type="button"
                            data-toggle="dropdown"
                            className="more-button"
                          >
                            <img src={More} />
                          </button>
                          <ul className="dropdown-menu more-ui">
                            <li
                              className="more-li"
                              onClick={() => {
                                navigate(`/rules/${item?.id}`);
                              }}
                            >
                              <BsPencilSquare />
                              <span style={{ marginLeft: "10px" }}>Edit</span>
                            </li>
                            <li
                              className="more-li"
                              onClick={async () => {
                                await db
                                  .collection("messaging-rules")
                                  .doc(item?.id)
                                  .delete();
                                getMessagingRules();
                              }}
                            >
                              <BsXCircle />
                              <span style={{ marginLeft: "10px" }}>Delete</span>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="no-rules-wrapper">
          <img src={NoRules} height={500} />
          <div className="d-flex justify-content-center">
            <button
              className="add-new-button"
              onClick={() => {
                setShowModel(true);
              }}
            >
              <span> + Add new </span>
            </button>
          </div>
        </div>
      )}
      <CreateMagicalMomentsModal
        showModel={showModel}
        setShowModel={setShowModel}
      />
      <PropertiesListModal
        showPropertiesModel={showPropertiesModel}
        setShowPropertiesModel={setShowPropertiesModel}
        propertiesList={propertiesList}
      />
    </div>
  );
};

export default MessagingRules;
