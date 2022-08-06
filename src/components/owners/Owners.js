import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";
import OwnersRow from "../ownersRow/OwnersRow";
import { Link } from "react-router-dom";
import { getOwners } from "../../API";
import Loader from "../loader/Loader";

export class Owners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owners: [],
      loading: false,
    };
  }
  async componentDidMount() {
    this.setState({ loading: true });
    const owner = await getOwners();
    this.setState({ owners: owner });
    this.setState({ loading: false });
  }
  render() {
    const { owners, loading } = this.state;
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
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
        )}
      </>
    );
  }
}

export default Owners;
