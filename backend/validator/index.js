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
  // let form = new formidable.IncomingForm()
  //  form.keepExtensions = true
  //  form.parse(req, (error, fields, files) => {
  //      if(error) {
  //          return res.status(400).json({
  //              error: 'Image upload error'
  //          })
  //      }
  //      const {name, description, price, category} = fields
  //      //console.log('name:', name, 'price:', price, )
  //      if(!name || !description || !price || !category ) {
  //         return res.status(400).json({
  //             error: 'All fields are required'
  //         })
  //      }
  //      console.log(fields)
  //      fields.check('name', 'Name is Required').notEmpty()
  //      let product = new Product(fields)
  //      if(files.photo) {
  //         if(files.photo.size > 1000000){ //1 mb
  //             return res.status(400).json({
  //                 error: 'Image should be less than 1MB'
  //             })
  //         }
  //          //product.photo.data = fs.readFileSync(files.photo.filepath)
  //          //product.photo.contentType = files.photo.mimetype
  //      }

  //  })

  // req.check('name', 'Name is required').notEmpty()
  // .isLength({
  //     min: 3,
  //     max: 64
  // })
  // .withMessage('Name should be between 3 and 64 characters long')
  // req.check('description', 'Description is required').notEmpty()
  // .isLength({
  //     min: 3,
  //     max: 1000
  // })
  // .withMessage('Add a little description')
  // req.check('price', 'Enter price').notEmpty()
  // .matches('^[0-9]*$')
  // .withMessage('Enter a number for price')

  // const errors = req.validationErrors() //grab all errors
  // if (errors) {
  //     const firstError = errors.map (error => error.msg)[0] //const firstError = errors.map (error => error.msg)[0]
  //     return res.status(400).json({error: firstError})
  // }

  next() //continue to next phase even if there are errors otherwise application will fail
}
