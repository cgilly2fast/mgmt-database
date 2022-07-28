import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";
import TeamRow from "../teamRow/TeamRow";
import { Link } from "react-router-dom";
import { getTeam } from "../../API";
import Loader from "../loader/Loader";

export class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: [],
      loading: false,
    };
  }
  async componentDidMount() {
    this.setState({ loading: true });
    const team = await getTeam();
    this.setState({ team: team });
    this.setState({ loading: false });
  }
  render() {
    const { team, loading } = this.state;

    return (
      <>
        {loading ? (
          <Loader />
        ) : (
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
        )}
      </>
    );
  }
}

export default Team;
