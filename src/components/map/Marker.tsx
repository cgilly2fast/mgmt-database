import { OverlayTrigger, Popover } from "react-bootstrap";

import LocationIcon from "../../img/Location.png";

const Marker = ({ tooltip, text, onClick }: any): JSX.Element => {
  const popover = (
    <Popover id="popover-basic" style={{ position: "absolute" }}>
      <Popover.Header style={{ background: "#007bff", color: "#fff" }}>
        {tooltip?.name}
      </Popover.Header>
      <Popover.Body className="popover-body">
        Address:{tooltip?.address}
        <br />
        TMK:{tooltip?.TMK}
      </Popover.Body>
    </Popover>
  );

  return (
    <div onClick={onClick}>
      <OverlayTrigger
        trigger={["click", "focus", "hover"]}
        placement="top"
        overlay={popover}
      >
        <img src={LocationIcon} alt={text} width="30" />
      </OverlayTrigger>
    </div>
  );
};
export default Marker;
