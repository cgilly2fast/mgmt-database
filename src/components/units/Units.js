import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";
import UnitRow from "../unitsRow/UnitsRow";
import { Link } from "react-router-dom";
import { getActiveUnits } from "../../API";

export class Units extends Component {
  constructor(props) {
    super(props);
    this.state = {
      units: [],
    };
  }
  async componentDidMount() {
    const activeUnits = await getActiveUnits();
    this.setState({ units: activeUnits });
  }
  render() {
    const { units } = this.state;
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

export default Units;
