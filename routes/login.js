import express from "express";
import bcrypt from "bcrypt";
import db from "../db/movies.js";

const loginRouter = express.Router();

// get the page
loginRouter.get("/", (_, res) => {
  let message;
  res.render("login", { message });
});

// log in
loginRouter.post(
  "/login",
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      // get form inputs
      const { username, password } = req.body;
      // get user information by username
      const user = await db.findUserByName(username);
      // redirect to the login page if the user doesn't exist
      if (!user) {
        res.render("login", { message: "Wrong username or password!" });
      } else {
        // compare the password with the password stored in database
        const isEqual = await bcrypt.compare(password, user.password);
        // if the passwords match, we set the session.user and session.role variables
        if (isEqual) {
          console.log("Logged in successfully!");
          req.session.user = username;
          req.session.role = user.role;
          res.redirect("/");
          // otherwise redirect to the page with a message
        } else {
          console.log("Wrong username or password!");
          res
            .status(400)
            .render("login", { message: "Wrong username or password!" });
        }
      }
    } catch (err) {
      console.log(`Error while logging in: ${err}`);
      res.status(500).render("error", { message: err });
    }
  }
);

export default loginRouter;
