/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import fetcher from "../../fetchWrapper";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import "./blog.css";
import NavbarComponent from "../../components/Navbar";

export default function BlogPage() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [details, setDetails] = useState({});
  const [blogs, setBlogs] = useState({});
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [time, setTime] = useState("january");

  const likeAction = () => {
    setLikeDisabled(true);
    likeToggle()
      .then(() => setLikeDisabled(false))
      .catch((err) => setLikeDisabled(false));
  };

  const likeToggle = async () => {
    return fetcher(`blog/${id}/like/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ like: user.like ? 0 : 1 }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        const tempDetails = { ...details };
        const tempUser = { ...user };
        tempUser["like"] = !tempUser.like;
        tempDetails["num_likes"] += user.like ? -1 : 1;
        setDetails(tempDetails);
        setUser(tempUser);
      })
      .catch((err) => {
        throw err;
      });
  };

  const getBlogsData = () => {
    fetcher(`blog/${id}/`)
      .then((response) => response.json())
      .then((json) => {
        setBlogs(json);
        console.log(json.created_timestamp.split("T")[0]); 
        setTime(json.created_timestamp.split("T")[0]);
        fetcher(`restaurant/search/${json.restaurant}/`)
          .then((response) => response.json())
          .then((json) => {
            setDetails(json);
          })
          .catch((err) => {
            console.log(err);
          });
        console.log(json);
      })
      .catch((err) => {
        setBlogs({
          title: "abc",
        });
      });
  };

  const getUserData = () => {
    fetcher("accounts/profile/")
      .then((response) => response.json())
      .then((json) => {
        setUser({
          like: json.liked_blogs.includes(parseInt(id)),
        });
        if (user.like) {
          setLikeDisabled(true);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getBlogsData();
    getUserData();
  }, []);
  let blogUrl = "";
  if (blogs.imgs) {
    const blogTemp = blogs.imgs.split(`${process.env.REACT_APP_BACKEND_URL}/`);
    blogUrl = decodeURIComponent(blogTemp[blogTemp.length - 1]);
    if (!/^http/.test(blogUrl)) blogUrl = blogs.imgs;
  }
  return (
    <>
      <NavbarComponent />
      <div className="my_blog_container">
        <div className="my_blog_blog_title">
          <h1 id="my_blog_blog_title">
            <b>{blogs.title}</b>
          </h1>
          <p>
            <small>
              <b> Posted:</b> {time} <br /> {details.name}
            </small>{" "}
          </p>
        </div>

        <div className="my_blog_blog_content">
          {blogUrl !== "" && (
            <div>
              <figure>
                <img src={blogUrl} className="my_blog_blog_main_img" alt="card"/>
              </figure>
            </div>
          )}
          <p>{blogs.content}</p>
        </div>
        <div className="my_blog_interaction">
          <button
            id="my_blog_like"
            type="button"
            className="btn btn-light"
            onClick={likeAction}
            disabled={likeDisabled}
            hidden={user.like ? true : false}
          >
            <BsHeart />
          </button>
          <button
            id="my_blog_liked"
            type="button"
            className="btn btn-light"
            onClick={likeAction}
            disabled={likeDisabled}
            hidden={!user.like ? true : false}
          >
            <BsHeartFill />
          </button>
        </div>
      </div>
    </>
  );
}
