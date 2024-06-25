import express from "express";
import session from "express-session";
import path from "path";
import moviesRoutes from "./routes/movies.js";
import addMovieRouter from "./routes/addNewMovie.js";
import movieDetailsRouter from "./routes/movieDetails.js";
import loginRouter from "./routes/login.js";
import logoutRouter from "./routes/logout.js";
import handleNotFound from "./middleware/error.js";
import signupRouter from "./routes/signup.js";
import reviewRouter from "./routes/reviews.js";
import usersRouter from "./routes/users.js";
import userReviewsRouter from "./routes/userReviews.js";
import passwdChangeRouter from "./routes/passwordChange.js";
import moviesManageRouter from "./routes/manageMovies.js";
import moviesApiRouter from "./routes/moviesApi.js";
import reviewsApiRouter from "./routes/reviewsApi.js";
import usersApiRouter from "./routes/usersApi.js";

const app = express();

// static folder for client side js and uploaded images
app.use(express.static(path.join(process.cwd(), "public")));

// express session
app.use(
  session({
    secret: "!j^ic&3usp3tamxkoh3eox(c1--=ul6k7+psp_6o(!x_m!*+lk",
    resave: false,
    saveUninitialized: true,
  })
);

// set the ejs engine and folder
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use("/dist", express.static("./node_modules/bootstrap/dist"));
app.use("/icons", express.static("./node_modules/bootstrap-icons/font"));

// routes
app.use("/", moviesRoutes);
app.use("/add", addMovieRouter);
app.use("/details", movieDetailsRouter);
app.use("/movies", moviesApiRouter);
app.use("/reviews", reviewsApiRouter);
app.use("/users", usersApiRouter);
app.use("/authentication", loginRouter);
app.use("/logout", logoutRouter);
app.use("/registration", signupRouter);
app.use("/manageReviews", reviewRouter);
app.use("/manageUsers", usersRouter);
app.use("/myReviews", userReviewsRouter);
app.use("/userProfileAction", passwdChangeRouter);
app.use("/manageMovies", moviesManageRouter);
app.use(handleNotFound);

app.listen(8080, () => {
  console.log("Server listening on http://localhost:8080/ ...");
});
