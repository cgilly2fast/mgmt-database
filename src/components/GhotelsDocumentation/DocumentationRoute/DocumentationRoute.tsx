import React from "react";
import { Outlet, Route } from "react-router-dom";
import Hader from "../Hader";
import Sidebar from "../Sideber";
import { Outletdiv } from "./styled";

export default function DocumentationRoute() {
  return (
    <>
      <div>
        <Hader />
        <div style={{ display: "flex" }}>
          <div>
            <Sidebar />
          </div>
          <Outletdiv>
            <Outlet />
          </Outletdiv>
        </div>
      </div>
    </>
  );
}
