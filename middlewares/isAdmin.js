const isAdmin = (req, res, next) => {
  if (req.session.user.admin) {
    next();
    return;
  }

  res.redirect("/admin-settings");
};

module.exports = isAdmin;
