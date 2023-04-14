import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

export default function MenuForm({ item, submitButtonName, submitHandler }) {
  const [currItem, setCurrItem] = useState(item);
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    item_type: "",
  });

  const updateName = (e) => {
    const name = e.target.value;
    if (name === "" || name === undefined || name === null) {
      setErrors({ ...errors, name: "name is required" });
      setDisabled(true);
    } else {
      setCurrItem({ ...currItem, name });
      setErrors({ ...errors, name: "" });
      setDisabled(false);
    }
  };

  const updateDescription = (e) => {
    const description = e.target.value;
    if (
      description === "" ||
      description === undefined ||
      description === null
    ) {
      setErrors({ ...errors, description: "description is required" });
      setDisabled(true);
    } else {
      setCurrItem({ ...currItem, description });
      setErrors({ ...errors, description: "" });
      setDisabled(false);
    }
  };

  const updatePrice = (e) => {
    const price = e.target.value;
    if (price === "" || price === undefined || price === null) {
      setErrors({ ...errors, price: "price is required" });
      setDisabled(true);
    } else {
      setCurrItem({ ...currItem, price });
      setErrors({ ...errors, price: "" });
      setDisabled(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitHandler(currItem)
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
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="8" controlId="vc1">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Name of the menu item"
              defaultValue={item.name}
              onChange={updateName}
              isInvalid={errors.name !== ""}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="vc1">
            <Form.Label>Price</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="1.00"
              defaultValue={item.price}
              min="1"
              step="0.01"
              maxLength="7"
              onChange={updatePrice}
              isInvalid={errors.price !== ""}
            />
            <Form.Control.Feedback type="invalid">
              {errors.price}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" controlId="vc2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description of the item"
              defaultValue={item.description}
              onChange={updateDescription}
              isInvalid={errors.description !== ""}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Button type="submit" disabled={disabled}>
          {submitButtonName}
        </Button>
      </Form>
    </>
  );
}
