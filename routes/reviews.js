import express from "express";
import db from "../db/movies.js";
import authorize from "../middleware/authorization.js";

const reviewRouter = express.Router();

// get review management page
reviewRouter.get("/", authorize(["admin"]), async (req, res) => {
  try {
    const reviews = await db.findAllReviews();
    console.log("Found all reviews for amdin!");
    const user = { username: req.session.user, role: req.session.role };
    res.status(200).render("reviews", { user, page: "reviews", reviews });
  } catch (err) {
    console.log(`Error while finding all reviews for admin: ${err}`);
    res.status(500).render("error", { message: err });
  }
});

export default reviewRouter;
