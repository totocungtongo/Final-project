import "./App.css";
import Navbars from "./Navbar";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { useEffect, useState ,useCallback} from "react";
import Cookies from "js-cookie";
import { CardImg } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";

function App() {
  const [all_foods, setAllfood] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);

  //get food data
  const getAllfood = useCallback(() => {
    authenticated ?
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/v1/foods`, {
        headers: {
          apiKey: `${process.env.REACT_APP_API_KEY}`,
          Authorization: `Bearer ${Cookies.get("jwtToken")}`,
        },
      })
      .then((response) => {
        setAllfood(response.data.data);
      }): 
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/v1/foods`, {
          headers: {
            apiKey: `${process.env.REACT_APP_API_KEY}`,
          },
        })
        .then((response) => {
          setAllfood(response.data.data);
        });
    
  },[authenticated]);
  //get food data end
  // toggle like
  const toggleLike = (foodId, liked) => {
    authenticated && !liked
      ? axios
          .post(
            `${process.env.REACT_APP_BASE_URL}/api/v1/like`,
            {
              foodId: foodId,
            },
            {
              headers: {
                apiKey: `${process.env.REACT_APP_API_KEY}`,
                Authorization: `Bearer ${Cookies.get("jwtToken")}`,
              },
            }
          )
          .then(() => {
            getAllfood()
          })
      : authenticated && liked
      ? axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/unlike`,
          {
            foodId: foodId,
          },
          {
            headers: {
              apiKey: `${process.env.REACT_APP_API_KEY}`,
              Authorization: `Bearer ${Cookies.get("jwtToken")}`,
            },
          }
        ).then(()=>{
          getAllfood()
        })
      : alert("you must login first");
  };
  // toggle like end
  useEffect(() => {
    getAllfood();
    const token = Cookies.get("jwtToken");
    token ? setAuthenticated(true) : setAuthenticated(false);
  }, [getAllfood]);
  return (
    <>
      <Navbars />
      <Row className="justify-content-center">
        {all_foods.map((item, index) => {
          let eachIngridients = item.ingredients.join(" ");
          return (
            <Card style={{ width: "300px" }} className="cards" key={index}>
              <CardImg className="cardsImg" src={`${item.imageUrl}`}></CardImg>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  {item.description}
                  <br />
                  <br />
                  {eachIngridients}
                </Card.Text>
                <Card.Text style={{ fontSize: "25px", justifySelf: "end" }}>
                  <Button
                    variant="none"
                    className="likeButton"
                    onClick={() => toggleLike(item.id, item.isLike)}
                  >
                    <i
                      className={
                        item.isLike ? "bi bi-heart-fill red" : "bi bi-heart"
                      }
                      style={{ fontSize: "25px" }}
                    ></i>
                  </Button>
                  {item.totalLikes}
                </Card.Text>
                <ReactStars
                  classNames="noHover"
                  count={5}
                  onChange={null}
                  isHalf={true}
                  value={item.rating}
                  size={45}
                  activeColor="#ffd700"
                />
              </Card.Body>
            </Card>
          );
        })}
      </Row>
    </>
  );
}

export default App;
