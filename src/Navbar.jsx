import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";

function Navbars() {
  const isLoggedin = Boolean(Cookies.get("jwtToken"));
  const username = localStorage.getItem("username");
  const img_profile = localStorage.getItem("profileimg");
  const logout = () => {
    Cookies.remove("jwtToken");
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
              <>
                <Nav.Link href="/" disabled style={{ color: "white" }}>
                  <img
                    className="img_profile"
                    src={
                      localStorage.getItem("profileimg") !== "null"
                        ? img_profile
                        : " https://www.its.ac.id/international/wp-content/uploads/sites/66/2020/02/blank-profile-picture-973460_1280.jpg"
                    }
                    alt=""
                  ></img>

                  {username}
                </Nav.Link>
              </>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">others</NavDropdown.Item>
              {isLoggedin ? (
                <DropdownButton
                  id="dropdown-basic-button"
                  title={
                    <>
                      <i
                        className="bi bi-person-circle"
                        style={{ fontSize: "20px" }}
                      ></i>
                      <span>Account</span>
                    </>
                  }
                  drop="end"
                  variant="light"
                >
                  <Dropdown.Item href="#/action-1">
                    <Button variant="primary" onClick={logout}>
                      logout
                    </Button>
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Something else
                  </Dropdown.Item>
                </DropdownButton>
              ) : null}
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbars;
