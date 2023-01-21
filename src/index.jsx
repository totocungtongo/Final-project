import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import App from "./Home_page/App";
import Login from "./Login_page/Login";
import Register from "./Register_page/Register";
import Account from "./Update_profile_page/Update";
import Creatfood from "./CreateFood_page/Createfood";
import Likefood from "./LikedFood_page/Likedfood";
import Userdetails from "./Component/Userdetails";
import Alluser from "./Alluser_page/Alluser";
import Navbars from "./Component/Navbar";
const AppWrapper = () => {
  const [authenticated, setAuthenticated] = useState(undefined);
  const [isAdmin, setIsadmin] = useState(undefined);
  useEffect(() => {
    const token = Boolean(Cookies.get("jwtToken"));
    const isAdmin = Boolean(Cookies.get("user_role") === "admin");
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    if (isAdmin) {
      setIsadmin(true);
    } else {
      setIsadmin(false);
    }
  }, []);
  return (
    <>
      <Navbars />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={"/Home"} replace />} />
          <Route
            path="/Home"
            element={
              authenticated === undefined ? null : authenticated ? (
                <App />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/Register"
            element={
              authenticated === undefined ? null : authenticated ? (
                <Navigate to={"/"} replace />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/Login"
            element={
              authenticated === undefined ? null : authenticated ? (
                <Navigate to={"/"} replace />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/Update"
            element={
              authenticated === undefined ? null : authenticated ? (
                <Account />
              ) : (
                <Navigate to={"/"} replace />
              )
            }
          />
          <Route
            path="/Upload Food"
            element={
              isAdmin === undefined ? null : isAdmin ? (
                <Creatfood />
              ) : (
                <Navigate to={"/"} replace />
              )
            }
          />
          <Route
            path="/Liked Food"
            element={
              authenticated === undefined ? null : authenticated ? (
                <Likefood />
              ) : (
                <Navigate to={"/"} replace />
              )
            }
          />
          <Route
            path="/User details"
            element={
              authenticated === undefined ? null : authenticated ? (
                <Userdetails />
              ) : (
                <Navigate to={"/"} replace />
              )
            }
          />
          <Route
            path="/All user"
            element={
              isAdmin === undefined ? null : isAdmin ? (
                <Alluser />
              ) : (
                <Navigate to={"/"} replace />
              )
            }
          />
          <Route
            path="*"
            element={<p style={{ color: "black" }}>Halaman Tidak Ditemukan</p>}
          />
        </Routes>
      </Router>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a
// function to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
