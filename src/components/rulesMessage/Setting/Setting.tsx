import React, { useEffect, useState } from "react";
import "./Setting.css";
import SettingIcon from "../../../img/settings.svg";
import { db } from "../../../config/firebase";
import { useParams } from "react-router-dom";
import { ruleDetailtype } from "../../../API/Types";

interface SettingProps {
  setSavingLoader: (value: string) => void;
  ruleDetail: any;
  setRuleDetail: (value: object) => void;
}

const Setting: React.FC<SettingProps> = ({
  setSavingLoader,
  ruleDetail,
  setRuleDetail,
}: SettingProps) => {
  const [checkedSetting, setCheckedSetting] = useState<boolean | undefined>(
    false
  );
  const { id } = useParams();

  console.log("ruleDetail", ruleDetail);

  useEffect(() => {
    if (ruleDetail) {
      const durationSelected =
        ruleDetail?.exclude_last_minute_stays ||
        ruleDetail?.one_night_stays ||
        ruleDetail?.two_night_stays ||
        ruleDetail?.greater_than_2_night_stays;
      setCheckedSetting(durationSelected);
    }
  }, [ruleDetail]);

  return (
    <div className="setting-main-wrapper">
      <div className="setting-wrapper">
        <h3 className="setting-h3">
          <img src={SettingIcon} style={{ marginRight: "12px" }} />
          <span>Settings</span>
        </h3>
        <span>Fine-tune preferences for this rule.</span>
      </div>
      <div
        className={`specify-reservation-duration-wrapper ${
          checkedSetting && "selected-setting"
        }`}
      >
        <div className="setting-wrapper">
          <div style={{ marginRight: "100px" }}>
            <input
              type="checkbox"
              className="setting-checkbox"
              onChange={(e) => setCheckedSetting(e.target.checked)}
              id="duration"
              checked={checkedSetting}
            />
            <span>Specify a reservation duration</span>
          </div>
          <span>
            Sometimes you may want to send different messages depending on the
            duration of the reservation.
          </span>
        </div>
        {checkedSetting && (
          <select
            placeholder="select"
            onChange={async (e) => {
              setSavingLoader("Saving...");
              const tempData = {
                exclude_last_minute_stays:
                  e.target.value === "exclude_last_minute_stays" ? true : false,
                one_night_stays:
                  e.target.value === "one_night_stays" ? true : false,
                two_night_stays:
                  e.target.value === "two_night_stays" ? true : false,
                greater_than_2_night_stays:
                  e.target.value === "exclude_last_minute_stays" ? true : false,
              };
              setRuleDetail({
                ...ruleDetail,
                tempData,
              });
              await db
                .collection("messaging-rules")
                .doc(id)
                .set(tempData, { merge: true });
              setSavingLoader("Saved");
              setTimeout(() => {
                setSavingLoader("");
              }, 500);
            }}
            className="duration-select"
          >
            <option selected disabled>
              select...
            </option>
            <option
              value="exclude_last_minute_stays"
              selected={ruleDetail?.exclude_last_minute_stays}
            >
              Include this message for all reservations.
            </option>
            <option
              value="one_night_stays"
              selected={ruleDetail?.one_night_stays}
            >
              Include this message for 1 night reservations only.
            </option>
            <option
              value="two_night_stays"
              selected={ruleDetail?.two_night_stays}
            >
              Include this message for 2 night reservations only.
            </option>
            <option
              value="greater_than_2_night_stays"
              selected={ruleDetail?.greater_than_2_night_stays}
            >
              Include this message for more than 2 nights.
            </option>
          </select>
        )}
      </div>
    </div>
  );
};

export default Setting;
