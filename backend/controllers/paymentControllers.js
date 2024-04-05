import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Stripe from "stripe"
import Order from "../models/order.js"
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)


// console.log(process.env.STRIPE_SECRET_KEY)
//create strip chcekout session ==>  /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {

    const body = req.body;
    const shippingInfo = body?.shippingInfo;
    const line_items = body?.orderitems?.map((item) => {
        return {
            price_data : {
                currency : "inr",
                product_data :{
                    name : item?.name,
                    images : [item?.image],
                    metadata : {productid : item?.product},
                },
                unit_amount : Math.round(item?.price *100)
            },
            tax_rates : ["txr_1Ot5sgSBsiaztdG1hz8lOy6C"],
            quantity : item?.quantity,
        };
    });

    const shipping_rate = body.itemsPrice > 500 ? "shr_1Ot5j1SBsiaztdG1Wsi7XFvC" : "shr_1Ot5klSBsiaztdG10Pyaf6F8";

    const session = await stripe.checkout.sessions.create({
        payment_method_types : ["card"],
        success_url : `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
        cancel_url : `${process.env.FRONTEND_URL}`,
        customer_email : req?.user?.email,
        client_reference_id : req?.user?._id?.toString(),
        mode : "payment",
        metadata : {...shippingInfo, itemsPrice : body?.itemsPrice},
        shipping_options : [
            {
                shipping_rate,
            }
        ],
        line_items,
        billing_address_collection : "required",
    });

    res.status(200).json({
        url : session.url,
    })
});

const getOrderItems = async(line_Items) => {
    return new Promise((resolve, reject) => {
        let cartItems = [];

        line_Items?.data?.forEach(async (item) => {
            const product = await stripe.products.retrieve(item.price.product);

            const productId = product.metadata.productid;

            // console.log("items : : ", item),
            // console.log("Product :: ", product);

            cartItems.push({
                product : productId,
                name : product.name,
                price : item.price.unit_amount_decimal / 100,
                quantity : item.quantity,
                image : product?.images[0]
            })

            if(cartItems.length === line_Items?.data?.length){
                resolve(cartItems);
            }
        })
    })
}

// create new order after successfull payment =>  /api/v1/payment/webhook
export const stripeWebhook = catchAsyncErrors(async (req, res, next) => {
    try {
        const signature = req.headers["stripe-signature"];
        const event = stripe.webhooks.constructEvent(req.rawbody, signature, process.env.STRIPE_WEBOOK_SECRET);
        
        if(event.type === "checkout.session.completed"){
            var session = event.data.object;

            var line_Items = await stripe.checkout.sessions.listLineItems(session.id);            
        }

        const orderItems = await getOrderItems(line_Items);

        // console.log("order Items ::: ", order_items);

        const user = session.client_reference_id;
        const totalAmount = session.amount_total / 100;
        const taxAmount = session.total_details.amount_tax/100;
        const shippingAmount  = session.total_details.amount_shipping / 100;
        const itemsPrice = session.metadata.itemsPrice;

        const shippingInfo = {
            address : session.metadata.address,
            city : session.metadata.city,
            phoneNo : session.metadata.phoneNo,
            zipCode : session.metadata.zipCode,
            country : session.metadata.country,
        };

        const paymentInfo = {
            id : session.payment_intent,
            status : session.payment_status,
        }

        const orderData = {
            shippingInfo,
            orderItems,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            paymentInfo,
            paymentMethod : "Card",
            user,
        }

        await Order.create(orderData);

        return res.status(200).json({
           message : "Order Created Successfully"
        })

    } catch (error) {
        console.log("ERROR :: " , error);        
    }
})