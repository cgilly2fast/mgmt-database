import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import "./SelectUnit.css";
import { useHistory, withRouter } from "react-router-dom";
import { getActiveUnits } from "../../store/actions/dbActions";
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BackButton from "../../img/BackButton.svg";

const SelectUnit = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const unitsdata = useSelector(({ db }) => db?.units);
  useEffect(() => {
    dispatch(getActiveUnits());
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
export default withRouter(
  connect(mapStateToProps, {
    getActiveUnits,
  })(SelectUnit)
);
