import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loading({ msg }) {
  return (
    <div
      className="d-flex justify-content-md-center"
      style={{ marginTop: "20%" }}
    >
      <Spinner animation="border" /> &nbsp; {msg}
    </div>
  );
}
