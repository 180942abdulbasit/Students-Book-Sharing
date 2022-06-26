const formidable = require('formidable') //package to handle form data (form containing image upload)
const _ = require('lodash') //use in product update method
const fs = require('fs')
const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')
const user = require('../models/user')
const Report = require('../models/report')
const { search } = require('../routes/product')
const product = require('../models/product')

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .populate('subCategory')
    .populate('createdBy')
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: 'Product not found',
        })
      }
      req.product = product
      next()
    })
}

exports.read = (req, res) => {
  req.product.createdBy.hashed_password = undefined
  req.product.createdBy.salt = undefined
  req.product.photo = undefined //to avoid performance issues we are not sending photo to the frontend for now
  return res.json(req.product)
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: 'Image upload error',
      })
    }
    authors = []
    institutes = []
    Object.keys(fields).map((i, k) => {
      if (i.search('institutes') != -1) {
        institutes.push(fields[i])
      }
    })
    Object.keys(fields).map((i, k) => {
      if (i.search('authors') != -1) {
        authors.push(fields[i])
      }
    })
    fields.institutes = institutes
    fields.authors = authors
    fields.createdBy = req.profile._id
    const { name, description, price, category, subCategory } = fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        error: 'All fields are required',
      })
    }
    let product = new Product(fields)
    if (files.photo) {
      if (files.photo.size > 2000000) {
        //1 mb
        return res.status(400).json({
          error: 'Image should be less than 2MB',
        })
      }
      product.photo.data = fs.readFileSync(files.photo.filepath)
      product.photo.contentType = files.photo.mimetype
    }
    product.save((error, result) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
      res.json(result)
    })
  })
}

exports.addWishlist = (req, res) => {
  user.findById({ _id: req.body.user._id }, (err, user) => {
    if (err) {
      res.status(400).json({
        error: 'User not found',
      })
    }
    var index = user.wishlist.indexOf(req.body.productId)
    var message = ''
    if (index === -1) {
      user.wishlist.push(req.body.productId)
      message = 'added'
    } else {
      user.wishlist.splice(index, 1)
      message = 'removed'
    }
    user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
      res.json({
        message: message,
      })
    })
  })
}

exports.addReport = (req, res) => {
  Product.findById({ _id: req.body.productId }, (err, product) => {
    if (err) {
      res.status(400).json({
        error: 'Product not found',
      })
    }
    var message = ''
    var index = product.reportUsers.indexOf(req.body.user._id)
    if (index === -1) {
      product.reportUsers.push(req.body.user._id)
      message = 'added'
    } else {
      product.reportUsers.splice(index, 1)
      message = 'removed'
    }
    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
      res.json({
        message: message,
      })
    })
  })
}

exports.checkWishlist = (req, res) => {
  user.findById({ _id: req.body.user._id }, (err, user) => {
    if (err) {
      res.status(400).json({
        error: 'User not found',
      })
    }
    var index = user.wishlist.indexOf(req.body.productId)

    if (index === -1) {
      res.json({
        message: 'no',
      })
    } else {
      res.json({
        message: 'yes',
      })
    }
  })
  //
}

exports.checkReport = (req, res) => {
  Product.findById({ _id: req.body.productId }, (err, product) => {
    if (err) {
      res.status(400).json({
        error: 'Product not found',
      })
    }
    var index = product.reportUsers.indexOf(req.body.user._id)

    if (index === -1) {
      res.json({
        message: 'no',
      })
    } else {
      res.json({
        message: 'yes',
      })
    }
  })
}

exports.update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: 'Image upload error',
      })
    }
    authors = []
    institutes = []
    Object.keys(fields).map((i, k) => {
      if (i.search('institutes') != -1) {
        institutes.push(fields[i])
      }
    })
    Object.keys(fields).map((i, k) => {
      if (i.search('authors') != -1) {
        authors.push(fields[i])
      }
    })
    fields.institutes = institutes
    fields.authors = authors
    fields.createdBy = req.profile._id
    const { name, description, price, category, subCategory } = fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        error: 'All fields are required',
      })
    }

    let newProduct = new Product(fields)
    if (files.photo) {
      if (files.photo.size > 2000000) {
        //1 mb
        return res.status(400).json({
          error: 'Image should be less than 2MB',
        })
      }
      newProduct.photo.data = fs.readFileSync(files.photo.filepath)
      newProduct.photo.contentType = files.photo.mimetype
    }

    Product.findOne({ _id: req.product._id }, (err, product) => {
      if (err) {
        return res.status(400).json({
          error: 'Product not found',
        })
      }
      product.name = newProduct.name
      product.price = newProduct.price
      product.description = newProduct.description
      product.category = newProduct.category
      product.subCategory = newProduct.subCategory
      product.institutes = newProduct.institutes
      product.authors = newProduct.authors
      product.save((error, product) => {
        if (error) {
          return res.status(400).json({
            error: errorHandler(error),
          })
        }
        res.json({
          product,
        })
      })
    })
  })
}

