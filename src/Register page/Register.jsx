import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

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
                  localStorage.setItem("user_role", res.data.user.role);
                  Cookies.set("jwtToken", res.data.token, {
                    expires: 400,
                  });
                  Cookies.set("user_id", res.data.user.id, {
                    expires: 400,
                  });
                  Cookies.set("user_role", res.data.user.role, {
                    expires: 400,
                  });
                  Cookies.remove("image_uploaded");
                  window.location.assign("/Home");
                  setTimeout(() => {
                    setLoading(false);
                  }, 1000);
                });
            })
            .catch((error) => {
              setLoading(false);
              setTimeout(() => {
                alert(`${error.response.data.message}`);
              }, 1);
            });
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setTimeout(() => {
            alert(`image size is too large `);
          }, 500);
        });
    },
  });
  return (
    <>
      {!loading ? (
        <Form className="form_position" onSubmit={register_form.handleSubmit}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              onChange={register_form.handleChange}
              onBlur={register_form.handleBlur}
              value={register_form.values.email}
              maxLength="40"
            />
            {register_form.touched.email && register_form.errors.email ? (
              <div style={{ color: "red", marginBottom: "5px" }}>
                <i className="bi bi-exclamation-diamond-fill"></i>
                {register_form.errors.email}
              </div>
            ) : null}
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="name"
              onChange={register_form.handleChange}
              onBlur={register_form.handleBlur}
              value={register_form.values.name}
              maxLength="10"
            />
            {register_form.touched.name && register_form.errors.name ? (
              <div style={{ color: "red", marginBottom: "5px" }}>
                <i className="bi bi-exclamation-diamond-fill"></i>
                {register_form.errors.name}
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
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
          <Form.Group>
            <Form.Label>Repeat Password</Form.Label>
            <Form.Control
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
              <i className="bi bi-exclamation-diamond-fill"></i>
              {register_form.errors.passwordrepeat}
            </div>
          ) : null}
          <Form.Group>
            <Form.Label>Choose Your role </Form.Label>
            <Form.Select
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
              <i className="bi bi-exclamation-diamond-fill"></i>
              {register_form.errors.role}
            </div>
          ) : null}
          <Form.Group className="mb-3 ">
            <Form.Label>Upload your image here ! </Form.Label>
            <Form.Control
              name="image"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(event) => {
                register_form.setFieldValue("image", event.target.files[0]);
              }}
              onBlur={register_form.handleBlur}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="phonenumber">Phone number</Form.Label>
            <Form.Control
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
              <i className="bi bi-exclamation-diamond-fill"></i>
              {register_form.errors.phonenumber}
            </div>
          ) : null}
          <a href="/Login"> Do you already have account ? Click here to sign up!</a>
          <br />
          <Button variant="primary" type="submit">
            Register!
          </Button>
        </Form>
      ) : (
        // <Loader />
        <Spinner animation="border" role="status" className="loading"></Spinner>
      )}
    </>
  );
}

export default Register;
