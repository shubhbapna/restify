import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RestaurantPage from "./pages/my-restuarant";
import BlogPage from "./pages/my-blogs/blog";
import RestaurantCreatePage from "./pages/create-restaurant";
import NotFoundPage from "./pages/404";
import FeedPage from "./pages/my-feed/feed";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import EditProfile from "./pages/edit-profile";
import ResultsPage from "./pages/my-search/search";

function App() {
  const [isOwner, setIsOwner] = useState(
    localStorage.getItem("isOwner") === "true"
  );
  useEffect(() => {
    setIsOwner(localStorage.getItem("isOwner") === "true");
  });
  return (
    <BrowserRouter>
      <Routes>
        {!isOwner && (
          <Route
            path={"/restaurant/create"}
            element={<RestaurantCreatePage />}
          ></Route>
        )}
        <Route path={"/restaurant/:id"} element={<RestaurantPage />}></Route>
        <Route path={"/blog/:id"} element={<BlogPage />}></Route>
        <Route path={"/search"} element={<ResultsPage />}></Route>
        <Route path={"/feed"} element={<FeedPage />}></Route>
        <Route path={"/login"} element={<LoginPage />}></Route>
        <Route path={"/signup"} element={<SignupPage />}></Route>
        <Route path={"/profile/edit"} element={<EditProfile />}></Route>
        <Route path={"/"} element={<ResultsPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
