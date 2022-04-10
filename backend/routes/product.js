const express = require('express')
const router = express.Router()
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  listSearch,
  photo,
  listInstitutes,
  listAuthors,
  userProducts,
  listAllProducts,
  removeUserProducts,
  changeStatus,
  listProductsByCategory,
  listProductsBySubCategory,
} = require('../controllers/product')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require('../controllers/user')
const { createProductValidator } = require('../validator/index')

router.get('/product/:productId', read)
router.post('/product/create/:userId', requireSignin, isAuth, create)
router.delete('/product/:productId/:userId', requireSignin, isAuth, remove)
router.delete('/products/:userId', requireSignin, isAuth, removeUserProducts)
router.put('/product/:productId/:userId', requireSignin, isAuth, update)
router.put('/product/status/:productId/:userId', requireSignin, isAuth, changeStatus)
router.get('/products', list)
router.get('/products/related/:productId', listRelated)
router.get('/products/categories', listCategories)
router.post('/products/by/search', listBySearch)
router.get('/products/search', listSearch)
router.get('/product/photo/:productId', photo)
router.get('/products/institutes', listInstitutes)
router.get('/products/authors', listAuthors)
router.get('/products/:userId', userProducts)
router.get('/view/allProducts', listAllProducts)
router.get('/products/by/category/:categoryId', listProductsByCategory)
router.get('/products/by/subCategory/:subCategoryId', listProductsBySubCategory)

router.param('userId', userById) //looks for ":userId" in param of route
router.param('productId', productById) //looks for ":userId" in param of route

//
//router.use(express.static(__dirname+"./public/"))
//
module.exports = router
