function errorHandler(res, err) {
  console.error("[ERROR]", err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  return res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
