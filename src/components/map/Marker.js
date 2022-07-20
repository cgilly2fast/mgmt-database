import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

import LocationIcon from "../../img/Location.png";

const Marker = ({ data, text, onClick }) => {
  const popover = (
    <Popover id="popover-basic" style={{ position: "absolute" }}>
      <Popover.Header style={{ background: "#007bff", color: "#fff" }}>
        {data?.name}
      </Popover.Header>
      <Popover.Body className="popover-body">
        Address:{data?.address}
        <br />
        TMK:{data?.TMK}
      </Popover.Body>
    </Popover>
  );

  return (
    <div>
      <OverlayTrigger
        trigger={["click", "focus", "hover"]}
        placement="top"
        overlay={popover}
      >
        <img src={LocationIcon} alt={text} width="30" className="marker-img" />
      </OverlayTrigger>
    </div>
  );
};
export default Marker;
