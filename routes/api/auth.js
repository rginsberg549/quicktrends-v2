// Requiring our models and passport as we've configured it
const db = require("../../models");
const passport = require("../../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.redirect("/dashboard");
  });

  app.post("/api/signup", (req, res) => {
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
  });
};
