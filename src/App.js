import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Units from "./components/units/Units";
import Unit from "./components/unit/Unit";
import UnitForm from "./components/unitForm/UnitForm";
import Owners from "./components/owners/Owners";
import Owner from "./components/owner/Owner";
import Team from "./components/team/Team";
import Teammate from "./components/teammate/Teammate";
import TeammateForm from "./components/teammateForm/TeammateForm";
import OwnerForm from "./components/ownerForm/OwnerForm";
import ListingForm from "./components/listingForm/ListingForm";

import { Container } from "react-bootstrap";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import { AuthProvider } from "./context/AuthContext";
import Calendar from "./components/calendar/Calendar";
import SelectUnit from "./components/selectUnit/SelectUnit";
import Map from "./components/map/Map";
import Accounting from "./components/accounting/Accounting";
import Rules from "./components/rules/Rules";

export default class App extends Component {
  render() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Container fluid className="p-0">
            <Switch>
              <PrivateRoute exact path="/" component={Units} />
              <PrivateRoute exact path="/units" component={Units} />
              <PrivateRoute exact path="/calendar" component={SelectUnit} />
              <PrivateRoute exact path="/rules" component={Rules} />
              <PrivateRoute exact path="/calendar/:id" component={Calendar} />
              <PrivateRoute
                exact
                path="/accounting-connections"
                component={Accounting}
              />
              <PrivateRoute exact path="/unit/create" component={UnitForm} />
              <PrivateRoute exact path="/unit/:unitId" component={Unit} />
              <PrivateRoute
                exact
                path="/unit/:unitId/edit"
                component={UnitForm}
              />
              <PrivateRoute
                exact
                path="/unit/:unitId/listing/create"
                component={ListingForm}
              />
              <PrivateRoute
                exact
                path="/unit/:unitId/listing/:provider/edit"
                component={ListingForm}
              />
              <PrivateRoute exact path="/owners" component={Owners} />
              <PrivateRoute exact path="/owner/create" component={OwnerForm} />
              <PrivateRoute exact path="/owner/:ownerId" component={Owner} />
              <PrivateRoute
                exact
                path="/owner/:ownerId/edit"
                component={OwnerForm}
              />

              <PrivateRoute exact path="/team" component={Team} />
              <PrivateRoute
                exact
                path="/teammate/create"
                component={TeammateForm}
              />
              <PrivateRoute
                exact
                path="/teammate/:teammateId/edit"
                component={TeammateForm}
              />
              <PrivateRoute
                exact
                path="/teammate/:teammateId"
                component={Teammate}
              />
              <Route exact path="/map" component={Map} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot" component={ForgotPassword} />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    );
  }
}
