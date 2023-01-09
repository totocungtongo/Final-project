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
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import Account from "./Account";

const AppWrapper = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = Boolean(Cookies.get("jwtToken"));
    token ? setAuthenticated(true) : setAuthenticated(false);
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={authenticated ? <App /> : <Login />} />
        <Route path="/Home" element={authenticated ? <App /> : <Login />} />
        <Route
          path="/Register"
          element={authenticated ? <Navigate to={"/"} replace /> : <Register />}
        />
        <Route
          path="/Login"
          element={
            authenticated ? <Navigate to={"/Home"} replace /> : <Login />
          }
        />
        <Route
          path="/Update"
          element={
            Cookies.get("jwtToken") ? (
              <Account />
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
