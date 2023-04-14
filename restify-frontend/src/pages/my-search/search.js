/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import fetcher from "../../fetchWrapper";
import { BsHeart, BsSearch, BsPersonFill } from "react-icons/bs";
import NavbarComponent from "../../components/Navbar";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../components/loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./search.css";

export default function ResultsPage() {
  const [results, setResults] = useState({ next: null, results: [] });
  const [urlQuery] = useSearchParams();
  const [msg, setMsg] = useState(false);
  let navigate = useNavigate();

  const getSearchResults = () => {
    let query = urlQuery.get("search");
    let url = `restaurant/search/?search=${query}`;
    if (query === null) {
      url = `restaurant/search/?search=`;
      setMsg(true);
    } else {
      setMsg(false);
    }
    if (results.next !== null) {
      const temp = results.next.split("?");
      url += "&";
      url += temp[temp.length - 1];
    }
    fetcher(url)
      .then((response) => response.json())
      .then((json) => {
        setResults({
          ...json,
          results: [...results.results, ...json.results],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const goToRestaurant = (id) => {
    navigate(`../restaurant/${id}`);
  };

  const searchRestaurants = () => {
    const searchQuery = document.querySelector("#my_search_search_input").value;
    navigate(`?search=${searchQuery}`);
    window.location.reload(false);
  };

  const createResultsCard = (restaurant) => {
    let cid = "my_search_" + restaurant.id;
    let logo = "";
    if (restaurant.logo) {
      const logoTemp = restaurant.logo.split(
        `${process.env.REACT_APP_BACKEND_URL}/`
      );
      logo = decodeURIComponent(logoTemp[logoTemp.length - 1]);
      if (!/^http/.test(logo)) logo = restaurant.logo;
    }
    return (
      <div
        id={cid}
        className="my_search_card"
        style={{ cursor: "pointer" }}
        onClick={() => goToRestaurant(restaurant.id)}
      >
        <div>
          <div className="my_search_card-body">
            <h5 className="my_search_card-title">{restaurant.name}</h5>
            <p className="my_search_card-text">{restaurant.phone_num} </p>
            <small className="my_search_text-muted Likes">
              <BsHeart /> {restaurant.num_likes}
            </small>
            <small className="my_search_text-muted Followers">
              <BsPersonFill /> {restaurant.num_followers}
            </small>
          </div>
          <div className="my_search_card-footer">
            <small className="my_search_text-muted_address">
              {restaurant.address}
            </small>
          </div>
        </div>
        <div className="my_search_card_image_container">
          <img
            className="my_search_card_image"
            src={logo}
            alt="Card cap"
          ></img>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getSearchResults();
  }, []);
  return (
    <>
      <NavbarComponent />
      <div className="my_search_search-container">
        <div className="my_search_title">
          <h1 id="my_search_title">Find a restaurant</h1>
        </div>
        <div className="input-group col-md-4 my_search_search_bar">
          <input
            className="form-control py-2 border-right-0 border"
            type="search"
            placeholder="search"
            id="my_search_search_input"
          />
          <span className="input-group-append my_search_search_icon_container">
            <div
              className="btn btn-outline-secondary border-left-0 border my_search_search_icon"
              onClick={() => searchRestaurants()}
            >
              <BsSearch />
            </div>
          </span>
        </div>

        <InfiniteScroll
          className="my_search_result_cards"
          dataLength={results.results ? results.results.length : []}
          next={getSearchResults}
          hasMore={results.next !== null}
          loader={<Loading msg="Getting results..." />}
          scrollableTarget="scrollableDiv"
          endMessage={
            <p style={{ textAlign: "center", marginTop: "1em" }}>
              <b hidden={msg ? true : false}>
                No more results for "{urlQuery.get("search")}"
              </b>
            </p>
          }
        >
          {results.results
            ? results.results.map((results) => createResultsCard(results))
            : ""}
        </InfiniteScroll>
      </div>
    </>
  );
}
