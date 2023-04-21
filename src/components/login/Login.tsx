import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { auth, functions } from "../../config/firebase";
import { useAuth } from "../../context/Authcontext";

export const Login: React.FC = () => {
  const emailRef: any = useRef();
  const passwordRef: any = useRef();
  const { login, logout }: any = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const callableCheckTeammate = functions.httpsCallable("mgmt-checkTeammate");

  async function handleSubmit(e: any) {
    e.preventDefault();

    setLoading(false);
    try {
      setError("");
      setLoading(true);
      const res = await callableCheckTeammate({
        email: emailRef.current.value,
      });
      if (res.data.allowed) {
        await login(emailRef.current.value, passwordRef.current.value);
        const data = await auth.currentUser?.getIdTokenResult();
        if (data?.claims?.isAdmin) {
          navigate("/", { replace: true });
        } else {
          await logout();
          navigate("/login", { replace: true });
          setError("Only Admin allowed!");
        }
      } else {
        navigate("/login", { replace: true });
        setError("Access disabled");
      }

      // history.push("/");
    } catch (e) {
      console.log(e);
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <>
      <div className="login-main-div">
        <Card className="login">
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-3" type="submit">
                Log In
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-5">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
