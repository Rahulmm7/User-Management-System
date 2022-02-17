const User_service = require('../services/user_services');
const responseFile = require('../response');
const User = require('../model/user');
const client = require('../utils/redis');
const validation = require('../validation');

// create  a user

exports.create = async (req, res) => {
    try {
        const validateResult = await validation.signupSchema.validateAsync(req.body);
        const response = await User_service.user_create(validateResult, res);
        if (response) {
            responseFile.successResponse(res, response, 'Created a new user');
            return;
        }
    } catch (error) {
        if (error.isJoi === true) {
            return responseFile.errorResponse(res, error.details, 422);
        }
        console.log(error);
        return responseFile.errorResponse(res, 'Invalid credentials !', 400);
    }
};

// login page

exports.login = async (req, res) => {
    try {
        const validateResult = await validation.loginSchema.validateAsync(req.body);
        const response = await User_service.user_login(validateResult, res);
        if (response) {
            responseFile.successResponse(res, response);
            return;
        }
        console.log(' no response from function user_login ');
    } catch (error) {
        if (error.isJoi === true) {
            return responseFile.errorResponse(res, 'Invalid credentials !', 422);
        }
        console.log(error);
        return responseFile.errorResponse(res, 'Invalid username or password !', 401);
    }
};

// user email verify page
exports.user_emailVerify = async (req, res) => {
    const validateResult = await validation.emailVerifySchema.validateAsync(req.body);
    const { email, otp } = validateResult;
    try {
        client.get(email, async (err, data) => {
            if (err) {
                console.log('error', err);
            }

            if (data === otp) {
                User.updateOne({ email }, { isEmailVerified: true }, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        return responseFile.successResponse(res, ' ', 'email verified sucessfully');
                    }
                });
            } else {
                return responseFile.errorResponse(res, 'Invalid otp', 401);
            }
        });
    } catch (error) {
        if (error.isJoi === true) {
            return responseFile.errorResponse(res, error.details, 422);
        }
        return responseFile.errorResponse(res, 'server Error', 500);
    }
};

// user Phone number  verify page
exports.user_PhoneVerify = async (req, res) => {
    const validateResult = await validation.phoneVerifySchema.validateAsync(req.body);
    const { email, number, otp } = validateResult;

    try {
        client.get(number, async (err, data) => {
            if (err) {
                console.log('error', err);
                return responseFile.errorResponse(res, 'Invalid number', 401);
            }

            if (data === otp) {
                User.updateOne({ email }, { isPhoneVerified: true }, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        return responseFile.successResponse(res, '', 'Phone number  verified sucessfully');
                    }
                });
            } else {
                return responseFile.errorResponse(res, 'Invalid otp', 401);
            }
        });
    } catch (error) {
        if (error.isJoi === true) {
            return responseFile.errorResponse(res, error.details, 422);
        }
        return responseFile.errorResponse(res, 'server Error', 500);
    }
};

// forgot password page

exports.forgotPassword = async (req, res) => {
    try {
        const validateResult = await validation.forgetPasswordSchema.validateAsync(req.body);
        const response = await User_service.forget_password(validateResult, res);
        return;
    } catch (error) {
        if (error.isJoi === true) {
            return responseFile.errorResponse(res, error.details, 422);
        }
        console.log(error);
        return responseFile.errorResponse(res, 'Something went wrong', 400);
    }
};

// reset password

exports.resetPassword = async (req, res) => {
    try {
        const validateResult = await validation.resetPasswordSchema.validateAsync(req.body);
        const response = await User_service.reset_password(validateResult, res);
        if (response) {
            responseFile.successResponse(res, response, 'password changed');
            return;
        }
    } catch (error) {
        if (error.isJoi === true) {
            return responseFile.errorResponse(res, error.details, 422);
        }
        console.log(error);
        return responseFile.errorResponse(res, 'Invalid username ', 401);
    }
};
