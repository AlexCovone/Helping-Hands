module.exports = {
  getIndex: (req, res) => {
    try{
      res.render("index.ejs");
    } catch (err) {
      console.log(err)
      return res.render("404", { user: req.user })
    }
  },
};
