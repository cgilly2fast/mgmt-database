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
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
  ]);
  return element;
}
