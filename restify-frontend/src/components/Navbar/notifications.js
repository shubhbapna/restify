/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../loading";
import { BsPersonCircle } from "react-icons/bs";
import fetcher from "../../fetchWrapper";

export default function Notifications() {
    const [notifications, setNotifications] = useState({ next: null, count: 0, results: [] });


    const getNotifications = () => {
        let url = 'accounts/notification/';
        if (notifications.next !== null) {
            const temp = notifications.next.split("?");
            url += "?";
            url += temp[temp.length - 1];
        }
        fetcher(url)
        .then((response) => response.json())
        .then((json) => {
            setNotifications({
            ...json,
            results: [...notifications.results, ...json.results],
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }


  const createNotificationCard = (notification) => {
    return (
      <Card
        key={notifications.results.indexOf(notification)}
        className="shadow-lg p-3 border-1 mb-5"
        style={{ borderRadius: "2em", width: "100%" }}
      >
        <Card.Body>
            <Row>
                <Col md={2} className="mid-icon">
                {notification.avatar && notification.avatar !== "" ? (
                    <Image
                    roundedCircle
                    height="100%"
                    width="100%"
                    src={`${process.env.REACT_APP_BACKEND_URL}${notification.avatar}`}
                    ></Image>
                ) : (
                    <BsPersonCircle />
                )}
                </Col>
                <Col md={6}>
                    <Row>
                        <Col>{notification.message}</Col>
                    </Row>
                </Col>
            </Row>
            <Row className="d-flex flex-row-reverse">
                <Col md={6} >
                    <i>{notification.timestamp.split("T")[0]}</i>
                </Col>
            </Row>
        </Card.Body>
      </Card>
    );
  };

  useEffect(() => {
    getNotifications();
  }, []);    


  return (
    <>
      <Card
        className="shadow-lg p-3 h-100"
        style={{width: "25vw" }}
        id="scrollableDiv"
      >
        <Card.Body>
          <InfiniteScroll
            dataLength={notifications.results ? notifications.results.length : []}
            next={getNotifications}
            hasMore={notifications.next !== null}
            loader={<Loading msg="Getting notifications..." />}
            scrollableTarget="scrollableDiv"
            height={150}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>No more notifications!</b>
              </p>
            }
          >
            {notifications.results
              ? notifications.results.map((notification) => createNotificationCard(notification))
              : ""}
          </InfiniteScroll>
        </Card.Body>
      </Card>
    </>
  );
}
