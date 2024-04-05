import React, { useEffect, useState } from "react";
import { useRegisterMutation } from "../../redux/api/authapi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";

const Register = () => {
  // setting up the sates
  const [user, setUser] = useState({
    name : "",
    email : "",
    password : ""
  })
  const {name , email, password} = user;
  
  // using regisetr Hook that we made in Redux
  const [register, { isLoading, error, isSuccess }] = useRegisterMutation();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if(isSuccess){
      navigate("/login")
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, isAuthenticated, isSuccess, navigate]);

  // handle for submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // preparing Register data
    const registerData = {
      name,
      email,
      password,
    };
    await register(registerData); 
  };

  const handleInputChange = (e) =>{
    setUser({ ...user, [e.target.name] : e.target.value });
  }

  return (
    <>
    <MetaData title={"Register"} />
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={handleFormSubmit}
          enctype="multipart/form-data"
          >
          <h2 className="mb-4">Register</h2>
          <div className="mb-3">
            <label htmlFor="name_field" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={handleInputChange}
              />
          </div>

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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              />
          </div>

          <button id="register_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          <div className="my-3">
            <Link to="/login" className="float-end">
              Already have an Account?
            </Link>
          </div>
        </form>
      </div>
    </div>
              </>
  );
};

export default Register;
