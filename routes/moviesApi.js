import express from "express";
import multer from "multer";
import fs from "fs/promises";
import { join } from "path";
import db from "../db/movies.js";
import authorize from "../middleware/authorization.js";

import {
  validateCoverPhoto,
  validateEditInputs,
} from "./validatorFunctions/validators.js";

const moviesApiRouter = express.Router();

// for image upload
const uploadDir = join(process.cwd(), "/public/images");

const multerUpload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

// asynchronous call to display movie details
moviesApiRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  // get genre and description from database
  db.findDetailsByMovieID(id)
    .then((result) => {
      const { genre, description } = result;

      // if the retrieval is successful, we send back the response
      if (genre && description) {
        res.json({ genre, description });
        // otherwise we send an error message
      } else {
        res.status(404).json("Details not found!");
      }
    })
    .catch((err) =>
      res.status(500).json({ message: `Error while getting details: ${err}` })
    );
});

// asynchronous call to delete  movie
moviesApiRouter.delete("/:id", authorize(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    // get the movie information from database
    const movie = await db.findMovieByID(id);
    // delete the cover image
    fs.unlink(movie.coverImgPath)
      .then(() => {
        console.log("Cover photo deleted");
      })
      .catch((err) => {
        console.log(`Error removing cover image: ${err}`);
        res
          .status(500)
          .json({ message: `Error while deleting cover image: ${err}` });
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error while deleting cover image: ${err}` });
  }
  db.deleteMovieById(id)
    .then((row) =>
      row
        ? res.sendStatus(204)
        : res.status(404).json({ message: `Movie with the ${id} not found` })
    )
    .catch((err) =>
      res.status(500).json({ message: `Error while deleting movie: ${err}` })
    );
});

// asynchronous call to edit movie
moviesApiRouter.put(
  "/:id",
  multerUpload.none(),
  authorize(["admin"]),
  (req, res) => {
    const { id } = req.params;
    const { title, year, genre, description } = req.body;

    const validationResult = validateEditInputs(
      title,
      description,
      genre,
      year
    );

    if (validationResult.valid) {
      const newMovie = { title, year: parseInt(year, 10), genre, description };

      db.editMovie(id, newMovie)
        .then((row) =>
          row
            ? res.sendStatus(204)
            : res
                .status(404)
                .json({ message: `Movie with the ${id} not found` })
        )
        .catch((err) =>
          res.status(500).json({ message: `Error while editing movie: ${err}` })
        );
    } else {
      res
        .status(400)
        .json({ message: `Invalid input: ${validationResult.message}` });
    }
  }
);

// asynchronous call to upload new cover image
moviesApiRouter.put(
  "/:id/covers",
  multerUpload.single("cover_photo"),
  authorize(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    const photo = req.file;

    // validate image
    const validationResult = validateCoverPhoto(photo);

    if (validationResult.valid) {
      try {
        // get movie
        const movie = await db.findMovieByID(id);
        // delete old cover image
        fs.unlink(movie.coverImgPath)
          .then(() => {
            console.log("Old cover photo deleted");
          })
          .catch((err) => {
            console.log(`Error removing old cover image: ${err}`);
            res
              .status(500)
              .json({
                message: `Error while deleting old cover image: ${err}`,
              });
          });
      } catch (err) {
        res
          .status(500)
          .json({ message: `Error while deleting old cover image: ${err}` });
      }
      // modify the movie's cover image
      db.editMovieCover(id, photo.filename, photo.path)
        .then((row) =>
          row
            ? res.sendStatus(204)
            : res
                .status(404)
                .json({ message: `Movie with the ${id} not found` })
        )
        .catch((err) =>
          res
            .status(500)
            .json({ message: `Error while uploading photo: ${err}` })
        );
    } else {
      res
        .status(400)
        .json({ message: `Invalid input: ${validationResult.message}` });
    }
  }
);

export default moviesApiRouter;
