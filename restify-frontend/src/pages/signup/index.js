import React, { useState } from "react";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import validator from "validator";
import "./style.css";
import img from "../../static/login-bg.jpeg";

export default function SignupPage() {
  let navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: ""
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    phone_number: "",
    email: ""
  });


  const updateFirstName = (e) => {
    setData({ ...data, first_name: e.target.value})
  };


  const updateLastName = (e) => {
    setData({ ...data, last_name: e.target.value})
  };


  const updatePhone = (val) => {
    if (!validator.isMobilePhone(val + "", "any", { strictMode: true })) {
      setErrors({ ...errors, phone_number: "phone number is invalid" });
      setDisabled(true);
    } else {
      setData({ ...data, phone_number: val });
      setErrors({ ...errors, phone_number: "" });
      setDisabled(false);
    }
  };


  const updateEmail = (event) => {
    const email = event.target.value
    if (!validator.isEmail(email)) {
      setErrors({ ...errors, email: "email address is invalid" });
      setDisabled(true);
    } else {
      setData({ ...data, email });
      setErrors({ ...errors, email: "" });
      setDisabled(false);
    }
  };


  const updateUsername = (e) => {
    const username = e.target.value;
    if (username === "" || username === undefined || username === null) {
      setErrors({ ...errors, username: "username is required" });
      setDisabled(true);
    } else {
      setData({ ...data, username });
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
      setData({ ...data, password});
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
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("phone_number", data.phone_number);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      return fetch(`${process.env.REACT_APP_BACKEND_URL}/accounts/register/`, {
        method: "POST",
        body: formData,
        signal: signal
      })
        .then((response) => {
          if (response.status === 401 || response.status === 403){
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
            <Row className="row-signup no-gutters">
                <Col className="lg-6">
                    <img 
                        src={img}
                        className="picture-signup"
                        responsive="true"
                        alt = ""/>
                </Col>
                <Col className="lg-7 px-5">
                    <h1 className="h1-signup fs-1 py-3">Restify</h1>
                    <Form noValidate validated={validated} onSubmit={submitHandler}>
                        <Form.Group 
                            controlId="formBasicFirstName"
                        >
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your first name" 
                                onChange={updateFirstName}
                            />
                        </Form.Group>
                        <Form.Group 
                            controlId="formBasicLastName"
                        >
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your last name" 
                                onChange={updateLastName}
                            />
                        </Form.Group>
                        <Form.Group 
                            controlId="formBasicPhone"
                        >
                            <Form.Label>Phone Number</Form.Label>
                            <PhoneInput 
                                placeholder="Enter your phone number" 
                                defaultCountry="CA"
                                inputComponent={Form.Control}
                                onChange={updatePhone}
                                isInvalid={errors.phone_number !== ""}
                            />
                            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                                {errors.phone_number}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group 
                            controlId="formBasicEmail"
                        >
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter your email address" 
                                onChange={updateEmail}
                                isInvalid={errors.email !== ""}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group 
                            controlId="formBasicUsername"
                        >
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
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
                                placeholder="Enter your password" 
                                required
                                onChange={updatePassword}
                                isInvalid={errors.password !== ""}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="btn-signup mt-4 mb-3"
                            disabled={disabled}
                        >
                            Signup
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    </div>
  );
}
