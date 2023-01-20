import { useEffect, useState } from "react";
import "./Component css/Userdetails.css";
import axios from "axios";
import Cookies from "js-cookie";



function Userdetails() {
   const [user_details, setUserdetails] = useState({});
   const [profile_pictures, setProfilepictures] = useState("")
   const getUserdetails = async () => {
     try {
       const res = await axios.get(
         `${process.env.REACT_APP_BASE_URL}/api/v1/user`,
         {
           headers: {
             apiKey: `${process.env.REACT_APP_API_KEY}`,
             Authorization: `Bearer ${Cookies.get("jwtToken")}`,
           },
         }
       );
       setUserdetails(res.data.user);
       setProfilepictures(res.data.user.profilePictureUrl)
     } catch (err) {
       console.log(err);
     }
   };

   useEffect(() => {
     getUserdetails();
   }, []);
    return (
      <>
        <div className="container mt-5 container_profile">
          <div className="row d-flex justify-content-center">
            <div className="col-md-7">
              <div className="card p-3 py-4">
                <div className="text-center">
                  <img
                    src={
                      profile_pictures
                        ? profile_pictures
                        : "https://i.postimg.cc/vZK6pQjx/profilepicture.png"
                    }
                    alt=""
                    width={150}
                    height={150}
                    className="rounded-circle"
                  />
                </div>

                <div className="text-center mt-3">
                  <span className="bg-secondary p-1 px-4 rounded text-white">
                    {user_details.role}
                  </span>
                  <h5 className="mt-2 mb-0">{user_details.name}</h5>
                  <span>{user_details.email}</span>

                  <div className="px-4 mt-1">
                    <p className="fonts">
                      Consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                  <span>{user_details.phoneNumber}</span>
                  <ul className="social-list">
                    <li>
                      <i className="bi bi-facebook"></i>
                    </li>
                    <li>
                      <i className="bi bi-instagram"></i>
                    </li>
                    <li>
                      <i className="bi bi-google"></i>
                    </li>
                  </ul>
                  <div className="buttons">
                    <button className="btn btn-primary px-4 ms-3">
                      <a href="/Update" style={{ color: "white" }}>
                        Edit
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default Userdetails;