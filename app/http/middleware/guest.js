function guest(req, res, next) {
  if (!req.Authenticated) {
    return next();
  }
  return res.redirect("/");
}

module.exports = guest;
