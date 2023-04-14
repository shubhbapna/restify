import React from "react";
import { Card } from "react-bootstrap";
import RestaurantInfoForm from "../../components/my-restaurant/general/restaurantInfoForm";
import fetcher from "../../fetchWrapper";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/Navbar";

export default function RestaurantCreatePage() {
  let navigate = useNavigate();
  const submitHandler = async (info) => {
    return fetcher(`restaurant/create/`, {
      method: "POST",
      body: info,
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403)
          navigate("../login", { replace: true });
        return response.json();
      })
      .then((json) => {
        localStorage.setItem("isOwner", true);
        navigate(`../restaurant/${json.id}`, { replace: true });
      })
      .catch((err) => {
        console.log("update", err);
        throw err;
      });
  };
  return (
    <>
      <NavbarComponent />
      <div className="d-flex justify-content-center full tissue pink">
        <Card
          className="shadow-5 p-3 border-3 border-dark h-75 mt-4"
          style={{ borderRadius: "2em" }}
        >
          <Card.Body>
            <Card.Title className="fancy-title mid-icon">
              Create a Restaurant
            </Card.Title>
            <RestaurantInfoForm
              details={{}}
              submitButtonName="Create!"
              submitHandler={submitHandler}
            />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
