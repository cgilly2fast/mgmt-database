import React, { useState } from "react";
import { Route, Outlet, Navigate } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../menu/Sidebar";
import "./PrivateRoute.css";
import { useAuth } from "../../context/Authcontext";
import { Container } from "react-bootstrap";

export const PrivateRoute: React.FC = () => {
  const { currentUser }: any = useAuth();
  const [menuCollapse, setMenuCollapse] = useState(false);

  return currentUser ? (
    <>
      <Container fluid className="p-0 d-flex">
        <div>
          <Sidebar
            setMenuCollapse={setMenuCollapse}
            menuCollapse={menuCollapse}
          />
        </div>
        <div
          className="main-div-detail"
          style={{
            marginLeft: !menuCollapse ? "18%" : "8%",
            width: !menuCollapse ? "80%" : "90%",
          }}
        >
          <div style={{}}>
            <Header />
            <Outlet />
          </div>
        </div>
      </Container>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
