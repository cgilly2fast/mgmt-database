import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "./UnitsRow.css";

export class UnitsRow extends Component {
  render() {
    const { unit } = this.props;
    const listings = unit.listings === undefined ? {} : unit.listings;
    return (
      <Row>
        <Col>
          <NavLink
            to={{
              pathname: "/unit/" + unit.id,
              state: { unit: unit },
            }}
          >
            {unit.picture !== "" ? (
              <img
                className="property_icon"
                alt="property unit main"
                src={unit.picture}
              />
            ) : (
              <i class="bi-house" />
            )}

            <span>{unit.name}</span>
            <span> {unit.address.city}</span>
          </NavLink>
        </Col>
        <Col>
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
                <a href={listings[key].url} target="_blank" rel="noreferrer">
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
        </Col>
      </Row>
    );
  }
}

export default UnitsRow;
