import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import fetcher from "../../fetchWrapper";
import { useNavigate } from "react-router-dom";
import "./style.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Notifications from "./notifications";
import UserProfile from "./userProfile";


export default function NavbarComponent() {
    let navigate = useNavigate();
    const [user, setUser] = useState({});
    const [notificationsCount, setNotificationsCount] = useState(0);


    const getUserData = () => {
        fetcher("accounts/profile/")
          .then((response) => {
            if (response.status === 401 || response.status === 403)
              navigate("/login", { replace: true });
            return response.json();
          })
          .then((json) => {
            setUser({
                first_name: json.first_name,
                last_name: json.last_name,
                phone_number: json.phone_number,
                email: json.email,
                avatar: json.avatar,
                is_owner: json.is_owner,
                restaurant: json.restaurant 
              });
          })
          .catch((err) => {
            console.log(err);
          });
      };

    
    const getNotificationsCount = () => {
        let url = 'accounts/notification/';
        fetcher(url)
        .then((response) => response.json())
        .then((json) => {
            setNotificationsCount(json.count);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const logout = () => {
        var controller = new AbortController();
        const signal = controller.signal
        fetcher(`accounts/logout/`, {
            method: "GET",
            signal: signal
        })
        .then((response) => {
            if (response.status === 401 || response.status === 403){
                alert("An error occured please try again")
                controller.abort();
            }
            return response.json();
        })
        .then((json) => {
        console.log(json);
        localStorage.removeItem('isOwner');
        localStorage.removeItem('token');
        localStorage.removeItem('restaurant');
        navigate("/login", { replace: true });
        })
        .catch((err) => {
            console.log("form", err);
        });
    }


    useEffect(() => {
        getUserData();
        getNotificationsCount();
      }, []);    


    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand className="restify">Restify</Navbar.Brand>
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto restify-nav-links">
                        <Nav.Link href="/search">Home</Nav.Link>
                        <Nav.Link href="/feed">Feed</Nav.Link>
                        {user.is_owner && <Nav.Link href={`/restaurant/${user.restaurant}`}>View Restaurant</Nav.Link>}
                        {!user.is_owner && <Nav.Link href="/restaurant/create">Create Restaurant</Nav.Link>}
                    </Nav>
                    <Nav className="d-flex">
                        <NavDropdown className="dropstart" title={
                        <i className="bi bi-bell-fill position-relative restify-icons">
                            <Badge pill className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border rounded-circle notif-badge">
                                {notificationsCount}
                            </Badge>
                        </i>
                        }
                        id="navbarScrollingDropdown">
                                <Notifications />
                        </NavDropdown>
                        <NavDropdown className="dropstart" title={
                            <i className="bi bi-person-circle restify-icons"></i>}
                            id="navbarScrollingDropdown">
                                <UserProfile 
                                user={user}/>
                        </NavDropdown>
                        <Nav.Link href="/login" onClick={logout}>
                            <i className="bi bi-box-arrow-right restify-icons"></i>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
      );
}