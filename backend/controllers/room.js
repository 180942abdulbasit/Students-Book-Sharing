const Room = require('../models/chat/room')
const Message = require('../models/chat/message')
const User = require('../models/user')
const mongoose = require('mongoose')

const getCurrentUsersRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).populate(['firstMember', 'secondMember'])
    res.status(200).json({ data: rooms })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}

const getRoomMessages = async (req, res) => {
  try {
    const { id } = req.params
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(id)
      return res.status(400).json({ error: 'Invalid room ids.' })
    }

    //get messages by room
    const messages = await Message.find({ room: id }).populate('sender').sort({ createdAt: 1 })
    //get room
    const room = await Room.findById(id)
    res.status(200).json({ data: { messages, room } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}

const createOrGetRoom = async (req, res) => {
  try {
    //get data from request
    const { firstMember, secondMember } = req.body
    //validate Data
    if (!firstMember || !secondMember) {
      return res.status(400).json({ error: 'User ids are required.' })
    }
    if (!mongoose.Types.ObjectId.isValid(firstMember) || !mongoose.Types.ObjectId.isValid(secondMember)) {
      return res.status(400).json({ error: 'Invalid user id.' })
    }
    let room = await Room.findOne({
      $or: [
        { firstMember: firstMember, secondMember: secondMember },
        { firstMember: secondMember, secondMember: firstMember },
      ],
    })

    if (!room) {
      room = await Room.create({ firstMember, secondMember })
    }
    room = await Room.findById(room._id).populate(['firstMember', 'secondMember'])
    res.status(200).json({ room })
  } catch (error) {
    console.log(error)
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    return res.status(200).json({ data: users })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getCurrentUsersRooms, getRoomMessages, createOrGetRoom, getUsers }
