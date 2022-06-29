import React, { Component } from "react";
import { connect } from "react-redux";
import { getTeam } from "../../store/actions/dbActions";
import { Container, Button } from "react-bootstrap";
import TeamRow from "../teamRow/TeamRow";
import { Link } from "react-router-dom";

export class Team extends Component {
  componentDidMount() {
    this.props.getTeam();
  }
  render() {
    const { team } = this.props;

    return (
      <div>
        <Container fluid>
          <Button as={Link} to="/teammate/create" variant="primary">
            + Add New Teammate
          </Button>
          {team.map((teammate, index) => {
            return <TeamRow key={index} teammate={teammate}></TeamRow>;
          })}
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    team: state.db.team,
  };
};

export default connect(mapStateToProps, { getTeam })(Team);
