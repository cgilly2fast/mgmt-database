import React from "react";
import ScopeIcon from "../../../img/scope.svg";
import "./Scope.css";
import { db } from "../../../config/firebase";
import { useParams } from "react-router-dom";

interface ScopeProps {
  unitList: any;
  setUnitList: (value: object) => void;
  setSavingLoader: (value: string) => void;
  ruleDetail: any;
  setRuleDetail: (value: object) => void;
}

const Scope: React.FC<ScopeProps> = ({
  setSavingLoader,
  ruleDetail,
  setRuleDetail,
  unitList,
  setUnitList,
}: ScopeProps) => {
  const { id } = useParams();

  const handleChange = async (e: { target }) => {
    let itemName = e.target.name;
    let checked = e.target.checked;
    let list = unitList?.list;
    let allChecked = unitList?.allChecked;
    if (itemName === "checkAll") {
      allChecked = checked;
      list = list?.map((item) => ({
        ...item,
        isChecked: checked,
      }));
    } else {
      list = list?.map((item) =>
        item.unit_name === itemName ? { ...item, isChecked: checked } : item
      );
      allChecked = list.every((item) => item.isChecked);
    }
    const selectedLength = list
      .filter((ele) => ele?.isChecked)
      .map(
        (ele: {
          unit_id: string;
          unit_name: string;
          unit_picture: string;
        }) => ({
          unit_id: ele?.unit_id,
          unit_name: ele?.unit_name,
          unit_picture: ele?.unit_picture,
        })
      );
    setUnitList({ list, allChecked, selectedLength: selectedLength.length });
    setRuleDetail({ ...ruleDetail, units: selectedLength });
    if (selectedLength.length > 0) {
      setSavingLoader("Saving...");
      await db
        .collection("messaging-rules")
        .doc(id)
        .set({ units: selectedLength }, { merge: true });
      setSavingLoader("Saved");
      setTimeout(() => {
        setSavingLoader("");
      }, 500);
    }
  };

  const handleClear = async () => {
    let list = unitList?.list;
    list = list?.map((item) => ({
      ...item,
      isChecked: false,
    }));
    const allChecked = list.every((item) => item.isChecked);
    const selectedLength = list
      .filter((ele) => ele?.isChecked)
      .map((ele) => ele?.unit_id);
    setUnitList({ list, allChecked, selectedLength: selectedLength.length });
  };

  return (
    <div className="scope-main-wrapper">
      <div className="scope-wrapper">
        <h3 className="scope-h3">
          <img src={ScopeIcon} style={{ marginRight: "12px" }} />
          <span>Scope</span>
        </h3>
        <span>Limit the usage of this rule with the options below.</span>
      </div>
      <div className="d-flex">
        <div
          className={`scope-box ${
            unitList?.selectedLength === 0 && "zero-length"
          }`}
        >
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-baseline">
              <input
                type="checkbox"
                name="checkAll"
                onChange={handleChange}
                checked={unitList?.allChecked}
                style={{ marginRight: "12px" }}
              />
              <h4 className="all-properties-h4">All properties</h4>
            </div>
            <div>
              {!unitList?.allChecked && (
                <span style={{ marginRight: "10px" }}>
                  {unitList?.selectedLength} selected
                </span>
              )}
              <span className="clear-selection-span" onClick={handleClear}>
                Clear selection
              </span>
            </div>
          </div>
          <div className="unit-list-wrapper">
            {unitList?.list?.map((item, index) => {
              return (
                <div key={index}>
                  <input
                    type="checkbox"
                    name={item?.unit_name}
                    onChange={handleChange}
                    style={{ marginRight: "12px" }}
                    checked={item?.isChecked}
                  />
                  <span>{item?.unit_name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope;
