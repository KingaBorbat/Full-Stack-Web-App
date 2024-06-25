// authorization
function authorize(roles = ["user", "admin"]) {
  return (req, res, next) => {
    // if the user isn't logged in, we redirect them to the Log In page
    if (!req.session.role) {
      res.redirect("/authentication");
    }
    // if the user doesn't have the permissions to access the endpoint
    else if (!roles.includes(req.session.role)) {
      res.locals.user = { username: req.session.user, role: req.session.role };
      res
        .status(403)
        .render("error", {
          message: "You do not have permission to access this endpoint",
        });
      // otherwise
    } else {
      res.locals.user = { username: req.session.user, role: req.session.role };
      console.log("Logged in");
      next();
    }
  };
}

export default authorize;
