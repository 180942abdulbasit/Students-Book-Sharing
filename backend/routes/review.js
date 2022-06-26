const express = require('express');
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
} = require('../controllers/review');

router.route('/').post(createReview).get(getAllReviews);

router.route('/product/:id').get(getSingleProductReviews)

router
  .route('/:id')
  .get(getSingleReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;