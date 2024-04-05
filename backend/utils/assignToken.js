// create token and save in the cookie
export default (user, statusCode, res) =>{

    // creating a JWT token 
    const token = user.getJWTToken();

    // prepare options for cookie 
    const options = {
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60* 60 * 1000),
        httpOnly : true
    };

    res.status(statusCode).cookie("token", token, options).json({
        user,
        token,
    })
}