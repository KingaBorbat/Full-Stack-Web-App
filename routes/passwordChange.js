import express from "express";
import bcrypt from "bcrypt";
import db from "../db/movies.js";
import authorize from "../middleware/authorization.js";
import { validatePassword } from "./validatorFunctions/validateUserCredentials.js";

const passwdChangeRouter = express.Router();

// get page
passwdChangeRouter.get("/", authorize(), (req, res) => {
  try {
    res
      .status(200)
      .render("changePassword", { user: req.session.user, message: "" });
  } catch (err) {
    res.status(500).render("error", { message: err });
  }
});

// change password
passwdChangeRouter.post(
  "/changePwd",
  express.urlencoded({ extended: true }),
  authorize(),
  async (req, res) => {
    try {
      const { password, newPassword, passwordConfirm } = req.body;
      const username = req.session.user;
      const user = await db.findUserByName(username);
      if (!user) {
        console.log("Password change: User not found!");
        res.status(404).render("error", { message: "User not found" });
      } else if (!password || !newPassword || !passwordConfirm) {
        console.log("Password change: Empty fields.");
        res
          .status(400)
          .render("changePassword", {
            message: "Please fill out all the fields",
          });
      } else {
        // check if password is correct
        const isEqual = await bcrypt.compare(password, user.password);

        if (isEqual) {
          if (newPassword === passwordConfirm) {
            // change the password if the new one is valid
            if (validatePassword(newPassword)) {
              const newHashedPasswd = await bcrypt.hash(newPassword, 10);
              await db.changeUserPasswd(user.ID, newHashedPasswd);
              console.log("Password successfully changed!");
              res.redirect("/authentication");
              // otherwise redirect to the page with error message
            } else {
              console.log(
                "Password change: Password does not meet requirements!"
              );
              res
                .status(400)
                .render("changePassword", {
                  message: "Password does not meet requirements.",
                });
            }
          } else {
            console.log("Password change: Passwords do not match!");
            res
              .status(400)
              .render("changePassword", { message: "Passwords do not match!" });
          }
        } else {
          console.log("Password change: Wrong password!");
          res
            .status(400)
            .render("changePassword", { message: "Wrong password!" });
        }
      }
    } catch (err) {
      console.log(`Error while changing password: ${err}`);
      res.status(500).render("error", { message: err });
    }
  }
);

export default passwdChangeRouter;
