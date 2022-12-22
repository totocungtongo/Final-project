import "./App.css";
import Navbars from "./Navbar";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/v1/foods`, {
        headers: {
          apiKey: `${process.env.REACT_APP_API_KEY}`,
        },
      })

      .then(function (response) {
        setData(response.data.data);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Navbars />
      <Row className="justify-content-center mt-3">
        {data.map((item, index) => {
          let eachIngridients = "";
          for (let i in item.ingredients) {
            eachIngridients += `${item.ingredients[i]} `;
          }
          return (
            <Card style={{ width: "300px",height: "400px" }} className="cards" key={index}>
              {/* <Card.Img variant="top" src={item.imageUrl} className="cardsImg"/> */}
              <div className="cardsImg" style={{backgroundImage: `url(${item.imageUrl})`}}></div>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>{eachIngridients}</Card.Text>
                <Button variant="primary">like</Button>
              </Card.Body>
            </Card>
          );
        })}
      </Row>
    </>
  );
}

export default App;
