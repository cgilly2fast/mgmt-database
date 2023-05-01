import React, { useEffect, useState } from "react";
import { Container, Row, Card, Button } from "react-bootstrap";
import { NavLink, Link, useParams, useNavigate } from "react-router-dom";
import "./Owner.css";
import BackButton from "../../img/BackButton.svg";
import { getOwnerById } from "../../API";
import { OwnerType } from "../../API/Types";

export const Owner: React.FC = () => {
  const [owner, setOwner] = useState<OwnerType>();
  const params = useParams();
  const { ownerId } = params;
  const navigate = useNavigate();

  useEffect(() => {
    const ownerdata = async () => {
      const ownerDataById = await getOwnerById(ownerId) as OwnerType;
      setOwner(ownerDataById);
    };
    ownerdata();
  }, []);

  const address = owner?.address === undefined ? {} : owner?.address;
  const units = owner?.units === undefined ? {} : owner?.units;

  return (
    <>
      <img
        src={BackButton}
        alt="back"
        style={{ height: "30px", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />

      <Container fluid>
        {owner?.picture !== "" ? (
          <img
            className="profile_img_lg"
            alt="property owner"
            src={owner?.picture}
          />
        ) : (
          <i className="bi-chevron-person-circle" />
        )}
        <Button variant="primary">
          <Link
            to={{
              pathname: "/owner/" + owner?.uuid + "/edit",
            }}
            state={{ owner: owner }}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            + Edit Owner Info
          </Link>
        </Button>

        <h3>{owner?.first_name + " " + owner?.last_name}</h3>
        <p>
          <i className="bi-telephone"> {owner?.phone} </i>
          <i className="bi-envelope"> {owner?.email} </i>
        </p>
        <p>Company Name: {owner?.company_name}</p>
        <p>{address.display}</p>

        <p>Airbnb Username: {owner?.airbnb_username}</p>
        <p>VRBO Username: {owner?.vrbo_username}</p>
        <h5>Tax & Licensing</h5>
        <p>Business Number: {owner?.business_number}</p>
        <p>Business Pin: {owner?.business_pin}</p>
        <p>TOT Account: {owner?.tot_account + ""}</p>
        <p>TOT Pin: {owner?.tot_pin}</p>
        <h5>Operations</h5>
        <p>Active: {owner?.active + ""}</p>
        <p>Percentage: {owner?.percentage + ""}</p>
        <p>Owner Statements: {owner?.owner_statements + ""}</p>
        <p>Owner Partnership: {owner?.partnership + ""}</p>
        <p>Pay Taxes: {owner?.pay_tax + ""}</p>
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
    </>
  );
};

export default Owner;
