const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.signup = async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
      user.salt = undefined ///to hide it in response message
      user.hashed_password = undefined
      res.json({
        user,
      })
    })
  } catch (error) {
    console.log(error)
  }
}

exports.signin = (req, res) => {
  const { email, password } = req.body
  User.findOne({ email: { $regex: email, $options: 'i' } }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not exists.',
      })
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Wrong Password.',
      })
    }
    //
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    res.cookie('t', token, { expire: new Date() + 9999 })
    const { _id, name, email, role, status } = user
    return res.json({ token, user: { _id, email, name, role, status } })
  })
}

exports.signout = (req, res) => {
  res.clearCookie('t')
  res.json({ message: 'Signout successfully' })
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
})

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id
  if (!user) {
    return res.status(403).json({
      //403 = unauthorized error
      error: 'Access Denied',
    })
  }
  next()
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access Denied',
    })
  }
  next()
}
