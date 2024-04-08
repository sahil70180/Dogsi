import React, { useEffect, useState } from 'react'
import { useForgotPasswordMutation } from '../../redux/api/userApi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MetaData from '../layout/MetaData';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [forgotPassword, {isLoading, error, isSuccess}] = useForgotPasswordMutation();
    // console.log(error);

    const {isAuthenticated} = useSelector((state) => state.auth);

    useEffect(() => {
      if(isAuthenticated){
        navigate("/");
      }
      if(error){
          toast.error(error?.data?.message);
        }
      if(isSuccess){
          toast.success(`Recovery Mail Sent! Please check Inbox`)
          setEmail("");
          navigate("/")
      }
    },[isAuthenticated, error, navigate, isSuccess, error?.data?.message]);
    

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!email){
            return toast.error("Email is Requried for Password Recovery Mail")
        }
        forgotPassword({email});
    }

  return (
    <>
    <MetaData title={"Forgot Password"} />
    <div className="container">

    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={handleSubmit}
          >
          <h2 className="mb-4">Forgot Password</h2>
          <div className="mt-3">
            <label htmlFor="email_field" className="form-label">Enter Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
          </div>

          <button
            id="forgot_password_button"
            type="submit"
            className="btn w-100 py-2"
            disabled={isLoading}
            >
            { isLoading ? "Sending Email..." : "Send Email"}
          </button>
      <div className="my-3">
            <Link to="/login" className="float-end">
              Already have an Account?
            </Link>
          </div>
        </form>
      </div>
    </div>

              </div>
            </>
  )
}

export default ForgotPassword
