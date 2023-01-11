import "./App.css";
import Navbars from "../Navbar/Navbar";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CardImg } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import ReactStars from "react-rating-stars-component";
import Dropdown from "react-bootstrap/Dropdown";

function App() {
  const [all_foods, setAllfood] = useState([]);
  const [food_rating, setFood_rating] = useState([]);
  const [comment_foodId, setCommentfoodId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const isAdmin = Boolean(Cookies.get("user_role") === "admin");
  //get food data
  const getAllfood = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/v1/foods`, {
        headers: {
          apiKey: `${process.env.REACT_APP_API_KEY}`,
          Authorization: `Bearer ${Cookies.get("jwtToken")}`,
        },
      })
      .then((response) => {
        setAllfood(response.data.data);
      });
  };
  //get food data end
  // toggle like
  const toggleLike = (foodId, liked) => {
    !liked
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
      : axios
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
          });
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
  // toggle delete food
  const toggleDelete = (foodId) => {
   if (window.confirm("Do you really want to delete this food?")){
 axios
   .delete(`${process.env.REACT_APP_BASE_URL}/api/v1/delete-food/${foodId}`, {
     headers: {
       apiKey: `${process.env.REACT_APP_API_KEY}`,
       Authorization: `Bearer ${Cookies.get("jwtToken")}`,
     },
   })
   .then(() => {
     getAllfood();
     alert("Food Deleted");
   })
   .catch((e) => {
     console.log(e);
   });

   }  };
  // toggle delete food end
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
  }, []);
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
                  <div
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
                    {isAdmin?<Dropdown>
                      <Dropdown.Toggle variant="none" id="dropdown-basic">
                        <i
                          className="bi bi-three-dots-vertical"
                          style={{ fontSize: "25px" }}
                        ></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">
                          <Button>Update</Button>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Button onClick={()=>toggleDelete(item.id)}>
                            Delete
                          </Button>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>:null}
                  </div>
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
        {food_rating.map((unit, index2) => {
          return (
            <Modal.Body key={index2} className="d-flex" style={{}}>
              <div style={{ wordWrap: "break-word", textWrap: "unrestricted" }}>
                <span>
                  <img
                    className="img_profile"
                    src={
                      unit.user.profilePictureUrl.length > 10
                        ? unit.user.profilePictureUrl
                        : "https://www.its.ac.id/international/wp-content/uploads/sites/66/2020/02/blank-profile-picture-973460_1280.jpg"
                    }
                    alt=""
                  ></img>
                </span>
                <span style={{ marginRight: "30px", fontFamily: "Open Sans" }}>
                  <b>{unit.user.name}</b>
                </span>
                <br />
                <p
                  className="d-flex justify-content-between"
                  style={{ fontSize: "16px", marginLeft: "60px" }}
                >
                  <span>{unit.review}</span>
                  <i className="bi bi-star-fill  " style={{ fontSize: "16px" }}>
                    {unit.rating % 1 === 0
                      ? unit.rating
                      : unit.rating.toFixed(1)}
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
