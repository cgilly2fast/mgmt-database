import React, { useEffect, useState } from "react";
import Watch from "../../../img/time.svg";
import "./Timing.css";
import db from "../../../admin";
import { useParams } from "react-router-dom";

interface TimingProps {
  setSavingLoader: (value: string) => void;
  ruleDetail:any;
  setRuleDetail: (value: object) => void;
}

const Timing: React.FC<TimingProps> = ({
  setSavingLoader,
  ruleDetail,
  setRuleDetail,
}: TimingProps) => {
  const { id } = useParams();
  const [checked, setChecked] = useState("");

  useEffect(() => {
    if (ruleDetail) {
      setChecked(
        (ruleDetail?.minutes && "minutes") ||
          (ruleDetail?.hours && "hours") ||
          (ruleDetail?.days && "days") ||
          (ruleDetail?.immediately && "immediately") ||
          "immediately"
      );
    }
  }, [ruleDetail]);

  const handleClick = async () => {
    setSavingLoader("Saving...");
    const data = {
      immediately: ruleDetail.immediately,
      minutes: ruleDetail.minutes,
      hours: ruleDetail.hours,
      days: ruleDetail.days,
    };
    await db.collection("messaging-rules").doc(id).set(data, { merge: true });
    setSavingLoader("Saved");
    setTimeout(() => {
      setSavingLoader("");
    }, 500);
  };

  const handleChangeTriggerOn = async (type) => {
    setSavingLoader("Saving...");
    const data = {
      trigger_on: type,
    };
    await db.collection("messaging-rules").doc(id).set(data, { merge: true });
    setSavingLoader("Saved");
    setTimeout(() => {
      setSavingLoader("");
    }, 500);
  };

  return (
    <div className="timing-main-wrapper">
      <div className="timing-wrapper">
        <h3 className="timing-h3">
          <img src={Watch} style={{ marginRight: "12px" }} />
          <span>Timing</span>
        </h3>
        <div className="d-flex">
          <span>Send this message </span>
          <button
            className="timing-button"
            type="button"
            data-toggle="dropdown"
          >
            {(!ruleDetail?.immediately && ruleDetail?.minutes) ||
              (!ruleDetail?.immediately && ruleDetail?.hours) ||
              (!ruleDetail?.immediately && ruleDetail?.days)}{" "}
            {checked}
          </button>
          <ul className="dropdown-menu timing-ui" onBlur={handleClick}>
            <li>
              <input
                type="radio"
                checked={checked === "immediately"}
                name="time"
                style={{ marginRight: "10px" }}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRuleDetail({
                      ...ruleDetail,
                      immediately: true,
                      minutes: "",
                      hours: "",
                      days: "",
                      trigger_on: "after",
                    });
                    handleChangeTriggerOn("after");
                  }
                }}
                id="immediately"
              />
              <label>immediately</label>
            </li>
            <li>
              <input
                type="radio"
                checked={checked === "minutes"}
                name="time"
                style={{ marginRight: "10px" }}
                onChange={(e) => {
                  if (e.target.checked) {
                    setChecked(e.target.id);
                    setRuleDetail({
                      ...ruleDetail,
                      days: "",
                      hours: "",
                      minutes: 1,
                      immediately: false,
                    });
                  }
                }}
                id="minutes"
              />
              <label>minutes</label>
            </li>
            {checked === "minutes" && (
              <li>
                <input
                  type="number"
                  defaultValue={1}
                  value={ruleDetail?.minutes}
                  onChange={(e) =>
                    setRuleDetail({
                      ...ruleDetail,
                      minutes: e.target.value,
                      immediately: false,
                      hours: "",
                      days: "",
                    })
                  }
                />
              </li>
            )}
            <li>
              <input
                type="radio"
                checked={checked === "hours"}
                name="time"
                style={{ marginRight: "10px" }}
                onChange={(e) => {
                  if (e.target.checked) {
                    setChecked(e.target.id);
                    setRuleDetail({
                      ...ruleDetail,
                      days: "",
                      hours: 1,
                      minutes: "",
                      immediately: false,
                    });
                  }
                }}
                id="hours"
              />
              <label>hours</label>
            </li>
            {checked === "hours" && (
              <li>
                <input
                  defaultValue={1}
                  type="number"
                  value={ruleDetail?.hours}
                  onChange={(e) =>
                    setRuleDetail({
                      ...ruleDetail,
                      hours: e.target.value,
                      minutes: "",
                      immediately: false,
                      days: "",
                    })
                  }
                />
              </li>
            )}
            <li>
              <input
                type="radio"
                name="time"
                checked={checked === "days"}
                style={{ marginRight: "10px" }}
                onChange={(e) => {
                  if (e.target.checked) {
                    setChecked(e.target.id);
                    setRuleDetail({
                      ...ruleDetail,
                      days: 1,
                      hours: "",
                      minutes: "",
                      immediately: false,
                    });
                  }
                }}
                id="days"
              />
              <label>days</label>
            </li>{" "}
            {checked === "days" && (
              <li>
                <input
                  defaultValue={1}
                  type="number"
                  value={ruleDetail?.days}
                  onChange={(e) =>
                    setRuleDetail({
                      ...ruleDetail,
                      days: e.target.value,
                      hours: "",
                      minutes: "",
                      immediately: false,
                    })
                  }
                />
              </li>
            )}
            <button type="button" onClick={handleClick}>
              Done
            </button>
          </ul>
          &nbsp;
          {(ruleDetail?.minutes &&
            ruleDetail?.type !== "after_a_new_reservation" &&
            ruleDetail?.type !== "after_a_cancel_reservation") ||
          (ruleDetail?.hours &&
            ruleDetail?.type !== "after_a_new_reservation" &&
            ruleDetail?.type !== "after_a_cancel_reservation") ||
          (ruleDetail?.days &&
            ruleDetail?.type !== "after_a_new_reservation" &&
            ruleDetail?.type !== "after_a_cancel_reservation") ? (
            <div>
              <button
                className="timing-button"
                type="button"
                id="dropDownButton"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <span>
                  {ruleDetail?.trigger_on ? ruleDetail?.trigger_on : "after"}
                </span>
              </button>
              <ul
                className="dropdown-menu timing-ui"
                aria-labelledby="dropDownButton"
              >
                <li
                  onClick={() => {
                    setRuleDetail({ ...ruleDetail, trigger_on: "after" });
                    handleChangeTriggerOn("after");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  after
                </li>
                <li
                  onClick={() => {
                    setRuleDetail({ ...ruleDetail, trigger_on: "before" });
                    handleChangeTriggerOn("before");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  before
                </li>
              </ul>
            </div>
          ) : (
            <span>
              {ruleDetail?.trigger_on ? ruleDetail?.trigger_on : "after"}
            </span>
          )}
          &nbsp;
          <span>
            <b>
              {ruleDetail?.type === "after_a_new_reservation" &&
                "a new reservation is accepted."}
              {ruleDetail?.type === "before_check_in" && "Check in."}
              {ruleDetail?.type === "after_check_in" && "Check in."}
              {ruleDetail?.type === "before_check_out" && "Check out."}
              {ruleDetail?.type === "after_check_out" && "Check out."}
              {ruleDetail?.type === "after_a_cancel_reservation" &&
                "a reservation is cancel."}
            </b>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Timing;
