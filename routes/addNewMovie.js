import express from "express";
import fs from "fs/promises";
import { join } from "path";
import multer from "multer";
import { validateInputs } from "./validatorFunctions/validators.js";
import db from "../db/movies.js";
import authorize from "../middleware/authorization.js";

const addMovieRouter = express.Router();

const uploadDir = join(process.cwd(), "/public/images");

const multerUpload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

// display the page with the form
addMovieRouter.get("/", authorize(["admin"]), (req, res) => {
  try {
    res.status(200).render("add_new_movie", { page: "add", message: "" });
  } catch (err) {
    res.status(500).render("error", { message: err });
  }
});

// add new movie
addMovieRouter.post(
  "/",
  authorize(["admin"]),
  multerUpload.single("cover_photo"),
  async (request, res) => {
    try {
      // get form inputs
      const movieTitle = request.body.title;
      const movieDescription = request.body.description;
      const movieGenre = request.body.genre;
      const movieYear = request.body.year;
      const movieCover = request.file;
      // validate
      const validationResult = validateInputs(
        movieTitle,
        movieDescription,
        movieGenre,
        movieYear,
        movieCover
      );
      // if they're valid
      if (validationResult.valid) {
        const movie = {
          title: movieTitle,
          description: movieDescription,
          genre: movieGenre,
          year: parseInt(movieYear, 10),
          coverPhoto: movieCover.filename,
          coverPhotoPath: movieCover.path,
        };
        console.log(movie.coverPhotoPath);
        console.log(movie.coverPhoto);
        // insert the movie in dataabase
        await db.insertMovie(movie);
        console.log(`New movie inserted: ${movie}`);
        // redirect to main page
        res.redirect("/");
      } else {
        // delete uploaded cover image if the other inputs were not valid
        if (movieCover) {
          fs.unlink(movieCover.path)
            .then(() => {
              console.log("Cover photo deleted");
            })
            .catch((error) => {
              console.log(`Error removing uploaded file: ${error}`);
            });
        }
        // display error message
        res
          .status(400)
          .render("add_new_movie", {
            page: "add",
            message: validationResult.message,
          });
      }
    } catch (err) {
      // delete uploaded cover image if there was a server error
      if (request.file) {
        fs.unlink(request.file.path)
          .then(() => {
            console.log("Cover photo deleted");
          })
          .catch((error) => {
            console.log(`Error removing uploaded file: ${error}`);
          });
      }
      console.log(`Error while adding new movie: ${err}`);
      // redirect to the error page and display error message
      res
        .status(500)
        .render("error", { message: `Error while adding new movie: ${err}` });
    }
  }
);

export default addMovieRouter;
