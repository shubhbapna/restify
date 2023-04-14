import React, { useState } from "react";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./style.css";
import img from "../../static/login-bg.jpeg";

export default function LoginPage() {
  let navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: ""
  });


  const updateUsername = (e) => {
    const username = e.target.value;
    if (username === "" || username === undefined || username === null) {
      setErrors({ ...errors, username: "username is required" });
      setDisabled(true);
    } else {
      setUsername(username);
      setErrors({ ...errors, username: "" });
      setDisabled(false);
    }
  };


  const updatePassword = (e) => {
    const password = e.target.value;
    if (password === "" || password === undefined || password === null) {
      setErrors({ ...errors, password: "password is required" });
      setDisabled(true);
    } else {
      setPassword(password);
      setErrors({ ...errors, password: "" });
      setDisabled(false);
    }
  };


  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    var controller = new AbortController();
    const signal = controller.signal
    setDisabled(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setDisabled(false);
    } else {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      return fetch(`${process.env.REACT_APP_BACKEND_URL}/accounts/login/`, {
        method: "POST",
        body: formData,
        signal: signal
      })
        .then((response) => {
          if (response.status === 401 || response.status === 403){
            console.log(response)
            alert("An error occured please try again")
            controller.abort();
          }
          return response.json();
        })
        .then((json) => {
          console.log(json);
          setDisabled(false);
          setValidated(true);
          localStorage.setItem('isOwner', `${json.is_owner}`);
          localStorage.setItem('token', `${json.token}`);
          if (`${json.is_owner}` === "true")
            localStorage.setItem('restaurant', `${json.restaurant}`);
          navigate("/search", { replace: true });
        })
        .catch((err) => {
            console.log("form", err);
            setDisabled(false);
            setValidated(true);
        });
    }
  };


  return (
    <div className="tissue pink full">
        <Container className="my-10 mx-8 conts">
            <Row className="row-login no-gutters">
                <Col className="lg-6">
                    <img 
                        src={img}
                        className="picture-login"
                        responsive="true"
                        alt = ""/>
                </Col>
                <Col className="lg-7 px-5">
                    <h1 className="h1-login fs-1 py-3">Restify</h1>
                    <Form noValidate validated={validated} onSubmit={submitHandler}>
                        <Form.Group 
                            controlId="formBasicUsername"
                        >
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                className="my-3 p-4" 
                                placeholder="Enter your username" 
                                required
                                onChange={updateUsername}
                                isInvalid={errors.username !== ""}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group 
                            controlId="formBasicPassword"
                        >
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                className="my-3 p-4" 
                                placeholder="Enter your password" 
                                required
                                onChange={updatePassword}
                                isInvalid={errors.password !== ""}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Link to="/signup" className="small fw-bold mt-2 pt-1 mb-0">
                            <p>Don't have an account? Sign up here</p>
                        </Link>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="btn-login mt-4 mb-3"
                            disabled={disabled}
                        >
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    </div>
  );
}
