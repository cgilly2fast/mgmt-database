import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "./SelectUnit.css";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import BackButton from "../../img/BackButton.svg";
import { getActiveUnits } from "../../API";

const SelectUnit = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [units, setUnits] = useState();

  useEffect(() => {
    const activeUnitsGet = async () => {
      const activeUnits = await getActiveUnits();
      setUnits(activeUnits);
    };
    activeUnitsGet();
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    history.push(`/calendar/${id}`);
  };

  return (
    <>
      <img
        src={BackButton}
        alt="back"
        style={{ height: "30px", cursor: "pointer" }}
        onClick={() => props.history.goBack()}
      />
      {id === undefined && (
        <>
          <h2 className="text-center mt-5 mb-3" style={{ color: "#007bff" }}>
            Select Unit
          </h2>
          <div className="d-flex justify-content-center">
            <Form.Control
              as="select"
              className="select-unit"
              onChange={handleSelect}
              style={{ width: "30%" }}
            >
              <option selected disabled>
                Select Units
              </option>
              {units?.map((item) => (
                <option value={item?.id} key={item?.id}>
                  {item?.name} {item?.address?.city}
                </option>
              ))}
            </Form.Control>
          </div>
        </>
      )}
    </>
  );
};

export default SelectUnit;
