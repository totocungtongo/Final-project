import "./App.css";
import Navbars from "../Component/Navbar";
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
import * as Yup from "yup";

function App() {
  const [all_foods, setAllfood] = useState([]);
  const [food_rating, setFoodrating] = useState([]);
  const [food_update, setFoodupdate] = useState([]);
  const [comment_foodId, setCommentfoodId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const handleIngredients = (event, setFieldValue) => {
    const value = event.target.value;
    setFieldValue("ingredients", value.split(" "));
  };
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
  // toggle delete food
  const toggleDelete = (foodId) => {
    if (window.confirm("Do you really want to delete this food?")) {
      axios
        .delete(
          `${process.env.REACT_APP_BASE_URL}/api/v1/delete-food/${foodId}`,
          {
            headers: {
              apiKey: `${process.env.REACT_APP_API_KEY}`,
              Authorization: `Bearer ${Cookies.get("jwtToken")}`,
            },
          }
        )
        .then(() => {
          getAllfood();
          alert("Food Deleted");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  // toggle delete food end
  // toggle Update food
  const getFoodbyid = (foodId) => {
    handleShow2();
    Cookies.set("update_foodId", foodId);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/v1/foods/${foodId}`, {
        headers: {
          apiKey: `${process.env.REACT_APP_API_KEY}`,
          Authorization: `Bearer ${Cookies.get("jwtToken")}`,
        },
      })
      .then((res) => {
        setFoodupdate(res.data.data);
      });
  };

  const update_food_form = useFormik({
    initialValues: {
      name: "",
      description: "",
      image: "",
      ingredients: [],
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, "Minimum 5 characters")
        .required("Please enter your Food Name"),
      description: Yup.string()
        .min(20, "Minimum 20 characters")
        .required("Please enter the description of your food"),
      ingredients: Yup.array()
        .min(4, "Minimum 4 characters each ingredients")
        .required("Please enter the ingredients of your food"),
    }),
    onSubmit: (values) => {
      Cookies.remove("image_uploaded");
      let foodId = Cookies.get("update_foodId");
      let form_data = new FormData();
      form_data.append("image", values.image);
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/upload-image`,
          form_data,
          {
            headers: {
              apiKey: `${process.env.REACT_APP_API_KEY}`,
            },
          }
        )
        .then((res) => {
          Cookies.set("image_uploaded", res.data.url);
          axios
            .post(
              `${process.env.REACT_APP_BASE_URL}/api/v1/update-food/${foodId}`,
              {
                name: values.name,
                description: values.description,
                imageUrl: Cookies.get("image_uploaded"),
                ingredients: values.ingredients,
              },
              {
                headers: {
                  apiKey: `${process.env.REACT_APP_API_KEY}`,
                  Authorization: `Bearer ${Cookies.get("jwtToken")}`,
                },
              }
            )
            .then(() => {
              Cookies.remove("image_uploaded");
              Cookies.remove("update_foodId");
              handleClose2();
              getAllfood();
              setTimeout(() => {
                alert("Food Updated!");
              }, 500);
            })
            .catch((e) => {
              console.log(e);
              setTimeout(() => {
                alert(
                  `There is some error contact us if you still had this error after refresh page`
                );
              }, 500);
            });
        })
        .catch((e) => {
          console.log(e);
          setTimeout(() => {
            alert(`image size is too large`);
          }, 500);
        });
    },
  });
  // toggle Update food end
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
                      onClick={() => getComment(item.id)}
                    >
                      <i
                        className={"bi bi-chat-right"}
                        style={{ fontSize: "25px" }}
                      ></i>
                    </Button>
                    {isAdmin ? (
                      <Dropdown>
                        <Dropdown.Toggle variant="none" id="dropdown-basic">
                          <i
                            className="bi bi-three-dots-vertical"
                            style={{ fontSize: "25px" }}
                          ></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <Button onClick={() => getFoodbyid(item.id)}>
                              Update
                            </Button>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Button onClick={() => toggleDelete(item.id)}>
                              Delete
                            </Button>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : null}
                  </div>
                </Card.Body>
              </Card>
            </>
          );
        })}
      </Row>
      {/* MOADAL REVIEW */}
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
      {/* MOADAL REVIEW  END*/}
      {/* MODAL UPDATE FOOD  */}
      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex" style={{}}>
          <Form onSubmit={update_food_form.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New food Name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                placeholder="Enter your new food name"
                onChange={update_food_form.handleChange}
                onBlur={update_food_form.handleBlur}
                value={update_food_form.values.name}
                maxLength={25}
              />
              <Form.Text className="text-muted">
                {`Previous Food name is ${food_update.name}`}.
              </Form.Text>
            </Form.Group>
            {update_food_form.touched.name && update_food_form.errors.name ? (
              <div style={{ color: "red", marginBottom: "5px" }}>
                <i className="bi bi-exclamation-diamond-fill"></i>
                {update_food_form.errors.name}
              </div>
            ) : null}
            <Form.Group className="mb-3">
              <Form.Label>New food Description</Form.Label>
              <Form.Control
                name="description"
                type="text"
                placeholder="Enter your new description"
                onChange={update_food_form.handleChange}
                onBlur={update_food_form.handleBlur}
                value={update_food_form.values.description}
                maxLength={100}
              />
              <Form.Text className="text-muted">
                {`Previous Description "${food_update.description}"`}.
              </Form.Text>
            </Form.Group>
            {update_food_form.touched.description &&
            update_food_form.errors.description ? (
              <div style={{ color: "red", marginBottom: "5px" }}>
                <i className="bi bi-exclamation-diamond-fill"></i>
                {update_food_form.errors.description}
              </div>
            ) : null}
            <Form.Group className="mb-3 ">
              <Form.Label>Upload your new food image here !</Form.Label>
              <Form.Control
                name="image"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(event) => {
                  update_food_form.setFieldValue(
                    "image",
                    event.target.files[0]
                  );
                }}
                onBlur={update_food_form.handleBlur}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Your food Ingredients</Form.Label>
              <Form.Control
                name="ingredients"
                type="text"
                placeholder="Food ingredients"
                onChange={(e) =>
                  handleIngredients(e, update_food_form.setFieldValue)
                }
                onBlur={update_food_form.handleBlur}
                value={update_food_form.values.ingredients.join(" ")}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        ;<Modal.Footer></Modal.Footer>
      </Modal>
      {/* MODAL UPDATE FOOD  END*/}
    </>
  );
}

export default App;
