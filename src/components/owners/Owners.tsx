import React, { Component, useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import OwnersRow from "../ownersRow/OwnersRow";
import { Link } from "react-router-dom";
import { getOwners } from "../../API";
import Loader from "../loader/Loader";

export const Owners: React.FC = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const ownerdata = async () => {
      setLoading(true);
      const owner = await getOwners();
      setOwners(owner);
      setLoading(false);
    };
    ownerdata();
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Container fluid>
            <Button variant="primary">
              <Link
                to="/owner/create"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                + Add New Owner
              </Link>
            </Button>
            {owners.map((owner, index) => {
              return <OwnersRow key={index} owner={owner}></OwnersRow>;
            })}
          </Container>
        </div>
      )}
    </>
  );
  // }
};

export default Owners;
