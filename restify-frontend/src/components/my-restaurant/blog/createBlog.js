import React, { useState } from "react";
import { Button, Row, Col, Offcanvas, Form } from "react-bootstrap";
import fetcher from "../../../fetchWrapper";

export default function CreateBlog({ user, handleRefresh }) {
  const [disabled, setDisabled] = useState(true);
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [blog, setBlog] = useState({});
  const [cover, setCover] = useState();

  const [errors, setErrors] = useState({
    name: "",
    content: "",
  });

  const updateName = (e) => {
    const name = e.target.value;
    if (name === "" || name === undefined || name === null) {
      setErrors({ ...errors, name: "name is required" });
      setDisabled(true);
    } else {
      setBlog({ ...blog, title: name });
      setErrors({ ...errors, name: "" });
      setDisabled(false);
    }
  };

  const updateContent = (e) => {
    const content = e.target.value;
    if (content === "" || content === undefined || content === null) {
      setErrors({ ...errors, content: "content is required" });
      setDisabled(true);
    } else {
      setBlog({ ...blog, content });
      setErrors({ ...errors, content: "" });
      setDisabled(false);
    }
  };

  const updateCover = (event) => {
    setCover(event.target.files[0]);
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
      formData.append("title", blog.title);
      formData.append("content", blog.content);
      if (cover !== undefined && cover !== null) formData.append("imgs", cover);
      fetcher("blog/create/", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((json) => {
          setDisabled(false);
          setValidated(true);
          handleClose();
          handleRefresh();
        })
        .catch((err) => {
          console.log("form", err);
          setDisabled(false);
          setValidated(true);
        });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-5 mb-5">
        <h3>Click on the tile to read the entire blog!</h3>
      </div>
      {user.owner && (
        <>
          <div className="d-flex justify-content-center mt-5 mb-5">
            <h3>OR</h3>
          </div>
          <div className="d-flex justify-content-center mt-5 mb-5">
            <Button size="lg" onClick={() => setShow(!show)}>
              Create a new blog!
            </Button>
          </div>
          <div className="position-relative">
            <Offcanvas
              show={show}
              onHide={handleClose}
              placement="end"
              backdrop={false}
              style={{ width: "58%", height: "98%", top: "10%" }}
              scroll={true}
              className="position-absolute"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title className="fancy-title mid-icon">
                  Create New Blog Post
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="12" controlId="vc1">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Title of the blog post"
                        onChange={updateName}
                        isInvalid={errors.name !== ""}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="12" controlId="vc2">
                      <Form.Label>Content</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={7}
                        placeholder="Content of the blog"
                        onChange={updateContent}
                        isInvalid={errors.content !== ""}
                        style={{ whiteSpace: "pre-wrap" }}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.content}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group className="position-relative mb-3">
                      <Form.Label>Blog Cover Image</Form.Label>
                      <Form.Control
                        type="file"
                        name="Cover"
                        accept="image/*"
                        onChange={updateCover}
                      />
                    </Form.Group>
                  </Row>
                  <div className="text-center">
                    <Button type="submit" disabled={disabled} className="me-2">
                      Publish
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                      Discard
                    </Button>
                  </div>
                </Form>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
        </>
      )}
    </>
  );
}
