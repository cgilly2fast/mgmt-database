import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RulesMessage.css";
import Message from "../../img/message.svg";
import { BsCheck2Circle, BsXCircle } from "react-icons/bs";
import Timing from "./Timing/Timing";
import Setting from "./Setting/Setting";
import Scope from "./Scope/Scope";
import { MentionsInput, Mention } from "react-mentions";
import NewtonLoader from "../loader/ NewtonLoader/NewtonLoader";
import db from "../../admin";
import { ruleDetailtype } from "../../API/Types";
import PreviewMessageModal from "../Modal/PreviewMessageModal/PreviewMessageModal";

const importMessageTemplate = [
  {
    name: "After booking",
  },
  {
    name: "Booking Inquiry Confirmed",
  },
  {
    name: "Check-in instructions",
  },
  {
    name: "For Booking Need To Review",
  },
  {
    name: "New canned response",
  },
];

const requestTag = [
  // {
  //   id: '%answers%',
  //   display: '%answers%',
  // },
  // {
  //   id: '%autohost%',
  //   display: '%autohost%',
  // },
  // {
  //   id: '%base_price%',
  //   display: '%base_price%',
  // },
  {
    id: "%bathrooms%",
    display: "%bathrooms%",
  },
  {
    id: "%bedrooms%",
    display: "%bedrooms%",
  },
  {
    id: "%beds%",
    display: "%beds%",
  },
  {
    id: "%check_in_time%",
    display: "%check_in_time%",
  },
  {
    id: "%check_out_time%",
    display: "%check_out_time%",
  },
  {
    id: "%check_in_date%",
    display: "%check_in_date%",
  },
  {
    id: "%check_out_date%",
    display: "%check_out_date%",
  },
  // {
  //   id: '%children%',
  //   display: '%children%',
  // },
  // {
  //   id: '%cleaning%',
  //   display: '%cleaning%',
  // },
  {
    id: "%guest_email%",
    display: "%guest_email%",
  },
  {
    id: "%guest_first_name%",
    display: "%guest_first_name%",
  },
  {
    id: "%guest_last_name%",
    display: "%guest_last_name%",
  },
  // {
  //   id: '%guest_phone%',
  //   display: '%guest_phone%',
  // },
  // {
  //   id: '%guests%',
  //   display: '%guests%',
  // },
  {
    id: "%host_name%",
    display: "%host_name%",
  },
  // {
  //   id: '%infants%',
  //   display: '%infants%',
  // },
  // {
  //   id: '%listing_id%',
  //   display: '%listing_id%',
  // },
  // {
  //   id: '%listing_name%',
  //   display: '%listing_name%',
  // },
  {
    id: "%nights%",
    display: "%nights%",
  },
  // {
  //   id: '%payout%',
  //   display: '%payout%',
  // },
  {
    id: "%property_name%",
    display: "%property_name%",
  },
  {
    id: "%reservation_code%",
    display: "%reservation_code%",
  },
  {
    id: "%room_type%",
    display: "%room_type%",
  },
  {
    id: "%total%",
    display: "%total%",
  },
  {
    id: "%wifi_name%",
    display: "%wifi_name%",
  },
  {
    id: "%wifi_password%",
    display: "%wifi_password%",
  },
];

const customStyle = {
  control: {
    backgroundColor: "#fff",
    fontSize: 14,
    fontWeight: "normal",
  },

  "&multiLine": {
    control: {
      fontFamily: "monospace",
      minHeight: 200,
    },
    highlighter: {
      padding: 9,
      border: "1px solid transparent",
    },
    input: {
      padding: 9,
      // border: '1px solid silver',
    },
  },

  "&singleLine": {
    display: "inline-block",
    width: 180,

    highlighter: {
      padding: 1,
      border: "2px inset transparent",
    },
    input: {
      padding: 1,
      border: "2px inset",
    },
  },

  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: 14,
      maxHeight: "300px",
      overflowY: "auto",
    },
    item: {
      padding: "5px 15px",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "#cee4e5",
      },
    },
  },
};

