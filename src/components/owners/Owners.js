import React, { Component } from "react";
import { connect } from "react-redux";
import { getOwners } from "../../store/actions/dbActions";
import { Container, Button } from "react-bootstrap";
import OwnersRow from "../ownersRow/OwnersRow";
import { Link } from "react-router-dom";

export class Owners extends Component {
  componentDidMount() {
    this.props.getOwners();
  }
  render() {
    const { owners } = this.props;
    console.log(this.props);
    return (
      <div>
        <Container>
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
const mapStateToProps = (state) => {
  return {
    owners: state.db.owners,
  };
};

export default connect(mapStateToProps, { getOwners })(Owners);
