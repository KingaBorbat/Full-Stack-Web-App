import express from "express";
import db from "../db/movies.js";
import authorize from "../middleware/authorization.js";

const usersApiRouter = express.Router();

// asynchronous call to give admin role to a user
usersApiRouter.put("/:id/admin", authorize(["admin"]), (req, res) => {
  const { id } = req.params;
  db.changeUserRole(id, "admin")
    .then((row) =>
      row
        ? res.sendStatus(204)
        : res.status(404).json({ message: `User with the ID ${id} not found` })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ message: `Error while giving admin role to user: ${err}` })
    );
});

// asynchronous call to remove admin role from an user
usersApiRouter.put("/:id/user", authorize(["admin"]), (req, res) => {
  const { id } = req.params;
  db.changeUserRole(id, "user")
    .then((row) =>
      row
        ? res.sendStatus(204)
        : res.status(404).json({ message: `User with the ID ${id} not found` })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ message: `Error while removing admin role from user: ${err}` })
    );
});

export default usersApiRouter;
