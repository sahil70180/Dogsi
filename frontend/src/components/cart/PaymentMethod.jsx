import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../helpers/helper";
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
    const [method, setMethod] = useState("");
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const {cartItems, shippingInfo}  = useSelector((state) => state.cart)
    
    const {itemPrice, shippingPrice, taxPrice, totalPrice} = calculateOrderCost(cartItems);

    const [createNewOrder, {error, isSuccess }]= useCreateNewOrderMutation();
    const [stripeCheckoutSession, {data : checkoutData, error : checkoutError, isLoading}] = useStripeCheckoutSessionMutation();

    // for Card
    useEffect(() => {
        if(checkoutData){
            window.location.href = checkoutData?.url
        }
        if(checkoutError){
            toast.error(checkoutError?.data?.message)
        }
    },[checkoutData, checkoutError]);

    // for order COD 
    useEffect(() => {
        if(error){
            toast.error(error?.data?.message)
        }
        if(isSuccess){
            navigate("/me/orders?order_success=true");
        }
    }, [error, isSuccess, navigate])

    const paymenthandler = async (e) => {
        e.preventDefault();

        if(method === "COD"){
            // create order for COD 
            const orderData = {
                shippingInfo,
                orderItems : cartItems,
                itemsPrice : itemPrice,
                shippingAmount : shippingPrice,
                taxAmount :taxPrice,
                totalAmount : totalPrice,
                paymentInfo : {
                    status : "Not Paid",
                },
                paymentMethod : "COD",                
            };
            await createNewOrder(orderData); 
            toast.success("Order Created")          
        }
        if(method === "Card"){
            // create order using Strip 
            const orderData = {
                shippingInfo,
                orderitems : cartItems,
                itemsPrice : itemPrice,
                shippingAmount : shippingPrice,
                taxAmount :taxPrice,
                totalAmount : totalPrice,                
            };
            // console.log(orderData);
            stripeCheckoutSession(orderData);
        }
    }
  return (
    <>
      <MetaData title={"Payment Method"} />
      <CheckoutSteps shipping confirmOrder payment/>
      <div className="container">

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body"
            onSubmit={paymenthandler}
            >
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod("COD")}
                />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                onChange={(e) => setMethod("Card")}
                />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>

            <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
              {isLoading ? "Connecting...": "Continue"}
            </button>
          </form>
        </div>
      </div>
                </div>
    </>
  );
};

export default PaymentMethod;
