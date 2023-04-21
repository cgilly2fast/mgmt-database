import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTeammateById } from "../../API";
import BackButton from "../../img/BackButton.svg";
import { teamtype } from "../../API/Types";
import { BsPersonCircle } from "react-icons/bs";

export const Teammate: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { teammateId } = params;
  const [teammate, setTeammate] = useState<teamtype | null>(null);

  useEffect(() => {
    const teammatedata = async () => {
      const unitById = await getTeammateById(teammateId);
      setTeammate(unitById);
    };
    teammatedata();
  }, []);

  const address = teammate?.address === undefined ? {} : teammate?.address;

  return (
    <>
      <img
        src={BackButton}
        alt="back"
        style={{ height: "30px", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />

      <Container fluid>
        {teammate?.picture !== "" ? (
          <img
            className="profile_img_lg"
            alt="team member profile"
            src={teammate?.picture}
          />
        ) : (
          <i className="bi-chevron-person-circle">
            <BsPersonCircle
              style={{
                fontSize: "30px",
              }}
            />
          </i>
        )}
        <Button variant="primary">
          <Link
            to={{
              pathname: "/teammate/" + teammate?.id + "/edit",
              // state: unit,
            }}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            + Edit Teammate Info
          </Link>
        </Button>

        <h3>{teammate?.first_name + " " + teammate?.last_name}</h3>
        <p>
          <i className="bi-telephone"> {teammate?.phone} </i>
          <i className="bi-envelope"> {teammate?.email} </i>
        </p>
        <p>Position: {teammate?.position}</p>
        <a href={teammate?.hours_sheet}>
          <p>Hours Sheet</p>
        </a>
        <p>{address.display}</p>

        <p>Payment Type: {teammate?.payment_type}</p>
        <p>Payment Nickname: {teammate?.payment_nickname}</p>
      </Container>
    </>
  );
  // }
};

export default Teammate;
