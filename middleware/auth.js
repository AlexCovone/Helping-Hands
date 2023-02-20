module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  authRole: function (role){
    return (req, res, next) => {
      if(req.user.role !== role){
        res.status(403)
        return res.send('Not Allowed')
      }

      next()
    }
  }
};
