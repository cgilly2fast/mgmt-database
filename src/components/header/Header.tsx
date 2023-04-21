import React from "react";
import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <Navbar bg="light">
      <Navbar.Brand>
        <NavLink to="/">
          <h4 style={{ color: "#007bff" }}>Mgmt Database</h4>
        </NavLink>
      </Navbar.Brand>
    </Navbar>
  );
};

export default Header;
