import mysql from "mysql2/promise.js";

// class for data access
export class MoviesDB {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      database: "movie_collection",
      host: "localhost",
      port: 3306,
      user: "webuser",
      password: "webprog44",
    });
  }

  // creates database tables
  async createTables() {
    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS movies(
          ID INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255),
          description VARCHAR(255),
          genre VARCHAR(255),
          year INT,
          coverImg VARCHAR(255),
          coverImgPath VARCHAR(255)
      );`
    );

    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS users(
          ID INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255),
          password VARCHAR(255),
          role VARCHAR(255)
      );`
    );

    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS reviews(
          ID INT AUTO_INCREMENT PRIMARY KEY,
          movieID INT,
          userID INT,
          points INT,
          review VARCHAR(255),
          status VARCHAR(255),
          FOREIGN KEY (movieID) REFERENCES movies(ID),
          FOREIGN KEY (userID) REFERENCES users(ID)
      );`
    );
  }

  // Actions related to the table storing movies

  // inserts a new movie
  async insertMovie(movie) {
    try {
      const query =
        "INSERT INTO movies(title, description, genre, year, coverImg, coverImgPath) VALUES (?, ?, ?, ?, ?, ?)";
      await this.pool.query(query, [
        movie.title,
        movie.description,
        movie.genre,
        movie.year,
        movie.coverPhoto,
        movie.coverPhotoPath,
      ]);
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds a movie by given ID
  async findMovieByID(id) {
    try {
      const query = "SELECT * FROM movies WHERE ID = ?";
      const res = await this.pool.query(query, [id]);
      return res[0][0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds all movies
  async findAllMovies() {
    try {
      const query = "SELECT * FROM movies";
      const res = await this.pool.query(query);
      return res[0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds all movies that match the search filters
  async findByFilters(filter) {
    try {
      const parameters = [];
      const queryParts = [];
      const query = "SELECT * FROM movies";

      // construct the query string by the given filters
      if (filter.title) {
        parameters.push(filter.title);
        queryParts.push("title LIKE CONCAT('%', ?, '%')");
      }
      if (filter.genre) {
        parameters.push(filter.genre);
        queryParts.push("genre LIKE CONCAT('%', ?, '%')");
      }
      if (filter.minyear) {
        parameters.push(filter.minyear);
        queryParts.push("year >= ?");
      }
      if (filter.maxyear) {
        parameters.push(filter.maxyear);
        queryParts.push("year <= ?");
      }

      let res;
      // if there's at least one filter we join the query parts with the AND separator
      if (queryParts.length > 0) {
        const queryBody = queryParts.join(" AND ");
        const finalQuery = `${query} WHERE ${queryBody}`;
        res = await this.pool.query(finalQuery, parameters);
        // otherwise we select all the movies
      } else {
        res = await this.pool.query(query);
      }
      return res[0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds genre and description by given movie ID
  async findDetailsByMovieID(id) {
    try {
      const query = "SELECT genre, description FROM movies WHERE ID= ?";
      const res = await this.pool.query(query, [id]);
      return res[0][0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // modifies movie, except the cover image
  async editMovie(id, newMovie) {
    try {
      const query =
        "UPDATE movies SET title = ?, year= ?, genre = ?, description = ? WHERE ID = ?";
      const res = await this.pool.query(query, [
        newMovie.title,
        newMovie.year,
        newMovie.genre,
        newMovie.description,
        id,
      ]);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // modifies the cover image of a movie
  async editMovieCover(id, file, filePath) {
    try {
      const query =
        "UPDATE movies SET coverImg = ?, coverImgPath = ? WHERE ID = ?";
      const res = await this.pool.query(query, [file, filePath, id]);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // deletes a movie
  async deleteMovieById(id) {
    try {
      // first we delete the reviews related to the movie
      const query1 = "DELETE FROM reviews WHERE movieID = ?";
      const query2 = "DELETE FROM movies WHERE ID= ?";
      const res = await Promise.all([
        this.pool.query(query1, [id]),
        this.pool.query(query2, [id]),
      ]);
      return res;
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // Actions related to the reviews table

  // inserts a new review
  async insertReview(review) {
    try {
      const query =
        "INSERT INTO reviews(movieID, userID, points, review, status) VALUES (?, ?, ?, ?, ?)";
      await this.pool.query(query, [
        review.movieID,
        review.userID,
        review.points,
        review.description,
        "pending",
      ]);
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds the accepted reviews of a movie
  async findMovieReviews(id) {
    try {
      const query = "SELECT * FROM reviews WHERE movieID = ? AND status = ?";
      const res = await this.pool.query(query, [id, "accepted"]);
      return res[0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds all reviews with the usernames and the movie titles
  async findAllReviews() {
    try {
      const query =
        "SELECT U.username as user, M.title as movie, R.points as points, R.review as review, R.ID as ID, R.status as status FROM reviews R, movies M, users U WHERE R.movieID = M.ID AND R.userID = U.ID ORDER BY CASE WHEN status = ? THEN 0 ELSE 1 END";
      const res = await this.pool.query(query, ["pending"]);
      return res[0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds a user's reviews together with the movie titles
  async findUserReviews(id) {
    try {
      const query =
        "SELECT R.ID, R.points, R.status, R.review, M.title FROM reviews R, movies M WHERE R.movieID = M.ID AND R.userID = ?";
      const res = await this.pool.query(query, [id]);
      return res[0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // deletes review by given ID
  async deleteReviewByID(id) {
    try {
      const query = "DELETE FROM reviews WHERE ID= ?";
      const res = await this.pool.query(query, [id]);
      return res;
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds review with the given ID
  async findUserByReview(id) {
    try {
      const query = "SELECT userID FROM reviews WHERE ID = ?";
      const res = await this.pool.query(query, [id]);
      return res[0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // retrieves the number of reviews and average points of a movie
  async getReviewNumberAndAverage(id) {
    try {
      const query =
        "SELECT COUNT(ID) AS numOfReviews, ROUND(AVG(points), 1) AS avgPoints FROM reviews WHERE movieID = ? AND status = ?";
      const res = await this.pool.query(query, [id, "accepted"]);
      return res[0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // changes the status of a review
  async changeReviewStatus(id, status) {
    try {
      const query = "UPDATE reviews SET status = ? WHERE ID = ?";
      const res = await this.pool.query(query, [status, id]);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // modifies a review
  async editReview(id, points, review) {
    try {
      const query =
        "UPDATE reviews SET points = ?, review = ?, status = ? WHERE ID = ?";
      const res = await this.pool.query(query, [points, review, "pending", id]);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // Actions with the users table

  // inserts a new user
  async insertUser(user) {
    try {
      const query =
        "INSERT INTO users(username, password, role) VALUES (?, ?, ?)";
      await this.pool.query(query, [user.username, user.password, "user"]);
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds all users
  async findAllUsers() {
    try {
      const query = "SELECT * FROM users";
      const res = await this.pool.query(query);
      return res[0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds a user by username
  async findUserByName(username) {
    try {
      const query = "SELECT * FROM users WHERE username= ?";
      const res = await this.pool.query(query, [username]);
      return res[0][0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds user/users by partial or full username
  async findUserByFilter(username) {
    try {
      const query =
        "SELECT * FROM users WHERE username LIKE CONCAT('%', ?, '%')";
      const res = await this.pool.query(query, [username]);
      return res[0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // finds user by given ID
  async findUserByID(id) {
    try {
      const query = "SELECT * FROM users WHERE ID= ?";
      const res = await this.pool.query(query, [id]);
      return res[0][0];
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  // deletes user by given ID
  async deleteUser(id) {
    try {
      const query1 = "DELETE FROM users WHERE ID = ?";
      return await this.pool.query(query1, [id]);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // changes the role of the user
  async changeUserRole(id, role) {
    try {
      const query = "UPDATE users SET role = ? WHERE ID = ?";
      const res = await this.pool.query(query, [role, id]);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // changes the password of a user
  async changeUserPasswd(id, passwd) {
    try {
      const query = "UPDATE users SET password = ? WHERE ID = ?";
      const res = await this.pool.query(query, [passwd, id]);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

const db = new MoviesDB();

// creating tables
try {
  await db.createTables();
  console.log("Tables created successfully!");
} catch (err) {
  console.log(`Error: ${err}`);
}

export default db;
