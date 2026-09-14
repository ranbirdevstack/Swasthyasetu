// utils/response.js
const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
  const responseObj = {
    success: true,
    message,
  };

  if (data !== null) {
    responseObj.data = data;
  }

  return res.status(statusCode).json(responseObj);
};

const sendError = (res, statusCode = 500, message = "Server Error", errors = null) => {
  const responseObj = {
    success: false,
    message,
  };

  if (errors !== null) {
    responseObj.errors = errors;
  }

  return res.status(statusCode).json(responseObj);
};

module.exports = { sendSuccess, sendError };