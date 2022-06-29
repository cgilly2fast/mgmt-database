import React, { Component } from "react";
import { connect } from "react-redux";
import { getActiveUnits } from "../../store/actions/dbActions";
import { Container, Button } from "react-bootstrap";
import UnitRow from "../unitsRow/UnitsRow";
import { Link } from "react-router-dom";

export class Units extends Component {
  componentDidMount() {
    this.props.getActiveUnits();
  }
  render() {
    const { units } = this.props;
    return (
      <div>
        <Container fluid>
          <Button as={Link} to="/unit/create" variant="primary">
            + Add New Unit
          </Button>
          {units.map((unit, index) => {
            return <UnitRow key={index} unit={unit}></UnitRow>;
          })}
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    units: state.db.units,
  };
};

export default connect(mapStateToProps, { getActiveUnits })(Units);
