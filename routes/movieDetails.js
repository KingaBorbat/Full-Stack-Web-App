import express from "express";
import multer from "multer";
import db from "../db/movies.js";
import authorize from "../middleware/authorization.js";
import { validateReviewInputs } from "./validatorFunctions/validators.js";

const upload = multer();
const movieDetailsRouter = express.Router();

//returns a list of objects containing the username, score, and feedback
async function createDisplayedReviews(reviews) {
  const displayedReviews = [];
  const promises = [];
  for (let i = 0; i < reviews.length; i++) {
    promises.push(db.findUserByID(reviews[i].userID));
  }

  const results = await Promise.all(promises);
  for (let i = 0; i < reviews.length; i++) {
    const user = results[i];
    displayedReviews.push({
      ID: reviews[i].ID,
      user: user.username,
      points: reviews[i].points,
      review: reviews[i].review,
    });
  }
  return displayedReviews;
}

// get the page of a movie
movieDetailsRouter.get("/:id", async (req, res) => {
  try {
    // get the movie and the related reviews
    const movie = await db.findMovieByID(req.params.id);
    console.log(`Found movie with the ID: ${req.params.id}.`);
    const reviews = await db.findMovieReviews(req.params.id);
    console.log(`Found movie reviews with the ID: ${req.params.id}.`);
    const displayedReviews = await createDisplayedReviews(reviews);
    if (req.session.user) {
      res.locals.user = { username: req.session.user, role: req.session.role };
    }
    // render page
    res
      .status(200)
      .render("movie_details", {
        page: "details",
        movie,
        reviews: displayedReviews,
        message: "",
      });
  } catch (err) {
    console.log(`Error on the details page: ${err}`);
    res.status(500).render("error", `Error: ${err}`);
  }
});

// posting review for movie
movieDetailsRouter.post(
  "/:id/review",
  authorize(),
  upload.none(),
  async (req, res) => {
    console.log(req.body);
    try {
      // get id and form inputs
      const movieID = req.params.id;
      const { points, review } = req.body;
      const username = req.session.user;
      // validate review inputs
      const validationResult = validateReviewInputs(points, review);
      // if they're valid
      if (validationResult.valid) {
        // get the ID of the user
        const user = await db.findUserByName(username);

        // insert review in database
        await db.insertReview({
          movieID,
          userID: user.ID,
          points: parseInt(points, 10),
          description: review,
        });
        console.log("Review inserted successfully!");

        const movie = await db.findMovieByID(req.params.id);
        const reviews = await db.findMovieReviews(req.params.id);
        const displayedReviews = await createDisplayedReviews(reviews);
        // redirect to the page with an acceptance message
        console.log(displayedReviews);
        res.status(200).render("movie_details", {
          page: "details",
          movie,
          reviews: displayedReviews,
          message: "Review posted successfully!",
        });
      } else {
        // if the inputs were not valid
        const movie = await db.findMovieByID(req.params.id);
        const reviews = await db.findMovieReviews(req.params.id);
        const displayedReviews = await createDisplayedReviews(reviews);

        console.log(`Invalid input: ${validationResult.message}`);

        // redirect to the page with an error message
        res.status(400).render("movie_details", {
          page: "details",
          movie,
          reviews: displayedReviews,
          message: `Invalid input: ${validationResult.message}`,
        });
      }
    } catch (err) {
      console.log(`Error while posting review: ${err}`);
      res.status(500).render("error", { message: err });
    }
  }
);

export default movieDetailsRouter;
