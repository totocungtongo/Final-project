import "../Home page/card.css";
import Navbars from "../Component/Navbar";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Fragment, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CardImg } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import ReactStars from "react-rating-stars-component";

function Likefood() {
  const [liked_food, setLikedfood] = useState([]);
  const [food_rating, setFoodrating] = useState([]);
  const [comment_foodId, setCommentfoodId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // get liked food
  const getLikefood = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/v1/like-foods`, {
        headers: {
          apiKey: `${process.env.REACT_APP_API_KEY}`,
          Authorization: `Bearer ${Cookies.get("jwtToken")}`,
        },
      })
      .then((res) => {
        setLikedfood(res.data.data);
      });
  };
  // get liked food end
  // toggleLike
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
            getLikefood();
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
            getLikefood();
          });
  };
  // toggleLike end
  // toggle comment
   const getComment = (foodId) => {
     handleShow();
     setCommentfoodId(foodId);
     axios
       .get(`${process.env.REACT_APP_BASE_URL}/api/v1/food-rating/${foodId}`, {
         headers: {
           apiKey: `${process.env.REACT_APP_API_KEY}`,
         },
       })
       .then((res) => {
         setFoodrating(res.data.data);
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
          getLikefood();
        });
    },
  });
  useEffect(() => {
    getLikefood();
  }, []);
  return (
    <div className="background">
      <Navbars />
     <div className="container py-2">
        {liked_food.map((item, index) => {
          let eachIngridients = item.ingredients.join(" ");
          return (
            <Fragment key={index}>
              <Card className="cards postcard light red">
                <CardImg
                  className="postcard__img"
                  src={`${item.imageUrl}`}
                ></CardImg>
                <Card.Body className="postcard__text t-dark">
                  <Card.Title className="postcard__title red">
                    {item.name}
                  </Card.Title>
                  <div className="postcard__bar"></div>
                  <Card.Text className="postcard__preview-txt">
                    {item.description}
                    <br />
                    Ingridients : {eachIngridients}
                  </Card.Text>
                  <ul className="postcard__tagbox">
                    <li className="tag__item">
                      <Button
                        variant="none"
                        className="likeButton"
                        onClick={() => toggleLike(item.id, item.isLike)}
                      >
                        <i
                          className={
                            item.isLike
                              ? "bi bi-heart-fill reds"
                              : "bi bi-heart"
                          }
                          style={{ fontSize: "25px" }}
                        >
  
                          {item.totalLikes}
                        </i>
                      </Button>
                    </li>
                    <li className="tag__item">
                      <Button
                        variant="none"
                        className="d-flex justify-content-center"
                      >
                        <i
                          className="bi bi-star-fill align-self-center"
                          style={{ fontSize: "25px" }}
                        >
                          {item.rating % 1 === 0
                            ? item.rating
                            : item.rating.toFixed(1)}
                        </i>
                      </Button>
                    </li>
                    <li className="tag__item">
                      <Button
                        variant="none"
                        className="Review_Button"
                        onClick={() => getComment(item.id)}
                      >
                        <i
                          className={"bi bi-chat-right"}
                          style={{ fontSize: "25px" }}
                        ></i>
                      </Button>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Fragment>
          );
        })}
      </div>
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
    </div>
  );
}

export default Likefood;
