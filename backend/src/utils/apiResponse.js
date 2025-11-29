function success(message, data = {}) {
  return {
    success: true,
    message,
    data,
  };
}

function error(message, status = 400) {
  return {
    success: false,
    status,
    message,
  };
}

module.exports = { success, error };
