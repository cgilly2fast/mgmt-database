import React, { useState } from "react";
import { Nav, NavLink, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import "./Sidebar.css";
import {
  MenuItem,
  ProSidebar,
  Menu,
  SidebarContent,
  SidebarHeader,
} from "react-pro-sidebar";
import { FiLogOut } from "react-icons/fi";
import {
  BsCalendarCheck,
  BsPeople,
  BsPerson,
  BsShopWindow,
  BsTextIndentRight,
  BsXLg,
} from "react-icons/bs";
import "react-pro-sidebar/dist/css/styles.css";

export default function Sidebar({ menuCollapse, setMenuCollapse }) {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  // const [menuCollapse, setMenuCollapse] = useState(false);

  const history = useHistory();

  const menuIconClick = () => {
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

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
    <div id="header" style={{ width: !menuCollapse ? "270px" : "80px" }}>
      <ProSidebar collapsed={menuCollapse}>
        <SidebarHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: " center",
          }}
        >
          <NavLink to="/">
            <h4
              style={{
                color: "#007bff",
                margin: 0,
                width: !menuCollapse ? "100%" : "37px",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {!menuCollapse ? "Mgmt Database" : "MD"}
            </h4>
          </NavLink>
          <div className="closemenu" onClick={menuIconClick}>
            {menuCollapse ? (
              <BsXLg style={{ width: "15px" }} />
            ) : (
              <BsTextIndentRight />
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className="" style={{ background: "#f1f1f1" }}>
          <Menu iconShape="square">
            <MenuItem icon={<BsShopWindow />}>
              <Link to="/units" style={{ color: "#000" }}>
                Units
              </Link>
            </MenuItem>

            <MenuItem icon={<BsPerson />}>
              <Link to="/owners" style={{ color: "#000" }}>
                Owners
              </Link>
            </MenuItem>

            <MenuItem icon={<BsPeople />}>
              <Link to="/team" style={{ color: "#000" }}>
                Team
              </Link>
            </MenuItem>

            <MenuItem icon={<BsCalendarCheck />}>
              <Link to="/calendar" style={{ color: "#000" }}>
                Calendar
              </Link>
            </MenuItem>

            {currentUser ? (
              <MenuItem icon={<FiLogOut />}>
                <Button
                  variant="link"
                  onClick={handleLogout}
                  style={{
                    padding: "0px",
                    color: "#000",
                    textDecoration: "none",
                  }}
                >
                  Log Out
                </Button>
              </MenuItem>
            ) : (
              <Nav.Link as={Link} to="/login">
                Log In
              </Nav.Link>
            )}
          </Menu>
        </SidebarContent>
      </ProSidebar>
    </div>
    // <Navbar
    //   bg="light"
    //   expand="lg"
    //   className="col-md-12 d-none d-md-block sidebar"
    // >
    //   {/* <Navbar.Brand>
    //     <NavLink to="/units">
    //       <h4>Mgmt Database</h4>
    //     </NavLink>
    //   </Navbar.Brand> */}

    //   <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //   <Navbar.Collapse id="basic-navbar-nav">
    //     <Nav className="mr-auto navbar-nav">
    //       {error && <Alert variant="danger">{error}</Alert>}
    //       <Nav.Link as={Link} to="/units">
    //         Units
    //       </Nav.Link>

    //       <Nav.Link as={Link} to="/owners">
    //         Owners
    //       </Nav.Link>
    //       <Nav.Link as={Link} to="/team">
    //         Team
    //       </Nav.Link>
    //       <Nav.Link as={Link} to="/calendar">
    //         Calendar
    //       </Nav.Link>
    //       {currentUser ? (
    //         <Nav.Link>
    //           <Button
    //             variant="link"
    //             onClick={handleLogout}
    //             style={{ padding: "0px" }}
    //           >
    //             Log Out
    //           </Button>
    //         </Nav.Link>
    //       ) : (
    //         <Nav.Link as={Link} to="/login">Log In</Nav.Link>
    //       )}
    //     </Nav>
    //   </Navbar.Collapse>
    // </Navbar>
  );
}
