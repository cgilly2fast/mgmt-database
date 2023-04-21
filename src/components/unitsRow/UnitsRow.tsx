import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row } from "react-bootstrap";
import "./UnitsRow.css";
import { UnitsType } from "../../API/Types";
import Unit from "../unit/Unit";

interface UnitsRowProps {
  unit: UnitsType;
}

export const UnitsRow: React.FC<UnitsRowProps> = ({ unit }: UnitsRowProps) => {
  const listings = unit.listings === undefined ? {} : unit.listings;
  return (
    <Row className="units-row">
      <div className="units-div py-2">
        <div>
          <NavLink
            to={{
              pathname: "/unit/" + unit.id,
            }}
            className="units-pic-name-div"
          >
            {unit.picture.length ? (
              <img
                className="property_icon"
                alt="property unit main"
                src={
                  unit?.picture?.filter((item: any) => item?.isCurrent)[0]
                    ?.original
                }
              />
            ) : (
              <>
                <span className="not-image">
                  <i className="bi-house" />
                </span>
              </>
            )}

            <span>{unit.name}</span>
            <span> {unit?.address?.city}</span>
          </NavLink>
        </div>

        <div>
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
                  key={key}
                >
                  <img
                    className="icon"
                    alt="listing provider logo"
                    src={
                      "https://storage.googleapis.com/stinsonbeachpm.appspot.com/icons/platforms/" +
                      listings[key].provider +
                      ".png"
                    }
                  ></img>
                </a>
              );
            }
          })}
        </div>
      </div>
    </Row>
  );
};

export default UnitsRow;
