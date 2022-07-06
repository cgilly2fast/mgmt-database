import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../menu/Sidebar";

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
              style={{
                marginLeft: !menuCollapse ? "18%" : "8%",
                width: !menuCollapse ? "80%" : "90%",
              }}
            >
              <div style={{ paddingTop: "20px" }}>
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
