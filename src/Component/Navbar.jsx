import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import "./Navbar.css" ;
import { Fragment } from "react";
function Navbars() {
  const isLoggedin = Boolean(Cookies.get("jwtToken"));
  const isAdmin = Boolean(Cookies.get("user_role") === "admin");

  const username = localStorage.getItem("username");
  const img_profile = localStorage.getItem("profileimg");
  const logout = () => {
    if (window.confirm("You sured to log out?")) {
      Cookies.remove("jwtToken");
      Cookies.remove("user_id");
      Cookies.remove("user_role");
      localStorage.clear();
      window.location.assign("/Login");
    }
  };
  return (
    <Navbar
      expand="lg"
      className="navbar sticky-top"
      style={{ width: "100vw" }}
    >
      <Container className="navbar_container">
        <Navbar.Brand style={{ color: "#c11c08", fontFamily: "Antonio" }} href="/Home">
          <img
            src="https://i.postimg.cc/qMf0DW1z/Food-journal.png"
            alt="Logo"
            style={{ width: "100px", height: "100px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="navbar_text">
              Home
            </Nav.Link>
            {isAdmin ? (
              <Nav.Link href="/Upload Food" className="nav_link_icon">
                <i className="bi bi-upload"></i>
              </Nav.Link>
            ) : null}
            {isLoggedin ? (
              <>
                <Nav.Link href="/Liked Food" className="nav_link_icon">
                  <i className="bi bi-heart "></i>
                </Nav.Link>
                <NavDropdown
                  title={
                    <Fragment>
                      <img
                        className="img_profile"
                        src={
                          localStorage.getItem("profileimg").length > 10
                            ? img_profile
                            : "https://www.its.ac.id/international/wp-content/uploads/sites/66/2020/02/blank-profile-picture-973460_1280.jpg"
                        }
                        alt=""
                      ></img>
                      <span style={{ fontFamily: "Open Sans", color: "white" }}>
                        {username}
                      </span>
                    </Fragment>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item href="#action/3.1">
                    <Button variant="primary" onClick={logout}>
                      logout
                    </Button>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/Update">
                    Update Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                </NavDropdown>
              </>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbars;
