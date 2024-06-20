import React from "react";
import { Route } from "react-router-dom";
import Home from "../Home";
import ProductDetails from "../product/ProductDetails";
import LogIn from "../auth/LogIn";
import Register from "../auth/Register";
import ProtectedRoute from "../auth/ProtectedRoute";
import Profile from "../user/Profile";
import UpdateUserProfile from "../user/UpdateUserProfile";
import UploadAvatar from "../user/UploadAvatar";
import UpdatePassword from "../user/UpdatePassword";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import Cart from "../cart/Cart";
import Shipping from "../cart/Shipping";
import ConfirmOrder from "../cart/ConfirmOrder";
import PaymentMethod from "../cart/PaymentMethod";
import MyOrder from "../order/MyOrder";
import Orderdetails from "../order/Orderdetails";
import Invoice from "../invoice/Invoice";
import NotFound from "../layout/NotFound";

const UserRoutes = () => {
  return (
    <>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/product/:id" element={<ProductDetails />} />
      <Route exact path="/login" element={<LogIn />} />
      <Route exact path="/register" element={<Register />} />
      <Route
        exact
        path="/me/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/me/update_profile"
        element={
          <ProtectedRoute>
            <UpdateUserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        exact
        path="/me/upload_avatar"
        element={
          <ProtectedRoute>
            <UploadAvatar />
          </ProtectedRoute>
        }
      />

      <Route
        exact
        path="/me/update_password"
        element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        }
      />
      <Route exact path="/password/forgot" element={<ForgotPassword />} />
      <Route exact path="/password/reset/:token" element={<ResetPassword />} />
      <Route
        exact
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/shipping"
        element={
          <ProtectedRoute>
            <Shipping />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/confirm_order"
        element={
          <ProtectedRoute>
            <ConfirmOrder />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/payment_method"
        element={
          <ProtectedRoute>
            <PaymentMethod />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/me/orders"
        element={
          <ProtectedRoute>
            <MyOrder />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <Orderdetails />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/invoice/orders/:id"
        element={
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound/>}/>
    </>
  );
};

export default UserRoutes;
