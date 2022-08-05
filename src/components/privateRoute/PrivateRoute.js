import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../menu/Sidebar";
import "./PrivateRoute.css";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  const [menuCollapse, setMenuCollapse] = useState(false);

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <>
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
              <div style={{ }}>
                <Component {...props} />
              </div>
            </div>
          </>
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}
