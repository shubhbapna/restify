import React from "react";
import { Card, Row, Col } from "react-bootstrap";

export default function NotFoundPage() {
  return (
    <div className="d-flex justify-content-center full tissue pink">
      <Card
        className="shadow-5 p-3 border-3 border-dark h-50 w-50 mt-5 not-found"
        style={{ borderRadius: "2em" }}
      >
        <Card.Body>
          <Row>
            <Col md={4} className="white">
              <Card.Title className="fancy-title mid-icon">
                Oops the page you were looking for was not found
              </Card.Title>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}