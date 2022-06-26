const express = require("express")
const router = express.Router()

const {getCurrentUsersRooms, getRoomMessages, createOrGetRoom, getUsers} = require("../controllers/room.js")
router.get('/user-rooms', getCurrentUsersRooms)
router.post('/', createOrGetRoom)
router.get('/users', getUsers)
//Req params Routes must be at the End
router.get('/:id', getRoomMessages)
module.exports = router