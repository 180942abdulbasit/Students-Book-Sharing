const express = require('express')
const router = express.Router()
const {
  create,
  categoryById,
  read,
  update,
  remove,
  list,
} = require('../controllers/category')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require('../controllers/user')
const { createCategoryValidator } = require('../validator/index')

router.post(
  '/category/create/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  createCategoryValidator,
  create
)
router.get('/category/:categoryId', read)
router.put(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
)
router.delete(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
)
router.get('/categories', list)

router.param('categoryId', categoryById)
router.param('userId', userById) //looks for ":userId" in param of route
module.exports = router
