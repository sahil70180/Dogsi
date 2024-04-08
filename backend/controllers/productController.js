import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";

// Getting all Product ==> /api/v1/products
export const getProdcuts = catchAsyncErrors(async (req, res, next) => {
  const responsePerPage = 8; // declare total products in one page.(for pagination)
  const apiFilters = new APIFilters(Product, req.query).search().filters();

  let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  // apply pagination
  apiFilters.pagination(responsePerPage);
  products = await apiFilters.query.clone();

  res.status(200).json({
    responsePerPage,
    filteredProductsCount,
    products,
  });
});

// create new Product (ADMIN ROUTE) ==> /api/v1/admin/product/new
export const newProduct = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);

  res.status(200).json({
    message: "Prodcut Created Succesfully",
    product,
  });
});

// get single product details ==> /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id).populate(
    "reviews.user"
  );
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    message: "Prodcut Fetched with ID Successfully",
    product,
  });
});

// get all products for admin ==> /api/v1/admin/products
export const getAdminProducts = catchAsyncErrors(async (req, res, next) =>{

  const products = await Product.find();
  if(!products){
      return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
      products,
  });
});

// update product details ==> api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  res.status(200).json({
    message: "Product Updated Successfully",
    product,
  });
});

// delete product using id ==> api.v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product Deleted Successfully",
  });
});

// create/update product review  ==> /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  // prepare review object
  const review = {
    user: req.user?._id,
    rating: Number(rating),
    comment,
  };
  if (!rating || !comment || !productId) {
    return next(
      new ErrorHandler(
        "Rating, comment and Product Id is required to post a review",
        401
      )
    );
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found with this id", 404));
  }

  // check whether old review is present or not
  const isReviewed = product?.reviews.find(
    (review) => review.user.toString() == req?.user?._id.toString()
  );

  if (isReviewed) {
    // update the review
    product.reviews.forEach((review) => {
      if (review?.user?.toString() == req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    // create new Review == push the review into the review array prsent in the product model
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // now calculate the ratings == average of all the rating
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get product reviews  == /api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    message: "Product Reviews",
    reviews: product.reviews,
  });
});

// delete a product review  == /api/v1/admin/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found with this id", 404));
  }

  const reviews = product?.reviews.filter(
    (review) => review._id.toString() != req?.query?.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews == 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        numOfReviews;

  product = await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    { new: true }
  );

  res.status(200).json({
    success: true,
    product,
  });
});

// can user review ==> /api/v1/can_review
export const canUserReview = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user?._id,
    "orderItems.product": req.query.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({
      canUserReview: false,
    });
  }

  res.status(200).json({
    canUserReview: true,
  });
});