const RulesMessage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ruleDetail, setRuleDetail] = useState<ruleDetailtype | null>();
  const [savingLoader, setSavingLoader] = useState("");
  const [unitList, setUnitList] = useState({});
  const [showModel, setShowModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getMessagingRulesById = async () => {
      const rulesRef: any = await db
        .collection("messaging-rules")
        .doc(id)
        .get();
      if (rulesRef.data()) {
        setRuleDetail(rulesRef.data());
        const unitRef = await db
          .collection("units")
          .where("active", "==", true)
          .get();
        const tempUnits: any = [];
        await unitRef.docs.forEach((item) => {
          tempUnits.push({
            unit_name: item?.data()?.name,
            unit_id: item?.id,
            unit_picture: item?.data()?.picture?.length
              ? item
                  ?.data()
                  ?.picture?.filter(
                    (item: { isCurrent: any }) => item?.isCurrent
                  )[0]?.original
              : "",
            isChecked: Boolean(
              rulesRef
                .data()
                ?.units?.find(
                  (ele: { unit_id: string }) => ele?.unit_id === item?.id
                )
            ),
          });
        });
        const checkedAll = tempUnits.every(
          (ele: { isChecked: any }) => ele.isChecked
        );
        const length = tempUnits.filter(
          (ele: { isChecked: any }) => ele?.isChecked
        ).length;
        setUnitList({
          list: tempUnits,
          allChecked: checkedAll,
          selectedLength: length,
        });
      }
      setIsLoading(false);
    };
    getMessagingRulesById();
  }, []);

  const onBlurChangeTitle = async () => {
    setSavingLoader("Saving...");
    await db
      .collection("messaging-rules")
      .doc(id)
      .set({ name: ruleDetail?.name }, { merge: true });
    setSavingLoader("Saved");
    setTimeout(() => {
      setSavingLoader("");
    }, 500);
  };

  const eventActive = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSavingLoader("Saving...");
    setRuleDetail({ ...ruleDetail, active: e.target.checked });
    await db
      .collection("messaging-rules")
      .doc(id)
      .set({ active: e.target.checked }, { merge: true });
    setSavingLoader("Saved");
    setTimeout(() => {
      setSavingLoader("");
    }, 500);
  };

  const handleSaveMessage = async () => {
    setSavingLoader("Saving...");
    await db
      .collection("messaging-rules")
      .doc(id)
      .set({ message: ruleDetail?.message }, { merge: true });
    setSavingLoader("Saved");
    setTimeout(() => {
      setSavingLoader("");
    }, 500);
  };

  return (
    <>
      {isLoading ? (
        <NewtonLoader />
      ) : (
        <div style={{ padding: "40px 0px" }}>
          <div className="rule-title-main-wrapper">
            <div className="rule-title-wrapper">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={ruleDetail?.active}
                  onChange={(e) => {
                    eventActive(e);
                  }}
                />
                <span className="slider round"></span>
              </label>
              <h2 className="rule-title">
                <input
                  type="text"
                  className="rule-input"
                  value={ruleDetail?.name}
                  onChange={(e) =>
                    setRuleDetail({ ...ruleDetail, name: e.target.value })
                  }
                  onBlur={() => {
                    onBlurChangeTitle();
                  }}
                />
              </h2>
            </div>
            <span
              className={`${savingLoader === "Saved" ? "saved" : "saving"}`}
            >
              {savingLoader === "Saved" && (
                <BsCheck2Circle style={{ marginRight: "10px" }} />
              )}
              {savingLoader}
            </span>
          </div>
          <div className="rule-message-box-wrapper">
            <h3 className="message-h3">
              <img src={Message} style={{ marginRight: "12px" }} />
              <span className="message-text">Message</span>
              <span className="message-detail-span">
                The message that will be sent to your guest. You can use short
                codes and custom codes by typing %.
              </span>
            </h3>
            <div className="message-textarea-wrapper">
              <MentionsInput
                value={ruleDetail?.message}
                onChange={(e?: { target?: { value?: any } }) => {
                  setRuleDetail({ ...ruleDetail, message: e?.target?.value });
                }}
                onBlur={handleSaveMessage}
                placeholder="Write a message. You can use short codes and custom codes by typing %."
                // markup="@[__display__](__id__)"
                className="message-textarea mentions"
                style={customStyle}
              >
                <Mention
                  trigger="%"
                  data={requestTag}
                  renderSuggestion={(
                    _suggestion: any,
                    _search: any,
                    highlightedDisplay:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined,
                    index: any,
                    focused: any
                  ) => (
                    <div className={` ${focused ? "focused" : ""}`}>
                      {highlightedDisplay}
                    </div>
                  )}
                  style={{
                    backgroundColor: "#ebf9f3",
                    border: "1px solid #47c693",
                    borderRadius: "4px",
                  }}
                />
              </MentionsInput>
            </div>
            <div className="import-button-wrapper">
              <button
                className="import-button"
                type="button"
                data-toggle="dropdown"
              >
                Import
              </button>
              <ul className="dropdown-menu import-ui">
                {importMessageTemplate?.map((item, index) => {
                  return <li key={`${index}${item?.name}`}>{item?.name}</li>;
                })}
              </ul>
              <button
                type="button"
                className="preview-button"
                onClick={() => setShowModel(true)}
              >
                Preview Message
              </button>
            </div>
          </div>
          <Timing
            setSavingLoader={setSavingLoader}
            ruleDetail={ruleDetail}
            setRuleDetail={setRuleDetail}
          />
          <Setting
            ruleDetail={ruleDetail}
            setRuleDetail={setRuleDetail}
            setSavingLoader={setSavingLoader}
          />
          <Scope
            unitList={unitList}
            ruleDetail={ruleDetail}
            setRuleDetail={setRuleDetail}
            setSavingLoader={setSavingLoader}
            setUnitList={setUnitList}
          />
          <div className="delete-wrapper">
            <button
              className="delete-button"
              type="button"
              onClick={async () => {
                await db.collection("messaging-rules").doc(id).delete();
                navigate("/messaging-rules");
              }}
            >
              <BsXCircle />
              <span style={{ marginLeft: "10px" }}>Delete</span>
            </button>
            <span
              className={`${savingLoader === "Saved" ? "saved" : "saving"}`}
            >
              {savingLoader === "Saved" && (
                <BsCheck2Circle style={{ marginRight: "10px" }} />
              )}
              {savingLoader}
            </span>
          </div>
          <PreviewMessageModal
            showModel={showModel}
            setShowModel={setShowModel}
            value={ruleDetail?.message}
          />
        </div>
      )}
    </>
  );
};

export default RulesMessage;
