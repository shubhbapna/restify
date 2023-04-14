/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../loading";
import { BsPersonCircle } from "react-icons/bs";
import fetcher from "../../../fetchWrapper";

export default function CommentCard({ user, restaurantId }) {
  const [currComment, setCurrComment] = useState();
  const [disabled, setDisabled] = useState(true);
  const [comments, setComments] = useState({ next: null, results: [] });

  useEffect(() => {
    getComments();
  }, []);

  const getComments = () => {
    let url = `restaurant/${restaurantId}/comment/`;
    if (comments.next !== null) {
      const temp = comments.next.split("?");
      url += "?";
      url += temp[temp.length - 1];
    }
    fetcher(url)
      .then((response) => response.json())
      .then((json) => {
        setComments({
          ...json,
          results: [...comments.results, ...json.results],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateComment = (e) => {
    if (e.target.value !== "") {
      setCurrComment(e.target.value);
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(currComment);
    if (
      currComment !== null &&
      currComment !== undefined &&
      currComment !== ""
    ) {
      setDisabled(true);
      fetcher(`restaurant/${restaurantId}/comment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currComment }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setComments({
            ...comments,
            results: [json, ...comments.results],
          });
          setCurrComment("");
          setDisabled(false);
        })
        .catch((err) => {
          console.log(err);
          setDisabled(false);
        });
    }
  };
  const createCommentCard = (comment) => {
    let avatarUrl = "";
    if (comment.avatar && comment.avatar !== "") {
      avatarUrl = comment.avatar.slice(1);
      avatarUrl = decodeURIComponent(avatarUrl);

      if (!/^http/.test(avatarUrl))
        avatarUrl = `${process.env.REACT_APP_BACKEND_URL}${comment.avatar}`;
    }
    return (
      <Card
        key={comment.id}
        className="shadow-lg p-3 border-1 mb-5"
        style={{ borderRadius: "2em" }}
      >
        <Card.Body>
          <Row>
            <Col md={2} className="mid-icon">
              {avatarUrl !== "" ? (
                <Image
                  roundedCircle
                  height="100%"
                  width="100%"
                  src={avatarUrl}
                ></Image>
              ) : (
                <BsPersonCircle />
              )}
            </Col>
            <Col md={6}>
              <Row>
                <Col>{comment.username}</Col>
              </Row>
              <Row>
                <Col>{comment.message}</Col>
              </Row>
            </Col>
            <Col md={4} className="d-flex flex-row-reverse">
              <i>{comment.timestamp.split("T")[0]}</i>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };
  return (
    <>
      <Card
        className="shadow-lg p-3 border-3 border-dark h-100"
        style={{ borderRadius: "2em" }}
        id="scrollableDiv"
      >
        <Card.Body>
          <Card.Title>Comments</Card.Title>
          <InfiniteScroll
            dataLength={comments.results ? comments.results.length : []}
            next={getComments}
            hasMore={comments.next !== null}
            loader={<Loading msg="Getting comments..." />}
            scrollableTarget="scrollableDiv"
            height={150}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>No more comments!</b>
              </p>
            }
          >
            {comments.results
              ? comments.results.map((comment) => createCommentCard(comment))
              : ""}
          </InfiniteScroll>
        </Card.Body>
        {!user.owner && (
          <Card.Footer>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} md="9">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Comment about your experience here..."
                    onChange={updateComment}
                  />
                </Form.Group>
                <Col md={3}>
                  <Button type="submit" disabled={disabled}>
                    Post!
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Footer>
        )}
      </Card>
    </>
  );
}
