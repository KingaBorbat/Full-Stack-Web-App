import express from "express";
import bcrypt from "bcrypt";
import db from "../db/movies.js";
import {
  validatePassword,
  validateUsername,
} from "./validatorFunctions/validateUserCredentials.js";

const signupRouter = express.Router();

// get registration page
signupRouter.get("/", (_, res) => {
  res.render("signup", { message: "" });
});

// registration
signupRouter.post(
  "/signup",
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      // get form inputs
      const username = req.body.new_user;
      const password = req.body.new_user_pass;
      const passwordAgain = req.body.new_user_pass_confirm;

      if (username && password && passwordAgain) {
        const user = await db.findUserByName(username);

        // if there's no other user with the username and the password is valid, insert user in the database
        // otherwise display error message
        if (!user) {
          if (!validateUsername(username)) {
            console.log("Signup: Username does not meet requirements!");
            res
              .status(400)
              .render("signup", {
                message: "Username does not meet requirements!",
              });
          }
          if (password === passwordAgain) {
            if (validatePassword(password)) {
              const hashedPasswd = await bcrypt.hash(password, 10);
              await db.insertUser({ username, password: hashedPasswd });
              console.log("Signed up successfully!");
              res.redirect("/authentication");
            } else {
              console.log("Signup: Password does not meet requirements!");
              res
                .status(400)
                .render("signup", {
                  message: "Password does not meet requirements!",
                });
            }
          } else {
            console.log("Signup: Passwords do not match!");
            res
              .status(400)
              .render("signup", { message: "Passwords do not match!" });
          }
        } else {
          console.log("Signup: Username is alreday taken!");
          res
            .status(400)
            .render("signup", {
              message: "Sorry, that username is alreday taken!",
            });
        }
      } else {
        console.log("Signup: Empty fields.");
        res
          .status(400)
          .render("signup", { message: "Please fill all the fields!" });
      }
    } catch (err) {
      res.status(500).render("error", { message: err });
    }
  }
);

export default signupRouter;
