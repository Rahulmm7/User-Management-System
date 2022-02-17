const admin_service = require('../services/admin_services');
const responseFile = require('../response');
const validation = require('../validation');

// admin login page

exports.adminLogin = async (req, res) => {
    try {
        const validateResult = await validation.loginSchema.validateAsync(req.body);
        const response = await admin_service.admin_login(validateResult, res);
        if (response) {
            responseFile.successResponse(res, response, 'token');
            return;
        }
        console.log(' no response from function user_login !!!');
    } catch (error) {
        if (error.isJoi === true) {
            return responseFile.errorResponse(res, error.details, 422);
        }
        return responseFile.errorResponse(res, error, 400);
    }
};

// admin page to view all users details page

exports.getUserData = async (req, res) => {
    try {
        const response = await admin_service.get_userData(req, res);
    } catch (error) {
        return responseFile.errorResponse(res, 'currently no data available !!!');
    }
};

// admin page to update user status

exports.updateUserStatus = async (req, res) => {
    try {
        const response = await admin_service.update_userStatus(req, res);
        if (response) {
            responseFile.successResponse(res, response, 'user status updated !!!');
            return;
        }

        return responseFile.errorResponse(res, 'Invalid email !!! ', 400);
    } catch (error) {
        console.log('error', error);
        return responseFile.errorResponse(res, 'Server eror !!! ', 500);
    }
};

// admin page to user hard delete

exports.userdelete = async (req, res) => {
    try {
        const response = await admin_service.user_delete(req, res);
        if (response) {
            responseFile.successResponse(res, response, 'user deleted permanently !!!');
        } else {
            responseFile.errorResponse(res, 'Something went wrong !!!');
        }
    } catch (error) {
        console.log('error', error);
        return responseFile.errorResponse(res, 'Server eror !!! ', 500);
    }
};

// admin page to user soft delete

exports.userSoftdelete = async (req, res) => {
    try {
        const response = await admin_service.user_softdelete(req, res);
        if (response) {
            responseFile.successResponse(res, response, 'user deleted  !!!');
        } else {
            responseFile.errorResponse(res, 'Something went wrong !!!');
        }
    } catch (error) {
        console.log('error', error);
        return responseFile.errorResponse(res, 'Server eror !!! ', 500);
    }
};
