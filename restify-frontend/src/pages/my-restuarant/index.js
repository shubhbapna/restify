/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Container, Col, Row } from "react-bootstrap";
import fetcher from "../../fetchWrapper";
import NameCard from "../../components/my-restaurant/general/nameCard";
import Loading from "../../components/loading";
import ContactCard from "../../components/my-restaurant/general/contactCard";
import CommentCard from "../../components/my-restaurant/general/commentCard";
import { useParams } from "react-router-dom";
import PhotoCard from "../../components/my-restaurant/general/photoCard";
import MenuCard from "../../components/my-restaurant/menu/menuCard";
import Preview from "../../components/my-restaurant/blog/preview";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/Navbar";

export default function RestaurantPage() {
  let navigate = useNavigate();
  const { id } = useParams();
  const [key, setKey] = useState("general");
  const [user, setUser] = useState({});
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const likeToggle = async () => {
    return fetcher(`restaurant/${id}/like/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ like: user.like ? 0 : 1 }),
    })
      .then((response) => response.json())
      .then((json) => {
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

  const followToggle = async () => {
    return fetcher(`restaurant/${id}/follow/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follow: user.follow ? 0 : 1 }),
    })
      .then((response) => response.json())
      .then((json) => {
        const tempDetails = { ...details };
        const tempUser = { ...user };
        tempUser["follow"] = !tempUser.follow;
        tempDetails["num_followers"] += user.follow ? -1 : 1;
        setDetails(tempDetails);
        setUser(tempUser);
      })
      .catch((err) => {
        throw err;
      });
  };

  const getGeneralData = async () => {
    setLoading(true);
    return fetcher(`restaurant/search/${id}/`)
      .then((response) => {
        if (response.status === 404)
          navigate(`../restaurant/${id}/notfound`, { replace: true });
        return response.json();
      })
      .then((json) => {
        setDetails(json);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getUserData = () => {
    setLoading(true);
    fetcher("accounts/profile/")
      .then((response) => {
        if (response.status === 401 || response.status === 403)
          navigate("../login", { replace: true });
        return response.json();
      })
      .then((json) => {
        setUser({
          owner: json.restaurant === parseInt(id),
          like: json.liked_restaurant.includes(parseInt(id)),
          follow: json.followed_restaurant.includes(parseInt(id)),
          blogs: json.liked_blogs,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const updateInfo = async (info) => {
    return fetcher(`restaurant/update/`, {
      method: "PATCH",
      body: info,
    })
      .then((response) => response.json())
      .then((json) => {
        getGeneralData();
      })
      .catch((err) => {
        console.log("update", err);

        throw err;
      });
  };

  const updateUserBlogs = (blogId) => {
    const tempUser = { ...user };
    const index = user.blogs.indexOf(blogId);
    if (index > -1) tempUser.blogs.splice(index, 1);
    else tempUser.blogs.push(blogId);
    setUser(tempUser);
  };

  useEffect(() => {
    getUserData();
    if (key === "general") getGeneralData();
  }, []);

  return (
    <>
      <NavbarComponent />
      <Tabs id="res-details" activeKey={key} onSelect={(k) => setKey(k)} fill>
        <Tab
          eventKey="general"
          title="General"
          className="tissue pink full"
          id="general-tab"
        >
          {loading ? (
            <Loading msg="Loading..." />
          ) : (
            <Container>
              <Row className="pt-4 pb-4">
                <Col md={6}>
                  <Row>
                    <Col>
                      <NameCard
                        details={details}
                        likeToggle={likeToggle}
                        followToggle={followToggle}
                        user={user}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <CommentCard restaurantId={id} user={user} />
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  <Row>
                    <Col>
                      <ContactCard
                        details={details}
                        user={user}
                        updateInfo={updateInfo}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <PhotoCard
                        user={user}
                        pictures={
                          details.pictures !== undefined &&
                          details.pictures !== null &&
                          details.pictures.length > 0
                            ? details.pictures
                            : []
                        }
                        updateParent={getGeneralData}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          )}
        </Tab>
        <Tab
          eventKey="menu"
          title="Menu"
          id="menu-tab"
          className="tissue pink full"
        >
          {loading ? (
            <Loading msg="Loading..." />
          ) : (
            <Container className="pt-4 pb-4">
              <Row>
                <Col md={3}>
                  <MenuCard
                    user={user}
                    restaurantId={id}
                    menuType="A"
                    title="Appetizers"
                  />
                </Col>
                <Col md={3}>
                  <MenuCard
                    user={user}
                    restaurantId={id}
                    menuType="M"
                    title="Mains"
                  />
                </Col>
                <Col md={3}>
                  <MenuCard
                    user={user}
                    restaurantId={id}
                    menuType="B"
                    title="Beverages"
                  />
                </Col>
                <Col md={3}>
                  <MenuCard
                    user={user}
                    restaurantId={id}
                    menuType="D"
                    title="Desserts"
                  />
                </Col>
              </Row>
            </Container>
          )}
        </Tab>
        <Tab
          eventKey="blogs"
          title="Blogs"
          id="blogs-tab"
          className="tissue pink full"
        >
          {loading ? (
            <Loading msg="Loading..." />
          ) : (
            <div style={{ overflowX: "hidden", overflowY: "hidden" }}>
              <Preview
                user={user}
                restaurantId={id}
                updateUserBlogs={updateUserBlogs}
              />
            </div>
          )}
        </Tab>
      </Tabs>
    </>
  );
}
