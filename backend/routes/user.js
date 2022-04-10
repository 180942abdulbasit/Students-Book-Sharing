const express = require('express')
const router = express.Router()
const { userById, read, update, listAllUsers, deleteUser, changePassword } = require('../controllers/user')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userProfileUpdateValidator, passwordValidator } = require('../validator')

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  })
})
router.get('/user/:userId', read)
router.put('/user/:userId', requireSignin, isAuth, userProfileUpdateValidator, update)
router.get('/view/allUsers', listAllUsers)
router.delete('/user/:userId', requireSignin, deleteUser)
router.put('/user/:userId/changePassword', requireSignin, isAuth, passwordValidator, changePassword)

router.param('userId', userById) //looks for ":userId" in param of route

module.exports = router
