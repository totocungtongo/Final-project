import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { Spinner } from "react-bootstrap";
import { useState } from "react";



function ImageUploader(){
  const [loading, setLoading] = useState(false)
  const [image_error, setImageerror] = useState(false)
    const image_form = useFormik({
      initialValues: {
        image: "",
      },
      onSubmit: (value) => {
        Cookies.remove("image_uploaded");
        setLoading(true);
        let form_data = new FormData();
        form_data.append("image", value.image);
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
            setLoading(false)
            Cookies.set("image_uploaded", res.data.url);
          })
          .catch((e) => {
            console.log(e)
            setImageerror(true);
            setLoading(false);
            setTimeout(() => {
              alert(`image must below 1mb`);
            }, 500);
          });
      },
    })
    window.onbeforeunload = function () {
      Cookies.remove("image_uploaded");
      setImageerror(false);
    };
    return (
      <Form onSubmit={image_form.handleSubmit} id="image_uploader">
        <Form.Group className="d-flex  justify-content-between">
          <Form.Group>
            <Form.Control
              id="image"
              name="image"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(event) => {
                image_form.setFieldValue("image", event.target.files[0]);
              }}
              onBlur={image_form.handleBlur}
            />
          </Form.Group>
          <Form.Group className="d-flex  justify-content-around">
            <Button
              variant="primary"
              type="submit"
              style={{ marginRight: "5px" }}
            >
              Upload
            </Button>
            {loading ? (
              <Spinner
                animation="grow"
                style={{ border: "8px solid #c11c08" }}
              />
            ) : null}
            {Boolean(Cookies.get("image_uploaded")) ? (
              <i
                className="bi bi-check-circle-fill  "
                style={{ color: "green", fontSize: "30px" }}
              ></i>
            ) : image_error ? (
              <i
                className="bi bi-x-circle-fill"
                style={{ color: "red", fontSize: "30px" }}
              ></i>
            ) : null}
          </Form.Group>
        </Form.Group>
      </Form>
    );
}
export default ImageUploader