import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/api/authapi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [login, { isLoading, error}] = useLoginMutation();
  // console.log(error);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, isAuthenticated, navigate]);

  const handleformSubmit = (event) => {
    event.preventDefault();

    const loginData = {
      email,
      password,
    };
    login(loginData);
  };
  return (
    <>
    <MetaData title={"Login"} />

    <div className="container">
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow rounded bg-body" onSubmit={handleformSubmit}>
          <h2 className="mb-4">Login</h2>
          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
          </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
          </div>

          <Link to="/password/forgot" className="float-end mb-4">
            Forgot Password?
          </Link>

          <button
            id="login_button"
            type="submit"
            className="btn w-100 py-2"
            disabled={isLoading}
            >
            {isLoading ? "Authicating...." : "LOGIN"}
          </button>

          <div className="my-3">
            <Link to="/register" className="float-end">
              New User?
            </Link>
          </div>
        </form>
      </div>
    </div>
    </div>
    </>
  );
};

export default LogIn;
