import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Header = () => {
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
