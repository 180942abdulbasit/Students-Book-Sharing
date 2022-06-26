const User = require('../models/user')
const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      })
    }
    req.profile = user
    let sum = user.reply_time.reduce((a, b) => a + b, 0)
    let avg = sum / user.reply_time.length || 0
    req.profile.avg_reply_time = avg | 0
    req.profile.reply_time = undefined
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    next()
  })
}

exports.read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

exports.update = (req, res) => {
  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: 'User not found',
      })
    }
    user.name = req.body.name
    user.email = req.body.email
    user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
      user.salt = undefined
      user.hashed_password = undefined
      res.json({
        user,
      })
    })
  })
}

exports.listAllUsers = (req, res) => {
  User.find()
    .select('name')
    .select('email')
    .select('role')
    .select('status')
    .lean()
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: 'Users not found',
        })
      }
      users.forEach((user, i) => {
        Product.find({ createdBy: user._id })
          .select('-photo')
          .exec((err, data) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              })
            }
            users[i].productsCount = data.length
          })
      })
      setTimeout(() => res.json(users), 100)
    })
}

exports.deleteUser = (req, res) => {
  User.findOneAndDelete({ _id: req.params.userId }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: 'Not authorized to perform this action',
      })
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  })
  Product.deleteMany({ createdBy: req.params.userId }, {}, (err, P) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
  })
}

exports.blockUser = (req, res) => {
  //
  let userStatus
  let u
  User.findOne({ _id: req.params.userId }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not exists.',
      })
    }
    userStatus = user.status
    if (userStatus == 1) {
      user.status = 0
      userStatus = 0
    } else {
      user.status = 1
      userStatus = 1
    }
    user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
      Product.updateMany({ createdBy: req.params.userId }, { status: userStatus }, (err, p) => {
        if (err) {
          return res.status(400).json({ error: errorHandler(err) })
        }
      })
      res.json(user)
    })
  })
}

exports.changePassword = (req, res) => {
  User.findOne({ _id: req.body._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not exists.',
      })
    }
    if (!user.authenticate(req.body.oldPassword)) {
      return res.status(401).json({
        error: 'Wrong Password.',
      })
    }
    user.password = req.body.newPassword
    user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
      user.salt = undefined
      user.hashed_password = undefined
      res.json({
        user,
      })
    })
  })
}
