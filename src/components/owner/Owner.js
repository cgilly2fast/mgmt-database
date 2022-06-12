import React, { Component } from "react";
import { connect } from "react-redux";
import { getOwnerById } from "../../store/actions/dbActions";
import { Container, Row, Card, Button } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import "./Owner.css";

// import "./Owner.css";

export class Owner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "",
    };
  }
  componentDidMount() {
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.owner
    ) {
      this.setState({ owner: this.props.location.state.owner });
    } else {
      const { ownerId } = this.props.match.params;
      this.props.getOwnerById(ownerId).then(() => {
        this.setState({ owner: this.props.owner });
      });
    }
  }
  render() {
    //const owner = this.props.location.state.owner;
    const { owner } = this.state;
    const address = owner.address === undefined ? {} : owner.address;
    const units = owner.units === undefined ? {} : owner.units;

    return (
      <Container>
        {owner.picture !== "" ? (
          <img
            className="profile_img_lg"
            alt="property owner"
            src={owner.picture}
          />
        ) : (
          <i class="bi-chevron-person-circle" />
        )}
        <Button
          as={Link}
          to={{
            pathname: "/owner/" + owner.uuid + "/edit",
            state: { owner: owner },
          }}
          variant="primary"
        >
          + Edit Owner Info
        </Button>

        <h3>{owner.first_name + " " + owner.last_name}</h3>
        <p>
          <i class="bi-telephone"> {owner.phone} </i>
          <i class="bi-envelope"> {owner.email} </i>
        </p>
        <p>Company Name: {owner.company_name}</p>
        <p>{address.display}</p>

        <p>Airbnb Username: {owner.airbnb_username}</p>
        <p>VRBO Username: {owner.vrbo_username}</p>
        <h5>Tax & Licensing</h5>
        <p>Business Number: {owner.business_number}</p>
        <p>Business Pin: {owner.business_pin}</p>
        <p>TOT Account: {owner.tot_account + ""}</p>
        <p>TOT Pin: {owner.tot_pin}</p>
        <h5>Operations</h5>
        <p>Active: {owner.active + ""}</p>
        <p>Percentage: {owner.percentage + ""}</p>
        <p>Owner Statements: {owner.owner_statements + ""}</p>
        <p>Owner Partnership: {owner.partnership + ""}</p>
        <p>Pay Taxes: {owner.pay_tax + ""}</p>
        <h5>Units</h5>
        <Container>
          <Row>
            {Object.keys(units).map((key) => {
              return (
                <NavLink to={"/unit/" + units[key].id}>
                  <Card className="unit_card">
                    <Card.Img variant="top" src={units[key].picture} />
                    <Card.Body>
                      <Card.Title>{units[key].name}</Card.Title>
                    </Card.Body>
                  </Card>
                </NavLink>
              );
            })}
          </Row>
        </Container>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    owner: state.db.owner,
  };
};

export default connect(mapStateToProps, { getOwnerById })(Owner);
