import Cookies from "js-cookie";
import "./Component css/Footer.css";


function Footers() {
  const isLoggedin = Boolean(Cookies.get("jwtToken"));
  const isAdmin = Boolean(Cookies.get("user_role") === "admin");
  return (
    <>
      {isLoggedin ? (
        <>
          <div className="container-fluid justify-content-center container_footer">
            <div className="row py-5">
              <div className="col">
                <div className="card_footer border-0 ">
                  <div className="text-center background_none ">
                    <h2 className="h2_footer">
                      <b>Oops you've reach the end</b>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <hr className="mx-0 px-0" />
            <footer>
              <div className="row justify-content-around mb-5 pt-5 pb-0 ">
                <div className=" col-11">
                  <div className="row justify-content-center">
                    <div className="col-md-3 col-12 font-italic align-items-center  mt-md-3 mt-4">
                      <h5 className="h5_footer">
                        <span>
                          <img
                            src="https://i.postimg.cc/50zzHVzd/Food-journal-1.png"
                            className="img-fluid mb-1 imgs "
                            alt=""
                          />
                        </span>
                        <b
                          style={{
                            fontFamily: "Oleo Script",
                            color: "#e46514",
                          }}
                        >
                          Foodgram
                        </b>
                      </h5>
                      <p className="social mt-md-3 mt-2">
                        <span>
                          <i
                            className="bi bi-facebook bi_footer"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span>
                          <i
                            className="bi bi-linkedin bi_footer"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span>
                          <i
                            className="bi bi-twitter bi_footer"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </p>
                      <small className="copy-rights cursor-pointer">
                        &#9400; 2022 @abdurrahmanaldjufry
                      </small>
                      <br />
                      <small>Copyright. All Rights Resered. </small>
                    </div>
                    {isLoggedin ? (
                      <div className="col-md-3 col-12  my-sm-0 mt-5">
                        <ul className="list-unstyled">
                          <li className="mt-md-3 mt-4 li_footer">Our Pages</li>
                          <li className="li_footer">
                            <a href="/Home" style={{ color: "black" }}>
                              Home
                            </a>
                          </li>
                          <li className="li_footer">
                            <a href="/Liked food" style={{ color: "black" }}>
                              Favorite food
                            </a>
                          </li>
                          {isAdmin ? (
                            <li className="li_footer">
                              <a href="/Upload" style={{ color: "black" }}>
                                Upload food
                              </a>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    ) : null}
                    <div className="col-md-3 col-12 my-sm-0 mt-5">
                      <ul className="list-unstyled">
                        <li className="mt-md-3 mt-4 li_footer">Your needs</li>
                        <li className="li_footer">Security</li>
                        <li className="li_footer">Core Features</li>
                        <li className="li_footer">Product Features</li>
                        <li className="li_footer">Pricing</li>
                      </ul>
                    </div>
                    <div className="col-xl-auto col-md-3 col-12 my-sm-0 mt-5">
                      <ul className="list-unstyled">
                        <li className="mt-md-3 mt-4 li_footer">Contact us</li>
                        <li className=" li_footer">Gmail</li>
                        <li className=" li_footer">Facebook</li>
                        <li className=" li_footer">Instagram</li>
                        <li className=" li_footer">Twitter</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Footers;
