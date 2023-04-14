/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Card, Button } from "react-bootstrap";
import img from "../../static/noavatar.png";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function UserProfile({ user }) {
  const name = user.first_name.concat(" ", user.last_name);
  let avatarUrl = "";
  if (user.avatar && user.avatar !== "") {
    const avatarTemp = user.avatar.split(
      `${process.env.REACT_APP_BACKEND_URL}/`
    );
    avatarUrl = decodeURIComponent(avatarTemp[avatarTemp.length - 1]);

    if (!/^http/.test(avatarUrl)) avatarUrl = user.avatar;
  }
  let avatar = avatarUrl !== "" ? avatarUrl : img;

  return (
    <Card style={{ width: "15rem" }}>
      <Card.Img variant="top" src={avatar} />
      <Card.Body>
        <Card.Text>
          <b>{name}</b>
          <br />
          <i class="bi bi-envelope-fill sm-icon">{user.email}</i>
          <br />
          <i class="bi bi-telephone-fill sm-icon">{user.phone_number}</i>
        </Card.Text>
        <Button href="/profile/edit" variant="primary">
          Edit profile
        </Button>
      </Card.Body>
    </Card>
  );
}
