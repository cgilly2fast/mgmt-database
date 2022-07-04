import React from "react";
import { Col, Row } from "react-bootstrap";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../header/Header";
import Sidebar from "../menu/Sidebar";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <Row>
            {/* <Header /> */}
            <Col xs={2} style={{ padding: "0px" }}>
              <Sidebar />
            </Col>
            <Col xs={10} className="mt-5">
              <Component {...props} />
            </Col>
          </Row>
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}
