import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Spinner } from "react-bootstrap";

function Account() {
  const [loading, setLoading] = useState(false);
  const isAdmin = Boolean(Cookies.get("user_role") === "admin");
  const account_form = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
      image: "",
      phonenumber: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email adress")
        .email("Email not valid"),
      name: Yup.string().required("Please enter your username"),
      phonenumber: Yup.string()
        .required("Please enter your phonenumber")
        .matches(/^\d+$/, "Only number can be used"),
      role: Yup.string()
        .required("Choose your role in Foodgram")
        .oneOf(["admin", "user", "general"]),
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
              `${process.env.REACT_APP_BASE_URL}/api/v1/update-profile`,
              {
                name: values.name,
                email: values.email,
                profilePictureUrl: Cookies.get("image_uploaded"),
                phoneNumber: values.phonenumber,
              },
              {
                headers: {
                  apiKey: `${process.env.REACT_APP_API_KEY}`,
                  Authorization: `Bearer ${Cookies.get("jwtToken")}`,
                },
              }
            )
            .then(() => {
              localStorage.clear();
              localStorage.setItem("username", values.name);
              localStorage.setItem("profileimg", Cookies.get("image_uploaded"));
              axios.post(
                `${
                  process.env.REACT_APP_BASE_URL
                }/api/v1/update-user-role/${Cookies.get("user_id")}`,
                { role: values.role },
                {
                  headers: {
                    apiKey: `${process.env.REACT_APP_API_KEY}`,
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`,
                  },
                }
              );
              Cookies.remove("image_uploaded");
              window.location.assign("/User details");
              setTimeout(() => {
                setLoading(false);
              }, 300);
            })
            .catch((e) => {
              console.log(e);
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
      {!loading ? (
        <div className="form_position">
          <Form onSubmit={account_form.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter new email"
                id="email"
                name="email"
                onChange={account_form.handleChange}
                onBlur={account_form.handleBlur}
                value={account_form.values.email}
              />
            </Form.Group>
            {account_form.touched.email && account_form.errors.email ? (
              <div style={{ color: "red" }}>{account_form.errors.email}</div>
            ) : null}
            <br />
            <Form.Group className="mb-3">
              <Form.Label>New Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new name"
                name="name"
                onChange={account_form.handleChange}
                onBlur={account_form.handleBlur}
                value={account_form.values.name}
              />
            </Form.Group>
            {account_form.touched.name && account_form.errors.name ? (
              <div style={{ color: "red" }}>{account_form.errors.name}</div>
            ) : null}
            <br />
            {isAdmin ? (
              <>
                <Form.Group>
                  <Form.Label htmlFor="role">Choose Your role </Form.Label>
                  <Form.Select
                    aria-label="Role select"
                    onChange={(e) => {
                      account_form.setFieldValue("role", e.target.value);
                    }}
                  >
                    <option>Choose role here!</option>
                    <option value="user">User</option>
                    <option value="general">General</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
                {account_form.touched.role && account_form.errors.role ? (
                  <div style={{ color: "red", marginBottom: "5px" }}>
                    <i className="bi bi-exclamation-diamond-fill"></i>{" "}
                    {account_form.errors.role}
                  </div>
                ) : null}
              </>
            ) : null}
            <Form.Group className="mb-3 ">
              <Form.Label>Upload your image here ! </Form.Label>
              <Form.Control
                name="image"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(event) => {
                  account_form.setFieldValue("image", event.target.files[0]);
                }}
                onBlur={account_form.handleBlur}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Update phonenumber</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your new phonenumber"
                name="phonenumber"
                onChange={account_form.handleChange}
                onBlur={account_form.handleBlur}
                value={account_form.values.phonenumber}
                maxLength={11}
              />
            </Form.Group>
            {account_form.touched.phonenumber &&
            account_form.errors.phonenumber ? (
              <div style={{ color: "red" }}>
                {account_form.errors.phonenumber}
              </div>
            ) : null}
            <br />
            <div
              className="d-flex justify-content-center "
              style={{ gap: "10px" }}
            >
              <Button variant="danger">
                <a href="/User details" style={{ color: "white" }}>
                  Cancel
                </a>
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <Spinner animation="border" role="status" className="loading"></Spinner>
      )}
    </>
  );
}

export default Account;
