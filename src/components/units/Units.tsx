import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import UnitRow from "../unitsRow/UnitsRow";
import { Link } from "react-router-dom";
import { getActiveUnits } from "../../API";
import Loader from "../loader/Loader";
import { UnitsType } from "../../API/Types";

export const Units: React.FC = () => {
  const [units, setUnits] = useState<UnitsType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unitsdata = async () => {
      setLoading(true);
      const activeUnits = await getActiveUnits() as UnitsType[];
      setUnits(activeUnits);
      setLoading(false);
    };
    unitsdata();
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
                to="/unit/add-new-unit"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                + Add New Unit
              </Link>
            </Button>
            {units.map((unit, index) => {
              return <UnitRow key={index} unit={unit} />;
            })}
          </Container>
        </div>
      )}
    </>
  );
};

export default Units;
