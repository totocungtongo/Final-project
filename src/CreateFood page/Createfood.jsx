import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbars from "../Navbar/Navbar";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

function Creatfood() {
  const [loading, setLoading] = useState(false);
  const handleIngredients = (event, setFieldValue) => {
    const value = event.target.value;
    setFieldValue("ingredients", value.split(" "));
  };
  const create_form = useFormik({
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
      setLoading(true);
      Cookies.remove("image_uploaded");
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
              `${process.env.REACT_APP_BASE_URL}/api/v1/create-food`,
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
              window.location.assign("/Home");
              setTimeout(() => {
                setLoading(false);
              }, 500);
            })
            .catch((e) => {
              console.log(e);
              setLoading(false);
              setTimeout(() => {
                alert(
                  `There is some error contact us if you still had this error after refresh page`
                );
              }, 500);
            });
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setTimeout(() => {
            alert(`image size is too large`);
          }, 500);
        });
    },
  });
  return (
    <>
      <Navbars />
      {!loading ? (
        <Form className="form_position" onSubmit={create_form.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name yout food</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="Enter your food name"
              onChange={create_form.handleChange}
              onBlur={create_form.handleBlur}
              value={create_form.values.name}
              maxLength={15}
            />
          </Form.Group>
          {create_form.touched.name && create_form.errors.name ? (
            <div style={{ color: "red", marginBottom: "5px" }}>
              <i className="bi bi-exclamation-diamond-fill"></i>
              {create_form.errors.name}
            </div>
          ) : null}
          <Form.Group className="mb-3">
            <Form.Label>Your food description</Form.Label>
            <Form.Control
              name="description"
              type="text"
              placeholder="Food description"
              onChange={create_form.handleChange}
              onBlur={create_form.handleBlur}
              value={create_form.values.description}
              maxLength={100}
            />
          </Form.Group>
          {create_form.touched.description && create_form.errors.description ? (
            <div style={{ color: "red", marginBottom: "5px" }}>
              <i className="bi bi-exclamation-diamond-fill"></i>
              {create_form.errors.description}
            </div>
          ) : null}
          <Form.Group className="mb-3">
            <Form.Label>Your food Ingredients</Form.Label>
            <Form.Control
              name="ingredients"
              type="text"
              placeholder="Food ingredients"
              onChange={(e) => handleIngredients(e, create_form.setFieldValue)}
              onBlur={create_form.handleBlur}
              value={create_form.values.ingredients.join(" ")}
            />
          </Form.Group>
          {create_form.touched.ingredients && create_form.errors.ingredients ? (
            <div style={{ color: "red", marginBottom: "5px" }}>
              <i className="bi bi-exclamation-diamond-fill"></i>
              {create_form.errors.ingredients}
            </div>
          ) : null}
          <Form.Group className="mb-3 ">
            <Form.Label>Upload your Food image here !</Form.Label>
            <Form.Control
              name="image"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(event) => {
                create_form.setFieldValue("image", event.target.files[0]);
              }}
              onBlur={create_form.handleBlur}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      ) : (
        <Spinner animation="border" role="status" className="loading"></Spinner>
      )}
    </>
  );
}

export default Creatfood;
