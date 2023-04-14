/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Button, Accordion, Modal } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../loading";
import { BiPlus } from "react-icons/bi";
import fetcher from "../../../fetchWrapper";
import ItemCard from "./itemCard";
import MenuForm from "./menuForm";

export default function MenuCard({ user, restaurantId, menuType, title }) {
  const [menu, setMenu] = useState({ next: null, results: [] });
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getMenu = () => {
    let url = `restaurant/${restaurantId}/menu/list/?item_type=${menuType}`;
    if (menu.next !== null) {
      const temp = menu.next.split("?");
      url += "&";
      url += temp[temp.length - 1];
    }
    fetcher(url)
      .then((response) => response.json())
      .then((json) => {
        setMenu({
          ...json,
          results: [...json.results, ...menu.results],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = async (id) => {
    return fetcher(`restaurant/menu/${id}/delete/`, { method: "DELETE" })
      .then((response) => response.json())
      .then((json) => {
        setMenu({ next: null, results: [] });
        setRefresh(!refresh);
      })
      .catch((err) => {
        setMenu({ next: null, results: [] });
        setRefresh(!refresh);
      });
  };

  const handleUpdate = async (id, updatedItem) => {
    return fetcher(`restaurant/menu/${id}/update/`, {
      method: "PATCH",
      body: JSON.stringify(updatedItem),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((json) => {
        setMenu({ next: null, results: [] });
        setRefresh(!refresh);
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleAdd = async (item) => {
    return fetcher(`restaurant/menu/add/`, {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((json) => {
        setMenu({ next: null, results: [] });
        handleClose();
        setRefresh(!refresh);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    getMenu();
  }, [refresh]);

  return (
    <>
      <Card
        className="shadow-5 p-3 border-3 border-dark tissue blue"
        style={{ borderRadius: "2em" }}
        id="scrollableDiv"
      >
        <Card.Body>
          <Card.Title className="fancy-title mid-icon text-center">
            {title}
          </Card.Title>
          <Accordion>
            <InfiniteScroll
              dataLength={menu.results ? menu.results.length : []}
              next={getMenu}
              hasMore={menu.next !== null}
              loader={<Loading msg={`Getting ${title}...`} />}
              scrollableTarget="scrollableDiv"
              height={300}
            >
              {menu.results
                ? menu.results.map((m) => (
                    <ItemCard
                      user={user}
                      item={m}
                      handleDelete={handleDelete}
                      handleEdit={handleUpdate}
                      key={m.id}
                    />
                  ))
                : ""}
            </InfiniteScroll>
          </Accordion>
        </Card.Body>
        {user.owner && (
          <>
            <Card.Footer className="text-center">
              <Button
                className="border rounded-circle"
                variant="dark"
                onClick={handleShow}
              >
                <BiPlus />
              </Button>
            </Card.Footer>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add Item</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <MenuForm
                  item={{ item_type: menuType }}
                  submitButtonName="Add!"
                  submitHandler={handleAdd}
                />
              </Modal.Body>
            </Modal>
          </>
        )}
      </Card>
    </>
  );
}
