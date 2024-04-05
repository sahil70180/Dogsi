import Order from "../models/order.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/errorHandler.js"
import Product from "../models/product.js"

//create new order ==> /api/v/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;
  // console.log("here");

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user : req.user._id,
  })
  // console.log(order);

  res.status(200).json({
    message :"create Successfully",
    order,
  })
});

// get order details ==> /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) =>{
  const order = await Order.findById(req.params.id).populate("user","name email");
  if(!order){
    return next(new Errorhandler(`No Order Found with this id : ${req.params.id}`, 404))
  }

  res.status(200).json({
    message :"Order Details Found",
    order,
  })
})

//get all orders of current/loggedIN user ==> /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) =>{
  const order = await Order.find({ user : req.user._id}).populate("user", "name email");
  if(!order){
    return next(new Errorhandler("No Orders Found", 404));
  }
  res.status(200).json({
    message : "Your Order Details Fetched Successfully",
    order,
  })
})

// get all order ADMIN  ==> /api/v1/orders
export const allOrders = catchAsyncErrors(async (req, res, next) =>{
  const orders = await Order.find();
  if(!orders){
    return next(new Errorhandler("No Orders found in the database", 404));
  }

  res.status(200).json({
    message :"ALl orders",
    orders,
  })
})

// update order - ADMIN ==> /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) =>{
  const order = await Order.findById(req.params.id);
  if(!order){
    return next(new Errorhandler("No Order found with this id", 404));
  }

  if(order?.orderStatus == "Delivered"){
    return next(new Errorhandler("You have already Recieved this order", 400));
  }
  if(order?.orderStatus == "Shipped"){
    return next(new Errorhandler("Order Already Shipped.",400 ));
  }

  // updating product stock for each orderitem and save the product again
  order?.orderItems?.forEach(async (item)  =>{
    const product = await Product.findById(item?.product?.toString());
    product.stock = product.stock - item.quantity;
    await product.save({validateBeforeSave : false });
  })

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();
  
  await order.save();


  res.status(200).json({
    message : "orderStatus and Stock update successfully",
    success : true,
  })
})

// delete order  ==> /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) =>{
  const order = await Order.findById(req.params.id);
  if(!order){
    return next(new Errorhandler("No Order found with this id" , 404));
  }
  await order.deleteOne();

  res.status(200).json({
    message :"Deleted Succesfully",
    success : true,
  })

})

// funtion that helps to get sales data 
async function getSalesData(startDate, endDate) {
  // aggregate data 
  const salesData = await Order.aggregate([
    {
      // stage 1 : filter the result 
      $match : {
        createdAt : {
          $gte : new Date (startDate),
          $lte : new Date(endDate),
        }
      }
    },
    {
      // stage 2 : Now Grouped the filtered data 
      $group : {
        _id : {
          // group according to the date 
          date : { $dateToString : {format : "%Y-%m-%d", date : "$createdAt"} }
        },
        totalSales : {$sum : "$totalAmount"}, // sum the total amount on that day
        numOrders : {$sum : 1}  // count the number of orders of that date
      }
    }
  ])
  // console.log(salesData);

  // now create a map to store total sales
  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;

  // // loop through all the sales data and extract date, sales, numOforders and set into map for grouping using key value pair

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrders;

    salesMap.set(date, {sales, numOrders});
    totalSales += sales;
    totalNumOrders +=numOrders;
  })
  // // generate array of dates between start and end date
  const dateBetween = getDateBetween(startDate, endDate);

  // create a final sales data array between start and end date 
  const finalSalesData = dateBetween.map((date) => ({
    date,
    sales : (salesMap.get(date) || {sales : 0}).sales,
    numOrders : (salesMap.get(date) || {numOrders : 0}).numOrders,

  }))
  // console.log(finalSalesData)
  return { salesData : finalSalesData, totalSales, totalNumOrders}
}

function getDateBetween(startDate, endDate){
  const dates = [];
  let currentDate = new Date(startDate);

  while(currentDate <= new Date(endDate)){
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate)
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

//get sales data ==> /api/v1/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);


  // setting up Hours should be between 12 am to 12
  startDate.setUTCHours(0 , 0 , 0, 0);
  endDate.setUTCHours(23,59,59,999) // 23 hours, 59 minutes, 59 seconds, 999 miliseconds

  const {salesData, totalSales , totalNumOrders} = await getSalesData(startDate, endDate);

  res.status(200).json({
    totalSales,
    totalNumOrders,
    sales : salesData
  })
})