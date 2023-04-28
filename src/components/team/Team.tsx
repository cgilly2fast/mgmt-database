import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import TeamRow from "../teamRow/TeamRow";
import { Link } from "react-router-dom";
import { getTeam } from "../../API";
import Loader from "../loader/Loader";

export const Team: React.FC = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const teamdata = async () => {
      setLoading(true);
      const team = await getTeam();
      setTeam(team);
      setLoading(false);
    };
    teamdata();
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
                to="/teammate/create"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                + Add New Teammate
              </Link>
            </Button>
            {team.map((teammate, index) => {
              return <TeamRow key={index} teammate={teammate}></TeamRow>;
            })}
          </Container>
        </div>
      )}
    </>
  );
  // }
};

export default Team;
