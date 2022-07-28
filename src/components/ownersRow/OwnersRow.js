import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./OwnersRow.css";
//import "./UnitsRow.css";

export class OwnersRow extends Component {
  render() {
    const { owner } = this.props;

    return (
      <Row className="owners-row">
        <div className="owners-list-div py-2">
          <div>
            <NavLink
              to={{
                pathname: "/owner/" + owner.uuid,
                state: { owner: owner },
              }}
              className="owners-pic-name-div"
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
          </div>
        </div>
      </Row>
    );
  }
}

export default OwnersRow;