exports.remove = (req, res) => {
  let product = req.product
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
    res.json({
      message: 'Product deleted Successfully',
    })
  })
}

exports.changeStatus = (req, res) => {
  Product.findOne({ _id: req.product._id }, (err, product) => {
    if (err) {
      return res.status(400).json({
        error: 'Product not found',
      })
    }
    if (product.status === 1) {
      product.status = 0
    } else if (product.status === 0) {
      product.status = 1
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
      res.json({
        product,
      })
    })
  })
}

exports.removeUserProducts = (req, res) => {
  Product.deleteMany({ createdBy: req.params.userId }, {}, (err, P) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
    res.json({
      message: 'Products deleted Successfully',
    })
  })
}

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc'
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
  let limit = req.query.limit ? parseInt(req.query.limit) : 10
  Product.find({ status: 1 })
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        })
      }
      res.json(products)
    })
}

exports.listAllProducts = (req, res) => {
  Product.find()
    .select('-photo')
    .populate('category')
    .populate('createdBy')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        })
      }
      res.json(products)
    })
}

exports.listRelated = (req, res) => {
  //based on related category
  let limit = req.query.limit ? parseInt(req.query.limit) : 10
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .select('-photo')
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        })
      }
      res.json(products)
    })
}

exports.listCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: 'Categories not found',
      })
    }
    res.json(categories)
  })
}

exports.listBySearch = (req, res) => {
  var arr1 = []
  var arr2 = []
  let order = req.body.order ? req.body.order : 'desc'
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
  let limit = req.body.limit ? parseInt(req.body.limit) : 100
  let skip = parseInt(req.body.skip) || 0
  let findArgs = { status: 1 }

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        }
      } else {
        findArgs[key] = req.body.filters[key]
      }
    }
  }

  const query = {}
  if (req.body.search) {
    query.name = { $regex: req.body.search, $options: 'i' } //i means case insensitive
    query.authors = { $regex: req.body.search, $options: 'i' }
    query.institutes = { $regex: req.body.search, $options: 'i' }
  }
  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        })
      }
      Product.find(
        {
          $or: query.name ? [{ name: query.name }, { authors: query.authors }, { institutes: query.institutes }] : [{}],
        },
        (err, products) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            })
          }
          res.json(data.filter((a) => products.some((b) => a.name === b.name)))
        }
      )
        .select('-photo')
        .populate('category')
    })
}

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType)
    return res.send(req.product.photo.data)
  } else {
    return res.sendFile(__dirname + '/no-image.png')
  }
  next()
}

exports.listSearch = (req, res) => {
  const query = {}
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' } //i means case insensitive
    query.authors = { $regex: req.query.search, $options: 'i' }
    query.institutes = { $regex: req.query.search, $options: 'i' }
  }
  if (req.query.category != 'All' && req.query.category != undefined) {
    query.category = req.query.category
  } else {
    query.category = ''
  }
  Product.find(
    {
      $or: query.name ? [{ name: query.name }, { authors: query.authors }, { institutes: query.institutes }] : [{}],
      $and: query.category ? [{ category: query.category }, { status: 1 }] : [{ status: 1 }],
      $and: query.subCategory ? [{ subCategory: query.subCategory }, { status: 1 }] : [{ status: 1 }],
    },
    (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        })
      }
      res.json(products)
    }
  ).select('-photo')
}

exports.listInstitutes = (req, res) => {
  Product.find({ institutes: { $exists: true, $not: { $size: 0 } } })
    .select('institutes')
    .distinct('institutes')
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        })
      }
      res.json(data)
    })
}

exports.listAuthors = (req, res) => {
  Product.find({ authors: { $exists: true, $not: { $size: 0 } } })
    .select('authors')
    .distinct('authors')
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        })
      }
      res.json(data)
    })
}

exports.userProducts = (req, res) => {
  Product.find({ createdBy: req.params.userId })
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

exports.listProductsByCategory = (req, res) => {
  Product.find({ category: req.params.categoryId, status: 1 })
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

exports.listProductsBySubCategory = (req, res) => {
  Product.find({ subCategory: req.params.subCategoryId, status: 1 })
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

exports.wishlistProducts = (req, res) => {
  console.log(req.params.userId)
  var arr = []
  user.findById({ _id: req.params.userId }, (err, user) => {
    if (err) {
      res.status(400).json({
        error: 'User not found',
      })
    }
    arr = user.wishlist
    console.log(arr)
    //res.json({ arr })
    Product.find({ _id: { $in: arr }, status: 1 })
      .populate('category')
      .exec((err, data) => {
        console.log(data.length)
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          })
        }
        res.json(data)
      })
  })
}
