import express from 'express';
import db from '../db/movies.js';
import authorize from '../middleware/authorization.js';

const userReviewsRouter = express.Router();

userReviewsRouter.get('/', authorize(), async (req, res) => {
  try {
    const user = await db.findUserByName(req.session.user);
    const reviews = await db.findUserReviews(user.ID);
    console.log('Found all reviews of the logged in user!');
    res.render('userReviews', { page: 'userReviews', reviews, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.log(`Error while finding reviews for user: ${err}`);
    res.render('error', { message: err });
  }
});

export default userReviewsRouter;
