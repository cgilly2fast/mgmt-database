import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./TeamRow.css";
import { teamtype } from "../../API/Types";
import {
  BsChevronCompactRight,
  BsEnvelope,
  BsPersonCircle,
  BsTelephone,
} from "react-icons/bs";

interface TeamRowProps {
  teammate: teamtype;
}

export const TeamRow: React.FC<TeamRowProps> = ({ teammate }: TeamRowProps) => {
  return (
    <Row className="teams-row">
      <div className="py-2 teams-list-div">
        <div>
          <NavLink
            to={{
              pathname: "/teammate/" + teammate?.id,
              // state: { teammate: teammate },
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
              <i className="bi-chevron-person-circle">
                <BsPersonCircle
                  style={{
                    fontSize: "30px",
                  }}
                />
              </i>
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
                  className="bi-telephone"
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
                  className="bi-envelope"
                  onClick={() => {
                    navigator.clipboard.writeText(teammate.email);
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

export default TeamRow;
