import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import "./SelectUnit.css";
import { useHistory } from "react-router-dom";
import { getActiveUnits } from "../../store/actions/dbActions";
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SelectUnit = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const unitsdata = useSelector(({ db }) => db?.units);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    dispatch(getActiveUnits());
  };

  const handleSelect = (e) => {
    const id = e.target.value;
    history.push(`/calendar/${id}`);
  };

  return (
    <>
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
              {unitsdata?.map((item) => (
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

const mapStateToProps = (state) => {
  return {
    units: state.db.units,
  };
};
export default connect(mapStateToProps, {
  getActiveUnits,
})(SelectUnit);
