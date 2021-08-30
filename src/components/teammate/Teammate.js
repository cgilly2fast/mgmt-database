import React, { Component } from "react";
import { connect } from "react-redux";
import { getTeammateById } from "../../store/actions/dbActions";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export class Teammate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teammate: "",
    };
  }
  componentDidMount() {
    const { teammateId } = this.props.match.params;
    console.log(teammateId);
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.teammate
    ) {
      this.setState({ teammate: this.props.location.state.teammate });
    } else {
      this.props.getTeammateById(teammateId).then(() => {
        this.setState({ teammate: this.props.teammate });
      });
    }
  }
  render() {
    //const owner = this.props.location.state.owner;
    const { teammate } = this.state;
    const address = teammate.address === undefined ? {} : teammate.address;

    return (
      <Container>
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    teammate: state.db.teammate,
  };
};

export default connect(mapStateToProps, { getTeammateById })(Teammate);
