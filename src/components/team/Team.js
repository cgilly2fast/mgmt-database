import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";
import TeamRow from "../teamRow/TeamRow";
import { Link } from "react-router-dom";
import { getTeam } from "../../API";

export class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: [],
    };
  }
  async componentDidMount() {
    const team = await getTeam();
    this.setState({ team: team });
  }
  render() {
    const { team } = this.state;

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

export default Team;
