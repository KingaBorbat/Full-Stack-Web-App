import express from "express";
import authorize from "../middleware/authorization.js";

const logoutRouter = express.Router();

// log out
logoutRouter.get("/", authorize(), (req, res) => {
  // delete session
  req.session.destroy((err) => {
    if (err) {
      console.log(`Error while logging out: ${err}`);
      res.status(500).render("error", { message: err });
    } else {
      console.log("Successfully logged out.");
      res.redirect("/");
    }
  });
});

export default logoutRouter;
