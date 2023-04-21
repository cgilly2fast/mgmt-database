import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/Authcontext";
import Router from "./routes";
import { Container } from "react-bootstrap";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Container fluid className="p-0 d-flex">
          <Router />
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
