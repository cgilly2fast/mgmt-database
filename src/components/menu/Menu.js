import React, { useState } from "react";
import { Alert, Navbar, Nav, NavLink, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="col-md-12 d-none d-md-block sidebar"
    >
      {/* <Navbar.Brand>
        <NavLink to="/units">
          <h4>Mgmt Database</h4>
        </NavLink>
      </Navbar.Brand> */}

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto navbar-nav">
          {error && <Alert variant="danger">{error}</Alert>}
          <Nav.Link as={Link} to="/units">
            Units
          </Nav.Link>

          <Nav.Link as={Link} to="/owners">
            Owners
          </Nav.Link>
          <Nav.Link as={Link} to="/team">
            Team
          </Nav.Link>
          <Nav.Link as={Link} to="/calendar">
            Calendar
          </Nav.Link>
          {currentUser ? (
            <Nav.Link>
              <Button
                variant="link"
                onClick={handleLogout}
                style={{ padding: "0px" }}
              >
                Log Out
              </Button>
            </Nav.Link>
          ) : null}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
