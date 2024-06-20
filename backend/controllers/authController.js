import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import assignToken from "../utils/assignToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"
import { deleteFile, uploadFile } from "../utils/cloudinary.js";

// Register User ==> /api/v1/resister
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("Email Already Exist! Please SignIn.", 401));
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  // const token = user.getJWTToken();
  // assignToken(user, 201, res);
  
  return res.status(200).json({
    message: "Register Successfully",
  });
});

// login User ==> /api/v1/login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordCompare = await user.comparePassword(password);
  if (!isPasswordCompare) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const token = user.getJWTToken();

  assignToken(user, 200, res);
});

// logout user ==> /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  return res.status(200).json({
    message: "Logged Out",
  });
});

// upload user avatar ==> /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {

  const avatarResopnse = await uploadFile(req.body.avatar, "Dogsi/avatars");

  // Remove previous avatar of that user
  if(req?.user?.avatar?.url){
    await deleteFile(req?.user?.avatar?.public_id);
  } 
  
  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar : avatarResopnse,
  });

  return res.status(200).json({
    user,
  });
});



// Forgot Password ==> /api/v1/login
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 404));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User Not Found in the database", 401));
  }

  // get resetPassword Token from Model Method getRestPasswordToken();
  const resetToken = user.getResetPasswordToken();

  // console.log(typeof(resetToken));

  await user.save();

  // prepare rest URL
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
        email: user.email,
        subject: "Dogsi Password Recovery",
        message,
    });
    res.status(200).json({
     message : "Recovery Email Send Successfully"
    });
  } 
  catch (error) {
    user.resetPasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler("Sending Failed Due to Internal Server Error. Try Again!!", 500));
  }
});


// Rest Password ==> /api/vi/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) =>{
  //hash the URL Token 
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  // now search the user 
  const user = await User.findOne({
    resetPasswordToken,
    resetpasswordExpire : {$gt : Date.now()}, 
  })
  if(!user){
    return next(new ErrorHandler("Password reset token is Invalid or has been expired"), 400);
  };

  // check both password are same or not 
  if(req.body.password != req.body.confirmPassword){
    return next(new ErrorHandler("Passwords does not Match"), 400);
  };
  // set the passwod 
  user.password = req.body.password;

  // set the token to undefined 
  user.resetPasswordToken = undefined;
  user.resetpasswordExpire = undefined;
  await user.save();

  // assignToken(user, 200, res);
  res.status(200).json({
    message : "Reset Successfully"
  })

})

// get Current user profile ==> /api/v1/me
export const getUseProfile = catchAsyncErrors(async (req, res, next) =>{
  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    message : "user Profile",
    user,
  })
})

//update/ change password 
export const updatePassword = catchAsyncErrors(async (req, res, next) =>{
  const user = await User.findById(req?.user?._id).select("+password");
  if(!user){
    return next(new ErrorHandler("Password is requried", 400))
  }
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched){
    return next(new ErrorHandler("Old password is Incorrect", 400))
  };

  user.password = req.body.password;
  await user.save();
  
  res.status(200).json({
    message : "Password Updated Successfully",
    success: true,
  })
})

// update user profile 
export const updateUserProfile = catchAsyncErrors(async (req, res, next) =>{
  
  const newUserData = {
    name : req.body.name,
    email: req.body.email
  }
  
  // const email = req.body.email
  // const existingUseremail  = await User.findOne({email});
  // if(existingUseremail){
  //   return next(new ErrorHandler("Email Already Exist with another account.", 400));
  // }

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {new : true});

  res.status(200).json({
    message :"Profile Update Successfully",
    user,
  })
})

// get all user -- ADMIN ==> /api/v1/admin/users
export const allUsers = catchAsyncErrors(async(req, res, next) =>{
  const users = await User.find();
  if(!users){
    return next(new ErrorHandler("No users in the database", 400))
  }

  res.status(200).json({
    message:"All users",
    users,
  })
})

// get userDetails -- ADMIN ==> /api/v1/admin/users
export const getUserDetails = catchAsyncErrors(async(req, res, next) =>{
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User Not found with id: ${req.params.id} `, 404))
  }
  res.status(200).json({
    message:"User Found",
    user,
  })
})


//to be commited 
// update user details == ADMIN ==> /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) =>{
  
  const userNewData = {
    name : req.body.name,
    email : req.body.email,
    role : req.body.role,
  }
  const user = await User.findByIdAndUpdate(req.params.id, userNewData, {new : true});

  if(!user){
    return next(new ErrorHandler(`User Not found with id: ${req.params.id} `, 404))
  }

  res.status(200).json({
    message :"Update successfully",
    user,
  })
})

// delete user details == ADMIN ==> /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) =>{
  
  const user = await User.findByIdAndDelete(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User Not found with id: ${req.params.id} `, 404))
  }

  // TODO : Remove user avatar from cloudinary
  await user.deleteOne();

  res.status(200).json({
    message :"Delete successfully",
    success: true,
  })
})

