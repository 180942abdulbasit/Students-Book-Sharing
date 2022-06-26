const Review = require('../models/review')
const Product = require('../models/product')

const createReview = async (req, res) => {
  const { product: productId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })

  if (!isValidProduct) {
    return res.status(400).json({ error: 'Invalid product id.' })
  }
  const review = await Review.create(req.body)
  res.status(200).json({ review })
}
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  })

  res.status(200).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    return res.status(400).json({ error: 'No review found with given id.' })
  }

  res.status(200).json({ review })
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    return res.status(400).json({ error: 'No review found with given id.' })
  }
  review.rating = rating
  review.title = title
  review.comment = comment

  await review.save()
  res.status(200).json({ review })
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    return res.status(400).json({ error: 'No review found with given id.' })
  }
  await review.remove()
  res.status(200).json({ msg: 'Success! Review removed' })
}

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId }).populate(['user'])
  res.status(200).json({ reviews, count: reviews.length })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
}
