import React, { Component } from "react";
import { Container, Row, Nav, Card, Button, Col } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import moment from "moment-timezone";
import BackButton from "../../img/BackButton.svg";

import "./Unit.css";
import { getUnitById } from "../../API";

export class Unit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unit: "",
    };
  }
  async componentDidMount() {
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.unit
    ) {
      this.setState({ unit: this.props.location.state.unit });
    } else {
      const { unitId } = this.props.match.params;
      const unitById = await getUnitById(unitId);
      this.setState({ unit: unitById });
    }
  }

  render() {
    //const unit = this.props.location.state.unit;
    const { unit } = this.state;
    const address = unit.address === undefined ? {} : unit.address;
    const owner = unit.owner === undefined ? {} : unit.owner;
    const capacity = unit.capacity === undefined ? {} : unit.capacity;
    const listings = unit.listings === undefined ? {} : unit.listings;
    // let vrboUrl = "";
    // let airbnbUrl = "";

    // console.log(vrboUrl);
    // console.log(airbnbUrl);

    return (
      <>
        <img
          src={BackButton}
          alt="back"
          style={{ height: "30px", cursor: "pointer" }}
          onClick={() => this.props.history.goBack()}
        />

        <Container fluid>
          <img
            className="property_img"
            alt="unit living room"
            src={unit.picture}
          />
          <Button
            as={Link}
            to={{
              pathname: "/unit/" + unit.id + "/edit",
              state: { unit: unit },
            }}
            variant="primary"
          >
            + Edit Unit Info
          </Button>
          <Container fluid>
            <div>
              <h3>{unit.name}</h3>
              {unit.guidebook_url !== "" ? (
                <a href={unit.guidebook_url} target="_blank" rel="noreferrer">
                  <img
                    className="icon"
                    alt="hostfully logo"
                    src="https://storage.googleapis.com/stinsonbeachpm.appspot.com/icons/platforms/hostfully.png"
                  ></img>
                </a>
              ) : null}
              {Object.keys(listings).map((key) => {
                if (listings[key].active === true) {
                  return (
                    <a
                      href={listings[key].url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className="icon"
                        alt="listing porvider logo"
                        src={
                          "https://storage.googleapis.com/stinsonbeachpm.appspot.com/icons/platforms/" +
                          listings[key].provider +
                          ".png"
                        }
                      />
                    </a>
                  );
                }
              })}
            </div>
            <p>
              {capacity.max} guests · {capacity.bedrooms} bedrooms ·{" "}
              {capacity.beds} bed · {capacity.bathrooms} bathrooms{" "}
            </p>
            <Row>
              <Nav>
                <Nav.Item>
                  <Nav.Link
                    eventKey="1"
                    target="_blank"
                    href={unit.listingSettings}
                  >
                    Listing Settings
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="2"
                    target="_blank"
                    href={unit.amenitiesList}
                  >
                    Amenities List
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="3"
                    target="_blank"
                    href={unit.houseManaul}
                  >
                    House Manual
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="4" target="_blank" href={unit.faq}>
                    FAQ
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="5"
                    target="_blank"
                    href={unit.photosArchive}
                  >
                    Photos
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to={`/calendar/${unit?.id}`}>
                    Calendar
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>
          </Container>

          <p>{address.display}</p>

          <p>Room type: {unit.room_type}</p>
          <p>Wifi: {unit.wifi}</p>
          <p>Wifi Password: {unit.wifi_password}</p>
          <p>
            Check Out:{" "}
            {moment.parseZone("1995-03-17T" + unit.check_out).format("h:mm a")}
          </p>
          <p>
            Check In:{" "}
            {moment.parseZone("1995-03-17T" + unit.check_in).format("h:mm a")}
          </p>

          <p>Tax Rate: {unit.tax_rate}</p>

          <h5>Owner</h5>
          <p>
            <NavLink to={"/owner/" + owner.uuid}>
              {owner.first_name + " " + owner.last_name}
            </NavLink>{" "}
            <i class="bi-telephone"> </i>
            {owner.phone + " "}
            <i class="bi-envelope" /> {" " + owner.email + " "}
            <i class="bi bi-chevron-compact-right" />
          </p>
          <h5>Code Operations</h5>
          <p>Remit Taxes: {unit.remit_taxes + ""}</p>
          <p>Send Guest Info: {unit.send_guest_info + ""}</p>
          {unit.guest_info_type && (
            <p>Guest Info Type: {unit.guest_info_type + ""}</p>
          )}
          <p>Active: {unit.active + ""}</p>
          <h5>Listings</h5>
          <Container fluid>
            <Row>
              {Object.keys(listings).map((key) => {
                return (
                  <Col>
                    <NavLink
                      to={{
                        pathname:
                          "/unit/" +
                          unit.id +
                          "/listing/" +
                          listings[key].provider +
                          "/edit",
                        state: { unit: unit, listing: listings[key] },
                      }}
                    >
                      <Card className="unit_card_listings">
                        <Card.Img variant="top" src={listings[key].picture} />
                        <Card.Body>
                          <Card.Title>
                            <img
                              className="icon"
                              alt="listing provider logo"
                              src={
                                "https://storage.googleapis.com/stinsonbeachpm.appspot.com/icons/platforms/" +
                                listings[key].provider +
                                ".png"
                              }
                            />{" "}
                            {" " +
                              (listings[key].active ? "Active" : "Inactive")}
                          </Card.Title>
                          <Card.Text>{listings[key].public_name}</Card.Text>
                        </Card.Body>
                      </Card>
                    </NavLink>
                  </Col>
                );
              })}
              <NavLink
                to={{
                  pathname: "/unit/" + unit.id + "/listing/create",
                  state: { unit: unit },
                }}
              >
                <Card style={{ width: "33%" }}>
                  <Card.Img variant="top" src="" />
                  <Card.Body>
                    <Card.Text>+ Add New Listing</Card.Text>
                  </Card.Body>
                </Card>
              </NavLink>
            </Row>
          </Container>
        </Container>
      </>
    );
  }
}

export default Unit;
