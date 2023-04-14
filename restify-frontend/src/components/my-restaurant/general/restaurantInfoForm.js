import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import validator from "validator";

export default function RestaurantInfoForm({
  details,
  submitHandler,
  submitButtonName,
}) {
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [currInfo, setCurrInfo] = useState(details);
  const [logo, setLogo] = useState();
  const [errors, setErrors] = useState({
    name: "",
    address: "",
    phone_num: "",
    postal_code: "",
  });

  const updateName = (e) => {
    const name = e.target.value;
    if (name === "" || name === undefined || name === null) {
      setErrors({ ...errors, name: "name is required" });
      setDisabled(true);
    } else {
      setCurrInfo({ ...currInfo, name });
      setErrors({ ...errors, name: "" });
      setDisabled(false);
    }
  };

  const updateAddress = (e) => {
    const address = e.target.value;
    if (address === "" || address === undefined || address === null) {
      setErrors({ ...errors, address: "address is required" });
      setDisabled(true);
    } else {
      setCurrInfo({ ...currInfo, address });
      setErrors({ ...errors, address: "" });
      setDisabled(false);
    }
  };

  const updatePhone = (val) => {
    if (!validator.isMobilePhone(val + "", "any", { strictMode: true })) {
      setErrors({ ...errors, phone_num: "phone number is invalid" });
      setDisabled(true);
    } else {
      setCurrInfo({ ...currInfo, phone_num: val });
      setErrors({ ...errors, phone_num: "" });
      setDisabled(false);
    }
  };

  const updatePostal = (e) => {
    const postal_code = e.target.value;
    if (!validator.isPostalCode(postal_code + "", "any")) {
      setErrors({ ...errors, postal_code: "zipcode is invalid" });
      setDisabled(true);
    } else {
      setCurrInfo({ ...currInfo, postal_code });
      setErrors({ ...errors, postal_code: "" });
      setDisabled(false);
    }
  };

  const updateLogo = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setDisabled(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setDisabled(false);
    } else {
      const formData = new FormData();
      formData.append("name", currInfo.name);
      formData.append("address", currInfo.address);
      formData.append("postal_code", currInfo.postal_code);
      formData.append("phone_num", currInfo.phone_num);
      if (logo !== undefined && logo !== null) formData.append("logo", logo);
      submitHandler(formData)
        .then(() => {
          setDisabled(false);
          setValidated(true);
        })
        .catch((err) => {
          //TODO add errors to state
          console.log("form", err);
          setDisabled(false);
          setValidated(true);
        });
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="vc1">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Name of the Restaurant"
              defaultValue={details.name}
              onChange={updateName}
              isInvalid={errors.name !== ""}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="vc2">
            <Form.Label>Phone</Form.Label>
            <PhoneInput
              placeholder="Phone number"
              value={details.phone_num}
              defaultCountry="CA"
              onChange={updatePhone}
              inputComponent={Form.Control}
              isInvalid={errors.phone_num !== ""}
              required
            />
            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
              {errors.phone_num}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="9" controlId="vc3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
              defaultValue={details.address}
              onChange={updateAddress}
              isInvalid={errors.address !== ""}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="vc4">
            <Form.Label>Zip</Form.Label>
            <Form.Control
              type="text"
              placeholder="Zip"
              defaultValue={details.postal_code}
              onChange={updatePostal}
              isInvalid={errors.postal_code !== ""}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.postal_code}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group className="position-relative mb-3">
            <Form.Label>Logo</Form.Label>
            <Form.Control
              type="file"
              name="Logo"
              accept="image/*"
              onChange={updateLogo}
            />
          </Form.Group>
        </Row>
        <Button type="submit" disabled={disabled}>
          {submitButtonName}
        </Button>
      </Form>
    </>
  );
}
