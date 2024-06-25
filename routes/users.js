import express from "express";
import db from "../db/movies.js";
import authorize from "../middleware/authorization.js";

const usersRouter = express.Router();

// get user management page
usersRouter.get("/", authorize(["admin"]), async (req, res) => {
  try {
    const users = await db.findAllUsers();
    console.log("Found all users for admin!");
    res.status(200).render("users", { page: "users", users });
  } catch (err) {
    console.log(`Error while finding users for admin: ${err}`);
    res.status(500).render("error", { message: err });
  }
});

// searching users
usersRouter.get("/search", authorize(["admin"]), async (req, res) => {
  try {
    const { username } = req.query;
    const users = await db.findUserByFilter(username);
    console.log("Found users by username for amdin!");
    res.status(200).render("users", { page: "users", users });
  } catch (err) {
    console.log(`Error while searching for users: ${err}`);
    res.status(500).render("error", { message: err });
  }
});

export default usersRouter;
