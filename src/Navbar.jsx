import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";

function Navbars() {
  const isLoggedin = Boolean(Cookies.get("jwtToken"));
  const username = localStorage.getItem("username");
  const img_profile = localStorage.getItem("profileimg");
  const logout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("user_id");
    localStorage.clear();
    window.location.assign("/Login");
  };
  return (
    <Navbar
      expand="lg"
      className="navbar sticky-top"
      style={{ width: "100vw" }}
    >
      <Container>
        <Navbar.Brand style={{ color: "#c11c08", fontFamily: "Antonio" }}>
          FOODGRAM
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {isLoggedin ? (
              <NavDropdown
                title={
                  <>
                    <img
                      className="img_profile"
                      src={
                        localStorage.getItem("profileimg").length > 10
                          ? img_profile
                          : "https://www.its.ac.id/international/wp-content/uploads/sites/66/2020/02/blank-profile-picture-973460_1280.jpg"
                      }
                      alt=""
                    ></img>
                    <span style={{fontFamily: "Open Sans", color: "white"}}>{username}</span>
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href="#action/3.1">
                  <Button variant="primary" onClick={logout}>
                    logout
                  </Button>
                </NavDropdown.Item>
                <NavDropdown.Item href="/Update">
                  Update Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
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
