import React, { useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";

const Orderdetails = () => {
  const params = useParams();
  const { data, error, isSuccess, isLoading } = useOrderDetailsQuery(
    params?.id
  );

  const order = data?.order;

  const ispaid = order?.paymentInfo?.status === "paid" ? true : false;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    
  }, [error]);

  if (isSuccess) {
    toast.success("Order Details");
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <MetaData title={"Order Details"} />
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-lg-9 mt-5 order-details">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mt-5 mb-4">Your Order Details</h3>
            <Link className="btn btn-success" to={`/invoice/orders/${order?._id}`}>
              <i className="fa fa-print"></i> Invoice
            </Link>
          </div>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td>{order?._id}</td>
              </tr>
              <tr>
                <th scope="row">Status</th>
                <td className={String(order?.orderStatus).includes("Delivered") ? "greenColor" : "redColor"}>
                  <b>{order?.orderStatus}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Date</th>
                <td>{new Date(order?.createdAt).toLocaleString("en-US")}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Shipping Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{order?.user.name}</td>
              </tr>
              <tr>
                <th scope="row">Phone No</th>
                <td>{order?.shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>
                  {order?.shippingInfo?.address}, {order?.shippingInfo?.country}
                  , {order?.shippingInfo?.zipCode}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Payment Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Status</th>
                <td className={ispaid ? "greenColor" : "redColor"}>
                  <b>{order?.paymentInfo?.status.toUpperCase()}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Method</th>
                <td>{order?.paymentMethod}</td>
              </tr>
              <tr>
                <th scope="row">Stripe ID</th>
                <td>{order?.paymentInfo?.id || "N/A-"}</td>
              </tr>
              <tr>
                <th scope="row">Total Amount</th>
                <td>{`RS ${order?.totalAmount}`}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 my-4">Order Items:</h3>

          <hr />
          <div className="cart-item my-1">
            {order?.orderItems.map((item) => (
              <div className="row my-5">
                <div className="col-4 col-lg-2">
                  <img
                    src={item?.image}
                    alt={item?.name}
                    height="45"
                    width="65"
                  />
                </div>

                <div className="col-5 col-lg-5">
                  <Link to={`/product/${item?.product}`}>{item?.name}</Link>
                </div>

                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                  <p>{`Rs ${item?.price}`}</p>
                </div>

                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                  <p>{item?.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};

export default Orderdetails;
