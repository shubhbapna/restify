/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { AiFillPicture } from "react-icons/ai";
import { BsFillHeartFill, BsDashLg } from "react-icons/bs";

export default function PreviewCard({ user, blog, handleDelete, handleClick }) {
  let blogUrl = "";
  if (blog.imgs) {
    const blogTemp = blog.imgs.split(`${process.env.REACT_APP_BACKEND_URL}/`);
    blogUrl = decodeURIComponent(blogTemp[blogTemp.length - 1]);
    if (!/^http/.test(blogUrl)) blogUrl = blog.imgs;
  }
  return (
    <>
      <Card
        className="ms-2 shadow-5 p-3 position-relative mt-3 mr-2"
        style={{ borderRadius: "2em" }}
      >
        {user.owner && (
          <Button
            onClick={handleDelete}
            variant="danger"
            className="btn-sm position-absolute top-0 start-10 translate-middle border border-2 rounded-circle border-dark"
          >
            <BsDashLg />
          </Button>
        )}
        <Card.Body onClick={handleClick}>
          <Row>
            <Col md={5}>
              {blogUrl !== "" ? (
                <Image src={blogUrl} className="w-100 h-100"></Image>
              ) : (
                <AiFillPicture style={{ fontSize: "calc(4rem + 1vw)" }} />
              )}
            </Col>
            <Col md={7}>
              <Card.Title className="fancy-title mid-icon">
                {blog.title}
              </Card.Title>
              <p>{blog.content.slice(0, 50)}...</p>
              <div className="position-absolute bottom-0 end-0 translate-middle">
                <i>{new Date(blog.created_timestamp).toDateString()}</i>
                <BsFillHeartFill className="ms-2" />
                &nbsp;{blog.numLikes}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
