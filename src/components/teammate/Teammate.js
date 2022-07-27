import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getTeammateById } from "../../API";
import BackButton from "../../img/BackButton.svg";

export class Teammate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teammate: "",
    };
  }
  async componentDidMount() {
    const { teammateId } = this.props.match.params;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.teammate
    ) {
      this.setState({ teammate: this.props.location.state.teammate });
    } else {
      const teammatedata = await getTeammateById(teammateId);
      this.setState({ teammate: teammatedata });
    }
  }
  render() {
    const { teammate } = this.state;
    const address = teammate.address === undefined ? {} : teammate.address;

    return (
      <>
        <img
          src={BackButton}
          alt="back"
          style={{ height: "30px", cursor: "pointer" }}
          onClick={() => this.props.history.goBack()}
        />

        <Container fluid>
          {teammate.picture !== "" ? (
            <img
              className="profile_img_lg"
              alt="team member profile"
              src={teammate.picture}
            />
          ) : (
            <i class="bi-chevron-person-circle" />
          )}
          <Button
            as={Link}
            to={{
              pathname: "/teammate/" + teammate.uuid + "/edit",
              state: { teammate: teammate },
            }}
            variant="primary"
          >
            + Edit Teammate Info
          </Button>

          <h3>{teammate.first_name + " " + teammate.last_name}</h3>
          <p>
            <i class="bi-telephone"> {teammate.phone} </i>
            <i class="bi-envelope"> {teammate.email} </i>
          </p>
          <p>Position: {teammate.position}</p>
          <a href={teammate.hours_sheet}>
            <p>Hours Sheet</p>
          </a>
          <p>{address.display}</p>

          <p>Payment Type: {teammate.payment_type}</p>
          <p>Payment Nickname: {teammate.payment_nickname}</p>
        </Container>
      </>
    );
  }
}

export default Teammate;
