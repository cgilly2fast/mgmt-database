import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";
import UnitRow from "../unitsRow/UnitsRow";
import { Link } from "react-router-dom";
import { getActiveUnits } from "../../API";
import Loader from "../loader/Loader";

export class Units extends Component {
  constructor(props) {
    super(props);
    this.state = {
      units: [],
      loading: false,
    };
  }
  async componentDidMount() {
    this.setState({ loading: true });
    const activeUnits = await getActiveUnits();
    this.setState({ units: activeUnits });
    this.setState({ loading: false });
  }
  render() {
    const { units, loading } = this.state;
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
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
        )}
      </>
    );
  }
}

export default Units;
