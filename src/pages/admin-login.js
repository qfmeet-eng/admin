import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Enter valid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({});

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setFieldError({});

    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
    } catch (validationErr) {
      const errors = {};
      validationErr.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      return setFieldError(errors);
    }

    const adminEmail = "admin123@gmail.com";
    const adminPassword = "admin@123";

    if (email === adminEmail && password === adminPassword) {
      return navigate("/dashboard");
    } else {
      setError("Invalid admin email or password");
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f4fdf7" }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">

              <div className="text-center mb-4">
                <h2 style={{ color: "#2e7d32", fontWeight: 700 }}>BuyCart Admin</h2>
                <p className="text-muted">Admin Login</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>

                <Form.Group className="mb-2" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!fieldError.email}
                  />
                </Form.Group>
                {fieldError.email && <div className="text-danger">{fieldError.email}</div>}

                <Form.Group className="mb-2" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={show ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!fieldError.password}
                    />
                    <Button variant="outline-secondary" onClick={() => setShow(!show)}>
                      {show ? <IoEyeOutline /> : <IoEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
                {fieldError.password && <div className="text-danger">{fieldError.password}</div>}

                <Button
                  type="submit"
                  className="w-100 mt-3"
                  style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32", fontWeight: 600 }}
                >
                  Login
                </Button>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
