import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import { useUpdateProfileMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";

const UpdateUserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const [updateProfile, { isLoading, error, isSuccess }] =
    useUpdateProfileMutation();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setEmail(user?.email);
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Profile Updated Successfully");
      navigate("/me/profile");
    }
  }, [user, error, isSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      name,
      email,
    };
    await updateProfile(userData);
  };

  return (
    <>
    <MetaData title="Update Profile"/>
        <UserLayout>
      <div class="row wrapper">
        <div class="col-10 col-lg-8">
          <form class="shadow rounded bg-body" onSubmit={handleSubmit}>
            <h2 class="mb-4">Update Profile</h2>

            <div class="mb-3">
              <label htmlFor="name_field" class="form-label">
                Name
              </label>
              <input
                type="text"
                id="name_field"
                class="form-control"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="mb-3">
              <label htmlFor="email_field" class="form-label">
                {" "}
                Email{" "}
              </label>
              <input
                type="email"
                id="email_field"
                class="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <button type="submit" class="btn update-btn w-100" disabled={isLoading}>
           {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
                </>
  );
};

export default UpdateUserProfile;
