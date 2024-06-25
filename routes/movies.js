import express from "express";
import multer from "multer";
import db from "../db/movies.js";
import { validateFilters } from "./validatorFunctions/validators.js";

const upload = multer();
const router = express.Router();

// structure of objects displayed on the homepage for movies, including the number of feedbacks and average rating
async function getReviewsAndPoints(movies) {
  const moviesWithReviewInfo = [];
  const promises = [];

  for (let i = 0; i < movies.length; i++) {
    promises.push(db.getReviewNumberAndAverage(movies[i].ID));
  }

  const results = await Promise.all(promises);
  for (let i = 0; i < movies.length; i++) {
    const [{ numOfReviews, avgPoints }] = results[i];
    moviesWithReviewInfo.push({
      ID: movies[i].ID,
      title: movies[i].title,
      genre: movies[i].genre,
      year: movies[i].year,
      description: movies[i].description,
      coverImg: movies[i].coverImg,
      numOfReviews,
      avgPoints,
    });
  }
  return moviesWithReviewInfo;
}

// get main page
router.get("/", async (req, res) => {
  try {
    // get all movies
    const movies = await db.findAllMovies();
    const moviesWithReviewInfo = await getReviewsAndPoints(movies);
    if (req.session.user) {
      res.locals.user = { username: req.session.user, role: req.session.role };
    }
    res
      .status(200)
      .render("mainPage", {
        page: "homepage",
        movies: moviesWithReviewInfo,
        message: "",
      });
  } catch (err) {
    console.log(`Error on home page: ${err}`);
    res.status(500).render("error", { message: err });
  }
});

// searching
router.get("/search", upload.none(), async (req, res) => {
  try {
    if (req.session.user) {
      res.locals.user = { username: req.session.user, role: req.session.role };
    }
    // get form inputs
    const movieTitle = req.query.title;
    const movieGenre = req.query.genre;
    const movieMinYear = req.query.minyear;
    const movieMaxYear = req.query.maxyear;

    // validate data
    const validationResult = validateFilters(
      movieTitle,
      movieGenre,
      movieMinYear,
      movieMaxYear
    );
    if (validationResult.valid) {
      // get movies that meet the filter conditions
      console.log("Finding movies by filters");
      const movies = await db.findByFilters({
        title: movieTitle.toLowerCase(),
        genre: movieGenre,
        minyear: movieMinYear,
        maxyear: movieMaxYear,
      });
      const moviesWithReviewInfo = await getReviewsAndPoints(movies);

      // render home page with the corresponding movies
      res
        .status(200)
        .render("mainpage", {
          page: "homepage",
          movies: moviesWithReviewInfo,
          message: "",
        });
    } else {
      // if form inputs are not valid, redirect to home page with all the movies and an error message
      const movies = await db.findAllMovies();
      const moviesWithReviewInfo = await getReviewsAndPoints(movies);
      console.log("Found all movies!");
      res.status(400).render("mainpage", {
        page: "homepage",
        movies: moviesWithReviewInfo,
        message: `Invalid input: ${validationResult.message}`,
      });
    }
  } catch (err) {
    console.log(`Error while searching: ${err}`);
    res.status(500).render("error", { message: `${err}` });
  }
});

export default router;
