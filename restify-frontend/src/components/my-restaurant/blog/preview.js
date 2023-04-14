/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Image, Offcanvas } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../loading";
import { BsFillHeartFill } from "react-icons/bs";
import fetcher from "../../../fetchWrapper";
import PreviewCard from "./previewCard";
import CreateBlog from "./createBlog";

export default function Preview({ user, restaurantId, updateUserBlogs }) {
  const [blogs, setBlogs] = useState({ next: null, results: [] });
  const [refresh, setRefresh] = useState(false);
  const [currBlog, setCurrBlog] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getBlogs();
  }, [refresh]);

  const getBlogs = () => {
    let url = `restaurant/${restaurantId}/blogs/`;
    if (blogs.next !== null) {
      const temp = blogs.next.split("?");
      url += "?";
      url += temp[temp.length - 1];
    }
    fetcher(url)
      .then((response) => response.json())
      .then((json) => {
        setBlogs({
          ...json,
          results: [...json.results, ...blogs.results],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    fetcher(`blog/${id}/delete/`, { method: "DELETE" })
      .then((response) => response.json())
      .then((json) => {
        setBlogs({ next: null, results: [] });
        setRefresh(!refresh);
      })
      .catch((err) => {
        setBlogs({ next: null, results: [] });
        setRefresh(!refresh);
      });
  };

  const likeBlogToggle = async () => {
    fetcher(`blog/${currBlog.id}/like/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        like: user.blogs && user.blogs.includes(currBlog.id) ? 0 : 1,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        updateUserBlogs(currBlog.id);
        setBlogs({ next: null, results: [] });
        setRefresh(!refresh);
      })
      .catch((err) => {
        throw err;
      });
  };

  let blogUrl = "";
  if (currBlog.imgs) {
    const blogTemp = currBlog.imgs.split(
      `${process.env.REACT_APP_BACKEND_URL}/`
    );
    blogUrl = decodeURIComponent(blogTemp[blogTemp.length - 1]);
    if (!/^http/.test(blogUrl)) blogUrl = currBlog.imgs;
  }

  return (
    <Row>
      <Col md={5}>
        <div id="scrollableDiv" style={{ overflowY: "auto", height: "560px" }}>
          <InfiniteScroll
            dataLength={blogs.results ? blogs.results.length : []}
            next={getBlogs}
            hasMore={blogs.next !== null}
            loader={<Loading msg="Getting blogs..." />}
            scrollableTarget="scrollableDiv"
            height={560}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>No more blogs!</b>
              </p>
            }
          >
            {blogs.results
              ? blogs.results.map((blog) => (
                  <PreviewCard
                    user={user}
                    blog={blog}
                    key={blog.id}
                    handleDelete={() => handleDelete(blog.id)}
                    handleClick={() => {
                      setCurrBlog(blog);
                      handleShow();
                    }}
                  />
                ))
              : ""}
          </InfiniteScroll>
        </div>
        <div className="position-relative">
          <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            style={{ width: "58%", height: "98%", top: "10%" }}
            scroll={true}
            className="position-absolute"
          >
            <Offcanvas.Header closeButton>
              <div>
                <Row>
                  <Col>
                    <Offcanvas.Title className="fancy-title mid-icon">
                      {currBlog.title}
                    </Offcanvas.Title>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6 className="text-muted">
                      <i>
                        {new Date(currBlog.created_timestamp).toDateString()}
                      </i>
                    </h6>
                  </Col>
                </Row>
                {!user.owner && (
                  <Row>
                    <Col>
                      <Button
                        className="mid-icon"
                        variant="outline-dark"
                        onClick={likeBlogToggle}
                      >
                        <BsFillHeartFill /> &nbsp;
                        {user.blogs && user.blogs.includes(currBlog.id)
                          ? "Unlike"
                          : "Like"}
                      </Button>
                    </Col>
                  </Row>
                )}
              </div>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {blogUrl !== "" && (
                <Image
                  src={blogUrl}
                  className="float-start me-2 w-50 h-50"
                ></Image>
              )}
              <p
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {currBlog.content}
              </p>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </Col>
      <Col md={5}>
        <CreateBlog
          user={user}
          handleRefresh={() => {
            setBlogs({ next: null, results: [] });
            setRefresh(!refresh);
          }}
        />
      </Col>
    </Row>
  );
}
