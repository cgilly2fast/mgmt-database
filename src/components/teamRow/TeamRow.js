import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./TeamRow.css";

export class OwnersRow extends Component {
  render() {
    const { teammate } = this.props;

    return (
      <Row className="teams-row">
        <div className="py-2 teams-list-div">
          <div>
            <NavLink
              to={{
                pathname: "/teammate/" + teammate.uuid,
                state: { teammate: teammate },
              }}
              className="teams-pic-name-div"
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
          </div>
          <div>
            <p style={{ margin: "0px" }}>
              <OverlayTrigger
                overlay={<Tooltip id="tooltip-disabled">Click to copy</Tooltip>}
              >
                <span className="d-inline-block">
                  <i
                    class="bi-telephone"
                    onClick={() => {
                      navigator.clipboard.writeText(teammate.phone);
                    }}
                  ></i>
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
          </div>
        </div>
      </Row>
    );
  }
}

export default OwnersRow;
