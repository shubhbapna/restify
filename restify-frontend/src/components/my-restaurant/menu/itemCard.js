/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Row, Col, Button, Accordion, Modal } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import MenuForm from "./menuForm";

export default function ItemCard({ user, item, handleDelete, handleEdit }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const submitDelete = () => handleDelete(item.id);
  const submitEdit = (payload) => handleEdit(item.id, payload);

  return (
    <>
      <Accordion.Item eventKey={item.id}>
        <Accordion.Header>{item.name}</Accordion.Header>
        <Accordion.Body>
          <Row className="text-center">
            <Col>
              <i>{item.description}</i>
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <b>$ {item.price}</b>
            </Col>
          </Row>

          {user.owner && (
            <>
              <Row className="text-center">
                <Col>
                  <Button
                    size="sm"
                    variant="dark"
                    className="border rounded-circle"
                    onClick={handleShow}
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    size="sm"
                    variant="dark"
                    className="border rounded-circle"
                    onClick={submitDelete}
                  >
                    <MdDelete />
                  </Button>
                </Col>
              </Row>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Menu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <MenuForm
                    item={item}
                    submitButtonName="Save changes!"
                    submitHandler={submitEdit}
                  />
                </Modal.Body>
              </Modal>
            </>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}
