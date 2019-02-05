
//  Async error handler. Wrap async routes in this to catch errors
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
