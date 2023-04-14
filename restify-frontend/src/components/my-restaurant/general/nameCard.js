import React, { useState } from "react";
import { Card, Image, Container, Row, Col, Button } from "react-bootstrap";
import {
  BsFillHeartFill,
  BsFillPeopleFill,
  BsFillPersonPlusFill,
} from "react-icons/bs";
export default function NameCard({ details, user, likeToggle, followToggle }) {
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [followDisabled, setFollowDisabled] = useState(false);
  const likeAction = () => {
    setLikeDisabled(true);
    likeToggle()
      .then(() => setLikeDisabled(false))
      .catch((err) => setLikeDisabled(false));
  };
  const followAction = () => {
    setFollowDisabled(true);
    followToggle()
      .then(() => setFollowDisabled(false))
      .catch((err) => setFollowDisabled(false));
  };
  let logo = "";
  if (details.logo) {
    const logoTemp = details.logo.split(
      `${process.env.REACT_APP_BACKEND_URL}/`
    );
    logo = decodeURIComponent(logoTemp[logoTemp.length - 1]);
    if (!/^http/.test(logo)) logo = details.logo;
  }

  return (
    <>
      <Card
        className="shadow-lg p-3 border-3 border-dark text-center"
        style={{ borderRadius: "2em" }}
      >
        <Card.Body>
          <Container fluid>
            <Row>
              <Col md={4}>
                <Image
                  className="shadow border border-3 border-dark"
                  src={logo}
                  roundedCircle
                  height="100%"
                  width="100%"
                ></Image>
              </Col>
              <Col md={8}>
                <Row className="mb-2">
                  <Col>
                    <Card.Title className="fancy-title big-icon">
                      {details.name}
                    </Card.Title>
                  </Col>
                </Row>
                <Row className="mid-icon">
                  <Col>
                    <Row>
                      <Col>
                        <BsFillHeartFill />
                        &nbsp; <i>{details.num_likes}</i>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <BsFillPeopleFill />
                        &nbsp; <i>{details.num_followers}</i>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {!user.owner && (
                  <Row className="mid-icon">
                    <Col md={5}>
                      <Button onClick={likeAction} disabled={likeDisabled}>
                        <BsFillHeartFill />
                        &nbsp; {user.like ? "Unlike" : "Like"}
                      </Button>
                    </Col>
                    <Col md={7}>
                      <Button onClick={followAction} disabled={followDisabled}>
                        <BsFillPersonPlusFill />
                        &nbsp; {user.follow ? "Unfollow" : "Follow"}
                      </Button>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </>
  );
}
