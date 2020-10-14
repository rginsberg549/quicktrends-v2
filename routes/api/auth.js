// Requiring our models and passport as we've configured it
const db = require("../../models");
const passport = require("../../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post(
    "/api/login",
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.post("/api/signup", (req, res) => {
    const errMessage =
      "Please make sure all of the fields are filled in before signing up.";
    if (req.body.first_name == "") {
      res.render("signup", { message: errMessage });
    } else if (req.body.last_name == "") {
      res.render("signup", { message: errMessage });
    } else if (req.body.email == "") {
      res.render("signup", { message: errMessage });
    } else if (req.body.password == "") {
      res.render("signup", { message: errMessage });
    } else {
      db.User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
      })
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          res.status(401).json(err);
        });
    }
  });
};
