const express = require('express')
const router = express.Router()
const {
  create,
  subCategoryById,
  read,
  update,
  remove,
  list,
  listSubCategories,
} = require('../controllers/subCategory')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require('../controllers/user')
const { categoryById } = require('../controllers/category')
const { createSubCategoryValidator } = require('../validator/index')

router.post(
  '/subCategory/create/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  createSubCategoryValidator,
  create
)
router.get('/subCategory/:subCategoryId', read)
router.put(
  '/subCategory/:subCategoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
)
router.delete(
  '/subCategory/:subCategoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
)
router.get('/subCategories', list)
router.get('/subCategories/:categoryId', listSubCategories)

router.param('categoryId', categoryById)
router.param('subCategoryId', subCategoryById)
router.param('userId', userById) //looks for ":userId" in param of route

module.exports = router
