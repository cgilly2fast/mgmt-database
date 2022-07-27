import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";
import OwnersRow from "../ownersRow/OwnersRow";
import { Link } from "react-router-dom";
import { getOwners } from "../../API";

export class Owners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owners: [],
    };
  }
  async componentDidMount() {
    const owner = await getOwners();
    this.setState({ owners: owner });
  }
  render() {
    const { owners } = this.state;
    return (
      <div>
        <Container fluid>
          <Button as={Link} to="/owner/create" variant="primary">
            + Add New Owner
          </Button>
          {owners.map((owner, index) => {
            return <OwnersRow key={index} owner={owner}></OwnersRow>;
          })}
        </Container>
      </div>
    );
  }
}

export default Owners;
