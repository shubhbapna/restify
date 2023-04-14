/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Card,
  Carousel,
  Row,
  Button,
  Col,
  Modal,
  Form,
  Image,
} from "react-bootstrap";
import { BsCameraFill } from "react-icons/bs";
import fetcher from "../../../fetchWrapper";

export default function PhotoCard({ user, pictures, updateParent }) {
  const [disabled, setDisabled] = useState(false);
  const [removedPhotos, setRemovedPhotos] = useState(new Set());
  const [newImages, setNewImages] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const handleClose = () => setShowEdit(false);
  const handleShow = () => setShowEdit(true);
  const updateImages = (event) => {
    setNewImages([...event.target.files]);
  };
  const selectImages = (event) => {
    console.log(event.target.id, event.target.checked);
    const temp = event.target.id.split("-");
    if (event.target.checked) {
      const tempSet = removedPhotos;
      tempSet.delete(temp[temp.length - 1]);
      setRemovedPhotos(tempSet);
    } else {
      const tempSet = removedPhotos;
      tempSet.add(temp[temp.length - 1]);
      setRemovedPhotos(tempSet);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisabled(true);
    let promises = [];
    removedPhotos.forEach((val) => {
      promises.push(
        fetcher(`restaurant/picture/${val}/delete/`, { method: "DELETE" })
      );
    });
    if (newImages.length > 0) {
      newImages.forEach((i) => {
        const formData = new FormData();
        formData.append("image", i);
        fetcher("restaurant/picture/add/", { method: "POST", body: formData });
      });
    }
    Promise.all(promises)
      .then((r) => {
        updateParent().then(() => {
          setDisabled(false);
          handleClose();
        });
      })
      .catch((err) => {
        console.log(err);
        setDisabled(false);
      });
  };

  return (
    <>
      <Card
        className="shadow-lg p-3 border-3 border-dark h-100"
        style={{ borderRadius: "2em" }}
        id="scrollableDiv"
      >
        <Card.Body>
          {pictures.length > 0 ? (
            <Carousel>
              {pictures.map((pic) => {
                let picUrl = "";
                if (pic.image) {
                  const picTemp = pic.image.split(
                    `${process.env.REACT_APP_BACKEND_URL}/`
                  );
                  picUrl = decodeURIComponent(picTemp[picTemp.length - 1]);
                  if (!/^http/.test(picUrl)) picUrl = pic.image;
                }
                return (
                  <Carousel.Item id={`car-${pic.id}`} key={`car-${pic.id}`}>
                    <Image className="d-block w-100" src={picUrl} alt="img" />
                  </Carousel.Item>
                );
              })}
            </Carousel>
          ) : (
            <div className="d-flex justify-content-md-center">No Images</div>
          )}
        </Card.Body>
        {user.owner && (
          <Card.Footer>
            <Row>
              <Col className="d-flex flex-row-reverse mt-1">
                <Button onClick={handleShow} className="rounded-circle">
                  <BsCameraFill /> +
                </Button>
              </Col>
              <Modal show={showEdit} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Add/Remove Images</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                  <Modal.Body>
                    <Form.Group as={Col} md="12" controlId="vc1">
                      <Row>
                        {pictures.map((pic) => {
                          let picUrl = "";
                          if (pic.image) {
                            const picTemp = pic.image.split(
                              `${process.env.REACT_APP_BACKEND_URL}/`
                            );
                            picUrl = decodeURIComponent(
                              picTemp[picTemp.length - 1]
                            );
                            if (!/^http/.test(picUrl)) picUrl = pic.image;
                          }
                          return (
                            <Col
                              id={`col-${pic.id}`}
                              key={`col-${pic.id}`}
                              md={4}
                            >
                              <Form.Check
                                inline
                                label={
                                  <Image
                                    src={picUrl}
                                    thumbnail
                                    id={`label-${pic.id}`}
                                    key={`label-${pic.id}`}
                                  ></Image>
                                }
                                name="group1"
                                type="checkbox"
                                id={`input-${pic.id}`}
                                key={`input-${pic.id}`}
                                defaultChecked={true}
                                onClick={selectImages}
                              />
                            </Col>
                          );
                        })}
                      </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="12" controlId="vc2">
                      <Form.Label>Photos</Form.Label>
                      <Form.Control
                        type="file"
                        name="Photos"
                        accept="image/*"
                        multiple
                        onChange={updateImages}
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit" disabled={disabled}>
                      Save changes!
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal>
            </Row>
          </Card.Footer>
        )}
      </Card>
    </>
  );
}
