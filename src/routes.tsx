import { useRoutes } from "react-router-dom";
import Signup from "./components/signup/Signup";
import { ForgotPassword } from "./components/forgotPassword/ForgotPassword";
import { Login } from "./components/login/Login";
import { PrivateRoute } from "./components/privateRoute/PrivateRoute";
import Units from "./components/units/Units";
import Unit from "./components/unit/Unit";
import Owners from "./components/owners/Owners";
import Owner from "./components/owner/Owner";
import UnreadMessage from "./components/unreadMessage/UnreadMessage";
import Team from "./components/team/Team";
import Teammate from "./components/teammate/Teammate";
import AllMessages from "./components/allMessages/AllMessages";
import Chat from "./components/chat/Chat";
import MessagingRules from "./components/MessagingRules/MessagingRules";
import RulesMessage from "./components/rulesMessage/RulesMessage";
import Accounting from "./components/accounting/Accounting";
import AccountingRulesForm from "./components/accountingRulesForm/AccountingRulesForm";
import RuleHistory from "./components/ruleHistory/RuleHistory";
import Addimages from "./components/addImages/Addimages";
import Map from "./components/map/Map";
import Calendar from "./components/calendar/Calendar";
import NewCalendar from "./components/newCalendar/NewCalendar";

export default function Router() {
  let element = useRoutes([
    {
      path: "/",
      element: <PrivateRoute />,
      children: [
        {
          path: "/",
          element: <Units />,
        },
        {
          path: "/units",
          element: <Units />,
        },
        {
          path: "/unit/:unitId",
          element: <Unit />,
        },
        {
          path: "/unit/:unitId/add-images",
          element: <Addimages />,
        },
        {
          path: "/calendar/:id",
          element: <Calendar />,
        },
        {
          path: "/calendar",
          element: <NewCalendar />,
        },
        {
          path: "/owners",
          element: <Owners />,
        },
        {
          path: "/owner/:ownerId",
          element: <Owner />,
        },
        {
          path: "/inbox/segments/unreadmessage",
          element: <UnreadMessage />,
        },
        {
          path: "/inbox/segments",
          element: <AllMessages />,
        },
        {
          path: "/messaging-rules",
          element: <MessagingRules />,
        },
        {
          path: "/rules/:id",
          element: <RulesMessage />,
        },
        {
          path: "/inbox/thread/:id",
          element: <Chat />,
        },
        {
          path: "/team",
          element: <Team />,
        },
        {
          path: "/teammate/:teammateId",
          element: <Teammate />,
        },
        {
          path: "/accounting-connections",
          element: <Accounting />,
        },
        {
          path: "/create-rule",
          element: <AccountingRulesForm />,
        },
        {
          path: "/accounting/rule/:rule_id/history",
          element: <RuleHistory />,
        },
      ],
    },
    { path: "/map", element: <Map /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
  ]);
  return element;
}