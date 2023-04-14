import React, {useState, useEffect} from "react";
import { Card, Row, Button, Form } from "react-bootstrap";
import fetcher from "../../fetchWrapper";
import { useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import NavbarComponent from "../../components/Navbar";
import validator from "validator";

export default function EditProfile() {
  let navigate = useNavigate();
  const [user, setUser] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [avatar, setAvatar] = useState();
  const [data, setData] = useState({ });
  const [errors, setErrors] = useState({
    email: "",
    phone_number: "",
  });


  const getUserData = () => {
    fetcher("accounts/profile/")
      .then((response) => {
        if (response.status === 401 || response.status === 403)
          navigate("/login", { replace: true });
        return response.json();
      })
      .then((json) => {
        setUser({
            first_name: json.first_name,
            last_name: json.last_name,
            phone_number: json.phone_number,
            email: json.email,
            avatar: json.avatar,
          });
        setData({
            first_name: json.first_name,
            last_name: json.last_name,
            phone_number: json.phone_number,
            email: json.email
        })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateFirstName = (e) => {
    setData({ ...data, first_name: e.target.value})
  };


  const updateLastName = (e) => {
    setData({ ...data, last_name: e.target.value})
  };


  const updatePhone = (val) => {
    if (val && !validator.isMobilePhone(val + "", "any", { strictMode: true })) {
      setErrors({ ...errors, phone_number: "phone number is invalid" });
      setDisabled(true);
    } else {
      if (val)
        setData({ ...data, phone_number: val });
      else
        setData({ ...data, phone_number: " " });
      setErrors({ ...errors, phone_number: "" });
      setDisabled(false);
    }
  };


  const updateEmail = (event) => {
    const email = event.target.value
    if (email && !validator.isEmail(email)) {
      setErrors({ ...errors, email: "email address is invalid" });
      setDisabled(true);
    } else {
      if (email)
        setData({ ...data, email:email });
      else
        setData({ ...data, email:" " });
      setErrors({ ...errors, email: "" });
      setDisabled(false);
    }
  };

  const updateAvatar = (event) => {
    setAvatar(event.target.files[0]);
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
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      if (avatar !== undefined && avatar !== null) formData.append("avatar", avatar);
      console.log(data)
      return fetcher(`accounts/profile/`, {
        method: "PATCH",
        body: formData,
        signal: signal
      })
        .then((response) => {
          if (response.status === 401 || response.status === 403){
            alert("An error occured please try again")
            window.location.reload()
            controller.abort();
          }
          return response.json();
        })
        .then((json) => {
          console.log(json);
          setDisabled(false);
          setValidated(true);
          alert("Your changes have been saved!")
        })
        .catch((err) => {
            console.log("form", err);
            setDisabled(false);
            setValidated(true);
        });
    }
  };

  useEffect(() => {
    getUserData();
  }, []);    


  return (
    <>
    <NavbarComponent />
    <div className="d-flex justify-content-center full tissue pink">
        <Card
        className="shadow-5 p-3 border-3 border-dark h-75 mt-4"
        style={{ borderRadius: "2em" }}
        >
            <Card.Body>
                <Card.Title className="fancy-title mid-icon">
                Edit Profile
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={submitHandler}>
                    <Row className="mb-3">
                        <Form.Group md="6" controlId="vc1">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                            type="text"
                            placeholder="Enter your first name"
                            defaultValue={user.first_name}
                            onChange={updateFirstName}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group md="6" controlId="vc1">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                            type="text"
                            placeholder="Enter your last name"
                            defaultValue={user.last_name}
                            onChange={updateLastName}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group md="6" controlId="vc1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter your email address" 
                                defaultValue={user.email}
                                onChange={updateEmail}
                                isInvalid={errors.email !== ""}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group md="6" controlId="vc2">
                            <Form.Label>Phone number</Form.Label>
                            <PhoneInput
                            placeholder="Enter your phone number"
                            value={user.phone_number}
                            defaultCountry="CA"
                            inputComponent={Form.Control}
                            onChange={updatePhone}
                            isInvalid={errors.phone_number !== ""}
                            />
                            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                                {errors.phone_number}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="position-relative mb-3">
                            <Form.Label>Avatar</Form.Label>
                            <Form.Control
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={updateAvatar}
                            />
                        </Form.Group>
                    </Row>
                    <Button type="submit" disabled={disabled}>
                    Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    </div>
    </>
  );
}
