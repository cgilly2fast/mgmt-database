import React, { useEffect, useState } from "react";
import { Container, Row, Nav, Card, Button, Col } from "react-bootstrap";
import { NavLink, Link, useParams } from "react-router-dom";
import moment from "moment-timezone";
import BackButton from "../../img/BackButton.svg";
import "./Unit.css";
import { getUnitById } from "../../API";
import { UnitsType } from "../../API/Types";
import { useNavigate } from "react-router-dom";
import UpdateAmenitiesModal from "../updateAmenitiesModal/UpdateAmenitiesModal";

const Unit: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { unitId } = params;
  const [unit, setUnit] = useState<UnitsType | null>(null);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const unitdata = async () => {
      const unitById = await getUnitById(unitId);
      setUnit(unitById);
    };
    unitdata();
  }, []);

  const address = unit?.address === undefined ? {} : unit?.address;
  const owner = unit?.owner === undefined ? {} : unit?.owner;
  const capacity = unit?.capacity === undefined ? {} : unit?.capacity;
  const listings = unit?.listings === undefined ? {} : unit?.listings;

  return (
    unit && (
      <>
        <img
          src={BackButton}
          alt="back"
          style={{ height: "30px", cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />

        <Container fluid>
          {unit?.picture?.length ? (
            <>
              <img
                className="property_img"
                alt="unit living room"
                src={
                  unit?.picture?.filter((item) => item?.isCurrent)[0]?.original
                }
              />
              <br />
            </>
          ) : (
            <div className="not-image-wrapper"></div>
          )}

          <Button variant="primary">
            <Link
              to={{
                pathname: "/unit/" + unit.id + "/edit-new",
              }}
              state={unit}
              style={{ color: "#fff", textDecoration: "none" }}
            >
              + Edit Unit Info
            </Link>
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
              {capacity?.max} guests · {capacity?.bedrooms} bedrooms ·{" "}
              {capacity?.beds} bed · {capacity?.bathrooms} bathrooms{" "}
            </p>
            <Row>
              <Nav>
                <Nav.Item>
                  <Nav.Link
                    eventKey="1"
                    target="_blank"
                    href={unit?.listing_settings}
                  >
                    Listing Settings
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="2"
                    target="_blank"
                    onClick={() => {
                      setShow(true);
                    }}
                  >
                    Amenities List
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="3"
                    target="_blank"
                    href={unit?.house_manaul}
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
                  <Nav.Link as={Link} to={`/unit/${unit?.id}/add-images`}>
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
            <NavLink to={"/owner/" + owner?.uuid}>
              {owner?.first_name + " " + owner?.last_name}
            </NavLink>{" "}
            <i className="bi-telephone"> </i>
            {owner?.phone + " "}
            <i className="bi-envelope" /> {" " + owner?.email + " "}
            <i className="bi bi-chevron-compact-right" />
          </p>
          <h5>Code Operations</h5>
          <p>Remit Taxes: {unit.remit_taxes + ""}</p>
          <p>Send Guest Info: {unit.send_guest_info + ""}</p>
          {unit?.guest_info_type && (
            <p>Guest Info Type: {unit?.guest_info_type + ""}</p>
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
                      }}
                      state={{ unit: unit, listing: listings[key] }}
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
                }}
                state={unit}
              >
                <Card style={{ width: "410px" }}>
                  <Card.Img variant="top" src="" />
                  <Card.Body>
                    <Card.Text>+ Add New Listing</Card.Text>
                  </Card.Body>
                </Card>
              </NavLink>
            </Row>
          </Container>
        </Container>
        <UpdateAmenitiesModal
          show={show}
          close={() => {
            setShow(false);
          }}
        />
      </>
    )
  );
};

export default Unit;
