module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/feed");
    }
  },
  authRole: function (role){
    return (req, res, next) => {
      if(req.user.role !== role){
        res.status(401)
        return res.send('Not Allowed')
      }

      next()
    }
  }
};
