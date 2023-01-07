import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbars from "./Navbar";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";
import ImageUploader from "./ImageUploader";

function Register() {
  const [loading, setLoading] = useState(false);
  const register_form = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordrepeat: "",
      role: "",
      image: "",
      phonenumber: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email adress")
        .email("Email not valid"),
      name: Yup.string().required("Please enter your username"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Please enter your password")
        .matches(
          /^(?=.*[0-9])[0-9a-zA-Z]{8,}$/,
          "password must contain at least 4 number"
        ),
      passwordrepeat: Yup.string()
        .required("Please repeat your password")
        .oneOf([Yup.ref("password"), null], "Repeated password doesn't match"),
      role: Yup.string()
        .required("Choose your role in Foodgram")
        .oneOf(["admin", "user", "general"]),
      phonenumber: Yup.string()
        .required("Please enter your phonenumber")
        .matches(/^\d+$/, "Only number can be used"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      console.log(values);
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/register`,
          {
            email: values.email,
            name: values.name,
            password: values.password,
            passwordRepeat: values.passwordrepeat,
            profilePictureUrl: Cookies.get("image_uploaded"),
            role: values.role,
            phoneNumber: values.phonenumber,
          },
          {
            headers: {
              apiKey: `${process.env.REACT_APP_API_KEY}`,
            },
          }
        )
        .then((res) => {
          axios
            .post(
              `${process.env.REACT_APP_BASE_URL}/api/v1/login`,
              {
                email: values.email,
                password: values.password,
              },
              {
                headers: {
                  apiKey: `${process.env.REACT_APP_API_KEY}`,
                },
              }
            )
            .then((res) => {
              localStorage.setItem("username", res.data.user.name);
              localStorage.setItem(
                "profileimg",
                res.data.user.profilePictureUrl
              );
              Cookies.set("jwtToken", res.data.token, {
                expires: 400,
              });
              Cookies.remove("image_uploaded");
              window.location.assign("/Home")
              setTimeout(() => {
              setLoading(false);
              }, 500);
            });
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => {
            alert(`${error.response.data.message}`);
          }, 1);
        });
    },
  });
  return (
    <>
      <Navbars />

      {!loading ? (
        <div className="form_position">
          <ImageUploader />
          <Form onSubmit={register_form.handleSubmit}>
            <Form.Group className="">
              <Form.Label htmlFor="email">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                id="email"
                name="email"
                onChange={register_form.handleChange}
                onBlur={register_form.handleBlur}
                value={register_form.values.email}
                maxLength="40"
              />
              {register_form.touched.email && register_form.errors.email ? (
                <div style={{ color: "red", marginBottom: "5px" }}>
                  <i className="bi bi-exclamation-diamond-fill"></i>{" "}
                  {register_form.errors.email}
                </div>
              ) : null}
              <Form.Label htmlFor="name">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                id="name"
                name="name"
                onChange={register_form.handleChange}
                onBlur={register_form.handleBlur}
                value={register_form.values.name}
                maxLength="10"
              />
              {register_form.touched.name && register_form.errors.name ? (
                <div style={{ color: "red", marginBottom: "5px" }}>
                  <i className="bi bi-exclamation-diamond-fill"></i>{" "}
                  {register_form.errors.name}
                </div>
              ) : null}
            </Form.Group>
            <Form.Group className="">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="Password"
                onChange={register_form.handleChange}
                onBlur={register_form.handleBlur}
                value={register_form.values.password}
                maxLength="30"
              />
            </Form.Group>
            {register_form.touched.password && register_form.errors.password ? (
              <div style={{ color: "red", marginBottom: "5px" }}>
                <i className="bi bi-exclamation-diamond-fill"></i>
                {register_form.errors.password}
              </div>
            ) : null}
            <Form.Group className="">
              <Form.Label htmlFor="passwordrepeat">Repeat Password</Form.Label>
              <Form.Control
                id="passwordrepeat"
                name="passwordrepeat"
                type="password"
                autoComplete="off"
                placeholder="Enter repeat password"
                onChange={register_form.handleChange}
                onBlur={register_form.handleBlur}
                value={register_form.values.passwordrepeat}
                maxLength="30"
              />
            </Form.Group>
            {register_form.touched.passwordrepeat &&
            register_form.errors.passwordrepeat ? (
              <div style={{ color: "red", marginBottom: "5px" }}>
                <i className="bi bi-exclamation-diamond-fill"></i>{" "}
                {register_form.errors.passwordrepeat}
              </div>
            ) : null}
            <Form.Group className="">
              <Form.Label htmlFor="role">Choose Your role </Form.Label>
              <Form.Select
                id="role"
                aria-label="Role select"
                onChange={(e) => {
                  register_form.setFieldValue("role", e.target.value);
                }}
              >
                <option>Open this select menu</option>
                <option value="user">User</option>
                <option value="general">General</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            {register_form.touched.role && register_form.errors.role ? (
              <div style={{ color: "red", marginBottom: "5px" }}>
                <i className="bi bi-exclamation-diamond-fill"></i>{" "}
                {register_form.errors.role}
              </div>
            ) : null}
            <Form.Group className="">
              <Form.Label htmlFor="phonenumber">Phone number</Form.Label>
              <Form.Control
                id="phonenumber"
                name="phonenumber"
                type="text"
                autoComplete="off"
                placeholder="Enter your phone number"
                onChange={register_form.handleChange}
                onBlur={register_form.handleBlur}
                value={register_form.values.phonenumber}
                maxLength="11"
              />
            </Form.Group>
            {register_form.touched.phonenumber &&
            register_form.errors.phonenumber ? (
              <div style={{ color: "red", marginBottom: "5px" }}>
                <i className="bi bi-exclamation-diamond-fill"></i>{" "}
                {register_form.errors.phonenumber}
              </div>
            ) : null}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      ) : (
        // <Loader />
        <Spinner animation="border" role="status" id="loading"></Spinner>
      )}
    </>
  );
}

export default Register;
