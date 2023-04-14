/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import fetcher from "../../fetchWrapper";
import { BsHeart } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../components/loading";
import { useNavigate } from "react-router-dom";
import "./feed.css";
import NavbarComponent from "../../components/Navbar";

export default function FeedPage() {
  const [feed, setFeed] = useState({ next: null, results: [] });
  let navigate = useNavigate();

  const getFeed = () => {
    let url = `blog/feed/`;
    if (feed.next !== null) {
      const temp = feed.next.split("?");
      url += "?";
      url += temp[temp.length - 1];
    }
    fetcher(url)
      .then((response) => response.json())
      .then((json) => {
        setFeed({
          ...json,
          results: [...json.results, ...feed.results],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (id) => {
    navigate(`../blog/${id}`);
  };

  const createFeedCard = (blog) => {
    let cid = "my_blog_" + blog.id;
    const preview = blog.content.split(".")[0];
    let blogUrl = "";
    if (blog.imgs) {
      const blogTemp = blog.imgs.split(`${process.env.REACT_APP_BACKEND_URL}/`);
      blogUrl = decodeURIComponent(blogTemp[blogTemp.length - 1]);
      if (!/^http/.test(blogUrl)) blogUrl = blog.imgs;
    }
    return (
      <div
        id={cid}
        className="my_blog_card"
        style={{ cursor: "pointer" }}
        onClick={() => handleClick(blog.id)}
      >
        <div>
          <div className="my_blog_card-body">
            <h5 className="my_blog_card-title">{blog.title}</h5>
            <p className="my_blog_card-text">{preview}</p>
            <small className="my_blog_text-muted Likes">
              <BsHeart /> {blog.numLikes}
            </small>
          </div>
          <div className="my_blog_card-footer">
            <small className="my_blog_text-muted_date">
              Posted {blog.created_timestamp.split("T")[0]}
            </small>
          </div>
        </div>
        <div className="my_blog_card_image_container">
          <img
            className="my_blog_card_image"
            src={blogUrl}
            alt="Card cap"
          ></img>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <>
      <NavbarComponent />
      <div className="my_blog_feed_container">
        <div className="my_blog_title">
          <h1>Latest Blogs</h1>
        </div>
        <div id="my_blog_hr">
          <hr />
        </div>

        <InfiniteScroll
          className="my_blog_feed_cards"
          dataLength={feed.results ? feed.results.length : []}
          next={getFeed}
          hasMore={feed.next !== null}
          loader={<Loading msg="Getting feed..." />}
          scrollableTarget="scrollableDiv"
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>No more feed</b>
            </p>
          }
        >
          {feed.results ? feed.results.map((feed) => createFeedCard(feed)) : ""}
        </InfiniteScroll>
      </div>
    </>
  );
}
