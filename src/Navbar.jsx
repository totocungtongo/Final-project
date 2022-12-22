import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function Navbars() {
     return (
       <Navbar expand="lg" className="navbar sticky-top" style={{width: "100vw"}}>
         <Container>
           <Navbar.Brand href="#home" style={{ color: "#c11c08",fontFamily:"Antonio"}}>
             FOODJOUR
           </Navbar.Brand>
           <Navbar.Toggle aria-controls="basic-navbar-nav" />
           <Navbar.Collapse id="basic-navbar-nav">
             <Nav className="me-auto">
               <Nav.Link href="#home">Home</Nav.Link>
               <Nav.Link href="#link">Login</Nav.Link>
               <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                 <NavDropdown.Item href="#action/3.1">others</NavDropdown.Item>
                 <NavDropdown.Item href="#action/3.2">
                   Another action
                 </NavDropdown.Item>
                 <NavDropdown.Item href="#action/3.3">
                   Something
                 </NavDropdown.Item>
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
