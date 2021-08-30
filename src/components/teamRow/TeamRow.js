import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
//import "./OwnersRow.css";
//import "./UnitsRow.css";

export class OwnersRow extends Component {
  render() {
    const { teammate } = this.props;

    return (
      <Row>
        <Col>
          <NavLink
            to={{
              pathname: "/teammate/" + teammate.uuid,
              state: { teammate: teammate },
            }}
            className=""
          >
            {teammate.picture !== "" ? (
              <img
                className="profile_icon"
                alt="owner profile"
                src={teammate.picture}
              />
            ) : (
              <span>
                <i class="bi-person-circle" />
              </span>
            )}
            <span>{teammate.first_name}</span>

            <span> {teammate.last_name}</span>
          </NavLink>
        </Col>
        <Col>
          <p>
            <OverlayTrigger
              overlay={<Tooltip id="tooltip-disabled">Click to copy</Tooltip>}
            >
              <span className="d-inline-block">
                <i
                  class="bi-telephone"
                  onClick={() => {
                    navigator.clipboard.writeText(teammate.phone);
                  }}
                >
                  {" "}
                </i>
              </span>
            </OverlayTrigger>
            <OverlayTrigger
              overlay={<Tooltip id="tooltip-disabled">Click to copy</Tooltip>}
            >
              <span className="d-inline-block">
                <i
                  class="bi-envelope"
                  onClick={() => {
                    navigator.clipboard.writeText(teammate.email);
                  }}
                >
                  {" "}
                </i>
              </span>
            </OverlayTrigger>

            <i class="bi bi-chevron-compact-right" />
          </p>
        </Col>
      </Row>
    );
  }
}

export default OwnersRow;
