import express from "express";
import multer from "multer";
import db from "../db/movies.js";
import authorize from "../middleware/authorization.js";

import { validateReviewInputs } from "./validatorFunctions/validators.js";

const reviewsApiRouter = express.Router();
const upload = multer();

// asynchronous call to delete review
reviewsApiRouter.delete("/:id", authorize(), async (req, res) => {
  const { id } = req.params;
  const username = req.session.user;

  const user = await db.findUserByName(username);
  const [{ userID }] = await db.findUserByReview(id);

  if (user.ID !== userID) {
    res.status(400).json({ message: "You cannot delete this review!" });
  } else {
    db.deleteReviewByID(id)
      .then((row) =>
        row
          ? res.sendStatus(204)
          : res.status(404).json({ message: `Review with the ${id} not found` })
      )
      .catch((err) =>
        res.status(500).json({ message: `Error while deleting review: ${err}` })
      );
  }
});

// asynchronous call to accept review
reviewsApiRouter.put("/:id/accept", authorize(["admin"]), async (req, res) => {
  const { id } = req.params;
  const username = req.session.user;
  const user = await db.findUserByName(username);
  const [{ userID }] = await db.findUserByReview(id);

  if (user.ID === userID) {
    res.status(400).json({ message: "You cannot accept your own review!" });
  } else {
    db.changeReviewStatus(id, "accepted")
      .then((row) =>
        row
          ? res.sendStatus(204)
          : res.status(404).json({ message: `Review with the ${id} not found` })
      )
      .catch((err) =>
        res
          .status(500)
          .json({ message: `Error while accepting review: ${err}` })
      );
  }
});

// asynchronous call to reject review
reviewsApiRouter.put("/:id/reject", authorize(["admin"]), async (req, res) => {
  const { id } = req.params;
  const username = req.session.user;
  const user = await db.findUserByName(username);
  const [{ userID }] = await db.findUserByReview(id);
  if (user.ID === userID) {
    res.status(400).json({ message: "You cannot reject your own review!" });
  } else {
    db.changeReviewStatus(id, "rejected")
      .then((row) =>
        row
          ? res.sendStatus(204)
          : res.status(404).json({ message: `Review with the ${id} not found` })
      )
      .catch((err) =>
        res
          .status(500)
          .json({ message: `Error while rejecting review: ${err}` })
      );
  }
});

// asynchronous call to modify review
reviewsApiRouter.put("/:id", upload.none(), authorize(), async (req, res) => {
  const { id } = req.params;
  const username = req.session.user;
  const newPoints = req.body.points;
  const newReview = req.body.review;
  const user = await db.findUserByName(username);
  const [{ userID }] = await db.findUserByReview(id);

  if (user.ID !== userID) {
    res.status(400).json({ message: "You cannot edit this review!" });
  } else {
    const validationResult = validateReviewInputs(newPoints, newReview);
    if (validationResult.valid) {
      db.editReview(id, parseInt(newPoints, 10), newReview)
        .then((row) =>
          row
            ? res.sendStatus(204)
            : res
                .status(404)
                .json({ message: `Review with the ${id} not found` })
        )
        .catch((err) =>
          res
            .status(500)
            .json({ message: `Error while editing review: ${err}` })
        );
    } else {
      res
        .status(400)
        .json({ message: `Invalid input: ${validationResult.message}` });
    }
  }
});

export default reviewsApiRouter;
