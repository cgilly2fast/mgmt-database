import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/Authcontext";
import Router from "./routes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
