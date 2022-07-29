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
  SubMenu,
} from "react-pro-sidebar";
import { FiLogOut } from "react-icons/fi";
import {
  BsCalendarCheck,
  BsPeople,
  BsPerson,
  BsShopWindow,
  BsTextIndentRight,
  BsXLg,
  BsCalculator,
  BsEnvelope,
} from "react-icons/bs";
import "react-pro-sidebar/dist/css/styles.css";

export default function Sidebar({ menuCollapse, setMenuCollapse }) {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

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

            <SubMenu title="Accounting" icon={<BsCalculator />}>
              <MenuItem className="dropdown-menu-list mb-3">
                <Link to="/accounting-connections" style={{ color: "#000" }}>
                  Accounting Connections
                </Link>
              </MenuItem>

              <MenuItem>
                <Link to="/rules" style={{ color: "#000" }}>
                  Rules
                </Link>
              </MenuItem>
            </SubMenu>

            <SubMenu title="Inbox" icon={<BsEnvelope />}>
              <MenuItem className="dropdown-menu-list mb-3">
                <Link to="/inbox/segments" style={{ color: "#000" }}>
                  All Messages
                </Link>
              </MenuItem>

              <MenuItem>
                <Link to="/rules" style={{ color: "#000" }}>
                  Unread Messages
                </Link>
              </MenuItem>

              <MenuItem>
                <Link to="/rules" style={{ color: "#000" }}>
                  Awaiting Reply
                </Link>
              </MenuItem>

              <MenuItem>
                <Link to="/rules" style={{ color: "#000" }}>
                  Resovled
                </Link>
              </MenuItem>

              <MenuItem>
                <Link to="/rules" style={{ color: "#000" }}>
                  Starred
                </Link>
              </MenuItem>
            </SubMenu>

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
  );
}
