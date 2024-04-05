// creating errorHandler child class that extends default Error class
class ErrorHandler extends Error{
    constructor(message, statusCode){

        // super is the cunstructor of defalut Error class 
        super(message)
        this.statusCode = statusCode;

        // creating stack property 
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ErrorHandler;