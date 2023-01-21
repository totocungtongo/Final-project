import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./Alluser.css"
import Footers from "../Component/Footer";
function Alluser() {
  const [all_user, setAlluser] = useState([]);
  const getAlluser = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/all-user`,
        {
          headers: {
            apiKey: `${process.env.REACT_APP_API_KEY}`,
            Authorization: `Bearer ${Cookies.get("jwtToken")}`,
          },
        }
      );
      setAlluser(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
const handleImageError = (ev) => { ev.target.src = "https://i.postimg.cc/vZK6pQjx/profilepicture.png";};
  useEffect(() => {
    getAlluser();
  }, []);
  return (
    <>
      <div class="container profile-page mt-5">
        <div class="row">
          {all_user.map((item, index) => {
            return (
              <Fragment key={index}>
                <div class="col-xl-6 col-lg-7 col-md-12 ">
                  <div class="card profile-header cards2">
                    <div class="body">
                      <div class="row">
                        <div class="col-lg-4 col-md-4 col-12">
                          <div class="profile-image float-md-right">
                            <img
                              onError={handleImageError}
                              src={
                                item.profilePictureUrl !== null
                                  ? item.profilePictureUrl
                                  : "https://i.postimg.cc/vZK6pQjx/profilepicture.png"
                              }
                              alt=""
                            />
                          </div>
                        </div>
                        <div class="col-lg-8 col-md-8 col-12">
                          <h4 class="m-t-0 m-b-0">
                            <strong>{item.name}</strong>
                          </h4>
                          <span class="role_post">{item.role}</span>
                          <p>
                            {item.email} ||  {item.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
      <Footers/>
    </>
  );
}

export default Alluser;
