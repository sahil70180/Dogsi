import React from "react";
import LOGO from "../../assets/images/LOGO.png";
import { Link, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/images/default_avatar.jpg";
import Search from "./Search";
import { useGetMeQuery } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import { useLazyLogoutQuery } from "../../redux/api/authapi";
import toast from "react-hot-toast";

const Header = () => {
  const { isLoading } = useGetMeQuery();
  const [logout] = useLazyLogoutQuery();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(0);
    toast.success("Logout Successfully");
  };
  return (
    <div>
      <nav className="navbar row">
        <div className="col-12 col-md-3 ps-5">
          <div className="navbar-brand">
            <Link to="/">
              <img
                src={LOGO}
                alt="ShopIT Logo"
                height={90}
                style={{
                  borderRadius: "50%",
                  marginTop: "-15px",
                  position: "absolute",
                  top: "5px",
                  left: "40px",
                }}
              />
            </Link>
          </div>
        </div>
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Search />
        </div>
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/cart" className="cart-underline">
            <span id="cart" className="ms-3">
              {" "}
              Cart{" "}
            </span>
            <span className="ms-1" id="cart_count">
              {cartItems?.length}
            </span>
          </Link>

          {user ? (
            <div className="ms-4 dropdown">
              <button
                className="btn dropdown-toggle text-white"
                type="button"
                id="dropDownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <figure className="avatar avatar-nav">
                  <img
                    src={user?.avatar ? user.avatar.url : defaultAvatar}
                    alt="User Avatar"
                    className="rounded-circle"
                  />
                </figure>
                <span>{user?.name}</span>
              </button>
              <div
                className="dropdown-menu w-100"
                aria-labelledby="dropDownMenuButton">
                {user?.role === "admin" && (
                  <Link className="dropdown-item" to="/admin/dashboard">
                    {" "}
                    Dashboard{" "}
                  </Link>
                )}

                <Link className="dropdown-item" to="/me/orders">
                  {" "}
                  Orders{" "}
                </Link>

                <Link className="dropdown-item" to="/me/profile">
                  {" "}
                  Profile{" "}
                </Link>

                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={handleLogout}>
                  {" "}
                  Logout{" "}
                </Link>
              </div>
            </div>
          ) : (
            !isLoading && (
              <Link to="/login" className="btn ms-4" id="login_btn">
                {" "}
                Login{" "}
              </Link>
            )
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
