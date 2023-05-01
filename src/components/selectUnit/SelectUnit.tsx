import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import "./SelectUnit.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import BackButton from "../../img/BackButton.svg";
import { getActiveUnits } from "../../API";
import { UnitsType } from "../../API/Types";

const SelectUnit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [units, setUnits] = useState<UnitsType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const activeUnitsGet = async () => {
      setLoading(true);
      const activeUnits = (await getActiveUnits()) as UnitsType[];
      setLoading(false);
      setUnits(activeUnits);
    };
    activeUnitsGet();
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    navigate(`/calendar/${id}`);
  };

  return (
    <>
      <img
        src={BackButton}
        alt="back"
        style={{ height: "30px", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />
      {id === undefined && (
        <>
          <h2 className="text-center mt-5 mb-3" style={{ color: "#007bff" }}>
            Select Unit{" "}
            {loading && <Spinner animation="grow" variant="primary" />}
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
