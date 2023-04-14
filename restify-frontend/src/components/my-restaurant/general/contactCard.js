import React, { useState } from "react";
import { Card, Container, Row, Col, Button, Modal } from "react-bootstrap";
import { BsGeoAltFill, BsFillTelephoneFill } from "react-icons/bs";
import "react-phone-number-input/style.css";
import { formatPhoneNumber } from "react-phone-number-input";
import RestaurantInfoForm from "./restaurantInfoForm";

export default function ContactCard({ details, user, updateInfo }) {
  const [showEdit, setShowEdit] = useState(false);
  const handleClose = () => setShowEdit(false);
  const handleShow = () => setShowEdit(true);
  return (
    <>
      <Card
        className="shadow-lg p-3 border-3 border-dark h-100"
        style={{ borderRadius: "2em" }}
      >
        <Card.Body>
          <Container fluid>
            <Row>
              <Col className="mid-icon">
                <BsGeoAltFill />
                &ensp;<i>{details.address}</i>
              </Col>
            </Row>
            <Row>
              <Col className="mid-icon">
                <BsGeoAltFill />
                &ensp;<i>{details.postal_code}</i>
              </Col>
            </Row>
            <Row>
              <Col className="mid-icon">
                <BsFillTelephoneFill />
                &ensp;<i>{formatPhoneNumber(details.phone_num)}</i>
              </Col>
            </Row>
            {user.owner && (
              <Row>
                <Col md={{ offset: 10 }}>
                  <Button onClick={handleShow} className="rounded-circle">
                    Edit
                  </Button>
                </Col>
                <Modal show={showEdit} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Info</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <RestaurantInfoForm
                      details={details}
                      submitHandler={updateInfo}
                      submitButtonName={"Save changes!"}
                    />
                  </Modal.Body>
                </Modal>
              </Row>
            )}
          </Container>
        </Card.Body>
      </Card>
    </>
  );
}
