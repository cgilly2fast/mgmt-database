import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./OwnersRow.css";
import { OwnerType } from "../../API/Types";
import {
  BsChevronCompactRight,
  BsEnvelope,
  BsPersonCircle,
  BsTelephone,
} from "react-icons/bs";

interface OwnersRowProps {
  owner: OwnerType;
}

export const OwnersRow: React.FC<OwnersRowProps> = ({
  owner,
}: OwnersRowProps) => {
  return (
    <Row className="owners-row">
      <div className="owners-list-div py-2">
        <div>
          <NavLink
            to={{
              pathname: "/owner/" + owner?.id,
            }}
            className="owners-pic-name-div"
          >
            {owner?.picture !== "" ? (
              <img
                className="profile_icon"
                alt="owner profile"
                src={owner?.picture}
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
            <span>{owner?.first_name}</span>

            <span> {owner?.last_name}</span>
          </NavLink>
        </div>
        <div>
          <p style={{ margin: "0px" }}>
            <OverlayTrigger
              overlay={<Tooltip id="tooltip-disabled">Click to copy</Tooltip>}
            >
              <span className="d-inline-block">
                <i
                  className="bi-telephone"
                  onClick={() => {
                    navigator.clipboard.writeText(owner?.phone);
                  }}
                ></i>
              </span>
            </OverlayTrigger>
            <OverlayTrigger
              overlay={<Tooltip id="tooltip-disabled">Click to copy</Tooltip>}
            >
              <span className="d-inline-block">
                <i
                  className="bi-envelope"
                  onClick={() => {
                    navigator.clipboard.writeText(owner?.email);
                  }}
                ></i>
              </span>
            </OverlayTrigger>

            <i className="bi bi-chevron-compact-right"></i>
          </p>
        </div>
      </div>
    </Row>
  );
};

export default OwnersRow;
