import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./OwnersRow.css";
//import "./UnitsRow.css";

export class OwnersRow extends Component {
  render() {
    const { owner } = this.props;

    return (
      <Row>
        <Col>
          <NavLink
            to={{
              pathname: "/owner/" + owner.uuid,
              state: { owner: owner },
            }}
            className=""
          >
            {owner.picture !== "" ? (
              <img
                className="profile_icon"
                alt="owner profile"
                src={owner.picture}
              />
            ) : (
              <i class="bi-chevron-person-circle" />
            )}
            <span>{owner.first_name}</span>

            <span> {owner.last_name}</span>
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
                    navigator.clipboard.writeText(owner.phone);
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
                    navigator.clipboard.writeText(owner.email);
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
