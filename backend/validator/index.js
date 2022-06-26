const formidable = require('formidable')

exports.userSignupValidator = (req, res, next) => {
  req.check('name', 'Name is required').notEmpty()
  req
    .check('email', 'Email is required')
    .notEmpty()
    .matches(/.+\@.+\..+/)
    .withMessage('Email format is wrong')
  req
    .check('password', 'Password is required')
    .notEmpty()
    .isLength({
      min: 6,
    })
    .withMessage('Password must contain atleast 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a Number')

  const errors = req.validationErrors() //grab all errors
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0] //const firstError = errors.map (error => error.msg)[0]
    return res.status(400).json({ error: firstError })
  }
  next() //continue to next phase even if there are errors otherwise application will fail
}

exports.passwordValidator = (req, res, next) => {
  req
    .check('newPassword', 'Password is required')
    .notEmpty()
    .isLength({
      min: 6,
    })
    .withMessage('Password must contain atleast 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a Number')

  const errors = req.validationErrors() //grab all errors
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0] //const firstError = errors.map (error => error.msg)[0]
    return res.status(400).json({ error: firstError })
  }
  next() //continue to next phase even if there are errors otherwise application will fail
}

exports.userProfileUpdateValidator = (req, res, next) => {
  if (req.body.email) {
    req
      .check('email', 'Email is required')
      .notEmpty()
      .matches(/.+\@.+\..+/)
      .withMessage('Email format is wrong')
  }

  const errors = req.validationErrors() //grab all errors
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0] //const firstError = errors.map (error => error.msg)[0]
    return res.status(400).json({ error: firstError })
  }
  next() //continue to next phase even if there are errors otherwise application will fail
}
///////
exports.createCategoryValidator = (req, res, next) => {
  req
    .check('name', 'Name is required')
    .notEmpty()
    .isLength({
      min: 3,
      max: 32,
    })
    .withMessage('Name of Category should be between 3 and 32 charaters long')
    .matches(/^[a-zA-Z]/)
    .withMessage('First character should not be a character')

  const errors = req.validationErrors() //grab all errors
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0] //const firstError = errors.map (error => error.msg)[0]
    return res.status(400).json({ error: firstError })
  }
  next() //continue to next phase even if there are errors otherwise application will fail
}

exports.createSubCategoryValidator = (req, res, next) => {
  req
    .check('name', 'Name is required')
    .notEmpty()
    .isLength({
      min: 3,
      max: 32,
    })
    .withMessage('Name of Category should be between 3 and 32 charaters long')
    .matches(/^[a-zA-Z]/)
    .withMessage('First character should not be a character')

  req.check('category', 'Category is required').notEmpty().withMessage('Category is required')

  const errors = req.validationErrors() //grab all errors
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0] //const firstError = errors.map (error => error.msg)[0]
    return res.status(400).json({ error: firstError })
  }
  next() //continue to next phase even if there are errors otherwise application will fail
}

exports.createProductValidator = (req, res, next) => {
  next() //continue to next phase even if there are errors otherwise application will fail
}
