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
import AddNewUnitForm from "./components/addNewUnitForm/AddNewUnitForm";
import ListingForm from "./components/listingForm/ListingForm";
import OwnerForm from "./components/ownerForm/OwnerForm";
import TeammateForm from "./components/teammateForm/TeammateForm";
import DocumentationRoute from "./components/GhotelsDocumentation/DocumentationRoute/DocumentationRoute";
import Getstart from "./components/GhotelsDocumentation/Getstart/Getstart";
import MarkdownRender from "./components/GhotelsDocumentation/MarkdownRender";
import FunctionMarkdown from "./Assets/DocumentationMarkdown/FunctionMarkdown";
import MgmtOverviewMarkdown from "./Assets/DocumentationMarkdown/MgmtOverviewMarkdown";
import MgmtSignUpMarkdown from "./Assets/DocumentationMarkdown/MgmtSignUpMarkdown";
import HospitablesMarkdown from "./Assets/DocumentationMarkdown/HospitablesMarkdown";
import GhotelsOverviewMarkdown from "./Assets/DocumentationMarkdown/GhotelsOverviewMarkdown";
import GHotelSignUpMarkdown from "./Assets/DocumentationMarkdown/GHotelSignUpMarkdown";
import GHotelsRoomboolMarkdown from "./Assets/DocumentationMarkdown/GHotelsRoomboolMarkdown";
import StripeMarkdown from "./Assets/DocumentationMarkdown/StripeMarkdown";
import PersonaMarkdown from "./Assets/DocumentationMarkdown/PersonaMarkdown";
import AliasMarkdown from "./Assets/DocumentationMarkdown/AliasMarkdown";

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
          path: "/unit/add-new-unit",
          element: <AddNewUnitForm />,
        },
        {
          path: "/unit/:unitId/edit-new",
          element: <AddNewUnitForm />,
        },
        {
          path: "/unit/:unitId/listing/create",
          element: <ListingForm />,
        },
        {
          path: "/unit/:unitId/listing/:provider/edit",
          element: <ListingForm />,
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
          path: "/owner/create",
          element: <OwnerForm />,
        },
        {
          path: "/owner/:ownerId/edit",
          element: <OwnerForm />,
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
          path: "/teammate/create",
          element: <TeammateForm />,
        },
        {
          path: "/teammate/:teammateId/edit",
          element: <TeammateForm />,
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
    {
      path: "/documentation",
      element: <DocumentationRoute />,
      children: [
        {
          path: "/documentation",
          element: <Getstart />,
        },
        {
          path: "/documentation/function",
          element: <MarkdownRender markdown={FunctionMarkdown} />,
        },
        {
          path: "/documentation/mgmt/overview",
          element: <MarkdownRender markdown={MgmtOverviewMarkdown} />,
        },
        {
          path: "/documentation/mgmt/signup",
          element: <MarkdownRender markdown={MgmtSignUpMarkdown} />,
        },
        {
          path: "/documentation/mgmt/hospitable",
          element: <MarkdownRender markdown={HospitablesMarkdown} />,
        },
        {
          path: "/documentation/ghotels/overview",
          element: <MarkdownRender markdown={GhotelsOverviewMarkdown} />,
        },
        {
          path: "/documentation/ghotels/signup",
          element: <MarkdownRender markdown={GHotelSignUpMarkdown} />,
        },
        {
          path: "/documentation/ghotels/rooms",
          element: <MarkdownRender markdown={GHotelsRoomboolMarkdown} />,
        },
        {
          path: "/documentation/ghotels/thirdparty/stripe",
          element: <MarkdownRender markdown={StripeMarkdown} />,
        },
        {
          path: "/documentation/ghotels/thirdparty/persona",
          element: <MarkdownRender markdown={PersonaMarkdown} />,
        },
        {
          path: "/documentation/alias",
          element: <MarkdownRender markdown={AliasMarkdown} />,
        },
      ],
    },
  ]);
  return element;
}
