import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbars from "./Navbar";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

function Login() {
  const [loading, setLoading] = useState(false);
  const login_form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Required").email("Email only"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
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
          localStorage.setItem("profileimg", res.data.user.profilePictureUrl);
          Cookies.set("jwtToken", res.data.token, {
            expires: 400,
          });
          window.location.assign("/Home");
          setTimeout(() => {
            setLoading(false);
          }, 300);
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
          setTimeout(() => {
            alert(`${e.response.data.message}`);
          }, 500);
        });

    },
  });
  return (
    <>
      <Navbars />
      {!loading ? (
        <Form onSubmit={login_form.handleSubmit} className="form_position">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              id="email"
              name="email"
              onChange={login_form.handleChange}
              onBlur={login_form.handleBlur}
              value={login_form.values.email}
            />
          </Form.Group>
          {login_form.touched.email && login_form.errors.email ? (
            <div style={{ color: "red" }}>{login_form.errors.email}</div>
          ) : null}
          <br />

          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              id="password"
              name="password"
              type="password"
              autoComplete="off"
              placeholder="Password"
              onChange={login_form.handleChange}
              onBlur={login_form.handleBlur}
              value={login_form.values.password}
            />
          </Form.Group>
          {login_form.touched.password && login_form.errors.password ? (
            <div style={{ color: "red" }}>{login_form.errors.password}</div>
          ) : null}
          <a href="/register"> Have you sign up ? Sign up here!</a>
          <br />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      ) : (
        // <Loader />
        <Spinner animation="border" role="status" id="loading">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </>
  );
}
export default Login;
