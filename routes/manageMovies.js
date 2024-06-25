import express from "express";
import db from "../db/movies.js";
import authorize from "../middleware/authorization.js";

const moviesManageRouter = express.Router();

// get the movie management page
moviesManageRouter.get("/", authorize(["admin"]), async (req, res) => {
  try {
    const movies = await db.findAllMovies();
    console.log("Found all movies for admin!");
    res.status(200).render("manageMovies", { page: "manageMovies", movies });
  } catch (err) {
    console.log(`Error while finding movies for admin: ${err}`);
    res.status(500).render("error", { message: err });
  }
});

export default moviesManageRouter;
