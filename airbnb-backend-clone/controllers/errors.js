
// 404 page

exports.PageNotFound = (req, res, next) => {
  res.status(404).render("404Page",
    {
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    }
  );
}