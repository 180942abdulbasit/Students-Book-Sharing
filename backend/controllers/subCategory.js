const { errorHandler } = require('../helpers/dbErrorHandler')
const SubCategory = require('../models/subCategory')

exports.subCategoryById = (req, res, next, id) => {
  SubCategory.findById(id)
    .populate('category')
    .exec((err, subCategory) => {
      if (err || !subCategory) {
        return res.status(400).json({
          error: 'Sub-Category not exists',
        })
      }
      req.subCategory = subCategory
      next()
    })
}
exports.create = (req, res) => {
  const subCategory = new SubCategory(req.body)
  subCategory.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      })
    } else {
      res.json({ data })
    }
  })
}

exports.read = (req, res) => {
  return res.json(req.subCategory)
}

exports.update = (req, res) => {
  const subCategory = req.subCategory
  subCategory.name = req.body.name
  subCategory.category = req.body.category
  subCategory.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
    res.json(data)
  })
}

exports.remove = (req, res) => {
  const subCategory = req.subCategory
  subCategory.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
    res.json({
      message: 'subCategory deleted',
    })
  })
}

exports.list = (req, res) => {
  SubCategory.find()
    .populate('category')
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        })
      }
      res.json(data)
    })
}

exports.listSubCategories = (req, res) => {
  const category = req.category
  SubCategory.find({ category: category })
    .populate('category')
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        })
      }
      res.json(data)
    })
}
