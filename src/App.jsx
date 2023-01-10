import "./App.css";
import Navbars from "./Navbar";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { CardImg } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import ReactStars from "react-rating-stars-component";

function App() {
  const [all_foods, setAllfood] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [food_rating, setFood_rating] = useState([]);
  const [comment_foodId, setCommentfoodId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //get food data
  const getAllfood = useCallback(() => {
    authenticated
      ? axios
          .get(`${process.env.REACT_APP_BASE_URL}/api/v1/foods`, {
            headers: {
              apiKey: `${process.env.REACT_APP_API_KEY}`,
              Authorization: `Bearer ${Cookies.get("jwtToken")}`,
            },
          })
          .then((response) => {
            setAllfood(response.data.data);
          })
      : axios
          .get(`${process.env.REACT_APP_BASE_URL}/api/v1/foods`, {
            headers: {
              apiKey: `${process.env.REACT_APP_API_KEY}`,
            },
          })
          .then((response) => {
            setAllfood(response.data.data);
          });
  }, [authenticated]);
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
            getAllfood();
          })
      : authenticated && liked
      ? axios
          .post(
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
          )
          .then(() => {
            getAllfood();
          })
      : alert("you must login first");
  };
  // toggle like end
  // toggle comment
  const toggleComment = (foodId) => {
    handleShow();
    getComment(foodId);
  };
  const getComment = (foodId) => {
    setCommentfoodId(foodId);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/v1/food-rating/${foodId}`, {
        headers: {
          apiKey: `${process.env.REACT_APP_API_KEY}`,
        },
      })
      .then((res) => {
        setFood_rating(res.data.data);
      });
  };
  // toggle comment end
  // Review form
  const review_form = useFormik({
    initialValues: {
      rating: 0,
      review: "",
      foodId: localStorage.getItem("comment_foodid"),
    },
    onSubmit: (values) => {
       console.log(values.rating);
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/rate-food/${comment_foodId}`,
          {
            rating: values.rating,
            review: values.review,
          },
          {
            headers: {
              apiKey: `${process.env.REACT_APP_API_KEY}`,
              Authorization: `Bearer ${Cookies.get("jwtToken")}`,
            },
          }
        )
        .then(() => {
          getComment(comment_foodId);
          getAllfood();
        });
    },
  });
  // Review form end
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
            <>
              <Card style={{ width: "300px" }} className="cards" key={index}>
                <CardImg
                  className="cardsImg"
                  src={`${item.imageUrl}`}
                ></CardImg>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    {item.description}
                    <br />
                    <br />
                    {eachIngridients}
                  </Card.Text>
                  <Card.Text
                    style={{ fontSize: "25px", justifySelf: "end" }}
                    className="d-flex justify-content-around"
                  >
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
                      <span className="pt-1" style={{ fontSize: "26px" }}>
                        {item.totalLikes}
                      </span>
                    </Button>

                    <Button
                      variant="none"
                      style={{
                        width: "51px",
                        height: "51.5px",
                        padding: "6px 12px",
                        border: "none",
                      }}
                      className="d-flex justify-content-center"
                    >
                      <i
                        className="bi bi-star-fill align-self-center"
                        style={{ fontSize: "25px" }}
                      ></i>
                      <span style={{ fontSize: "26px", paddingTop: "2px" }}>
                        {item.rating % 1 === 0
                          ? item.rating
                          : item.rating.toFixed(1)}
                      </span>
                    </Button>
                    <Button
                      variant="none"
                      className="Review_Button"
                      onClick={() => toggleComment(item.id)}
                    >
                      <i
                        className={"bi bi-chat-right"}
                        style={{ fontSize: "25px" }}
                      ></i>
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </>
          );
        })}
      </Row>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reviews</Modal.Title>
        </Modal.Header>
        {food_rating.map((item, index2) => {
          return (
            <Modal.Body key={index2} className="d-flex" style={{}}>
              <div style={{ wordWrap: "break-word", textWrap: "unrestricted" }}>
                <span>
                  <img
                    className="img_profile"
                    src={
                      item.user.profilePictureUrl.length > 10
                        ? item.user.profilePictureUrl
                        : "https://www.its.ac.id/international/wp-content/uploads/sites/66/2020/02/blank-profile-picture-973460_1280.jpg"
                    }
                    alt=""
                  ></img>
                </span>
                <span style={{ marginRight: "30px", fontFamily: "Open Sans" }}>
                  <b>{item.user.name}</b>
                </span>
                <br />
                <p
                  className="d-flex justify-content-between"
                  style={{ fontSize: "16px", marginLeft: "60px" }}
                >
                  <span>{item.review}</span>
                  <i className="bi bi-star-fill  " style={{ fontSize: "16px" }}>
                    {item.rating % 1 === 0
                      ? item.rating
                      : item.rating.toFixed(1)}
                  </i>
                </p>
              </div>
            </Modal.Body>
          );
        })}

        <Modal.Footer>
          <Form
            className="container-fluid d-flex justify-content-between "
            onSubmit={review_form.handleSubmit}
          >
            <Form.Group className="mb-1">
              <Form.Control
                name="review"
                type="text"
                placeholder="Your review.."
                onChange={review_form.handleChange}
                value={review_form.values.review}
                maxLength={30}
              />
            </Form.Group>
            <ReactStars
              name="ratings"
              count={5}
              onChange={(value) => {
                review_form.setFieldValue("rating", value);
              }}
              size={25}
              activeColor="#ffd700"
              value={review_form.values.rating}
            />
            <Button variant="primary" type="submit">
              Post
            </Button>
          </Form>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
